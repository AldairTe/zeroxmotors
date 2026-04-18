const CotizacionModel = require('../models/cotizacionModel');
const VentaModel = require('../models/ventaModel');

const CotizacionController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await CotizacionModel.getAll();
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await CotizacionModel.getById(req.params.id);
      const [detalle] = await CotizacionModel.getDetalle(req.params.id);
      res.json({ ...rows[0], productos: detalle });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  create: async (req, res) => {
    try {
      const [result] = await CotizacionModel.create(req.body);
      res.json({ id: result.insertId, message: 'Cotización creada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      await CotizacionModel.update(req.params.id, req.body);
      res.json({ message: 'Cotización actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      await CotizacionModel.delete(req.params.id);
      res.json({ message: 'Cotización eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  convertirAVenta: async (req, res) => {
    try {
      const [rows] = await CotizacionModel.getById(req.params.id);
      const [detalle] = await CotizacionModel.getDetalle(req.params.id);
      const cotizacion = rows[0];

      const ventaData = {
        cliente_id: cotizacion.cliente_id,
        total: cotizacion.total,
        estado: 'pendiente',
        productos: detalle.map(d => ({
          producto_id: d.producto_id,
          cantidad: d.cantidad,
          precio_unitario: d.precio_unitario,
        })),
      };

      const [result] = await VentaModel.create(ventaData);
      await CotizacionModel.update(req.params.id, { ...cotizacion, estado: 'aprobado', productos: detalle });
      res.json({ id: result.insertId, message: 'Cotización convertida a venta correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CotizacionController;