const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { verifyToken } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

// Ruta pública
app.use('/api/auth', require('./routes/authRoutes'));

// Rutas protegidas
app.use('/api/clientes',    verifyToken, require('./routes/clienteRoutes'));
app.use('/api/productos',   verifyToken, require('./routes/productoRoutes'));
app.use('/api/ventas',      verifyToken, require('./routes/ventaRoutes'));
app.use('/api/cotizaciones',verifyToken, require('./routes/cotizacionRoutes'));
app.use('/api/reportes',    verifyToken, require('./routes/reporteRoutes'));
app.use('/api/movimientos', verifyToken, require('./routes/movimientoRoutes'));
app.use('/api/lotes', require('./routes/loteRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));