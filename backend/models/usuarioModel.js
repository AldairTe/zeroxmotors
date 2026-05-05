const db = require('../config/db');

const UsuarioModel = {
  findByEmail: (email) => db.query(
    'SELECT * FROM usuarios WHERE email = ? AND activo = 1', [email]
  ),
  findById: (id) => db.query(
    'SELECT id, nombre, apellido, email, rol FROM usuarios WHERE id = ?', [id]
  )
};

module.exports = UsuarioModel;