// Pantalla de perfil individual del perro

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth } from './admin-login.js';

let dogData = null;
let needsData = [];
let dogId = null;

export default async function renderDogProfile(data) {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    navigateTo('/admin-login', {});
    return;
  }

  dogId = data.dogId;
  
  if (!dogId) {
    showError('ID del perro no proporcionado');
    navigateTo('/dog-management', {});
    return;
  }

  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="dog-profile-container">
      <header class="page-header">
        <button id="backBtn" class="back-btn">← Volver</button>
        <h1>Perfil del Perro</h1>
      </header>
      
      <main class="profile-content">
        <div id="loadingSection" class="loading-section">
          <div class="loading-message">Cargando información del perro...</div>
        </div>
        
        <div id="dogInfoSection" class="dog-info-section" style="display: none;">
          <div class="dog-header">
            <div class="dog-image">
              <div id="dogImage" class="dog-image-placeholder">image</div>
            </div>
            <div class="dog-basic-info">
              <h2 id="dogName">Cargando...</h2>
              <p id="foundationName">Fundación: Cargando...</p>
            </div>
          </div>
          
          <div class="dog-details">
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
                <span class="label">Disponibilidad:</span>
                <span id="dogAvailability" class="value">Cargando...</span>
              </div>
              <div class="detail-item">
                <span class="label">Tamaño:</span>
                <span id="dogSize" class="value">Cargando...</span>
              </div>
            </div>
            <div class="description-section">
              <h4>Descripción:</h4>
              <p id="dogDescription">Cargando...</p>
            </div>
          </div>
          
          <div class="appointment-availability">
            <h3>Disponibilidad para citas de juego</h3>
            <div class="availability-status">
              <span id="appointmentStatus" class="status-text">Cargando...</span>
            </div>
          </div>
        </div>
        
        <div id="needsSection" class="needs-section" style="display: none;">
          <div class="section-header">
            <h3>Necesidades del Perro</h3>
            <button id="addNeedBtn" class="add-need-btn">Agregar artículo</button>
          </div>
          
          <div id="needsList" class="needs-list">
            <!-- Las necesidades se cargarán aquí -->
          </div>
          
          <div id="noNeedsMessage" class="no-needs" style="display: none;">
            <p>Este perro no tiene necesidades registradas</p>
            <p>Puedes agregar artículos usando el botón "Agregar artículo"</p>
          </div>
        </div>
        
        <div id="actionsSection" class="actions-section" style="display: none;">
          <h3>Acciones</h3>
          <div class="action-buttons">
            <button id="statisticsBtn" class="action-btn statistics-btn">Estadísticas</button>
            <button id="deleteDogBtn" class="action-btn delete-btn">Eliminar perro</button>
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
  await loadNeedsData();
}

function setupEventListeners() {
  const backBtn = document.getElementById('backBtn');
  const addNeedBtn = document.getElementById('addNeedBtn');
  const statisticsBtn = document.getElementById('statisticsBtn');
  const deleteDogBtn = document.getElementById('deleteDogBtn');
  
  backBtn.addEventListener('click', () => navigateTo('/dog-management', {}));
  
  addNeedBtn.addEventListener('click', () => navigateTo('/products-manage', { fromDogProfile: true, dogId: dogId }));
  
  statisticsBtn.addEventListener('click', () => navigateTo('/dog-estadistics', { dogId: dogId }));
  
  deleteDogBtn.addEventListener('click', handleDeleteDog);
}

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
      renderDogInfo();
    } else {
      showError('No se pudo cargar la información del perro');
    }
    
  } catch (error) {
    console.error('Error al cargar datos del perro:', error);
    showError('Error al cargar la información del perro');
  }
}

async function loadNeedsData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const response = await makeRequestWithAuth(`/api/needs/dog/${dogId}`, 'GET', null, token);
    
    if (Array.isArray(response)) {
      needsData = response;
      console.log('Necesidades cargadas:', needsData);
      renderNeedsList();
    } else {
      needsData = [];
      renderNeedsList();
    }
    
  } catch (error) {
    console.error('Error al cargar necesidades:', error);
    showError('Error al cargar las necesidades del perro');
    needsData = [];
    renderNeedsList();
  }
}

