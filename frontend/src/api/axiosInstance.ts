import axios from 'axios';
import { env } from '../config/env';

export const axiosInstance = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Resiliência de Sessão: Se receber 401 (Unauthorized), limpa e redireciona para home
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('[Axios] Sessão expirada ou não autorizada. Redirecionando para login.');
      // Evita loops se já estiver na home
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);
