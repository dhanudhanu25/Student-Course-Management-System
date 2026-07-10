import api from './api';

export const studentService = {
  getStudents: (params) => api.get('/students', { params }),
  getStudent: (id) => api.get(`/students/${id}`),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};
