// Este es el CEREBRO de la aplicacion (conecta todo)

import router from './utils/router.js';
import { renderHome } from './screens/home.js';
import { renderDogProfile } from './screens/dog-profile.js';
import { renderNeedDetail } from './screens/need-detail.js';
import { renderPayment } from './screens/payment.js';
import { renderScheduleAppointment } from './screens/schedule-appointment.js';
import { renderDogStatistics } from './screens/dog-stats.js'; 

// Configurar las rutas
function setupRoutes() {
  // Ruta del HOME
  router.addRoute('/', renderHome);
  
  // Ruta del perfil del perro
  router.addRoute('/dog/:id', (params) => {
    const dogId = params.id;
    renderDogProfile(dogId);
  });
  
  // Ruta del detalle de necesidad
  router.addRoute('/need/:id', (params) => {
    const needId = params.id;
    renderNeedDetail(needId);
  });
  
  // Ruta de pago
  router.addRoute('/payment', renderPayment);
  
  // Ruta de agendar cita
  router.addRoute('/dog/:id/schedule', (params) => {
    const dogId = params.id;
    renderScheduleAppointment(dogId);
  });
  
  // Ruta de estadísticas (ESTA ES NUEVA)
  router.addRoute('/dog/:id/statistics', (params) => {
    const dogId = params.id;
    renderDogStatistics(dogId);
  });
}

// Iniciar la aplicacion
function initApp() {
  console.log('Iniciando aplicacion...');
  
  // Configurar las rutas
  setupRoutes();
  
  // Iniciar el router
  router.init();
  
  console.log('Aplicacion iniciada!');
}

// Cuando el HTML este listo, iniciar la app
document.addEventListener('DOMContentLoaded', initApp);