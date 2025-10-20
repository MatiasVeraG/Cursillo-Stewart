// REEMPLAZAR EN admin-final.js desde la línea 2888 hasta el final de la clase SimulacrosSystem

// ==================== SISTEMA DE SIMULACROS ====================
class SimulacrosSystem {
  constructor() {
    this.storageKey = 'simulacros_data';
    this.simulacros = [];
  }

  init() {
    this.loadSimulacros();
    this.renderSimulacrosList();
    this.loadTitles();
    this.bindTitleEvents();
  }

  bindTitleEvents() {
    const titleInput = document.getElementById('simulacros-section-title');
    const subtitleInput = document.getElementById('simulacros-section-subtitle');
    
    if (titleInput) {
      titleInput.addEventListener('input', () => this.saveTitles());
    }
    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => this.saveTitles());
    }
  }

  loadSimulacros() {
    try {
      const data = localStorage.getItem(this.storageKey);
      this.simulacros = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al cargar simulacros:', error);
      this.simulacros = [];
    }
  }

  saveSimulacros() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.simulacros));
      this.showNotification('✅ Simulacros guardados correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar simulacros:', error);
      this.showNotification('❌ Error al guardar simulacros. Verifica que los archivos estén en la carpeta documents/simulacros/', 'error');
    }
  }

  renderSimulacrosList() {
    const container = document.getElementById('simulacros-list');
    if (!container) return;

    if (this.simulacros.length === 0) {
      container.innerHTML = '<p class="empty-message">No hay simulacros disponibles.</p>';
      return;
    }

    container.innerHTML = `
      <div class="simulacros-grid">
        ${this.simulacros.map((item, index) => `
          <div class="simulacro-card">
            <div class="simulacro-icon">📄</div>
            <div class="simulacro-info">
              <h4>${item.nombre}</h4>
              <p class="simulacro-filename">${item.nombreArchivo}</p>
            </div>
            <div class="simulacro-actions">
              <button onclick="simulacrosSystem.deleteSimulacro(${index})" class="btn-delete" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async addSimulacro() {
    const nameInput = document.getElementById('simulacro-name');
    const fileInput = document.getElementById('simulacro-file');

    if (!nameInput.value.trim()) {
      this.showNotification('❌ Por favor ingresa un nombre', 'error');
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      this.showNotification('❌ Por favor selecciona al menos un archivo PDF', 'error');
      return;
    }

    const files = Array.from(fileInput.files);
    
    // Procesar cada archivo
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        this.showNotification(`❌ ${file.name} no es un archivo PDF válido`, 'error');
        continue;
      }

      const simulacro = {
        nombre: nameInput.value.trim(),
        nombreArchivo: file.name,
        rutaArchivo: `documents/simulacros/${file.name}`
      };

      this.simulacros.push(simulacro);

      // Descargar el PDF para que el usuario lo coloque manualmente
      this.downloadFile(file);
    }

    this.saveSimulacros();
    this.renderSimulacrosList();

    // Limpiar campos
    nameInput.value = '';
    fileInput.value = '';

    this.showNotification(`📁 Archivo(s) descargado(s). Por favor, colócalos en la carpeta documents/simulacros/ de tu hosting`, 'info');
  }

  downloadFile(file) {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  deleteSimulacro(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este simulacro?')) {
      const deleted = this.simulacros.splice(index, 1)[0];
      this.saveSimulacros();
      this.renderSimulacrosList();
      this.showNotification(`✅ Simulacro "${deleted.nombre}" eliminado. Recuerda eliminar manualmente el archivo ${deleted.nombreArchivo} de la carpeta documents/simulacros/ en tu hosting`, 'success');
    }
  }

  saveTitles() {
    const title = document.getElementById('simulacros-section-title')?.value || 'SIMULACROS';
    const subtitle = document.getElementById('simulacros-section-subtitle')?.value || 'Material de práctica';
    
    const titles = { title, subtitle };
    localStorage.setItem('simulacros_titles', JSON.stringify(titles));
  }

  loadTitles() {
    try {
      const data = localStorage.getItem('simulacros_titles');
      if (data) {
        const titles = JSON.parse(data);
        const titleInput = document.getElementById('simulacros-section-title');
        const subtitleInput = document.getElementById('simulacros-section-subtitle');
        
        if (titleInput) titleInput.value = titles.title || 'SIMULACROS';
        if (subtitleInput) subtitleInput.value = titles.subtitle || 'Material de práctica';
      }
    } catch (error) {
      console.error('Error al cargar títulos:', error);
    }
  }

  showNotification(message, type = 'info') {
    // Usar el sistema de notificaciones existente o crear uno simple
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      border-radius: 4px;
      z-index: 10000;
      max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}
