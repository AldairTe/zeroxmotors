const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const UsuarioModel = require('../models/usuarioModel');

const AuthController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const [rows] = await UsuarioModel.findByEmail(email);
            if (rows.length === 0)
                return res.status(401).json({ error: 'Credenciales incorrectas' });

            const usuario = rows[0];

            // Verificar password
            const valid = await bcrypt.compare(password, usuario.password);
            if (!valid)
                return res.status(401).json({ error: 'Credenciales incorrectas' });

            // Generar token
            const token = jwt.sign(
                { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.json({
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    apellido: usuario.apellido,
                    email: usuario.email,
                    rol: usuario.rol
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    register: async (req, res) => {
        try {
            const { nombre, apellido, email, password, rol } = req.body;
            const hash = await bcrypt.hash(password, 10);
            await db.query(
                'INSERT INTO usuarios (nombre, apellido, email, password, rol) VALUES (?, ?, ?, ?, ?)',
                [nombre, apellido, email, hash, rol]
            );
            res.json({ mensaje: 'Usuario creado correctamente' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

  me: async (req, res) => {
        const [rows] = await UsuarioModel.findById(req.usuario.id);
        res.json(rows[0]);
    }
};

module.exports = AuthController;