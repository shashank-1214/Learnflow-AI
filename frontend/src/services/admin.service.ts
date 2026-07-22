import api from '@/api/axios';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  subscription: string;
  isVerified: boolean;
  createdAt: string;
}

const ADMIN_TOKEN_KEY = 'lf_admin_token';
const ADMIN_USER_KEY = 'lf_admin_user';

export const adminAuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/admin/login', { email, password });
    const { token, user } = response.data.data;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
    return { token, user };
  },

  getProfile: async (): Promise<{ success: boolean; data: { user: AdminUser } }> => {
    const response = await api.get('/admin/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  },

  getToken: (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY),

  getUser: (): AdminUser | null => {
    const raw = localStorage.getItem(ADMIN_USER_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const user = localStorage.getItem(ADMIN_USER_KEY);
    return !!(token && user);
  },
};

export const adminDataService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },

  getUsers: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/admin/users', { params: { page, limit, search } });
    return response.data.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getNotes: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/admin/notes', { params: { page, limit, search } });
    return response.data.data;
  },

  deleteNote: async (id: string) => {
    const response = await api.delete(`/admin/notes/${id}`);
    return response.data;
  },

  getUploads: async (page = 1, limit = 10, search = '') => {
    const response = await api.get('/admin/uploads', { params: { page, limit, search } });
    return response.data.data;
  },

  deleteUpload: async (id: string) => {
    const response = await api.delete(`/admin/uploads/${id}`);
    return response.data;
  },
};
