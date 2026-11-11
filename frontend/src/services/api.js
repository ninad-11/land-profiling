import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: API_BASE_URL
    ? `${API_BASE_URL.replace(/\/$/, '')}/api`
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api
