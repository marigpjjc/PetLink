import { getDogById, getNeedsByDogId } from '../../services/api.js';

// Obtener el ID del perro que guardamos en el home
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al home
if (!dogId) {
  window.location.href = '../home/home.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogImage = document.getElementById('dogImage');
const dogName = document.getElementById('dogName');
const dogLocation = document.getElementById('dogLocation');
const dogAge = document.getElementById('dogAge');
const dogWeight = document.getElementById('dogWeight');
const dogSize = document.getElementById('dogSize');
const dogDescription = document.getElementById('dogDescription');
const scheduleButton = document.getElementById('scheduleButton');
const needsList = document.getElementById('needsList');
const statsButton = document.getElementById('statsButton');
const accessoriesButton = document.getElementById('accessoriesButton');
const galleryButton = document.getElementById('galleryButton');

// Cargar la informacion del perro
async function loadDogProfile() {
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = '../home/home.html';
    return;
  }
  
  // Mostrar la informacion del perro
  dogImage.src = dog.image || 'https://via.placeholder.com/300';
  dogName.textContent = dog.name;
  dogLocation.textContent = `Ubicacion: ${dog.location || 'No especificada'}`;
  dogAge.textContent = `Edad: ${dog.age} anos`;
  dogWeight.textContent = `Peso: ${dog.weight} kg`;
  dogSize.textContent = `Tamano: ${dog.size}`;
  dogDescription.textContent = dog.description;
  
  // Mostrar u ocultar boton de agendar cita segun disponibilidad
  if (dog.availability) {
    scheduleButton.style.display = 'block';
  } else {
    scheduleButton.style.display = 'none';
  }
  
  // Cargar las necesidades
  loadNeeds();
}

// Cargar las necesidades del perro
async function loadNeeds() {
  const needs = await getNeedsByDogId(dogId);
  
  needsList.innerHTML = '';
  
  if (needs.length === 0) {
    needsList.innerHTML = '<p>Este perrito no tiene necesidades registradas</p>';
    return;
  }
  
  needs.forEach(need => {
    const needCard = document.createElement('div');
    needCard.className = 'need-card';
    
    needCard.innerHTML = `
      <img src="${need.image || 'https://via.placeholder.com/100'}" alt="${need.name}">
      <h3>${need.name}</h3>
      <p>${need.description}</p>
      <p>Precio: $${need.price}</p>
    `;
    
    // Al hacer click ir a la pantalla de donacion
    needCard.addEventListener('click', () => {
      localStorage.setItem('selectedNeedId', need.id);
      window.location.href = 'donation.html';
    });
    
    needsList.appendChild(needCard);
  });
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = '../home/home.html';
});

// Boton de agendar cita
scheduleButton.addEventListener('click', () => {
  window.location.href = 'appointment.html';
});

// Boton de estadisticas
statsButton.addEventListener('click', () => {
  window.location.href = 'dog-stadistics.html';
});

// Boton de accesorios
accessoriesButton.addEventListener('click', () => {
  window.location.href = '../accessories/accessories.html';
});

// Boton de galeria
galleryButton.addEventListener('click', () => {
  window.location.href = '../gallery/ia-image.html';
});

// Cargar el perfil cuando se abre la pagina
loadDogProfile();