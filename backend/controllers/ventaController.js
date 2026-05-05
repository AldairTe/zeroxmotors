const VentaModel = require('../models/ventaModel');

const VentaController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await VentaModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await VentaModel.getById(req.params.id);
      const [detalle] = await VentaModel.getDetalle(req.params.id);
      res.json({ ...rows[0], productos: detalle });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const [result] = await VentaModel.create(req.body);
      res.json({ id: result.insertId, message: 'Venta registrada correctamente' });
    } catch (error) {
      // Devuelve el error de stock como 400, no 500
      const esStockError = error.message.includes('Stock insuficiente');
      res.status(esStockError ? 400 : 500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await VentaModel.update(req.params.id, req.body);
      res.json({ message: 'Venta actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await VentaModel.delete(req.params.id);
      res.json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getComprobante: async (req, res) => {
    try {
      const [rows] = await VentaModel.getById(req.params.id);
      const [detalle] = await VentaModel.getDetalle(req.params.id);
      if (rows.length === 0) return res.status(404).json({ error: 'Venta no encontrada' });
      res.json({
        comprobante: {
          numero: `COMP-${String(rows[0].id).padStart(6, '0')}`,
          fecha: rows[0].fecha,
          cliente: `${rows[0].nombre} ${rows[0].apellido}`,
          productos: detalle,
          total: rows[0].total,
          estado: rows[0].estado
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = VentaController;