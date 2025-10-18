/**
 * ADMIN FUNCIONAL - VERSION FINAL
 * Sistema completo de administración que FUNCIONA
 */

// ==================== AUTENTICACIÓN ====================
class AuthSystem {
  constructor() {
    this.sessionKey = 'admin_session';
    this.timestampKey = 'admin_timestamp';
    this.sessionDuration = 30 * 60 * 1000;
  }

  init() {
    this.checkSession();
    this.bindLoginForm();
  }

  checkSession() {
    const session = localStorage.getItem(this.sessionKey);
    const timestamp = localStorage.getItem(this.timestampKey);

    if (session && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);
      if (elapsed < this.sessionDuration) {
        this.showAdminPanel();
        localStorage.setItem(this.timestampKey, Date.now().toString());
        return;
      }
    }

    this.showLoginScreen();
  }

  bindLoginForm() {
    const form = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === 'admin' && password === 'stewart2024') {
          localStorage.setItem(this.sessionKey, 'active');
          localStorage.setItem(this.timestampKey, Date.now().toString());
          this.showAdminPanel();
        } else {
          const errorEl = document.getElementById('login-error');
          errorEl.textContent = 'Usuario o contraseña incorrectos';
          errorEl.style.display = 'block';
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) {
          localStorage.removeItem(this.sessionKey);
          localStorage.removeItem(this.timestampKey);
          this.showLoginScreen();
        }
      });
    }
  }

  showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
  }

  showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
  }
}

// ==================== SISTEMA DE INGRESANTES ====================
class IngresantesSystem {
  constructor() {
    this.apiBase = 'api/admin_api.php';
    this.currentExcelData = null;
    this.currentExamInfo = null;
  }

  init() {
    this.bindEvents();
    this.loadSavedLists();
    this.loadTitles();
  }

  bindEvents() {
    // Excel upload
    const excelInput = document.getElementById('inputExcel');
    if (excelInput) {
      excelInput.addEventListener('change', e => this.handleExcelFile(e));
    }

    // Cancelar preview
    const cancelBtn = document.querySelector('.btn-cancel-excel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelExcelUpload());
    }

    // Títulos
    const saveTitlesBtn = document.getElementById('save-titles-btn');
    const resetTitlesBtn = document.getElementById('reset-titles-btn');

    if (saveTitlesBtn) {
      saveTitlesBtn.addEventListener('click', () => this.saveTitles());
    }

    if (resetTitlesBtn) {
      resetTitlesBtn.addEventListener('click', () => this.resetTitles());
    }
  }

  // ===== TÍTULOS =====
  loadTitles() {
    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (!titleEl || !subtitleEl) return;

    try {
      const saved = JSON.parse(localStorage.getItem('ingresantes_section_titles') || '{}');
      titleEl.value = saved.title || '🎓 Nuestros Ingresantes';
      subtitleEl.value =
        saved.subtitle ||
        'Conoce a los estudiantes que han confiado en nosotros para su preparación.';
    } catch (error) {
      console.error('Error cargando títulos:', error);
    }
  }

  saveTitles() {
    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (!titleEl || !subtitleEl) {
      showToast('Error: Elementos no encontrados', 'error');
      return;
    }

    const titles = {
      title: titleEl.value.trim(),
      subtitle: subtitleEl.value.trim(),
      lastUpdated: new Date().toISOString(),
    };

    if (!titles.title || !titles.subtitle) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    try {
      localStorage.setItem('ingresantes_section_titles', JSON.stringify(titles));
      localStorage.setItem('ingresantes_titles_changed', Date.now().toString());
      showToast('✅ Títulos guardados correctamente', 'success');
    } catch (error) {
      console.error('Error guardando títulos:', error);
      showToast('Error al guardar títulos', 'error');
    }
  }

