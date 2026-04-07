import axios from 'axios'
import { getToken } from './auth'

function resolveApiBaseUrl(): string {
  const configuredBase = import.meta.env.VITE_API_BASE_URL

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
