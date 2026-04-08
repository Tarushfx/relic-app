import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../utils/toast";

export default function HomeScreen() {
  const router = useRouter();
  const { logout, debugSecureStore } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const handleDemoToast = () => {
    showSuccess("Welcome!", "This is a success toast demo.");
  };

  const handleInfoToast = () => {
    showInfo("Info", "This is an informational message.");
  };

  const handleDebugStore = async () => {
    const debugInfo = await debugSecureStore();
    console.log("Debug info:", debugInfo);
    showInfo(
      "Debug",
      `Auth: ${debugInfo?.isAuthenticated}, Tokens: ${debugInfo?.accessToken}/${debugInfo?.refreshToken}`,
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>
        Welcome to the Home Screen!
      </Text>

      <Button title="Show Success Toast" onPress={handleDemoToast} />
      <View style={{ height: 10 }} />
      <Button title="Show Info Toast" onPress={handleInfoToast} />
      <View style={{ height: 20 }} />
      <Button
        title="View Toast Demo"
        onPress={() => router.push("/toast-demo")}
      />
      <View style={{ height: 20 }} />
      <Button title="Debug Secure Store" onPress={handleDebugStore} />
      <View style={{ height: 20 }} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
