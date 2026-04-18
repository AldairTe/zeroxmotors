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
      res.status(500).json({ error: error.message });
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
};

module.exports = VentaController;