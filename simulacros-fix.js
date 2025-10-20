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
      this.showNotification('❌ Error al guardar simulacros', 'error');
    }
  }

  renderSimulacrosList() {
    const container = document.getElementById('simulacros-list');
    if (!container) return;

    if (this.simulacros.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #cbd5e1; background: #1a2332; border-radius: 8px;">
          <p style="margin: 0;">📚 No hay simulacros agregados</p>
          <small>Haz clic en "Agregar Simulacro" para comenzar</small>
        </div>
      `;
      return;
    }

    // Crear grilla de 3 columnas
    container.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
        ${this.simulacros
          .map(
            (simulacro, index) => `
          <div class="simulacro-item" style="background: #1a2332; padding: 1rem; border-radius: 8px; border: 1px solid #2d3748; display: flex; flex-direction: column;">
            <div style="flex: 1; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <span style="font-size: 1.5rem;">📄</span>
                <h4 style="color: #fff; margin: 0; font-size: 1rem; flex: 1; word-break: break-word;">${simulacro.nombre}</h4>
              </div>
              <small style="color: #64748b; font-size: 0.75rem;">📎 ${simulacro.nombreArchivo}</small>
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: auto;">
              <button 
                onclick="simulacrosSystem.editSimulacro(${index})" 
                class="btn-action btn-edit" 
                style="flex: 1; padding: 0.5rem; background: #3b82f6; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 0.875rem;"
                title="Editar simulacro"
              >
                ✏️ Editar
              </button>
              <button 
                onclick="simulacrosSystem.deleteSimulacro(${index})" 
                class="btn-action btn-delete" 
                style="flex: 1; padding: 0.5rem; background: #dc2626; border: none; color: white; border-radius: 6px; cursor: pointer; font-size: 0.875rem;"
                title="Eliminar simulacro"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  addSimulacro() {
    // Crear input de archivo
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.multiple = true; // Permitir múltiples archivos
    
    input.onchange = async (e) => {
      const files = Array.from(e.target.files);
      if (!files || files.length === 0) return;

      // Validar que todos sean PDFs
      const invalidFiles = files.filter(file => !file.type.includes('pdf'));
      if (invalidFiles.length > 0) {
        this.showNotification('❌ Solo se permiten archivos PDF', 'error');
        return;
      }

      // Procesar cada archivo
      let processed = 0;
      files.forEach((file, index) => {
        const nombre = prompt(`Nombre del simulacro (${index + 1}/${files.length}):`, file.name.replace('.pdf', ''));
        if (!nombre) {
          processed++;
          if (processed === files.length) {
            this.saveSimulacros();
            this.renderSimulacrosList();
          }
          return;
        }

        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.simulacros.push({
              nombre: nombre.trim(),
              archivo: event.target.result,
              nombreArchivo: file.name
            });

            processed++;
            if (processed === files.length) {
              this.saveSimulacros();
              this.renderSimulacrosList();
            }
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          processed++;
          if (processed === files.length) {
            this.showNotification('❌ Error al procesar algunos archivos', 'error');
            this.saveSimulacros();
            this.renderSimulacrosList();
          }
        }
      });
    };

    input.click();
  }

  editSimulacro(index) {
    const simulacro = this.simulacros[index];
    if (!simulacro) return;

    const nombre = prompt('Nombre del simulacro:', simulacro.nombre);
    if (nombre === null) return;

    // Preguntar si desea cambiar el archivo
    const cambiarArchivo = confirm('¿Deseas cambiar el archivo PDF?');
    
    if (cambiarArchivo) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          // Si cancela, solo actualiza el nombre
          this.simulacros[index].nombre = nombre.trim();
          this.saveSimulacros();
          this.renderSimulacrosList();
          return;
        }

        if (!file.type.includes('pdf')) {
          this.showNotification('❌ Solo se permiten archivos PDF', 'error');
          return;
        }

        try {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.simulacros[index] = {
              nombre: nombre.trim(),
              archivo: event.target.result,
              nombreArchivo: file.name
            };

            this.saveSimulacros();
            this.renderSimulacrosList();
          };
          reader.readAsDataURL(file);
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          this.showNotification('❌ Error al procesar el archivo', 'error');
        }
      };

      input.click();
    } else {
      // Solo actualiza el nombre
      this.simulacros[index].nombre = nombre.trim();
      this.saveSimulacros();
      this.renderSimulacrosList();
    }
  }

  deleteSimulacro(index) {
    const simulacro = this.simulacros[index];
    if (!simulacro) return;

    if (confirm(`¿Eliminar el simulacro "${simulacro.nombre}"?`)) {
      this.simulacros.splice(index, 1);
      this.saveSimulacros();
      this.renderSimulacrosList();
    }
  }

  loadTitles() {
    try {
      const data = localStorage.getItem('simulacros_titles');
      if (data) {
        const titles = JSON.parse(data);
        const titleInput = document.getElementById('simulacros-section-title');
        const subtitleInput = document.getElementById('simulacros-section-subtitle');
        
        if (titleInput && titles.title) titleInput.value = titles.title;
        if (subtitleInput && titles.subtitle) subtitleInput.value = titles.subtitle;
      }
    } catch (error) {
      console.error('Error al cargar títulos de simulacros:', error);
    }
  }

  saveTitles() {
    try {
      const titleInput = document.getElementById('simulacros-section-title');
      const subtitleInput = document.getElementById('simulacros-section-subtitle');
      
      const titles = {
        title: titleInput?.value || 'Simulacros de Práctica',
        subtitle: subtitleInput?.value || 'Descarga material de práctica para prepararte para tu examen de ingreso'
      };
      
      localStorage.setItem('simulacros_titles', JSON.stringify(titles));
    } catch (error) {
      console.error('Error al guardar títulos de simulacros:', error);
    }
  }

  showNotification(message, type = 'info') {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}