  resetTitles() {
    if (!confirm('¿Restaurar los títulos por defecto?')) return;

    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (titleEl && subtitleEl) {
      titleEl.value = '🎓 Nuestros Ingresantes';
      subtitleEl.value =
        'Conoce a los estudiantes que han confiado en nosotros para su preparación.';

      localStorage.removeItem('ingresantes_section_titles');
      localStorage.setItem('ingresantes_titles_changed', Date.now().toString());

      showToast('🔄 Títulos restaurados', 'success');
    }
  }

  // ===== EXCEL =====
  handleExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        this.processExcelWorksheet(firstSheet, file.name);
      } catch (error) {
        console.error('Error leyendo Excel:', error);
        showToast('Error al leer el archivo Excel', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  processExcelWorksheet(worksheet, fileName) {
    try {
      const examName = worksheet['H2'] ? worksheet['H2'].v : 'UPTP';
      const examYear = worksheet['H3'] ? worksheet['H3'].v : new Date().getFullYear();

      this.currentExamInfo = {
        name: examName,
        year: examYear,
        fileName: fileName,
      };

      const students = [];
      let row = 3;

      // Leer TODAS las filas hasta que no haya más datos
      while (true) {
        const nameCell = `A${row}`;
        if (!worksheet[nameCell] || !worksheet[nameCell].v) break;

        students.push({
          nombre: worksheet[nameCell].v,
          puntaje: parseFloat(worksheet[`B${row}`]?.v || 0) || 0,
          carrera: worksheet[`C${row}`]?.v || '',
          puesto: parseInt(worksheet[`D${row}`]?.v || 0) || 0,
          preferencial: this.normalizePreferencial(worksheet[`E${row}`]?.v || false),
        });

        row++;
      }

      this.currentExcelData = students;
      console.log(`✅ Procesados ${students.length} estudiantes`);
      this.showExcelPreview();
      this.addSaveButton();
    } catch (error) {
      console.error('Error procesando Excel:', error);
      showToast('Error al procesar el archivo', 'error');
    }
  }

  normalizePreferencial(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return ['si', 'sí', 'true', '1', 'yes'].includes(lower);
    }
    return false;
  }

  showExcelPreview() {
    const previewCard = document.getElementById('excel-preview-card');
    const excelInfo = document.getElementById('excel-info');
    const excelPreview = document.getElementById('excel-preview');

    if (!previewCard || !excelInfo || !excelPreview) return;

    excelInfo.innerHTML = `
      <h4>📋 Información del Examen</h4>
      <p><strong>Nombre:</strong> ${this.currentExamInfo.name}</p>
      <p><strong>Año:</strong> ${this.currentExamInfo.year}</p>
      <p><strong>Archivo:</strong> ${this.currentExamInfo.fileName}</p>
      <p><strong>Total de Ingresantes:</strong> ${this.currentExcelData.length}</p>
    `;

    // Mostrar TODA la lista (no solo 10)
    let tableHTML = `
      <div style="max-height: 500px; overflow-y: auto;">
        <table class="preview-table">
          <thead style="position: sticky; top: 0; background: #1a1a1a;">
            <tr>
              <th>Nombre y Apellido</th>
              <th>Puntaje</th>
              <th>Carrera</th>
              <th>Puesto</th>
              <th>Preferencial</th>
            </tr>
          </thead>
          <tbody>
    `;

    // Mostrar TODOS los estudiantes
    this.currentExcelData.forEach(student => {
      const nameClass = student.preferencial ? 'class="preferencial-name"' : '';
      const preferencialText = student.preferencial ? '✅ Sí' : '❌ No';
      tableHTML += `
        <tr>
          <td><span ${nameClass}>${student.nombre}</span></td>
          <td>${student.puntaje}</td>
          <td>${student.carrera}</td>
          <td>${student.puesto}</td>
          <td>${preferencialText}</td>
        </tr>
      `;
    });

    tableHTML += `
          </tbody>
        </table>
      </div>
      <p style="margin-top: 10px; text-align: center; color: #888;">
        Mostrando todos los ${this.currentExcelData.length} estudiantes
      </p>
    `;

    excelPreview.innerHTML = tableHTML;
    previewCard.style.display = 'block';
  }

  addSaveButton() {
    const previewCard = document.getElementById('excel-preview-card');
    if (!previewCard || previewCard.querySelector('.btn-save-excel')) return;

    let actionsContainer = previewCard.querySelector('.preview-actions');
    if (!actionsContainer) {
      actionsContainer = document.createElement('div');
      actionsContainer.className = 'preview-actions';
      actionsContainer.style.cssText =
        'margin-top: 1rem; text-align: center; gap: 1rem; display: flex; justify-content: center;';
      previewCard.appendChild(actionsContainer);
    }

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save-excel';
    saveButton.innerHTML = '💾 Guardar Lista Completa';
    saveButton.style.cssText =
      'background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 600; cursor: pointer;';
    saveButton.onclick = () => this.saveExcelData();

    actionsContainer.insertBefore(saveButton, actionsContainer.firstChild);
  }

  async saveExcelData() {
    if (!this.currentExcelData || !this.currentExamInfo) {
      showToast('No hay datos para guardar', 'error');
      return;
    }

    const saveButton = document.querySelector('.btn-save-excel');
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.innerHTML = '⏳ Guardando...';
    }

    try {
      const payload = {
        exam: this.currentExamInfo.name,
        year: this.currentExamInfo.year,
        meta: {
          archivo: this.currentExamInfo.fileName,
          total: this.currentExcelData.length,
          fecha: new Date().toISOString(),
        },
        items: this.currentExcelData,
      };

      console.log(`Guardando ${this.currentExcelData.length} estudiantes...`);

      const response = await fetch(`${this.apiBase}?action=import_ingresantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(
          `✅ ${this.currentExcelData.length} estudiantes guardados como ${result.key}`,
          'success'
        );
        await this.loadSavedLists();

        if (saveButton) {
          saveButton.innerHTML = '✅ Guardado';
          setTimeout(() => {
            saveButton.innerHTML = '💾 Guardar Lista Completa';
            saveButton.disabled = false;
          }, 2000);
        }
      } else {
        throw new Error(result.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error guardando:', error);
      showToast('Error al guardar los datos', 'error');

      if (saveButton) {
        saveButton.innerHTML = '❌ Error';
        setTimeout(() => {
          saveButton.innerHTML = '💾 Guardar Lista Completa';
          saveButton.disabled = false;
        }, 2000);
      }
    }
  }

  cancelExcelUpload() {
    const input = document.getElementById('inputExcel');
    const previewCard = document.getElementById('excel-preview-card');

    if (input) input.value = '';
    if (previewCard) previewCard.style.display = 'none';

    this.currentExcelData = null;
    this.currentExamInfo = null;
  }

  // ===== LISTAS GUARDADAS =====
  async loadSavedLists() {
    const container = document.getElementById('gi-saved-list');
    if (!container) return;

    try {
      container.innerHTML = '<div class="gi-saved-loading">Cargando listas...</div>';

      const response = await fetch(`${this.apiBase}?action=list_exams`, {
        credentials: 'same-origin',
      });

      const examKeys = await response.json();

      if (!examKeys || examKeys.length === 0) {
        container.innerHTML = '<div class="gi-saved-empty">No hay listas guardadas aún.</div>';
        return;
      }

      const examDetails = await Promise.all(
        examKeys.map(async key => {
          try {
            const res = await fetch(`${this.apiBase}?action=get_ingresantes&key=${key}`, {
              credentials: 'same-origin',
            });
            return await res.json();
          } catch (error) {
            console.error(`Error cargando ${key}:`, error);
            return null;
          }
        })
      );

      const validExams = examDetails.filter(exam => exam !== null);
      this.renderSavedLists(validExams);
    } catch (error) {
      console.error('Error loading lists:', error);
      container.innerHTML = '<div class="gi-saved-empty">Error al cargar las listas.</div>';
    }
  }

  renderSavedLists(exams) {
    const container = document.getElementById('gi-saved-list');
    if (!container) return;

    if (exams.length === 0) {
      container.innerHTML = '<div class="gi-saved-empty">No hay listas guardadas aún.</div>';
      return;
    }

    const html = exams
      .map(
        exam => `
      <div class="gi-saved-item" data-key="${exam.key}">
        <div class="gi-saved-header">
          <span class="gi-saved-key">${exam.key}</span>
          <span class="gi-saved-total">${exam.meta.total} ingresantes</span>
        </div>
        <div class="gi-saved-info">
          <div class="gi-saved-file">📄 ${exam.meta.archivo}</div>
          <div class="gi-saved-date">📅 ${this.formatDate(exam.meta.fecha)}</div>
        </div>
        <div class="gi-saved-actions">
          <button class="btn-ver-lista gi-ver" onclick="ingresantesSystem.viewList('${
            exam.key
          }')">👁️ Ver</button>
          <button class="btn-editar-lista gi-editar" onclick="ingresantesSystem.editList('${
            exam.key
          }')">✏️ Editar</button>
          <button class="btn-eliminar-lista gi-eliminar" onclick="ingresantesSystem.deleteList('${
            exam.key
          }')">🗑️ Eliminar</button>
        </div>
      </div>
    `
      )
      .join('');

    container.innerHTML = html;
  }

  async viewList(key) {
    try {
      const response = await fetch(`${this.apiBase}?action=get_ingresantes&key=${key}`, {
        credentials: 'same-origin',
      });
      const examData = await response.json();

      this.currentExamInfo = {
        name: examData.exam,
        year: examData.year,
        fileName: examData.meta.archivo,
      };
      this.currentExcelData = examData.items;

      this.showExcelPreview();
      showToast(`Lista ${key} cargada (${examData.items.length} estudiantes)`, 'info');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar la lista', 'error');
    }
  }

  async editList(key) {
    const newName = prompt(
      `Editar nombre de la lista:\nActual: ${key}\n\nFormato: EXAMEN-AÑO (ej: UPTP-2025)`,
      key
    );

    if (!newName || newName === key) return;

    if (!/^[A-Z0-9]+-\d{4}$/.test(newName)) {
      showToast('❌ Formato inválido. Usa: EXAMEN-AÑO', 'error');
      return;
    }

    try {
      const [exam, year] = newName.split('-');

      const response = await fetch(`${this.apiBase}?action=update_ingresantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ key, exam, year }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(`✅ Lista renombrada: ${result.key}`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Error al editar', 'error');
    }
  }

  async deleteList(key) {
    if (!confirm(`¿Eliminar la lista "${key}"?\n\nEsta acción no se puede deshacer.`)) return;

    try {
      const response = await fetch(`${this.apiBase}?action=delete_ingresantes&key=${key}`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(`✅ Lista "${key}" eliminada`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Error al eliminar', 'error');
    }
  }

  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return dateString;
    }
  }
}

