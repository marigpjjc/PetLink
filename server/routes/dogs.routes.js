// server/routes/dogs.routes.js
// Este archivo define las RUTAS (URLs) para los perritos

const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogs.controller');

// 📍 Rutas para los perritos

// GET /api/dogs - Traer todos los perritos
router.get('/', dogsController.getAllDogs);

// GET /api/dogs/:id - Traer un perrito específico
router.get('/:id', dogsController.getDogById);

// POST /api/dogs - Crear un nuevo perrito
router.post('/', dogsController.createDog);

// PUT /api/dogs/:id - Actualizar un perrito
router.put('/:id', dogsController.updateDog);

// DELETE /api/dogs/:id - Eliminar un perrito
router.delete('/:id', dogsController.deleteDog);

export default router;