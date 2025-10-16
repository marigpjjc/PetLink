// server/controllers/ai-integration.controller.js
// Este archivo maneja las peticiones para usar las APIs externas

import stabilityService from '../services/stability.service.js';
import twilioService from '../services/twilio.service.js';

// ============================================
// 🎨 ENDPOINTS DE STABILITY AI (Imágenes)
// ============================================

// 🎯 PRINCIPAL: Generar imagen de perro CON accesorio (cuando se compra)
const generateDogWithAccessoryImage = async (req, res) => {
  try {
    const { dogData, accessoryData } = req.body;
    console.log('🔥 Petición: Generar imagen de perro con accesorio');
    
    if (!dogData || !accessoryData) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren tanto dogData como accessoryData'
      });
    }
    
    const result = await stabilityService.generateDogWithAccessoryImage(dogData, accessoryData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        prompt: result.prompt,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateDogWithAccessoryImage:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Generar solo imagen de perro
const generateDogImage = async (req, res) => {
  try {
    const dogData = req.body;
    console.log('🔥 Petición: Generar imagen de perro');
    
    const result = await stabilityService.generateDogImage(dogData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        prompt: result.prompt,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateDogImage:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Generar solo imagen de accesorio
const generateAccessoryImage = async (req, res) => {
  try {
    const accessoryData = req.body;
    console.log('🔥 Petición: Generar imagen de accesorio');
    
    const result = await stabilityService.generateAccessoryImage(accessoryData);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        prompt: result.prompt,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateAccessoryImage:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Generar imagen con prompt personalizado
const generateCustomImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('🔥 Petición: Generar imagen personalizada');
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere un prompt'
      });
    }
    
    const result = await stabilityService.generateCustomImage(prompt);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        prompt: result.prompt,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('❌ Error en generateCustomImage:', error);
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
    
    if (!phoneNumber || !userName) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber y userName'
      });
    }
    
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
    
    if (!phoneNumber || !donationData) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber y donationData'
      });
    }
    
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
    
    if (!phoneNumber || !appointmentData) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber y appointmentData'
      });
    }
    
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
    
    if (!phoneNumber || !needData) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber y needData'
      });
    }
    
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
    
    if (!phoneNumber || !messageText) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber y messageText'
      });
    }
    
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

// ============================================
// 🎁 ENDPOINT COMBINADO (Imagen + WhatsApp)
// ============================================

// Confirmar compra de accesorio (genera imagen Y envía WhatsApp)
const confirmAccessoryPurchase = async (req, res) => {
  try {
    const { phoneNumber, dogData, accessoryData, purchaseData } = req.body;
    console.log('🔥 Petición: Confirmar compra de accesorio con imagen');
    
    if (!phoneNumber || !dogData || !accessoryData || !purchaseData) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren phoneNumber, dogData, accessoryData y purchaseData'
      });
    }
    
    // 1. Generar la imagen del perro con el accesorio
    console.log('📸 Generando imagen...');
    const imageResult = await stabilityService.generateDogWithAccessoryImage(dogData, accessoryData);
    
    if (!imageResult.success) {
      return res.status(400).json({
        success: false,
        error: 'No se pudo generar la imagen: ' + imageResult.error
      });
    }
    
    console.log('✅ Imagen generada');
    
    // 2. Enviar mensaje de WhatsApp
    console.log('📱 Enviando WhatsApp...');
    const messageText = `¡Gracias por tu compra! 🎁

Has comprado: ${accessoryData.category}
Para: ${dogData.name}
Monto: $${purchaseData.amount}

¡Tu compra ayuda a ${dogData.name} y a muchos perritos más! 🐕💝

Hemos generado una imagen especial de ${dogData.name} con su nuevo ${accessoryData.category}.`;
    
    const messageResult = await twilioService.sendCustomMessage(phoneNumber, messageText);
    
    if (messageResult.success) {
      console.log('✅ WhatsApp enviado');
      res.status(200).json({
        success: true,
        message: 'Compra confirmada, imagen generada y WhatsApp enviado',
        messageSid: messageResult.messageSid,
        imageUrl: imageResult.imageUrl,
        imageGenerated: true,
        prompt: imageResult.prompt
      });
    } else {
      // Imagen generada pero WhatsApp falló
      res.status(200).json({
        success: true,
        message: 'Imagen generada, pero falló el envío de WhatsApp',
        imageUrl: imageResult.imageUrl,
        imageGenerated: true,
        whatsappError: messageResult.error
      });
    }
    
  } catch (error) {
    console.error('❌ Error en confirmAccessoryPurchase:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  // Stability AI - Imágenes
  generateDogWithAccessoryImage,
  generateDogImage,
  generateAccessoryImage,
  generateCustomImage,
  // Twilio - WhatsApp
  sendWelcomeMessage,
  sendDonationConfirmation,
  sendAppointmentReminder,
  sendUrgentNeedAlert,
  sendCustomMessage,
  // Combinado (Imagen + WhatsApp)
  confirmAccessoryPurchase
};