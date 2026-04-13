import { Button, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../utils/toast";
import { useEffect, useState } from "react";
import { getUser, getUserProfile, testFailure } from "../../services/user";
import Dashboard from "../../components/Dashboard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const router = useRouter();
	const { logout } = useAuth();
	const { showSuccess, showInfo } = useToast();

	const handleLogout = async () => {
		await logout();
	};

	const handleDemoToast = () => {
		showSuccess("Welcome!", "This is a success toast demo.");
	};

	const handleInfoToast = () => {
		showInfo("Info", "This is an informational message.");
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.welcomeText}>Home Page</Text>
			<Dashboard />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 20,
		backgroundColor: "#d3e8fd",
		justifyContent: "flex-start",
	},
	welcomeText: {
		fontSize: 36,
		fontWeight: "bold",
		textAlign: "left",
		marginBottom: 0,
		marginHorizontal: 10,
	},
});
