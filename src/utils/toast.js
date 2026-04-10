import Toast from 'react-native-toast-message'
import { COLORS } from '../constants/theme'

// Toast configuration types
export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
    ALERT: 'alert', // Default alert-like behavior
}

// Custom toast configurations
export const toastConfig = {
    success: {
        backgroundColor: COLORS.success || '#4CAF50',
        textColor: '#FFFFFF',
        icon: 'check-circle',
    },
    error: {
        backgroundColor: COLORS.error || '#F44336',
        textColor: '#FFFFFF',
        icon: 'times-circle',
    },
    info: {
        backgroundColor: COLORS.primary || '#2196F3',
        textColor: '#FFFFFF',
        icon: 'info-circle',
    },
    warning: {
        backgroundColor: COLORS.warning || '#FF9800',
        textColor: '#FFFFFF',
        icon: 'exclamation-triangle',
    },
    alert: {
        backgroundColor: COLORS.secondary || '#9C27B0',
        textColor: '#FFFFFF',
        icon: 'exclamation-circle',
    },
}

// Toast hook for easy usage
export const useToast = () => {
    const showToast = (type = TOAST_TYPES.ALERT, title, message = '', options = {}) => {
        console.log('Showing toast:', { type, title, message, options })
        const config = toastConfig[type] || toastConfig.alert

        Toast.show({
            type: type,
            text1: title,
            text2: message,
            position: 'top',
            visibilityTime: 40000,
            autoHide: true,
            topOffset: 50,
            bottomOffset: 40,
            ...options,
            props: {
                type: type,
                backgroundColor: config.backgroundColor,
                textColor: config.textColor,
                icon: config.icon,
                ...options?.props,
            },
        })
    }

    const showSuccess = (title, message = '', options = {}) => {
        showToast(TOAST_TYPES.SUCCESS, title, message, options)
    }

    const showError = (title, message = '', options = {}) => {
        showToast(TOAST_TYPES.ERROR, title, message, options)
    }

    const showInfo = (title, message = '', options = {}) => {
        showToast(TOAST_TYPES.INFO, title, message, options)
    }

    const showWarning = (title, message = '', options = {}) => {
        showToast(TOAST_TYPES.WARNING, title, message, options)
    }

    const showAlert = (title, message = '', options = {}) => {
        showToast(TOAST_TYPES.ALERT, title, message, options)
    }

    const hideToast = () => {
        Toast.hide()
    }

    return {
        showToast,
        showSuccess,
        showError,
        showInfo,
        showWarning,
        showAlert,
        hideToast,
    }
}

// Utility functions for direct usage without hook
export const showToast = (type = TOAST_TYPES.ALERT, title, message = '', options = {}) => {
    const config = toastConfig[type] || toastConfig.alert

    Toast.show({
        type: type,
        text1: title,
        text2: message,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
        bottomOffset: 40,
        ...options,
        props: {
            type: type,
            backgroundColor: config.backgroundColor,
            textColor: config.textColor,
            icon: config.icon,
            ...options.props,
        },
    })
}

export const showSuccessToast = (title, message = '', options = {}) => {
    showToast(TOAST_TYPES.SUCCESS, title, message, options)
}

export const showErrorToast = (title, message = '', options = {}) => {
    showToast(TOAST_TYPES.ERROR, title, message, options)
}

export const showInfoToast = (title, message = '', options = {}) => {
    showToast(TOAST_TYPES.INFO, title, message, options)
}

export const showWarningToast = (title, message = '', options = {}) => {
    showToast(TOAST_TYPES.WARNING, title, message, options)
}

export const showAlertToast = (title, message = '', options = {}) => {
    showToast(TOAST_TYPES.ALERT, title, message, options)
}

export const hideToast = () => {
    Toast.hide()
}
