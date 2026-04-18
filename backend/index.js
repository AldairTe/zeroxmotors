 
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/productos', require('./routes/productoRoutes'));
app.use('/api/ventas', require('./routes/ventaRoutes'));
app.use('/api/cotizaciones', require('./routes/cotizacionRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));