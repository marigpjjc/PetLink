// Este es el CEREBRO de la aplicación admin-app
// Conecta todas las pantallas y servicios

import router from './utils/router.js';
import { initWebSocket } from './services/websocket-admin.js';

// Importar todas las pantallas
import renderAdminLoginSignup from "./screens/admin-login-signup.js";
import renderAdminLogin from "./screens/admin-login.js";
import renderAdminSignup from "./screens/admin-signup.js";
import renderDashboard from "./screens/dashboard.js";
import renderProductsManage from "./screens/products-manage.js";
import renderAddDog from "./screens/add-dog.js";
import renderAppointmentsManage from "./screens/appointments-manage.js";
import renderDonationsView from "./screens/donations-view.js";
import renderDonationsProfileDog from "./screens/donations-profile-dog.js";
import renderDogEstadistics from "./screens/dog-estadistics.js";
import renderDogManagement from "./screens/dog-management.js";
import renderDogProfile from "./screens/dog-profile.js";

/**
 * Configurar todas las rutas de la aplicación
 */
function setupRoutes() {
  // Rutas de autenticación
  router.addRoute('/admin-login-signup', renderAdminLoginSignup);
  router.addRoute('/admin-login', renderAdminLogin);
  router.addRoute('/admin-signup', renderAdminSignup);
  
  // Ruta principal - Dashboard
  router.addRoute('/dashboard', renderDashboard);
  
  // Rutas de gestión
  router.addRoute('/dog-management', renderDogManagement);
  router.addRoute('/products-manage', renderProductsManage);
  router.addRoute('/add-pet', renderAddDog);
  
  // Rutas de visualización
  router.addRoute('/appointments', renderAppointmentsManage);
  router.addRoute('/donations', renderDonationsView);
  
  // Rutas con parámetros
  router.addRoute('/donations-profile-dog', renderDonationsProfileDog);
  router.addRoute('/dog-estadistics', renderDogEstadistics);
  router.addRoute('/dog-profile', renderDogProfile);
  
  // Ruta por defecto (redirigir a login si no hay sesión)
  router.addRoute('/', () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      router.navigateTo('/dashboard', {});
    } else {
      router.navigateTo('/admin-login', {});
    }
  });
}

/**
 * Configurar listeners de eventos en tiempo real
 */
function setupRealtimeListeners() {
  // Importar funciones del servicio de websockets
  import('./services/websocket-admin.js').then(module => {
    const { addEventListener } = module;
    
    // Listener para nuevas donaciones
    addEventListener('donation-created', (data) => {
      console.log('🎉 Nueva donación recibida en tiempo real:', data);
      
      // Mostrar notificación visual
      showNotification('Nueva donación recibida', 'success');
      
      // Si estamos en la pantalla de donaciones, recargar datos
      if (router.getCurrentRoute()?.includes('/donations')) {
        // Aquí se puede implementar lógica para recargar datos
        console.log('Actualizar vista de donaciones');
      }
    });
    
    // Listener para nuevas citas
    addEventListener('appointment-created', (data) => {
      console.log('📅 Nueva cita creada en tiempo real:', data);
      
      // Mostrar notificación visual
      showNotification('Nueva cita registrada', 'info');
      
      // Si estamos en la pantalla de citas, recargar datos
      if (router.getCurrentRoute() === '/appointments') {
        console.log('Actualizar vista de citas');
      }
    });
    
    // Listener para necesidades urgentes
    addEventListener('urgent-need-alert', (data) => {
      console.log('🚨 ALERTA: Necesidad urgente:', data);
      
      // Mostrar notificación de alerta
      showNotification('¡NECESIDAD URGENTE! - ' + (data.need?.name || 'Ver detalles'), 'warning');
    });
    
    // Listener para nuevas compras
    addEventListener('purchase-notification', (data) => {
      console.log('🛍️ Nueva compra de accesorio:', data);
      
      // Mostrar notificación
      showNotification('Nueva compra de accesorio', 'success');
    });
  });
}

/**
 * Mostrar notificación visual
 */
function showNotification(message, type = 'info') {
  // Crear elemento de notificación
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Estilos inline para asegurar visibilidad
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background-color: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
    color: white;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Agregar al DOM
  document.body.appendChild(notification);
  
  // Remover después de 5 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}

/**
 * Iniciar la aplicación
 */
function initApp() {
  console.log('🚀 Iniciando aplicación admin-app...');
  
  // Configurar las rutas
  setupRoutes();
  
  // Iniciar el router
  router.init();
  
  // Inicializar WebSocket para comunicación en tiempo real
  initWebSocket();
  
  // Configurar listeners de eventos en tiempo real
  setupRealtimeListeners();
  
  console.log('✅ Aplicación admin-app iniciada correctamente');
}

// Cuando el HTML esté listo, iniciar la app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Exportar router para uso en otras partes de la app
export { router };
