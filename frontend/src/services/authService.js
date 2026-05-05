import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const login = async (email, password) => {
  const { data } = await axios.post(`${API}/auth/login`, { email, password });
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};

export const getToken = () => localStorage.getItem('token');
export const getUsuario = () => JSON.parse(localStorage.getItem('usuario'));
export const isAuthenticated = () => !!getToken();