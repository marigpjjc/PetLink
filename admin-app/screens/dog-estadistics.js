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
        
        <div id="editSection" class="edit-section" style="display: none;">
          <h3>Editar Disponibilidad</h3>
          <div class="edit-form">
            <div class="form-group">
              <label for="availabilitySelect">Estado de disponibilidad:</label>
              <select id="availabilitySelect" class="availability-select">
                <option value="disponible">Disponible</option>
                <option value="no_disponible">No disponible</option>
              </select>
            </div>
            <div class="form-actions">
              <button id="saveBtn" class="save-btn">Guardar Cambios</button>
              <button id="cancelBtn" class="cancel-btn">Cancelar</button>
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
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  
  // Volver al dashboard
  backBtn.addEventListener('click', () => navigateTo('/dashboard', {}));
  
  // Guardar cambios de disponibilidad
  saveBtn.addEventListener('click', handleSaveAvailability);
  
  // Cancelar edición
  cancelBtn.addEventListener('click', handleCancelEdit);
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
    
    const response = await makeRequestWithAuth(`/api/dogs/${dogId}`, 'GET', null, token);
    
    if (response && response.id) {
      dogData = response;
      renderDogProfile();
      renderDogDetails();
      renderEstadistics();
      renderEditSection();
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
  if (!dogData || !dogData.stats) return;
  
  const estadisticsSection = document.getElementById('estadisticsSection');
  estadisticsSection.style.display = 'block';
  
  const stats = dogData.stats;
  
  updateStatBar('food', stats.food || 0);
  updateStatBar('health', stats.health || 0);
  updateStatBar('wellness', stats.wellness || 0);
  updateStatBar('love', stats.love || 0);
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

function renderEditSection() {
  if (!dogData) return;
  
  const editSection = document.getElementById('editSection');
  editSection.style.display = 'block';
  
  const availabilitySelect = document.getElementById('availabilitySelect');
  availabilitySelect.value = dogData.availability || 'disponible';
}

async function handleSaveAvailability() {
  try {
    const availabilitySelect = document.getElementById('availabilitySelect');
    const newAvailability = availabilitySelect.value;
    
    if (newAvailability === dogData.availability) {
      showError('No hay cambios para guardar');
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Guardando...';
    
    const response = await makeRequestWithAuth(`/api/dogs/${dogId}`, 'PUT', {
      availability: newAvailability
    }, token);
    
    if (response && response.id) {

      dogData.availability = newAvailability;
      
      document.getElementById('dogAvailability').textContent = getAvailabilityText(newAvailability);
      
      showSuccess('Disponibilidad actualizada exitosamente');
    } else {
      showError('Error al actualizar la disponibilidad');
    }
    
  } catch (error) {
    console.error('Error al guardar disponibilidad:', error);
    showError('Error al guardar los cambios');
  } finally {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar Cambios';
  }
}

function handleCancelEdit() {
  const availabilitySelect = document.getElementById('availabilitySelect');
  availabilitySelect.value = dogData.availability || 'disponible';
  showSuccess('Cambios cancelados');
}

function getAvailabilityText(availability) {
  const availabilityMap = {
    'disponible': 'Disponible',
    'no_disponible': 'No disponible',
    'adoptado': 'Adoptado',
    'en_proceso': 'En proceso de adopción'
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
