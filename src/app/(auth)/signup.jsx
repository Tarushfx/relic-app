import { FontAwesome } from '@expo/vector-icons'
import { Link, Stack } from 'expo-router'
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppInput from '../../components/AppInput'
import SubmitButton from '../../components/SubmitButton'
import { APP_INPUT_SIZES, COLORS, FONT_PRIMARY, FONTS } from '../../constants/theme'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getAPI } from '../../context/apiClient'
import { LOGIN_URL, SIGNUP_URL } from '../../secrets/routes'
import { useToast } from '../../utils/toast'

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        marginHorizontal: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row', // Align icon and input horizontally
        alignItems: 'center', // Center them vertically
        backgroundColor: '#F2F2F2', // Light grey background from your image
        borderRadius: 25, // Large radius for the "pill" shape
        paddingHorizontal: 20,
        height: 60,
        borderWidth: 1,
        borderColor: '#C0C0C0', // Subtle border color
        marginVertical: 10,
    },
    icon: {
        marginRight: 15, // Space between icon and text
    },
    input: {
        flex: 1, // Take up remaining space
        fontSize: 18,
        color: '#333',
        fontFamily: FONT_PRIMARY,
    },
    title: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
        marginLeft: 20,
        letterSpacing: 1,
        fontFamily: FONT_PRIMARY,
    },
    link: {
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    linkText: {
        color: COLORS.primary,
        textAlign: 'right',
        marginRight: 20,
        fontSize: APP_INPUT_SIZES.text_font,
        fontFamily: FONTS.body,
    },
    simpleText: {
        textAlign: 'center',
        fontSize: APP_INPUT_SIZES.text_font,
        fontFamily: FONTS.body,
    },
})

export default function SignUpScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()
    const api = getAPI()
    const { showError } = useToast()

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword || !username) {
            showError('Validation Error', 'Please fill in all fields')
            return
        }

        if (password !== confirmPassword) {
            showError('Validation Error', 'Passwords do not match')
            return
        }

        setIsLoading(true)

        try {
            const response = await api.post(SIGNUP_URL, {
                email,
                password,
                username,
            })
            console.log('Signup response', response.data)

            const signupData = response.data
            const hasTokens =
                signupData?.accessToken ||
                signupData?.access ||
                signupData?.refreshToken ||
                signupData?.refresh

            if (hasTokens) {
                await login(email, password, async () => signupData)
            } else {
                const loginResponse = await api.post(LOGIN_URL, {
                    email,
                    password,
                })
                console.log('Login after signup response', loginResponse.data)
                await login(email, password, async () => loginResponse.data)
            }
        } catch (error) {
            console.log('Signup error', error)
            showError('Signup Failed', error.response?.data?.message || error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'fade_from_bottom',
                    animationDuration: 150,
                }}></Stack.Screen>
            <SafeAreaView style={styles.screen}>
                <View style={{ flex: 1 }} />
                <Text style={styles.title}>Create an Account</Text>
                <AppInput
                    icon={<FontAwesome name="user" size={24} color="#666" />}
                    placeholderText="Email"
                    value={email}
                    onChangeText={setEmail}
                    editable={!isLoading}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <AppInput
                    icon={<FontAwesome name="user" size={24} color="#666" />}
                    placeholderText="Username"
                    value={username}
                    onChangeText={setUsername}
                    editable={!isLoading}
                />
                <AppInput
                    icon={<FontAwesome name="lock" size={24} color="#666" />}
                    placeholderText="Password"
                    value={password}
                    onChangeText={setPassword}
                    editable={!isLoading}
                    secureTextEntry
                />
                <AppInput
                    icon={<FontAwesome name="lock" size={24} color="#666" />}
                    placeholderText="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    editable={!isLoading}
                    secureTextEntry
                />
                <SubmitButton
                    isLoading={isLoading}
                    placeholderText="Create Account"
                    marginVertical={20}
                    onPress={handleSignUp}
                    disabled={isLoading}
                />
                <View>
                    <Text asChild>
                        <Text style={styles.simpleText}>Already have an account? </Text>
                        <Link href="/login" asChild replace>
                            <Text style={styles.linkText}>Login</Text>
                        </Link>
                    </Text>
                </View>
                <View style={{ flex: 2 }} />
            </SafeAreaView>
        </>
    )
}
