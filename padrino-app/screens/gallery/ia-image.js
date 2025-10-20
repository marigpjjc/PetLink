import { getDogById } from '../../services/api.js';

// Obtener el ID del perro
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al home
if (!dogId) {
  window.location.href = '../home/home.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogMainImage = document.getElementById('dogMainImage');
const dogName = document.getElementById('dogName');
const dogLocation = document.getElementById('dogLocation');
const dogTags = document.getElementById('dogTags');
const iaImagesList = document.getElementById('iaImagesList');
const viewProfileButton = document.getElementById('viewProfileButton');

// Cargar la informacion del perro
async function loadDogInfo() {
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = '../home/home.html';
    return;
  }
  
  // Mostrar informacion del perro
  dogMainImage.src = dog.image || 'https://via.placeholder.com/300';
  dogName.textContent = dog.name;
  dogLocation.textContent = dog.location || 'Sin ubicacion';
  
  // Mostrar tags
  dogTags.innerHTML = `
    <span>${dog.age} Anos</span>
    <span>${dog.weight} kg</span>
    <span>${dog.size}</span>
    <span>${dog.availability ? 'Disponible' : 'No disponible'}</span>
  `;
}

// Cargar las imagenes de IA desde localStorage
function loadIAImages() {
  // Obtener todas las imagenes guardadas
  const allImages = JSON.parse(localStorage.getItem('iaImages') || '[]');
  
  // Filtrar solo las del perro actual
  const dogImages = allImages.filter(img => img.dogId === dogId);
  
  iaImagesList.innerHTML = '';
  
  if (dogImages.length === 0) {
    iaImagesList.innerHTML = '<p>Aun no hay imagenes generadas. Compra accesorios para generar imagenes!</p>';
    return;
  }
  
  dogImages.forEach(image => {
    const imageCard = document.createElement('div');
    imageCard.className = 'ia-image-card';
    
    imageCard.innerHTML = `
      <img src="${image.imageUrl}" alt="Imagen IA de ${image.dogName}">
      <p>Accesorio: ${image.accessoryName}</p>
      <p>Generada: ${new Date(image.date).toLocaleDateString()}</p>
    `;
    
    iaImagesList.appendChild(imageCard);
  });
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = '../dog-profile/dog-profile.html';
});

// Boton de ver perfil
viewProfileButton.addEventListener('click', () => {
  window.location.href = '../dog-profile/dog-profile.html';
});

// Inicializar
loadDogInfo();
loadIAImages();