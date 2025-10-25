// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// Traer TODOS los accesorios
const getAllAccessories = async () => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer UN accesorio por ID
const getAccessoryById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer accesorios por ID de perro
const getAccessoriesByDogId = async (dogId) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .select('*')
      .eq('id_dog', dogId);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer accesorios por ID de usuario
const getAccessoriesByUserId = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .select('*')
      .eq('id_user', userId);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer accesorios por categoría
const getAccessoriesByCategory = async (category) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .select('*')
      .eq('category', category);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear un NUEVO accesorio
const createAccessory = async (accessoryData) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .insert([accessoryData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar un accesorio existente
const updateAccessory = async (id, accessoryData) => {
  try {
    const { data, error } = await supabase
      .from('Accessories')
      .update(accessoryData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar un accesorio
const deleteAccessory = async (id) => {
  try {
    const { error } = await supabase
      .from('Accessories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Accesorio eliminado correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getAllAccessories,
  getAccessoryById,
  getAccessoriesByDogId,
  getAccessoriesByUserId,
  getAccessoriesByCategory,
  createAccessory,
  updateAccessory,
  deleteAccessory
};