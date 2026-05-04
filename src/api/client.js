import axios from 'axios';

const client = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo limpiar token, NO redirigir aquí
      // El AuthContext y PrivateRoute manejarán la redirección
      localStorage.removeItem('token');
    }
    if (error.response?.status === 403) {
      const msg = error.response?.data?.error || 'No tenés permiso para hacer eso.';
      window.dispatchEvent(new CustomEvent('toast-error', { detail: msg }));
    }
    if (!error.response && error.message === 'Network Error') {
      window.dispatchEvent(new CustomEvent('toast-error', { detail: 'Parece que no hay conexión. Verificá tu internet.' }));
    }
    return Promise.reject(error);
  }
);

export default client;
