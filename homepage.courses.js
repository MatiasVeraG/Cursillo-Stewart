// Courses Dynamic Rendering for Homepage
(function () {
  'use strict';

  let coursesData = null;

  // Load courses data
  async function loadCoursesData() {
    try {
      // Try localStorage first
      const stored = localStorage.getItem('courses_data');
      if (stored) {
        coursesData = JSON.parse(stored);
      } else {
        // Load from JSON file
        const response = await fetch('data/courses.json');
        coursesData = await response.json();
        localStorage.setItem('courses_data', JSON.stringify(coursesData));
      }

      renderCourses();
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  }

  // Render all courses
  function renderCourses() {
    if (!coursesData) return;

    // Render course tabs/buttons
    renderCourseTabs();

    // Render each course content
    Object.keys(coursesData).forEach(courseId => {
      renderCourseContent(courseId);
    });

    // Setup course toggle functionality
    setupCourseToggle();
  }

  // Render course navigation tabs
  function renderCourseTabs() {
    const tabsContainer = document.querySelector('.course-toggle-nav');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    Object.keys(coursesData).forEach((courseId, index) => {
      const course = coursesData[courseId];
      const button = document.createElement('button');
      button.className = 'toggle-btn' + (index === 0 ? ' active' : '');
      button.dataset.course = courseId;
      button.textContent = course.name;
      button.style.borderColor = course.color;

      tabsContainer.appendChild(button);
    });
  }

  // Render individual course content
  function renderCourseContent(courseId) {
    const course = coursesData[courseId];
    const programaSection = document.getElementById('programa');
    if (!programaSection) return;

    // Check if content container already exists
    let contentDiv = document.getElementById(`${courseId}-content`);

    if (!contentDiv) {
      // Create new content container
      contentDiv = document.createElement('div');
      contentDiv.id = `${courseId}-content`;
      contentDiv.className = 'course-content';

      // Find where to insert (after course-toggle-nav)
      const toggleNav = programaSection.querySelector('.course-toggle-nav');
      if (toggleNav && toggleNav.nextSibling) {
        toggleNav.parentNode.insertBefore(contentDiv, toggleNav.nextSibling);
      }
    }

    // Set active class only for first course
    const isFirst = Object.keys(coursesData)[0] === courseId;
    contentDiv.className = 'course-content' + (isFirst ? ' active' : '');

    // Render schedules grid
    const schedulesHTML = renderSchedulesGrid(course.schedules);

    // Render course info (using default for now)
    const courseInfoHTML = renderCourseInfo(course);

    contentDiv.innerHTML = `
      ${schedulesHTML}
      ${courseInfoHTML}
      <div class="course-inscription-btn">
        <a href="#inscripcion" class="btn-inscripcion" data-course="${courseId}">
          Inscribirse a Curso ${course.name}
        </a>
      </div>
    `;
  }

  // Render schedules grid with max 3 columns
  function renderSchedulesGrid(schedules) {
    if (!schedules || schedules.length === 0) {
      return '<div class="schedule-grid"><p style="text-align: center; padding: 40px;">No hay turnos disponibles.</p></div>';
    }

    // Default colors for each type
    const defaultColors = {
      presencial: { bg: '#dbeafe', text: '#1e40af' },
      sabados: { bg: '#fef3c7', text: '#92400e' },
      virtual: { bg: '#dcfce7', text: '#166534' },
      mofa: { bg: '#fee2e2', text: '#991b1b' },
    };

    const schedulesHTML = schedules
      .map(schedule => {
        // Get custom colors or use defaults
        const bgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
        const textColor =
          schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';
        const borderColor = schedule.borderColor || '#2563eb';

        return `
      <div class="schedule-card ${schedule.type}" style="border-left-color: ${borderColor};">
        <div class="schedule-header">
          <h3>${schedule.title}</h3>
          <span class="schedule-type ${schedule.type}" style="background: ${bgColor}; color: ${textColor};">${schedule.typeLabel}</span>
        </div>
        <div class="schedule-info">
          <div class="schedule-time"><strong>Horario:</strong> ${schedule.time}</div>
          <div class="schedule-days"><strong>Días:</strong> ${schedule.days}</div>
          <div class="schedule-dates"><strong>Período:</strong> ${schedule.period}</div>
        </div>
      </div>
    `;
      })
      .join('');

    return `<div class="schedule-grid">${schedulesHTML}</div>`;
  }

  // Render course information section with collapsible content
  function renderCourseInfo(course) {
    return `
      <div class="program-info">
        <!-- Collapsible: Contenido del Cursillo -->
        <div class="info-card collapsible-card">
          <button class="collapsible-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('active');">
            <h4>📚 Contenido del Cursillo</h4>
            <span class="toggle-icon">▼</span>
          </button>
          <div class="collapsible-content">
            <div class="book-info">
              <h5>"Precalculus - Mathematics for Calculus"</h5>
              <p class="author">por <strong>James Stewart</strong></p>
              <p class="book-description">
                Reconocido mundialmente como uno de los mejores textos de Precálculo, este libro
                proporciona una base sólida para el estudio del Cálculo y las matemáticas
                superiores. <strong>Materiales en inglés.</strong>
              </p>
            </div>
            <ul>
              <li>Chapter 1: Fundamentals</li>
              <li>Chapter 2: Functions</li>
              <li>Chapter 3: Polynomial and Rational Functions</li>
              <li>Chapter 4: Exponential and Logarithmic Functions</li>
              <li>Chapter 5: Trigonometric Functions: Unit Circle Approach</li>
              <li>Chapter 6: Trigonometric Functions: Right Triangle Approach</li>
              <li>Chapter 7: Analytic Trigonometry</li>
              <li>Chapter 8: Polar Coordinates and Parametric Equations</li>
              <li>Chapter 9: Vectors in Two and Three Dimensions</li>
              <li>Chapter 10: Systems of Equations and Inequalities</li>
              <li>Chapter 11: Conic Sections</li>
              <li>Chapter 12: Sequences and Series</li>
              <li>Chapter 13: Limits: A Preview of Calculus</li>
            </ul>
          </div>
        </div>

        <!-- Collapsible: Modalidades -->
        <div class="info-card collapsible-card">
          <button class="collapsible-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('active');">
            <h4>✅ Modalidades Disponibles</h4>
            <span class="toggle-icon">▼</span>
          </button>
          <div class="collapsible-content">
            <ul>
              ${getUniqueBadges(course.schedules)}
            </ul>
          </div>
        </div>

        <!-- Collapsible: Materiales -->
        <div class="info-card collapsible-card">
          <button class="collapsible-header" onclick="this.classList.toggle('active'); this.nextElementSibling.classList.toggle('active');">
            <h4>📝 Materiales y Actividades Incluidas</h4>
            <span class="toggle-icon">▼</span>
          </button>
          <div class="collapsible-content">
            <ul>
              <li>📋 Ejercitarios por capítulo</li>
              <li>📊 Exámenes parciales y totales</li>
              <li>📚 Weekly Problems (ejercicios del libro)</li>
              <li>🎯 Actividades de práctica dirigida</li>
              <li>📖 Material de apoyo complementario</li>
              <li>💻 Recursos digitales interactivos</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  // Get unique badges from schedules
  function getUniqueBadges(schedules) {
    const defaultColors = {
      presencial: { bg: '#dbeafe', text: '#1e40af' },
      sabados: { bg: '#fef3c7', text: '#92400e' },
      virtual: { bg: '#dcfce7', text: '#166534' },
      mofa: { bg: '#fee2e2', text: '#991b1b' },
    };

    const uniqueTypes = {};
    schedules.forEach(schedule => {
      if (!uniqueTypes[schedule.type]) {
        const bgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
        const textColor =
          schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';

        uniqueTypes[schedule.type] = {
          typeLabel: schedule.typeLabel,
          days: schedule.days,
          bgColor: bgColor,
          textColor: textColor,
        };
      }
    });

    return Object.keys(uniqueTypes)
      .map(type => {
        const info = uniqueTypes[type];
        return `<li><span class="badge ${type}" style="background: ${info.bgColor}; color: ${info.textColor};">${info.typeLabel}</span> ${info.days}</li>`;
      })
      .join('');
  }

  // Setup course toggle functionality
  function setupCourseToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const courseContents = document.querySelectorAll('.course-content');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        const courseId = this.dataset.course;

        // Remove active class from all buttons and contents
        toggleBtns.forEach(b => b.classList.remove('active'));
        courseContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Show corresponding content
        const content = document.getElementById(`${courseId}-content`);
        if (content) {
          content.classList.add('active');
        }
      });
    });
  }

  // Listen for updates from admin panel
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'UPDATE_COURSES') {
      coursesData = event.data.data;
      localStorage.setItem('courses_data', JSON.stringify(coursesData));

      // Update titles if provided
      if (event.data.titles) {
        updateCourseTitles(event.data.titles);
      }

      renderCourses();
    }
  });

  // Listen for storage changes (for same-tab updates)
  window.addEventListener('storage', function (e) {
    if (e.key === 'courses_data') {
      coursesData = JSON.parse(e.newValue);
      renderCourses();
    }
    if (e.key === 'courses_titles') {
      const titles = JSON.parse(e.newValue);
      updateCourseTitles(titles);
    }
  });

  // Update course section titles
  function updateCourseTitles(titles) {
    const programaSection = document.getElementById('programa');
    if (!programaSection) return;

    const sectionHeader = programaSection.querySelector('.section-header');
    if (!sectionHeader) return;

    const h2 = sectionHeader.querySelector('h2');
    const p = sectionHeader.querySelector('p');

    if (h2) h2.textContent = titles.mainTitle || 'Cursos';

    // Si hay subtítulo, actualizar o crear el elemento p
    if (titles.subtitle) {
      if (p) {
        p.textContent = titles.subtitle;
        p.style.display = 'block';
      } else {
        const newP = document.createElement('p');
        newP.textContent = titles.subtitle;
        sectionHeader.appendChild(newP);
      }
    } else if (p) {
      p.style.display = 'none';
    }
  }

  // Load and apply saved titles on page load
  function loadSavedTitles() {
    const stored = localStorage.getItem('courses_titles');
    if (stored) {
      const titles = JSON.parse(stored);
      updateCourseTitles(titles);
    }
  }

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadCoursesData();
      loadSavedTitles();
    });
  } else {
    loadCoursesData();
    loadSavedTitles();
  }
})();
