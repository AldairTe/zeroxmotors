import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = `${import.meta.env.VITE_API_URL}/reportes`;

const headers = () => ({ Authorization: `Bearer ${getToken()}` });

const reporteService = {
  getVentasTotales: () => axios.get(`${BASE_URL}/ventas-totales`, { headers: headers() }),
  getVentasPorMes: () => axios.get(`${BASE_URL}/ventas-por-mes`, { headers: headers() }),
  getProductosMasVendidos: () => axios.get(`${BASE_URL}/productos-mas-vendidos`, { headers: headers() }),
  getClientesFrecuentes: () => axios.get(`${BASE_URL}/clientes-frecuentes`, { headers: headers() }),
  getCotizacionesPendientes: () => axios.get(`${BASE_URL}/cotizaciones-pendientes`, { headers: headers() }),
};

export default reporteService;