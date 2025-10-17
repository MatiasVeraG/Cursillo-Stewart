// ===== API DE INGRESANTES PARA LA PÁGINA PRINCIPAL =====

const API = 'api/admin_api.php';
let currentActiveKey = null;

// Actualizar títulos de sección desde localStorage
function updateSectionTitles() {
  try {
    const savedTitles = JSON.parse(localStorage.getItem('ingresantes_section_titles') || '{}');

    console.log('=== UPDATE SECTION TITLES ===');
    console.log('Saved titles from localStorage:', savedTitles);

    // Buscar elementos de título en la página con múltiples selectores
    let sectionHeader = document.querySelector('#ingresantes .section-header h2');
    let sectionSubtitle = document.querySelector('#ingresantes .section-header p');

    // Selectores alternativos en caso de que no se encuentren
    if (!sectionHeader) {
      sectionHeader = document.querySelector('#ingresantes h2');
      console.log('Using alternative header selector');
    }

    if (!sectionSubtitle) {
      sectionSubtitle = document.querySelector('#ingresantes p');
      console.log('Using alternative subtitle selector');
    }

    console.log('Elements found:', {
      header: !!sectionHeader,
      subtitle: !!sectionSubtitle,
      headerText: sectionHeader?.textContent,
      subtitleText: sectionSubtitle?.textContent,
    });

    if (sectionHeader) {
      const newTitle = savedTitles.title || '🎓 Nuestros Ingresantes';
      sectionHeader.textContent = newTitle;
      console.log('✅ Title updated to:', newTitle);

      // Agregar animación visual para indicar cambio
      sectionHeader.style.transition = 'all 0.3s ease';
      sectionHeader.style.transform = 'scale(1.05)';
      setTimeout(() => {
        sectionHeader.style.transform = 'scale(1)';
      }, 300);
    } else {
      console.warn('❌ Section header not found');
    }

    if (sectionSubtitle) {
      const newSubtitle =
        savedTitles.subtitle ||
        'Conoce a los estudiantes que han confiado en nosotros para su preparación.';
      sectionSubtitle.textContent = newSubtitle;
      console.log('✅ Subtitle updated to:', newSubtitle);

      // Agregar animación visual para indicar cambio
      sectionSubtitle.style.transition = 'all 0.3s ease';
      sectionSubtitle.style.opacity = '0.7';
      setTimeout(() => {
        sectionSubtitle.style.opacity = '1';
      }, 200);
    } else {
      console.warn('❌ Section subtitle not found');
    }

    console.log('=== END UPDATE SECTION TITLES ===');
  } catch (error) {
    console.error('Error updating section titles:', error);
  }
}

