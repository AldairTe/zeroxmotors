 
import { useEffect, useState } from 'react';
import reporteService from '../services/reporteService';

function Dashboard() {
  const [totales, setTotales] = useState({});

  useEffect(() => {
    reporteService.getVentasTotales()
      .then(res => setTotales(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Total Ventas</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">
            {totales.total_ventas || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">
            S/. {totales.ingresos_totales || '0.00'}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-500 text-sm">Estado</p>
          <p className="text-3xl font-bold text-green-500 mt-1">Activo</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;