// ==================== UTILIDADES ====================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  const colors = {
    success: 'background: #10b981; color: white;',
    error: 'background: #ef4444; color: white;',
    info: 'background: #3b82f6; color: white;',
  };

  toast.style.cssText += colors[type] || colors.info;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==================== NAVEGACIÓN DE PESTAÑAS ====================
class TabNavigationSystem {
  constructor() {
    this.currentSection = 'inicio';
  }

  init() {
    console.log('📑 Inicializando navegación de pestañas...');
    this.bindTabButtons();
  }

  bindTabButtons() {
    const navTabs = document.querySelectorAll('.nav-tab');

    if (navTabs.length === 0) {
      console.warn('⚠️ No se encontraron pestañas de navegación');
      return;
    }

    navTabs.forEach(tab => {
      tab.addEventListener('click', e => {
        const targetSection = tab.dataset.section;
        if (targetSection) {
          this.switchToSection(targetSection);
        }
      });
    });

    console.log(`✅ ${navTabs.length} pestañas configuradas`);
  }

  switchToSection(sectionId) {
    console.log(`🔄 Cambiando a sección: ${sectionId}`);

    // Remover active de todas las pestañas
    const allTabs = document.querySelectorAll('.nav-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));

    // Remover active de todas las secciones
    const allSections = document.querySelectorAll('.admin-section');
    allSections.forEach(section => section.classList.remove('active'));

    // Agregar active a la pestaña seleccionada
    const selectedTab = document.querySelector(`.nav-tab[data-section="${sectionId}"]`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }

    // Agregar active a la sección seleccionada
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
      selectedSection.classList.add('active');
      console.log(`✅ Sección "${sectionId}" activada`);
    } else {
      console.error(`❌ No se encontró la sección: ${sectionId}-section`);
    }

    this.currentSection = sectionId;
  }

