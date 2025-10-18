// padrino-app/screens/accessories/accessories.js
import { getDogById, getAllAccessories } from '../../services/api.js';

// Obtener el ID del perro
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al home
if (!dogId) {
  window.location.href = '../home/home.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogName = document.getElementById('dogName');
const accessoriesList = document.getElementById('accessoriesList');

// Cargar el nombre del perro
async function loadDogName() {
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = '../home/home.html';
    return;
  }
  
  dogName.textContent = dog.name;
}

// Cargar los accesorios
async function loadAccessories() {
  const accessories = await getAllAccessories();
  
  accessoriesList.innerHTML = '';
  
  if (accessories.length === 0) {
    accessoriesList.innerHTML = '<p>No hay accesorios disponibles</p>';
    return;
  }
  
  accessories.forEach(accessory => {
    const accessoryCard = document.createElement('div');
    accessoryCard.className = 'accessory-card';
    
    accessoryCard.innerHTML = `
      <img src="${accessory.image || 'https://via.placeholder.com/150'}" alt="${accessory.name}">
      <h3>${accessory.name}</h3>
      <p>Precio: $${accessory.price}</p>
    `;
    
    // Al hacer click ir a la pantalla de detalle del accesorio
    accessoryCard.addEventListener('click', () => {
      localStorage.setItem('selectedAccessoryId', accessory.id);
      window.location.href = 'accessory-detail.html';
    });
    
    accessoriesList.appendChild(accessoryCard);
  });
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = '../dog-profile/dog-profile.html';
});

// Inicializar
loadDogName();
loadAccessories();