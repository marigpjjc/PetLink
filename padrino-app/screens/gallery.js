// Pantalla de galeria con imagenes generadas por IA

import { apiService } from '../services/api.js';
import { router } from '../utils/router.js';

export async function renderGallery(dogId) {
    const app = document.getElementById('app');
    
    // Mostrar mensaje de carga
    app.innerHTML = '<div class="loading">Cargando galeria...</div>';
    
    // Traer informacion del perro
    const dog = await apiService.getDogById(dogId);
    
    if (!dog) {
        app.innerHTML = '<div class="card"><h2>Perro no encontrado</h2></div>';
        return;
    }
    
    // Obtener accesorios comprados para este perro
    const purchasedAccessories = JSON.parse(sessionStorage.getItem('purchasedAccessories') || '[]');
    const dogAccessories = purchasedAccessories.filter(p => p.dogId === parseInt(dogId));
    
    // Crear el HTML
    app.innerHTML = `
        <button class="back-btn" onclick="router.navigateTo('/dog/${dogId}')">Volver</button>
        
        <div class="dog-profile">
            <h1>Galeria de ${dog.name}</h1>
            <p>Aqui puedes ver las imagenes generadas con los accesorios que has comprado</p>
            
            <div id="gallery-container" class="gallery-container">
                ${dogAccessories.length === 0 ? '<p>Aun no has comprado accesorios para este perrito. Compra algunos para ver las imagenes generadas!</p>' : ''}
            </div>
        </div>
    `;
    
    const container = document.getElementById('gallery-container');
    
    // Generar imagenes para cada accesorio comprado
    for (const purchase of dogAccessories) {
        // Traer informacion del accesorio
        const accessory = await apiService.getAccessoryById(purchase.accessoryId);
        
        if (accessory) {
            // Crear elemento de galeria
            const galleryItem = await createGalleryItem(dog, accessory);
            container.appendChild(galleryItem);
        }
    }
}

async function createGalleryItem(dog, accessory) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    
    // Mensaje temporal mientras se genera la imagen
    item.innerHTML = `
        <div class="loading">Generando imagen con IA...</div>
        <h3>${dog.name} con ${accessory.name}</h3>
    `;
    
    // Intentar generar imagen con IA
    try {
        const result = await apiService.generateDogWithAccessory(
            {
                name: dog.name,
                breed: dog.breed,
                size: dog.size
            },
            {
                name: accessory.name,
                category: accessory.category,
                description: accessory.description
            }
        );
        
        if (result && result.image_url) {
            // Si la imagen se genero, mostrarla
            item.innerHTML = `
                <img src="${result.image_url}" alt="${dog.name} con ${accessory.name}">
                <h3>${dog.name} con ${accessory.name}</h3>
                <p>Generado con IA</p>
            `;
        } else {
            // Si no se pudo generar, usar placeholder
            item.innerHTML = `
                <img src="https://via.placeholder.com/300x300?text=${dog.name}+con+${accessory.name}" 
                     alt="${dog.name} con ${accessory.name}">
                <h3>${dog.name} con ${accessory.name}</h3>
                <p>Imagen simulada (IA no disponible)</p>
            `;
        }
    } catch (error) {
        console.error('Error generando imagen:', error);
        // Usar placeholder en caso de error
        item.innerHTML = `
            <img src="https://via.placeholder.com/300x300?text=${dog.name}+con+${accessory.name}" 
                 alt="${dog.name} con ${accessory.name}">
            <h3>${dog.name} con ${accessory.name}</h3>
            <p>Imagen simulada (IA no disponible)</p>
        `;
    }
    
    return item;
}