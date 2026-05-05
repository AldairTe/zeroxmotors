const MovimientoModel = require('../models/movimientoModel');

const MovimientoController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await MovimientoModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getByProducto: async (req, res) => {
    try {
      const [rows] = await MovimientoModel.getByProducto(req.params.producto_id);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  registrar: async (req, res) => {
    try {
      await MovimientoModel.registrar({
        ...req.body,
        usuario_id: req.usuario.id
      });
      res.json({ message: `${req.body.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente` });
    } catch (error) {
      const esStockError = error.message.includes('Stock insuficiente');
      res.status(esStockError ? 400 : 500).json({ error: error.message });
    }
  }
};

module.exports = MovimientoController;