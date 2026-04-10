import { Button, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../utils/toast";

export default function HomeScreen() {
    const router = useRouter();
    const { logout } = useAuth();
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

    const dashboardData = [
        { id: 1, name: "Item 1", description: "Description for Item 1" },
        { id: 2, name: "Item 2", description: "Description for Item 2" },
        { id: 3, name: "Item 3", description: "Description for Item 3" },
    ];

    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <Text style={{ fontSize: 24, marginBottom: 20 }}>
                Welcome to the Home Screen!
            </Text>

            {/* Dashboard */}
            <View
                style={{
                    width: "90%",
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    elevation: 4,
                }}
            >
                <Text style={{ fontSize: 20, marginBottom: 16 }}>
                    Dashboard
                </Text>
                {dashboardData.map((item) => (
                    <View
                        key={item.id}
                        style={{
                            padding: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: "#ccc",
                        }}
                    >
                        <Text style={{ fontSize: 18 }}>{item.name}</Text>
                        <Text style={{ color: "gray" }}>
                            {item.description}
                        </Text>
                    </View>
                ))}
            </View>

            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 20,
                }}
            >
                <Button title="Show Success Toast" onPress={handleDemoToast} />
                <View style={{ height: 10 }} />
                <Button title="Show Info Toast" onPress={handleInfoToast} />
            </View>
            <View style={{ flexDirection: "row", marginTop: 20 }}>
                <Button
                    title="View Toast Demo"
                    onPress={() => router.push("/toast-demo")}
                />
                <View style={{ width: 10 }} />
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </View>
    );
}