// Función auxiliar para hacer peticiones JSON
async function j(url) {
  try {
    const r = await fetch(url, { credentials: 'same-origin' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  } catch (error) {
    // Fallback a datos locales en caso de error
    console.log('Fallback to localStorage data...');
    return getLocalData(url);
  }
}

// Fallback usando localStorage (misma lógica que admin)
function getLocalData(url) {
  const urlObj = new URL(url, window.location.origin);
  const action = urlObj.searchParams.get('action');
  const key = urlObj.searchParams.get('key');

  switch (action) {
    case 'list_exams':
      const index = JSON.parse(localStorage.getItem('ingresantes_index') || '[]');
      return index.sort((a, b) => {
        const [examA, yearA] = a.split('-');
        const [examB, yearB] = b.split('-');
        const yearDiff = parseInt(yearB) - parseInt(yearA);
        return yearDiff !== 0 ? yearDiff : examA.localeCompare(examB);
      });

    case 'get_ingresantes':
      const data = localStorage.getItem(`ingresantes_${key}`);
      if (!data) throw new Error('Lista no encontrada');
      return JSON.parse(data);

    default:
      throw new Error('Acción no válida');
  }
}

// Generar medalla según la posición
function getMedal(position) {
  if (position === 1) return '🥇';
  if (position === 2) return '🥈';
  if (position === 3) return '🥉';
  if (position <= 10) return '🏅';
  return '';
}

// Renderizar botones dinámicos EXAMEN-AÑO
async function renderDynamicTabs() {
  const tabsContainer = document.getElementById('dynamicTabs');
  const contentContainer = document.getElementById('dynamicContent');
  const statsContainer = document.getElementById('dynamicStats');

  if (!tabsContainer || !contentContainer || !statsContainer) {
    console.warn('Contenedores dinámicos no encontrados');
    return;
  }

  try {
    const keys = await j(`${API}?action=list_exams`);

    if (keys.length === 0) {
      tabsContainer.innerHTML = '<p class="no-data">No hay listas de ingresantes disponibles.</p>';
      contentContainer.innerHTML = '';
      statsContainer.innerHTML = '';
      return;
    }

    // Renderizar botones dinámicos
    tabsContainer.innerHTML = '';
    keys.forEach((key, i) => {
      const btn = document.createElement('button');
      btn.className = 'year-tab' + (i === 0 ? ' active' : '');
      btn.textContent = key;
      btn.dataset.year = key;
      btn.onclick = () => showExamYear(key);
      tabsContainer.appendChild(btn);
    });

    // Cargar primer examen por defecto
    if (keys[0]) {
      showExamYear(keys[0]);
    }

    // Calcular estadísticas totales
    await calculateStats(keys);
  } catch (error) {
    console.error('Error loading dynamic tabs:', error);
    tabsContainer.innerHTML = '<p class="error">Error al cargar los datos de ingresantes.</p>';
  }
}

// Mostrar contenido de un examen específico
async function showExamYear(key) {
  currentActiveKey = key;

  // Actualizar botones activos
  document.querySelectorAll('.year-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.year === key);
  });

  const contentContainer = document.getElementById('dynamicContent');
  if (!contentContainer) return;

  try {
    const data = await j(`${API}?action=get_ingresantes&key=${encodeURIComponent(key)}`);

    if (!data.items || data.items.length === 0) {
      contentContainer.innerHTML = `
        <div class="year-content active">
          <p class="no-data">No hay ingresantes registrados para ${key}.</p>
        </div>
      `;
      return;
    }

    // Ordenar por posición
    const sortedItems = [...data.items].sort((a, b) => {
      const posA = parseInt(a.posicion) || parseInt(a.puesto) || 999;
      const posB = parseInt(b.posicion) || parseInt(b.puesto) || 999;
      return posA - posB;
    });

    // Dividir entre top 10 y resto
    const top10 = sortedItems.filter(item => {
      const pos = parseInt(item.posicion) || parseInt(item.puesto) || 999;
      return pos <= 10;
    });
    const others = sortedItems.filter(item => {
      const pos = parseInt(item.posicion) || parseInt(item.puesto) || 999;
      return pos > 10;
    });

    // Renderizar contenido
    contentContainer.innerHTML = `
      <div class="year-content active" id="year-${key.replace('-', '')}">
        <div class="ingresantes-list">
          ${renderIngresantesList([...top10, ...others.slice(0, 20)])}
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error loading exam data:', error);
    contentContainer.innerHTML = `
      <div class="year-content active">
        <p class="error">Error al cargar los datos de ${key}.</p>
      </div>
    `;
  }
}

// Renderizar lista de ingresantes con formato bonito
function renderIngresantesList(items) {
  return items
    .map(item => {
      const position = parseInt(item.posicion) || parseInt(item.puesto) || 999;
      const isTop10 = position <= 10;
      const isPreferencial =
        item.preferencial === true || item.preferencial === 'true' || item.preferencial === 1;

      let medal = '';
      if (position === 1) medal = '🥇';
      else if (position === 2) medal = '🥈';
      else if (position === 3) medal = '🥉';
      else if (position <= 10) medal = '🏅';

      const classes = [
        'ingresante-item',
        isTop10 ? 'top-10' : '',
        isPreferencial ? 'preferencial' : '',
      ]
        .filter(Boolean)
        .join(' ');

      return `
      <div class="${classes}">
        ${medal ? `<span class="medal">${medal}</span>` : ''}
        <span class="nombre">${item.nombre || 'Sin nombre'}</span>
        <span class="puntaje">${Number(item.puntaje || 0).toFixed(2)}</span>
        ${item.carrera ? `<span class="carrera">${item.carrera}</span>` : ''}
        <span class="posicion">#${position}</span>
      </div>
    `;
    })
    .join('');
}

// Calcular estadísticas dinámicas
async function calculateStats(keys) {
  const statsContainer = document.getElementById('dynamicStats');
  if (!statsContainer) {
    console.warn('Contenedor de estadísticas no encontrado');
    return;
  }

  // Mostrar indicador de carga
  statsContainer.innerHTML = `
    <div class="stat-item">
      <span class="stat-number">...</span>
      <span class="stat-label">Calculando</span>
    </div>
  `;

  try {
    let totalIngresantes = 0;
    const yearStats = {};
    const examStats = {};

    // Obtener datos de cada examen
    for (const key of keys) {
      try {
        const data = await j(`${API}?action=get_ingresantes&key=${encodeURIComponent(key)}`);
        const count = data.items ? data.items.length : 0;
        totalIngresantes += count;

        // Extraer año de la clave (EXAMEN-AÑO)
        const [exam, year] = key.split('-');
        if (year) {
          yearStats[year] = (yearStats[year] || 0) + count;
        }

        // Estadísticas por examen
        examStats[key] = count;

        console.log(`Stats for ${key}: ${count} ingresantes`);
      } catch (error) {
        console.warn(`Error loading stats for ${key}:`, error);
      }
    }

    console.log('Total calculated stats:', { totalIngresantes, yearStats, examStats });

    // Verificar que tenemos datos
    if (totalIngresantes === 0) {
      statsContainer.innerHTML = `
        <div class="stat-item">
          <span class="stat-number">0</span>
          <span class="stat-label">No hay datos</span>
        </div>
      `;
      return;
    }

    // Renderizar estadísticas organizadas
    const years = Object.keys(yearStats).sort((a, b) => parseInt(b) - parseInt(a));

    let statsHTML = '';

    // Estadísticas por año (máximo 3 años recientes)
    const recentYears = years.slice(0, 3);
    recentYears.forEach(year => {
      statsHTML += `
        <div class="stat-item">
          <span class="stat-number">${yearStats[year]}</span>
          <span class="stat-label">Ingresantes ${year}</span>
        </div>
      `;
    });

    // Total general (siempre al final)
    statsHTML += `
      <div class="stat-item total-stat">
        <span class="stat-number">${totalIngresantes}</span>
        <span class="stat-label">Total Ingresantes</span>
      </div>
    `;

    statsContainer.innerHTML = statsHTML;
    console.log('Statistics rendered successfully');
  } catch (error) {
    console.error('Error calculating stats:', error);
    statsContainer.innerHTML = `
      <div class="stat-item error-stat">
        <span class="stat-number">⚠️</span>
        <span class="stat-label">Error en estadísticas</span>
      </div>
    `;
  }
}

// Escuchar cambios de localStorage para actualización automática
window.addEventListener('storage', event => {
  console.log('Storage event detected:', event.key, event.newValue);

  if (event.key === 'ingresantes_update_timestamp') {
    // Recargar datos cuando haya cambios desde admin
    console.log('Detected ingresantes update, refreshing...');
    setTimeout(() => {
      renderDynamicTabs();
      updateSectionTitles();
    }, 500); // Pequeño delay para asegurar que los cambios se propaguen
  }

  if (event.key === 'ingresantes_section_titles') {
    // Actualizar títulos cuando cambien
    console.log('Detected titles update from storage event');
    setTimeout(() => {
      updateSectionTitles();
    }, 100);
  }

  if (event.key === 'ingresantes_titles_changed') {
    // Actualizar títulos cuando cambien específicamente
    console.log('Detected titles change timestamp');
    setTimeout(() => {
      updateSectionTitles();
    }, 100);
  }
});

// También escuchar eventos personalizados
window.addEventListener('ingresantesTitlesChanged', () => {
  console.log('Custom titles change event detected');
  setTimeout(() => {
    updateSectionTitles();
  }, 100);
});

// También escuchar eventos personalizados en la misma ventana
window.addEventListener('ingresantesUpdated', () => {
  console.log('Local ingresantes update detected');
  setTimeout(renderDynamicTabs, 500);
});

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Verificar que estamos en la página principal con sección ingresantes
  if (document.getElementById('dynamicTabs') && document.getElementById('dynamicContent')) {
    renderDynamicTabs().catch(e => {
      console.error('Error initializing dynamic ingresantes:', e);
    });

    // Actualizar títulos personalizados
    updateSectionTitles();

    // Sistema de verificación periódica para títulos (cada 2 segundos)
    let lastTitlesCheck = localStorage.getItem('ingresantes_section_titles');
    setInterval(() => {
      const currentTitles = localStorage.getItem('ingresantes_section_titles');
      if (currentTitles !== lastTitlesCheck) {
        console.log('Detected title change via periodic check');
        updateSectionTitles();
        lastTitlesCheck = currentTitles;
      }
    }, 2000);
  }
});

// Función de compatibilidad con el código existente (si existe)
function showYear(year) {
  // Buscar si hay un botón con ese año y hacer clic
  const buttons = document.querySelectorAll('.year-tab');
  for (const btn of buttons) {
    if (btn.textContent.includes(year)) {
      btn.click();
      break;
    }
  }
}

// Exportar funciones para uso global
window.renderDynamicTabs = renderDynamicTabs;
window.showExamYear = showExamYear;
window.showYear = showYear;

// === ESTILOS PARA PREFERENCIALES ===
// Los ingresantes preferenciales se mostrarán con color dorado
