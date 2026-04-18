 
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/productos`;

const productoService = {
  getAll: () => axios.get(BASE_URL),
  getById: (id) => axios.get(`${BASE_URL}/${id}`),
  create: (data) => axios.post(BASE_URL, data),
  update: (id, data) => axios.put(`${BASE_URL}/${id}`, data),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`),
};

export default productoService;