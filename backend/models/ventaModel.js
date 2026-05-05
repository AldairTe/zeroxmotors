const db = require('../config/db');

const VentaModel = {
  getAll: () => db.query(`
    SELECT v.*, c.nombre, c.apellido 
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
  `),

  getById: (id) => db.query(`
    SELECT v.*, c.nombre, c.apellido 
    FROM ventas v
    JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = ?
  `, [id]),

  getDetalle: (venta_id) => db.query(`
    SELECT dv.*, p.nombre, p.imagen
    FROM detalle_ventas dv
    JOIN productos p ON dv.producto_id = p.id
    WHERE dv.venta_id = ?
  `, [venta_id]),

  create: async (data) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Validar stock antes de procesar
      for (const item of data.productos) {
        const [rows] = await conn.query(
          'SELECT stock, nombre FROM productos WHERE id = ?',
          [item.producto_id]
        );
        if (rows.length === 0) throw new Error(`Producto no encontrado`);
        if (rows[0].stock < item.cantidad) {
          throw new Error(`Stock insuficiente para "${rows[0].nombre}". Disponible: ${rows[0].stock}`);
        }
      }

      const [result] = await conn.query(
        'INSERT INTO ventas (cliente_id, total, estado, fecha) VALUES (?, ?, ?, NOW())',
        [data.cliente_id, data.total, data.estado || 'pendiente']
      );
      const venta_id = result.insertId;

      for (const item of data.productos) {
        await conn.query(
          'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
          [venta_id, item.producto_id, item.cantidad, item.precio_unitario]
        );
        await conn.query(
          'UPDATE productos SET stock = stock - ? WHERE id = ?',
          [item.cantidad, item.producto_id]
        );
      }

      await conn.commit();
      return [{ insertId: venta_id }];
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
        'UPDATE ventas SET cliente_id=?, total=?, estado=? WHERE id=?',
        [data.cliente_id, data.total, data.estado, id]
      );
      await conn.query('DELETE FROM detalle_ventas WHERE venta_id = ?', [id]);
      for (const item of data.productos) {
        await conn.query(
          'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
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

  delete: (id) => db.query('DELETE FROM ventas WHERE id = ?', [id]),
};

module.exports = VentaModel;