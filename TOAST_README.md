# Customizable Toast Interface

This project includes a **beautiful, modern toast notification system** built on top of `react-native-toast-message`. It features stunning gradient backgrounds, enhanced shadows, and a polished design that elevates your app's user experience.

## ✨ Features

✅ **5 Toast Types**: Success, Error, Info, Warning, Alert (default)
✅ **Stunning Gradients**: Beautiful gradient backgrounds for each type
✅ **Enhanced Shadows**: Deep, modern shadows with proper elevation
✅ **Icon Containers**: Circular icon backgrounds with subtle transparency
✅ **Text Shadows**: Improved readability with elegant text shadows
✅ **Modern Typography**: Enhanced fonts with proper spacing and hierarchy
✅ **Position Control**: Top or bottom positioning options
✅ **Fully Customizable**: Colors, icons, timing, and behavior
✅ **Hook-based API**: Easy to use in components
✅ **Direct Functions**: Simple utility functions for quick usage

## 🎨 Visual Enhancements

### Gradient Backgrounds
Each toast type features a beautiful gradient:
- **Success**: Green gradient (#4CAF50 → #45a049)
- **Error**: Red gradient (#F44336 → #d32f2f)
- **Info**: Blue gradient (#2196F3 → #1976D2)
- **Warning**: Orange gradient (#FF9800 → #F57C00)
- **Alert**: Purple gradient (#9C27B0 → #7B1FA2)

### Enhanced Design Elements
- **Rounded Corners**: 16px border radius for modern look
- **Icon Containers**: Circular backgrounds with 20% white overlay
- **Text Shadows**: Subtle shadows for better contrast
- **Improved Spacing**: Better padding and margins
- **Visual Hierarchy**: Clear title/message distinction
- **Close Indicator**: Subtle dot showing auto-dismiss behavior

## 🚀 Quick Start

### 1. Using the Hook (Recommended)

```javascript
import { useToast } from '../utils/toast';

export default function MyComponent() {
  const { showSuccess, showError, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess("🎉 Success!", "Your data has been saved successfully.");
  };

  const handleError = () => {
    showError("❌ Error!", "Something went wrong. Please try again.");
  };

  return (
    <View>
      <Button title="Show Success" onPress={handleSuccess} />
      <Button title="Show Error" onPress={handleError} />
    </View>
  );
}
```

### 2. Direct Function Calls

```javascript
import { showSuccessToast, showErrorToast } from '../utils/toast';

const handleSuccess = () => {
  showSuccessToast("🎉 Success!", "Your data has been saved successfully.");
};

const handleError = () => {
  showErrorToast("❌ Error!", "Something went wrong. Please try again.");
};
```

### 3. Custom Toast with Options

```javascript
import { showToast, TOAST_TYPES } from '../utils/toast';

const showCustomToast = () => {
  showToast(
    TOAST_TYPES.SUCCESS,
    "Custom Title",
    "Custom message with more details",
    {
      visibilityTime: 6000, // 6 seconds
      position: "bottom",   // or "top"
      autoHide: true,
      props: {
        backgroundColor: "#FF5722",
        textColor: "#FFFFFF",
        icon: "flame",
      },
    }
  );
};
```

## 🎯 Toast Types

| Type | Function | Gradient | Icon | Use Case |
|------|----------|----------|------|----------|
| Success | `showSuccess()` | Green | checkmark-circle | Positive actions |
| Error | `showError()` | Red | close-circle | Failures/errors |
| Info | `showInfo()` | Blue | information-circle | Neutral info |
| Warning | `showWarning()` | Orange | warning | Cautions/alerts |
| Alert | `showAlert()` | Purple | alert-circle | General notifications |

## 📱 API Reference

### Hook: `useToast()`

Returns an object with all toast functions:

```javascript
const {
  showToast,      // Generic toast function
  showSuccess,    // Success toast
  showError,      // Error toast
  showInfo,       // Info toast
  showWarning,    // Warning toast
  showAlert,      // Alert toast (default)
  hideToast,      // Hide current toast
} = useToast();
```

### Direct Functions

```javascript
import {
  showToast,
  showSuccessToast,
  showErrorToast,
  showInfoToast,
  showWarningToast,
  showAlertToast,
  hideToast,
} from '../utils/toast';
```

### Toast Options

```javascript
{
  visibilityTime: 4000,     // Duration in milliseconds
  position: "top",          // "top" or "bottom"
  autoHide: true,           // Auto-hide after visibilityTime
  topOffset: 50,            // Top offset for top position
  bottomOffset: 40,         // Bottom offset for bottom position
  props: {                  // Custom styling props
    backgroundColor: "#4CAF50",
    textColor: "#FFFFFF",
    icon: "checkmark-circle",
  },
}
```

## 🎨 Customization

### Colors and Gradients

Edit `src/components/CustomToast.js` to customize gradients:

```javascript
const gradientConfigs = {
  success: {
    colors: ["#4CAF50", "#45a049"], // Your custom gradient
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // ... other types
};
```

### Theme Integration

The toast system automatically uses colors from your theme constants:

```javascript
import { COLORS } from '../constants/theme';

// Colors are automatically picked up from here
```

### Custom Toast Component

The toast uses a custom component (`src/components/CustomToast.js`) that you can modify for different layouts, animations, or additional features.

## 📋 Examples in Codebase

### Home Screen
```javascript
// src/app/(home)/home.jsx
const { showSuccess, showInfo } = useToast();

const handleDemoToast = () => {
  showSuccess("Welcome!", "This is a success toast demo.");
};
```

### Login Screen
```javascript
// src/app/(auth)/login.jsx
const { showError } = useToast();

if (!email || !password) {
  showError("Validation Error", "Please fill in all fields");
  return;
}
```

### Toast Demo Screen
Visit `/toast-demo` to see all toast types and options in action!

## 🔧 Migration from Alert

Replace `Alert.alert()` calls with beautiful toast calls:

```javascript
// Before (ugly alert)
Alert.alert("Error", "Something went wrong");

// After (beautiful toast)
showErrorToast("❌ Error", "Something went wrong");
```

## 💡 Best Practices

1. **Use appropriate types**: Success for positive actions, Error for failures, Info for neutral information
2. **Keep messages concise**: Toast messages should be short and clear
3. **Don't overuse**: Too many toasts can annoy users
4. **Test on different screen sizes**: Toasts adapt to screen width
5. **Use consistent styling**: Keep toast appearance consistent across the app
6. **Add emojis**: Emojis in titles make toasts more engaging (🎉, ❌, ⚠️, ℹ️)

## 🐛 Troubleshooting

### Toast not showing
- Ensure `Toast` component is added to your root layout
- Check that the toast config is properly imported

### Custom styling not working
- Verify the `props` object is passed correctly
- Check that color values are valid hex codes

### Toast positioning issues
- Adjust `topOffset` and `bottomOffset` values
- Ensure no conflicting styles from parent components

### Gradient not showing
- Make sure `expo-linear-gradient` is installed
- Check that gradient colors are valid

## 📦 Dependencies

- `react-native-toast-message`: Core toast functionality
- `expo-linear-gradient`: Beautiful gradient backgrounds
- `@expo/vector-icons`: Icons for toast types
- Your theme constants for colors and fonts

---

**Demo**: Visit the home screen and tap "View Toast Demo" to experience the beautiful new toasts! 🎨✨
Alert.alert("Error", "Something went wrong");

// After
showErrorToast("Error", "Something went wrong");
```

## Best Practices

1. **Use appropriate types**: Success for positive actions, Error for failures, Info for neutral information
2. **Keep messages concise**: Toast messages should be short and clear
3. **Don't overuse**: Too many toasts can annoy users
4. **Test on different screen sizes**: Toasts adapt to screen width
5. **Use consistent styling**: Keep toast appearance consistent across the app

## Troubleshooting

### Toast not showing
- Ensure `Toast` component is added to your root layout
- Check that the toast config is properly imported

### Custom styling not working
- Verify the `props` object is passed correctly
- Check that color values are valid hex codes

### Toast positioning issues
- Adjust `topOffset` and `bottomOffset` values
- Ensure no conflicting styles from parent components

## Dependencies

- `react-native-toast-message`: Core toast functionality
- `@expo/vector-icons`: Icons for toast types
- Your theme constants for colors and fonts
