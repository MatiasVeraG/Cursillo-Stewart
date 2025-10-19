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
window.downloadTemplate = function () {
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
window.handleExcelFile = function (event) {
  try {
    if (
      window.ingresantesSystem &&
      typeof window.ingresantesSystem.handleExcelFile === 'function'
    ) {
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
window.cancelExcelUpload = function () {
  try {
    console.log('Cancelando carga de Excel...');

    if (
      window.ingresantesSystem &&
      typeof window.ingresantesSystem.cancelExcelUpload === 'function'
    ) {
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

// ==================== SISTEMA DE CURSOS ====================
class CoursesSystem {
  constructor() {
    this.coursesData = null;
    this.currentCourse = null;
  }

  async init() {
    await this.loadCourses();
    this.loadTitles();
    this.bindEvents();
    this.renderCourseTabs();
  }

  async loadCourses() {
    try {
      const stored = localStorage.getItem('courses_data');
      if (stored) {
        this.coursesData = JSON.parse(stored);
      } else {
        const response = await fetch('data/courses.json');
        this.coursesData = await response.json();
        localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.coursesData = {};
    }
  }

  loadTitles() {
    const storedTitles = localStorage.getItem('courses_titles');
    let titles = storedTitles ? JSON.parse(storedTitles) : {
      mainTitle: 'Cursos',
      subtitle: ''
    };

    const mainTitleInput = document.getElementById('courses-main-title');
    const subtitleInput = document.getElementById('courses-subtitle');

    if (mainTitleInput) {
      mainTitleInput.value = titles.mainTitle;
      mainTitleInput.addEventListener('input', () => this.saveTitles());
    }

    if (subtitleInput) {
      subtitleInput.value = titles.subtitle;
      subtitleInput.addEventListener('input', () => this.saveTitles());
    }
  }

  saveTitles() {
    const mainTitle = document.getElementById('courses-main-title').value;
    const subtitle = document.getElementById('courses-subtitle').value;

    const titles = { mainTitle, subtitle };
    localStorage.setItem('courses_titles', JSON.stringify(titles));
    
    this.updateCoursesOnHomepage();
    showMessage('Títulos actualizados correctamente', 'success');
  }

  bindEvents() {
    const addCourseBtn = document.getElementById('add-course-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const deleteCourseBtn = document.getElementById('delete-course-btn');
    const courseName = document.getElementById('current-course-name');
    const colorPicker = document.getElementById('current-course-color');
    const colorHex = document.getElementById('current-course-color-hex');

    if (addCourseBtn) {
      addCourseBtn.addEventListener('click', () => this.addNewCourse());
    }

    if (addScheduleBtn) {
      addScheduleBtn.addEventListener('click', () => this.addNewSchedule());
    }

    if (deleteCourseBtn) {
      deleteCourseBtn.addEventListener('click', () => this.deleteCourse());
    }

    if (colorPicker && colorHex) {
      colorPicker.addEventListener('input', e => {
        colorHex.value = e.target.value;
        if (this.currentCourse) {
          this.coursesData[this.currentCourse].color = e.target.value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });

      colorHex.addEventListener('input', e => {
        const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
        colorPicker.value = value;
        if (this.currentCourse) {
          this.coursesData[this.currentCourse].color = value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });
    }

    if (courseName) {
      courseName.addEventListener('change', e => {
        if (this.currentCourse && this.coursesData[this.currentCourse]) {
          this.coursesData[this.currentCourse].name = e.target.value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });
    }
  }

  renderCourseTabs() {
    const tabsContainer = document.getElementById('courses-tabs');
    if (!tabsContainer || !this.coursesData) return;

    tabsContainer.innerHTML = '';

    Object.keys(this.coursesData).forEach(courseId => {
      const course = this.coursesData[courseId];
      const tab = document.createElement('button');
      tab.className = 'course-tab';
      tab.textContent = course.name;
      tab.style.color = course.color;
      tab.dataset.courseId = courseId;

      if (courseId === this.currentCourse) {
        tab.classList.add('active');
      }

      tab.addEventListener('click', () => {
        this.selectCourse(courseId);
      });

      tabsContainer.appendChild(tab);
    });

    if (!this.currentCourse && Object.keys(this.coursesData).length > 0) {
      this.selectCourse(Object.keys(this.coursesData)[0]);
    }
  }

  selectCourse(courseId) {
    this.currentCourse = courseId;
    this.renderCourseTabs();
    this.renderCourseEditor();
  }

  renderCourseEditor() {
    if (!this.currentCourse || !this.coursesData[this.currentCourse]) return;

    const course = this.coursesData[this.currentCourse];
    const courseName = document.getElementById('current-course-name');
    const courseColor = document.getElementById('current-course-color');
    const courseColorHex = document.getElementById('current-course-color-hex');

    if (courseName) courseName.value = course.name;
    if (courseColor) courseColor.value = course.color;
    if (courseColorHex) courseColorHex.value = course.color;

    this.renderSchedulesList();
  }

  renderSchedulesList() {
    const schedulesList = document.getElementById('schedules-list');
    if (!schedulesList || !this.currentCourse) return;

    const course = this.coursesData[this.currentCourse];
    schedulesList.innerHTML = '';

    if (!course.schedules || course.schedules.length === 0) {
      schedulesList.innerHTML =
        '<p style="text-align: center; color: var(--admin-text-light); padding: 20px;">No hay turnos agregados. Haz clic en "Agregar Turno" para crear uno.</p>';
      return;
    }

    course.schedules.forEach((schedule, index) => {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';

      // Get custom colors or use defaults
      const defaultColors = {
        presencial: { bg: '#dbeafe', text: '#1e40af' },
        sabados: { bg: '#fef3c7', text: '#92400e' },
        virtual: { bg: '#dcfce7', text: '#166534' },
        mofa: { bg: '#fee2e2', text: '#991b1b' },
      };

      const bgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
      const textColor = schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';

      scheduleItem.innerHTML = `
        <div class="schedule-header-row">
          <h4 class="schedule-title">${schedule.title}</h4>
          <div class="schedule-actions">
            <button class="btn-icon edit" data-index="${index}" title="Editar">
              ✏️ Editar
            </button>
            <button class="btn-icon delete" data-index="${index}" title="Eliminar">
              🗑️ Eliminar
            </button>
          </div>
        </div>
        <div class="schedule-details">
          <div class="schedule-detail">
            <strong>Horario:</strong> ${schedule.time}
          </div>
          <div class="schedule-detail">
            <strong>Días:</strong> ${schedule.days}
          </div>
          <div class="schedule-detail">
            <strong>Período:</strong> ${schedule.period}
          </div>
        </div>
        <div class="schedule-type-badge ${schedule.type}" style="background: ${bgColor}; color: ${textColor};">
          ${schedule.typeLabel}
        </div>
      `;

      const editBtn = scheduleItem.querySelector('.btn-icon.edit');
      const deleteBtn = scheduleItem.querySelector('.btn-icon.delete');

      editBtn.addEventListener('click', () => this.editSchedule(index));
      deleteBtn.addEventListener('click', () => this.deleteSchedule(index));

      schedulesList.appendChild(scheduleItem);
    });
  }

  addNewSchedule() {
    if (!this.currentCourse) {
      showMessage('Selecciona un curso primero', 'error');
      return;
    }

    const newSchedule = {
      id: `${this.currentCourse}-${Date.now()}`,
      title: 'Nuevo Turno',
      type: 'presencial',
      typeLabel: 'Presencial',
      time: '9:00 - 12:00',
      days: 'Lunes a Viernes',
      period: 'Por definir',
      borderColor: '#2563eb',
    };

    this.coursesData[this.currentCourse].schedules.push(newSchedule);
    this.renderSchedulesList();
    this.saveCourses();

    setTimeout(() => {
      this.editSchedule(this.coursesData[this.currentCourse].schedules.length - 1);
    }, 100);
  }

  editSchedule(index) {
    const schedule = this.coursesData[this.currentCourse].schedules[index];

    // Default colors for each type
    const defaultColors = {
      presencial: { bg: '#dbeafe', text: '#1e40af' },
      sabados: { bg: '#fef3c7', text: '#92400e' },
      virtual: { bg: '#dcfce7', text: '#166534' },
      mofa: { bg: '#fee2e2', text: '#991b1b' },
    };

    // Get current colors or use defaults
    const currentBgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
    const currentTextColor =
      schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';

    const modal = document.createElement('div');
    modal.className = 'schedule-modal active';
    modal.innerHTML = `
      <div class="schedule-modal-content">
        <div class="schedule-modal-header">
          <h3>Editar Turno</h3>
          <button class="schedule-modal-close">✕</button>
        </div>
        <div class="schedule-modal-body">
          <div class="form-group">
            <label>Título del Turno:</label>
            <input type="text" id="edit-schedule-title" value="${schedule.title}" />
          </div>
          <div class="form-group">
            <label>Tipo de Modalidad:</label>
            <select id="edit-schedule-type">
              <option value="presencial" ${
                schedule.type === 'presencial' ? 'selected' : ''
              }>Presencial</option>
              <option value="sabados" ${
                schedule.type === 'sabados' ? 'selected' : ''
              }>Sábados</option>
              <option value="virtual" ${
                schedule.type === 'virtual' ? 'selected' : ''
              }>Virtual</option>
              <option value="mofa" ${schedule.type === 'mofa' ? 'selected' : ''}>MOFA</option>
            </select>
          </div>
          <div class="form-group">
            <label>Etiqueta de Tipo:</label>
            <input type="text" id="edit-schedule-type-label" value="${schedule.typeLabel}" />
          </div>
          
          <div class="form-group">
            <h4 style="margin-bottom: 12px; color: var(--admin-text);">🎨 Colores del Turno</h4>
            
            <!-- Paleta de colores predeterminados -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600;">🎨 Combinaciones Predeterminadas:</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
                <button type="button" class="color-preset-btn" data-bg="#dbeafe" data-text="#1e40af" data-border="#2563eb" style="background: #dbeafe; color: #1e40af; border-left: 4px solid #2563eb; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🔵 Azul
                </button>
                <button type="button" class="color-preset-btn" data-bg="#dcfce7" data-text="#166534" data-border="#10b981" style="background: #dcfce7; color: #166534; border-left: 4px solid #10b981; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟢 Verde
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fee2e2" data-text="#991b1b" data-border="#dc2626" style="background: #fee2e2; color: #991b1b; border-left: 4px solid #dc2626; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🔴 Rojo
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fef3c7" data-text="#92400e" data-border="#f59e0b" style="background: #fef3c7; color: #92400e; border-left: 4px solid #f59e0b; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟡 Amarillo
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fed7aa" data-text="#7c2d12" data-border="#ea580c" style="background: #fed7aa; color: #7c2d12; border-left: 4px solid #ea580c; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟠 Naranja
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fae8ff" data-text="#86198f" data-border="#c026d3" style="background: #fae8ff; color: #86198f; border-left: 4px solid #c026d3; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟣 Morado
                </button>
                <button type="button" class="color-preset-btn" data-bg="#e0f2fe" data-text="#075985" data-border="#0284c7" style="background: #e0f2fe; color: #075985; border-left: 4px solid #0284c7; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🩵 Celeste
                </button>
                <button type="button" class="color-preset-btn" data-bg="#f3f4f6" data-text="#1f2937" data-border="#6b7280" style="background: #f3f4f6; color: #1f2937; border-left: 4px solid #6b7280; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  ⚫ Gris
                </button>
              </div>
            </div>

            <!-- Colores personalizados -->
            <div style="padding: 16px; background: var(--admin-bg); border-radius: 8px; border: 2px dashed var(--admin-border);">
              <label style="display: block; margin-bottom: 12px; font-weight: 600;">✏️ Personalizar Colores:</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="display: block; margin-bottom: 8px;">Color de Fondo:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-bg-color" value="${currentBgColor}" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-bg-color-hex" value="${currentBgColor}" placeholder="#dbeafe" style="flex: 1;" />
                  </div>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 8px;">Color de Texto:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-text-color" value="${currentTextColor}" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-text-color-hex" value="${currentTextColor}" placeholder="#1e40af" style="flex: 1;" />
                  </div>
                </div>
                <div style="grid-column: 1 / -1;">
                  <label style="display: block; margin-bottom: 8px;">Color del Borde Lateral:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-border-color" value="${
                      schedule.borderColor || '#2563eb'
                    }" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-border-color-hex" value="${
                      schedule.borderColor || '#2563eb'
                    }" placeholder="#2563eb" style="flex: 1;" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista previa -->
            <div style="margin-top: 12px; padding: 12px; border-radius: 6px; background: var(--admin-bg);">
              <small style="color: var(--admin-text-light);">💡 Vista Previa:</small>
              <div id="color-preview" style="margin-top: 8px; padding: 8px 16px; border-radius: 12px; background: ${currentBgColor}; color: ${currentTextColor}; font-weight: 600; text-align: center; font-size: 13px; border-left: 4px solid ${
      schedule.borderColor || '#2563eb'
    };">
                ${schedule.typeLabel}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Horario:</label>
            <input type="text" id="edit-schedule-time" value="${
              schedule.time
            }" placeholder="Ej: 8:00 - 12:00" />
          </div>
          <div class="form-group">
            <label>Días:</label>
            <input type="text" id="edit-schedule-days" value="${
              schedule.days
            }" placeholder="Ej: Lunes a Viernes" />
          </div>
          <div class="form-group">
            <label>Período:</label>
            <input type="text" id="edit-schedule-period" value="${
              schedule.period
            }" placeholder="Ej: Marzo - Noviembre" />
          </div>
        </div>
        <div class="schedule-modal-footer">
          <button class="btn-secondary modal-cancel">Cancelar</button>
          <button class="btn-primary modal-save">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Color picker sync
    const bgColorPicker = modal.querySelector('#edit-schedule-bg-color');
    const bgColorHex = modal.querySelector('#edit-schedule-bg-color-hex');
    const textColorPicker = modal.querySelector('#edit-schedule-text-color');
    const textColorHex = modal.querySelector('#edit-schedule-text-color-hex');
    const borderColorPicker = modal.querySelector('#edit-schedule-border-color');
    const borderColorHex = modal.querySelector('#edit-schedule-border-color-hex');
    const preview = modal.querySelector('#color-preview');

    const updatePreview = () => {
      preview.style.background = bgColorPicker.value;
      preview.style.color = textColorPicker.value;
      preview.style.borderLeftColor = borderColorPicker.value;
    };

    bgColorPicker.addEventListener('input', e => {
      bgColorHex.value = e.target.value;
      updatePreview();
    });

    bgColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      bgColorPicker.value = value;
      updatePreview();
    });

    textColorPicker.addEventListener('input', e => {
      textColorHex.value = e.target.value;
      updatePreview();
    });

    textColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      textColorPicker.value = value;
      updatePreview();
    });

    borderColorPicker.addEventListener('input', e => {
      borderColorHex.value = e.target.value;
      updatePreview();
    });

    borderColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      borderColorPicker.value = value;
      updatePreview();
    });

    // Preset color buttons
    modal.querySelectorAll('.color-preset-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const bg = btn.dataset.bg;
        const text = btn.dataset.text;
        const border = btn.dataset.border;

        // Update color pickers
        bgColorPicker.value = bg;
        bgColorHex.value = bg;
        textColorPicker.value = text;
        textColorHex.value = text;
        borderColorPicker.value = border;
        borderColorHex.value = border;

        // Update preview
        updatePreview();
      });
    });

    modal.querySelector('.schedule-modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-save').addEventListener('click', () => {
      schedule.title = document.getElementById('edit-schedule-title').value;
      schedule.type = document.getElementById('edit-schedule-type').value;
      schedule.typeLabel = document.getElementById('edit-schedule-type-label').value;
      schedule.time = document.getElementById('edit-schedule-time').value;
      schedule.days = document.getElementById('edit-schedule-days').value;
      schedule.period = document.getElementById('edit-schedule-period').value;
      schedule.customBgColor = bgColorPicker.value;
      schedule.customTextColor = textColorPicker.value;
      schedule.borderColor = borderColorPicker.value;

      this.renderSchedulesList();
      this.saveCourses();
      modal.remove();
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
  }

  deleteSchedule(index) {
    if (!confirm('¿Estás seguro de eliminar este turno?')) return;

    this.coursesData[this.currentCourse].schedules.splice(index, 1);
    this.renderSchedulesList();
    this.saveCourses();
  }

  addNewCourse() {
    const courseName = prompt('Nombre del nuevo curso:');
    if (!courseName) return;

    const courseId = courseName.toLowerCase().replace(/\s+/g, '-');

    if (this.coursesData[courseId]) {
      showMessage('Ya existe un curso con ese nombre', 'error');
      return;
    }

    this.coursesData[courseId] = {
      id: courseId,
      name: courseName,
      color: '#2563eb',
      schedules: [],
    };

    this.selectCourse(courseId);
    this.saveCourses();
  }

  deleteCourse() {
    if (!this.currentCourse) return;

    if (
      !confirm(`¿Estás seguro de eliminar el curso "${this.coursesData[this.currentCourse].name}"?`)
    )
      return;

    delete this.coursesData[this.currentCourse];
    this.currentCourse = null;
    this.renderCourseTabs();
    this.saveCourses();
  }

  saveCourses() {
    localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
    this.updateCoursesOnHomepage();
    showMessage('Cursos guardados correctamente', 'success');
  }

  updateCoursesOnHomepage() {
    try {
      const titles = localStorage.getItem('courses_titles');
      const courseTitles = titles ? JSON.parse(titles) : { mainTitle: 'Cursos', subtitle: '' };
      
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'UPDATE_COURSES',
            data: this.coursesData,
            titles: courseTitles
          },
          '*'
        );
      }
      localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
    } catch (error) {
      console.error('Error updating homepage:', error);
    }
  }
}

// ==================== SISTEMA DE CALENDARIO ====================
class CalendarSystem {
  constructor() {
    this.calendarData = {
      title: 'Calendario de Eventos',
      subtitle: 'Mantente informado sobre fechas importantes',
      bgColor: '#f8fafc',
      dateCircleColor: '#1e3a8a',
      dateCircleText: '#ffffff',
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0',
      events: []
    };
  }

  init() {
    this.loadCalendar();
    this.bindEvents();
    this.renderEvents();
  }

  loadCalendar() {
    const stored = localStorage.getItem('calendar_data');
    if (stored) {
      this.calendarData = JSON.parse(stored);
    } else {
      // Cargar eventos por defecto
      this.calendarData.events = [
        {
          day: 15,
          month: 'Enero',
          year: 2024,
          title: 'Inicio de Inscripciones',
          description: 'Apertura del período de inscripciones para el cursillo'
        },
        {
          day: 1,
          month: 'Febrero',
          year: 2024,
          title: 'Inicio de Clases',
          description: 'Comienzo oficial del programa académico'
        },
        {
          day: 15,
          month: 'Marzo',
          year: 2024,
          title: 'Evaluación Parcial',
          description: 'Primera evaluación del progreso académico'
        },
        {
          day: 30,
          month: 'Abril',
          year: 2024,
          title: 'Examen Final',
          description: 'Evaluación final del cursillo'
        },
        {
          day: 15,
          month: 'Mayo',
          year: 2024,
          title: 'Graduación',
          description: 'Ceremonia de clausura y entrega de certificados'
        },
        {
          day: 1,
          month: 'Junio',
          year: 2024,
          title: 'Ingreso UPTP',
          description: 'Inicio del período universitario regular'
        }
      ];
      this.saveCalendar();
    }

    // Cargar valores en inputs
    document.getElementById('calendar-title').value = this.calendarData.title;
    document.getElementById('calendar-subtitle').value = this.calendarData.subtitle;
    
    // Colores
    this.setColorInputs('calendar-bg-color', this.calendarData.bgColor);
    this.setColorInputs('calendar-date-circle-color', this.calendarData.dateCircleColor);
    this.setColorInputs('calendar-date-circle-text', this.calendarData.dateCircleText);
    this.setColorInputs('calendar-card-bg', this.calendarData.cardBg);
    this.setColorInputs('calendar-card-border', this.calendarData.cardBorder);
  }

  setColorInputs(id, color) {
    const colorPicker = document.getElementById(id);
    const colorHex = document.getElementById(id + '-hex');
    
    if (colorPicker) colorPicker.value = color;
    if (colorHex) colorHex.value = color;
  }

  bindEvents() {
    // Inputs de título y subtítulo
    const titleInput = document.getElementById('calendar-title');
    const subtitleInput = document.getElementById('calendar-subtitle');

    if (titleInput) {
      titleInput.addEventListener('input', () => {
        this.calendarData.title = titleInput.value;
        this.saveCalendar();
      });
    }

    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => {
        this.calendarData.subtitle = subtitleInput.value;
        this.saveCalendar();
      });
    }

    // Color pickers
    this.bindColorPicker('calendar-bg-color', 'bgColor');
    this.bindColorPicker('calendar-date-circle-color', 'dateCircleColor');
    this.bindColorPicker('calendar-date-circle-text', 'dateCircleText');
    this.bindColorPicker('calendar-card-bg', 'cardBg');
    this.bindColorPicker('calendar-card-border', 'cardBorder');

    // Botón agregar evento
    const addBtn = document.getElementById('add-calendar-event-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addNewEvent());
    }
  }

  bindColorPicker(id, property) {
    const colorPicker = document.getElementById(id);
    const colorHex = document.getElementById(id + '-hex');

    if (colorPicker) {
      colorPicker.addEventListener('input', (e) => {
        this.calendarData[property] = e.target.value;
        if (colorHex) colorHex.value = e.target.value;
        this.saveCalendar();
      });
    }

    if (colorHex) {
      colorHex.addEventListener('input', (e) => {
        const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
        this.calendarData[property] = value;
        if (colorPicker) colorPicker.value = value;
        this.saveCalendar();
      });
    }
  }

  renderEvents() {
    const container = document.getElementById('calendar-events-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.calendarData.events.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: #64748b; padding: 2rem;">No hay eventos agregados aún. Haz clic en "Agregar Nuevo Evento" para comenzar.</p>';
      return;
    }

    this.calendarData.events.forEach((event, index) => {
      const eventCard = document.createElement('div');
      eventCard.className = 'calendar-event-card';
      eventCard.innerHTML = `
        <div class="calendar-event-header">
          <h4>Evento ${index + 1}</h4>
          <button class="btn-delete-event" onclick="calendarSystem.deleteEvent(${index})" title="Eliminar evento">
            🗑️
          </button>
        </div>
        <div class="calendar-event-body">
          <div class="form-group">
            <label>Día:</label>
            <input type="number" class="form-input" min="1" max="31" value="${event.day}" 
              onchange="calendarSystem.updateEvent(${index}, 'day', this.value)" />
          </div>
          <div class="form-group">
            <label>Mes:</label>
            <input type="text" class="form-input" value="${event.month}" 
              onchange="calendarSystem.updateEvent(${index}, 'month', this.value)" />
          </div>
          <div class="form-group">
            <label>Año:</label>
            <input type="number" class="form-input" value="${event.year}" 
              onchange="calendarSystem.updateEvent(${index}, 'year', this.value)" />
          </div>
          <div class="form-group">
            <label>Título del Evento:</label>
            <input type="text" class="form-input" value="${event.title}" 
              onchange="calendarSystem.updateEvent(${index}, 'title', this.value)" />
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea class="form-input" rows="2" 
              onchange="calendarSystem.updateEvent(${index}, 'description', this.value)">${event.description}</textarea>
          </div>
        </div>
      `;
      container.appendChild(eventCard);
    });
  }

  addNewEvent() {
    const newEvent = {
      day: 1,
      month: 'Enero',
      year: new Date().getFullYear(),
      title: 'Nuevo Evento',
      description: 'Descripción del evento'
    };

    this.calendarData.events.push(newEvent);
    this.renderEvents();
    this.saveCalendar();
  }

  updateEvent(index, field, value) {
    if (field === 'day' || field === 'year') {
      value = parseInt(value);
    }
    this.calendarData.events[index][field] = value;
    this.saveCalendar();
  }

  deleteEvent(index) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    this.calendarData.events.splice(index, 1);
    this.renderEvents();
    this.saveCalendar();
  }

  saveCalendar() {
    localStorage.setItem('calendar_data', JSON.stringify(this.calendarData));
    this.updateCalendarOnHomepage();
    showMessage('Calendario actualizado correctamente', 'success');
  }

  updateCalendarOnHomepage() {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'UPDATE_CALENDAR',
            data: this.calendarData
          },
          '*'
        );
      }
    } catch (error) {
      console.error('Error updating homepage calendar:', error);
    }
  }

  // Aplicar preset de colores
  applyColorPreset(preset) {
    const presets = {
      blue: {
        bgColor: '#f8fafc',
        dateCircleColor: '#1e3a8a',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#dbeafe'
      },
      red: {
        bgColor: '#fef2f2',
        dateCircleColor: '#dc2626',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#fecaca'
      },
      green: {
        bgColor: '#f0fdf4',
        dateCircleColor: '#059669',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#bbf7d0'
      },
      purple: {
        bgColor: '#faf5ff',
        dateCircleColor: '#7c3aed',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e9d5ff'
      },
      orange: {
        bgColor: '#fff7ed',
        dateCircleColor: '#ea580c',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#fed7aa'
      },
      teal: {
        bgColor: '#f0fdfa',
        dateCircleColor: '#0d9488',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#99f6e4'
      }
    };

    if (presets[preset]) {
      const colors = presets[preset];
      
      // Actualizar datos
      this.calendarData.bgColor = colors.bgColor;
      this.calendarData.dateCircleColor = colors.dateCircleColor;
      this.calendarData.dateCircleText = colors.dateCircleText;
      this.calendarData.cardBg = colors.cardBg;
      this.calendarData.cardBorder = colors.cardBorder;

      // Actualizar inputs
      this.setColorInputs('calendar-bg-color', colors.bgColor);
      this.setColorInputs('calendar-date-circle-color', colors.dateCircleColor);
      this.setColorInputs('calendar-date-circle-text', colors.dateCircleText);
      this.setColorInputs('calendar-card-bg', colors.cardBg);
      this.setColorInputs('calendar-card-border', colors.cardBorder);

      // Guardar
      this.saveCalendar();
      showMessage(`Tema ${preset} aplicado correctamente`, 'success');
    }
  }

  // Restaurar configuración por defecto del sistema
  restoreDefaultCalendar() {
    if (!confirm('¿Estás seguro de restaurar la configuración por defecto del sistema? Esto sobrescribirá tu configuración actual.')) {
      return;
    }

    const defaultConfig = localStorage.getItem('calendar_default_config');
    
    if (defaultConfig) {
      this.calendarData = JSON.parse(defaultConfig);
    } else {
      // Configuración por defecto del sistema
      this.calendarData = {
        title: 'Calendario de Eventos',
        subtitle: 'Mantente informado sobre fechas importantes',
        bgColor: '#f8fafc',
        dateCircleColor: '#1e3a8a',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        events: [
          {
            day: 15,
            month: 'Enero',
            year: 2024,
            title: 'Inicio de Inscripciones',
            description: 'Apertura del período de inscripciones para el cursillo'
          },
          {
            day: 1,
            month: 'Febrero',
            year: 2024,
            title: 'Inicio de Clases',
            description: 'Comienzo oficial del programa académico'
          },
          {
            day: 15,
            month: 'Marzo',
            year: 2024,
            title: 'Evaluación Parcial',
            description: 'Primera evaluación del progreso académico'
          },
          {
            day: 30,
            month: 'Abril',
            year: 2024,
            title: 'Examen Final',
            description: 'Evaluación final del cursillo'
          },
          {
            day: 15,
            month: 'Mayo',
            year: 2024,
            title: 'Graduación',
            description: 'Ceremonia de clausura y entrega de certificados'
          },
          {
            day: 1,
            month: 'Junio',
            year: 2024,
            title: 'Ingreso UPTP',
            description: 'Inicio del período universitario regular'
          }
        ]
      };
    }

    // Actualizar todos los inputs
    document.getElementById('calendar-title').value = this.calendarData.title;
    document.getElementById('calendar-subtitle').value = this.calendarData.subtitle;
    
    this.setColorInputs('calendar-bg-color', this.calendarData.bgColor);
    this.setColorInputs('calendar-date-circle-color', this.calendarData.dateCircleColor);
    this.setColorInputs('calendar-date-circle-text', this.calendarData.dateCircleText);
    this.setColorInputs('calendar-card-bg', this.calendarData.cardBg);
    this.setColorInputs('calendar-card-border', this.calendarData.cardBorder);

    // Re-renderizar eventos
    this.renderEvents();
    
    // Guardar
    this.saveCalendar();
    showMessage('Configuración restaurada correctamente', 'success');
  }

  // Guardar configuración actual como predeterminada
  saveAsDefaultCalendar() {
    if (!confirm('¿Guardar la configuración actual como predeterminada? Esta será la configuración que se restaurará al usar "Restaurar por Defecto".')) {
      return;
    }

    localStorage.setItem('calendar_default_config', JSON.stringify(this.calendarData));
    showMessage('Configuración guardada como predeterminada', 'success');
  }
}

// ==================== INICIALIZACIÓN ====================
let authSystem;
let ingresantesSystem;
let tabNavigation;
let coursesSystem;
let calendarSystem;

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

  // Inicializar sistema de cursos
  coursesSystem = new CoursesSystem();
  coursesSystem.init();

  // Inicializar sistema de calendario
  calendarSystem = new CalendarSystem();
  calendarSystem.init();

  // Hacer calendarSystem accesible globalmente
  window.calendarSystem = calendarSystem;

  console.log('✅ Sistema iniciado correctamente');
});
