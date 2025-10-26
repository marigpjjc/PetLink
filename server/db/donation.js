// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// Traer TODAS las donaciones
const getAllDonations = async () => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        padrino:Users!id_padrino(id, username),
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = data.map(donation => ({
      ...donation,
      padrino_name: donation.padrino?.username || 'Anónimo',
      dog_name: donation.dog?.name || 'Desconocido',
      need_name: donation.need?.name || 'N/A',
      amount: donation.price
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer UNA donacion por ID
const getDonationById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        padrino:Users!id_padrino(id, username),
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = {
      ...data,
      padrino_name: data.padrino?.username || 'Anónimo',
      dog_name: data.dog?.name || 'Desconocido',
      need_name: data.need?.name || 'N/A',
      amount: data.price
    };
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer donaciones por id_padrino
const getDonationsByPadrino = async (id_padrino) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .eq('id_padrino', id_padrino)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = data.map(donation => ({
      ...donation,
      dog_name: donation.dog?.name || 'Desconocido',
      need_name: donation.need?.name || 'N/A',
      amount: donation.price
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer donaciones por id_dog
const getDonationsByDog = async (id_dog) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        padrino:Users!id_padrino(id, username),
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .eq('id_dog', id_dog)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = data.map(donation => ({
      ...donation,
      padrino_name: donation.padrino?.username || 'Anónimo',
      dog_name: donation.dog?.name || 'Desconocido',
      need_name: donation.need?.name || 'N/A',
      amount: donation.price
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer donaciones por id_need
const getDonationsByNeed = async (id_need) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        padrino:Users!id_padrino(id, username),
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .eq('id_need', id_need)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = data.map(donation => ({
      ...donation,
      padrino_name: donation.padrino?.username || 'Anónimo',
      dog_name: donation.dog?.name || 'Desconocido',
      need_name: donation.need?.name || 'N/A',
      amount: donation.price
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer donaciones por estado
const getDonationsByState = async (state) => {
  try {
    const { data, error } = await supabase
      .from('Donations')
      .select(`
        *,
        padrino:Users!id_padrino(id, username),
        dog:Dogs!id_dog(id, name),
        need:Needs!id_need(id, name, price)
      `)
      .eq('state', state)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transformar datos
    const transformedData = data.map(donation => ({
      ...donation,
      padrino_name: donation.padrino?.username || 'Anónimo',
      dog_name: donation.dog?.name || 'Desconocido',
      need_name: donation.need?.name || 'N/A',
      amount: donation.price
    }));
    
    return { success: true, data: transformedData };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear una NUEVA donacion
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

// Actualizar una donacion existente
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

// Eliminar una donacian
const deleteDonation = async (id) => {
  try {
    const { error } = await supabase
      .from('Donations')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Donacion eliminada correctamente' };
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