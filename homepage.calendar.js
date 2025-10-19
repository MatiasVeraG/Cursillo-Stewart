// Calendar Dynamic Rendering for Homepage
(function () {
  'use strict';

  let calendarData = null;

  // Load calendar data
  function loadCalendarData() {
    try {
      const stored = localStorage.getItem('calendar_data');
      if (stored) {
        calendarData = JSON.parse(stored);
        applyCalendarData();
      } else {
        // Use default values from HTML
        console.log('No stored calendar data, using defaults');
      }
    } catch (error) {
      console.error('Error loading calendar data:', error);
    }
  }

  // Apply calendar data to the page
  function applyCalendarData() {
    if (!calendarData) return;

    const calendarSection = document.getElementById('calendario');
    if (!calendarSection) return;

    // Update section background color
    if (calendarData.bgColor) {
      calendarSection.style.backgroundColor = calendarData.bgColor;
    }

    // Update section header (title and subtitle)
    const sectionHeader = calendarSection.querySelector('.section-header');
    if (sectionHeader) {
      const h2 = sectionHeader.querySelector('h2');
      const p = sectionHeader.querySelector('p');

      if (h2 && calendarData.title) {
        h2.textContent = calendarData.title;
      }

      if (p && calendarData.subtitle) {
        p.textContent = calendarData.subtitle;
      }
    }

    // Update events
    if (calendarData.events && calendarData.events.length > 0) {
      renderCalendarEvents();
    }

    // Apply card colors
    applyCalendarColors();
  }

  // Render calendar events
  function renderCalendarEvents() {
    const calendarSection = document.getElementById('calendario');
    if (!calendarSection) return;

    const container = calendarSection.querySelector('.container');
    if (!container) return;

    // Find or create grid container
    let gridContainer = container.querySelector('.grid');
    
    if (!gridContainer) {
      gridContainer = document.createElement('div');
      gridContainer.className = 'grid grid-3';
      container.appendChild(gridContainer);
    }

    // Clear existing events
    gridContainer.innerHTML = '';

    // Render each event
    calendarData.events.forEach(event => {
      const eventCard = createEventCard(event);
      gridContainer.appendChild(eventCard);
    });
  }

  // Create event card HTML element
  function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'calendar-card';

    card.innerHTML = `
      <div class="calendar-date">
        <div class="date-circle">${event.day}</div>
        <div class="date-info">
          <h3>${event.month}</h3>
          <p>${event.year}</p>
        </div>
      </div>
      <h4>${event.title}</h4>
      <p>${event.description}</p>
    `;

    return card;
  }

  // Apply colors to calendar elements
  function applyCalendarColors() {
    if (!calendarData) return;

    // Create or update style element for calendar colors
    let styleEl = document.getElementById('calendar-dynamic-styles');
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'calendar-dynamic-styles';
      document.head.appendChild(styleEl);
    }

    const styles = `
      /* Dynamic calendar colors */
      #calendario .date-circle {
        background: ${calendarData.dateCircleColor || '#1e3a8a'};
        color: ${calendarData.dateCircleText || '#ffffff'};
      }

      #calendario .calendar-card {
        background: ${calendarData.cardBg || '#ffffff'};
        border: 1px solid ${calendarData.cardBorder || '#e2e8f0'};
      }
    `;

    styleEl.textContent = styles;
  }

  // Listen for updates from admin panel
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'UPDATE_CALENDAR') {
      calendarData = event.data.data;
      localStorage.setItem('calendar_data', JSON.stringify(calendarData));
      applyCalendarData();
    }
  });

  // Listen for storage changes
  window.addEventListener('storage', function (e) {
    if (e.key === 'calendar_data') {
      calendarData = JSON.parse(e.newValue);
      applyCalendarData();
    }
  });

  // Initialize on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCalendarData);
  } else {
    loadCalendarData();
  }
})();
