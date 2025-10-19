// Pantalla de las donaciones

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth } from './admin-login.js';

let allDogs = [];
let filteredDogs = [];
let allDonations = [];
let currentFilter = 'all';

export default async function renderDonationsView() {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    navigateTo('/admin-login', {});
    return;
  }

  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="donations-view-container">
      <header class="page-header">
        <h1>Vista General de Donaciones</h1>
        <button id="backBtn" class="back-btn">← Volver al Dashboard</button>
      </header>
      
      <main class="donations-content">
        <div class="search-section">
          <div class="search-container">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Buscar perros por nombre..."
              class="search-input"
            />
            <button id="clearSearchBtn" class="clear-search-btn">Limpiar</button>
          </div>
        </div>
        
        <div class="filters-section">
          <h3>Filtros:</h3>
          <div class="filter-buttons">
            <button id="filterAll" class="filter-btn active">Todos los perros</button>
            <button id="filterPuppies" class="filter-btn">Cachorros</button>
            <button id="filterLessSponsored" class="filter-btn">Menos apadrinados</button>
          </div>
        </div>
        
        <div class="dogs-section">
          <div class="section-header">
            <h2>Perros</h2>
            <span id="dogsCount" class="count-badge">0 perros</span>
          </div>
          
          <div id="dogsList" class="dogs-list">
            <div class="loading-message">Cargando perros...</div>
          </div>
          
          <div id="noDogsMessage" class="no-dogs" style="display: none;">
            <p>No hay resultados disponibles</p>
            <p>Intenta con otros filtros o términos de búsqueda</p>
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
  await loadInitialData();
}

function setupEventListeners() {
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const backBtn = document.getElementById('backBtn');
  const filterAll = document.getElementById('filterAll');
  const filterPuppies = document.getElementById('filterPuppies');
  const filterLessSponsored = document.getElementById('filterLessSponsored');
  
  searchInput.addEventListener('input', handleSearch);
  
  clearSearchBtn.addEventListener('click', clearSearch);
  
  backBtn.addEventListener('click', () => navigateTo('/dashboard', {}));
  
  filterAll.addEventListener('click', () => applyFilter('all'));
  filterPuppies.addEventListener('click', () => applyFilter('puppies'));
  filterLessSponsored.addEventListener('click', () => applyFilter('lessSponsored'));
}

async function loadInitialData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      showError('Sesión expirada. Por favor inicia sesión nuevamente');
      navigateTo('/admin-login', {});
      return;
    }
    
    const [dogsResponse, donationsResponse] = await Promise.allSettled([
      makeRequestWithAuth('/api/dogs', 'GET', null, token),
      makeRequestWithAuth('/api/donations', 'GET', null, token)
    ]);
    
    if (dogsResponse.status === 'fulfilled' && Array.isArray(dogsResponse.value)) {
      allDogs = dogsResponse.value;
      filteredDogs = [...allDogs];
    } else {
      console.error('Error al cargar perros:', dogsResponse.reason);
      showError('Error al cargar la lista de perros');
    }
    
    if (donationsResponse.status === 'fulfilled' && Array.isArray(donationsResponse.value)) {
      allDonations = donationsResponse.value;
    } else {
      console.error('Error al cargar donaciones:', donationsResponse.reason);
    }
    
    renderDogsList();
    updateDogsCount();
    
  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando');
  }
}

// Manejar búsqueda
async function handleSearch(event) {
  const searchTerm = event.target.value.trim();
  
  if (searchTerm === '') {
    filteredDogs = [...allDogs];
    applyCurrentFilter();
  } else {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        showError('Sesión expirada. Por favor inicia sesión nuevamente');
        navigateTo('/admin-login', {});
        return;
      }
      
      const response = await makeRequestWithAuth(`/api/dogs/search/${encodeURIComponent(searchTerm)}`, 'GET', null, token);
      
      if (Array.isArray(response)) {
        filteredDogs = response;
        applyCurrentFilter();
      } else {
        filteredDogs = [];
        applyCurrentFilter();
      }
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      showError('Error al buscar perros');
      filteredDogs = [];
      applyCurrentFilter();
    }
  }
  
  renderDogsList();
  updateDogsCount();
}

function applyFilter(filterType) {
  currentFilter = filterType;
  
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`filter${filterType.charAt(0).toUpperCase() + filterType.slice(1)}`).classList.add('active');
  
  applyCurrentFilter();
  renderDogsList();
  updateDogsCount();
}

function applyCurrentFilter() {
  switch (currentFilter) {
    case 'all':

      break;
    case 'puppies':

      filteredDogs = filteredDogs.filter(dog => dog.age && dog.age < 2);
      break;
    case 'lessSponsored':
  
      filteredDogs = filteredDogs.filter(dog => {
        const dogDonations = allDonations.filter(donation => donation.id_dog === dog.id);
        return dogDonations.length <= 2; 
      });
      break;
  }
}

function renderDogsList() {
  const dogsList = document.getElementById('dogsList');
  const noDogsMessage = document.getElementById('noDogsMessage');
  
  if (filteredDogs.length === 0) {
    dogsList.innerHTML = '';
    noDogsMessage.style.display = 'block';
    return;
  }
  
  noDogsMessage.style.display = 'none';
  
  dogsList.innerHTML = filteredDogs.map(dog => {
    const dogDonations = allDonations.filter(donation => donation.id_dog === dog.id);
    const donationCount = dogDonations.length;
    
    return `
      <div class="dog-card" data-dog-id="${dog.id}">
        <div class="card-header">
          <div class="dog-image">
            ${dog.image ? 
              `<img src="${dog.image}" alt="${dog.name}" />` : 
              '<div class="no-image">🐕</div>'
            }
          </div>
          <div class="dog-info">
            <h3>${dog.name || 'Sin nombre'}</h3>
            <p class="dog-age">Edad: ${dog.age || 'No especificada'} años</p>
            <p class="donation-count">Donaciones: ${donationCount}</p>
          </div>
        </div>
        
        <div class="card-body">
          <div class="dog-details">
            <div class="detail-item">
              <span class="label">Tamaño:</span>
              <span class="value">${dog.size || 'No especificado'}</span>
            </div>
            <div class="detail-item">
              <span class="label">Peso:</span>
              <span class="value">${dog.weight || 'No especificado'} kg</span>
            </div>
            <div class="detail-item">
              <span class="label">Disponibilidad:</span>
              <span class="value">${dog.availability === 'disponible' ? 'Disponible' : 'No disponible'}</span>
            </div>
            ${dog.description ? `
              <div class="detail-item">
                <span class="label">Descripción:</span>
                <span class="value">${dog.description.substring(0, 100)}${dog.description.length > 100 ? '...' : ''}</span>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="card-actions">
          <button 
            class="action-btn view-donations-btn" 
            onclick="viewDogDonations(${dog.id})"
          >
            Ver donaciones
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  filteredDogs = [...allDogs];
  applyCurrentFilter();
  renderDogsList();
  updateDogsCount();
}

// Ver donaciones de un perro específico
function viewDogDonations(dogId) {
  navigateTo('/donations-profile-dog', { dogId: dogId });
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

function updateDogsCount() {
  const countElement = document.getElementById('dogsCount');
  const count = filteredDogs.length;
  countElement.textContent = `${count} ${count === 1 ? 'perro' : 'perros'}`;
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

window.viewDogDonations = viewDogDonations;
