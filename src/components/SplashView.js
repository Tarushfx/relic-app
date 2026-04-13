import React from "react";
import { View, StyleSheet, ActivityIndicator, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS } from "../constants/theme";

export default function SplashView() {
	return (
		<View style={styles.container}>
			<LinearGradient
				colors={[
					COLORS.primary || "#2196F3",
					COLORS.secondary || "#9C27B0",
				]}
				style={styles.gradient}
			>
				<View style={styles.content}>
					<View style={styles.logoPlaceholder}>
						<Text style={styles.logoText}>R</Text>
					</View>
					<Text style={styles.title}>RELIC</Text>
					<ActivityIndicator
						size="large"
						color="#FFFFFF"
						style={styles.loader}
					/>
				</View>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
	content: { alignItems: "center" },
	logoPlaceholder: {
		width: 100,
		height: 100,
		borderRadius: 25,
		backgroundColor: "rgba(255, 255, 255, 0.2)",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	logoText: {
		fontSize: 60,
		fontWeight: "bold",
		color: "#FFFFFF",
		fontFamily: FONTS.heading || "System",
	},
	title: {
		fontSize: 32,
		letterSpacing: 8,
		color: "#FFFFFF",
		fontFamily: FONTS.heading || "System",
		fontWeight: "300",
	},
	loader: { marginTop: 40 },
});
