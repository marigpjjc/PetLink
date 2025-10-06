// server/routes/donations.routes.js
// Este archivo define las RUTAS (URLs) para las donaciones

import express from 'express';
import donationsController from '../controllers/donations.controller.js';

const router = express.Router();

// 🔹 Rutas para las donaciones

// GET /api/donations - Traer todas las donaciones
router.get('/', donationsController.getAllDonations);

// GET /api/donations/padrino/:id_padrino - Traer donaciones por padrino
router.get('/padrino/:id_padrino', donationsController.getDonationsByPadrino);

// GET /api/donations/dog/:id_dog - Traer donaciones por perro
router.get('/dog/:id_dog', donationsController.getDonationsByDog);

// GET /api/donations/need/:id_need - Traer donaciones por necesidad
router.get('/need/:id_need', donationsController.getDonationsByNeed);

// GET /api/donations/state/:state - Traer donaciones por estado
router.get('/state/:state', donationsController.getDonationsByState);

// GET /api/donations/:id - Traer una donación específica por ID
router.get('/:id', donationsController.getDonationById);

// POST /api/donations - Crear una nueva donación
router.post('/', donationsController.createDonation);

// PUT /api/donations/:id - Actualizar una donación
router.put('/:id', donationsController.updateDonation);

// DELETE /api/donations/:id - Eliminar una donación
router.delete('/:id', donationsController.deleteDonation);

export default router;