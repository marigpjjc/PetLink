// Pantalla de login para administradores
// Maneja la autenticación y redirección

import { navigateTo, makeRequest } from '../app.js';

// Renderizar la pantalla de login
export default function renderAdminLogin() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="login-container">
      <div class="login-form">
        <h1>Iniciar Sesión - Admin</h1>
        
        <form id="loginForm">
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
            <label for="password">Contraseña:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              required 
              placeholder="Ingresa tu contraseña"
            />
          </div>
          
          <div class="form-actions">
            <button type="submit" id="loginBtn">Iniciar Sesión</button>
            <button type="button" id="signupBtn">Crear Cuenta</button>
          </div>
        </form>
        
        <div id="errorMessage" class="error-message" style="display: none;"></div>
      </div>
    </div>
  `;
  
  setupEventListeners();
}

function setupEventListeners() {
  const loginForm = document.getElementById('loginForm');
  const signupBtn = document.getElementById('signupBtn');
  
  // Envío del formulario de login
  loginForm.addEventListener('submit', handleLogin);
  
  // Click en botón de crear cuenta
  signupBtn.addEventListener('click', handleSignup);
}

// Manejar el proceso de login
async function handleLogin(event) {
  event.preventDefault();
  
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const errorMessage = document.getElementById('errorMessage');
  
  // Validar campos
  if (!username || !password) {
    showError('Por favor completa todos los campos');
    return;
  }
  
  // Deshabilitar botón y mostrar estado de carga
  loginBtn.disabled = true;
  loginBtn.textContent = 'Iniciando sesión...';
  hideError();
  
  try {
    // Realizar petición al backend
    const response = await makeRequest('/api/auth/login', 'POST', {
      username: username,
      password: password 
    });
    
    // Verificar si el login fue exitoso
    if (response.success && response.token) {

      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.user));
      
      console.log('Login exitoso:', response.user);
      
      // Redirigir al dashboard
      navigateTo('/dashboard', { user: response.user });
      
    } else {
      // Mostrar error del servidor
      const errorMsg = response.error || 'Error al iniciar sesión';
      showError(errorMsg);
    }
    
  } catch (error) {
    console.error('Error en login:', error);
    showError('Error de conexión. Verifica que el servidor esté funcionando.');
  } finally {
    // Restaurar botón
    loginBtn.disabled = false;
    loginBtn.textContent = 'Iniciar Sesión';
  }
}

// Redirección a registro
function handleSignup() {
  navigateTo('/admin-signup', {});
}

function showError(message) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

function hideError() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';
}

// Verificar si hay una sesión activa
export function checkAuth() {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      return { isAuthenticated: true, user: userData, token: token };
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return { isAuthenticated: false };
    }
  }
  
  return { isAuthenticated: false };
}

// Función para cerrar sesión
export function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  navigateTo('/admin-login', {});
}