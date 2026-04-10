import React from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { FontAwesome } from '@expo/vector-icons'
import { COLORS, FONTS } from '../constants/theme'
import Toast from 'react-native-toast-message'

const { width } = Dimensions.get('window')

// Icon mapping for each toast type
const iconMap = {
    success: 'check-circle',
    error: 'times-circle',
    info: 'info-circle',
    warning: 'exclamation-triangle',
    alert: 'exclamation-circle',
}

// Enhanced gradient configurations for each toast type
const gradientConfigs = {
    success: {
        colors: ['#4CAF50', '#45a049'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    error: {
        colors: ['#F44336', '#d32f2f'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    info: {
        colors: ['#2196F3', '#1976D2'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    warning: {
        colors: ['#FF9800', '#F57C00'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
    alert: {
        colors: ['#9C27B0', '#7B1FA2'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },
}

// Enhanced Custom toast component with gradients and better styling
const CustomToast = props => {
    // react-native-toast-message passes the entire toast config object
    const text1 = props?.text1 || props?.title || ''
    const text2 = props?.text2 || props?.message || ''
    const toastType = props?.type || 'alert'

    const gradientConfig = gradientConfigs[toastType] || gradientConfigs.alert
    const iconName = iconMap[toastType] || iconMap.alert
    return (
        <View style={styles.shadowContainer}>
            <LinearGradient
                colors={gradientConfig.colors}
                start={gradientConfig.start}
                end={gradientConfig.end}
                style={styles.gradientContainer}>
                <View style={styles.overlay}>
                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <FontAwesome
                                name={iconName}
                                size={22}
                                color="#FFFFFF"
                                style={styles.icon}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            {text1 && (
                                <Text style={styles.title} numberOfLines={1}>
                                    {text1}
                                </Text>
                            )}
                            {text2 && (
                                <Text style={styles.message} numberOfLines={2}>
                                    {text2}
                                </Text>
                            )}
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => Toast.hide()}
                                activeOpacity={0.7}>
                                <FontAwesome
                                    name="times"
                                    size={16}
                                    color="rgba(255, 255, 255, 0.8)"
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

// Toast configurations for react-native-toast-message
export const toastMessageConfig = {
    success: props => <CustomToast {...props} />,
    error: props => <CustomToast {...props} />,
    info: props => <CustomToast {...props} />,
    warning: props => <CustomToast {...props} />,
    alert: props => <CustomToast {...props} />,
}

const styles = StyleSheet.create({
    shadowContainer: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        marginHorizontal: width * 0.05,
        marginVertical: 4,
        width: width * 0.9,
    },
    gradientContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    overlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    textContainer: {
        flex: 1,
        maxWidth: width * 0.5, // Fixed max width of 50% screen width
        minWidth: width * 0.3, // Minimum width to prevent too narrow
        alignSelf: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        fontFamily: FONTS.heading || 'System',
        marginBottom: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 14,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.9)',
        fontFamily: FONTS.body || 'System',
        lineHeight: 18,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
    closeButton: {
        alignSelf: 'flex-end',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 20, // Increased from 12 to 20 for more spacing
        marginRight: 5, // Negative margin to pull it closer to the edge
    },
    closeIcon: {
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 1,
    },
})
