// server/services/twilio.service.js
// Este archivo maneja el envío de mensajes por WhatsApp usando Twilio

import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Inicializar cliente de Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// 📱 Enviar mensaje de bienvenida a un nuevo usuario
const sendWelcomeMessage = async (phoneNumber, userName) => {
  try {
    console.log('📤 Enviando mensaje de bienvenida a:', phoneNumber);
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: `¡Hola ${userName}! 🐕

Bienvenido/a a PetLink. Gracias por unirte a nuestra comunidad.

Aquí podrás:
✅ Adoptar perros
✅ Hacer donaciones
✅ Apadrinar mascotas

¡Juntos hacemos la diferencia! 🐾`
    });
    
    console.log('✅ Mensaje enviado. SID:', message.sid);
    return {
      success: true,
      messageSid: message.sid
    };
    
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 📱 Notificar sobre una nueva donación
const sendDonationConfirmation = async (phoneNumber, donationData) => {
  try {
    console.log('📤 Enviando confirmación de donación a:', phoneNumber);
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: `¡Gracias por tu donación! 💝

Detalles:
🐕 Perro: ${donationData.dogName}
💰 Monto: $${donationData.amount}
📅 Fecha: ${new Date().toLocaleDateString('es-ES')}

Tu generosidad ayuda a cambiar vidas. ¡Gracias! 🙏`
    });
    
    console.log('✅ Confirmación enviada. SID:', message.sid);
    return {
      success: true,
      messageSid: message.sid
    };
    
  } catch (error) {
    console.error('❌ Error al enviar confirmación:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 📱 Recordatorio de cita
const sendAppointmentReminder = async (phoneNumber, appointmentData) => {
  try {
    console.log('📤 Enviando recordatorio de cita a:', phoneNumber);
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: `Recordatorio de Cita 📅

¡Hola! Tienes una cita próxima:

🐕 Perro: ${appointmentData.dogName}
📍 Lugar: ${appointmentData.location || 'Fundación'}
🕐 Fecha: ${appointmentData.date}
⏰ Hora: ${appointmentData.time}

¡Te esperamos! No olvides llegar 10 minutos antes. 🐾`
    });
    
    console.log('✅ Recordatorio enviado. SID:', message.sid);
    return {
      success: true,
      messageSid: message.sid
    };
    
  } catch (error) {
    console.error('❌ Error al enviar recordatorio:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 📱 Notificar sobre una nueva necesidad urgente
const sendUrgentNeedAlert = async (phoneNumber, needData) => {
  try {
    console.log('📤 Enviando alerta de necesidad urgente a:', phoneNumber);
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: `⚠️ ALERTA: Necesidad Urgente

🐕 Perro: ${needData.dogName}
🆘 Necesidad: ${needData.needDescription}
💰 Costo: $${needData.price}

¡Tu ayuda puede salvar una vida!
Ingresa a PetLink para más información. 🐾`
    });
    
    console.log('✅ Alerta enviada. SID:', message.sid);
    return {
      success: true,
      messageSid: message.sid
    };
    
  } catch (error) {
    console.error('❌ Error al enviar alerta:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 📱 Enviar mensaje personalizado
const sendCustomMessage = async (phoneNumber, messageText) => {
  try {
    console.log('📤 Enviando mensaje personalizado a:', phoneNumber);
    
    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: messageText
    });
    
    console.log('✅ Mensaje enviado. SID:', message.sid);
    return {
      success: true,
      messageSid: message.sid
    };
    
  } catch (error) {
    console.error('❌ Error al enviar mensaje:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  sendWelcomeMessage,
  sendDonationConfirmation,
  sendAppointmentReminder,
  sendUrgentNeedAlert,
  sendCustomMessage
};