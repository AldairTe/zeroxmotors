const db = require('../config/db');

const CotizacionModel = {
  getAll: () => db.query(`
    SELECT co.*, c.nombre, c.apellido 
    FROM cotizaciones co
    JOIN clientes c ON co.cliente_id = c.id
  `),

  getById: (id) => db.query(`
    SELECT co.*, c.nombre, c.apellido 
    FROM cotizaciones co
    JOIN clientes c ON co.cliente_id = c.id
    WHERE co.id = ?
  `, [id]),

  getDetalle: (cotizacion_id) => db.query(`
    SELECT dc.*, p.nombre, p.imagen
    FROM detalle_cotizaciones dc
    JOIN productos p ON dc.producto_id = p.id
    WHERE dc.cotizacion_id = ?
  `, [cotizacion_id]),

  create: async (data) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        'INSERT INTO cotizaciones (cliente_id, total, estado, vigencia, fecha) VALUES (?, ?, ?, ?, NOW())',
        [data.cliente_id, data.total, data.estado || 'pendiente', data.vigencia]
      );
      const cotizacion_id = result.insertId;
      for (const item of data.productos) {
        await conn.query(
          'INSERT INTO detalle_cotizaciones (cotizacion_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [cotizacion_id, item.producto_id, item.cantidad, item.precio_unitario]
        );
      }
      await conn.commit();
      return [{ insertId: cotizacion_id }];
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  update: async (id, data) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'UPDATE cotizaciones SET cliente_id=?, total=?, estado=?, vigencia=? WHERE id=?',
        [data.cliente_id, data.total, data.estado, data.vigencia, id]
      );
      await conn.query('DELETE FROM detalle_cotizaciones WHERE cotizacion_id = ?', [id]);
      for (const item of data.productos) {
        await conn.query(
          'INSERT INTO detalle_cotizaciones (cotizacion_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [id, item.producto_id, item.cantidad, item.precio_unitario]
        );
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  delete: (id) => db.query('DELETE FROM cotizaciones WHERE id = ?', [id]),
};

module.exports = CotizacionModel;