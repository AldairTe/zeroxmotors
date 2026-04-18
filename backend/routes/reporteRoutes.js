 
const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');

router.get('/ventas-totales', ReporteController.getVentasTotales);
router.get('/ventas-por-mes', ReporteController.getVentasPorMes);
router.get('/productos-mas-vendidos', ReporteController.getProductosMasVendidos);
router.get('/clientes-frecuentes', ReporteController.getClientesFrecuentes);
router.get('/cotizaciones-pendientes', ReporteController.getCotizacionesPendientes);

module.exports = router;