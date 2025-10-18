// padrino-app/screens/accessories/accessory-payment.js
import { getAccessoryById, getDogById, generateDogWithAccessory } from '../../services/api.js';

// Obtener el ID del accesorio
const accessoryId = localStorage.getItem('selectedAccessoryId');
const dogId = localStorage.getItem('selectedDogId');

// Si no hay ID, volver a accesorios
if (!accessoryId || !dogId) {
  window.location.href = 'accessories.html';
}

// Elementos del DOM
const backButton = document.getElementById('backButton');
const productName = document.getElementById('productName');
const productPrice = document.getElementById('productPrice');
const cardNumber = document.getElementById('cardNumber');
const cardName = document.getElementById('cardName');
const cardExpiry = document.getElementById('cardExpiry');
const cardCVV = document.getElementById('cardCVV');
const payButton = document.getElementById('payButton');

let currentAccessory = null;
let currentDog = null;

// Cargar la informacion del producto
async function loadProductInfo() {
  currentAccessory = await getAccessoryById(accessoryId);
  currentDog = await getDogById(dogId);
  
  if (!currentAccessory) {
    alert('No se encontro el accesorio');
    window.location.href = 'accessories.html';
    return;
  }
  
  productName.textContent = `Producto: ${currentAccessory.name}`;
  productPrice.textContent = `Total a pagar: $${currentAccessory.price}`;
}

// Boton de volver
backButton.addEventListener('click', () => {
  window.location.href = 'accessory-detail.html';
});

// Boton de pagar
payButton.addEventListener('click', async () => {
  // Validar campos
  if (!cardNumber.value || !cardName.value || !cardExpiry.value || !cardCVV.value) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  // Mostrar mensaje de carga
  payButton.textContent = 'Procesando...';
  payButton.disabled = true;
  
  // Generar imagen con Stability AI
  const dogData = {
    name: currentDog.name,
    breed: currentDog.size, // Usamos size como breed
    age: currentDog.age,
    size: currentDog.size
  };
  
  const accessoryData = {
    category: currentAccessory.category,
    description: currentAccessory.description || currentAccessory.name
  };
  
  console.log('Generando imagen con IA...');
  const imageResult = await generateDogWithAccessory(dogData, accessoryData);
  
  if (imageResult && imageResult.success) {
    console.log('Imagen generada exitosamente!');
    
    // Guardar la imagen en localStorage
    const iaImages = JSON.parse(localStorage.getItem('iaImages') || '[]');
    
    iaImages.push({
      dogId: dogId,
      dogName: currentDog.name,
      accessoryName: currentAccessory.name,
      imageUrl: imageResult.imageUrl,
      date: new Date().toISOString()
    });
    
    localStorage.setItem('iaImages', JSON.stringify(iaImages));
    
    alert('Pago realizado con exito! Imagen generada con IA');
  } else {
    alert('Pago realizado, pero hubo un error al generar la imagen: ' + (imageResult?.error || 'Error desconocido'));
  }
  
  // Ir a la galeria
  window.location.href = '../gallery/ia-image.html';
});

// Inicializar
loadProductInfo();