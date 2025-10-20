// Este archivo define las RUTAS (URLs) para las necesidades

import express from 'express';
import needsController from '../controllers/needs.controller.js';

const router = express.Router();

//  Rutas para las necesidades

// GET /api/needs - Traer todas las necesidades
router.get('/', needsController.getAllNeeds);

// GET /api/needs/dog/:dogId - Traer necesidades por ID de perro
router.get('/dog/:dogId', needsController.getNeedsByDogId);

// GET /api/needs/state/:state - Traer necesidades por estado
router.get('/state/:state', needsController.getNeedsByState);

// GET /api/needs/:id - Traer una necesidad específica por ID
router.get('/:id', needsController.getNeedById);

// POST /api/needs - Crear una nueva necesidad
router.post('/', needsController.createNeed);

// PUT /api/needs/:id - Actualizar una necesidad
router.put('/:id', needsController.updateNeed);

// DELETE /api/needs/:id - Eliminar una necesidad
router.delete('/:id', needsController.deleteNeed);

export default router;