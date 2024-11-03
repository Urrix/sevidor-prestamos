const express = require('express');
const router = express.Router();
const prestamoController = require('../controllers/prestamoController');

router.post('/create', prestamoController.createPrestamo);
router.get('/cliente/:id_cliente', prestamoController.getPrestamosByCliente);
router.get('/:id_prestamo', prestamoController.getPrestamoById);
router.put('/:id_cliente/prestamo/:id_prestamo/estado', prestamoController.updatePrestamoStatus);

module.exports = router;
