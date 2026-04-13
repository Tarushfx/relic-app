import { getAPI } from "../context/apiClient";
import { GET_USER_URL, GET_USER_PROFILE_URL } from "../secrets/routes";

export const getUser = () => {
	const api = getAPI();
	return api.get(GET_USER_URL);
};

export const getUserProfile = () => {
	const api = getAPI();
	return api.get(GET_USER_PROFILE_URL);
};

export const testFailure = () => {
	const api = getAPI();
	return api.patch("api/v1/logs/table/1/", {});
};
