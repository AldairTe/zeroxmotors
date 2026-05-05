const db = require('../config/db');

const LoteModel = {
  getAll: () => db.query(`
    SELECT l.*, u.nombre as usuario,
      COUNT(m.id) as total_productos
    FROM lotes l
    LEFT JOIN usuarios u ON l.usuario_id = u.id
    LEFT JOIN movimientos_stock m ON m.lote_id = l.id
    GROUP BY l.id
    ORDER BY l.fecha DESC
  `),

  getById: (id) => db.query(`
    SELECT l.*, u.nombre as usuario
    FROM lotes l
    LEFT JOIN usuarios u ON l.usuario_id = u.id
    WHERE l.id = ?
  `, [id]),

  getDetalle: (lote_id) => db.query(`
    SELECT m.*, p.nombre as producto, p.stock
    FROM movimientos_stock m
    JOIN productos p ON m.producto_id = p.id
    WHERE m.lote_id = ?
  `, [lote_id]),

  registrar: async (data) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Validar stock en salidas
      if (data.tipo === 'salida') {
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
      }

      // Crear lote
      const [result] = await conn.query(
        'INSERT INTO lotes (tipo, proveedor, motivo, usuario_id, fecha) VALUES (?, ?, ?, ?, ?)',
        [data.tipo, data.proveedor || null, data.motivo || null, data.usuario_id, data.fecha || new Date()]
      );
      const lote_id = result.insertId;

      // Registrar movimientos y actualizar stock
      for (const item of data.productos) {
        await conn.query(
          'INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id, lote_id) VALUES (?, ?, ?, ?, ?, ?)',
          [item.producto_id, data.tipo, item.cantidad, data.motivo || null, data.usuario_id, lote_id]
        );
        const operacion = data.tipo === 'entrada' ? '+' : '-';
        await conn.query(
          `UPDATE productos SET stock = stock ${operacion} ? WHERE id = ?`,
          [item.cantidad, item.producto_id]
        );
      }

      await conn.commit();
      return lote_id;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};

module.exports = LoteModel;