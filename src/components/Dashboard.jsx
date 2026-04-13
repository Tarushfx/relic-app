import { useQuery } from "@tanstack/react-query";
import { getDashboardTables } from "../services/logs";
import {
	View,
	Text,
	ActivityIndicator,
	ScrollView,
	TouchableOpacity,
	StyleSheet,
	ScrollViewBase,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS } from "../constants/theme";
import { addToStart } from "../../node_modules/@tanstack/query-core/src/utils";
import { FontAwesome } from "@expo/vector-icons";

export default function Dashboard() {
	// STEP 1: Get the user_id from Storage
	const { data: dashboard_tables, isLoading: areTablesLoading } = useQuery({
		queryKey: ["dashboard_tables"],
		queryFn: async () => await getDashboardTables(),
	});
	const handleShowTable = async (tableId) => {
		router.push(`home/logs/${tableId}`);
	};
	if (areTablesLoading) return <ActivityIndicator size="large" />;
	let content = null;
	if (dashboard_tables && dashboard_tables.length === 0) {
		content = (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>Dashboard</Text>
				</View>
				<View style={styles.addLogSectionHeader}>
					<Text style={styles.emptyStateText}>
						Log your first relic!
					</Text>
					<TouchableOpacity>
						<FontAwesome
							name="check-circle"
							style={styles.addLogIcon}
							size={22}
						/>
					</TouchableOpacity>
				</View>
			</View>
		);
	} else {
		content = (
			<View style={styles.container}>
				<View style={styles.headerRow}>
					<Text style={styles.title}>Dashboard</Text>
				</View>
				<View style={styles.sectionHeader}>
					<Text style={styles.subtitle}>Recently Used Tables</Text>
					<TouchableOpacity
						onPress={() => {
							router.push("home/logs/");
						}}
						asChild
					>
						<Text style={styles.seeAll}>See All</Text>
					</TouchableOpacity>
				</View>
				<View style={styles.scrollContainer}>
					<ScrollView horizontal>
						{dashboard_tables.map((table) => (
							<TouchableOpacity
								key={table.id}
								style={styles.card}
								onPress={() => handleShowTable(table.id)}
							>
								<View style={styles.iconPlaceholder}>
									<Text style={styles.iconText}>
										{table.name.charAt(0)}
									</Text>
								</View>
								<View>
									<Text
										style={styles.tableName}
										numberOfLines={1}
									>
										{table.name}
									</Text>
									<Text
										style={styles.tableDesc}
										numberOfLines={2}
									>
										{table.description || ""}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>
			</View>
		);
	}
	return content;
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffd2f2",
		borderRadius: 20,
		// height: "auto",
		borderRadius: 12,
		padding: 16,
		margin: 20,

		// --- iOS SHADOW ---
		shadowColor: "#000", // The color of the shadow
		shadowOffset: {
			width: 0, // Horizontal shift
			height: 4, // Vertical shift (downward)
		},
		shadowOpacity: 0.1, // Transparency (0 to 1)
		shadowRadius: 6, // Blurriness

		// --- ANDROID SHADOW ---
		elevation: 5, // Only property for Android

		// --- LAYOUT ---
		maxHeight: "50%",
		// minHeight: "20%",
		height: "auto",
		flexDirection: "column",
		justifyContent: "flex-start",
	},
	headerRow: {
		flexDirection: "row",
		paddingHorizontal: 5,
		marginVertical: 5,
	},
	title: {
		fontSize: 28,
		fontWeight: "800",
		color: COLORS.text_primary,
	},
	seeAll: {
		color: COLORS.primary,
		fontWeight: "600",
		fontSize: 14,
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "600",
		color: "#6C757D",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	scrollContainer: {
		paddingVertical: 10,
		paddingLeft: 5,
		paddingRight: 5,
	},
	card: {
		backgroundColor: "#FFFFFF",
		width: 140,
		height: 150,
		borderRadius: 16,
		padding: 16,
		marginRight: 15,
		justifyContent: "space-between",
		// Shadow for iOS
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		// Elevation for Android
		elevation: 4,
	},
	iconPlaceholder: {
		width: 40,
		height: 40,
		borderRadius: 10,
		backgroundColor: COLORS.secondary,
		justifyContent: "center",
		alignItems: "center",
	},
	iconText: {
		color: COLORS.primary,
		fontWeight: "bold",
		fontSize: 18,
	},
	tableName: {
		fontSize: 16,
		fontWeight: "700",
		color: COLORS.text_primary,
		marginBottom: 4,
	},
	tableDesc: {
		fontSize: 12,
		color: "#ADB5BD",
		lineHeight: 16,
	},
	emptyStateText: {
		fontSize: 18,
		textAlign: "left",
		paddingHorizontal: 5,
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		paddingHorizontal: 5,
	},
	addLogSectionHeader: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
	},
	addLogIcon: {
		color: "#9f1616",
		marginRight: 10,
	},
});
