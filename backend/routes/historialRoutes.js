const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialController');

router.post('/registrar', historialController.registrarConsultaHistorial);
router.get('/:id_cliente', historialController.obtenerHistorialPorCliente);
router.post('/calcularAmortizacion', historialController.calcularAmortizacion);

module.exports = router;
