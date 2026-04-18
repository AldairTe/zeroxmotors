 
import { useEffect, useState } from 'react';
import reporteService from '../services/reporteService';

function Reportes() {
  const [ventasTotales, setVentasTotales] = useState({});
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [cotizacionesPendientes, setCotizacionesPendientes] = useState([]);

  useEffect(() => {
    reporteService.getVentasTotales().then(res => setVentasTotales(res.data));
    reporteService.getProductosMasVendidos().then(res => setProductosMasVendidos(res.data));
    reporteService.getClientesFrecuentes().then(res => setClientesFrecuentes(res.data));
    reporteService.getCotizacionesPendientes().then(res => setCotizacionesPendientes(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reportes Gerenciales</h2>

      {/* Resumen general */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Ventas Pagadas</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{ventasTotales.total_ventas || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">S/. {ventasTotales.ingresos_totales || '0.00'}</p>
        </div>
      </div>

      {/* Productos más vendidos */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Productos más vendidos</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Producto</th>
              <th className="px-4 py-3 text-left">Total vendido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {productosMasVendidos.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.nombre}</td>
                <td className="px-4 py-3">{p.total_vendido} unid.</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Clientes frecuentes */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Clientes frecuentes</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Compras</th>
              <th className="px-4 py-3 text-left">Total gastado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientesFrecuentes.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">{c.total_compras}</td>
                <td className="px-4 py-3">S/. {c.total_gastado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cotizaciones pendientes */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Cotizaciones pendientes</h3>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Vigencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cotizacionesPendientes.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{c.nombre} {c.apellido}</td>
                <td className="px-4 py-3">S/. {c.total}</td>
                <td className="px-4 py-3">{c.vigencia?.split('T')[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reportes;