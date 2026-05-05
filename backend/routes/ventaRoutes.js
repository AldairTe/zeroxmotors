const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, VentaController.getAll);
router.get('/:id', verifyToken, VentaController.getById);
router.get('/:id/comprobante', verifyToken, VentaController.getComprobante);
router.post('/', verifyToken, VentaController.create);
router.put('/:id', verifyToken, VentaController.update);
router.delete('/:id', verifyToken, VentaController.delete);

module.exports = router;