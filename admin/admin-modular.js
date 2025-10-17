/**
 * ADMIN PRINCIPAL - SISTEMA MODULAR
 * Inicializa todos los módulos independientes
 * Cada módulo es responsable de su propia funcionalidad
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando sistema modular de administración...');

  // Verificar que XLSX esté disponible
  if (typeof XLSX === 'undefined') {
    console.error('❌ Librería XLSX no cargada');
    alert('Error: Librería XLSX no disponible. Recarga la página.');
    return;
  }

  // Inicializar módulos en orden
  try {
    // 1. Autenticación (debe ser primero)
    if (window.AuthModule) {
      window.AuthModule.init();
    } else {
      console.error('❌ Módulo de Autenticación no disponible');
    }

    // Verificar si está logueado antes de inicializar otros módulos
    if (window.AuthModule && window.AuthModule.isLoggedIn) {
      // 2. Ingresantes
      if (window.IngresantesModule) {
        window.IngresantesModule.init();
      } else {
        console.warn('⚠️ Módulo de Ingresantes no disponible');
      }

      // 3. Countdown
      if (window.CountdownModule) {
        window.CountdownModule.init();
      } else {
        console.warn('⚠️ Módulo de Countdown no disponible');
      }

      console.log('✅ Todos los módulos inicializados correctamente');
    }
  } catch (error) {
    console.error('❌ Error inicializando módulos:', error);
    alert('Error al inicializar el panel de administración. Revisa la consola.');
  }
});

// Agregar estilos para animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .admin-message {
    animation: slideIn 0.3s ease;
  }
`;
document.head.appendChild(style);
