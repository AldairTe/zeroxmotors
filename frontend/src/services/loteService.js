import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = `${import.meta.env.VITE_API_URL}/lotes`;
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const loteService = {
  getAll: () => axios.get(BASE_URL, { headers: headers() }),
  getById: (id) => axios.get(`${BASE_URL}/${id}`, { headers: headers() }),
  registrar: (data) => axios.post(BASE_URL, data, { headers: headers() }),
};

export default loteService;