// server/services/dogs.service.js
// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// 🐕 Traer TODOS los perritos
const getAllDogs = async () => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Traer UN perrito por ID
const getDogById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Crear un NUEVO perrito
const createDog = async (dogData) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .insert([dogData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Actualizar un perrito existente
const updateDog = async (id, dogData) => {
  try {
    const { data, error } = await supabase
      .from('Dogs')
      .update(dogData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 🐕 Eliminar un perrito
const deleteDog = async (id) => {
  try {
    const { error } = await supabase
      .from('Dogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Perrito eliminado correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog
};