import { getAPI } from "../context/apiClient";
import {
	DASHBOARD_TABLE_LIST_URL,
	GET_DELETE_ENTRY_URL,
	GET_PATCH_ENTRY_URL,
	GET_POST_ENTRY_URL,
	GET_TABLE_INFO_URL,
} from "../secrets/routes";
import { formatTimestamp } from "../utils/time";

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

export const deleteLog = async (entryId) => {
	try {
		const api = getAPI();
		console.log("deleteLog", entryId);
		const response = await api.delete(GET_DELETE_ENTRY_URL(entryId));
		return response.data?.success || false;
	} catch (ex) {
		console.log(ex);
		return false;
	}
};

export const saveLog = async (entryId, data) => {
	try {
		const api = getAPI();
		const payload = {
			values: data,
			timestamp: formatTimestamp(new Date()),
			source: "user",
		};
		console.log("saveLog", payload);
		const response = await api.patch(GET_PATCH_ENTRY_URL(entryId), payload);
		return response.data.data;
	} catch (ex) {
		console.log(ex);
		return null;
	}
};

export const addLog = async (tableId, data) => {
	try {
		const api = getAPI();
		const payload = {
			values: data,
			timestamp: formatTimestamp(new Date()),
			source: "user",
		};
		console.log("addLog", payload);
		const response = await api.post(GET_POST_ENTRY_URL(tableId), payload);
		return response.data.data;
	} catch (ex) {
		console.log(ex);
		return null;
	}
};
