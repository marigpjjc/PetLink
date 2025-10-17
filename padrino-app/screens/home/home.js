
import { getAllDogs, searchDogsByName } from '../../services/api.js';

// Donde se van a mostrar los perros
const dogsList = document.getElementById('dogsList');
const searchInput = document.getElementById('searchInput');

// Mostrar todos los perros cuando carga la pagina
async function loadDogs() {
  const dogs = await getAllDogs();
  displayDogs(dogs);
}

// Mostrar los perros en pantalla
function displayDogs(dogs) {
  // Limpiar la lista
  dogsList.innerHTML = '';
  
  // Si no hay perros
  if (dogs.length === 0) {
    dogsList.innerHTML = '<p>No hay perros disponibles</p>';
    return;
  }
  
  // Crear una card por cada perro
  dogs.forEach(dog => {
    const dogCard = document.createElement('div');
    dogCard.className = 'dog-card';
    
    dogCard.innerHTML = `
      <img src="${dog.image || 'https://via.placeholder.com/150'}" alt="${dog.name}">
      <h3>${dog.name}</h3>
    `;
    
    // Cuando le dan click, ir al perfil del perro
    dogCard.addEventListener('click', () => {
      // Guardar el ID del perro para usarlo en la otra pagina
      localStorage.setItem('selectedDogId', dog.id);
      // Ir a la pagina del perfil
      window.location.href = '../dog-profile/dog-profile.html';
    });
    
    dogsList.appendChild(dogCard);
  });
}

// Buscar perros cuando escriben en el input
searchInput.addEventListener('input', async (e) => {
  const searchTerm = e.target.value.trim();
  
  // Si esta vacio, mostrar todos
  if (searchTerm === '') {
    loadDogs();
    return;
  }
  
  // Si no, buscar por nombre
  const dogs = await searchDogsByName(searchTerm);
  displayDogs(dogs);
});

// Cargar los perros cuando se abre la pagina
loadDogs();