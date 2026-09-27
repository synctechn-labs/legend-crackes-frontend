import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Admin JWT if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sivakasi_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Intercept 401 Unauthorized for Admin routes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and trigger event or redirect
      localStorage.removeItem('sivakasi_admin_token');
      localStorage.removeItem('sivakasi_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?session_expired=true';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Universal safe API caller:
 * Attempts the real FastAPI backend endpoint first.
 * If backend is not available (e.g. ECONNREFUSED / Network Error), it smoothly falls back
 * to the simulated mock service so that the UI is 100% testable out-of-the-box.
 */
export const executeApi = async (apiCall, fallbackCall) => {
  try {
    const response = await apiCall();
    if (response && typeof response === 'object' && 'data' in response && (response.headers || response.config)) {
      return response.data;
    }
    return response;
  } catch (error) {
    // If backend is down or unreachable, use mock fallback if provided
    if (
      (!error.response || error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) &&
      fallbackCall
    ) {
      // Simulated subtle latency for realistic UX feel
      await new Promise((r) => setTimeout(r, 220));
      return await fallbackCall();
    }
    throw error;
  }
};

export default apiClient;
