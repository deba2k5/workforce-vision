import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
  logout: () => apiClient.post('/auth/logout'),
  getCurrentUser: () => apiClient.get('/auth/me'),
}

// Work Tracking API
export const workTrackingAPI = {
  saveWorkData: (data: any) => apiClient.post('/work-tracking/save', data),
  getWorkDataRange: (employeeId: string, startDate: string, endDate: string) =>
    apiClient.get('/work-tracking/range', {
      params: { employeeId, startDate, endDate },
    }),
  saveTask: (task: any) => apiClient.post('/work-tracking/task', task),
  getTasks: (employeeId: string, status?: string) =>
    apiClient.get('/work-tracking/tasks', {
      params: { employeeId, status },
    }),
  recordLogin: (employeeId: string, location?: string) =>
    apiClient.post('/work-tracking/login', {
      employeeId,
      loginTime: new Date().toISOString(),
      location,
    }),
  recordLogout: (sessionId: string) =>
    apiClient.post('/work-tracking/logout', {
      sessionId,
      logoutTime: new Date().toISOString(),
    }),
  getLoginRecords: (employeeId: string, startDate: string, endDate: string) =>
    apiClient.get('/work-tracking/logins', {
      params: { employeeId, startDate, endDate },
    }),
  saveHeatmapData: (data: any) => apiClient.post('/work-tracking/heatmap', data),
  getProductivitySummary: (employeeId: string, startDate: string, endDate: string) =>
    apiClient.get('/work-tracking/productivity-summary', {
      params: { employeeId, startDate, endDate },
    }),
}

export default apiClient
