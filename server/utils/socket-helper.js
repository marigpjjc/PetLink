// Este archivo ayuda a emitir eventos de Socket.IO desde cualquier parte del código

let io = null;

// Guardar la instancia de Socket.IO
export const setSocketIO = (socketInstance) => {
  io = socketInstance;
  console.log('✅ Socket.IO instancia guardada en helper');
};

// Obtener la instancia de Socket.IO
export const getSocketIO = () => {
  return io;
};

// Emitir evento de nueva donación
export const emitNewDonation = (donationData) => {
  if (io) {
    io.emit('donation-created', {
      message: '¡Nueva donación recibida!',
      donation: donationData,
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: donation-created');
  }
};

// Emitir evento de nueva necesidad
export const emitNewNeed = (needData) => {
  if (io) {
    io.emit('need-created', {
      message: '¡Nueva necesidad registrada!',
      need: needData,
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: need-created');
  }
};

// Emitir evento de necesidad urgente
export const emitUrgentNeed = (needData) => {
  if (io) {
    io.emit('urgent-need-alert', {
      message: '🆘 ¡ALERTA! Necesidad urgente',
      need: needData,
      priority: 'high',
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: urgent-need-alert');
  }
};

// Emitir evento de nueva cita
export const emitNewAppointment = (appointmentData) => {
  if (io) {
    io.emit('appointment-created', {
      message: 'Nueva cita agendada',
      appointment: appointmentData,
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: appointment-created');
  }
};

// Emitir evento de compra de accesorio
export const emitAccessoryPurchase = (purchaseData) => {
  if (io) {
    io.emit('purchase-notification', {
      message: '¡Nueva compra realizada!',
      purchase: purchaseData,
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: purchase-notification');
  }
};

// Emitir evento de nuevo perro registrado
export const emitNewDog = (dogData) => {
  if (io) {
    io.emit('dog-registered', {
      message: '¡Nuevo perro registrado!',
      dog: dogData,
      timestamp: new Date()
    });
    console.log('📡 Evento emitido: dog-registered');
  }
};

// Emitir evento personalizado
export const emitCustomEvent = (eventName, data) => {
  if (io) {
    io.emit(eventName, {
      ...data,
      timestamp: new Date()
    });
    console.log(`📡 Evento emitido: ${eventName}`);
  }
};