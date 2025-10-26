// Pantalla de perfil de donaciones de un perro específico

import router from '../utils/router.js';
import { getDogById, getDonationsByDog } from '../services/admin-api.js';
import { checkAuth } from './admin-login.js';

let dogData = null;
let donationsData = [];
let dogId = null;

export default async function renderDonationsProfileDog(data) {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    router.navigateTo('/admin-login', {});
    return;
  }

  dogId = data.dogId;
  
  if (!dogId) {
    showError('ID del perro no proporcionado');
    router.navigateTo('/donations', {});
    return;
  }

  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="donations-profile-container">
      <header class="page-header">
        <button id="backBtn" class="back-btn">← Volver</button>
        <h1>Perfil de Donaciones</h1>
      </header>
      
      <main class="profile-content">
        <div id="loadingSection" class="loading-section">
          <div class="loading-message">Cargando información del perro...</div>
        </div>
        
        <div id="dogProfileSection" class="dog-profile-section" style="display: none;">
          <div class="dog-header">
            <div class="dog-image">
              <div id="dogImage" class="dog-image-placeholder">🐕</div>
            </div>
            <div class="dog-info">
              <h2 id="dogName">Cargando...</h2>
              <p id="dogAge">Edad: Cargando...</p>
              <p id="dogSize">Tamaño: Cargando...</p>
            </div>
          </div>
        </div>
        
        <div id="donationsSection" class="donations-section" style="display: none;">
          <div class="section-header">
            <h3>Donaciones Recibidas</h3>
            <span id="donationsCount" class="count-badge">0 donaciones</span>
          </div>
          
          <div id="donationsList" class="donations-list">
            <!-- Las donaciones se cargarán aquí -->
          </div>
          
          <div id="noDonationsMessage" class="no-donations" style="display: none;">
            <p>Este perro aún no tiene donaciones registradas.</p>
            <p>Las donaciones aparecerán aquí cuando los padrinos hagan contribuciones.</p>
          </div>
        </div>
        
        <div class="messages-section">
          <div id="successMessage" class="success-message" style="display: none;"></div>
          <div id="errorMessage" class="error-message" style="display: none;"></div>
        </div>
      </main>
    </div>
  `;
  
  setupEventListeners();
  await loadDogData();
  await loadDonationsData();
}

function setupEventListeners() {
  const backBtn = document.getElementById('backBtn');
  
  backBtn.addEventListener('click', () => router.navigateTo('/donations', {}));
}

async function loadDogData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      router.navigateTo('/admin-login', {});
      return;
    }
    
    // Usar el servicio API centralizado
    const response = await getDogById(dogId);
    
    if (response && response.id) {
      dogData = response;
      renderDogProfile();
    } else {
      showError('No se pudo cargar la información del perro');
    }
    
  } catch (error) {
    console.error('Error al cargar datos del perro:', error);
    showError('Error al cargar la información del perro');
  }
}

async function loadDonationsData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      router.navigateTo('/admin-login', {});
      return;
    }
    
    // Usar el servicio API centralizado
    const response = await getDonationsByDog(dogId);
    
    if (Array.isArray(response)) {
      donationsData = response;
      renderDonationsList();
      updateDonationsCount();
    } else {
      donationsData = [];
      renderDonationsList();
      updateDonationsCount();
    }
    
  } catch (error) {
    console.error('Error al cargar donaciones:', error);
    showError('Error al cargar las donaciones');
    donationsData = [];
    renderDonationsList();
    updateDonationsCount();
  }
}

// Renderizar perfil del perro
function renderDogProfile() {
  if (!dogData) return;
  
  const dogProfileSection = document.getElementById('dogProfileSection');
  const loadingSection = document.getElementById('loadingSection');
  
  loadingSection.style.display = 'none';
  dogProfileSection.style.display = 'block';
  
  document.getElementById('dogName').textContent = dogData.name || 'Sin nombre';
  document.getElementById('dogAge').textContent = `Edad: ${dogData.age || 'No especificada'} años`;
  document.getElementById('dogSize').textContent = `Tamaño: ${dogData.size || 'No especificado'}`;
  
  const dogImage = document.getElementById('dogImage');
  if (dogData.image) {
    dogImage.innerHTML = `<img src="${dogData.image}" alt="${dogData.name}" />`;
  } else {
    dogImage.innerHTML = '🐕';
  }
  
  document.getElementById('donationsSection').style.display = 'block';
}

function renderDonationsList() {
  const donationsList = document.getElementById('donationsList');
  const noDonationsMessage = document.getElementById('noDonationsMessage');
  
  if (donationsData.length === 0) {
    donationsList.innerHTML = '';
    noDonationsMessage.style.display = 'block';
    return;
  }
  
  noDonationsMessage.style.display = 'none';
  
  donationsList.innerHTML = donationsData.map(donation => `
    <div class="donation-card" data-donation-id="${donation.id}">
      <div class="card-header">
        <div class="donation-info">
          <h4>Donación #${donation.id}</h4>
          <p class="donation-date">${formatDate(donation.created_at || donation.date)}</p>
        </div>
        <div class="donation-status">
          <span class="status-badge ${donation.status || 'completed'}">${getStatusText(donation.status)}</span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="donation-details">
          <div class="detail-item">
            <span class="label">Padrino:</span>
            <span class="value">${donation.padrino_name || donation.user_name || 'Anónimo'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Monto:</span>
            <span class="value">$${formatAmount(donation.amount)}</span>
          </div>
          ${donation.product_name ? `
            <div class="detail-item">
              <span class="label">Producto:</span>
              <span class="value">${donation.product_name}</span>
            </div>
          ` : ''}
          ${donation.description ? `
            <div class="detail-item">
              <span class="label">Descripción:</span>
              <span class="value">${donation.description}</span>
            </div>
          ` : ''}
          ${donation.payment_method ? `
            <div class="detail-item">
              <span class="label">Método de pago:</span>
              <span class="value">${donation.payment_method}</span>
            </div>
          ` : ''}
        </div>
        
        <div class="donation-message">
          <p><strong>${donation.padrino_name || donation.user_name || 'Un padrino'}</strong> ha donado <strong>$${formatAmount(donation.amount)}</strong>${donation.product_name ? ` en ${donation.product_name}` : ''}</p>
        </div>
      </div>
    </div>
  `).join('');
}

// Nota: makeRequestWithAuth ya no es necesario, usamos el servicio API centralizado

/*
async function makeRequestWithAuth(url, method, body, token) {
  const BASE_URL = "http://localhost:5050";
  
  const response = await fetch(`${BASE_URL}${url}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error en la petición');
  }
  
  return await response.json();
}
*/

function formatDate(dateString) {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateString;
  }
}

function formatAmount(amount) {
  if (!amount) return '0';
  
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('es-CO').format(numAmount);
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Pendiente',
    'completed': 'Completada',
    'failed': 'Fallida',
    'cancelled': 'Cancelada',
    'refunded': 'Reembolsada'
  };
  
  return statusMap[status] || 'Desconocido';
}

function updateDonationsCount() {
  const countElement = document.getElementById('donationsCount');
  const count = donationsData.length;
  countElement.textContent = `${count} ${count === 1 ? 'donación' : 'donaciones'}`;
}

function showSuccess(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.textContent = message;
  successMessage.style.display = 'block';
  
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 7000);
}
