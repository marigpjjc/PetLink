// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// Traer TODOS los perritos
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

// Traer UN perrito por ID
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

// Crear un NUEVO perrito
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

// Actualizar un perrito existente
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

// Eliminar un perrito
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

// NUEVO: Actualizar estadisticas de un perrito
const updateDogStatistics = async (dogId, category) => {
  try {
    // Primero traer el perro actual para obtener sus estadisticas
    const dogResult = await getDogById(dogId);
    if (!dogResult.success) {
      throw new Error('Perro no encontrado');
    }
    
    const dog = dogResult.data;
    
    // Calcular las nuevas estadisticas segun la categoria
    const updates = {};
    
    // Mapeo de categorias a campos de estadisticas
    if (category === 'salud') {
      // Salud: no puede pasar de 10
      updates.health_level = Math.min(10, (dog.health_level || 0) + 1);
    } else if (category === 'alimentacion' || category === 'comida') {
      // Alimentacion: no puede pasar de 10
      updates.food_level = Math.min(10, (dog.food_level || 0) + 1);
    } else if (category === 'accesorio') {
      // Accesorios aumentan bienestar: no puede pasar de 10
      updates.wellbeing_level = Math.min(10, (dog.wellbeing_level || 0) + 1);
    }
    
    // SIEMPRE aumentar affection_level en cualquier donacion
    updates.affection_level = Math.min(10, (dog.affection_level || 0) + 1);
    
    // Actualizar en la base de datos
    const { data, error } = await supabase
      .from('Dogs')
      .update(updates)
      .eq('id', dogId)
      .select();
    
    if (error) throw error;
    
    console.log('Estadisticas actualizadas:', updates);
    
    return { success: true, data: data[0], updates };
  } catch (error) {
    console.error('Error al actualizar estadisticas:', error);
    return { success: false, error: error.message };
  }
};

export default {
  getAllDogs,
  getDogById,
  createDog,
  updateDog,
  deleteDog,
  updateDogStatistics  // NUEVO
};