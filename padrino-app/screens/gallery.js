// Esta es la GALERÍA de fotos generadas por IA

import { getDogById } from '../services/api.js';
import router from '../utils/router.js';
import supabase from '../supabase.service.js';

// Renderizar (mostrar) la galería
export async function renderGallery(dogId) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="gallery-container">
      <button class="btn-back" id="btn-back">← Volver</button>
      <p class="loading">Cargando galería...</p>
    </div>
  `;
  
  try {
    // Cargar perro y sus fotos generadas
    const dog = await getDogById(dogId);
    const photos = await getAIPhotosForDog(dogId);
    
    displayGallery(dog, photos);
    
  } catch (error) {
    console.error('Error al cargar galería:', error);
    app.innerHTML = `
      <div class="gallery-container">
        <button class="btn-back" id="btn-back">← Volver</button>
        <p class="error">Error al cargar la galería</p>
      </div>
    `;
    setupBackButton(dogId);
  }
}

// Obtener fotos generadas por IA para un perro específico
async function getAIPhotosForDog(dogId) {
  try {
    console.log('Buscando fotos IA para perro:', dogId);
    
    // Consultar tabla Accessories donde:
    // - id_dog = dogId (fotos de este perro)
    // - imagen_ia no es null (tiene foto generada)
    const { data, error } = await supabase
      .from('Accessories')
      .select('*')
      .eq('id_dog', parseInt(dogId))
      .not('imagen_ia', 'is', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error al buscar fotos:', error);
      throw error;
    }
    
    console.log('Fotos encontradas:', data?.length || 0);
    return data || [];
    
  } catch (error) {
    console.error('Error en getAIPhotosForDog:', error);
    return [];
  }
}

// Mostrar la galería
function displayGallery(dog, photos) {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="gallery-container">
      <!-- Botón volver -->
      <button class="btn-back" id="btn-back">← Volver al perfil</button>
      
      <!-- Header con info del perro -->
      <div class="gallery-header">
        <div class="gallery-dog-image">
          <img src="${dog.image}" alt="${dog.name}">
        </div>
        <div class="gallery-dog-info">
          <h1 class="gallery-dog-name">${dog.name}</h1>
          <p class="gallery-dog-subtitle">Galería de Fotos con IA</p>
          <p class="gallery-photo-count">${photos.length} foto${photos.length !== 1 ? 's' : ''} generada${photos.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      
      <!-- Grid de fotos -->
      <div id="gallery-grid" class="gallery-grid">
        ${photos.length === 0 ? `
          <div class="no-photos">
            <p>😊 Aún no hay fotos generadas</p>
            <p>Compra un accesorio para generar la primera foto especial de ${dog.name}</p>
            <button class="btn-buy-accessory" id="btn-go-accessories">
              Ver Accesorios
            </button>
          </div>
        ` : photos.map(photo => `
          <div class="gallery-photo-card" data-photo-id="${photo.id}">
            <img 
              src="${photo.imagen_ia}" 
              alt="${dog.name} con ${photo.category}"
              class="gallery-photo-image"
            >
            <div class="gallery-photo-overlay">
              <p class="gallery-photo-category">${photo.category}</p>
              <p class="gallery-photo-date">${formatDate(photo.created_at)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Eventos
  setupBackButton(dog.id);
  
  if (photos.length === 0) {
    setupGoToAccessoriesButton(dog.id);
  } else {
    setupPhotoClickEvents(photos);
  }
}

// Configurar botón volver
function setupBackButton(dogId) {
  const btnBack = document.getElementById('btn-back');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      router.navigateTo(`/dog/${dogId}`);
    });
  }
}

// Configurar botón ir a accesorios
function setupGoToAccessoriesButton(dogId) {
  const btn = document.getElementById('btn-go-accessories');
  if (btn) {
    btn.addEventListener('click', () => {
      router.navigateTo(`/accessories/${dogId}`);
    });
  }
}

// Configurar eventos de click en las fotos
function setupPhotoClickEvents(photos) {
  document.querySelectorAll('.gallery-photo-card').forEach(card => {
    card.addEventListener('click', () => {
      const photoId = card.dataset.photoId;
      const photo = photos.find(p => p.id == photoId);
      if (photo) {
        showPhotoModal(photo);
      }
    });
  });
}

// Mostrar modal con la foto grande
function showPhotoModal(photo) {
  const modal = document.createElement('div');
  modal.className = 'photo-modal';
  modal.innerHTML = `
    <div class="photo-modal-content">
      <button class="photo-modal-close" id="modal-close">✕</button>
      <img src="${photo.imagen_ia}" alt="Foto" class="photo-modal-image">
      <div class="photo-modal-info">
        <p class="photo-modal-category">${photo.category}</p>
        <p class="photo-modal-date">${formatDate(photo.created_at)}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Cerrar al hacer click en X o fuera de la imagen
  document.getElementById('modal-close').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Formatear fecha
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('es-ES', options);
}