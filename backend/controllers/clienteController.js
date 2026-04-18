 
const ClienteModel = require('../models/clienteModel');

const ClienteController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await ClienteModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await ClienteModel.getById(req.params.id);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const [result] = await ClienteModel.create(req.body);
      res.json({ id: result.insertId, message: 'Cliente creado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await ClienteModel.update(req.params.id, req.body);
      res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await ClienteModel.delete(req.params.id);
      res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = ClienteController;