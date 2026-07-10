import api from './api';

export const authService = {
  signup: (formData) => api.post('/auth/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  login: (data) => api.post('/auth/login', data),
  adminLogin: (data) => api.post('/auth/admin-login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (formData) => api.put('/auth/update-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  changePassword: (data) => api.put('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};
