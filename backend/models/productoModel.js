const db = require('../config/db');

const ProductoModel = {
  getAll: () => db.query('SELECT * FROM productos'),

  getById: (id) => db.query('SELECT * FROM productos WHERE id = ?', [id]),

  create: (data) => db.query(
    'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen) VALUES (?, ?, ?, ?, ?, ?)',
    [data.nombre, data.descripcion, data.precio, data.stock, data.categoria, data.imagen]
  ),

  update: (id, data) => db.query(
    'UPDATE productos SET nombre=?, descripcion=?, precio=?, stock=?, categoria=?, imagen=? WHERE id=?',
    [data.nombre, data.descripcion, data.precio, data.stock, data.categoria, data.imagen, id]
  ),

  delete: (id) => db.query('DELETE FROM productos WHERE id = ?', [id]),
};

module.exports = ProductoModel;