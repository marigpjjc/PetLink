// Solicitud de citas

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth } from './admin-login.js';

let allAppointments = [];
let filteredAppointments = [];

export default async function renderAppointmentsManage() {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    navigateTo('/admin-login', {});
    return;
  }

  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="appointments-manage-container">
      <header class="page-header">
        <h1>Gestión de Solicitudes de Citas</h1>
        <button id="backBtn" class="back-btn">← Volver al Dashboard</button>
      </header>
      
      <main class="appointments-content">
        <div class="search-section">
          <div class="search-container">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Buscar por nombre del perro..."
              class="search-input"
            />
            <button id="clearSearchBtn" class="clear-search-btn">Limpiar</button>
          </div>
        </div>
        
        <div class="appointments-section">
          <div class="section-header">
            <h2>Citas Pendientes</h2>
            <span id="appointmentsCount" class="count-badge">0 citas</span>
          </div>
          
          <div id="appointmentsList" class="appointments-list">
            <div class="loading-message">Cargando citas...</div>
          </div>
          
          <div id="noAppointmentsMessage" class="no-appointments" style="display: none;">
            <p>No hay citas pendientes</p>
            <p>Las nuevas solicitudes aparecerán aquí</p>
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
  await loadAppointments();
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const backBtn = document.getElementById('backBtn');
  
  searchInput.addEventListener('input', handleSearch);
  
  clearSearchBtn.addEventListener('click', clearSearch);
  
  backBtn.addEventListener('click', () => navigateTo('/dashboard', {}));
}

// Cargar citas desde el backend
async function loadAppointments() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    // Petición al backend
    const response = await makeRequestWithAuth('/api/appointments', 'GET', null, token);
    
    if (Array.isArray(response)) {
      allAppointments = response;
      filteredAppointments = [...allAppointments];
      renderAppointmentsList();
      updateAppointmentsCount();
    } else {
      showError('Error al cargar las citas');
    }
    
  } catch (error) {
    console.error('Error al cargar citas:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando');
  }
}

function renderAppointmentsList() {
  const appointmentsList = document.getElementById('appointmentsList');
  const noAppointmentsMessage = document.getElementById('noAppointmentsMessage');
  
  if (filteredAppointments.length === 0) {
    appointmentsList.innerHTML = '';
    noAppointmentsMessage.style.display = 'block';
    return;
  }
  
  noAppointmentsMessage.style.display = 'none';
  
  appointmentsList.innerHTML = filteredAppointments.map(appointment => `
    <div class="appointment-card" data-appointment-id="${appointment.id}">
      <div class="card-header">
        <div class="dog-info">
          <div class="dog-image">
            ${appointment.dog_image ? 
              `<img src="${appointment.dog_image}" alt="${appointment.dog_name}" />` : 
              '<div class="no-image">🐕</div>'
            }
          </div>
          <div class="dog-details">
            <h3>${appointment.dog_name || 'Sin nombre'}</h3>
            <p class="padrino-name">Padrino: ${appointment.padrino_name || 'Sin nombre'}</p>
          </div>
        </div>
        <div class="appointment-status">
          <span class="status-badge ${appointment.status || 'pending'}">${getStatusText(appointment.status)}</span>
        </div>
      </div>
      
      <div class="card-body">
        <div class="appointment-details">
          <div class="detail-item">
            <span class="label">Fecha:</span>
            <span class="value">${formatDate(appointment.date)}</span>
          </div>
          <div class="detail-item">
            <span class="label">Hora:</span>
            <span class="value">${appointment.time || 'No especificada'}</span>
          </div>
          <div class="detail-item">
            <span class="label">Teléfono:</span>
            <span class="value">${appointment.phone_number || 'No disponible'}</span>
          </div>
          ${appointment.notes ? `
            <div class="detail-item">
              <span class="label">Notas:</span>
              <span class="value">${appointment.notes}</span>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div class="card-actions">
        <button 
          class="action-btn accept-btn" 
          onclick="handleAppointmentDecision(${appointment.id}, 'accepted', '${appointment.dog_name}', '${appointment.padrino_name}', '${appointment.phone_number}', '${appointment.date}', '${appointment.time}')"
        >
          Aceptar
        </button>
        <button 
          class="action-btn reject-btn" 
          onclick="handleAppointmentDecision(${appointment.id}, 'rejected', '${appointment.dog_name}', '${appointment.padrino_name}', '${appointment.phone_number}', '${appointment.date}', '${appointment.time}')"
        >
          Rechazar
        </button>
      </div>
    </div>
  `).join('');
}

function handleSearch(event) {
  const searchTerm = event.target.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredAppointments = [...allAppointments];
  } else {
    filteredAppointments = allAppointments.filter(appointment => 
      (appointment.dog_name && appointment.dog_name.toLowerCase().includes(searchTerm)) ||
      (appointment.padrino_name && appointment.padrino_name.toLowerCase().includes(searchTerm))
    );
  }
  
  renderAppointmentsList();
  updateAppointmentsCount();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  filteredAppointments = [...allAppointments];
  renderAppointmentsList();
  updateAppointmentsCount();
}

// Decisión de cita (aceptar/rechazar)
async function handleAppointmentDecision(appointmentId, decision, dogName, padrinoName, phoneNumber, date, time) {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const actionText = decision === 'accepted' ? 'aceptar' : 'rechazar';
    if (!confirm(`¿Estás seguro de que quieres ${actionText} esta cita?`)) {
      return;
    }
    
    const buttons = document.querySelectorAll(`[data-appointment-id="${appointmentId}"] .action-btn`);
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.textContent = 'Procesando...';
    });
    
    const response = await makeRequestWithAuth(
      `/api/appointments/decision/${appointmentId}`, 
      'PUT', 
      {
        decision: decision,
        phoneNumber: phoneNumber,
        padrinoName: padrinoName,
        dogName: dogName,
        date: date,
        time: time
      }, 
      token
    );
    
    if (response.success) {
      const actionTextSuccess = decision === 'accepted' ? 'aceptada' : 'rechazada';
      showSuccess(`Cita ${actionTextSuccess} exitosamente${response.whatsappSent ? ' y WhatsApp enviado' : ''}`);
      
      allAppointments = allAppointments.filter(apt => apt.id !== appointmentId);
      filteredAppointments = filteredAppointments.filter(apt => apt.id !== appointmentId);
      
      renderAppointmentsList();
      updateAppointmentsCount();
    } else {
      showError(response.error || 'Error al procesar la cita');
      
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.textContent = btn.classList.contains('accept-btn') ? '✅ Aceptar' : '❌ Rechazar';
      });
    }
    
  } catch (error) {
    console.error('Error al procesar cita:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando');
    
    const buttons = document.querySelectorAll(`[data-appointment-id="${appointmentId}"] .action-btn`);
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.textContent = btn.classList.contains('accept-btn') ? '✅ Aceptar' : '❌ Rechazar';
    });
  }
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

function formatDate(dateString) {
  if (!dateString) return 'No especificada';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}

function getStatusText(status) {
  const statusMap = {
    'pending': 'Pendiente',
    'accepted': 'Aceptada',
    'rejected': 'Rechazada',
    'completed': 'Completada',
    'cancelled': 'Cancelada'
  };
  
  return statusMap[status] || 'Desconocido';
}

function updateAppointmentsCount() {
  const countElement = document.getElementById('appointmentsCount');
  const count = filteredAppointments.length;
  countElement.textContent = `${count} ${count === 1 ? 'cita' : 'citas'}`;
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

window.handleAppointmentDecision = handleAppointmentDecision;
