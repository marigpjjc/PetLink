// Este archivo define las RUTAS para las estadísticas

import express from 'express';
import statisticsController from '../controllers/statistics.controller.js';

const router = express.Router();

// GET /api/statistics/:id - Traer estadísticas de un perro
router.get('/:id', statisticsController.getDogStatistics);

export default router;