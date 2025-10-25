// Pantalla que muestra el detalle de un accesorio

import { apiService } from '../services/api.js';
import { router } from '../utils/router.js';

export async function renderAccessoryDetail(accessoryId) {
    const app = document.getElementById('app');
    
    // Mostrar mensaje de carga
    app.innerHTML = '<div class="loading">Cargando...</div>';
    
    // Traer el accesorio
    const accessory = await apiService.getAccessoryById(accessoryId);
    
    if (!accessory) {
        app.innerHTML = '<div class="card"><h2>Accesorio no encontrado</h2></div>';
        return;
    }
    
    // Crear el HTML
    app.innerHTML = `
        <button class="back-btn" onclick="history.back()">Volver</button>
        
        <div class="product-detail">
            <img src="${accessory.image_url || 'https://via.placeholder.com/400x300?text=Accesorio'}" 
                 alt="${accessory.name}">
            
            <h1>${accessory.name}</h1>
            <p>${accessory.description || 'Sin descripcion'}</p>
            <p><strong>Categoria:</strong> ${accessory.category || 'Sin categoria'}</p>
            <p class="price">$${accessory.price || 0}</p>
            
            <button class="btn-primary" onclick="goToPayment('accessory', ${accessoryId}, ${accessory.price})">
                Comprar
            </button>
        </div>
    `;
}