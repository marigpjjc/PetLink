// Este archivo define las RUTAS para pagos simulados

import express from 'express';
import paymentsController from '../controllers/payments.controller.js';

const router = express.Router();

// Rutas de pagos simulados

// POST /api/payments/process - Procesar un pago (simulado)
router.post('/process', paymentsController.processPayment);

// GET /api/payments/verify/:paymentId - Verificar estado de un pago
router.get('/verify/:paymentId', paymentsController.verifyPayment);

// GET /api/payments/receipt/:paymentId - Obtener recibo de un pago
router.get('/receipt/:paymentId', paymentsController.getReceipt);

// GET /api/payments/stats - Obtener estadísticas de pagos (para admin)
router.get('/stats', paymentsController.getPaymentStats);

// POST /api/payments/refund - Procesar un reembolso (simulado)
router.post('/refund', paymentsController.refundPayment);

export default router;