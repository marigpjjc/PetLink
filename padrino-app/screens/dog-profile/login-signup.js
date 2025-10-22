// Pantalla login-signup (Padrino)
// Maneja las redirecciones a login.html y signup.html del módulo padrino

(function initPadrinoLoginSignup() {
  // Obtener referencias a los botones
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');

  // Función de navegación segura
  function safeNavigate(path) {
    try {
      if (!path || typeof path !== 'string') {
        throw new Error('Ruta inválida');
      }
      // Redirección consistente con el resto del proyecto
      window.location.href = path;
    } catch (err) {
      // Fallback: quedarse en la misma pantalla o mostrar alerta mínima
      console.error('Redirección fallida:', err);
      alert('No fue posible redirigir. Intenta de nuevo.');
    }
  }

  // Listeners de los botones
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      // Ruta local dentro del módulo padrino
      safeNavigate('./login.html');
    });
  }

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      // Ruta local dentro del módulo padrino
      safeNavigate('./signup.html');
    });
  }
})();
