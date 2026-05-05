const LoteModel = require('../models/loteModel');

const LoteController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await LoteModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await LoteModel.getById(req.params.id);
      const [detalle] = await LoteModel.getDetalle(req.params.id);
      res.json({ ...rows[0], productos: detalle });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  registrar: async (req, res) => {
    try {
      const lote_id = await LoteModel.registrar({
        ...req.body,
        usuario_id: req.usuario.id
      });
      res.json({ id: lote_id, message: `${req.body.tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente` });
    } catch (error) {
      const esStockError = error.message.includes('Stock insuficiente');
      res.status(esStockError ? 400 : 500).json({ error: error.message });
    }
  }
};

module.exports = LoteController;