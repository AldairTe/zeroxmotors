const express = require('express');
const router = express.Router();
const LoteController = require('../controllers/loteController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, LoteController.getAll);
router.get('/:id', verifyToken, LoteController.getById);
router.post('/', verifyToken, LoteController.registrar);

module.exports = router;