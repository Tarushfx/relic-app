// app/index.jsx
import { Redirect } from 'expo-router'
import { useCustomAuthStore } from '../context/AuthContext'

export default function Index() {
    const { isAuthenticated, isLoading } = useCustomAuthStore()

    // Wait for the splash/hydration to finish
    if (isLoading) return null

    if (isAuthenticated) {
        return <Redirect href="/home" />
    } else {
        return <Redirect href="/(auth)/login" />
    }
}
