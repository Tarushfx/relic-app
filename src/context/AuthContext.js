import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { is } from "../../node_modules/zustand/esm/index";
import { router } from "expo-router";
// Token keys for storage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user";

// Create Zustand store for auth state
export const useAuthStore = create((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth state from storage
  initialize: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      const user = userStr ? JSON.parse(userStr) : null;

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: !!accessToken && !!refreshToken,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize auth:", error);
      set({ isLoading: false });
    }
  },

  // Login with email and password
  login: async (email, password, apiCall) => {
    try {
      set({ isLoading: true });
      const response = await apiCall(email, password);

      // Handle case where apiCall returns full response or just the data payload
      const data = response?.data || response;

      // Fallback for different naming conventions (access/refresh vs accessToken/refreshToken)
      const accessToken = data?.access || data?.accessToken;
      const refreshToken = data?.refresh || data?.refreshToken;
      const user = data?.user;

      if (!accessToken || !refreshToken) {
        throw new Error(
          "Login failed: Tokens are missing in the server response.",
        );
      }

      // Store tokens securely
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, String(accessToken));
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, String(refreshToken));
      if (user) await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));

      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      console.log("Login successful, user:", user);
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
      const response = await apiCall(refreshToken);
      const { accessToken, refreshToken: newRefreshToken } = response;

      // Update tokens
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
      if (newRefreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
      }

      set({
        accessToken,
        refreshToken: newRefreshToken || refreshToken,
      });

      return { success: true, accessToken };
    } catch (error) {
      console.error("Token refresh failed:", error);
      // If refresh fails, logout user
      get().logout();
      return { success: false, error: error.message };
    }
  },

  // Logout
  logout: async () => {
    try {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_KEY);
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });

      const { accessToken, refreshToken, user, isAuthenticated, isLoading } =
        get();
      console.log(accessToken, refreshToken, user, isAuthenticated, isLoading);
      console.log("Logout successful");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // Update user profile
  setUser: (user) => set({ user }),
}));

// Create React Context for backward compatibility
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const authStore = useAuthStore();

  useEffect(() => {
    authStore.initialize();
  }, []);

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
