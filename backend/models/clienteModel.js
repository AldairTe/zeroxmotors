const db = require('../config/db');

const ClienteModel = {
  getAll: () => db.query('SELECT * FROM clientes'),

  getById: (id) => db.query('SELECT * FROM clientes WHERE id = ?', [id]),

  create: (data) => db.query(
    'INSERT INTO clientes (tipo_documento, numero_documento, nombre, apellido, telefono, email, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [data.tipo_documento, data.numero_documento, data.nombre, data.apellido, data.telefono, data.email, data.direccion]
  ),

  update: (id, data) => db.query(
    'UPDATE clientes SET tipo_documento=?, numero_documento=?, nombre=?, apellido=?, telefono=?, email=?, direccion=? WHERE id=?',
    [data.tipo_documento, data.numero_documento, data.nombre, data.apellido, data.telefono, data.email, data.direccion, id]
  ),

  delete: (id) => db.query('DELETE FROM clientes WHERE id = ?', [id]),
};

module.exports = ClienteModel;