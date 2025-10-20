/**
 * Homepage Conocenos Management
 * Handles real-time updates for the "Conocenos" section including titles and timeline
 */

(function () {
  'use strict';

  // Load and apply conocenos changes on page load
  loadConocenosChanges();

  // Listen for storage changes (cross-tab updates)
  window.addEventListener('storage', function (e) {
    if (
      e.key === 'website_content' ||
      e.key === 'timeline_data' ||
      e.key === 'admin_update_timestamp'
    ) {
      loadConocenosChanges();
    }
  });

  // Listen for custom events from admin panel
  window.addEventListener('adminContentChange', function (e) {
    if (e.detail) {
      updateConocenosSection(e.detail);
    }
  });

  // Polling fallback for same-tab updates
  let lastUpdateTimestamp = localStorage.getItem('admin_update_timestamp') || '0';
  setInterval(() => {
    const currentTimestamp = localStorage.getItem('admin_update_timestamp') || '0';
    if (currentTimestamp !== lastUpdateTimestamp) {
      lastUpdateTimestamp = currentTimestamp;
      loadConocenosChanges();
    }
  }, 500);

  /**
   * Load conocenos changes from localStorage
   */
  function loadConocenosChanges() {
    try {
      // Load general content
      const savedContent = localStorage.getItem('website_content');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        updateConocenosSection(content);
      }

      // Load timeline data specifically
      const timelineData = localStorage.getItem('timeline_data');
      if (timelineData) {
        const timeline = JSON.parse(timelineData);
        updateTimelineContent(timeline);
      }
    } catch (error) {
      console.error('Error loading conocenos changes:', error);
    }
  }

  /**
   * Update conocenos section content
   */
  function updateConocenosSection(content) {
    // Update section title
    const titleElement = document.querySelector('#conocenos h2');
    if (titleElement && content['about-title']) {
      titleElement.textContent = content['about-title'];
    }

    // Update section description
    const descElement = document.querySelector('#conocenos .section-header p');
    if (descElement && content['about-description']) {
      descElement.textContent = content['about-description'];
    }

    // Update timeline if data is included
    if (content.timeline_data && Array.isArray(content.timeline_data)) {
      updateTimelineContent(content.timeline_data);
    }
  }

  /**
   * Update timeline content with new data
   */
  function updateTimelineContent(timelineData) {
    const timelineContainer = document.querySelector('.timeline-container');
    if (!timelineContainer || !timelineData || timelineData.length === 0) {
      return;
    }

    // Sort timeline data by year
    const sortedData = [...timelineData].sort((a, b) => {
      const yearA = a.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(a.year) || 0;
      const yearB = b.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(b.year) || 0;
      return yearA - yearB;
    });

    // Generate timeline HTML
    let timelineHTML = '';
    sortedData.forEach(entry => {
      const title = entry.title ? ` - ${entry.title}` : '';
      const description = entry.description || '';
      
      timelineHTML += `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3>${entry.year}${title}</h3>
            <p>${description}</p>
            ${
              entry.image
                ? `
              <div class="timeline-image" style="text-align: center; margin-top: 1.5rem">
                <img
                  src="${entry.image}"
                  alt="${entry.title || entry.year}"
                  style="
                    width: 100%;
                    max-width: 400px;
                    border-radius: 8px;
                    margin: 0 auto;
                    display: block;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  "
                />
                <small style="
                  color: var(--gray-600);
                  font-style: italic;
                  display: block;
                  margin-top: 0.5rem;
                ">
                  ${entry.imageName || `Imagen de ${entry.year}`}
                </small>
              </div>
            `
                : ''
            }
          </div>
        </div>
      `;
    });

    // Update timeline container with smooth transition
    timelineContainer.style.opacity = '0';
    setTimeout(() => {
      timelineContainer.innerHTML = timelineHTML;
      timelineContainer.style.opacity = '1';
      console.log('✅ Timeline actualizado con', sortedData.length, 'entradas');
    }, 150);
  }

  // Expose functions globally for debugging
  window.conocenosManager = {
    reload: loadConocenosChanges,
    updateSection: updateConocenosSection,
    updateTimeline: updateTimelineContent,
  };

  console.log('✅ Homepage Conocenos Manager iniciado');
})();
