import { Platform } from "react-native";

export const BACKEND_BASE_URL = Platform.select({
  ios: `http://localhost:8000`,
  android: `http://10.0.2.2:8000`, // Use PC_IP here if testing on a real Android phone
});
export const LOGIN_URL = "api/auth/login/";
export const SIGNUP_URL = "api/auth/signup/"