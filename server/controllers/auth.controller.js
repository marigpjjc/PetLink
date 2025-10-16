// Este archivo maneja el LOGIN y REGISTRO simulado

import usersService from '../db/users.db.js';

// LOGIN - Simular inicio de sesión
const login = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    console.log('🔐 Petición recibida: POST /api/auth/login', { username, email });
    
    // Validar que al menos uno esté presente
    if (!username && !email) {
      return res.status(400).json({ 
        error: 'Debes proporcionar username o email' 
      });
    }
    
    // Buscar usuario por username o email
    let result;
    if (username) {
      result = await usersService.getUserByUsername(username);
    } else {
      result = await usersService.getUserByEmail(email);
    }
    
    if (!result.success) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    const user = result.data;
    
    // enerar token fake (solo el ID del usuario como string)
    const fakeToken = `token_${user.id}_${Date.now()}`;
    
    console.log('Login exitoso:', user.username);
    console.log('Token generado:', fakeToken);
    
    // Devolver datos del usuario + token
    res.status(200).json({
      success: true,
      message: '¡Login exitoso!',
      token: fakeToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user['e-mail'],
        rol: user.rol,
        phone_number: user.phone_number
      }
    });
    
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// REGISTER - Crear nuevo usuario (simulado)
const register = async (req, res) => {
  try {
    const userData = req.body;
    console.log('Petición recibida: POST /api/auth/register', userData);
    
    // Validar campos obligatorios
    if (!userData.username || !userData['e-mail'] || !userData.name) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios: username, email, name' 
      });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await usersService.getUserByUsername(userData.username);
    if (existingUser.success) {
      console.log('Usuario ya existe');
      return res.status(409).json({ 
        error: 'El username ya está en uso' 
      });
    }
    
    // Verificar si el email ya existe
    const existingEmail = await usersService.getUserByEmail(userData['e-mail']);
    if (existingEmail.success) {
      console.log('Email ya existe');
      return res.status(409).json({ 
        error: 'El email ya está registrado' 
      });
    }
    
    // Asignar rol por defecto si no se proporciona
    if (!userData.rol) {
      userData.rol = 'padrino'; // Por defecto es padrino
    }
    
    // Crear el usuario
    const result = await usersService.createUser(userData);
    
    if (!result.success) {
      console.log('Error al crear usuario:', result.error);
      return res.status(400).json({ error: result.error });
    }
    
    const newUser = result.data;
    
    // Generar token fake
    const fakeToken = `token_${newUser.id}_${Date.now()}`;
    
    console.log('Usuario registrado:', newUser.username);
    console.log('Token generado:', fakeToken);
    
    // Devolver usuario + token
    res.status(201).json({
      success: true,
      message: '¡Usuario registrado exitosamente!',
      token: fakeToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser['e-mail'],
        rol: newUser.rol,
        phone_number: newUser.phone_number
      }
    });
    
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// VERIFY TOKEN - Verificar si un token es válido (simulado)
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    console.log('Petición recibida: POST /api/auth/verify', { token });
    
    if (!token) {
      return res.status(400).json({ 
        error: 'Token no proporcionado' 
      });
    }
    
    // Extraer el ID del token (formato: token_123_1234567890)
    const parts = token.split('_');
    if (parts.length !== 3 || parts[0] !== 'token') {
      return res.status(401).json({ 
        error: 'Token inválido' 
      });
    }
    
    const userId = parseInt(parts[1]);
    
    // Buscar el usuario
    const result = await usersService.getUserById(userId);
    
    if (!result.success) {
      return res.status(401).json({ 
        error: 'Token inválido o usuario no encontrado' 
      });
    }
    
    const user = result.data;
    
    console.log('Token válido para usuario:', user.username);
    
    res.status(200).json({
      success: true,
      message: 'Token válido',
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user['e-mail'],
        rol: user.rol,
        phone_number: user.phone_number
      }
    });
    
  } catch (error) {
    console.error('Error en verifyToken:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// LOGOUT - Cerrar sesión (simulado, solo devuelve mensaje)
const logout = async (req, res) => {
  try {
    console.log('Petición recibida: POST /api/auth/logout');
    
    // En un sistema real, aquí invalidarías el token
    // Como es simulado, solo devolvemos un mensaje
    
    res.status(200).json({
      success: true,
      message: 'Logout exitoso'
    });
    
  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  login,
  register,
  verifyToken,
  logout
};