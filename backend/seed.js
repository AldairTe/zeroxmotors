// seed.js — ejecutar solo una vez: node seed.js
const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function seed() {
  const password = await bcrypt.hash('admin123', 10);
  await db.query(`
    INSERT INTO usuarios (nombre, apellido, email, password, rol)
    VALUES ('Admin', 'ZeroxMotors', 'admin@zeroxmotors.com', ?, 'administrador')
  `, [password]);
  console.log('Usuario creado');
  process.exit();
}

seed();