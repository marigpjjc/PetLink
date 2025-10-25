// Este archivo define las RUTAS (URLs) para los usuarios

import express from 'express';
import usersController from '../controllers/users.controller.js';

const router = express.Router();

// Rutas para los usuarios

// GET /api/users - Traer todos los usuarios
router.get('/', usersController.getAllUsers);

// GET /api/users/email/:email - Traer usuario por email
router.get('/email/:email', usersController.getUserByEmail);

// GET /api/users/username/:username - Traer usuario por username
router.get('/username/:username', usersController.getUserByUsername);

// GET /api/users/:id - Traer un usuario específico por ID
router.get('/:id', usersController.getUserById);

// POST /api/users - Crear un nuevo usuario
router.post('/', usersController.createUser);

// PUT /api/users/:id - Actualizar un usuario
router.put('/:id', usersController.updateUser);

// DELETE /api/users/:id - Eliminar un usuario
router.delete('/:id', usersController.deleteUser);

export default router;