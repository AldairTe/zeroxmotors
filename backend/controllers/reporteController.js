 
const ReporteModel = require('../models/reporteModel');

const ReporteController = {
  getVentasTotales: async (req, res) => {
    try {
      const [rows] = await ReporteModel.getVentasTotales();
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getVentasPorMes: async (req, res) => {
    try {
      const [rows] = await ReporteModel.getVentasPorMes();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductosMasVendidos: async (req, res) => {
    try {
      const [rows] = await ReporteModel.getProductosMasVendidos();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getClientesFrecuentes: async (req, res) => {
    try {
      const [rows] = await ReporteModel.getClientesFrecuentes();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getCotizacionesPendientes: async (req, res) => {
    try {
      const [rows] = await ReporteModel.getCotizacionesPendientes();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ReporteController;