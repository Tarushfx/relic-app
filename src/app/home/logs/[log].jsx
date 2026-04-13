import { Modal, TextInput, Alert, ScrollView } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import { deleteLog, saveLog, addLog } from "../../../services/logs";
import React, { useEffect, useRef, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import formatTimestamp from "../../../utils/time";
const getKeyboardType = (type) => {
	switch (type?.toLowerCase()) {
		case "integer":
			return "number-pad";
		case "decimal":
		case "float":
			return "decimal-pad";
		default:
			return "default";
	}
};
// TODO: add refresh action here
export default function TableView() {
	const { log: id } = useLocalSearchParams();
	const { showSuccess, showAlert } = useToast();
	const queryClient = useQueryClient();
	const [modalVisible, setModalVisible] = useState(false);
	const [editingItem, setEditingItem] = useState(null); // Track if we are editing or adding
	const [formData, setFormData] = useState({});
	const [showPicker, setShowPicker] = useState(false);
	const [activeDateKey, setActiveDateKey] = useState(null);
	// --- DELETE LOG ---
	const deleteMutation = useMutation({
		mutationFn: (logId) => deleteLog(logId),
		onSuccess: () => {
			queryClient.invalidateQueries(["tableLogs", id]); // Refresh the list
			showAlert("Log deleted");
		},
		onError: (err) => {
			// Handle cases like "Quantity must be a number" or 500 errors
			showError(
				"Delete Failed",
				err.message || "Please check your inputs.",
			);
		},
	});
	const confirmDelete = (logId) => {
		Alert.alert(
			"Delete Entry",
			"Are you sure you want to delete this log? This action cannot be undone.",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => deleteMutation.mutate(logId),
				},
			],
		);
	};
	const closeForm = () => {
		setModalVisible(false);
		setEditingItem(null); // CRITICAL: Reset the mode
		setFormData({}); // CRITICAL: Clear the inputs
	};
	// --- SAVE (ADD or EDIT) LOG ---
	const saveMutation = useMutation({
		mutationFn: (payload) => {
			if (!!editingItem) return saveLog(editingItem?.id, payload);
			else return addLog(id, payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["tableLogs", id]);
			setModalVisible(false);
			if (!!editingItem) showAlert("Updated!");
			else showSuccess("Added!");
			closeForm();
		},
		onError: (err) => {
			// Handle cases like "Quantity must be a number" or 500 errors
			showError(
				"Save Failed",
				err.message || "Please check your inputs.",
			);
		},
	});

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
				<View style={{ flexDirection: "row" }}>
					<TouchableOpacity
						onPress={() => {
							setEditingItem(item);
							setFormData(item.values);
							setModalVisible(true);
						}}
						style={{ marginLeft: 15 }}
					>
						<FontAwesome name="edit" size={18} color="#007AFF" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => confirmDelete(item.id)}
						style={{ marginLeft: 15 }}
					>
						<FontAwesome name="trash" size={18} color="#FF3B30" />
					</TouchableOpacity>
				</View>
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
			<View style={{ flex: 1 }}>
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
				<TouchableOpacity
					style={styles.fab}
					onPress={() => {
						setEditingItem(null); // Clear editing state
						setFormData({}); // Clear form
						setModalVisible(true);
					}}
				>
					<FontAwesome name="plus" size={24} color="#FFF" />
				</TouchableOpacity>
				<Modal
					visible={modalVisible}
					animationType="fade"
					transparent={true}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>
								{editingItem ? "Edit Entry" : "New Entry"}
							</Text>

							{columns.map((colKey) => {
								const colMeta = meta.columns[colKey];
								const isDate =
									colMeta.datatype === "datetime" ||
									colMeta.datatype === "timestamp";

								return (
									<View
										key={colKey}
										style={{ marginBottom: 15 }}
									>
										<Text style={styles.label}>
											{colKey} ({colMeta.visible_unit})
										</Text>

										{isDate ? (
											/* --- DATE INPUT TRIGGER --- */
											<TouchableOpacity
												style={styles.input}
												onPress={() => {
													setActiveDateKey(colKey);
													setShowPicker(true);
												}}
											>
												<Text
													style={{
														color: formData[colKey]
															? "#212529"
															: "#adb5bd",
													}}
												>
													{formData[colKey]
														? formatTimestamp(
																formData[
																	colKey
																],
															)
														: "Select Date & Time"}
												</Text>
											</TouchableOpacity>
										) : (
											/* --- STANDARD TEXT/NUMERIC INPUT --- */
											<TextInput
												style={styles.input}
												keyboardType={getKeyboardType(
													colMeta.datatype,
												)}
												value={String(
													formData[colKey] || "",
												)}
												onChangeText={(val) =>
													setFormData({
														...formData,
														[colKey]: val,
													})
												}
												placeholder={`Enter ${colKey}`}
											/>
										)}
									</View>
								);
							})}

							<View style={styles.modalActions}>
								<TouchableOpacity
									onPress={() => setModalVisible(false)}
								>
									<Text
										style={{
											color: "#6c757d",
											padding: 10,
										}}
									>
										Cancel
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.saveBtn}
									onPress={() =>
										saveMutation.mutate(formData)
									}
								>
									<Text
										style={{
											color: "#FFF",
											fontWeight: "bold",
										}}
									>
										Save Entry
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					{/* --- ACTUAL PICKER (Outside the loop, inside the Modal) --- */}
					{showPicker && (
						<DateTimePicker
							value={
								formData[activeDateKey]
									? new Date(formData[activeDateKey])
									: new Date()
							}
							mode="datetime"
							is24Hour={true}
							display="default"
							onChange={(event, selectedDate) => {
								setShowPicker(false);
								if (selectedDate) {
									// We store the date object or formatted string in formData
									setFormData({
										...formData,
										[activeDateKey]: selectedDate,
									});
								}
							}}
						/>
					)}
				</Modal>
			</View>
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
	fab: {
		position: "absolute",
		bottom: 30,
		right: 30,
		backgroundColor: "#007AFF",
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		padding: 20,
	},
	modalContent: {
		backgroundColor: "#FFF",
		borderRadius: 20,
		padding: 25,
	},
	input: {
		backgroundColor: "#F8F9FA",
		borderRadius: 10,
		padding: 12,
		marginTop: 5,
		borderWidth: 1,
		borderColor: "#E9ECEF",
	},
	saveBtn: {
		backgroundColor: "#007AFF",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
	},
});
