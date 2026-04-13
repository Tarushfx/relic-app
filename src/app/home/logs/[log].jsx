// import { useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { View, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { getTable } from "../../../services/logs";

// export default function LogScreen() {
// 	const { log: logId } = useLocalSearchParams();
// 	if (!logId) return null;
// 	const [table, setTable] = useState(null);
// 	useEffect(() => {
// 		const getData = async () => {
// 			let response = await getTable(logId);
// 			if (!!response) setTable(response);
// 			console.log(response);
// 			return response;
// 		};
// 		getData();
// 	}, [logId]);
// 	if (!table) return;
// 	return (
// 		<SafeAreaView>
// 			<Text>{logId}</Text>
// 			<Text>{table.name}</Text>
// 			<Text>Your activity logs will appear here.</Text>
// 		</SafeAreaView>
// 	);
// }
import React, { useEffect, useRef, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocalSearchParams, Stack } from "expo-router";
import { fetchTableLogs } from "../../../services/logs";
import { TABLE_PAGE_SIZE } from "../../../constants/logs";
import { useToast } from "../../../utils/toast";
export default function TableView() {
	const { log: id } = useLocalSearchParams();
	const { showError, showAlert } = useToast();
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
		useInfiniteQuery({
			queryKey: ["tableLogs", id],
			queryFn: ({ pageParam }) =>
				fetchTableLogs({
					queryKey: ["tableLogs", id],
					pageParam,
					page_size: TABLE_PAGE_SIZE,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage, allPages) => {
				// This should match your API params
				if (!lastPage || lastPage.success === false) {
					console.log(
						"Pagination halted: API reported failure or empty response.",
					);
					return undefined;
				}
				const currentRows = lastPage.rows?.length || 0;
				console.log("getNextPageParam", lastPage);
				if (currentRows === TABLE_PAGE_SIZE) {
					return allPages.length + 1;
				}
				return undefined;
			},
		});

	const allRows = data?.pages?.flatMap((page) => page?.rows ?? []) ?? [];
	const meta = data?.pages?.[0]?.table_meta;
	const columns = meta?.columns ? Object.keys(meta.columns) : [];

	const renderRow = ({ item }) => (
		<View style={styles.card}>
			<View style={styles.cardHeader}>
				<Text style={styles.dateText}>
					{new Date(item.created_at).toLocaleDateString()}
				</Text>
				<Text style={styles.idText}>#{item.id}</Text>
			</View>

			<View style={styles.valuesContainer}>
				{columns.map((colKey) => (
					<View key={colKey} style={styles.valueItem}>
						<Text style={styles.label}>{colKey}</Text>
						<Text style={styles.value}>
							{item.values[colKey]}
							<Text style={styles.unit}>
								{" "}
								{meta.columns[colKey].visible_unit}
							</Text>
						</Text>
					</View>
				))}
			</View>
		</View>
	);

	if (isLoading)
		return <ActivityIndicator style={{ flex: 1 }} size="large" />;

	return (
		<View style={styles.container}>
			<Stack.Screen options={{ title: meta?.name || "Logs" }} />

			<FlatList
				data={allRows}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderRow}
				contentContainerStyle={styles.listContent}
				ListFooterComponent={() =>
					hasNextPage ? (
						<TouchableOpacity
							style={styles.loadMoreBtn}
							onPress={() => fetchNextPage()}
							disabled={isFetchingNextPage}
						>
							{isFetchingNextPage ? (
								<ActivityIndicator color="#FFF" />
							) : (
								<Text style={styles.loadMoreText}>
									Load More Rows
								</Text>
							)}
						</TouchableOpacity>
					) : (
						<Text style={styles.endText}>End of logs</Text>
					)
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F9FA",
	},
	listContent: {
		padding: 20,
	},
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		padding: 16,
		marginBottom: 15,
		elevation: 3,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
	},
	cardHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#F1F3F5",
		paddingBottom: 8,
		marginBottom: 12,
	},
	dateText: {
		fontSize: 12,
		color: "#adb5bd",
		fontWeight: "600",
	},
	idText: {
		fontSize: 12,
		color: "#dee2e6",
	},
	valuesContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	valueItem: {
		width: "45%",
		marginBottom: 10,
	},
	label: {
		fontSize: 12,
		color: "#6c757d",
		textTransform: "uppercase",
		marginBottom: 2,
	},
	value: {
		fontSize: 18,
		fontWeight: "700",
		color: "#212529",
	},
	unit: {
		fontSize: 12,
		color: "#adb5bd",
		fontWeight: "normal",
	},
	loadMoreBtn: {
		backgroundColor: "#007AFF", // Or your pink theme color
		padding: 15,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 10,
	},
	loadMoreText: {
		color: "#FFFFFF",
		fontWeight: "bold",
	},
	endText: {
		textAlign: "center",
		color: "#adb5bd",
		marginVertical: 20,
	},
});
