import { Stack, Tabs } from "expo-router";

export default function HomeStack() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="index" options={{ title: "Home" }} />
			<Tabs.Screen name="logs" options={{ title: "Logs" }} />
			<Tabs.Screen name="profile" options={{ title: "Profile" }} />
		</Tabs>
	);
}
