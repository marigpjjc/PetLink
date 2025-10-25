// Pantalla de estadísticas detalladas de un perro específico

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth } from './admin-login.js';

let dogData = null;
let dogId = null;

export default async function renderDogEstadistics(data) {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    navigateTo('/admin-login', {});
    return;
  }

  // Obtener ID del perro
  dogId = data.dogId;
  
  if (!dogId) {
    showError('ID del perro no proporcionado');
    navigateTo('/dashboard', {});
    return;
  }

  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="dog-estadistics-container">
      <header class="page-header">
        <button id="backBtn" class="back-btn">← Volver</button>
        <h1>Estadísticas del Perro</h1>
      </header>
      
      <main class="estadistics-content">
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
              <p id="foundationName">Fundación: Cargando...</p>
            </div>
          </div>
        </div>
        
        <div id="dogDetailsSection" class="dog-details-section" style="display: none;">
          <h3>Información Principal</h3>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Peso:</span>
              <span id="dogWeight" class="value">Cargando...</span>
            </div>
            <div class="detail-item">
              <span class="label">Edad:</span>
              <span id="dogAge" class="value">Cargando...</span>
            </div>
            <div class="detail-item">
              <span class="label">Tamaño:</span>
              <span id="dogSize" class="value">Cargando...</span>
            </div>
            <div class="detail-item">
              <span class="label">Disponibilidad:</span>
              <span id="dogAvailability" class="value">Cargando...</span>
            </div>
          </div>
        </div>
        
        <div id="estadisticsSection" class="estadistics-section" style="display: none;">
          <h3>Estadísticas del Perro</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-header">
                <span class="stat-label">Comida</span>
                <span id="foodValue" class="stat-value">0/10</span>
              </div>
              <div class="progress-bar">
                <div id="foodProgress" class="progress-fill" style="width: 0%"></div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-header">
                <span class="stat-label">Salud</span>
                <span id="healthValue" class="stat-value">0/10</span>
              </div>
              <div class="progress-bar">
                <div id="healthProgress" class="progress-fill" style="width: 0%"></div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-header">
                <span class="stat-label">Bienestar / Accesorios</span>
                <span id="wellnessValue" class="stat-value">0/10</span>
              </div>
              <div class="progress-bar">
                <div id="wellnessProgress" class="progress-fill" style="width: 0%"></div>
              </div>
            </div>
            
            <div class="stat-item">
              <div class="stat-header">
                <span class="stat-label">Cariño / Atención</span>
                <span id="loveValue" class="stat-value">0/10</span>
              </div>
              <div class="progress-bar">
                <div id="loveProgress" class="progress-fill" style="width: 0%"></div>
              </div>
            </div>
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
}

function setupEventListeners() {
  const backBtn = document.getElementById('backBtn');
  
  // Volver al perfil del perro
  backBtn.addEventListener('click', () => navigateTo('/dog-profile', { dogId: dogId }));
}

// Cargar datos del perro
async function loadDogData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    // Cargar datos del perro
    const dogResponse = await makeRequestWithAuth(`/api/dogs/${dogId}`, 'GET', null, token);
    
    if (dogResponse && dogResponse.id) {
      dogData = dogResponse;
      
      // Usar la fundación original del perro (del creador)
      // Si el perro no tiene foundation_name, usar la del usuario logueado como fallback
      if (!dogData.foundation_name) {
        const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
        dogData.foundation_name = adminUser.foundation_name || adminUser.username || adminUser.name || 'Fundación no especificada';
      }
      
      renderDogProfile();
      renderDogDetails();
      renderEstadistics();
    } else {
      showError('No se pudo cargar la información del perro');
    }
    
  } catch (error) {
    console.error('Error al cargar datos del perro:', error);
    showError('Error al cargar la información del perro');
  }
}

function renderDogProfile() {
  if (!dogData) return;
  
  const dogProfileSection = document.getElementById('dogProfileSection');
  const loadingSection = document.getElementById('loadingSection');
  
  loadingSection.style.display = 'none';
  dogProfileSection.style.display = 'block';
 
  document.getElementById('dogName').textContent = dogData.name || 'Sin nombre';
  document.getElementById('foundationName').textContent = `Fundación: ${dogData.foundation_name || 'No especificada'}`;
  
  const dogImage = document.getElementById('dogImage');
  if (dogData.image) {
    dogImage.innerHTML = `<img src="${dogData.image}" alt="${dogData.name}" />`;
  } else {
    dogImage.innerHTML = '🐕';
  }
}

function renderDogDetails() {
  if (!dogData) return;
  
  const dogDetailsSection = document.getElementById('dogDetailsSection');
  dogDetailsSection.style.display = 'block';
  
  document.getElementById('dogWeight').textContent = `${dogData.weight || 'No especificado'} kg`;
  document.getElementById('dogAge').textContent = `${dogData.age || 'No especificada'} años`;
  document.getElementById('dogSize').textContent = dogData.size || 'No especificado';
  document.getElementById('dogAvailability').textContent = getAvailabilityText(dogData.availability);
}

function renderEstadistics() {
  if (!dogData) return;
  
  const estadisticsSection = document.getElementById('estadisticsSection');
  estadisticsSection.style.display = 'block';
  
  // Usar las columnas individuales en lugar del objeto stats
  updateStatBar('food', dogData.food_level || 0);
  updateStatBar('health', dogData.health_level || 0);
  updateStatBar('wellness', dogData.wellbeing_level || 0);
  updateStatBar('love', dogData.affection_level || 0);
}

// Actualizar barra de progreso 
function updateStatBar(statName, value) {
  const valueElement = document.getElementById(`${statName}Value`);
  const progressElement = document.getElementById(`${statName}Progress`);
  
  if (valueElement && progressElement) {
    valueElement.textContent = `${value}/10`;
    progressElement.style.width = `${(value / 10) * 100}%`;
  }
}


function getAvailabilityText(availability) {
  // Manejar valores booleanos
  if (typeof availability === 'boolean') {
    return availability ? 'Disponible' : 'No disponible';
  }
  
  // Manejar valores de texto
  const availabilityMap = {
    'disponible': 'Disponible',
    'no_disponible': 'No disponible',
    'adoptado': 'Adoptado',
    'en_proceso': 'En proceso de adopción',
    'true': 'Disponible',
    'false': 'No disponible'
  };
  
  return availabilityMap[availability] || 'Desconocido';
}

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
