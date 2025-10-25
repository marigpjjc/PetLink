// Esta es la pantalla de PAGO SIMULADO

import { createDonation } from '../services/api.js';
import router from '../utils/router.js';
import { getCurrentUserId, isUserLoggedIn, createMockUser } from '../utils/auth.js';

// Renderizar (mostrar) la pantalla de pago
export function renderPayment() {
  const app = document.getElementById('app');
  
  // Verificar si hay usuario loggeado
  let userId = getCurrentUserId();
  
  // Si no hay usuario, crear uno simulado para pruebas
  if (!userId) {
    console.warn('No hay usuario loggeado, creando usuario simulado...');
    const mockUser = createMockUser();
    userId = mockUser.id;
  }
  
  // Obtener parametros de la URL
  const params = new URLSearchParams(window.location.search);
  const needId = params.get('needId');
  const price = params.get('price');
  const dogId = params.get('dogId');
  
  // Si no hay parametros, volver atras
  if (!needId || !price || !dogId) {
    console.error('Faltan parametros en la URL');
    router.navigateTo('/');
    return;
  }
  
  app.innerHTML = `
    <div class="payment-container">
      <!-- Boton de volver -->
      <button class="btn-back" id="btn-back">← Volver</button>
      
      <h1 class="payment-title">Realizar Donacion</h1>
      
      <!-- Resumen de la donacion -->
      <div class="payment-summary">
        <h3>Resumen de tu donacion</h3>
        <div class="summary-item">
          <span>Monto a donar:</span>
          <span class="summary-price">$${price}</span>
        </div>
      </div>
      
      <!-- Formulario de pago (simulado) -->
      <form class="payment-form" id="payment-form">
        <h3>Informacion de pago</h3>
        
        <div class="form-group">
          <label for="card-number">Numero de tarjeta</label>
          <input 
            type="text" 
            id="card-number" 
            placeholder="1234 5678 9012 3456"
            maxlength="19"
            required
          >
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="card-expiry">Fecha de expiracion</label>
            <input 
              type="text" 
              id="card-expiry" 
              placeholder="MM/YY"
              maxlength="5"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="card-cvv">CVV</label>
            <input 
              type="text" 
              id="card-cvv" 
              placeholder="123"
              maxlength="3"
              required
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="card-name">Nombre en la tarjeta</label>
          <input 
            type="text" 
            id="card-name" 
            placeholder="Juan Perez"
            required
          >
        </div>
        
        <button type="submit" class="btn-pay" id="btn-pay">
          Confirmar Donacion de $${price}
        </button>
      </form>
      
      <p class="payment-note">
        Esta es una simulacion de pago. No se procesara ninguna transaccion real.
      </p>
    </div>
  `;
  
  // Agregar eventos
  setupPaymentEvents(needId, price, dogId, userId);
}

// Configurar eventos de la pantalla de pago
function setupPaymentEvents(needId, price, dogId, userId) {
  // Boton volver
  document.getElementById('btn-back').addEventListener('click', () => {
    window.history.back();
  });
  
  // Formatear numero de tarjeta mientras se escribe
  const cardNumberInput = document.getElementById('card-number');
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });
  
  // Formatear fecha de expiracion
  const cardExpiryInput = document.getElementById('card-expiry');
  cardExpiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
  });
  
  // Solo permitir numeros en CVV
  const cardCvvInput = document.getElementById('card-cvv');
  cardCvvInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
  
  // Enviar formulario
  const form = document.getElementById('payment-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await processPayment(needId, price, dogId, userId);
  });
}

// Procesar el pago (simulado)
async function processPayment(needId, price, dogId, userId) {
  const btnPay = document.getElementById('btn-pay');
  
  // Deshabilitar boton mientras se procesa
  btnPay.disabled = true;
  btnPay.textContent = 'Procesando...';
  
  try {
    // Generar un ID de transaccion simulado
    const transactionId = 'TXN-' + Date.now();
    
    // Crear la donacion
    const donationData = {
      id_padrino: userId,
      id_dog: parseInt(dogId),
      id_need: parseInt(needId),
      price: parseFloat(price),
      transaction_id: transactionId,
      state: 'completed'
    };
    
    console.log('Enviando donacion:', donationData);
    
    const donation = await createDonation(donationData);
    
    console.log('Donacion creada exitosamente:', donation);
    
    // Mostrar mensaje de exito
    showSuccessMessage(donation);
    
    // Redirigir al home despues de 3 segundos
    setTimeout(() => {
      router.navigateTo('/');
    }, 3000);
    
  } catch (error) {
    console.error('Error al procesar pago:', error);
    
    // Mostrar mensaje de error
    btnPay.disabled = false;
    btnPay.textContent = 'Reintentar';
    
    alert('Error al procesar la donacion. Por favor intenta de nuevo.');
  }
}

// Mostrar mensaje de exito
function showSuccessMessage(donation) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="payment-success">
      <div class="success-icon">✓</div>
      <h1>Donacion Exitosa</h1>
      <p>Gracias por tu generosidad</p>
      <div class="success-details">
        <p>Transaccion: ${donation.transaction_id}</p>
        <p>Monto: $${donation.price}</p>
      </div>
      <p class="redirect-message">Redirigiendo al inicio...</p>
    </div>
  `;
}