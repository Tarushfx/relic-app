import React, { createContext, useContext } from 'react'
import { Platform } from 'react-native'
import { create } from 'zustand'
import axios from 'axios' // Required for direct refresh call during initialization
import { BACKEND_BASE_URL } from '../secrets/routes' // Required for direct refresh call during initialization
import AsyncStorage from '@react-native-async-storage/async-storage'

// Token keys for storage
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

// Create Zustand store for auth state
export const useCustomAuthStore = create((set, get) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,

    // Initialize auth state from storage
    initialize: async () => {
        const { isLoading } = get()
        if (!isLoading) return // Already initialized

        try {
            const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY)
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)

            console.log(Platform.OS, '[Auth] Access Token exists:', accessToken) // Keep this log for debugging
            console.log(Platform.OS, '[Auth] Refresh Token exists:', refreshToken)
            // console.log(Platform.OS, "[Auth] User data exists:", !!userStr);

            let user = null
            const userStr = null
            if (userStr) {
                try {
                    user = JSON.parse(userStr)
                } catch (parseError) {
                    await AsyncStorage.removeItem(ACCESS_TOKEN_KEY)
                }
            }
            const isAuthenticated = !!accessToken

            set({
                accessToken,
                refreshToken,
                user,
                isAuthenticated,
            })
            set({
                isLoading: false,
            })
        } catch (error) {
            console.error('Failed to initialize auth:', error)
            set({ isLoading: false, isAuthenticated: false })
        }
    },

    // Login with email and password
    login: async (email, password, apiCall) => {
        try {
            set({ isLoading: true })
            const response = await apiCall(email, password)

            const data = response?.data || response
            const accessToken = data?.access || data?.accessToken
            const refreshToken = data?.refresh || data?.refreshToken
            const user = data?.user || null

            if (!accessToken || !refreshToken) {
                throw new Error('Login failed: Tokens are missing in the server response.')
            }
            await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
            if (user) {
                await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
            }

            console.log('[Auth] Login successful. Access Token in Async storage:', !!accessToken)

            set({
                accessToken,
                refreshToken,
                user,
                isAuthenticated: true,
                isLoading: false,
            })
            return { success: true, user }
        } catch (error) {
            set({
                isLoading: false,
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
            })
            return { success: false, error: error.message }
        }
    },

    // Refresh access token using refresh token
    refreshAccessToken: async getNewTokensFunction => {
        // Renamed apiCall for clarity
        const { refreshToken: currentRefreshToken } = get() // Get current refreshToken from Zustand state

        if (!currentRefreshToken) {
            get().logout() // No refresh token, force logout
            return { success: false, error: 'No refresh token available' }
        }

        try {
            // This function is expected to make the API call and return { accessToken, refreshToken }
            const { accessToken, refreshToken: newRefreshToken } =
                await getNewTokensFunction(currentRefreshToken)

            if (!accessToken) {
                throw new Error('Refresh failed: No new access token received.')
            }

            if (newRefreshToken && newRefreshToken !== currentRefreshToken) {
                await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken)
            }

            console.log('[Auth] Token refreshed. New Access Token in RAM:', !!accessToken)

            set({
                accessToken,
                refreshToken: newRefreshToken || currentRefreshToken,
                isAuthenticated: true, // Ensure authenticated after successful refresh
            })

            return { success: true, accessToken }
        } catch (error) {
            console.error('Failed to refresh token:', error)
            get().logout()
            return { success: false, error: error.message }
        }
    },

    // Logout
    logout: async () => {
        try {
            await AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
            await AsyncStorage.removeItem(USER_KEY)
        } finally {
            set({
                accessToken: null,
                refreshToken: null,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            })
        }
    },
}))

// Create React Context for backward compatibility
export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const authStore = useCustomAuthStore()

    return <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
