// Este archivo habla DIRECTAMENTE con Supabase

import supabase from '../services/supabase.service.js';

// Traer TODAS las citas
const getAllAppointments = async () => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select('*');
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer UNA cita por ID
const getAppointmentById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer citas por id_dog
const getAppointmentsByDog = async (id_dog) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select('*')
      .eq('id_dog', id_dog);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer citas por id_padrino
const getAppointmentsByPadrino = async (id_padrino) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select('*')
      .eq('id_padrino', id_padrino);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Traer citas por id_admin
const getAppointmentsByAdmin = async (id_admin) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .select('*')
      .eq('id_admin', id_admin);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Crear una NUEVA cita
const createAppointment = async (appointmentData) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .insert([appointmentData])
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Actualizar una cita existente
const updateAppointment = async (id, appointmentData) => {
  try {
    const { data, error } = await supabase
      .from('Appointments')
      .update(appointmentData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Eliminar una cita
const deleteAppointment = async (id) => {
  try {
    const { error } = await supabase
      .from('Appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true, message: 'Cita eliminada correctamente' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByDog,
  getAppointmentsByPadrino,
  getAppointmentsByAdmin,
  createAppointment,
  updateAppointment,
  deleteAppointment
};