import axios from 'axios'
import { getToken } from './auth'

function resolveApiBaseUrl(): string {
  const configuredBase = import.meta.env.VITE_API_BASE_URL || '/api'
  if (configuredBase.startsWith('http://') || configuredBase.startsWith('https://')) {
    return configuredBase
  }

  // In local Vite dev (5173), API runs on Vercel dev (3000).
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '5173') {
    return `http://localhost:3000${configuredBase}`
  }

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
