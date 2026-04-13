import { FontAwesome } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
export default function LogsLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "All Logs" }} />
			<Stack.Screen
				name="[log]"
				options={{
					headerTitle: "Log Details",
					headerLeft: () => (
						<TouchableOpacity
							onPress={() => router.push("/home/logs")}
							style={{ marginLeft: 10 }}
						>
							{/* // TODO: icon */}
							<FontAwesome
								name="check-circle"
								size={28}
								color="#007AFF"
							/>
						</TouchableOpacity>
					),
				}}
			/>
		</Stack>
	);
}
