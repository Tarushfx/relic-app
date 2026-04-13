import { View } from "react-native";
import { Text, Button } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogListingScreen() {
	
	return (
		<SafeAreaView>
			<Text>Log listing Screen</Text>
			{logs.map((log) => {
				return (
					<View key={log.id}>
						<Text>{log.title}</Text>
						<Text>{log.date}</Text>
						<Button
							title={log.title}
							onPress={() => router.push(`/logs/${log.id}`)}
						/>
					</View>
				);
			})}
		</SafeAreaView>
	);
}
