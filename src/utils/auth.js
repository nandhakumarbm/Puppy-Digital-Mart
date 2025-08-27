import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "PuppyToken";
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

// Token Management
export function setToken(token) {
  if (!token) {
    console.warn("Attempted to set empty token");
    return false;
  }

  try {
    // Validate token before storing
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      console.warn("Attempted to set expired token");
      return false;
    }

    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error("Invalid token format:", error);
    return false;
  }
}

export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Validate token on retrieval
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 <= Date.now()) {
      clearAuth();
      return null;
    }

    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    clearAuth();
    return null;
  }
}

export function getUser() {
  try {
    const token = getToken();
    if (!token) return null;

    const decoded = jwtDecode(token);

    // Return user data with additional metadata
    return {
      id: decoded.id || decoded.userId || decoded.sub,
      role: decoded.role,
      // Include any other fields your JWT contains
      ...decoded,
      // Remove sensitive fields if needed
      exp: undefined,
      iat: undefined,
      iss: undefined,
    };
  } catch (error) {
    console.error("Error decoding user from token:", error);
    return null;
  }
}

export function getIsLoggedIn() {
  try {
    const token = getToken(); // This already validates expiry
    return !!token;
  } catch (error) {
    console.error("Error checking login status:", error);
    return false;
  }
}

// Enhanced authentication checks
export function isTokenExpired(token = null) {
  try {
    const tokenToCheck = token || getToken();
    if (!tokenToCheck) return true;

    const decoded = jwtDecode(tokenToCheck);
    return decoded.exp && decoded.exp * 1000 <= Date.now();
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true;
  }
}

export function isTokenExpiringSoon(token = null) {
  try {
    const tokenToCheck = token || getToken();
    if (!tokenToCheck) return true;

    const decoded = jwtDecode(tokenToCheck);
    if (!decoded.exp) return false;

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    return expirationTime - currentTime <= REFRESH_THRESHOLD;
  } catch (error) {
    console.error("Error checking token refresh threshold:", error);
    return true;
  }
}

export function getTokenExpirationTime(token = null) {
  try {
    const tokenToCheck = token || getToken();
    if (!tokenToCheck) return null;

    const decoded = jwtDecode(tokenToCheck);
    return decoded.exp ? new Date(decoded.exp * 1000) : null;
  } catch (error) {
    console.error("Error getting token expiration:", error);
    return null;
  }
}

// Role-based access control
export function hasRole(requiredRole) {
  const user = getUser();
  if (!user || !user.role) return false;

  return user.role === requiredRole;
}

export function hasAnyRole(roles = []) {
  const user = getUser();
  if (!user || !user.role) return false;

  return roles.includes(user.role);
}

export function isAdmin() {
  return hasRole("admin");
}

export function isUser() {
  return hasRole("user");
}

// Session management
export function clearAuth(options = {}) {
  const { silent = false, redirect = true, reloadPage = false } = options;

  try {
    // Clear token
    localStorage.removeItem(TOKEN_KEY);

    // Clear any other auth-related data if needed
    // localStorage.removeItem('refreshToken');
    // sessionStorage.clear(); // if you use sessionStorage

    if (!silent) {
      console.log("Authentication cleared");
    }

    // Handle post-logout actions
    if (reloadPage) {
      window.location.reload();
    } else if (redirect) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
  } catch (error) {
    console.error("Error clearing authentication:", error);
    // Force reload as fallback
    window.location.reload();
  }
}

export function logout(options = {}) {
  // You might want to call an API endpoint to invalidate the token server-side
  // await logoutAPI();

  clearAuth({
    redirect: true,
    reloadPage: false,
    ...options,
  });
}

// Utility functions for token management
export function refreshAuthState() {
  // Force re-check of authentication state
  const isValid = getIsLoggedIn();
  if (!isValid) {
    clearAuth({ silent: true });
  }
  return isValid;
}

export function getAuthHeader() {
  const token = getToken();
  return token ? `Bearer ${token}` : null;
}

export function validateTokenStructure(token) {
  try {
    const decoded = jwtDecode(token);

    // Check for required fields
    const requiredFields = ["id", "role", "exp"];
    const missingFields = requiredFields.filter(
      (field) =>
        !decoded.hasOwnProperty(field) &&
        !decoded.hasOwnProperty(
          field.replace("id", "userId").replace("id", "sub")
        )
    );

    if (missingFields.length > 0) {
      console.warn("Token missing required fields:", missingFields);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Invalid token structure:", error);
    return false;
  }
}

// Event listeners for storage changes (multi-tab sync)
export function initializeAuthSync() {
  window.addEventListener("storage", (event) => {
    if (event.key === TOKEN_KEY) {
      if (event.newValue === null) {
        // Token was cleared in another tab
        clearAuth({ silent: true, redirect: false, reloadPage: true });
      } else if (event.oldValue !== event.newValue) {
        // Token was updated in another tab
        window.location.reload();
      }
    }
  });
}

// Auto-initialize sync when module loads
if (typeof window !== "undefined") {
  initializeAuthSync();
}

// Enhanced error handling
export function handleAuthError(error) {
  console.error("Authentication error:", error);

  if (error?.response?.status === 401 || error?.status === 401) {
    clearAuth({ silent: true });
    return { shouldRetry: false, redirectToLogin: true };
  }

  if (error?.response?.status === 403 || error?.status === 403) {
    return {
      shouldRetry: false,
      redirectToLogin: false,
      showError: "Access denied",
    };
  }

  return { shouldRetry: true, redirectToLogin: false };
}

// Debug utilities (remove in production)
export function debugAuthState() {
  if (process.env.NODE_ENV !== "development") return;

  console.group("Auth Debug State");
  console.log("Token exists:", !!getToken());
  console.log("Is logged in:", getIsLoggedIn());
  console.log("User:", getUser());
  console.log("Token expiry:", getTokenExpirationTime());
  console.log("Token expiring soon:", isTokenExpiringSoon());
  console.groupEnd();
}
