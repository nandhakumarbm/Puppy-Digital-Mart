import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "PuppyToken";

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}

export function getUser() {
  try {
    const token = getToken();
    if (!token) return null;
    return jwtDecode(token); // decode on the fly instead of storing
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
  window.location.reload();
}
