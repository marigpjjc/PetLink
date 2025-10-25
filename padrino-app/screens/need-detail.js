// Esta es la pantalla de DETALLE DE UNA NECESIDAD

import { getNeedById } from '../services/api.js';
import router from '../utils/router.js';

// Renderizar (mostrar) el detalle de la necesidad
export function renderNeedDetail(needId) {
  const app = document.getElementById('app');
  
  // Mostrar loading mientras se cargan los datos
  app.innerHTML = `
    <div class="need-detail-container">
      <p class="loading">Cargando necesidad...</p>
    </div>
  `;
  
  // Cargar los datos de la necesidad
  loadNeedDetail(needId);
}

// Cargar el detalle de la necesidad
async function loadNeedDetail(needId) {
  try {
    const need = await getNeedById(needId);
    displayNeedDetail(need);
  } catch (error) {
    console.error('Error al cargar necesidad:', error);
    document.getElementById('app').innerHTML = `
      <div class="need-detail-container">
        <p class="error">Error al cargar la necesidad</p>
        <button onclick="window.history.back()" class="btn-back">Volver</button>
      </div>
    `;
  }
}

// Mostrar el detalle de la necesidad
function displayNeedDetail(need) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="need-detail-container">
      <!-- Boton de volver -->
      <button class="btn-back" id="btn-back">← Volver</button>
      
      <!-- Imagen del producto -->
      <div class="need-detail-image">
        <img src="${need.image}" alt="${need.name}">
      </div>
      
      <!-- Informacion del producto -->
      <div class="need-detail-info">
        <h1 class="need-detail-name">${need.name}</h1>
        
        ${need.category ? `
          <p class="need-detail-category">Categoria: ${need.category}</p>
        ` : ''}
        
        <p class="need-detail-description">${need.description || 'Sin descripcion'}</p>
        
        <p class="need-detail-price">$${need.price}</p>
        
        <button class="btn-donate" id="btn-donate">Donar</button>
      </div>
    </div>
  `;
  
  // Agregar eventos
  setupNeedDetailEvents(need);
}

// Configurar eventos de la pantalla
function setupNeedDetailEvents(need) {
  // Boton volver
  document.getElementById('btn-back').addEventListener('click', () => {
    window.history.back();
  });
  
  // Boton donar
  document.getElementById('btn-donate').addEventListener('click', () => {
    // Ir a la pantalla de pago con los datos de la necesidad
    router.navigateTo(`/payment?needId=${need.id}&price=${need.price}&dogId=${need.id_dog}`);
  });
}