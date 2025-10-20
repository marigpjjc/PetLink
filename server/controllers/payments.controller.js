// Este archivo maneja los pagos simulados 

import { getSocketIO } from '../utils/socket-helper.js';

// procesa pago - Simular un pago con tarjeta
const processPayment = async (req, res) => {
  try {
    const { 
      amount,           // Monto a pagar
      cardNumber,       // Número de tarjeta 
      cardName,         // Nombre en la tarjeta
      donorName,        // Nombre del donante
      donorEmail,       // Email del donante
      donationType,     // Tipo: 'money', 'food', 'toys', etc.
      dogId,            // ID del perro 
      message           // Mensaje del donante 
    } = req.body;
    
    console.log('Petición recibida: POST /api/payments/process', { 
      amount, 
      cardNumber: cardNumber ? '****' + cardNumber.slice(-4) : 'N/A',
      donorName 
    });
    
    // Validar campos obligatorios
    if (!amount || !cardNumber || !cardName || !donorName) {
      return res.status(400).json({ 
        error: 'Faltan campos obligatorios: amount, cardNumber, cardName, donorName' 
      });
    }
    
    // Validar que el monto sea positivo
    if (amount <= 0) {
      return res.status(400).json({ 
        error: 'El monto debe ser mayor a 0' 
      });
    }
    
    // SIMULAR procesamiento (esperar 2 segundos)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular que el 95% de los pagos son exitosos
    const paymentSuccess = Math.random() > 0.05;
    
    if (!paymentSuccess) {
      console.log('Pago rechazado (simulado)');
      return res.status(402).json({ 
        success: false,
        error: 'Pago rechazado. Por favor verifica los datos de tu tarjeta.' 
      });
    }
    
    // Pago exitoso - Generar datos del pago
    const paymentId = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const transactionId = `TXN-${Date.now()}`;
    const receiptNumber = `REC-${Math.floor(Math.random() * 1000000)}`;
    
    const paymentData = {
      id: paymentId,
      transactionId: transactionId,
      receiptNumber: receiptNumber,
      amount: amount,
      currency: 'COP', 
      status: 'approved',
      cardLast4: cardNumber.slice(-4),
      cardName: cardName,
      donorName: donorName,
      donorEmail: donorEmail,
      donationType: donationType || 'money',
      dogId: dogId || null,
      message: message || '',
      processedAt: new Date().toISOString(),
      paymentMethod: 'credit_card_simulated'
    };
    
    console.log('Pago procesado exitosamente:', paymentId);
    
    // Notificar a todos los clientes conectados via WebSocket
    const io = getSocketIO();
    if (io) {
      io.emit('payment-successful', {
        message: `¡Nueva donación de $${amount.toLocaleString('es-CO')} recibida!`,
        payment: paymentData,
        timestamp: new Date()
      });
      console.log('Notificación de pago enviada via WebSocket');
    }
    
    // Devolver respuesta exitosa
    res.status(200).json({
      success: true,
      message: '¡Pago procesado exitosamente!',
      payment: paymentData
    });
    
  } catch (error) {
    console.error('Error en processPayment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// VERIFICAR PAGO - Verificar el estado de un pago por ID
const verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    console.log('Petición recibida: GET /api/payments/verify/' + paymentId);
    
    if (!paymentId) {
      return res.status(400).json({ 
        error: 'ID de pago no proporcionado' 
      });
    }
    
    // Validar formato del ID de pago
    if (!paymentId.startsWith('PAY-')) {
      return res.status(404).json({ 
        error: 'ID de pago inválido' 
      });
    }
    
    // Simular consulta (todos los pagos con formato correcto son válidos)
    const mockPaymentData = {
      id: paymentId,
      status: 'approved',
      verified: true,
      verifiedAt: new Date().toISOString(),
      message: 'Pago verificado correctamente'
    };
    
    console.log('Pago verificado:', paymentId);
    
    res.status(200).json({
      success: true,
      payment: mockPaymentData
    });
    
  } catch (error) {
    console.error('Error en verifyPayment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

//  GENERAR RECIBO - Obtener recibo de un pago
const getReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    console.log('Petición recibida: GET /api/payments/receipt/' + paymentId);
    
    if (!paymentId) {
      return res.status(400).json({ 
        error: 'ID de pago no proporcionado' 
      });
    }
    
    // Validar formato del ID
    if (!paymentId.startsWith('PAY-')) {
      return res.status(404).json({ 
        error: 'ID de pago inválido' 
      });
    }
    
    // Generar recibo simulado
    const receipt = {
      receiptNumber: `REC-${Math.floor(Math.random() * 1000000)}`,
      paymentId: paymentId,
      title: 'Recibo de Donación - PetLink',
      organization: 'Fundación PetLink',
      organizationNIT: '900.123.456-7',
      organizationAddress: 'Calle 123 #45-67, Cali, Colombia',
      organizationPhone: '+57 300 123 4567',
      date: new Date().toLocaleDateString('es-CO'),
      time: new Date().toLocaleTimeString('es-CO'),
      status: 'PAGADO',
      thankYouMessage: '¡Gracias por tu generosa donación!',
      taxDeductible: true,
      taxNote: 'Esta donación es deducible de impuestos según la ley colombiana.'
    };
    
    console.log('Recibo generado:', receipt.receiptNumber);
    
    res.status(200).json({
      success: true,
      receipt: receipt
    });
    
  } catch (error) {
    console.error('Error en getReceipt:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// OBTENER ESTADÍSTICAS DE PAGOS - Para el dashboard del admin
const getPaymentStats = async (req, res) => {
  try {
    console.log('Petición recibida: GET /api/payments/stats');
    
    // Generar estadísticas simuladas
    const stats = {
      totalDonations: Math.floor(Math.random() * 1000) + 500,
      totalAmount: Math.floor(Math.random() * 10000000) + 5000000,
      currency: 'COP',
      averageDonation: Math.floor(Math.random() * 100000) + 50000,
      thisMonth: {
        donations: Math.floor(Math.random() * 100) + 50,
        amount: Math.floor(Math.random() * 1000000) + 500000
      },
      thisWeek: {
        donations: Math.floor(Math.random() * 30) + 10,
        amount: Math.floor(Math.random() * 300000) + 100000
      },
      today: {
        donations: Math.floor(Math.random() * 10) + 1,
        amount: Math.floor(Math.random() * 100000) + 50000
      },
      topDonors: [
        { name: 'María García', amount: 500000, donations: 5 },
        { name: 'Carlos Rodríguez', amount: 450000, donations: 3 },
        { name: 'Ana Martínez', amount: 400000, donations: 4 }
      ]
    };
    
    console.log('Estadísticas generadas');
    
    res.status(200).json({
      success: true,
      stats: stats,
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error en getPaymentStats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// REEMBOLSO - Simular un reembolso
const refundPayment = async (req, res) => {
  try {
    const { paymentId, reason } = req.body;
    
    console.log('Petición recibida: POST /api/payments/refund', { paymentId, reason });
    
    if (!paymentId) {
      return res.status(400).json({ 
        error: 'ID de pago no proporcionado' 
      });
    }
    
    // Validar formato
    if (!paymentId.startsWith('PAY-')) {
      return res.status(404).json({ 
        error: 'ID de pago inválido' 
      });
    }
    
    // Simular procesamiento de reembolso
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const refundId = `REF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    const refundData = {
      id: refundId,
      paymentId: paymentId,
      status: 'refunded',
      reason: reason || 'Reembolso solicitado por el usuario',
      refundedAt: new Date().toISOString(),
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO') // 5 días
    };
    
    console.log('Reembolso procesado:', refundId);
    
    res.status(200).json({
      success: true,
      message: 'Reembolso procesado exitosamente',
      refund: refundData
    });
    
  } catch (error) {
    console.error('Error en refundPayment:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export default {
  processPayment,
  verifyPayment,
  getReceipt,
  getPaymentStats,
  refundPayment
};