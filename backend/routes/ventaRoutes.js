 
const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');

router.get('/', VentaController.getAll);
router.get('/:id', VentaController.getById);
router.post('/', VentaController.create);
router.put('/:id', VentaController.update);
router.delete('/:id', VentaController.delete);

module.exports = router;