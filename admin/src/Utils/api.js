import { getCookie, removeCookie, getOrCreateGuestId } from './helper';

const getAuthHeader = () => {
  const token = getCookie('token');
  if (token) return { Authorization: `Bearer ${token}` };
  // Not logged in — identify as a guest so cart/checkout endpoints still work.
  return { 'X-Guest-Id': getOrCreateGuestId() };
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

  if (response.status === 401) {
    removeCookie('token');
    window.location.href = '/login';
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};