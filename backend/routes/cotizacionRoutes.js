const express = require('express');
const router = express.Router();
const CotizacionController = require('../controllers/cotizacionController');

router.get('/', CotizacionController.getAll);
router.get('/:id', CotizacionController.getById);
router.post('/', CotizacionController.create);
router.put('/:id', CotizacionController.update);
router.delete('/:id', CotizacionController.delete);
router.post('/:id/convertir', CotizacionController.convertirAVenta);

module.exports = router;