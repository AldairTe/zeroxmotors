import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = `${import.meta.env.VITE_API_URL}/movimientos`;
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const movimientoService = {
  getAll: () => axios.get(BASE_URL, { headers: headers() }),
  getByProducto: (producto_id) => axios.get(`${BASE_URL}/${producto_id}`, { headers: headers() }),
  registrar: (data) => axios.post(BASE_URL, data, { headers: headers() }),
};

export default movimientoService;