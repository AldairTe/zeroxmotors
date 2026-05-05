const db = require('../config/db');

const MovimientoModel = {
  getAll: () => db.query(`
    SELECT m.*, p.nombre as producto, u.nombre as usuario
    FROM movimientos_stock m
    JOIN productos p ON m.producto_id = p.id
    LEFT JOIN usuarios u ON m.usuario_id = u.id
    ORDER BY m.fecha DESC
  `),

  getByProducto: (producto_id) => db.query(`
    SELECT m.*, u.nombre as usuario
    FROM movimientos_stock m
    LEFT JOIN usuarios u ON m.usuario_id = u.id
    WHERE m.producto_id = ?
    ORDER BY m.fecha DESC
  `, [producto_id]),

  registrar: async (data) => {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // Validar stock en salidas
      if (data.tipo === 'salida') {
        const [rows] = await conn.query(
          'SELECT stock, nombre FROM productos WHERE id = ?',
          [data.producto_id]
        );
        if (rows.length === 0) throw new Error('Producto no encontrado');
        if (rows[0].stock < data.cantidad) {
          throw new Error(`Stock insuficiente para "${rows[0].nombre}". Disponible: ${rows[0].stock}`);
        }
      }

      // Registrar movimiento
      await conn.query(
        'INSERT INTO movimientos_stock (producto_id, tipo, cantidad, motivo, usuario_id) VALUES (?, ?, ?, ?, ?)',
        [data.producto_id, data.tipo, data.cantidad, data.motivo, data.usuario_id]
      );

      // Actualizar stock
      const operacion = data.tipo === 'entrada' ? '+' : '-';
      await conn.query(
        `UPDATE productos SET stock = stock ${operacion} ? WHERE id = ?`,
        [data.cantidad, data.producto_id]
      );

      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};

module.exports = MovimientoModel;