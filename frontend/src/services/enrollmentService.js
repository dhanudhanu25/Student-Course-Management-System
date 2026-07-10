import api from './api';

export const enrollmentService = {
  enroll: (courseId) => api.post('/enrollments', { courseId }),
  getEnrollments: (params) => api.get('/enrollments', { params }),
  deleteEnrollment: (id) => api.delete(`/enrollments/${id}`),
  updateProgress: (id, progress) => api.put(`/enrollments/progress/${id}`, { progress }),
  getRecentActivity: () => api.get('/enrollments/recent'),
};
