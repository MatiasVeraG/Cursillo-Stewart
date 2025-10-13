/**
 * Script para cargar chips dinámicos e ingresantes desde secciones
 * Reemplaza el contenido hardcodeado por datos dinámicos
 */

class DynamicIngresantesLoader {
  constructor() {
    this.currentSection = null;
    this.sections = [];
  }

  /**
   * Inicializa el loader dinámico
   */
  async init() {
    await this.loadSections();
    this.renderChips();

    // Cargar primera sección disponible
    if (this.sections.length > 0) {
      await this.loadSection(this.sections[0].slug);
    }
  }

  /**
   * Carga las secciones desde el API
   */
  async loadSections() {
    try {
      const response = await fetch('data/sections.json');
      if (response.ok) {
        this.sections = await response.json();
        this.sections = this.sections
          .filter(s => s.is_public)
          .sort((a, b) => (b.order || 0) - (a.order || 0)); // Más nuevos primero
      }
    } catch (error) {
      console.warn('Error loading sections:', error);
      this.sections = [];
    }
  }

  /**
   * Renderiza los chips dinámicos
   */
  renderChips() {
    const chipsContainer = document.getElementById('dynamic-chips');

    if (!chipsContainer) {
      console.warn('Container dynamic-chips not found');
      return;
    }

    if (this.sections.length === 0) {
      chipsContainer.innerHTML = `
        <div class="no-sections-message">
          <p>📚 Próximamente se publicarán los resultados de ingresantes</p>
        </div>
      `;
      return;
    }

    // Generar chips centrados
    const chipsHTML = this.sections
      .map(
        section => `
      <button class="year-tab dynamic-chip" 
              data-slug="${section.slug}" 
              onclick="dynamicLoader.loadSection('${section.slug}')">
        ${section.title}
      </button>
    `
      )
      .join('');

    chipsContainer.innerHTML = chipsHTML;

    // Activar primer chip
    if (this.sections.length > 0) {
      const firstChip = chipsContainer.querySelector('.dynamic-chip');
      if (firstChip) {
        firstChip.classList.add('active');
      }
    }
  }

  /**
   * Carga los datos de una sección específica
   */
  async loadSection(slug) {
    try {
      // Actualizar chip activo
      this.updateActiveChip(slug);

      // Mostrar loading
      this.showLoading();

      // Cargar datos
      const response = await fetch(`data/ingresantes/ingresantes.${slug}.json`);

      if (!response.ok) {
        throw new Error(`No se pudieron cargar los datos para ${slug}`);
      }

      const ingresantes = await response.json();
      const section = this.sections.find(s => s.slug === slug);

      // Renderizar contenido
      this.renderIngresantes(ingresantes, section);

      this.currentSection = slug;
    } catch (error) {
      console.error('Error loading section:', error);
      this.showError(`Error cargando datos de ${slug}`);
    }
  }

  /**
   * Actualiza el chip activo
   */
  updateActiveChip(slug) {
    const chips = document.querySelectorAll('.dynamic-chip');
    chips.forEach(chip => {
      if (chip.dataset.slug === slug) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  /**
   * Muestra loading
   */
  showLoading() {
    const contentContainer = document.getElementById('dynamic-content');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="loading-content">
          <div class="spinner"></div>
          <p>Cargando datos de ingresantes...</p>
        </div>
      `;
    }
  }

  /**
   * Muestra error
   */
  showError(message) {
    const contentContainer = document.getElementById('dynamic-content');
    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="error-content">
          <p>⚠️ ${message}</p>
        </div>
      `;
    }
  }

  /**
   * Renderiza la lista de ingresantes
   */
  renderIngresantes(ingresantes, section) {
    const contentContainer = document.getElementById('dynamic-content');

    if (!contentContainer) {
      console.warn('Container dynamic-content not found');
      return;
    }

    if (!ingresantes || ingresantes.length === 0) {
      contentContainer.innerHTML = `
        <div class="no-ingresantes">
          <p>📋 No hay datos de ingresantes disponibles para ${section?.title || 'esta sección'}</p>
        </div>
      `;
      return;
    }

    // Generar HTML de ingresantes
    const ingresantesHTML = ingresantes
      .map(ing => {
        const isTopTen = ing.puesto <= 10;
        const isPreferencial = ing.preferencial;

        return `
        <div class="ingresante-item ${isTopTen ? 'top-10' : ''} ${
          isPreferencial ? 'preferencial' : ''
        }">
          ${ing.medal ? `<span class="medal">${ing.medal}</span>` : ''}
          <span class="nombre">${ing.nombre_completo || ing.nombre}</span>
          <span class="puntaje">${ing.puntaje}</span>
          ${ing.carrera ? `<span class="carrera">${ing.carrera}</span>` : ''}
          <span class="posicion">${ing.posicion}</span>
          ${isPreferencial ? '<span class="pref-badge">✨ Preferencial</span>' : ''}
        </div>
      `;
      })
      .join('');

    contentContainer.innerHTML = `
      <div class="year-content active">
        <div class="section-info">
          <h3>${section?.title || 'Ingresantes'}</h3>
          <p>${section?.description || ''}</p>
          <div class="section-stats">
            <span class="stat">👥 ${ingresantes.length} ingresantes</span>
            <span class="stat">📅 Actualizado: ${this.formatDate(section?.updated_at)}</span>
          </div>
        </div>
        <div class="ingresantes-list">
          ${ingresantesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Formatea fecha para mostrar
   */
  formatDate(dateString) {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  }

  /**
   * Método público para cargar sección (usado por onclick)
   */
  loadSectionPublic(slug) {
    return this.loadSection(slug);
  }
}

// CSS adicional para los elementos dinámicos
const dynamicStyles = `
<style>
.dynamic-chip {
  background: var(--primary-gradient);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dynamic-chip:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dynamic-chip.active {
  background: var(--accent-color);
  box-shadow: 0 4px 15px rgba(255,193,7,0.3);
}

.years-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 2rem;
}

.loading-content, .error-content, .no-ingresantes, .no-sections-message {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.section-info {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  border-left: 4px solid var(--accent-color);
}

.section-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.preferencial {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  color: #333 !important;
}

.preferencial .nombre {
  font-weight: 700;
}

.pref-badge {
  background: #ff6b35;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .section-stats {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .dynamic-chip {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}
</style>
`;

// Agregar estilos al head
document.head.insertAdjacentHTML('beforeend', dynamicStyles);

// Inicializar cuando el DOM esté listo
let dynamicLoader;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    dynamicLoader = new DynamicIngresantesLoader();
    dynamicLoader.init();
  });
} else {
  dynamicLoader = new DynamicIngresantesLoader();
  dynamicLoader.init();
}

// Función global para onclick en chips
window.loadDynamicSection = function (slug) {
  if (dynamicLoader) {
    return dynamicLoader.loadSectionPublic(slug);
  }
};
