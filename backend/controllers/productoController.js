 
const ProductoModel = require('../models/productoModel');

const ProductoController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await ProductoModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await ProductoModel.getById(req.params.id);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const [result] = await ProductoModel.create(req.body);
      res.json({ id: result.insertId, message: 'Producto creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await ProductoModel.update(req.params.id, req.body);
      res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await ProductoModel.delete(req.params.id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ProductoController;