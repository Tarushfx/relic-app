import { Platform } from "react-native";

export const BACKEND_BASE_URL = Platform.select({
	ios: `http://localhost:8000`,
	android: `http://10.0.2.2:8000`,
	// Use PC_IP here if testing on a real Android phone
});
export const LOGIN_URL = "api/v1/auth/login/";
export const SIGNUP_URL = "api/v1/users/signup/";

export const GET_USER_URL = "api/v1/users/details/";
export const GET_USER_PROFILE_URL = "api/v1/users/profile/";

export const REFRESH_URL = "api/v1/auth/refresh/";
export const LOGOUT_URL = "api/v1/auth/logout/";

export const DASHBOARD_TABLE_LIST_URL = "api/v1/logs/dashboard/";
export const TABLE_INFO_BASE_URL = "api/v1/logs/table/";
export const ENTRY_BASE_URL = "api/v1/logs/entries/";
// In your constants or services file
export const GET_TABLE_INFO_URL = (tableId) =>
	`${TABLE_INFO_BASE_URL}${tableId}/`;
export const GET_DELETE_ENTRY_URL = (entryId) => `${ENTRY_BASE_URL}${entryId}/`;
export const GET_PATCH_ENTRY_URL = (entryId) => `${ENTRY_BASE_URL}${entryId}/`;
export const GET_POST_ENTRY_URL = (tableId) =>
	`api/v1/logs/table/${tableId}/entries/`;
