import axios from 'axios'
import { getToken } from './auth'

function resolveApiBaseUrl(): string {
  // When running in production browser on custom domain or Vercel,
  // route through same-origin reverse proxy /api to completely eliminate cross-origin CORS limitations.
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return '/api'
    }
  }

  const configuredBase = import.meta.env.VITE_API_BASE_URL || '/api'
  return configuredBase
}

const baseURL = resolveApiBaseUrl()

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default api
