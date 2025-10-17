// ===== FUNCIONES CORREGIDAS PARA ADMIN PANEL (v2 - USA API REAL) =====

// === TÍTULOS (estos siguen usando localStorage ya que son configuración) ===

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
    localStorage.setItem('ingresantes_section_titles', JSON.stringify(titles));
    localStorage.setItem('ingresantes_titles_changed', Date.now().toString());

    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #28a745; padding: 10px; background: #d4edda; border-radius: 5px;">✅ Títulos guardados. Refresca index.html</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 5000);
    }

    console.log('✅ Títulos guardados:', titles);
    alert('✅ Títulos guardados correctamente\n\nRefresca index.html para ver los cambios.');
  } catch (error) {
    console.error('Error guardando títulos:', error);
    if (statusEl) {
      statusEl.innerHTML =
        '<div style="color: #dc3545; padding: 10px; background: #f8d7da; border-radius: 5px;">❌ Error al guardar</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 3000);
    }
  }
};

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
        '<div style="color: #17a2b8; padding: 10px; background: #d1ecf1; border-radius: 5px;">🔄 Títulos restaurados</div>';
      setTimeout(() => (statusEl.innerHTML = ''), 3000);
    }

    console.log('✅ Títulos restaurados');
  }
};

// === LISTAS (ahora usando API REAL) ===

window.refreshSavedLists = async function () {
  console.log('🔄 Refrescando listas...');
  if (typeof loadSavedLists === 'function') {
    await loadSavedLists();
  }
};

window.editList = async function (key) {
  try {
    // Obtener datos del API real
    const response = await fetch(
      `api/admin_api.php?action=get_ingresantes&key=${encodeURIComponent(key)}`
    );
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    const newName = prompt(
      `Editar nombre de la lista:\nActual: ${key}\n\nFormato: EXAMEN-AÑO (ej: UPTP-2025)`,
      key
    );

    if (!newName || newName === key) {
      return;
    }

    if (!/^[A-Z0-9]+-\d{4}$/.test(newName)) {
      alert('❌ Formato inválido. Usa: EXAMEN-AÑO (ej: UPTP-2025)');
      return;
    }

    const [exam, year] = newName.split('-');

    // Actualizar usando API
    const updateResponse = await fetch('api/admin_api.php?action=update_ingresantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        key: key,
        exam: exam,
        year: parseInt(year),
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`HTTP ${updateResponse.status}`);
    }

    const result = await updateResponse.json();
    if (!result.ok) {
      throw new Error(result.error || 'Error al actualizar');
    }

    // Notificar al frontend
    localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());

    alert(`✅ Lista renombrada: "${key}" → "${result.key}"`);

    if (typeof loadSavedLists === 'function') {
      await loadSavedLists();
    }
  } catch (error) {
    console.error('Error editando lista:', error);
    alert('❌ Error al editar: ' + error.message);
  }
};

window.deleteListFixed = async function (key) {
  if (!confirm(`¿Eliminar la lista "${key}"?\n\nEsta acción no se puede deshacer.`)) {
    return;
  }

  try {
    console.log(`🗑️ Eliminando lista: ${key}`);

    // Eliminar usando API real
    const response = await fetch(
      `api/admin_api.php?action=delete_ingresantes&key=${encodeURIComponent(key)}`,
      {
        method: 'POST',
        credentials: 'same-origin',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (!result.ok) {
      throw new Error(result.error || 'Error al eliminar');
    }

    // Notificar al frontend
    localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());

    alert(`✅ Lista "${key}" eliminada correctamente`);

    if (typeof loadSavedLists === 'function') {
      await loadSavedLists();
    }

    console.log(`✅ Lista ${key} eliminada correctamente`);
  } catch (error) {
    console.error('Error eliminando lista:', error);
    alert('❌ Error al eliminar: ' + error.message);
  }
};

console.log('✅ admin-fixes-v2.js cargado (usando API real)');
