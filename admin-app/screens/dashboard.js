// Dashboard del administrador, tras iniciar sesión muestra (citas, donaciones, agergar mascotas y editar catalogo)

import { navigateTo, makeRequest } from '../app.js';
import { checkAuth, logout } from './admin-login.js';

export default async function renderDashboard(data) {
  const auth = await checkAuth();
  if (!auth.isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo al login');
    navigateTo('/admin-login', {});
    return;
  }
  
  if (!verifySession()) {
    console.log('Sesión inválida, redirigiendo al login');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigateTo('/admin-login', {});
    return;
  }
  
  const user = auth.user || data.user;
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="loading-container">
      <h2>Cargando dashboard...</h2>
      <p>Obteniendo información del sistema</p>
    </div>
  `;
  
  let dashboardData;
  try {
    dashboardData = await loadDashboardData();
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error);
    dashboardData = { petsCount: 0, donationsCount: 0, appointmentsCount: 0, productsCount: 0 };
  }
  
  app.innerHTML = `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Panel de Administración PetLink</h1>
          <div class="user-info">
            <span class="welcome-text">Bienvenido, ${user.name || user.username}</span>
            <span class="foundation-text">${user.foundation_name || 'Fundación'}</span>
            <button id="logoutBtn" class="logout-btn">Cerrar Sesión</button>
          </div>
        </div>
      </header>
      
      <main class="dashboard-content">
        <div class="dashboard-stats">
          <div class="stat-card">
            <h3>Mascotas Registradas</h3>
            <span class="stat-number">${dashboardData.petsCount || 0}</span>
          </div>
          <div class="stat-card">
            <h3>Donaciones Recibidas</h3>
            <span class="stat-number">${dashboardData.donationsCount || 0}</span>
          </div>
          <div class="stat-card">
            <h3>Citas Pendientes</h3>
            <span class="stat-number">${dashboardData.appointmentsCount || 0}</span>
          </div>
          <div class="stat-card">
            <h3>Productos en Catálogo</h3>
            <span class="stat-number">${dashboardData.productsCount || 0}</span>
          </div>
        </div>
        
        <div class="dashboard-menu">
          <h2>Menú Principal</h2>
          <div class="menu-grid">
            <div class="menu-card">
              <h3>Editar Catálogo</h3>
              <p>Gestiona los productos y servicios disponibles</p>
              <button id="editCatalogBtn" class="menu-btn">Editar Catálogo</button>
            </div>
            
            <div class="menu-card">
              <h3>Agregar Mascota</h3>
              <p>Registra nuevas mascotas en el sistema</p>
              <button id="addPetBtn" class="menu-btn">Agregar Mascota</button>
            </div>
            
            <div class="menu-card">
              <h3>Donaciones</h3>
              <p>Administra las donaciones recibidas</p>
              <button id="donationsBtn" class="menu-btn">Ver Donaciones</button>
            </div>
            
            <div class="menu-card">
              <h3>Solicitudes de Citas</h3>
              <p>Gestiona las citas y solicitudes</p>
              <button id="appointmentsBtn" class="menu-btn">Ver Citas</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
  
  setupEventListeners();
  
  // Actualización automática de datos cada 30 segundos
  setupAutoRefresh();
}

function setupAutoRefresh() {
  setInterval(async () => {
    try {
      await refreshDashboardData();
    } catch (error) {
      console.error('Error al actualizar datos del dashboard:', error);
    }
  }, 30000);
}

function setupEventListeners() {
  const logoutBtn = document.getElementById('logoutBtn');
  const editCatalogBtn = document.getElementById('editCatalogBtn');
  const addPetBtn = document.getElementById('addPetBtn');
  const donationsBtn = document.getElementById('donationsBtn');
  const appointmentsBtn = document.getElementById('appointmentsBtn');
  
  // Cerrar sesión
  logoutBtn.addEventListener('click', handleLogout);
  
  // Navegación a otras pantallas
  editCatalogBtn.addEventListener('click', () => navigateTo('/dog-management', {}));
  addPetBtn.addEventListener('click', () => navigateTo('/add-pet', {}));
  donationsBtn.addEventListener('click', () => navigateTo('/donations', {}));
  appointmentsBtn.addEventListener('click', () => navigateTo('/appointments', {}));
}

// Cargar datos
async function loadDashboardData() {
  try {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      return { petsCount: 0, donationsCount: 0, appointmentsCount: 0, productsCount: 0 };
    }

    // Obtener datos
    const [petsData, donationsData, appointmentsData, productsData] = await Promise.allSettled([
      makeRequest('/api/dogs', 'GET'),
      makeRequest('/api/donations', 'GET'),
      makeRequest('/api/appointments', 'GET'),
      makeRequest('/api/products', 'GET')
    ]);

    return {
      petsCount: petsData.status === 'fulfilled' ? (petsData.value.length || 0) : 0,
      donationsCount: donationsData.status === 'fulfilled' ? (donationsData.value.length || 0) : 0,
      appointmentsCount: appointmentsData.status === 'fulfilled' ? (appointmentsData.value.length || 0) : 0,
      productsCount: productsData.status === 'fulfilled' ? (productsData.value.length || 0) : 0
    };

  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error);
    return { petsCount: 0, donationsCount: 0, appointmentsCount: 0, productsCount: 0 };
  }
}

// Verificar sesión activa
function verifySession() {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (!token || !user) {
    return false;
  }
  
  try {
    const userData = JSON.parse(user);
    return userData.rol === 'admin';
  } catch (error) {
    console.error('Error al verificar sesión:', error);
    return false;
  }
}

// Cierre de sesión
async function handleLogout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigateTo('/admin-login', {});
    }
  }
}

// Refrescar datos
export async function refreshDashboardData() {
  const dashboardData = await loadDashboardData();
  
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length >= 4) {
    statNumbers[0].textContent = dashboardData.petsCount || 0;
    statNumbers[1].textContent = dashboardData.donationsCount || 0;
    statNumbers[2].textContent = dashboardData.appointmentsCount || 0;
    statNumbers[3].textContent = dashboardData.productsCount || 0;
  }
}
