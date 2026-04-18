 
const db = require('../config/db');

const ReporteModel = {
  getVentasTotales: () => db.query(`
    SELECT COUNT(*) as total_ventas, SUM(total) as ingresos_totales
    FROM ventas
    WHERE estado = 'pagado'
  `),

  getVentasPorMes: () => db.query(`
    SELECT MONTH(fecha) as mes, COUNT(*) as total_ventas, SUM(total) as ingresos
    FROM ventas
    WHERE estado = 'pagado'
    GROUP BY MONTH(fecha)
    ORDER BY mes
  `),

  getProductosMasVendidos: () => db.query(`
    SELECT p.nombre, SUM(dv.cantidad) as total_vendido
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    GROUP BY p.id
    ORDER BY total_vendido DESC
    LIMIT 5
  `),

  getClientesFrecuentes: () => db.query(`
    SELECT c.nombre, c.apellido, COUNT(v.id) as total_compras, SUM(v.total) as total_gastado
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    GROUP BY c.id
    ORDER BY total_compras DESC
    LIMIT 5
  `),

  getCotizacionesPendientes: () => db.query(`
    SELECT co.*, c.nombre, c.apellido
    FROM cotizaciones co
    JOIN clientes c ON co.cliente_id = c.id
    WHERE co.estado = 'pendiente'
  `),
};

module.exports = ReporteModel;