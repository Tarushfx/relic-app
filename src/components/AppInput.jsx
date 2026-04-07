import { StyleSheet, TextInput, View } from "react-native";
import { COLORS, FONTS, APP_INPUT_SIZES as SIZES } from "../constants/theme";

export default function AppInput({ icon, placeholderText, ...props }) {
  return (
    <View style={styles.container}>
      {icon}
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
        placeholder={placeholderText}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: SIZES.height,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: SIZES.margin,
  },
  input: {
    flex: 1,
    fontSize: SIZES.text_font,
    color: COLORS.text_primary,
    marginLeft: SIZES.margin,
    fontFamily: FONTS.button,
  },
});
