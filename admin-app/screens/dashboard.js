// Pantalla del dashboard del administrador muestra los botones del dashboard (donaciones,catalogo, citas, agregar mascota)

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth, logout } from './admin-login.js';

// Función para renderizar el dashboard
export default async function renderDashboard(data) {
  // Verificar autenticación
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    navigateTo('/admin-login', {});
    return;
  }
  
  const user = auth.user || data.user;
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Panel de Administración</h1>
        <div class="user-info">
          <span>Bienvenido, ${user.name || user.username}</span>
          <button id="logoutBtn" class="logout-btn">Cerrar Sesión</button>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h2>Gestión de Perros</h2>
            <p>Administra los perros registrados en el sistema</p>
            <button id="dogsBtn" class="action-btn">Ver Perros</button>
          </div>
          
          <div class="dashboard-card">
            <h2>Citas</h2>
            <p>Gestiona las citas y citas médicas</p>
            <button id="appointmentsBtn" class="action-btn">Ver Citas</button>
          </div>
          
          <div class="dashboard-card">
            <h2>Donaciones</h2>
            <p>Administra las donaciones recibidas</p>
            <button id="donationsBtn" class="action-btn">Ver Donaciones</button>
          </div>
          
          <div class="dashboard-card">
            <h2>Productos</h2>
            <p>Gestiona el catálogo de productos</p>
            <button id="productsBtn" class="action-btn">Ver Productos</button>
          </div>
          
          <div class="dashboard-card">
            <h2>Usuarios</h2>
            <p>Administra los usuarios del sistema</p>
            <button id="usersBtn" class="action-btn">Ver Usuarios</button>
          </div>
          
          <div class="dashboard-card">
            <h2>Estadísticas</h2>
            <p>Visualiza estadísticas del sistema</p>
            <button id="statsBtn" class="action-btn">Ver Estadísticas</button>
          </div>
        </div>
      </main>
    </div>
  `;
  
  setupEventListeners();
}

function setupEventListeners() {
  const logoutBtn = document.getElementById('logoutBtn');
  const dogsBtn = document.getElementById('dogsBtn');
  const appointmentsBtn = document.getElementById('appointmentsBtn');
  const donationsBtn = document.getElementById('donationsBtn');
  const productsBtn = document.getElementById('productsBtn');
  const usersBtn = document.getElementById('usersBtn');
  const statsBtn = document.getElementById('statsBtn');
  
  // El logout
  logoutBtn.addEventListener('click', handleLogout);
  
  // La navegación a diferentes secciones
  dogsBtn.addEventListener('click', () => navigateTo('/dogs', {}));
  appointmentsBtn.addEventListener('click', () => navigateTo('/appointments', {}));
  donationsBtn.addEventListener('click', () => navigateTo('/donations', {}));
  productsBtn.addEventListener('click', () => navigateTo('/products', {}));
  usersBtn.addEventListener('click', () => navigateTo('/users', {}));
  statsBtn.addEventListener('click', () => navigateTo('/stats', {}));
}

// Cierre de sesión
async function handleLogout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    await logout();
  }
}
