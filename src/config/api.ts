// API base URL configuration
// Use localhost for development, deployed backend for production
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:4000';
  }
  // TODO: Replace this with your deployed backend URL (e.g., Vercel, Railway, Render)
  return 'https://your-deployed-backend-url.com';
};

export const API_BASE_URL = getApiBaseUrl();
