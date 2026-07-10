import api from './api';

export const courseService = {
  getCourses: (params) => api.get('/courses', { params }),
  getCourse: (id) => api.get(`/courses/${id}`),
  getFeatured: () => api.get('/courses/featured/list'),
  createCourse: (formData) => api.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateCourse: (id, formData) => api.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteCourse: (id) => api.delete(`/courses/${id}`),
};
