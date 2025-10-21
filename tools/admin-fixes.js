// ===== FUNCIONES CORREGIDAS PARA ADMIN PANEL =====
// Este archivo contiene las funciones corregidas para gestión de títulos y listas

// === TÍTULOS ===

// Cargar títulos guardados
window.loadIngresantesTitlesFixed = function () {
  const titleEl = document.getElementById('ingresantes-title');
  const subtitleEl = document.getElementById('ingresantes-subtitle');

  if (!titleEl || !subtitleEl) {
    console.warn('Elementos de títulos no encontrados');
    return;
  }

  try {
    const savedTitles = JSON.parse(localStorage.getItem('ingresantes_section_titles') || '{}');

    titleEl.value = savedTitles.title || '🎓 Nuestros Ingresantes';
    subtitleEl.value =
      savedTitles.subtitle ||
      'Conoce a los estudiantes que han confiado en nosotros para su preparación.';

    console.log('✅ Títulos cargados:', savedTitles);
  } catch (error) {
    console.error('Error cargando títulos:', error);
    titleEl.value = '🎓 Nuestros Ingresantes';
    subtitleEl.value = 'Conoce a los estudiantes que han confiado en nosotros para su preparación.';
  }
};

// Guardar títulos
window.saveIngresantesTitlesFixed = function () {
  const titleEl = document.getElementById('ingresantes-title');
  const subtitleEl = document.getElementById('ingresantes-subtitle');
  const statusEl = document.getElementById('titles-status');

  if (!titleEl || !subtitleEl) {
    alert('❌ Error: Elementos no encontrados');
    return;
  }

  const titles = {
    title: titleEl.value.trim(),
    subtitle: subtitleEl.value.trim(),
    lastUpdated: new Date().toISOString(),
  };

  if (!titles.title || !titles.subtitle) {
    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #dc3545; padding: 10px; background: #f8d7da; border-radius: 5px;">❌ Por favor completa todos los campos</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 3000);
    }
    return;
  }

  try {
    // Guardar en localStorage
    localStorage.setItem('ingresantes_section_titles', JSON.stringify(titles));

    // Notificar al frontend
    localStorage.setItem('ingresantes_titles_changed', Date.now().toString());

    // Mensaje de éxito
    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #28a745; padding: 10px; background: #d4edda; border-radius: 5px;">✅ Títulos guardados exitosamente. Refresca index.html para ver los cambios.</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 5000);
    }

    console.log('✅ Títulos guardados:', titles);
    alert(
      '✅ Títulos guardados correctamente\n\nRefresca la página index.html para ver los cambios.'
    );
  } catch (error) {
    console.error('Error guardando títulos:', error);
    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #dc3545; padding: 10px; background: #f8d7da; border-radius: 5px;">❌ Error al guardar títulos</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 3000);
    }
  }
};

// Restaurar títulos por defecto
window.resetIngresantesTitlesFixed = function () {
  if (!confirm('¿Restaurar los títulos por defecto?')) return;

  const titleEl = document.getElementById('ingresantes-title');
  const subtitleEl = document.getElementById('ingresantes-subtitle');
  const statusEl = document.getElementById('titles-status');

  if (titleEl && subtitleEl) {
    titleEl.value = '🎓 Nuestros Ingresantes';
    subtitleEl.value = 'Conoce a los estudiantes que han confiado en nosotros para su preparación.';

    localStorage.removeItem('ingresantes_section_titles');
    localStorage.setItem('ingresantes_titles_changed', Date.now().toString());

    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #17a2b8; padding: 10px; background: #d1ecf1; border-radius: 5px;">🔄 Títulos restaurados por defecto</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 3000);
    }

    console.log('✅ Títulos restaurados');
  }
};

// === LISTAS ===

// Refrescar listas
window.refreshSavedLists = async function () {
  console.log('🔄 Refrescando listas...');
  if (typeof loadSavedLists === 'function') {
    await loadSavedLists();
  }
};

// Editar lista
window.editList = async function (key) {
  try {
    // Obtener datos desde localStorage
    const dataStr = localStorage.getItem(`ingresantes_${key}`);
    if (!dataStr) {
      alert('❌ Lista no encontrada');
      return;
    }

    const data = JSON.parse(dataStr);

    const newName = prompt(
      `Editar nombre de la lista:\nActual: ${key}\n\nFormato: EXAMEN-AÑO (ej: UNEFA-2025)`,
      key
    );

    if (!newName || newName === key) {
      return;
    }

    if (!/^[A-Z0-9]+-\d{4}$/.test(newName)) {
      alert('❌ Formato inválido. Usa: EXAMEN-AÑO (ej: UNEFA-2025)');
      return;
    }

    const [exam, year] = newName.split('-');

    const updatedData = {
      ...data,
      key: newName,
      exam: exam,
      year: year,
      meta: {
        ...data.meta,
        fecha: new Date().toISOString(),
      },
    };

    localStorage.setItem(`ingresantes_${newName}`, JSON.stringify(updatedData));

    if (key !== newName) {
      localStorage.removeItem(`ingresantes_${key}`);

      const index = JSON.parse(localStorage.getItem('ingresantes_index') || '[]');
      const newIndex = index.map(item => (item === key ? newName : item));
      localStorage.setItem('ingresantes_index', JSON.stringify(newIndex));
    }

    // Notificar al frontend
    localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());

    alert(`✅ Lista renombrada: "${key}" → "${newName}"`);

    if (typeof loadSavedLists === 'function') {
      await loadSavedLists();
    }
  } catch (error) {
    console.error('Error editando lista:', error);
    alert('❌ Error al editar la lista');
  }
};

// Eliminar lista
window.deleteListFixed = async function (key) {
  if (!confirm(`¿Eliminar la lista "${key}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }

  try {
    localStorage.removeItem(`ingresantes_${key}`);

    const index = JSON.parse(localStorage.getItem('ingresantes_index') || '[]');
    const newIndex = index.filter(item => item !== key);
    localStorage.setItem('ingresantes_index', JSON.stringify(newIndex));

    // Notificar al frontend
    localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());

    alert(`✅ Lista "${key}" eliminada`);

    if (typeof loadSavedLists === 'function') {
      await loadSavedLists();
    }
  } catch (error) {
    console.error('Error eliminando lista:', error);
    alert('❌ Error al eliminar la lista');
  }
};

// Inicialización
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('ingresantes-title')) {
      setTimeout(() => window.loadIngresantesTitlesFixed(), 200);
    }
  });
} else {
  if (document.getElementById('ingresantes-title')) {
    setTimeout(() => window.loadIngresantesTitlesFixed(), 200);
  }
}

console.log('✅ admin-fixes.js cargado correctamente');
