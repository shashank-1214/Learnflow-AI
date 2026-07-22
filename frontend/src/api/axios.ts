import axios from 'axios';
import toast from 'react-hot-toast';

// Create base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url?.startsWith('/admin');
    const token = isAdminRoute ? localStorage.getItem('lf_admin_token') : localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling & Auto-Logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if the response exists
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized (Invalid or expired token)
      if (status === 401) {
        const isAdminRoute = error.config?.url?.startsWith('/admin');
        
        if (isAdminRoute) {
          localStorage.removeItem('lf_admin_token');
          localStorage.removeItem('lf_admin_user');
          if (window.location.pathname !== '/admin/login') {
            toast.error('Admin session expired. Please log in again.');
            setTimeout(() => {
              window.location.href = '/admin/login';
            }, 1000);
          }
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/auth/login' && window.location.pathname !== '/auth/register') {
            toast.error('Session expired. Please log in again.');
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 1000);
          }
        }
      } 
      // Handle standard API errors with toast
      else if (data && data.message) {
        // We only toast automatically for 500s or unexpected errors to avoid spamming
        // Form validations (400) should be handled by the component's UI
        if (status >= 500) {
          toast.error(data.message || 'An unexpected error occurred.');
        }
      }
    } else {
      // Network errors (Server down)
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
