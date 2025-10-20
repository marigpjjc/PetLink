// Este archivo define las rutas para usar las APIs externas

import express from 'express';
import aiIntegrationController from '../controllers/ai-integration.controller.js';

const router = express.Router();

//  RUTAS DE STABILITY AI (generador de imagenes)

//  RUTA PRINCIPAL: Generar imagen de perro con accesorio
// POST /api/ai/generate-dog-with-accessory
router.post('/generate-dog-with-accessory', aiIntegrationController.generateDogWithAccessoryImage);

// POST /api/ai/generate-dog-image
// Body: { name, breed, age, size }
router.post('/generate-dog-image', aiIntegrationController.generateDogImage);

// POST /api/ai/generate-accessory-image
// Body: { category, description }
router.post('/generate-accessory-image', aiIntegrationController.generateAccessoryImage);

// POST /api/ai/generate-custom-image
// Body: { prompt }
router.post('/generate-custom-image', aiIntegrationController.generateCustomImage);

//  RUTAS DE TWILIO (WhatsApp)

// POST /api/ai/send-welcome-message
// Body: { phoneNumber, userName }
router.post('/send-welcome-message', aiIntegrationController.sendWelcomeMessage);

// POST /api/ai/send-donation-confirmation
// Body: { phoneNumber, donationData: { dogName, amount } }
router.post('/send-donation-confirmation', aiIntegrationController.sendDonationConfirmation);

// POST /api/ai/send-appointment-reminder
// Body: { phoneNumber, appointmentData: { dogName, location, date, time } }
router.post('/send-appointment-reminder', aiIntegrationController.sendAppointmentReminder);

// POST /api/ai/send-urgent-need-alert
// Body: { phoneNumber, needData: { dogName, needDescription, price } }
router.post('/send-urgent-need-alert', aiIntegrationController.sendUrgentNeedAlert);

// POST /api/ai/send-custom-message
// Body: { phoneNumber, messageText }
router.post('/send-custom-message', aiIntegrationController.sendCustomMessage);

//  RUTA COMBINADA (Imagen + WhatsApp)
// Confirmar compra de accesorio (genera imagen Y envía WhatsApp)
// POST /api/ai/confirm-accessory-purchase
router.post('/confirm-accessory-purchase', aiIntegrationController.confirmAccessoryPurchase);

export default router;