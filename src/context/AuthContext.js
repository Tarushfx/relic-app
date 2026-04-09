import React, { createContext, useContext } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
// Token keys for storage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

// SecureStore options for iOS persistence
const SECURE_STORE_OPTIONS = {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

// Create Zustand store for auth state
export const useAuthStore = create((set, get) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,

    // Initialize auth state from storage
    initialize: async () => {
        const { isAuthenticated, isLoading } = get();
        if (isAuthenticated && !isLoading) return; // Already initialized

        try {
            // Small delay for iOS Keychain to initialize after a refresh
            
            const options = Platform.OS === "ios" ? SECURE_STORE_OPTIONS : {};
            const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY, options);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY, options);
            
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // const userStr = await SecureStore.getItemAsync(USER_KEY, options);
            const userStr = null;
            console.log(Platform.OS, "[Auth] Access Token exists:", !!accessToken); // Keep this log for debugging
            console.log(Platform.OS, "[Auth] Refresh Token exists:", !!refreshToken);
            // console.log(Platform.OS, "[Auth] User data exists:", !!userStr);

            let user = null;
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                } catch (parseError) {
                    await SecureStore.deleteItemAsync(USER_KEY);
                }
            }
            const isAuthenticated = !!accessToken;

            set({
                accessToken,
                refreshToken,
                user,
                isAuthenticated,
                isLoading: false,
            });
        } catch (error) {
            console.error("Failed to initialize auth:", error);
            set({ isLoading: false, isAuthenticated: false });
        }
    },
    
    // Login with email and password
    login: async (email, password, apiCall) => {
        try {
            set({ isLoading: true });
            const response = await apiCall(email, password);

            const data = response?.data || response;
            const accessToken = data?.access || data?.accessToken;
            const refreshToken = data?.refresh || data?.refreshToken;
            const user = data?.user || null;

            if (!accessToken || !refreshToken) {
                throw new Error(
                    "Login failed: Tokens are missing in the server response.",
                );
            }

            const options = Platform.OS === "ios" ? SECURE_STORE_OPTIONS : {};
            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, options);
            await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken, options);
            if (user) {
                await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user), options);
            }

            console.log("[Auth] Login successful. Access Token stored:", !!accessToken);

            set({
                accessToken,
                refreshToken,
                user,
                isAuthenticated: true,
                isLoading: false,
            });
            return { success: true, user };
        } catch (error) {
            set({ isLoading: false });
            return { success: false, error: error.message };
        }
    },

    // Refresh access token using refresh token
    refreshAccessToken: async (apiCall) => {
        const { refreshToken } = get();

        if (!refreshToken) {
            return { success: false, error: "No refresh token available" };
        }

        try {
            const options = Platform.OS === "ios" ? SECURE_STORE_OPTIONS : {};
            const response = await apiCall(refreshToken);
            const { accessToken, refreshToken: newRefreshToken } = response;

            await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken, options);
            if (newRefreshToken) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken, options);
            }

            console.log("[Auth] Token refreshed. New Access Token exists:", !!accessToken);

            set({
                accessToken,
                refreshToken: newRefreshToken || refreshToken,
            });

            return { success: true, accessToken };
        } catch (error) {
            get().logout();
            return { success: false, error: error.message };
        }
    },

    // Logout
    logout: async () => {
        const options = Platform.OS === "ios" ? SECURE_STORE_OPTIONS : {};
        try {
            await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY, options);
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY, options);
            await SecureStore.deleteItemAsync(USER_KEY, options);
        } finally {
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            });
        }
    },
}));

// Create React Context for backward compatibility
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const authStore = useAuthStore();

    return (
        <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
