/**
 * MÓDULO DE AUTENTICACIÓN
 * Maneja login, logout y verificación de sesión
 * Completamente independiente
 */

class AuthModule {
  constructor() {
    this.sessionKey = 'admin_session';
    this.timestampKey = 'admin_timestamp';
    this.sessionDuration = 30 * 60 * 1000; // 30 minutos
    this.isLoggedIn = false;
  }

  init() {
    console.log('🔐 Módulo de Autenticación iniciado');
    this.checkSession();
    this.bindEvents();
  }

  bindEvents() {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
      loginForm.addEventListener('submit', e => this.handleLogin(e));
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }
  }

  checkSession() {
    const session = localStorage.getItem(this.sessionKey);
    const timestamp = localStorage.getItem(this.timestampKey);

    if (session && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);

      if (elapsed < this.sessionDuration) {
        this.isLoggedIn = true;
        this.showAdminPanel();
        // Renovar timestamp
        localStorage.setItem(this.timestampKey, Date.now().toString());
        return true;
      }
    }

    this.isLoggedIn = false;
    this.showLoginScreen();
    return false;
  }

  handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('admin-username')?.value;
    const password = document.getElementById('admin-password')?.value;

    // Credenciales
    const validUsername = 'admin';
    const validPassword = 'stewart2024';

    if (username === validUsername && password === validPassword) {
      localStorage.setItem(this.sessionKey, 'active');
      localStorage.setItem(this.timestampKey, Date.now().toString());
      this.isLoggedIn = true;
      this.showAdminPanel();
      this.showMessage('Inicio de sesión exitoso', 'success');
    } else {
      this.showMessage('Usuario o contraseña incorrectos', 'error');
    }
  }

  handleLogout() {
    if (confirm('¿Cerrar sesión?')) {
      localStorage.removeItem(this.sessionKey);
      localStorage.removeItem(this.timestampKey);
      this.isLoggedIn = false;
      this.showLoginScreen();
      this.showMessage('Sesión cerrada', 'info');
    }
  }

  showLoginScreen() {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');

    if (loginScreen) loginScreen.classList.remove('hidden');
    if (adminPanel) adminPanel.classList.add('hidden');
  }

  showAdminPanel() {
    const loginScreen = document.getElementById('login-screen');
    const adminPanel = document.getElementById('admin-panel');

    if (loginScreen) loginScreen.classList.add('hidden');
    if (adminPanel) adminPanel.classList.remove('hidden');
  }

  showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message admin-message-${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    const colors = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      info: 'background: #3b82f6; color: white;',
    };

    messageDiv.style.cssText += colors[type] || colors.info;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
  }
}

// Exportar instancia global
window.AuthModule = new AuthModule();
