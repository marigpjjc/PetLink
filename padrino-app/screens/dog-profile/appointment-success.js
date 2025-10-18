// padrino-app/screens/dog-profile/appointment-success.js

const doneButton = document.getElementById('doneButton');

// Boton para volver al perfil del perro
doneButton.addEventListener('click', () => {
  window.location.href = 'dog-profile.html';
});