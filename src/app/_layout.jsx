import { useEffect } from "react";
import { Stack } from "expo-router";
import { AuthProvider, useAuthStore } from "../context/AuthContext";
import { initializeAPI } from "../context/apiClient";
import { View } from "react-native";
import { BACKEND_BASE_URL } from "../secrets/routes";
import Toast from "react-native-toast-message";
import { toastMessageConfig } from "../components/CustomToast";
import * as SplashScreen from "expo-splash-screen";
import SplashView from "../components/SplashView";

// Initialize API with your base URL
initializeAPI(BACKEND_BASE_URL);

// Prevent the splash screen from auto-hiding while the app initializes
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutContent() {
  const { isLoading, isAuthenticated, initialize } = useAuthStore();

  useEffect(() => {
    async function prepare() {
      // 1. Start your auth check
      await initialize();
      // 2. The millisecond initialization is done, hide the native blue screen
      // This transition is much smoother than swapping two images
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);

  // While initializing, show your custom animated SplashView
  if (isLoading) {
    return <SplashView />;
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
