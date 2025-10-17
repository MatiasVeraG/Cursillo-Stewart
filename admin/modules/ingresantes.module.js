/**
 * MÓDULO DE INGRESANTES
 * Maneja listas de ingresantes, importación Excel, CRUD
 * Completamente independiente
 */

class IngresantesModule {
  constructor() {
    this.apiBase = 'api/admin_api.php';
    this.currentExcelData = null;
    this.currentExamInfo = null;
  }

  init() {
    console.log('🎓 Módulo de Ingresantes iniciado');
    this.bindEvents();
    this.loadSavedLists();
    this.loadTitles();
  }

  bindEvents() {
    // Botón de cargar Excel
    const excelInput = document.getElementById('inputExcel');
    if (excelInput) {
      excelInput.addEventListener('change', e => this.handleExcelFile(e));
    }

    // Botón de cancelar
    const cancelBtn = document.querySelector('.btn-cancel-excel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelExcelUpload());
    }

    // Botones de títulos
    const saveTitlesBtn = document.getElementById('save-titles-btn');
    const resetTitlesBtn = document.getElementById('reset-titles-btn');

    if (saveTitlesBtn) {
      saveTitlesBtn.addEventListener('click', () => this.saveTitles());
    }

    if (resetTitlesBtn) {
      resetTitlesBtn.addEventListener('click', () => this.resetTitles());
    }

    // Event delegation para botones de lista
    const savedList = document.getElementById('gi-saved-list');
    if (savedList) {
      savedList.addEventListener('click', e => this.handleListAction(e));
    }
  }

  // ============= GESTIÓN DE TÍTULOS =============

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
      console.log('✅ Títulos cargados');
    } catch (error) {
      console.error('Error cargando títulos:', error);
    }
  }

  saveTitles() {
    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (!titleEl || !subtitleEl) {
      this.showMessage('Error: Elementos no encontrados', 'error');
      return;
    }

    const titles = {
      title: titleEl.value.trim(),
      subtitle: subtitleEl.value.trim(),
      lastUpdated: new Date().toISOString(),
    };

    if (!titles.title || !titles.subtitle) {
      this.showMessage('Por favor completa todos los campos', 'error');
      return;
    }

    try {
      localStorage.setItem('ingresantes_section_titles', JSON.stringify(titles));
      localStorage.setItem('ingresantes_titles_changed', Date.now().toString());
      this.showMessage('✅ Títulos guardados. Refresca index.html', 'success');
      console.log('✅ Títulos guardados:', titles);
    } catch (error) {
      console.error('Error guardando títulos:', error);
      this.showMessage('Error al guardar títulos', 'error');
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

      this.showMessage('🔄 Títulos restaurados por defecto', 'success');
      console.log('✅ Títulos restaurados');
    }
  }

  // ============= GESTIÓN DE EXCEL =============

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
        this.showMessage('Error al leer el archivo Excel', 'error');
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
      this.showExcelPreview();
      this.addSaveButton();
    } catch (error) {
      console.error('Error procesando Excel:', error);
      this.showMessage('Error al procesar el archivo Excel', 'error');
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

    let tableHTML = `
      <table class="preview-table">
        <thead>
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

    const previewData = this.currentExcelData.slice(0, 10);
    previewData.forEach(student => {
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

    if (this.currentExcelData.length > 10) {
      tableHTML += `
        <tr>
          <td colspan="5" style="text-align: center; font-style: italic; color: #666;">
            ... y ${this.currentExcelData.length - 10} registros más
          </td>
        </tr>
      `;
    }

    tableHTML += '</tbody></table>';
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
    saveButton.innerHTML = '💾 Guardar Lista';
    saveButton.style.cssText =
      'background: var(--admin-success); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 600; cursor: pointer;';
    saveButton.onclick = () => this.saveExcelData();

    actionsContainer.insertBefore(saveButton, actionsContainer.firstChild);
  }

  async saveExcelData() {
    if (!this.currentExcelData || !this.currentExamInfo) {
      this.showMessage('No hay datos para guardar', 'error');
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

      const response = await fetch(`${this.apiBase}?action=import_ingresantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        this.showMessage(`✅ Guardado como ${result.key}`, 'success');
        await this.loadSavedLists();

        if (saveButton) {
          saveButton.innerHTML = '✅ Guardado';
          setTimeout(() => {
            saveButton.innerHTML = '💾 Guardar Lista';
            saveButton.disabled = false;
          }, 2000);
        }
      } else {
        throw new Error(result.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error guardando Excel:', error);
      this.showMessage('Error al guardar los datos', 'error');

      if (saveButton) {
        saveButton.innerHTML = '❌ Error al guardar';
        setTimeout(() => {
          saveButton.innerHTML = '💾 Guardar Lista';
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

  // ============= GESTIÓN DE LISTAS GUARDADAS =============

  async loadSavedLists() {
    const container = document.getElementById('gi-saved-list');
    if (!container) return;

    try {
      container.innerHTML = '<div class="gi-saved-loading">Cargando listas guardadas...</div>';

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
      console.error('Error loading saved lists:', error);
      container.innerHTML =
        '<div class="gi-saved-empty">Error al cargar las listas guardadas.</div>';
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
          <button class="btn-ver-lista gi-ver" data-key="${exam.key}">👁️ Ver</button>
          <button class="btn-editar-lista gi-editar" data-key="${exam.key}">✏️ Editar</button>
          <button class="btn-eliminar-lista gi-eliminar" data-key="${exam.key}">🗑️ Eliminar</button>
        </div>
      </div>
    `
      )
      .join('');

    container.innerHTML = html;
  }

  handleListAction(e) {
    const key = e.target.dataset.key;
    if (!key) return;

    if (e.target.matches('.gi-ver')) {
      this.viewList(key);
    } else if (e.target.matches('.gi-editar')) {
      this.editList(key);
    } else if (e.target.matches('.gi-eliminar')) {
      this.deleteList(key);
    }
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
      this.showMessage(`Lista ${key} cargada en vista previa`, 'info');
    } catch (error) {
      console.error('Error cargando vista previa:', error);
      this.showMessage('Error al cargar la vista previa', 'error');
    }
  }

  async editList(key) {
    const newName = prompt(
      `Editar nombre de la lista:\nActual: ${key}\n\nFormato: EXAMEN-AÑO (ej: UPTP-2025)`,
      key
    );

    if (!newName || newName === key) return;

    if (!/^[A-Z0-9]+-\d{4}$/.test(newName)) {
      this.showMessage('❌ Formato inválido. Usa: EXAMEN-AÑO', 'error');
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
        this.showMessage(`✅ Lista renombrada: ${result.key}`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error editando lista:', error);
      this.showMessage('❌ Error al editar la lista', 'error');
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
        this.showMessage(`✅ Lista "${key}" eliminada`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error eliminando lista:', error);
      this.showMessage('❌ Error al eliminar la lista', 'error');
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
window.IngresantesModule = new IngresantesModule();
