// Servicio de WebSocket para comunicación en tiempo real con el backend
// Usa Socket.IO para eventos en tiempo real

import { io } from 'socket.io-client';

let socket = null;
let isConnected = false;
let eventListeners = {};

// ============================================
// INICIALIZACIÓN
// ============================================

/**
 * Inicializar la conexión de WebSocket
 */
export function initWebSocket() {
  if (socket && isConnected) {
    console.log('WebSocket ya está conectado');
    return socket;
  }

  try {
    // Conectar al servidor de Socket.IO
    socket = io('http://localhost:5050', {
      path: '/real-time',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    // Eventos de conexión
    socket.on('connect', () => {
      console.log('✅ WebSocket conectado con ID:', socket.id);
      isConnected = true;
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket desconectado:', reason);
      isConnected = false;
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión WebSocket:', error);
      isConnected = false;
    });

    socket.on('welcome', (data) => {
      console.log('👋 Mensaje de bienvenida:', data.message);
    });

    socket.on('users-count', (data) => {
      console.log('👥 Usuarios conectados:', data.count);
    });

    // Configurar listeners de eventos
    setupEventListeners();

    return socket;
  } catch (error) {
    console.error('Error al inicializar WebSocket:', error);
    return null;
  }
}

/**
 * Configurar los listeners de eventos del servidor
 */
function setupEventListeners() {
  if (!socket) return;

  // ============================================
  // EVENTOS DE DONACIONES
  // ============================================

  socket.on('donation-created', (data) => {
    console.log('💰 Nueva donación creada:', data);
    triggerCustomEvent('donation-created', data);
  });

  // ============================================
  // EVENTOS DE NECESIDADES
  // ============================================

  socket.on('need-created', (data) => {
    console.log('📋 Nueva necesidad creada:', data);
    triggerCustomEvent('need-created', data);
  });

  socket.on('urgent-need-alert', (data) => {
    console.log('🚨 ALERTA: Necesidad urgente:', data);
    triggerCustomEvent('urgent-need-alert', data);
  });

  // ============================================
  // EVENTOS DE CITAS
  // ============================================

  socket.on('appointment-created', (data) => {
    console.log('📅 Nueva cita creada:', data);
    triggerCustomEvent('appointment-created', data);
  });

  // ============================================
  // EVENTOS DE ACCESORIOS
  // ============================================

  socket.on('purchase-notification', (data) => {
    console.log('🛍️ Nueva compra de accesorio:', data);
    triggerCustomEvent('purchase-notification', data);
  });
}

// ============================================
// EMISIÓN DE EVENTOS
// ============================================

/**
 * Emitir evento de nueva donación
 */
export function emitNewDonation(donationData) {
  if (!socket || !isConnected) {
    console.warn('WebSocket no está conectado. No se puede emitir evento.');
    return false;
  }

  socket.emit('new-donation', donationData);
  console.log('✉️ Evento de nueva donación emitido:', donationData);
  return true;
}

/**
 * Emitir evento de nueva necesidad
 */
export function emitNewNeed(needData) {
  if (!socket || !isConnected) {
    console.warn('WebSocket no está conectado. No se puede emitir evento.');
    return false;
  }

  socket.emit('new-need', needData);
  console.log('✉️ Evento de nueva necesidad emitido:', needData);
  return true;
}

/**
 * Emitir evento de necesidad urgente
 */
export function emitUrgentNeed(needData) {
  if (!socket || !isConnected) {
    console.warn('WebSocket no está conectado. No se puede emitir evento.');
    return false;
  }

  socket.emit('urgent-need', needData);
  console.log('✉️ Evento de necesidad urgente emitido:', needData);
  return true;
}

/**
 * Emitir evento de nueva cita
 */
export function emitNewAppointment(appointmentData) {
  if (!socket || !isConnected) {
    console.warn('WebSocket no está conectado. No se puede emitir evento.');
    return false;
  }

  socket.emit('new-appointment', appointmentData);
  console.log('✉️ Evento de nueva cita emitido:', appointmentData);
  return true;
}

/**
 * Emitir evento de compra de accesorio
 */
export function emitAccessoryPurchased(purchaseData) {
  if (!socket || !isConnected) {
    console.warn('WebSocket no está conectado. No se puede emitir evento.');
    return false;
  }

  socket.emit('accessory-purchased', purchaseData);
  console.log('✉️ Evento de compra de accesorio emitido:', purchaseData);
  return true;
}

// ============================================
// GESTIÓN DE LISTENERS PERSONALIZADOS
// ============================================

/**
 * Registrar un listener personalizado para un evento
 */
export function addEventListener(eventName, callback) {
  if (!eventListeners[eventName]) {
    eventListeners[eventName] = [];
  }
  eventListeners[eventName].push(callback);
}

/**
 * Remover un listener personalizado
 */
export function removeEventListener(eventName, callback) {
  if (!eventListeners[eventName]) return;
  
  eventListeners[eventName] = eventListeners[eventName].filter(
    listener => listener !== callback
  );
}

/**
 * Disparar eventos personalizados
 */
function triggerCustomEvent(eventName, data) {
  if (!eventListeners[eventName]) return;
  
  eventListeners[eventName].forEach(callback => {
    try {
      callback(data);
    } catch (error) {
      console.error(`Error al ejecutar listener de ${eventName}:`, error);
    }
  });
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Verificar si el WebSocket está conectado
 */
export function isWebSocketConnected() {
  return isConnected;
}

/**
 * Obtener la instancia del socket
 */
export function getSocket() {
  return socket;
}

/**
 * Desconectar el WebSocket
 */
export function disconnectWebSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
    eventListeners = {};
    console.log('WebSocket desconectado manualmente');
  }
}

/**
 * Reconectar el WebSocket
 */
export function reconnectWebSocket() {
  if (socket && !isConnected) {
    socket.connect();
    console.log('Intentando reconectar WebSocket...');
  } else if (!socket) {
    initWebSocket();
  }
}

