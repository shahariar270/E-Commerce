import { useLocation } from "react-router-dom";
export const BASE = import.meta.env.VITE_API_BASE;

export const authRoute = `${BASE}/auth/`;
export const apiRoute = `${BASE}/api/`;
export const appRoute = `${window.location.origin}/dashboard`;

export const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const setCookie = (name, value, maxAgeSeconds = 3600) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}`;
};

export const getCookie = (name) => {
  return document.cookie
    .split("; ")
    .find(row => row.startsWith(name + "="))
    ?.split("=")[1];
};

export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; max-age=0`;
};


export const useAuth = () => {
  const token = getCookie("token");
  return !!token;
};