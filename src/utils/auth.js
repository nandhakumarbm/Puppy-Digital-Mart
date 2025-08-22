

const TOKEN_KEY = "PuppyToken";
const USER_KEY = "PuppyUser";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  try {
    const decoded = jwtDecode(token);
    localStorage.setItem(USER_KEY, JSON.stringify(decoded));
  } catch {
    localStorage.removeItem(USER_KEY);
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getIsLoggedIn() {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      // expired
      clearAuth();
      return false;
    }
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.location.reload();
}