  getCurrentSection() {
    return this.currentSection;
  }
}

// ==================== FUNCIÓN DE DESCARGA DE PLANTILLA ====================
window.downloadTemplate = function() {
  try {
    console.log('Iniciando descarga de plantilla...');
    
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = 'documents/Plantilla_de_Ingresantes.xlsx';
    link.download = 'Plantilla_de_Ingresantes.xlsx';
    link.setAttribute('target', '_blank');
    
    // Append to body temporarily
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Remove link after a short delay to ensure download started
    setTimeout(() => {
      document.body.removeChild(link);
      console.log('✅ Plantilla descargada exitosamente');
      
      // Show success message if available
      showMessage('Plantilla descargada exitosamente', 'success');
    }, 100);
    
  } catch (error) {
    console.error('❌ Error downloading template:', error);
    showMessage('Error al descargar la plantilla: ' + error.message, 'error');
  }
};

// Function to handle Excel file
window.handleExcelFile = function(event) {
  try {
    if (window.ingresantesSystem && typeof window.ingresantesSystem.handleExcelFile === 'function') {
      window.ingresantesSystem.handleExcelFile(event);
    } else {
      console.error('❌ Sistema de ingresantes no disponible');
      showMessage('Error: Sistema no inicializado', 'error');
    }
  } catch (error) {
    console.error('❌ Error al procesar archivo:', error);
    showMessage('Error al procesar el archivo: ' + error.message, 'error');
  }
};

