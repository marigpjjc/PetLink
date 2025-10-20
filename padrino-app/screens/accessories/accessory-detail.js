import { getAccessoryById } from '../../services/api.js';

// Obtener el ID del accesorio
const accessoryId = localStorage.getItem('selectedAccessoryId');

// Si no hay ID, volver a accesorios
if (!accessoryId) {
  window.location.href = 'accessories.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const accessoryImage = document.getElementById('accessoryImage');
const accessoryName = document.getElementById('accessoryName');
const accessoryDescription = document.getElementById('accessoryDescription');
const accessoryPrice = document.getElementById('accessoryPrice');
const buyButton = document.getElementById('buyButton');

// Cargar el detalle del accesorio
async function loadAccessoryDetail() {
  const accessory = await getAccessoryById(accessoryId);
  
  if (!accessory) {
    alert('No se encontro el accesorio');
    window.location.href = 'accessories.html';
    return;
  }
  
  // Mostrar la informacion
  accessoryImage.src = accessory.image || 'https://via.placeholder.com/300';
  accessoryName.textContent = accessory.name;
  accessoryDescription.textContent = accessory.description || 'Sin descripcion';
  accessoryPrice.textContent = `Precio: $${accessory.price}`;
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = 'accessories.html';
});

// Boton de comprar
buyButton.addEventListener('click', () => {
  // Ir a la pantalla de pago
  window.location.href = 'accessory-payment.html';
});

// Inicializar
loadAccessoryDetail();