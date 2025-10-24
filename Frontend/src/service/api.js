import axios from 'axios';

const API_BASE_URL = 'https://learnx-lagoh3b4c-rezenegs-projects.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  register: (userData) => api.post('/api/users/register', userData),
  login: (credentials) => api.post('/api/users/login', credentials),
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/api/courses'),
  create: (courseData) => api.post('/api/courses', courseData),
};

export default api;
