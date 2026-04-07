import { Stack } from "expo-router";

export default function AuthLayout() {
  // This layout manages the screens inside the (auth) folder
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
