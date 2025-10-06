// server/controllers/users.controller.js
// Este archivo RECIBE las peticiones y llama al servicio

import usersService from '../db/users.db.js';

// 👤 GET - Traer todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    console.log('📥 Petición recibida: GET /api/users');
    const result = await usersService.getAllUsers();
    
    if (result.success) {
      console.log('✅ Datos enviados:', result.data.length, 'usuarios');
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAllUsers:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 GET - Traer un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Petición recibida: GET /api/users/' + id);
    const result = await usersService.getUserById(id);
    
    if (result.success) {
      console.log('✅ Usuario encontrado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Usuario no encontrado');
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('❌ Error en getUserById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 GET - Traer un usuario por email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('📥 Petición recibida: GET /api/users/email/' + email);
    const result = await usersService.getUserByEmail(email);
    
    if (result.success) {
      console.log('✅ Usuario encontrado por email:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Usuario no encontrado');
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('❌ Error en getUserByEmail:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 GET - Traer un usuario por username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    console.log('📥 Petición recibida: GET /api/users/username/' + username);
    const result = await usersService.getUserByUsername(username);
    
    if (result.success) {
      console.log('✅ Usuario encontrado por username:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Usuario no encontrado');
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (error) {
    console.error('❌ Error en getUserByUsername:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 POST - Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const userData = req.body;
    console.log('📥 Petición recibida: POST /api/users', userData);
    const result = await usersService.createUser(userData);
    
    if (result.success) {
      console.log('✅ Usuario creado:', result.data);
      res.status(201).json(result.data);
    } else {
      console.log('❌ Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en createUser:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 PUT - Actualizar un usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    console.log('📥 Petición recibida: PUT /api/users/' + id, userData);
    const result = await usersService.updateUser(id, userData);
    
    if (result.success) {
      console.log('✅ Usuario actualizado:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en updateUser:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 👤 DELETE - Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📥 Petición recibida: DELETE /api/users/' + id);
    const result = await usersService.deleteUser(id);
    
    if (result.success) {
      console.log('✅ Usuario eliminado');
      res.status(200).json({ message: result.message });
    } else {
      console.log('❌ Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en deleteUser:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
};