function renderDogInfo() {
  if (!dogData) return;
  
  const dogInfoSection = document.getElementById('dogInfoSection');
  const loadingSection = document.getElementById('loadingSection');
  
  loadingSection.style.display = 'none';
  dogInfoSection.style.display = 'block';
  
  // Obtener nombre de la fundación del usuario logueado
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');
  const foundationName = adminUser.foundation_name || dogData.foundation_name || 'No especificada';
  
  document.getElementById('dogName').textContent = dogData.name || 'Sin nombre';
  document.getElementById('foundationName').textContent = `Fundación: ${foundationName}`;
  document.getElementById('dogWeight').textContent = `${dogData.weight || 'No especificado'} kg`;
  document.getElementById('dogAge').textContent = `${dogData.age || 'No especificada'} años`;
  document.getElementById('dogAvailability').textContent = getAvailabilityText(dogData.availability);
  document.getElementById('dogSize').textContent = dogData.size || 'No especificado';
  document.getElementById('dogDescription').textContent = dogData.description || 'Sin descripción';
  
  // Actualizar imagen del perro
  const dogImage = document.getElementById('dogImage');
  if (dogData.image) {
    dogImage.innerHTML = `<img src="${dogData.image}" alt="${dogData.name}" />`;
  } else {
    dogImage.innerHTML = 'imagen';
  }
  
  // Actualizar disponibilidad para citas
  const appointmentStatus = document.getElementById('appointmentStatus');
  appointmentStatus.textContent = getAvailabilityText(dogData.availability);
  
  // Mostrar secciones adicionales
  document.getElementById('needsSection').style.display = 'block';
  document.getElementById('actionsSection').style.display = 'block';
}

function renderNeedsList() {
  const needsList = document.getElementById('needsList');
  const noNeedsMessage = document.getElementById('noNeedsMessage');
  
  if (needsData.length === 0) {
    needsList.innerHTML = '';
    noNeedsMessage.style.display = 'block';
    return;
  }
  
  noNeedsMessage.style.display = 'none';
  
  needsList.innerHTML = needsData.map(need => `
    <div class="need-card" data-need-id="${need.id}">
      <div class="card-header">
        <div class="need-image">
          ${need.image ? 
            `<img src="${need.image}" alt="${need.name}" />` : 
            '<div class="no-image">📦</div>'
          }
        </div>
        <div class="need-info">
          <h4>${need.name || 'Sin nombre'}</h4>
          <p class="need-price">$${formatAmount(need.price)}</p>
        </div>
      </div>
      
      <div class="card-body">
        <div class="need-details">
          <div class="detail-item">
            <span class="label">Descripción:</span>
            <span class="value">${need.description || 'Sin descripción'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Categoría:</span>
            <span class="value">${need.category || 'No especificada'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Estado:</span>
            <span class="value">${getNeedStatusText(need.estado)}</span>
          </div>
        </div>
      </div>
      
      <div class="card-actions">
        <button 
          class="action-btn delete-need-btn" 
          onclick="deleteNeed(${need.id})"
        >
          Eliminar
        </button>
      </div>
    </div>
  `).join('');
}

// Eliminar necesidad
async function deleteNeed(needId) {
  try {
    if (!confirm('¿Estás seguro de que quieres eliminar esta necesidad?')) {
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const response = await makeRequestWithAuth(`/api/needs/${needId}`, 'DELETE', null, token);
    
    if (response && response.message) {
      showSuccess('Necesidad eliminada exitosamente');
      
      needsData = needsData.filter(need => need.id !== needId);
      renderNeedsList();
    } else {
      showError('Error al eliminar la necesidad');
    }
    
  } catch (error) {
    console.error('Error al eliminar necesidad:', error);
    showError('Error al eliminar la necesidad');
  }
}

// Eliminar perro
async function handleDeleteDog() {
  try {
    if (!confirm('¿Estás seguro de que quieres eliminar este perro? Esta acción no se puede deshacer.')) {
      return;
    }
    
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const deleteBtn = document.getElementById('deleteDogBtn');
    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Eliminando...';
    
    const response = await makeRequestWithAuth(`/api/dogs/${dogId}`, 'DELETE', null, token);
    
    if (response && response.message) {
      showSuccess('Perro eliminado exitosamente');
      
      setTimeout(() => {
        navigateTo('/dog-management', {});
      }, 2000);
    } else {
      showError('Error al eliminar el perro');
    }
    
  } catch (error) {
    console.error('Error al eliminar perro:', error);
    showError('Error al eliminar el perro');
  } finally {
    const deleteBtn = document.getElementById('deleteDogBtn');
    deleteBtn.disabled = false;
    deleteBtn.textContent = 'Eliminar perro';
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

function getNeedStatusText(status) {
  console.log('Estado recibido:', status, 'Tipo:', typeof status);
  
  const statusMap = {
    'pendiente': 'Pendiente',
    'completada': 'Completada',
    'cancelada': 'Cancelada',
    'en_proceso': 'En proceso',
    'urgente': 'Urgente',
    'pending': 'Pendiente',
    'completed': 'Completada',
    'cancelled': 'Cancelada',
    'in_progress': 'En proceso',
    'urgent': 'Urgente'
  };
  
  const result = statusMap[status] || 'Desconocido';
  console.log('Estado mapeado:', result);
  return result;
}

function formatAmount(amount) {
  if (!amount) return '0';
  
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('es-CO').format(numAmount);
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

window.deleteNeed = deleteNeed;