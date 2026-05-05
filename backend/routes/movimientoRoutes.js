const express = require('express');
const router = express.Router();
const MovimientoController = require('../controllers/movimientoController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, MovimientoController.getAll);
router.get('/:producto_id', verifyToken, MovimientoController.getByProducto);
router.post('/', verifyToken, MovimientoController.registrar);

module.exports = router;