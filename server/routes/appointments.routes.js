// Este archivo define las RUTAS (URLs) para las citas

import express from 'express';
import appointmentsController from '../controllers/appointments.controller.js';

const router = express.Router();

// 🔹 Rutas para las citas

// GET /api/appointments - Traer todas las citas
router.get('/', appointmentsController.getAllAppointments);

// PUT /api/appointments/decision/:id - Aceptar o rechazar cita (con WhatsApp automático)
router.put('/decision/:id', appointmentsController.handleAppointmentDecision);

// GET /api/appointments/dog/:id_dog - Traer citas por perro
router.get('/dog/:id_dog', appointmentsController.getAppointmentsByDog);

// GET /api/appointments/padrino/:id_padrino - Traer citas por padrino
router.get('/padrino/:id_padrino', appointmentsController.getAppointmentsByPadrino);

// GET /api/appointments/admin/:id_admin - Traer citas por admin
router.get('/admin/:id_admin', appointmentsController.getAppointmentsByAdmin);

// GET /api/appointments/:id - Traer una cita específica por ID
router.get('/:id', appointmentsController.getAppointmentById);

// POST /api/appointments - Crear una nueva cita
router.post('/', appointmentsController.createAppointment);

// PUT /api/appointments/:id - Actualizar una cita
router.put('/:id', appointmentsController.updateAppointment);

// DELETE /api/appointments/:id - Eliminar una cita
router.delete('/:id', appointmentsController.deleteAppointment);

export default router;