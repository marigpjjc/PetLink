// Esta es la pantalla de ESTADÍSTICAS del perro

import { getDogStatistics } from '../services/api.js';
import router from '../utils/router.js';

// Renderizar la pantalla de estadísticas
export function renderDogStatistics(dogId) {
  const app = document.getElementById('app');
  
  // Mostrar loading mientras se cargan los datos
  app.innerHTML = `
    <div class="statistics-container">
      <p class="loading">Cargando estadísticas...</p>
    </div>
  `;
  
  // Cargar las estadísticas
  loadStatistics(dogId);
}

// Cargar las estadísticas del perro
async function loadStatistics(dogId) {
  try {
    const stats = await getDogStatistics(dogId);
    displayStatistics(stats, dogId);
  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    document.getElementById('app').innerHTML = `
      <div class="statistics-container">
        <p class="error">Error al cargar las estadísticas</p>
        <button onclick="window.history.back()" class="btn-back">Volver</button>
      </div>
    `;
  }
}

// Mostrar las estadísticas
function displayStatistics(stats, dogId) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="statistics-container">
      <button class="btn-back" id="btn-back">← Volver</button>
      
      <h1 class="statistics-title">Estadísticas de ${stats.name}</h1>
      
      <div class="statistics-bars">
        <div class="stat-item">
          <div class="stat-header">
            <span class="stat-label">Comida</span>
            <span class="stat-value">${stats.food_level}/10</span>
          </div>
          <div class="stat-bar-container">
            <div class="stat-bar stat-bar-food" style="width: ${stats.food_level * 10}%"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-header">
            <span class="stat-label">Salud</span>
            <span class="stat-value">${stats.health_level}/10</span>
          </div>
          <div class="stat-bar-container">
            <div class="stat-bar stat-bar-health" style="width: ${stats.health_level * 10}%"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-header">
            <span class="stat-label">Bienestar / Accesorios</span>
            <span class="stat-value">${stats.wellbeing_level}/10</span>
          </div>
          <div class="stat-bar-container">
            <div class="stat-bar stat-bar-wellbeing" style="width: ${stats.wellbeing_level * 10}%"></div>
          </div>
        </div>
        
        <div class="stat-item">
          <div class="stat-header">
            <span class="stat-label">Cariño / Atención</span>
            <span class="stat-value">${stats.affection_level}/10</span>
          </div>
          <div class="stat-bar-container">
            <div class="stat-bar stat-bar-affection" style="width: ${stats.affection_level * 10}%"></div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Configurar evento del botón volver
  document.getElementById('btn-back').addEventListener('click', () => {
    router.navigateTo(`/dog/${dogId}`);
  });
}