import { getAPI } from "../context/apiClient";
import {
	DASHBOARD_TABLE_LIST_URL,
	GET_TABLE_INFO_URL,
} from "../secrets/routes";

export const getDashboardTables = async () => {
	try {
		const api = getAPI();
		const response = await api.get(DASHBOARD_TABLE_LIST_URL);
		if (!response.data || !response.data.data) return [];
		return response.data.data;
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const getTable = async (tableId) => {
	try {
		const api = getAPI();
		const response = await api.get(GET_TABLE_INFO_URL(tableId));
		if (!response.data || !response.data.data) return [];
		return response.data.data;
	} catch (e) {
		console.log(e);
		return null;
	}
};
// services/user.js
export const fetchTableLogs = async ({
	queryKey,
	page_size,
	pageParam = 1,
}) => {
	try {
		const [_, tableId] = queryKey;
		const api = getAPI();
		const response = await api.get(GET_TABLE_INFO_URL(tableId), {
			params: {
				page: pageParam,
				page_size: page_size, // Adjust size as needed
			},
		});
		console.log(response.data.data);
		return response.data.data; // Should return the object you shared
	} catch (e) {
		console.log(e);
		return null;
	}
};
