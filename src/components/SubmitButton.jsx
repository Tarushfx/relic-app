import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { COLORS, FONTS, APP_INPUT_SIZES as SIZES } from '../constants/theme'
export default function SubmitButton({ isLoading, placeholderText, onPress, ...props }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} {...props}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{placeholderText}</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.radius,
        paddingHorizontal: SIZES.padding,
        height: SIZES.height,
        borderWidth: 1,
        borderColor: COLORS.border,
        margin: SIZES.margin,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: SIZES.button_font,
        color: COLORS.text_secondary,
        fontFamily: FONTS.button,
        fontWeight: 800,
    },
})
