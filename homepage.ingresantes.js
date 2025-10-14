// Render chips y lista de ingresantes dinámicamente en homepage

document.addEventListener('DOMContentLoaded', () => {
  const chipsContainer = document.getElementById('sections-chips');
  const listContainer = document.getElementById('ingresantes-list-container');

  function renderChips(sections) {
    chipsContainer.innerHTML = '';
    sections.forEach(sec => {
      const chip = document.createElement('button');
      chip.className = 'section-chip';
      chip.textContent = sec.title || `${sec.exam} ${sec.year}`;
      chip.onclick = () => loadIngresantes(sec.slug, chip, sec);
      chipsContainer.appendChild(chip);
    });
  }

  function renderList(data, section) {
    listContainer.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'ingresantes-list-header';
    header.innerHTML = `<h3>${section.title || section.exam + ' ' + section.year}</h3>
      <span class='badge'>${data.records.length} ingresantes</span>
      <span class='badge-date'>${new Date(data.updated_at).toLocaleString()}</span>`;
    listContainer.appendChild(header);
    const table = document.createElement('table');
    table.className = 'ingresantes-table-public';
    table.innerHTML = `<thead><tr>
      <th>Puesto</th><th>Nombre y Apellido</th><th>Puntaje</th><th>Carrera</th><th>Preferencial</th>
    </tr></thead><tbody></tbody>`;
    data.records.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.puesto}</td>
        <td>${r.nombre_completo}</td>
        <td>${r.puntaje}</td>
        <td>${r.carrera || ''}</td>
        <td>${r.preferencial ? '<span class="preferencial-badge">Preferencial</span>' : ''}</td>`;
      table.querySelector('tbody').appendChild(tr);
    });
    listContainer.appendChild(table);
  }

  function loadIngresantes(slug, chip, section) {
    chipsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
    chip.classList.add('active');
    fetch(`data/ingresantes/ingresantes.${slug}.json`)
      .then(r => r.json())
      .then(data => {
        renderList(data, section);
      });
  }

  // Cargar secciones públicas
  fetch('admin_api.php?action=sections.list')
    .then(r => r.json())
    .then(resp => {
      if (resp.ok && Array.isArray(resp.sections)) {
        const publics = resp.sections.filter(s => s.is_public);
        publics.sort((a, b) => (a.order || 1) - (b.order || 1));
        renderChips(publics);
        if (publics.length) {
          loadIngresantes(publics[0].slug, chipsContainer.querySelector('button'), publics[0]);
        }
      }
    });
});

// Estilos sugeridos para chips y tabla
