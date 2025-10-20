// Este archivo define las RUTAS (URLs) para los perritos

import express from 'express';
import dogsController from '../controllers/dogs.controller.js';

const router = express.Router();

//  Rutas para los perritos

// GET /api/dogs - Traer todos los perritos
router.get('/', dogsController.getAllDogs);

// GET /api/dogs/search/:name - Buscar perritos por nombre
router.get('/search/:name', dogsController.searchDogsByName);

// GET /api/dogs/:id - Traer un perrito específico
router.get('/:id', dogsController.getDogById);

// POST /api/dogs - Crear un nuevo perrito
router.post('/', dogsController.createDog);

// PUT /api/dogs/:id - Actualizar un perrito
router.put('/:id', dogsController.updateDog);

// DELETE /api/dogs/:id - Eliminar un perrito
router.delete('/:id', dogsController.deleteDog);

export default router;