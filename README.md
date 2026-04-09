# Relic App 📱

A modern React Native Expo app featuring a complete authentication system with beautiful toast notifications. Built with Expo Router, Zustand state management, and a stunning UI.

## ✨ Features

### 🔐 Complete Authentication System
- **Two-token strategy**: Access + Refresh tokens for secure authentication
- **Auto-refresh**: Automatic token refresh on 401 responses
- **Secure storage**: Encrypted token storage with expo-secure-store
- **Route protection**: Automatic redirects for authenticated/unauthenticated users
- **Login/Signup**: Full user registration and authentication flow

### 🎨 Beautiful Toast Notifications
- **5 Toast Types**: Success, Error, Info, Warning, Alert
- **Stunning Gradients**: Beautiful gradient backgrounds for each type
- **Enhanced Shadows**: Deep, modern shadows with proper elevation
- **Icon Containers**: Circular icon backgrounds with subtle transparency
- **Text Shadows**: Improved readability with elegant text shadows
- **Modern Typography**: Enhanced fonts with proper spacing and hierarchy
- **Fully Customizable**: Colors, icons, timing, and behavior

### 🛠️ Technical Stack
- **React Native** with **Expo**
- **Expo Router** for file-based routing
- **Zustand** for state management
- **Axios** with interceptors for API calls
- **react-native-toast-message** for notifications
- **expo-linear-gradient** for beautiful gradients
- **expo-secure-store** for encrypted storage

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd relic-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/emulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app

## 📱 App Structure

```
app/
├── _layout.jsx          # Root layout with auth provider
├── index.jsx            # Welcome screen
├── (auth)/              # Authentication routes
│   ├── login.jsx        # Login screen
│   └── signup.jsx       # Signup screen
└── (home)/              # Protected routes
    ├── home.jsx         # Home screen
    └── toast-demo.jsx   # Toast demonstration

src/
├── context/
│   ├── AuthContext.js   # Zustand auth store
│   └── apiClient.js     # Axios instance with interceptors
├── components/
│   └── CustomToast.js   # Beautiful toast component
├── utils/
│   └── toast.js         # Toast utilities and hook
└── constants/
    └── theme.js         # App theme constants
```

## 🎯 Key Features Demo

### Authentication Flow
1. **Welcome Screen**: Choose to login or signup
2. **Signup**: Create account with auto-login
3. **Login**: Authenticate with email/password
4. **Protected Routes**: Automatic redirects based on auth state
5. **Logout**: Secure logout with token cleanup

### Toast System
Visit the **Toast Demo** screen to see all notification types:
- **Success**: Green gradient with checkmark
- **Error**: Red gradient with close icon
- **Info**: Blue gradient with info icon
- **Warning**: Orange gradient with warning icon
- **Alert**: Purple gradient with alert icon

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
API_BASE_URL=https://your-api-endpoint.com
```

### Theme Customization
Edit `src/constants/theme.js` to customize colors, fonts, and spacing.

### Toast Customization
Modify `src/components/CustomToast.js` to change gradients, shadows, and styling.

## 📚 Documentation

- **[AUTH_SETUP.md](AUTH_SETUP.md)**: Complete authentication system documentation
- **[TOAST_README.md](TOAST_README.md)**: Detailed toast notification guide

## 🧪 Testing the App

### Authentication Testing
1. Start the app
2. Try signup with new credentials
3. Logout and login with same credentials
4. Test token refresh (wait for access token to expire)

### Toast Testing
1. Navigate to Home → View Toast Demo
2. Test all 5 toast types
3. Try different positions (top/bottom)
4. Test custom duration and styling

## 🚀 Deployment

### Build for Production
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

### Publish Updates
```bash
npx expo publish
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Expo Community**: [Expo Discord](https://chat.expo.dev)

---

**Ready to experience the beautiful toasts?** Start the app and navigate to the Toast Demo! 🎨✨