// Pantalla: admin-padrino (selección de rol)
// Maneja las redirecciones a módulos Padrino y Administrador

(function initAdminPadrino() {
    // Referencias a botones
    const padrinoBtn = document.getElementById('padrinoBtn');
    const adminBtn = document.getElementById('adminBtn');
  
    // Redirigir al login-signup del módulo padrino
    padrinoBtn.addEventListener('click', () => {
      window.location.href = '../../../padrino-app/screens/dog-profile/login-signup.html';
    });
  
    // Redirigir al módulo administrador
    adminBtn.addEventListener('click', () => {
      window.location.href = '../../../admin-app/index.html';
    });
  })();