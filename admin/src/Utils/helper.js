import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
export const BASE = import.meta.env.VITE_API_BASE;

export const authRoute = `${BASE}/auth/`;
export const apiRoute = `${BASE}/api/`;
export const appRoute = `${window.location.origin}/dashboard`;

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const setCookie = (name, value, maxAgeSeconds = 3600) => {
  const cookieString = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      const value = cookie.substring(nameEQ.length);
      let decodedValue;
      try {
        decodedValue = decodeURIComponent(value);
      } catch (e) {
        decodedValue = value;
      }

      // If checking for token, verify it's not expired
      if (name === 'token' && decodedValue) {
        try {
          const decoded = jwtDecode(decodedValue);
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            removeCookie('token');
            return null;
          }
        } catch (e) {
          // If token is invalid/malformed, remove it
          removeCookie('token');
          return null;
        }
      }

      return decodedValue;
    }
  }
  return null;
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

// Stable per-browser identity for anonymous (not logged in) shoppers, so
// their cart/orders survive page reloads without requiring an account.
export const getOrCreateGuestId = () => {
  let guestId = localStorage.getItem('guest_id');
  if (!guestId) {
    guestId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('guest_id', guestId);
  }
  return guestId;
};


export const useAuth = () => {
  const token = getCookie("token");
  return !!token;
};

export const sliceString = (str, maxLength) => {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + "...";
}
