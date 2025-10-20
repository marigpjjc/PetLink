// Este archivo centraliza todos los eventos de WebSocket

// Función para configurar todos los eventos de Socket.IO
export const setupSocketEvents = (io) => {
  
  let connectedUsers = 0;
  
  io.on('connection', (socket) => {
    connectedUsers++;
    console.log(' Nuevo cliente conectado. ID:', socket.id);
    console.log(' Usuarios conectados:', connectedUsers);
    
    // Enviar mensaje de bienvenida
    socket.emit('welcome', {
      message: '¡Bienvenido a PetLink! 🐕',
      yourId: socket.id
    });
    
    // Notificar conteo de usuarios
    io.emit('users-count', {
      count: connectedUsers
    });
    
    // EVENTOS DE DONACIONES

    
    socket.on('new-donation', (donationData) => {
      console.log('Nueva donación recibida:', donationData);
      io.emit('donation-created', {
        message: '¡Nueva donación recibida!',
        donation: donationData,
        timestamp: new Date()
      });
    });
    

    //EVENTOS DE NECESIDADES

    
    socket.on('new-need', (needData) => {
      console.log('Nueva necesidad registrada:', needData);
      io.emit('need-created', {
        message: '¡Nueva necesidad registrada!',
        need: needData,
        timestamp: new Date()
      });
    });
    
    socket.on('urgent-need', (needData) => {
      console.log('¡NECESIDAD URGENTE!:', needData);
      io.emit('urgent-need-alert', {
        message: '¡ALERTA! Necesidad urgente',
        need: needData,
        priority: 'high',
        timestamp: new Date()
      });
    });
    

    //EVENTOS DE CITAS

    
    socket.on('new-appointment', (appointmentData) => {
      console.log('Nueva cita agendada:', appointmentData);
      io.emit('appointment-created', {
        message: 'Nueva cita agendada',
        appointment: appointmentData,
        timestamp: new Date()
      });
    });
    

    //EVENTOS DE ACCESORIOS

    
    socket.on('accessory-purchased', (purchaseData) => {
      console.log('Accesorio comprado:', purchaseData);
      io.emit('purchase-notification', {
        message: '¡Nueva compra realizada!',
        purchase: purchaseData,
        timestamp: new Date()
      });
    });
    

    //  CHAT EN TIEMPO REAL

    
    socket.on('join-chat', (roomId) => {
      socket.join(roomId);
      console.log(` Usuario ${socket.id} se unió al chat ${roomId}`);
      socket.to(roomId).emit('user-joined', {
        message: 'Un usuario se unió al chat',
        userId: socket.id
      });
    });
    
    socket.on('chat-message', ({ roomId, message, userName }) => {
      console.log(` Mensaje en ${roomId}:`, message);
      io.to(roomId).emit('new-message', {
        userId: socket.id,
        userName: userName,
        message: message,
        timestamp: new Date()
      });
    });
    

    //  DESCONEXIÓN

    
    socket.on('disconnect', () => {
      connectedUsers--;
      console.log(' Cliente desconectado. ID:', socket.id);
      console.log(' Usuarios conectados:', connectedUsers);
      io.emit('users-count', {
        count: connectedUsers
      });
    });
  });
};

// Función auxiliar para emitir eventos desde controladores
export const emitEvent = (io, eventName, data) => {
  if (io) {
    io.emit(eventName, data);
    console.log(`Evento emitido: ${eventName}`);
  }
};