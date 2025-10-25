// Este archivo define las RUTAS (URLs) para los accesorios

import express from 'express';
import accessoriesController from '../controllers/accessories.controller.js';

const router = express.Router();

//  Rutas para los accesorios

// GET /api/accessories - Traer todos los accesorios
router.get('/', accessoriesController.getAllAccessories);

// GET /api/accessories/dog/:dogId - Traer accesorios por ID de perro
router.get('/dog/:dogId', accessoriesController.getAccessoriesByDogId);

// GET /api/accessories/user/:userId - Traer accesorios por ID de usuario
router.get('/user/:userId', accessoriesController.getAccessoriesByUserId);

// GET /api/accessories/category/:category - Traer accesorios por categoría
router.get('/category/:category', accessoriesController.getAccessoriesByCategory);

// GET /api/accessories/:id - Traer un accesorio específico por ID
router.get('/:id', accessoriesController.getAccessoryById);

// POST /api/accessories - Crear un nuevo accesorio
router.post('/', accessoriesController.createAccessory);

// PUT /api/accessories/:id - Actualizar un accesorio
router.put('/:id', accessoriesController.updateAccessory);

// DELETE /api/accessories/:id - Eliminar un accesorio
router.delete('/:id', accessoriesController.deleteAccessory);

export default router;