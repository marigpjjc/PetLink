// server/db/users.db.js
// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// 👤 Traer TODOS los usuarios
const getAllUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Traer UN usuario por ID
const getUserById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Traer un usuario por email
const getUserByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('e-mail', email)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Traer un usuario por username
const getUserByUsername = async (username) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Crear un NUEVO usuario
const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .insert([userData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Actualizar un usuario existente
const updateUser = async (id, userData) => {
  try {
    const { data, error } = await supabase
      .from('Users')
      .update(userData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 👤 Eliminar un usuario
const deleteUser = async (id) => {
  try {
    const { error } = await supabase
      .from('Users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Usuario eliminado correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
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