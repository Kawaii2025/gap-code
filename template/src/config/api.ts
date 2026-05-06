const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:4000'
  }
  // Replace with your production backend URL!
  return 'https://your-backend.vercel.app'
}

export const API_BASE_URL = getApiBaseUrl()
