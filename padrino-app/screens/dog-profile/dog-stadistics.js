// padrino-app/screens/dog-profile/dog-stadistics.js
import { getDogById } from '../../services/api.js';

// Obtener el ID del perro
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver al home
if (!dogId) {
  window.location.href = '../home/home.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const dogName = document.getElementById('dogName');
const foodBar = document.getElementById('foodBar');
const foodLevel = document.getElementById('foodLevel');
const healthBar = document.getElementById('healthBar');
const healthLevel = document.getElementById('healthLevel');
const wellbeingBar = document.getElementById('wellbeingBar');
const wellbeingLevel = document.getElementById('wellbeingLevel');
const affectionBar = document.getElementById('affectionBar');
const affectionLevel = document.getElementById('affectionLevel');

// Cargar las estadisticas del perro
async function loadStats() {
  const dog = await getDogById(dogId);
  
  if (!dog) {
    alert('No se encontro el perro');
    window.location.href = '../home/home.html';
    return;
  }
  
  // Mostrar el nombre
  dogName.textContent = dog.name;
  
  // Mostrar las estadisticas
  updateStatBar(foodBar, foodLevel, dog.food_level || 0, 'Comida');
  updateStatBar(healthBar, healthLevel, dog.health_level || 0, 'Salud');
  updateStatBar(wellbeingBar, wellbeingLevel, dog.wellbeing_lev || 0, 'Bienestar');
  updateStatBar(affectionBar, affectionLevel, dog.affection_leve || 0, 'Carino');
}

// Actualizar una barra de estadistica
function updateStatBar(barElement, textElement, value, statName) {
  // El valor debe estar entre 0 y 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Cambiar el ancho de la barra
  barElement.style.width = normalizedValue + '%';
  
  // Cambiar el color segun el nivel
  if (normalizedValue < 30) {
    barElement.style.backgroundColor = 'red';
  } else if (normalizedValue < 70) {
    barElement.style.backgroundColor = 'orange';
  } else {
    barElement.style.backgroundColor = 'green';
  }
  
  // Mostrar el numero
  textElement.textContent = `Nivel: ${normalizedValue}/100`;
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = 'dog-profile.html';
});

// Cargar las estadisticas cuando se abre la pagina
loadStats();