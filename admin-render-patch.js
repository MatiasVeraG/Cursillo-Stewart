// PATCH para renderSavedLists - Sobrescribir la función original

// Sobrescribir renderSavedLists con una versión mejorada
window.originalRenderSavedLists = window.renderSavedLists;

window.renderSavedLists = function (exams) {
  const container = document.getElementById('gi-saved-list');

  if (!container) {
    console.warn('Container gi-saved-list no encontrado');
    return;
  }

  if (!exams || exams.length === 0) {
    container.innerHTML =
      '<div class="gi-saved-empty" style="padding: 20px; text-align: center; color: #666; background: #f8f9fa; border-radius: 8px;">No hay listas guardadas aún. Carga un archivo Excel para crear una nueva lista.</div>';
    return;
  }

  const html = exams
    .map(
      exam => `
    <div class="gi-saved-item" data-key="${
      exam.key
    }" style="border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div style="flex: 1; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #007cba; font-size: 1.1em; font-weight: 600;">📋 ${
            exam.key
          }</h4>
          <p style="margin: 0; font-size: 0.9em; color: #666; line-height: 1.5;">
            <strong>${exam.items ? exam.items.length : 0}</strong> ingresantes registrados
            <br><small style="color: #999;">📅 ${
              typeof formatDate === 'function'
                ? formatDate(exam.meta.fecha)
                : new Date(exam.meta.fecha).toLocaleDateString()
            }</small>
          </p>
        </div>
        <div style="display: flex; gap: 10px; flex-shrink: 0;">
          <button onclick="editList('${
            exam.key
          }')" title="Editar nombre de la lista" style="padding: 0.6rem 1.2rem; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s; display: flex; align-items: center; gap: 5px;">
            <span>✏️</span> Editar
          </button>
          <button onclick="deleteListFixed('${
            exam.key
          }')" title="Eliminar lista" style="padding: 0.6rem 1.2rem; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500; transition: background 0.2s; display: flex; align-items: center; gap: 5px;">
            <span>🗑️</span> Eliminar
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join('');

  container.innerHTML = html;

  console.log(`✅ ${exams.length} listas renderizadas con éxito`);
};

console.log('✅ Patch renderSavedLists aplicado');