// Function to cancel Excel upload
window.cancelExcelUpload = function() {
  try {
    console.log('Cancelando carga de Excel...');
    
    if (window.ingresantesSystem && typeof window.ingresantesSystem.cancelExcelUpload === 'function') {
      window.ingresantesSystem.cancelExcelUpload();
      console.log('✅ Carga cancelada exitosamente');
      showMessage('Carga cancelada', 'info');
    } else {
      // Fallback si el sistema no está disponible
      const input = document.getElementById('inputExcel');
      const previewCard = document.getElementById('excel-preview-card');
      
      if (input) input.value = '';
      if (previewCard) previewCard.style.display = 'none';
      
      console.log('✅ Carga cancelada (fallback)');
      showMessage('Carga cancelada', 'info');
    }
  } catch (error) {
    console.error('❌ Error al cancelar:', error);
    showMessage('Error al cancelar: ' + error.message, 'error');
  }
};

// ==================== INICIALIZACIÓN ====================
let authSystem;
let ingresantesSystem;
let tabNavigation;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando sistema de administración...');

  // Verificar XLSX
  if (typeof XLSX === 'undefined') {
    alert('❌ Error: Librería XLSX no disponible. Recarga la página.');
    return;
  }

  // Inicializar sistemas
  authSystem = new AuthSystem();
  authSystem.init();

  ingresantesSystem = new IngresantesSystem();
  ingresantesSystem.init();
  
  // Hacer ingresantesSystem accesible globalmente para funciones onclick
  window.ingresantesSystem = ingresantesSystem;

  // Inicializar navegación de pestañas
  tabNavigation = new TabNavigationSystem();
  tabNavigation.init();

  console.log('✅ Sistema iniciado correctamente');
});
