// Este archivo define las RUTAS para autenticación

import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

// Rutas de autenticación

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', authController.register);

// POST /api/auth/verify - Verificar token
router.post('/verify', authController.verifyToken);

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', authController.logout);

export default router;