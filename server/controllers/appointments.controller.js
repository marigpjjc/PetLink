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

// 📱 PUT - Aceptar o rechazar una cita (envía WhatsApp automáticamente)
const handleAppointmentDecision = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, phoneNumber, padrinoName, dogName, date, time } = req.body;
    
    console.log('🔥 Petición recibida: PUT /api/appointments/decision/' + id);
    console.log('Decisión:', decision);
    console.log('Datos recibidos:', { phoneNumber, padrinoName, dogName, date, time });
    
    // ✅ Validar que decision sea 'accepted' o 'rejected'
    if (!decision || !['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({ 
        error: 'Debes proporcionar una decisión válida: "accepted" o "rejected"' 
      });
    }
    
    // ✅ Validar datos necesarios para el WhatsApp
    if (!phoneNumber || !padrinoName || !dogName || !date || !time) {
      return res.status(400).json({ 
        error: 'Faltan datos necesarios: phoneNumber, padrinoName, dogName, date, time' 
      });
    }
    
    // ✅ Validar y formatear el número de teléfono (debe tener +57 para Colombia)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      // Si no tiene +, asumimos que es de Colombia y agregamos +57
      formattedPhone = '+57' + formattedPhone.replace(/\D/g, ''); // Quita todo excepto números
    }
    
    // ✅ Formatear fecha y hora para que se vean mejor en WhatsApp
    const formattedDate = new Date(date).toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // 1️⃣ Actualizar el estado de la cita en la base de datos
    const updateData = {
      status: decision  // 'accepted' o 'rejected'
    };
    
    const result = await appointmentsService.updateAppointment(id, updateData);
    
    if (!result.success) {
      console.log('❌ Error al actualizar cita:', result.error);
      return res.status(400).json({ error: result.error });
    }
    
    console.log('✅ Cita actualizada con estado:', decision);
    
    // 2️⃣ Enviar WhatsApp automáticamente
    console.log('📱 Enviando WhatsApp al padrino...');
    
    // Importar el servicio de Twilio
    const twilioService = (await import('../services/twilio.service.js')).default;
    
    let messageText;
    
    if (decision === 'accepted') {
      messageText = `¡Hola ${padrinoName}! 🎉

Tu cita de juego con ${dogName} ha sido ACEPTADA ✅

📅 Fecha: ${formattedDate}
🕐 Hora: ${time}

¡Nos vemos pronto! ${dogName} está emocionado de conocerte 🐕❤️

- Fundación PetLink`;
    } else {
      messageText = `Hola ${padrinoName} 😔

Lamentablemente tu cita con ${dogName} no pudo ser aceptada en este momento.

📅 Fecha solicitada: ${formattedDate}
🕐 Hora solicitada: ${time}

Te invitamos a agendar otra cita en una fecha diferente. ¡${dogName} te espera! 🐕

- Fundación PetLink`;
    }
    
    const whatsappResult = await twilioService.sendCustomMessage(formattedPhone, messageText);
    
    if (whatsappResult.success) {
      console.log('✅ WhatsApp enviado exitosamente a:', formattedPhone);
      res.status(200).json({
        success: true,
        message: `Cita ${decision === 'accepted' ? 'aceptada' : 'rechazada'} y WhatsApp enviado`,
        appointment: result.data,
        whatsappSent: true,
        messageSid: whatsappResult.messageSid
      });
    } else {
      console.log('⚠️ WhatsApp no pudo ser enviado:', whatsappResult.error);
      // Aunque el WhatsApp falle, la cita sí se actualizó
      res.status(200).json({
        success: true,
        message: `Cita ${decision === 'accepted' ? 'aceptada' : 'rechazada'} pero WhatsApp falló`,
        appointment: result.data,
        whatsappSent: false,
        whatsappError: whatsappResult.error
      });
    }
    
  } catch (error) {
    console.error('❌ Error en handleAppointmentDecision:', error);
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
  deleteAppointment,
  handleAppointmentDecision
};