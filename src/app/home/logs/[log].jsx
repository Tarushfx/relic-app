import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogScreen() {
    const { log: logId } = useLocalSearchParams();
    return (
        <SafeAreaView>
            <Text>{logId}</Text>
            <Text>Your activity logs will appear here.</Text>
        </SafeAreaView>
    );
}
