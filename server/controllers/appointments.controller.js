// server/controllers/appointments.controller.js
// Este archivo RECIBE las peticiones y llama al servicio

import appointmentsService from '../db/appoinments.js';

// 📅 GET - Traer todas las citas
const getAllAppointments = async (req, res) => {
  try {
    console.log('🔥 Petición recibida: GET /api/appointments');
    const result = await appointmentsService.getAllAppointments();
    
    if (result.success) {
      console.log('✅ Datos enviados:', result.data.length, 'citas');
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAllAppointments:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 GET - Traer una cita por ID
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: GET /api/appointments/' + id);
    const result = await appointmentsService.getAppointmentById(id);
    
    if (result.success) {
      console.log('✅ Cita encontrada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Cita no encontrada');
      res.status(404).json({ error: 'Cita no encontrada' });
    }
  } catch (error) {
    console.error('❌ Error en getAppointmentById:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 GET - Traer citas por id_dog
const getAppointmentsByDog = async (req, res) => {
  try {
    const { id_dog } = req.params;
    console.log('🔥 Petición recibida: GET /api/appointments/dog/' + id_dog);
    const result = await appointmentsService.getAppointmentsByDog(id_dog);
    
    if (result.success) {
      console.log('✅ Citas encontradas para el perro:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAppointmentsByDog:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 GET - Traer citas por id_padrino
const getAppointmentsByPadrino = async (req, res) => {
  try {
    const { id_padrino } = req.params;
    console.log('🔥 Petición recibida: GET /api/appointments/padrino/' + id_padrino);
    const result = await appointmentsService.getAppointmentsByPadrino(id_padrino);
    
    if (result.success) {
      console.log('✅ Citas encontradas para el padrino:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAppointmentsByPadrino:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 GET - Traer citas por id_admin
const getAppointmentsByAdmin = async (req, res) => {
  try {
    const { id_admin } = req.params;
    console.log('🔥 Petición recibida: GET /api/appointments/admin/' + id_admin);
    const result = await appointmentsService.getAppointmentsByAdmin(id_admin);
    
    if (result.success) {
      console.log('✅ Citas encontradas para el admin:', result.data.length);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en getAppointmentsByAdmin:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 POST - Crear una nueva cita
const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    console.log('🔥 Petición recibida: POST /api/appointments', appointmentData);
    const result = await appointmentsService.createAppointment(appointmentData);
    
    if (result.success) {
      console.log('✅ Cita creada:', result.data);
      res.status(201).json(result.data);
    } else {
      console.log('❌ Error al crear:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en createAppointment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 PUT - Actualizar una cita
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointmentData = req.body;
    console.log('🔥 Petición recibida: PUT /api/appointments/' + id, appointmentData);
    const result = await appointmentsService.updateAppointment(id, appointmentData);
    
    if (result.success) {
      console.log('✅ Cita actualizada:', result.data);
      res.status(200).json(result.data);
    } else {
      console.log('❌ Error al actualizar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en updateAppointment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 📅 DELETE - Eliminar una cita
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔥 Petición recibida: DELETE /api/appointments/' + id);
    const result = await appointmentsService.deleteAppointment(id);
    
    if (result.success) {
      console.log('✅ Cita eliminada');
      res.status(200).json({ message: result.message });
    } else {
      console.log('❌ Error al eliminar:', result.error);
      res.status(400).json({ error: result.error });
    }
  } catch (error) {
    console.error('❌ Error en deleteAppointment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
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