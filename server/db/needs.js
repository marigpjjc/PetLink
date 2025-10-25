// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js'

// Traer TODAS las necesidades
const getAllNeeds = async () => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer UNA necesidad por ID
const getNeedById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer necesidades por ID de perro
const getNeedsByDogId = async (dogId) => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .select('*')
      .eq('id_dog', dogId);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer necesidades por estado (state)
const getNeedsByState = async (state) => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .select('*')
      .eq('state', state);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear una NUEVA necesidad
const createNeed = async (needData) => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .insert([needData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar una necesidad existente
const updateNeed = async (id, needData) => {
  try {
    const { data, error } = await supabase
      .from('Needs')
      .update(needData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar una necesidad
const deleteNeed = async (id) => {
  try {
    const { error } = await supabase
      .from('Needs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Necesidad eliminada correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};



export default {
  getAllNeeds,
  getNeedById,
  getNeedsByDogId,
  getNeedsByState,
  createNeed,
  updateNeed,
  deleteNeed
};