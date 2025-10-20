const errorMessage = document.getElementById('errorMessage');
const retryButton = document.getElementById('retryButton');

// Obtener el mensaje de error guardado
const errorText = localStorage.getItem('errorMessage') || 'Ocurrio un error inesperado';
const returnPage = localStorage.getItem('returnPage') || 'dog-profile.html';

// Mostrar el mensaje
errorMessage.textContent = errorText;

// Boton para volver e intentar de nuevo
retryButton.addEventListener('click', () => {
  // Limpiar el error
  localStorage.removeItem('errorMessage');
  localStorage.removeItem('returnPage');
  
  // Volver a la pagina anterior
  window.location.href = returnPage;
});