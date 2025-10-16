// server/db/donations.db.js
// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// ðŸ’° Traer TODAS las donaciones
const getAllDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Traer UNA donaciÃ³n por ID
const getDonationById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Traer donaciones por id_padrino
const getDonationsByPadrino = async (id_padrino) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('id_padrino', id_padrino);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Traer donaciones por id_dog
const getDonationsByDog = async (id_dog) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('id_dog', id_dog);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Traer donaciones por id_need
const getDonationsByNeed = async (id_need) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('id_need', id_need);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Traer donaciones por estado
const getDonationsByState = async (state) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select('*')
      .eq('state', state);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Crear una NUEVA donaciÃ³n
const createDonation = async (donationData) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .insert([donationData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Actualizar una donaciÃ³n existente
const updateDonation = async (id, donationData) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .update(donationData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// ðŸ’° Eliminar una donaciÃ³n
const deleteDonation = async (id) => {
  try {
    const { error } = await supabase
      .from('Donations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'DonaciÃ³n eliminada correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getAllDonations,
  getDonationById,
  getDonationsByPadrino,
  getDonationsByDog,
  getDonationsByNeed,
  getDonationsByState,
  createDonation,
  updateDonation,
  deleteDonation
};