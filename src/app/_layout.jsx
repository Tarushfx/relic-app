import { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider, useCustomAuthStore } from "../context/AuthContext";
import { initializeAPI } from "../context/apiClient";
import { View } from "react-native";
import { BACKEND_BASE_URL } from "../secrets/routes";
import Toast from "react-native-toast-message";
import { toastMessageConfig } from "../components/CustomToast";
import * as SplashScreen from "expo-splash-screen";

// 1. Prevent native splash from auto-hiding immediately
SplashScreen.preventAutoHideAsync().catch(() => {
    /* optional error handling */
});

initializeAPI(BACKEND_BASE_URL);

function RootLayoutContent() {
    const { isLoading, isAuthenticated, initialize } = useCustomAuthStore();

    useEffect(() => {
        // 2. Fetch token from AsyncStorage
        initialize();
    }, []);

    useEffect(() => {
        // 3. Only hide the splash screen when hydration is done
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    // 4. Return null while loading so the "Index" or "Auth" screens
    // don't try to render behind the splash screen prematurely.
    if (isLoading) {
        return null;
    }

    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="(home)" />
                ) : (
                    <Stack.Screen name="(auth)" />
                )}
            </Stack>
            <Toast config={toastMessageConfig} />
        </View>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <RootLayoutContent />
        </AuthProvider>
    );
}
