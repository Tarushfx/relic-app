import axios from "axios";
import { useCustomAuthStore, isTokenExpired } from "./AuthContext";
import { REFRESH_URL } from "../secrets/routes";

let api = null;

export const initializeAPI = (baseURL) => {
	api = axios.create({
		baseURL,
		timeout: 10000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	// Request interceptor - attach access token
	api.interceptors.request.use(
		(config) => {
			const { accessToken } = useCustomAuthStore.getState();

			if (accessToken) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			console.log(
				"API Request:",
				config.method.toUpperCase(),
				config.url,
			);
			return config;
		},
		(error) => {
			console.log("API Request Error:", error);
			return Promise.reject(error);
		},
	);

	// Response interceptor - handle token refresh
	api.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;
			console.log("API Response Error:", error, originalRequest);
			// 1. Only intercept 401s that haven't been retried yet
			if (error.response?.status !== 401 || originalRequest._retry) {
				console.log("API rejected");
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				const state = useCustomAuthStore.getState();
				const { refreshToken, logout, refreshAccessToken } = state;
				// 2. Pre-check: If no refresh token, don't even bother the server
				console.log(
					refreshToken,
					"is expired",
					isTokenExpired(refreshToken),
				);

				if (!refreshToken || isTokenExpired(refreshToken)) {
					await logout();
					return Promise.reject(error);
				}

				// 3. The Handshake: Use 'refresh' for Django, not 'refreshToken'
				const response = await api.post(REFRESH_URL, {
					refresh: refreshToken,
				});
				console.log("Auth Refresh response", response);

				// 4. Extract tokens from your 'data.data' wrapper
				const tokenData = response.data?.data;
				if (!tokenData || !tokenData.access) {
					throw new Error("Invalid token response structure");
				}

				const { access: accessToken, refresh: newRefreshToken } =
					tokenData;

				// 5. Update the global store
				await refreshAccessToken(async () => ({
					accessToken,
					refreshToken: newRefreshToken || refreshToken,
				}));

				// 6. Final Step: Resend the original request with the fresh token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// This catch block handles cases where the refresh call itself fails (e.g., 400 Bad Request)
				console.log("Auth Refresh Flow Failed:", refreshError.message);

				await useCustomAuthStore.getState().logout();

				// Rejecting here ensures the original calling function (the Screen/Component)
				// knows the request ultimately failed.
				return Promise.reject(refreshError);
			}
		},
	);

	return api;
};

export const getAPI = () => {
	if (!api) {
		throw new Error("API not initialized. Call initializeAPI first.");
	}
	return api;
};
