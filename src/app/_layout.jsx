import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { AuthProvider, useAuthStore } from "../context/AuthContext";
import { initializeAPI } from "../context/apiClient";
import { ActivityIndicator, View } from "react-native";
import { BACKEND_BASE_URL } from "../secrets/routes";

// Initialize API with your base URL
initializeAPI(BACKEND_BASE_URL);
function RootLayoutContent() {
  const { isLoading, isAuthenticated } = useAuthStore();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="(home)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
