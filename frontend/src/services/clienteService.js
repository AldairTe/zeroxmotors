import axios from 'axios';
import { getToken } from './authService';


const BASE_URL = `${import.meta.env.VITE_API_URL}/clientes`;

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const clienteService = {
  getAll: () => axios.get(BASE_URL, { headers: headers() }),
  getById: (id) => axios.get(`${BASE_URL}/${id}`, { headers: headers() }),
  create: (data) => axios.post(BASE_URL, data, { headers: headers() }),
  update: (id, data) => axios.put(`${BASE_URL}/${id}`, data, { headers: headers() }),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`, { headers: headers() }),
};

export default clienteService;