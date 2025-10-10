// server/routes/ai-integration.routes.js
// Este archivo define las rutas para usar las APIs externas

import express from 'express';
import aiIntegrationController from '../controllers/ai-integration.controller.js';

const router = express.Router();

// ============================================
// 🤖 RUTAS DE GEMINI AI
// ============================================

// POST /api/ai/generate-dog-description
// Body: { name, breed, age, size }
router.post('/generate-dog-description', aiIntegrationController.generateDogDescription);

// POST /api/ai/generate-needs-suggestions
// Body: { name, breed, age, size }
router.post('/generate-needs-suggestions', aiIntegrationController.generateNeedsSuggestions);

// POST /api/ai/generate-accessory-recommendations
// Body: { size, age, breed }
router.post('/generate-accessory-recommendations', aiIntegrationController.generateAccessoryRecommendations);

// ============================================
// 📱 RUTAS DE TWILIO (WhatsApp)
// ============================================

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

export default router;