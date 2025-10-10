// server/controllers/ai-integration.controller.js
// Este archivo maneja las peticiones para usar las APIs externas

import geminiService from '../services/gemini.service.js';
import twilioService from '../services/twilio.service.js';

// ============================================
// 🤖 ENDPOINTS DE GEMINI AI
// ============================================

// Generar descripción de perro con IA
const generateDogDescription = async (req, res) => {
  try {
    const dogData = req.body;
    console.log('🔥 Petición: Generar descripción con Gemini');
    
    const result = await geminiService.generateDogDescription(dogData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        description: result.description
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateDogDescription:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Generar sugerencias de necesidades
const generateNeedsSuggestions = async (req, res) => {
  try {
    const dogData = req.body;
    console.log('🔥 Petición: Generar sugerencias de necesidades');
    
    const result = await geminiService.generateNeedsSuggestions(dogData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        suggestions: result.suggestions
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateNeedsSuggestions:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Generar recomendaciones de accesorios
const generateAccessoryRecommendations = async (req, res) => {
  try {
    const dogData = req.body;
    console.log('🔥 Petición: Generar recomendaciones de accesorios');
    
    const result = await geminiService.generateAccessoryRecommendations(dogData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        recommendations: result.recommendations
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateAccessoryRecommendations:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ============================================
// 📱 ENDPOINTS DE TWILIO (WhatsApp)
// ============================================

// Enviar mensaje de bienvenida
const sendWelcomeMessage = async (req, res) => {
  try {
    const { phoneNumber, userName } = req.body;
    console.log('🔥 Petición: Enviar mensaje de bienvenida');
    
    const result = await twilioService.sendWelcomeMessage(phoneNumber, userName);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Mensaje de bienvenida enviado',
        messageSid: result.messageSid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en sendWelcomeMessage:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar confirmación de donación
const sendDonationConfirmation = async (req, res) => {
  try {
    const { phoneNumber, donationData } = req.body;
    console.log('🔥 Petición: Enviar confirmación de donación');
    
    const result = await twilioService.sendDonationConfirmation(phoneNumber, donationData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Confirmación de donación enviada',
        messageSid: result.messageSid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en sendDonationConfirmation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar recordatorio de cita
const sendAppointmentReminder = async (req, res) => {
  try {
    const { phoneNumber, appointmentData } = req.body;
    console.log('🔥 Petición: Enviar recordatorio de cita');
    
    const result = await twilioService.sendAppointmentReminder(phoneNumber, appointmentData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Recordatorio de cita enviado',
        messageSid: result.messageSid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en sendAppointmentReminder:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar alerta de necesidad urgente
const sendUrgentNeedAlert = async (req, res) => {
  try {
    const { phoneNumber, needData } = req.body;
    console.log('🔥 Petición: Enviar alerta de necesidad urgente');
    
    const result = await twilioService.sendUrgentNeedAlert(phoneNumber, needData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Alerta enviada',
        messageSid: result.messageSid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en sendUrgentNeedAlert:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Enviar mensaje personalizado
const sendCustomMessage = async (req, res) => {
  try {
    const { phoneNumber, messageText } = req.body;
    console.log('🔥 Petición: Enviar mensaje personalizado');
    
    const result = await twilioService.sendCustomMessage(phoneNumber, messageText);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Mensaje enviado',
        messageSid: result.messageSid
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en sendCustomMessage:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  // Gemini
  generateDogDescription,
  generateNeedsSuggestions,
  generateAccessoryRecommendations,
  // Twilio
  sendWelcomeMessage,
  sendDonationConfirmation,
  sendAppointmentReminder,
  sendUrgentNeedAlert,
  sendCustomMessage
};