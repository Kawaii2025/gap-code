// API base URL configuration
// Use localhost for development, deployed backend for production
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:4000';
  }
  return 'https://gap-code.vercel.app';
};

export const API_BASE_URL = getApiBaseUrl();
