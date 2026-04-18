 
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_API_URL}/reportes`;

const reporteService = {
  getVentasTotales: () => axios.get(`${BASE_URL}/ventas-totales`),
  getVentasPorMes: () => axios.get(`${BASE_URL}/ventas-por-mes`),
  getProductosMasVendidos: () => axios.get(`${BASE_URL}/productos-mas-vendidos`),
  getClientesFrecuentes: () => axios.get(`${BASE_URL}/clientes-frecuentes`),
  getCotizacionesPendientes: () => axios.get(`${BASE_URL}/cotizaciones-pendientes`),
};

export default reporteService;