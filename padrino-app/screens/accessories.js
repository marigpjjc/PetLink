// Pantalla que muestra todos los accesorios disponibles

import { apiService } from '../services/api.js';
import { router } from '../utils/router.js';

export async function renderAccessories(dogId) {
    const app = document.getElementById('app');
    
    // Mostrar mensaje de carga
    app.innerHTML = '<div class="loading">Cargando accesorios...</div>';
    
    // Traer todos los accesorios
    const accessories = await apiService.getAllAccessories();
    
    // Crear el HTML
    app.innerHTML = `
        <button class="back-btn" onclick="router.navigateTo('/dog/${dogId}')">Volver</button>
        
        <div class="header">
            <h1>Accesorios para tu Perrito</h1>
        </div>
        
        <div id="accessories-container" class="cards-container">
            ${accessories.length === 0 ? '<p>No hay accesorios disponibles</p>' : ''}
        </div>
    `;
    
    // Obtener el contenedor
    const container = document.getElementById('accessories-container');
    
    // Crear una card por cada accesorio
    accessories.forEach(accessory => {
        const card = createAccessoryCard(accessory, dogId);
        container.appendChild(card);
    });
}

// Crear una card para un accesorio
function createAccessoryCard(accessory, dogId) {
    const card = document.createElement('div');
    card.className = 'card';
    
    card.innerHTML = `
        <img src="${accessory.image_url || 'https://via.placeholder.com/300x200?text=Accesorio'}" 
             alt="${accessory.name}">
        <h3>${accessory.name}</h3>
        <p>${accessory.category || 'Sin categoria'}</p>
        <p class="price">$${accessory.price || 0}</p>
    `;
    
    // Click lleva a la pantalla de detalle del accesorio
    card.addEventListener('click', () => {
        // Guardamos el dogId en sessionStorage para usarlo despues
        sessionStorage.setItem('currentDogId', dogId);
        router.navigateTo(`/accessory/${accessory.id}`);
    });
    
    return card;
}