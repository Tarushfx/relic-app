<style>
  body {
    background-color: #0d1117;
    color: #c9d1d9;
  }
</style>

# Auth Flow Setup Guide


## Overview

This project implements a two-token authentication strategy using:

- **Access Token**: Short-lived token for API requests
- **Refresh Token**: Long-lived token to generate new access tokens
- **Secure Storage**: Tokens stored using `expo-secure-store` (encrypted)

## Architecture

### Files Created

1. **`src/context/AuthContext.js`** - Zustand store + React Context for auth state
2. **`src/context/apiClient.js`** - Axios instance with auto-refresh interceptor
3. **`src/app/_layout.jsx`** - Root layout wrapping app with AuthProvider
4. **`src/app/login.jsx`** - Login screen example

## How It Works

### Flow Diagram

```
User Login
    ↓
Send credentials to /auth/login
    ↓
Server returns { accessToken, refreshToken, user }
    ↓
Store tokens securely in device storage
    ↓
Update auth state (isAuthenticated = true)
    ↓
Router navigates to protected screens
    ↓
[Protected Screen] Makes API request with accessToken
    ↓
If 401 response → Automatically refresh token
    ↓
Retry request with new accessToken
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API URL

Update the base URL in `src/app/_layout.jsx`:

```javascript
initializeAPI("http://your-api-url.com");
```

### 3. Update Login Screen

Edit `src/app/login.jsx` and adjust the login endpoint if needed:

```javascript
const response = await api.post("/auth/login", { email, password });
```

### 4. Backend Requirements

Your backend should provide these endpoints:

#### Login Endpoint

- **Method**: POST
- **URL**: `/auth/login`
- **Request Body**:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **Response**:

  ```json
  {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": {
      "id": "123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```

#### Refresh Token Endpoint

- **Method**: POST
- **URL**: `/auth/refresh`
- **Request Body**:

  ```json
  {
    "refreshToken": "eyJ..."
  }
  ```

- **Response**:

  ```json
  {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..." // optional, can return same token
  }
  ```

## Usage

### In Components

```javascript
import { useAuth } from "../context/AuthContext";

export default function MyScreen() {
  const { user, logout, accessToken } = useAuth();

  return (
    <View>
      <Text>Welcome, {user?.name}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
}
```

### Making API Calls

```javascript
import { getAPI } from "../context/apiClient";

const api = getAPI();

// Automatically includes accessToken in headers
const response = await api.get("/api/user/profile");

// If accessToken expired, auto-refreshes and retries
```

### Hook States

```javascript
const {
  accessToken, // Current access token
  refreshToken, // Current refresh token
  user, // Logged-in user object
  isLoading, // Loading during initialization
  isAuthenticated, // True if user is logged in
  login, // Login function
  logout, // Logout function
  setUser, // Update user info
  refreshAccessToken, // Manual token refresh
} = useAuth();
```

## Protected Routes

All routes are automatically protected based on `isAuthenticated`:

- **Not authenticated** → redirected to `/login`
- **Authenticated** → navigated to `/(tabs)` (main app)

## Security Features

✅ Tokens stored securely using `expo-secure-store` (encrypted)
✅ Automatic token refresh on 401 response
✅ Tokens included in all API requests via interceptor
✅ Invalid tokens trigger logout automatically
✅ One-time state initialization on app launch

## Debugging

### Check Current User

```javascript
import { useCustomAuthStore } from "./context/AuthContext";

const { user, accessToken, refreshToken } = useCustomAuthStore();
console.log("Current user:", user);
```

### Clear All Tokens (for testing)

```javascript
import { useAuth } from "./context/AuthContext";

const { logout } = useAuth();
logout();
```

## Common Issues

### Issue: Tokens not persisting after app restart

**Solution**: Ensure `initialize()` is called on app launch (already done in `_layout.jsx`)

### Issue: 401 loop - continuously refreshing without success

**Solution**: Check your refresh endpoint - ensure it returns valid tokens

### Issue: CORS errors on localhost

**Solution**: Configure CORS on your backend to accept requests from `http://localhost:8081`

## Next Steps

1. ✅ Test login with your backend
2. ✅ Update all screens to use `useAuth()` hook
3. ✅ Implement logout in your app navigation
4. ✅ Add loading states and error handling
5. ✅ Test token refresh by setting short expiry times
