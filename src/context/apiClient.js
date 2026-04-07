import axios from "axios";
import { useAuthStore } from "./AuthContext";

let api = null;

export const initializeAPI = (baseURL) => {
  api = axios.create({
    baseURL,
    timeout: 10000,
  });

  // Request interceptor - attach access token
  api.interceptors.request.use(
    (config) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      config.headers["Content-Type"] = "application/json";
      config.headers["Accept"] = "application/json";
      console.log("API Request:", config.method.toUpperCase(), config.url);
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
      console.log("API Response Error:", error);
      // If 401 and not already retried
    //   if (error.response?.status === 401 && !originalRequest._retry) {
    //     originalRequest._retry = true;

    //     try {
    //       const state = useAuthStore.getState();
    //       const { refreshToken } = state;

    //       if (!refreshToken) {
    //         state.logout();
    //         return Promise.reject(error);
    //       }
    //       // TODO: fix api
    //       // Call refresh token endpoint
    //       const response = await axios.post(
    //         `${api.defaults.baseURL}/auth/refresh`,
    //         { refreshToken },
    //       );

    //       const { accessToken, refreshToken: newRefreshToken } = response.data;

    //       // Update store with new tokens
    //       await state.refreshAccessToken(async () => ({
    //         accessToken,
    //         refreshToken: newRefreshToken || refreshToken,
    //       }));

    //       // Retry original request
    //       originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    //       return api(originalRequest);
    //     } catch (refreshError) {
    //       useAuthStore.getState().logout();
    //       return Promise.reject(refreshError);
    //     }
    //   }
      return Promise.reject(error);
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
