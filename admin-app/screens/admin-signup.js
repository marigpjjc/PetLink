// Pantalla de registro para administradores

import { navigateTo, makeRequest } from '../app.js';

// Función para renderizar la pantalla de registro
export default function renderAdminSignup() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="signup-container">
      <div class="signup-form">
        <h1>Crear Cuenta - Admin</h1>
        
        <form id="signupForm">
          <div class="form-group">
            <label for="name">Nombre completo:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required 
              placeholder="Ingresa tu nombre completo"
            />
          </div>
          
          <div class="form-group">
            <label for="username">Nombre de usuario:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              required 
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          
          <div class="form-group">
            <label for="email">Correo electrónico:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required 
              placeholder="Ingresa tu correo electrónico"
            />
          </div>
          
          <div class="form-group">
            <label for="phone">Teléfono:</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              placeholder="Ingresa tu número de teléfono"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" id="signupBtn">Crear Cuenta</button>
            <button type="button" id="loginBtn">Ya tengo cuenta</button>
          </div>
        </form>
        
        <div id="errorMessage" class="error-message" style="display: none;"></div>
        <div id="successMessage" class="success-message" style="display: none;"></div>
      </div>
    </div>
  `;
  
  setupEventListeners();
}

function setupEventListeners() {
  const signupForm = document.getElementById('signupForm');
  const loginBtn = document.getElementById('loginBtn');
  
  // El envío del formulario de registro
  signupForm.addEventListener('submit', handleSignup);
  
  // click botón de login
  loginBtn.addEventListener('click', handleLogin);
}

// Prooceso de registro
async function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const signupBtn = document.getElementById('signupBtn');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  
  // Validando campos obligatorios
  if (!name || !username || !email) {
    showError('Por favor completa los campos obligatorios: nombre, usuario y email');
    return;
  }
  
  // Deshabilitar botón y mostrar estado de carga
  signupBtn.disabled = true;
  signupBtn.textContent = 'Creando cuenta...';
  hideMessages();
  
  try {
    // Preparar datos para el registro
    const userData = {
      name: name,
      username: username,
      'e-mail': email,
      phone_number: phone || null,
      rol: 'admin' // Asignar rol de administrador
    };
    
    // Petición al backend
    const response = await makeRequest('/api/auth/register', 'POST', userData);
    
    if (response.success && response.token) {
      // Verificar que sea un administrador
      if (response.user.rol === 'admin') {
        localStorage.setItem('adminToken', response.token);
        localStorage.setItem('adminUser', JSON.stringify(response.user));
        
        console.log('Registro exitoso:', response.user);
        
        showSuccess('¡Cuenta creada exitosamente! Redirigiendo al dashboard...');
        
        // Redirigir al dashboard
        setTimeout(() => {
          navigateTo('/dashboard', { user: response.user });
        }, 2000);
      } else {
        showError('Error: No se pudo asignar el rol de administrador');
      }
      
    } else {
      // Mostrar error del servidor
      const errorMsg = response.error || 'Error al crear la cuenta';
      showError(errorMsg);
    }
    
  } catch (error) {
    console.error('Error en registro:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando.');
  } finally {
    // Restaurar botón
    signupBtn.disabled = false;
    signupBtn.textContent = 'Crear Cuenta';
  }
}

// Redirección a login
function handleLogin() {
  navigateTo('/admin-login', {});
}

function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function showSuccess(message) {
  const successMessage = document.getElementById('successMessage');
  successMessage.textContent = message;
  successMessage.style.display = 'block';
}

function hideMessages() {
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';
}
