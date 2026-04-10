import { getCookie } from './helper';

const getAuthHeader = () => {
  const token = getCookie('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiClient = async (endpoint, options = {}) => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};