import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppInput from "../../components/AppInput";
import SubmitButton from "../../components/SubmitButton";
import {
  APP_INPUT_SIZES,
  COLORS,
  FONT_PRIMARY,
  FONTS,
} from "../../constants/theme";

export const CurvedHeaderBg = () => <View style={styles.curvedContainer} />;
const styles = StyleSheet.create({
  screen: { flex: 1, marginHorizontal: 20 },
  inputContainer: {
    flexDirection: "row", // Align icon and input horizontally
    alignItems: "center", // Center them vertically
    backgroundColor: "#F2F2F2", // Light grey background from your image
    borderRadius: 25, // Large radius for the "pill" shape
    paddingHorizontal: 20,
    height: 60,
    borderWidth: 1,
    borderColor: "#C0C0C0", // Subtle border color
    marginVertical: 10,
  },
  icon: {
    marginRight: 15, // Space between icon and text
  },
  input: {
    flex: 1, // Take up remaining space
    fontSize: 18,
    color: "#333",
    fontFamily: FONT_PRIMARY,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 20,
    letterSpacing: 1,
    fontFamily: FONT_PRIMARY,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  },
  linkText: {
    color: COLORS.primary,
    textAlign: "right",
    marginRight: 20,
    fontSize: APP_INPUT_SIZES.text_font,
    fontFamily: FONTS.body,
  },
  simpleText: {
    textAlign: "center",
    fontSize: APP_INPUT_SIZES.text_font,
    fontFamily: FONTS.body,
  },
});
export default function LoginScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Login",
          headerShown: false,
          animation: "fade_from_bottom",
          animationDuration: 150,
        }}
      ></Stack.Screen>
      <SafeAreaView style={styles.screen}>
        <View style={{ flex: 1 }} />
        <Text style={styles.title}>Welcome Back!!</Text>
        <AppInput
          icon={<FontAwesome name="user" size={24} color="#666" />}
          placeholderText="Email"
        />
        <AppInput
          icon={<FontAwesome name="lock" size={24} color="#666" />}
          placeholderText="Password"
          secureTextEntry
        />
        {
          // TODO: Add forgot password functionality
          /* <Link href="/reset-password" asChild>
          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </Link> */
        }
        <SubmitButton placeholderText="Login" marginVertical={50} />
        <View>
          <Text asChild>
            <Text style={styles.simpleText}>Don't have an account? </Text>
            <Link href="/signup" asChild replace>
              <Text style={styles.linkText}>Sign Up</Text>
            </Link>
          </Text>
        </View>
        <View style={{ flex: 2 }} />
      </SafeAreaView>
    </>
  );
}
