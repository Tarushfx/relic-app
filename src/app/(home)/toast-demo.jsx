import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useToast } from "../../utils/toast";
import { COLORS, FONTS } from "../../constants/theme";

export default function ToastDemoScreen() {
  const {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showAlert,
    showToast,
    hideToast,
  } = useToast();

  const demoToasts = [
    {
      title: "Success Toast",
      subtitle: "Perfect for successful operations",
      action: () =>
        showSuccess("Success!", "Your data has been saved successfully."),
      gradient: ["#4CAF50", "#45a049"],
    },
    {
      title: "Error Toast",
      subtitle: "For error states and failures",
      action: () =>
        showError("Error!", "Something went wrong. Please try again."),
      gradient: ["#F44336", "#d32f2f"],
    },
    {
      title: "Info Toast",
      subtitle: "Neutral information messages",
      action: () =>
        showInfo("ℹ️ Information", "This is an informational message."),
      gradient: ["#2196F3", "#1976D2"],
    },
    {
      title: "Warning Toast",
      subtitle: "Caution and alerts",
      action: () =>
        showWarning(
          "⚠️ Warning!",
          "Please check your input before proceeding.",
        ),
      gradient: ["#FF9800", "#F57C00"],
    },
    {
      title: "Alert Toast (Default)",
      subtitle: "General purpose notifications",
      action: () => showAlert("🚨 Alert!", "This is a general alert message."),
      gradient: ["#9C27B0", "#7B1FA2"],
    },
    {
      title: "Long Message Toast",
      subtitle: "With extended content",
      action: () =>
        showToast(
          "success",
          "Long Success Message",
          "This toast demonstrates how longer messages are displayed with proper text wrapping and formatting.",
          {
            visibilityTime: 6000,
          },
        ),
      gradient: ["#4CAF50", "#45a049"],
    },
    {
      title: "Bottom Positioned",
      subtitle: "Toast from bottom of screen",
      action: () =>
        showToast(
          "info",
          "Bottom Toast",
          "This toast appears from the bottom of the screen.",
          {
            position: "bottom",
            visibilityTime: 5000,
          },
        ),
      gradient: ["#2196F3", "#1976D2"],
    },
    {
      title: "Hide Toast",
      subtitle: "Manually hide current toast",
      action: () => hideToast(),
      gradient: ["#666", "#555"],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Beautiful Toast Demo</Text>
      <Text style={styles.description}>
        Experience the enhanced toast notifications with gradients, shadows, and
        modern design.
      </Text>

      {demoToasts.map((toast, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.button, { borderLeftColor: toast.gradient[0] }]}
          onPress={toast.action}
        >
          <View style={styles.buttonContent}>
            <View style={styles.textContainer}>
              <Text style={styles.buttonTitle}>{toast.title}</Text>
              <Text style={styles.buttonSubtitle}>{toast.subtitle}</Text>
            </View>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: toast.gradient[0] },
              ]}
            />
          </View>
        </TouchableOpacity>
      ))}

      <View style={styles.usageContainer}>
        <Text style={styles.usageHeader}>✨ New Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Beautiful gradient backgrounds</Text>
          <Text style={styles.feature}>• Enhanced shadows and depth</Text>
          <Text style={styles.feature}>
            • Icon containers with subtle backgrounds
          </Text>
          <Text style={styles.feature}>
            • Text shadows for better readability
          </Text>
          <Text style={styles.feature}>• Improved typography and spacing</Text>
          <Text style={styles.feature}>• Position options (top/bottom)</Text>
          <Text style={styles.feature}>
            • Customizable duration and behavior
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: FONTS.heading || "System",
    color: "#2c3e50",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#6c757d",
    fontFamily: FONTS.body || "System",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  textContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    fontFamily: FONTS.heading || "System",
    marginBottom: 4,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: "#6c757d",
    fontFamily: FONTS.body || "System",
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 12,
  },
  usageContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  usageHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    fontFamily: FONTS.heading || "System",
    color: "#2c3e50",
  },
  featureList: {
    paddingLeft: 10,
  },
  feature: {
    fontSize: 14,
    color: "#495057",
    fontFamily: FONTS.body || "System",
    marginBottom: 8,
    lineHeight: 20,
  },
});
