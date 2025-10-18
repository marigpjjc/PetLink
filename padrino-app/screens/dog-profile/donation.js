// padrino-app/screens/dog-profile/donation.js
import { getDogById } from '../../services/api.js';

// Obtener el ID de la necesidad
const needId = localStorage.getItem('selectedNeedId');
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al perfil
if (!needId || !dogId) {
  window.location.href = 'dog-profile.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogName = document.getElementById('dogName');
const needImage = document.getElementById('needImage');
const needName = document.getElementById('needName');
const needDescription = document.getElementById('needDescription');
const needPrice = document.getElementById('needPrice');
const donateButton = document.getElementById('donateButton');

let currentNeed = null;

// Cargar la informacion de la necesidad
async function loadNeedDetail() {
  // Obtener info del perro
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = 'dog-profile.html';
    return;
  }
  
  dogName.textContent = dog.name;
  
  // Obtener la necesidad desde la API
  try {
    const response = await fetch(`http://localhost:5050/api/needs/${needId}`);
    if (!response.ok) throw new Error('Error al traer la necesidad');
    currentNeed = await response.json();
    
    // Mostrar la informacion
    needImage.src = currentNeed.image || 'https://via.placeholder.com/300';
    needName.textContent = currentNeed.name;
    needDescription.textContent = currentNeed.description || 'Sin descripcion';
    needPrice.textContent = `Precio: $${currentNeed.price}`;
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo cargar la necesidad');
    window.location.href = 'dog-profile.html';
  }
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = 'dog-profile.html';
});

// Boton de donar
donateButton.addEventListener('click', () => {
  // Ir a la pantalla de pago
  window.location.href = 'after-donation.html';
});

// Inicializar
loadNeedDetail();