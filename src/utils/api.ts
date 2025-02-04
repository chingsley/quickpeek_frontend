import axios from 'axios';
import store from '../store';

const api = axios.create({
  baseURL: 'http://192.168.2.126:3000/api/v1', // TODO: update with backend url
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  console.log('>> axios error: ', error);
  return Promise.reject(error);
});

export default api;
