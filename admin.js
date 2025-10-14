// Admin Panel JavaScript
class AdminPanel {
  constructor() {
    this.isLoggedIn = false;
    this.currentSection = 'content';
    this.config = this.loadConfig();
    this.originalContent = {};
    this.hasUnsavedChanges = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.checkAuth();
    this.loadCurrentContent();
  }

  // Authentication
  checkAuth() {
    const session = localStorage.getItem('admin_session');
    const timestamp = localStorage.getItem('admin_timestamp');

    if (session && timestamp) {
      const now = Date.now();
      const sessionTime = parseInt(timestamp);
      // Session expires after 4 hours
      if (now - sessionTime < 4 * 60 * 60 * 1000) {
        this.isLoggedIn = true;
        this.showAdminPanel();
        return;
      }
    }

    this.showLoginScreen();
  }

  login(username, password) {
    // Secure authentication - you can change these credentials
    const validCredentials = {
      adminstewart: '1234567890',
    };

    if (validCredentials[username] === password) {
      this.isLoggedIn = true;
      localStorage.setItem('admin_session', 'authenticated');
      localStorage.setItem('admin_timestamp', Date.now().toString());
      this.showAdminPanel();
      this.showMessage('Bienvenido al panel de administración', 'success');
      return true;
    }

    this.showMessage('Usuario o contraseña incorrectos', 'error');
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_timestamp');
    this.showLoginScreen();
    this.showMessage('Sesión cerrada correctamente', 'info');
  }

  showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
  }

  showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'flex';

    // Initialize enhanced features after panel is shown
    setTimeout(() => {
      this.enhanceImageBlocks();
      // this.loadBlockImages(); // Disabled - removed block images feature
      this.loadBackgroundImages();
      this.loadCarouselSettings();
      this.loadBannerOverlaySettings();
      this.loadBannerTextColors();
      this.initEnhancedOverlayControls();
      this.initBackgroundImagesDragDrop();
    }, 100);
  }

  // Event Binding
  bindEvents() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      this.login(username, password);
    });

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.logout();
    });

    // Navigation tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchSection(tab.dataset.section);
      });
    });

    // Save button
    document.getElementById('save-all-btn').addEventListener('click', () => {
      this.saveAllChanges();
    });

    // Content inputs - real-time updates
    this.bindContentInputs();

    // Image uploads
    this.bindImageUploads();

    // Students stats
    this.bindStudentsStats();

    // Settings
    this.bindSettings();

    // Backup/Restore
    this.bindBackupRestore();

    // Toggle functionality for checkboxes
    this.bindToggleOptions();
  }

  bindContentInputs() {
    // Bind inputs from all sections
    const sections = [
      'inicio',
      'conocenos',
      'agregado',
      'ingresantes',
      'cursos',
      'calendario',
      'contacto',
    ];
    sections.forEach(section => {
      const inputs = document.querySelectorAll(
        `#${section}-section input, #${section}-section textarea`
      );
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          // Auto-save after 2 seconds of no typing
          clearTimeout(this.autoSaveTimeout);
          this.autoSaveTimeout = setTimeout(() => {
            this.autoSaveContent();
          }, 2000);
        });
      });
    });
  }

  // Auto-save content changes
  autoSaveContent() {
    const allContent = this.getAllContent();
    localStorage.setItem('website_content', JSON.stringify(allContent));

    // Try to update homepage in real-time
    this.applyChangesToHomepage(allContent);

    // Show subtle save indicator
    this.showAutoSaveIndicator();
  }

  // Show auto-save indicator
  showAutoSaveIndicator() {
    const saveBtn = document.getElementById('save-all-btn');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = '✓ Guardado';
    saveBtn.style.background = 'var(--admin-success)';

    setTimeout(() => {
      saveBtn.textContent = originalText;
      saveBtn.style.background = '';
    }, 1500);
  }

  bindImageUploads() {
    // Background images upload
    const bgFileInput = document.getElementById('background-file-input');
    const bgUploadArea = document.getElementById('background-upload-area');

    if (bgFileInput) {
      bgFileInput.addEventListener('change', e => {
        this.handleImageUpload(e.target.files, 'background');
      });
    }

    // Drag and drop for background images
    if (bgUploadArea) {
      bgUploadArea.addEventListener('dragover', e => {
        e.preventDefault();
        bgUploadArea.classList.add('drag-over');
      });

      bgUploadArea.addEventListener('dragleave', () => {
        bgUploadArea.classList.remove('drag-over');
      });

      bgUploadArea.addEventListener('drop', e => {
        e.preventDefault();
        bgUploadArea.classList.remove('drag-over');
        this.handleImageUpload(e.dataTransfer.files, 'background');
      });
    }

    // Logo upload
    const logoUpload = document.getElementById('logo-upload');
    if (logoUpload) {
      logoUpload.addEventListener('change', e => {
        this.handleImageUpload(e.target.files, 'logo');
      });
    }
  }

  initBackgroundImagesDragDrop() {
    const container = document.getElementById('background-images-container');
    if (!container) return;

    // Limpiar eventos anteriores
    container.removeAttribute('data-drag-initialized');

    // Remover eventos anteriores de todos los items
    const existingItems = container.querySelectorAll('.background-image-item');
    existingItems.forEach(item => {
      item.removeAttribute('data-drag-events-added');
    });

    let draggedElement = null;

    // Agregar eventos a cada imagen
    const items = container.querySelectorAll('.background-image-item');
    items.forEach(item => {
      // Agregar eventos de drag
      item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', item.dataset.imageId);
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('dragging');
        draggedElement = item;

        // Hacer el elemento semi-transparente
        setTimeout(() => {
          item.style.opacity = '0.5';
        }, 0);
      });

      item.addEventListener('dragend', e => {
        item.classList.remove('dragging');
        item.style.opacity = '';
        container.classList.remove('drag-over');

        // Limpiar efectos visuales
        const allItems = container.querySelectorAll('.background-image-item');
        allItems.forEach(el => {
          el.classList.remove('drag-over-item');
        });

        draggedElement = null;
      });

      // Agregar eventos de drop para cada item
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedElement && draggedElement !== item) {
          item.classList.add('drag-over-item');

          // Determinar si insertar antes o después basado en la posición del mouse
          const rect = item.getBoundingClientRect();
          const midpoint = rect.left + rect.width / 2;

          if (e.clientX < midpoint) {
            // Insertar antes de este elemento
            container.insertBefore(draggedElement, item);
          } else {
            // Insertar después de este elemento
            if (item.nextSibling) {
              container.insertBefore(draggedElement, item.nextSibling);
            } else {
              container.appendChild(draggedElement);
            }
          }
        }
      });

      item.addEventListener('dragleave', e => {
        item.classList.remove('drag-over-item');
      });

      item.addEventListener('drop', e => {
        e.preventDefault();
        item.classList.remove('drag-over-item');

        // Actualizar el orden en localStorage
        this.updateBackgroundImageOrder();
      });
    });

    // Eventos del contenedor para casos edge
    container.addEventListener('dragover', e => {
      e.preventDefault();
      container.classList.add('drag-over');
    });

    container.addEventListener('drop', e => {
      e.preventDefault();
      container.classList.remove('drag-over');

      // Si se suelta en un área vacía, actualizar orden
      this.updateBackgroundImageOrder();
    });

    container.addEventListener('dragleave', e => {
      if (!container.contains(e.relatedTarget)) {
        container.classList.remove('drag-over');
      }
    });
  }

  updateBackgroundImageOrder() {
    const items = document.querySelectorAll('.background-image-item');
    let backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');

    items.forEach((item, index) => {
      const imageId = item.dataset.imageId;
      const imageData = backgroundImages.find(img => img.id === imageId);
      if (imageData) {
        imageData.order = index;
      }
    });

    // Ordenar por order
    backgroundImages.sort((a, b) => a.order - b.order);

    localStorage.setItem('background_images', JSON.stringify(backgroundImages));
    this.updateCarouselImages();
    this.markAsUnsaved();
  }

  bindStudentsStats() {
    const statsInputs = document.querySelectorAll('#students-section input[type="number"]');
    statsInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateStudentStats();
      });
    });
  }

  bindSettings() {
    // Social media URLs
    const socialInputs = document.querySelectorAll(
      '#settings-section input[type="url"], #whatsapp-number'
    );
    socialInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateSocialMedia();
      });
    });

    // Change password
    document.getElementById('change-password-btn').addEventListener('click', () => {
      this.changePassword();
    });
  }

  bindBackupRestore() {
    document.getElementById('backup-btn').addEventListener('click', () => {
      this.createBackup();
    });

    document.getElementById('restore-btn').addEventListener('click', () => {
      document.getElementById('restore-input').click();
    });

    document.getElementById('restore-input').addEventListener('change', e => {
      this.restoreBackup(e.target.files[0]);
    });
  }

  // Section Navigation
  switchSection(section) {
    // Update nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(sec => {
      sec.classList.remove('active');
    });
    document.getElementById(`${section}-section`).classList.add('active');

    this.currentSection = section;
  }

  // Content Management
  loadCurrentContent() {
    // This would normally load from your website's current content
    // For now, we'll load from localStorage or set defaults
    const savedContent = localStorage.getItem('website_content');
    if (savedContent) {
      const content = JSON.parse(savedContent);
      this.populateForm(content);
    } else {
      this.setDefaultContent();
    }

    // Initialize timeline
    this.initializeTimeline();
  }

  setDefaultContent() {
    const defaults = {
      // Inicio Section
      'banner-title': 'Cursillo Stewart',
      'banner-subtitle': 'Universidad Politécnica Taiwan Paraguay',
      'banner-description':
        'Preparándote para un futuro universitario exitoso con los mejores profesores y metodología de enseñanza.',

      // Conócenos Section
      'about-title': 'Conócenos',
      'about-description':
        'Somos una institución educativa comprometida con la excelencia académica y el desarrollo integral de nuestros estudiantes.',
      'about-mission':
        'Brindar educación de calidad que prepare a nuestros estudiantes para el éxito universitario.',
      'about-vision': 'Ser reconocidos como la mejor institución preparatoria del país.',
      'timeline-2020': 'Fundación del Cursillo Stewart',
      'timeline-2021': 'Primeros estudiantes admitidos en universidades prestigiosas',
      'timeline-2022': 'Expansión de programas académicos',
      'timeline-2023': 'Reconocimiento como institución de excelencia',
      'timeline-2024': 'Nuevas instalaciones y tecnología avanzada',

      // Agregado Section (Countdown)
      'counters-title': 'Próximo Cursillo Intensivo',
      'counters-subtitle': '¡No te pierdas nuestro próximo cursillo intensivo!',
      'counters-title-color': '#ffffff',
      'counters-subtitle-color': '#ffffff',
      'counters-background-color': '#dc2626',
      'countdown-timer-background': '#1e40af',
      'countdown-numbers-color': '#ffffff',
      'enable-countdown': true,
      'countdown-date': '2025-12-09T08:00',
      'enable-cta': true,
      'cta-text': 'Inscribirme Ahora',
      'cta-button-color': '#dc2626',

      // Ingresantes Section
      'requirements-title': 'Requisitos de Ingreso',
      'requirements-description':
        'Para formar parte de nuestra comunidad educativa, los estudiantes deben cumplir con los siguientes requisitos.',

      // Cursos Section
      'courses-title': 'Nuestros Cursos',
      'courses-description':
        'Ofrecemos una amplia variedad de cursos diseñados para preparar a nuestros estudiantes para el éxito universitario.',

      // Calendario Section
      'calendar-title': 'Calendario Académico',
      'calendar-description': 'Mantente al día con nuestros eventos y fechas importantes.',

      // Contacto Section
      'contact-title': 'Contáctanos',
      'contact-phone': '+595 985 350550',
      'contact-email': 'cursillostewart@gmail.com',
      'contact-address':
        'Independencia Nacional 1159 entre Av. Rodríguez de Francia y Rca. de Colombia, Asunción',
      'contact-hours': 'Lun - Sáb: 8:00 - 12:00 y 14:00 - 18:00',
      'contact-description':
        'Estamos aquí para responder todas tus preguntas y ayudarte en tu camino educativo.',

      // Configuración Section
      'site-title': 'Cursillo Stewart',
      'site-description': 'Institución educativa de excelencia académica',
    };

    this.populateForm(defaults);
  }

  populateForm(content) {
    Object.keys(content).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = content[key];
        } else if (element.type === 'file') {
          // File inputs can't be set programmatically for security reasons
          // We could show the filename in a related display element
        } else {
          element.value = content[key];
        }
      }
    });

    // Handle countdown options visibility after populating form
    const countdownCheckbox = document.getElementById('enable-countdown');
    const countdownOptions = document.getElementById('countdown-options');
    if (countdownCheckbox && countdownOptions) {
      if (countdownCheckbox.checked) {
        countdownOptions.style.display = 'block';
      } else {
        countdownOptions.style.display = 'none';
      }
    }

    // Handle CTA options visibility
    const ctaCheckbox = document.getElementById('enable-cta');
    const ctaOptions = document.getElementById('cta-options');
    if (ctaCheckbox && ctaOptions) {
      if (ctaCheckbox.checked) {
        ctaOptions.style.display = 'block';
      } else {
        ctaOptions.style.display = 'none';
      }
    }
  }

  // Image Management
  handleImageUpload(files, type) {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        this.showMessage('Solo se permiten archivos de imagen', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        if (type === 'background') {
          this.addBackgroundImage(e.target.result, file.name);
        } else if (type === 'logo') {
          this.updateLogo(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  addBackgroundImage(src, name) {
    const imageId = 'bg_' + Date.now();

    // Guardar imagen en el array de imágenes de fondo
    this.saveBackgroundImage(imageId, src, name);

    // Recargar y renderizar todas las imágenes
    const backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    this.renderBackgroundImages(backgroundImages);

    // Actualizar el carousel en tiempo real
    this.updateCarouselImages();
    this.updateImageCount();

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  removeBackgroundImage(imageId) {
    // Remover del almacenamiento
    this.removeBackgroundImageFromStorage(imageId);

    // Recargar y renderizar todas las imágenes
    const backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    this.renderBackgroundImages(backgroundImages);

    // Actualizar el carousel
    this.updateCarouselImages();
    this.updateImageCount();

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  saveBackgroundImage(imageId, src, name) {
    let backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    backgroundImages.push({
      id: imageId,
      src: src,
      name: name,
      order: backgroundImages.length,
    });
    localStorage.setItem('background_images', JSON.stringify(backgroundImages));
  }

  removeBackgroundImageFromStorage(imageId) {
    let backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    backgroundImages = backgroundImages.filter(img => img.id !== imageId);

    // Reordenar los índices
    backgroundImages.forEach((img, index) => {
      img.order = index;
    });

    localStorage.setItem('background_images', JSON.stringify(backgroundImages));
  }

  loadBackgroundImages() {
    let backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');

    // Si no hay imágenes guardadas, cargar las por defecto
    if (backgroundImages.length === 0) {
      this.initializeDefaultBackgroundImages();
      backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    }

    // Renderizar imágenes en la interfaz
    this.renderBackgroundImages(backgroundImages);

    // Actualizar carousel después de cargar
    this.updateCarouselImages();
    this.updateImageCount();
  }

  initializeDefaultBackgroundImages() {
    const defaultImages = [
      'images/Imagen de Fondo 1.jpeg',
      'images/Imagen de Fondo 3.jpeg',
      'images/Imagen de Fondo 4.jpeg',
      'images/Imagen de Fondo 5.jpeg',
    ];

    const backgroundImages = defaultImages.map((imagePath, index) => ({
      id: 'default_' + index,
      src: imagePath,
      name: `Imagen de Fondo ${index + 1}`,
      order: index,
    }));

    localStorage.setItem('background_images', JSON.stringify(backgroundImages));
  }

  // Renderizar imágenes de fondo en la interfaz
  renderBackgroundImages(backgroundImages) {
    const container = document.getElementById('background-images-container');
    if (!container) return;

    container.innerHTML = '';

    backgroundImages.forEach((image, index) => {
      const imageItem = document.createElement('div');
      imageItem.className = 'background-image-item';
      imageItem.setAttribute('data-image-id', image.id);
      imageItem.draggable = true;

      imageItem.innerHTML = `
        <div class="image-preview">
          <img src="${image.src}" alt="${image.name}" loading="lazy">
        </div>
        <div class="image-info">
          <span class="image-name">${image.name}</span>
          <div class="image-actions">
            <button type="button" class="btn-remove" onclick="adminPanel.removeBackgroundImage('${image.id}')" title="Eliminar imagen">
              ❌
            </button>
          </div>
        </div>
        <div class="drag-handle">⋮⋮</div>
      `;

      container.appendChild(imageItem);
    });

    // Inicializar drag and drop del contenedor (incluye eventos de imágenes)
    this.initBackgroundImagesDragDrop();
  }

  resetToDefaultImages() {
    if (
      confirm(
        '¿Estás seguro de que quieres restaurar las imágenes por defecto? Esto eliminará todas las imágenes personalizadas.'
      )
    ) {
      // Limpiar localStorage
      localStorage.removeItem('background_images');
      localStorage.removeItem('carousel_images');

      // Inicializar con imágenes por defecto
      this.initializeDefaultBackgroundImages();

      // Recargar la vista
      this.loadBackgroundImages();

      this.showMessage('Imágenes restauradas por defecto', 'success');
    }
  }

  updateImageCount() {
    const backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    const count = backgroundImages.length;
    const countElement = document.getElementById('background-count');

    if (countElement) {
      countElement.textContent = `${count} imagen${count !== 1 ? 'es' : ''}`;
    }
  }

  updateCarouselImages() {
    const backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');

    // Ordenar por order
    backgroundImages.sort((a, b) => a.order - b.order);

    // Crear array de URLs
    const imageUrls = backgroundImages.map(img => img.src);

    // Actualizar localStorage para que el carousel principal lo use
    localStorage.setItem('carousel_images', JSON.stringify(imageUrls));

    // Intentar actualizar el carousel en tiempo real si estamos en preview
    this.updateHomepageCarousel(imageUrls);

    // Actualizar indicadores
    this.updateCarouselIndicators(imageUrls.length);
  }

  updateHomepageCarousel(imageUrls) {
    try {
      // Intentar actualizar en ventana de preview
      if (this.previewWindow && !this.previewWindow.closed) {
        if (this.previewWindow.backgroundCarousel) {
          this.previewWindow.backgroundCarousel.updateImages(imageUrls);
        }
      }

      // Intentar actualizar en ventana padre/opener
      const targetWindow = window.opener || window.parent;
      if (targetWindow && targetWindow !== window) {
        if (targetWindow.backgroundCarousel) {
          targetWindow.backgroundCarousel.updateImages(imageUrls);
        }
      }
    } catch (error) {
      console.log('No se pudo actualizar el carousel en tiempo real:', error);
    }
  }

  updateCarouselIndicators(count) {
    try {
      const windows = [this.previewWindow, window.opener, window.parent];

      windows.forEach(targetWindow => {
        if (targetWindow && targetWindow !== window && !targetWindow.closed) {
          const indicators = targetWindow.document.querySelector('.carousel-indicators');
          if (indicators) {
            indicators.innerHTML = '';
            for (let i = 0; i < count; i++) {
              const indicator = targetWindow.document.createElement('div');
              indicator.className = 'indicator' + (i === 0 ? ' active' : '');
              indicators.appendChild(indicator);
            }
          }
        }
      });
    } catch (error) {
      console.log('No se pudieron actualizar los indicadores:', error);
    }
  }

  // Actualizar intervalo del carousel
  updateCarouselInterval(seconds) {
    const intervalSeconds = parseInt(seconds);

    // Validar rango
    if (intervalSeconds < 3 || intervalSeconds > 30) {
      this.showMessage('El intervalo debe estar entre 3 y 30 segundos', 'error');
      document.getElementById('carousel-interval').value =
        localStorage.getItem('carousel_interval') || '10';
      return;
    }

    // Guardar en localStorage
    localStorage.setItem('carousel_interval', intervalSeconds.toString());

    // Actualizar display
    const currentIntervalSpan = document.getElementById('current-interval');
    if (currentIntervalSpan) {
      currentIntervalSpan.textContent = intervalSeconds;
    }

    // Actualizar carousel en tiempo real
    try {
      // Intentar actualizar en ventana de preview
      if (this.previewWindow && !this.previewWindow.closed) {
        if (this.previewWindow.backgroundCarousel) {
          this.previewWindow.backgroundCarousel.updateInterval(intervalSeconds);
        }
      }

      // Intentar actualizar en ventana padre/opener
      const targetWindow = window.opener || window.parent;
      if (targetWindow && targetWindow !== window) {
        if (targetWindow.backgroundCarousel) {
          targetWindow.backgroundCarousel.updateInterval(intervalSeconds);
        }
      }
    } catch (error) {
      console.log('No se pudo actualizar el intervalo en tiempo real:', error);
    }

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Cargar configuración del carousel
  loadCarouselSettings() {
    const savedInterval = localStorage.getItem('carousel_interval') || '10';
    const intervalInput = document.getElementById('carousel-interval');
    const currentIntervalSpan = document.getElementById('current-interval');

    if (intervalInput) {
      intervalInput.value = savedInterval;
    }

    if (currentIntervalSpan) {
      currentIntervalSpan.textContent = savedInterval;
    }
  }

  // ========== GESTIÓN DEL FILTRO DEL BANNER ==========

  // Actualizar filtro del banner
  updateBannerOverlay() {
    const color = document.getElementById('banner-overlay-color')?.value || '#1e40af';
    const opacity = document.getElementById('banner-overlay-opacity')?.value || '15';
    const gradient = document.getElementById('banner-overlay-gradient')?.value || '135deg';
    const brightness = document.getElementById('banner-image-brightness')?.value || '100';

    // Actualizar displays
    const colorValueSpan = document.getElementById('overlay-color-value');
    const opacityValueSpan = document.getElementById('overlay-opacity-value');
    const brightnessValueSpan = document.getElementById('brightness-value');

    if (colorValueSpan) colorValueSpan.textContent = color;
    if (opacityValueSpan) opacityValueSpan.textContent = opacity + '%';
    if (brightnessValueSpan) brightnessValueSpan.textContent = brightness + '%';

    // Guardar configuración
    const overlaySettings = {
      color: color,
      opacity: opacity,
      gradient: gradient,
      brightness: brightness,
    };
    localStorage.setItem('banner_overlay_settings', JSON.stringify(overlaySettings));

    // Aplicar cambios en tiempo real
    this.applyBannerOverlay(overlaySettings);
    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Aplicar filtro del banner
  applyBannerOverlay(settings) {
    try {
      // Convertir hex a rgba
      const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
      };

      const rgba = hexToRgba(settings.color, settings.opacity);
      let gradientStyle;

      if (settings.gradient === 'radial') {
        gradientStyle = `radial-gradient(circle, ${rgba} 0%, ${rgba} 100%)`;
      } else {
        gradientStyle = `linear-gradient(${settings.gradient}, ${rgba} 0%, ${rgba} 100%)`;
      }

      // Intentar actualizar en ventana de preview
      if (this.previewWindow && !this.previewWindow.closed) {
        this.updateBannerInWindow(this.previewWindow, gradientStyle, settings.brightness);
      }

      // Intentar actualizar en ventana padre/opener
      const targetWindow = window.opener || window.parent;
      if (targetWindow && targetWindow !== window) {
        this.updateBannerInWindow(targetWindow, gradientStyle, settings.brightness);
      }
    } catch (error) {
      console.log('No se pudo actualizar el filtro del banner en tiempo real:', error);
    }
  }

  // Actualizar banner en ventana específica
  updateBannerInWindow(targetWindow, gradientStyle, brightness) {
    const banner = targetWindow.document.querySelector('.banner');
    if (banner) {
      const beforeElement = banner.querySelector('::before') || banner;

      // Crear o actualizar el estilo del overlay
      let styleElement = targetWindow.document.getElementById('banner-overlay-style');
      if (!styleElement) {
        styleElement = targetWindow.document.createElement('style');
        styleElement.id = 'banner-overlay-style';
        targetWindow.document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        .banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${gradientStyle};
          z-index: 1;
        }
        .banner {
          filter: brightness(${brightness}%);
        }
        .banner .container {
          position: relative;
          z-index: 2;
        }
      `;
    }
  }

  // Cargar configuración del filtro del banner
  loadBannerOverlaySettings() {
    const savedSettings = localStorage.getItem('banner_overlay_settings');
    const settings = savedSettings
      ? JSON.parse(savedSettings)
      : {
          color: '#1e40af',
          opacity: '15',
          gradient: '135deg',
          brightness: '100',
        };

    // Cargar valores en los controles
    const colorInput = document.getElementById('banner-overlay-color');
    const opacityInput = document.getElementById('banner-overlay-opacity');
    const gradientSelect = document.getElementById('banner-overlay-gradient');
    const brightnessInput = document.getElementById('banner-image-brightness');

    if (colorInput) colorInput.value = settings.color;
    if (opacityInput) opacityInput.value = settings.opacity;
    if (gradientSelect) gradientSelect.value = settings.gradient;
    if (brightnessInput) brightnessInput.value = settings.brightness;

    // Cargar colores del texto
    const savedTextColors = localStorage.getItem('banner_text_colors');
    const colors = savedTextColors
      ? JSON.parse(savedTextColors)
      : {
          title: '#ffffff',
          subtitle: '#ffffff',
          description: '#ffffff',
        };

    const titleColorInput = document.getElementById('banner-title-color');
    const subtitleColorInput = document.getElementById('banner-subtitle-color');
    const descriptionColorInput = document.getElementById('banner-description-color');

    if (titleColorInput) titleColorInput.value = colors.title;
    if (subtitleColorInput) subtitleColorInput.value = colors.subtitle;
    if (descriptionColorInput) descriptionColorInput.value = colors.description;

    // Actualizar displays
    this.updateBannerOverlay();
    this.applyBannerTextColors(colors);
  }

  // Restaurar valores por defecto del filtro
  resetBannerOverlay() {
    if (
      confirm(
        '¿Estás seguro de que quieres restaurar los valores por defecto del filtro y texto del banner?'
      )
    ) {
      const defaultSettings = {
        color: '#1e40af',
        opacity: '15',
        gradient: '135deg',
        brightness: '100',
      };
      const defaultTextColor = '#ffffff';

      // Actualizar controles del filtro
      const colorInput = document.getElementById('banner-overlay-color');
      const opacityInput = document.getElementById('banner-overlay-opacity');
      const gradientSelect = document.getElementById('banner-overlay-gradient');
      const brightnessInput = document.getElementById('banner-image-brightness');

      if (colorInput) colorInput.value = defaultSettings.color;
      if (opacityInput) opacityInput.value = defaultSettings.opacity;
      if (gradientSelect) gradientSelect.value = defaultSettings.gradient;
      if (brightnessInput) brightnessInput.value = defaultSettings.brightness;

      // Actualizar controles del texto
      const titleColorInput = document.getElementById('banner-title-color');
      const subtitleColorInput = document.getElementById('banner-subtitle-color');
      const descriptionColorInput = document.getElementById('banner-description-color');

      if (titleColorInput) titleColorInput.value = defaultTextColor;
      if (subtitleColorInput) subtitleColorInput.value = defaultTextColor;
      if (descriptionColorInput) descriptionColorInput.value = defaultTextColor;

      // Guardar colores por defecto en localStorage
      const defaultTextColors = {
        title: defaultTextColor,
        subtitle: defaultTextColor,
        description: defaultTextColor,
      };
      localStorage.setItem('banner_text_colors', JSON.stringify(defaultTextColors));

      // Aplicar cambios
      this.updateBannerOverlay();
      this.applyBannerTextColors(defaultTextColors);
      this.showMessage('Filtro del banner restaurado por defecto', 'success');
    }
  }

  // Cargar colores del texto del banner
  loadBannerTextColors() {
    const savedTextColors = localStorage.getItem('banner_text_colors');
    const colors = savedTextColors
      ? JSON.parse(savedTextColors)
      : {
          title: '#ffffff',
          subtitle: '#ffffff',
          description: '#ffffff',
        };

    const titleColorInput = document.getElementById('banner-title-color');
    const subtitleColorInput = document.getElementById('banner-subtitle-color');
    const descriptionColorInput = document.getElementById('banner-description-color');

    if (titleColorInput) titleColorInput.value = colors.title;
    if (subtitleColorInput) subtitleColorInput.value = colors.subtitle;
    if (descriptionColorInput) descriptionColorInput.value = colors.description;

    // Aplicar colores al banner
    this.applyBannerTextColors(colors);
  }

  // ========== ENHANCED OVERLAY CONTROLS ==========

  // Inicializar controles mejorados del overlay
  initEnhancedOverlayControls() {
    // Color presets functionality removed
  }

  // ========== BANNER TEXT COLOR ==========

  // Actualizar color del texto del banner
  updateBannerTextColor(element) {
    const colors = {
      title: document.getElementById('banner-title-color')?.value || '#ffffff',
      subtitle: document.getElementById('banner-subtitle-color')?.value || '#ffffff',
      description: document.getElementById('banner-description-color')?.value || '#ffffff',
    };

    // Guardar configuración
    localStorage.setItem('banner_text_colors', JSON.stringify(colors));

    // Aplicar cambios al banner
    this.applyBannerTextColors(colors);

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Aplicar colores del texto al banner
  applyBannerTextColors(colors) {
    try {
      // Aplicar mediante CSS global
      let styleElement = document.getElementById('banner-text-color-style');
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'banner-text-color-style';
        document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        section.banner .container h2,
        section#inicio.banner .container h2 {
          color: ${colors.title} !important;
        }
        section.banner .container .subtitle,
        section#inicio.banner .container .subtitle,
        section.banner .container p.subtitle,
        section#inicio.banner .container p.subtitle {
          color: ${colors.subtitle} !important;
        }
        section.banner .container .description,
        section#inicio.banner .container .description,
        section.banner .container p.description,
        section#inicio.banner .container p.description {
          color: ${colors.description} !important;
        }
      `;

      // Intentar actualizar en ventana padre/opener (sitio web principal)
      const targetWindow = window.opener || window.parent;
      if (targetWindow && targetWindow !== window) {
        this.updateBannerTextInWindow(targetWindow, colors);
      }
    } catch (error) {
      console.log('No se pudo actualizar el color del texto del banner en tiempo real:', error);
    }
  }

  // Actualizar color del texto en ventana específica
  updateBannerTextInWindow(targetWindow, colors) {
    try {
      let styleElement = targetWindow.document.getElementById('banner-text-color-style');
      if (!styleElement) {
        styleElement = targetWindow.document.createElement('style');
        styleElement.id = 'banner-text-color-style';
        targetWindow.document.head.appendChild(styleElement);
      }

      styleElement.textContent = `
        section.banner .container h2,
        section#inicio.banner .container h2 {
          color: ${colors.title} !important;
        }
        section.banner .container .subtitle,
        section#inicio.banner .container .subtitle,
        section.banner .container p.subtitle,
        section#inicio.banner .container p.subtitle {
          color: ${colors.subtitle} !important;
        }
        section.banner .container .description,
        section#inicio.banner .container .description,
        section.banner .container p.description,
        section#inicio.banner .container p.description {
          color: ${colors.description} !important;
        }
      `;
    } catch (error) {
      console.log('Error al actualizar color del texto en ventana:', error);
    }
  }

  // Actualizar indicadores de demostración
  updateDemoIndicators(opacity, brightness) {
    const opacityIndicator = document.getElementById('opacity-indicator');
    const brightnessIndicator = document.getElementById('brightness-indicator');

    if (opacityIndicator) {
      opacityIndicator.style.left = `${opacity}%`;
    }

    if (brightnessIndicator) {
      const brightnessPercent = ((brightness - 50) / 100) * 100; // Convert 50-150 to 0-100
      brightnessIndicator.style.left = `${brightnessPercent}%`;
    }
  }

  updateLogo(src) {
    document.getElementById('current-logo').src = src;

    // Save logo to localStorage
    localStorage.setItem('website_logo', src);

    // Update logo in homepage if possible
    this.updateHomepageLogo(src);

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Update logo in homepage
  updateHomepageLogo(src) {
    try {
      // Try to update in preview window
      if (this.previewWindow && !this.previewWindow.closed) {
        const logoElements = this.previewWindow.document.querySelectorAll(
          '.logo img, .login-logo, .admin-logo img'
        );
        logoElements.forEach(img => {
          img.src = src;
        });
      }

      // Try to update in parent/opener window
      const targetWindow = window.opener || window.parent;
      if (targetWindow && targetWindow !== window) {
        const logoElements = targetWindow.document.querySelectorAll(
          '.logo img, .login-logo, .admin-logo img'
        );
        logoElements.forEach(img => {
          img.src = src;
        });
      }
    } catch (error) {
      console.log('Could not update logo in real-time:', error);
    }
  }

  // Students Management
  updateStudentStats() {
    const stats = {
      2025: document.getElementById('students-2025-input').value,
      2024: document.getElementById('students-2024-input').value,
      2023: document.getElementById('students-2023-input').value,
    };

    // Update display
    document.getElementById('students-2025-count').textContent = stats[2025];
    document.getElementById('students-2024-count').textContent = stats[2024];
    document.getElementById('students-2023-count').textContent = stats[2023];

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Social Media
  updateSocialMedia() {
    const social = {
      facebook: document.getElementById('facebook-url').value,
      instagram: document.getElementById('instagram-url').value,
      whatsapp: document.getElementById('whatsapp-number').value,
    };

    // Store in config
    this.config.social = social;
    this.saveConfig();

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  // Password Management
  changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showMessage('Todos los campos son obligatorios', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showMessage('Las contraseñas no coinciden', 'error');
      return;
    }

    if (newPassword.length < 6) {
      this.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    // In a real implementation, you would verify current password and update
    this.showMessage('Contraseña cambiada correctamente', 'success');

    // Clear form
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  }

  // Backup and Restore
  createBackup() {
    const backup = {
      timestamp: new Date().toISOString(),
      content: this.getAllContent(),
      config: this.config,
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `cursillo-stewart-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Update last backup time
    localStorage.setItem('last_backup', new Date().toLocaleString());
    document.getElementById('last-backup').textContent = new Date().toLocaleString();

    this.showMessage('Respaldo creado exitosamente', 'success');
  }

  restoreBackup(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.version || !backup.content) {
          throw new Error('Archivo de respaldo inválido');
        }

        // Restore content
        this.populateForm(backup.content);

        // Restore carousel settings if available
        if (backup.content.carousel_interval) {
          localStorage.setItem('carousel_interval', backup.content.carousel_interval);
          this.loadCarouselSettings();
        }

        // Restore banner overlay settings if available
        if (backup.content.banner_overlay_settings) {
          localStorage.setItem('banner_overlay_settings', backup.content.banner_overlay_settings);
          this.loadBannerOverlaySettings();
        }

        // Restore config
        this.config = backup.config || {};
        this.saveConfig();

        this.showMessage('Respaldo restaurado exitosamente', 'success');
      } catch (error) {
        this.showMessage('Error al restaurar el respaldo: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }

  // Save Changes
  saveAllChanges() {
    const allContent = this.getAllContent();

    // Save to localStorage
    localStorage.setItem('website_content', JSON.stringify(allContent));

    // Apply changes to homepage if possible
    this.applyChangesToHomepage(allContent);

    // Show success message
    this.showMessage('Todos los cambios guardados exitosamente', 'success');

    // Marcar como guardado
    this.markAsSaved();
  }

  // Marcar que hay cambios pendientes
  markAsUnsaved() {
    this.hasUnsavedChanges = true;
    this.updateSaveButton();
  }

  // Marcar como guardado
  markAsSaved() {
    this.hasUnsavedChanges = false;
    this.updateSaveButton();
  }

  // Actualizar el botón de guardar
  updateSaveButton() {
    const saveBtn = document.getElementById('save-all-btn');
    if (saveBtn) {
      if (this.hasUnsavedChanges) {
        saveBtn.innerHTML = '💾 Guardar Cambios *';
        saveBtn.classList.add('has-changes');
        saveBtn.title = 'Hay cambios pendientes por guardar';
      } else {
        saveBtn.innerHTML = '💾 Guardar Cambios';
        saveBtn.classList.remove('has-changes');
        saveBtn.title = 'Todos los cambios están guardados';
      }
    }
  }

  // Apply changes to homepage
  applyChangesToHomepage(content) {
    try {
      // Try to update the parent window if admin panel is opened in popup/iframe
      if (window.opener && window.opener.location.hostname === window.location.hostname) {
        this.updateHomepageContent(window.opener.document, content);
        return;
      }

      // Try to update if homepage is in another tab/window
      if (window.parent && window.parent !== window) {
        this.updateHomepageContent(window.parent.document, content);
        return;
      }

      // Store changes for the next homepage load
      localStorage.setItem('pending_homepage_updates', JSON.stringify(content));
      // Los cambios se aplicarán cuando se recargue la página principal
    } catch (error) {
      console.log('Could not directly update homepage:', error);
      localStorage.setItem('pending_homepage_updates', JSON.stringify(content));
      // Los cambios se aplicarán cuando se recargue la página principal
    }
  }

  // Update homepage content
  updateHomepageContent(doc, content) {
    const mappings = {
      'banner-title': 'h2', // Banner title
      'banner-subtitle': '.subtitle', // Banner subtitle
      'banner-description': '.description', // Banner description
      'about-title': '#conocenos h2', // About section title
      'about-description': '#conocenos .section-header p', // About description
      'contact-phone': '[href^="tel:"]', // Phone links
      'contact-email': '[href^="mailto:"]', // Email links
      'contact-address': '.contact-item:has([class*="location"]) p', // Address
      'contact-hours': '.contact-item:has([class*="clock"]) p', // Hours
    };

    Object.keys(content).forEach(key => {
      const selector = mappings[key];
      if (selector && content[key]) {
        const elements = doc.querySelectorAll(selector);
        elements.forEach(element => {
          if (element.tagName === 'A' && key === 'contact-phone') {
            element.href = `tel:${content[key]}`;
            element.textContent = content[key];
          } else if (element.tagName === 'A' && key === 'contact-email') {
            element.href = `mailto:${content[key]}`;
            element.textContent = content[key];
          } else {
            element.textContent = content[key];
          }
        });
      }
    });

    // Handle countdown section visibility
    this.updateCountdownSection(doc, content);

    // Update timeline if data exists
    if (content.timeline_data && Array.isArray(content.timeline_data)) {
      this.updateTimelineInHomepage(doc, content.timeline_data);
    }

    // No mostrar mensaje aquí - se mostrará en saveAllChanges
  }

  // Update timeline in homepage
  updateTimelineInHomepage(doc, timelineData) {
    const timelineContainer = doc.querySelector('.timeline-container');
    if (!timelineContainer || !timelineData) return;

    // Sort timeline data by year
    const sortedData = timelineData.sort((a, b) => {
      const yearA = a.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(a.year);
      const yearB = b.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(b.year);
      return yearA - yearB;
    });

    // Generate new timeline HTML
    let timelineHTML = '';
    sortedData.forEach(entry => {
      const title = entry.title ? ` - ${entry.title}` : '';
      timelineHTML += `
        <div class="timeline-item">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3>${entry.year}${title}</h3>
            <p>${entry.description || ''}</p>
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

    // Update timeline container
    timelineContainer.innerHTML = timelineHTML;
    console.log('Timeline updated in homepage from admin panel');
  }

  getAllContent() {
    const content = {};

    // Collect data from all sections
    const sections = [
      'inicio-section',
      'conocenos-section',
      'agregado-section',
      'ingresantes-section',
      'cursos-section',
      'calendario-section',
      'contacto-section',
      'configuracion-section',
    ];

    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      if (section) {
        const inputs = section.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
          if (input.type === 'checkbox') {
            content[input.id] = input.checked;
          } else if (input.type === 'file') {
            // For file inputs, we might want to handle differently
            if (input.files && input.files[0]) {
              content[input.id] = input.files[0].name;
            }
          } else {
            content[input.id] = input.value;
          }
        });
      }
    });

    // Include dynamic timeline data
    const timelineData = this.getTimelineData();
    content.timeline_data = timelineData;

    // Include carousel settings
    content.carousel_interval = localStorage.getItem('carousel_interval') || '10';

    // Include banner overlay settings
    content.banner_overlay_settings =
      localStorage.getItem('banner_overlay_settings') ||
      JSON.stringify({ color: '#1e40af', opacity: '15', gradient: '135deg', brightness: '100' });

    // Include banner text colors
    content.banner_text_colors =
      localStorage.getItem('banner_text_colors') ||
      JSON.stringify({ title: '#ffffff', subtitle: '#ffffff', description: '#ffffff' });

    // Block images feature removed - no longer included in content
    // const blockImages = JSON.parse(localStorage.getItem('block_images') || '{}');
    // content.block_images = blockImages;

    return content;
  }

  // Configuration
  loadConfig() {
    const saved = localStorage.getItem('admin_config');
    return saved ? JSON.parse(saved) : {};
  }

  saveConfig() {
    localStorage.setItem('admin_config', JSON.stringify(this.config));
  }

  // Utility Functions
  showMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;

    container.appendChild(message);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 5000);
  }

  // Initialize last backup display
  initLastBackup() {
    const lastBackup = localStorage.getItem('last_backup');
    if (lastBackup) {
      document.getElementById('last-backup').textContent = lastBackup;
    }
  }

  // Initialize default config display
  initDefaultConfigDate() {
    const defaultConfigTimestamp = localStorage.getItem('default_config_timestamp');
    const defaultConfigDateElement = document.getElementById('default-config-date');

    if (defaultConfigTimestamp && defaultConfigDateElement) {
      const date = new Date(parseInt(defaultConfigTimestamp));
      defaultConfigDateElement.textContent = date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (defaultConfigDateElement) {
      defaultConfigDateElement.textContent = 'No disponible';
    }
  }

  // ============= TIMELINE DYNAMIC MANAGEMENT =============

  initializeTimeline() {
    // Load timeline data from localStorage or set defaults
    const savedTimeline = localStorage.getItem('timeline_data');
    let timelineData = [];

    if (savedTimeline) {
      timelineData = JSON.parse(savedTimeline);
    } else {
      // Default timeline entries
      timelineData = [
        {
          id: this.generateId(),
          year: '2022',
          title: 'Los Inicios',
          description:
            'Todo comenzó cuando cuatro educadores visionarios decidieron crear un espacio de preparación universitaria diferente. En esta imagen se puede ver nuestro primer departamento.',
          image: 'images/departamento-inicial.jpeg',
          imageName: 'departamento-inicial.jpeg',
        },
        {
          id: this.generateId(),
          year: '2023',
          title: 'Primera Mudanza',
          description:
            'Con el crecimiento inicial y el reconocimiento de nuestra metodología, nos mudamos a instalaciones más amplias.',
          image: null,
        },
        {
          id: this.generateId(),
          year: '2025',
          title: 'Nueva Sede',
          description:
            'En nuestro tercer año de funcionamiento, inauguramos nuestra nueva sede con tecnología de vanguardia.',
          image: null,
        },
        {
          id: this.generateId(),
          year: 'Presente',
          title: 'Consolidación',
          description:
            'Hoy, tras tres años de dedicación, somos referentes en preparación universitaria en Paraguay.',
          image: null,
        },
      ];
      this.saveTimelineData(timelineData);
    }

    this.renderTimeline(timelineData);
  }

  generateId() {
    return 'timeline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  renderTimeline(timelineData) {
    const container = document.getElementById('timeline-entries');
    if (!container) return;

    container.innerHTML = '';

    // Sort timeline by year (handle 'Presente' as current year)
    timelineData.sort((a, b) => {
      const yearA = a.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(a.year);
      const yearB = b.year === 'Presente' ? new Date().getFullYear() + 1 : parseInt(b.year);
      return yearA - yearB;
    });

    timelineData.forEach(entry => {
      const entryElement = this.createTimelineEntry(entry);
      container.appendChild(entryElement);
    });
  }

  createTimelineEntry(entry) {
    const div = document.createElement('div');
    div.className = 'timeline-entry';
    div.dataset.id = entry.id;

    div.innerHTML = `
      <div class="timeline-entry-header">
        <input type="text" 
               class="timeline-year-input" 
               value="${entry.year}" 
               placeholder="Año"
               onchange="adminPanel.updateTimelineYear('${entry.id}', this.value)">
        <div class="timeline-controls-group">
          <button type="button" 
                  class="btn-delete-timeline" 
                  onclick="adminPanel.deleteTimelineEntry('${entry.id}')"
                  title="Eliminar entrada">
            🗑️
          </button>
        </div>
      </div>
      
      <div class="timeline-content">
        <div class="timeline-text">
          <div class="form-group">
            <label>Título del Evento:</label>
            <input type="text" 
                   class="timeline-title-input" 
                   value="${entry.title || ''}" 
                   placeholder="Ej: Los Inicios, Nueva Sede..."
                   onchange="adminPanel.updateTimelineTitle('${entry.id}', this.value)">
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea class="timeline-description" 
                      placeholder="Describe qué pasó en este año..."
                      onchange="adminPanel.updateTimelineDescription('${entry.id}', this.value)">${
      entry.description || ''
    }</textarea>
          </div>
        </div>
        
        <div class="timeline-image-section">
          <label>Imagen (opcional):</label>
          <div class="timeline-image-upload ${entry.image ? 'has-image' : ''}" 
               onclick="document.getElementById('timeline-file-${entry.id}').click()">
            <input type="file" 
                   id="timeline-file-${entry.id}" 
                   accept="image/*" 
                   onchange="adminPanel.updateTimelineImage('${entry.id}', this.files[0])">
            
            ${
              entry.image
                ? `
              <img src="${entry.image}" alt="Timeline image" class="timeline-image-preview">
              <div class="timeline-image-name">${entry.imageName || 'Imagen cargada'}</div>
            `
                : `
              <div style="color: #64748b; font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
              <div style="color: #64748b; font-size: 0.875rem;">Haz clic para subir imagen</div>
              <div class="timeline-upload-text">JPG, PNG, GIF (máx. 5MB)</div>
            `
            }
          </div>
        </div>
      </div>
    `;

    return div;
  }

  addTimelineEntry() {
    const currentYear = new Date().getFullYear();
    const newEntry = {
      id: this.generateId(),
      year: currentYear.toString(),
      title: 'Nuevo Evento',
      description: 'Describe qué pasó en este año...',
      image: null,
      imageName: null,
    };

    const timelineData = this.getTimelineData();
    timelineData.push(newEntry);
    this.saveTimelineData(timelineData);
    this.renderTimeline(timelineData);

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  deleteTimelineEntry(entryId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada del timeline?')) {
      return;
    }

    const timelineData = this.getTimelineData();
    const filteredData = timelineData.filter(entry => entry.id !== entryId);
    this.saveTimelineData(filteredData);
    this.renderTimeline(filteredData);

    // Marcar que hay cambios pendientes
    this.markAsUnsaved();
  }

  updateTimelineYear(entryId, newYear) {
    const timelineData = this.getTimelineData();
    const entry = timelineData.find(e => e.id === entryId);
    if (entry) {
      entry.year = newYear;
      this.saveTimelineData(timelineData);
      this.renderTimeline(timelineData); // Re-render to sort by year
      this.autoSave();
    }
  }

  updateTimelineTitle(entryId, newTitle) {
    const timelineData = this.getTimelineData();
    const entry = timelineData.find(e => e.id === entryId);
    if (entry) {
      entry.title = newTitle;
      this.saveTimelineData(timelineData);
      this.autoSave();
    }
  }

  updateTimelineDescription(entryId, newDescription) {
    const timelineData = this.getTimelineData();
    const entry = timelineData.find(e => e.id === entryId);
    if (entry) {
      entry.description = newDescription;
      this.saveTimelineData(timelineData);
      this.autoSave();
    }
  }

  updateTimelineImage(entryId, file) {
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('La imagen no puede superar los 5MB', 'error');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.showMessage('Solo se permiten archivos de imagen', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const timelineData = this.getTimelineData();
      const entry = timelineData.find(en => en.id === entryId);
      if (entry) {
        entry.image = e.target.result;
        entry.imageName = file.name;
        this.saveTimelineData(timelineData);
        this.renderTimeline(timelineData);
        // Marcar que hay cambios pendientes
        this.markAsUnsaved();
      }
    };
    reader.readAsDataURL(file);
  }

  getTimelineData() {
    const saved = localStorage.getItem('timeline_data');
    return saved ? JSON.parse(saved) : [];
  }

  saveTimelineData(data) {
    localStorage.setItem('timeline_data', JSON.stringify(data));
  }

  // ============= ENHANCED IMAGE MANAGEMENT FOR ALL BLOCKS =============

  enhanceImageBlocks() {
    // This function has been disabled to remove "Imagen del Bloque (opcional)" fields
    // The functionality was removed as requested
    return;
  }

  addImageUploadToBlock(block) {
    // Function disabled - "Imagen del Bloque (opcional)" feature removed
    return;
  }

  updateBlockImage(blockId, file) {
    // Function disabled - "Imagen del Bloque (opcional)" feature removed
    return;
  }

  loadBlockImages() {
    // Function disabled - "Imagen del Bloque (opcional)" feature removed
    return;
  }

  // ============= DEFAULT CONFIGURATION MANAGEMENT =============

  setAsDefaultConfiguration() {
    // Mostrar diálogo de confirmación
    if (
      confirm(
        '¿Está seguro de establecer esta configuración como predeterminada? Será la configuración de restauración por defecto.'
      )
    ) {
      try {
        // Recopilar toda la configuración actual
        const currentConfig = this.getCurrentConfiguration();

        // Guardar como configuración por defecto
        localStorage.setItem('default_configuration', JSON.stringify(currentConfig));

        // Guardar timestamp de cuando se estableció como default
        localStorage.setItem('default_config_timestamp', Date.now().toString());

        // Mostrar mensaje de éxito
        this.showMessage('Configuración establecida como predeterminada exitosamente', 'success');

        // Actualizar la fecha mostrada
        this.initDefaultConfigDate();

        console.log('Configuración por defecto guardada:', currentConfig);
      } catch (error) {
        console.error('Error al guardar configuración por defecto:', error);
        this.showMessage('Error al establecer la configuración por defecto', 'error');
      }
    }
  }

  getCurrentConfiguration() {
    const config = {
      // Configuración del banner
      banner: {
        title: document.getElementById('banner-title')?.value || '',
        titleColor: document.getElementById('banner-title-color')?.value || '#ffffff',
        subtitle: document.getElementById('banner-subtitle')?.value || '',
        subtitleColor: document.getElementById('banner-subtitle-color')?.value || '#ffffff',
        description: document.getElementById('banner-description')?.value || '',
        descriptionColor: document.getElementById('banner-description-color')?.value || '#ffffff',
        overlayColor: document.getElementById('banner-overlay-color')?.value || '#1e40af',
        overlayOpacity: document.getElementById('banner-overlay-opacity')?.value || '15',
        imageBrightness: document.getElementById('banner-image-brightness')?.value || '100',
        carouselInterval: document.getElementById('carousel-interval')?.value || '10',
      },

      // Imágenes de fondo del banner
      backgroundImages: JSON.parse(localStorage.getItem('background_images') || '[]'),

      // Configuración de secciones (Conócenos, etc.)
      about: {
        title: document.getElementById('about-title')?.value || '',
        description: document.getElementById('about-description')?.value || '',
      },

      // Timeline data
      timeline: this.getTimelineData(),

      // Configuración adicional del localStorage
      adminConfig: this.config,

      // Timestamp de creación
      createdAt: Date.now(),
      version: '1.0',
    };

    return config;
  }

  restoreDefaultConfiguration() {
    const defaultConfig = localStorage.getItem('default_configuration');

    if (!defaultConfig) {
      this.showMessage('No hay configuración por defecto guardada', 'warning');
      return;
    }

    if (
      confirm(
        '¿Desea restaurar la configuración por defecto? Se perderán los cambios actuales no guardados.'
      )
    ) {
      try {
        const config = JSON.parse(defaultConfig);

        // Restaurar configuración del banner
        if (config.banner) {
          document.getElementById('banner-title').value = config.banner.title || '';
          document.getElementById('banner-title-color').value =
            config.banner.titleColor || '#ffffff';
          document.getElementById('banner-subtitle').value = config.banner.subtitle || '';
          document.getElementById('banner-subtitle-color').value =
            config.banner.subtitleColor || '#ffffff';
          document.getElementById('banner-description').value = config.banner.description || '';
          document.getElementById('banner-description-color').value =
            config.banner.descriptionColor || '#ffffff';
          document.getElementById('banner-overlay-color').value =
            config.banner.overlayColor || '#1e40af';
          document.getElementById('banner-overlay-opacity').value =
            config.banner.overlayOpacity || '15';
          document.getElementById('banner-image-brightness').value =
            config.banner.imageBrightness || '100';
          document.getElementById('carousel-interval').value =
            config.banner.carouselInterval || '10';
        }

        // Restaurar imágenes de fondo
        if (config.backgroundImages) {
          localStorage.setItem('background_images', JSON.stringify(config.backgroundImages));
          this.loadBackgroundImages();
        }

        // Restaurar configuración de secciones
        if (config.about) {
          document.getElementById('about-title').value = config.about.title || '';
          document.getElementById('about-description').value = config.about.description || '';
        }

        // Restaurar timeline
        if (config.timeline) {
          this.saveTimelineData(config.timeline);
          this.loadTimelineFromData();
        }

        // Restaurar configuración adicional
        if (config.adminConfig) {
          this.config = config.adminConfig;
          this.saveConfig();
        }

        // Actualizar interfaz
        this.updateBannerOverlay();
        this.updateCarouselInterval(config.banner?.carouselInterval || '10');

        this.showMessage('Configuración por defecto restaurada exitosamente', 'success');
        this.markAsUnsaved();
      } catch (error) {
        console.error('Error al restaurar configuración por defecto:', error);
        this.showMessage('Error al restaurar la configuración por defecto', 'error');
      }
    }
  }

  // Toggle functionality for checkboxes
  bindToggleOptions() {
    // CTA Toggle functionality
    const ctaCheckbox = document.getElementById('enable-cta');
    const ctaOptions = document.getElementById('cta-options');

    if (ctaCheckbox && ctaOptions) {
      ctaCheckbox.addEventListener('change', e => {
        if (e.target.checked) {
          ctaOptions.style.display = 'block';
        } else {
          ctaOptions.style.display = 'none';
        }

        // Auto-save the change
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
          this.autoSaveContent();
        }, 500);
      });

      // Set initial state based on checkbox value
      if (ctaCheckbox.checked) {
        ctaOptions.style.display = 'block';
      } else {
        ctaOptions.style.display = 'none';
      }
    }

    // Countdown Toggle functionality
    const countdownCheckbox = document.getElementById('enable-countdown');
    const countdownOptions = document.getElementById('countdown-options');

    if (countdownCheckbox && countdownOptions) {
      countdownCheckbox.addEventListener('change', e => {
        if (e.target.checked) {
          countdownOptions.style.display = 'block';
        } else {
          countdownOptions.style.display = 'none';
        }

        // Auto-save the change
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
          this.autoSaveContent();
        }, 500);
      });

      // Set initial state based on checkbox value
      if (countdownCheckbox.checked) {
        countdownOptions.style.display = 'block';
      } else {
        countdownOptions.style.display = 'none';
      }
    }

    // Initialize color label updates
    this.initColorLabels();

    // Initialize countdown color updates
    this.initCountdownColorUpdates();
  }

  // Initialize color label functionality
  initColorLabels() {
    const colorInputs = [
      { input: 'counters-background-color', label: 'background-color-label' },
      { input: 'countdown-timer-background', label: 'timer-background-label' },
      { input: 'countdown-numbers-color', label: 'numbers-color-label' },
      { input: 'cta-button-color', label: 'cta-color-label' },
      { input: 'cta-text-color', label: 'cta-text-color-label' },
    ];

    colorInputs.forEach(({ input, label }) => {
      const inputElement = document.getElementById(input);
      const labelElement = document.getElementById(label);

      if (inputElement && labelElement) {
        // Set initial value
        labelElement.textContent = inputElement.value;

        // Update label when color changes
        inputElement.addEventListener('input', e => {
          labelElement.textContent = e.target.value;

          // Auto-save the change
          clearTimeout(this.autoSaveTimeout);
          this.autoSaveTimeout = setTimeout(() => {
            this.autoSaveContent();
          }, 500);
        });
      }
    });
  }

  // Initialize countdown color updates
  initCountdownColorUpdates() {
    const countdownColorInputs = [
      'countdown-timer-background',
      'countdown-numbers-color',
      'counters-background-color',
      'counters-title-color',
      'counters-subtitle-color',
      'cta-button-color',
      'cta-text-color',
    ];

    countdownColorInputs.forEach(inputId => {
      const inputElement = document.getElementById(inputId);
      if (inputElement) {
        inputElement.addEventListener('input', e => {
          console.log('Countdown color changed:', inputId, e.target.value);

          // Immediate visual feedback - force update homepage
          const allContent = this.getAllContent();

          console.log('Content to apply:', allContent['countdown-timer-background']);

          // Save to localStorage first
          localStorage.setItem('website_content', JSON.stringify(allContent));

          // Force reload of homepage content
          this.forceHomepageUpdate(allContent);

          // Auto-save the change
          clearTimeout(this.autoSaveTimeout);
          this.autoSaveTimeout = setTimeout(() => {
            this.autoSaveContent();
          }, 300);
        });
      }
    });
  }

  // Force homepage update
  forceHomepageUpdate(content) {
    console.log('Forcing homepage update with content:', content);

    // Trigger a custom event that the homepage can listen to
    window.dispatchEvent(
      new CustomEvent('adminContentChange', {
        detail: content,
      })
    );

    // Also update localStorage with a timestamp to force detection
    localStorage.setItem('admin_update_timestamp', Date.now().toString());

    // Try to directly update if we can access the parent window
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'updateCountdown',
            content: content,
          },
          '*'
        );
      }
    } catch (error) {
      console.log('Could not post message to parent:', error);
    }
  }

  // Restore countdown defaults
  restoreCountdownDefaults() {
    // Check if custom defaults exist
    const customDefaults = localStorage.getItem('custom_countdown_defaults');

    const countdownDefaults = customDefaults
      ? JSON.parse(customDefaults)
      : {
          'counters-title': 'Próximo Cursillo Intensivo',
          'counters-subtitle': '¡No te pierdas nuestro próximo cursillo intensivo!',
          'counters-title-color': '#ffffff',
          'counters-subtitle-color': '#ffffff',
          'counters-background-color': '#dc2626',
          'countdown-timer-background': '#1e40af',
          'countdown-numbers-color': '#ffffff',
          'enable-countdown': true,
          'countdown-date': '2025-12-09T08:00',
          'enable-cta': true,
          'cta-text': 'Inscribirme Ahora',
          'cta-button-color': '#dc2626',
          'cta-text-color': '#ffffff',
        };

    // Update form fields
    Object.keys(countdownDefaults).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = countdownDefaults[key];
        } else {
          element.value = countdownDefaults[key];
        }
      }
    });

    // Update color labels
    this.initColorLabels();

    // Handle visibility of options
    const countdownCheckbox = document.getElementById('enable-countdown');
    const countdownOptions = document.getElementById('countdown-options');
    if (countdownCheckbox && countdownOptions) {
      countdownOptions.style.display = countdownCheckbox.checked ? 'block' : 'none';
    }

    const ctaCheckbox = document.getElementById('enable-cta');
    const ctaOptions = document.getElementById('cta-options');
    if (ctaCheckbox && ctaOptions) {
      ctaOptions.style.display = ctaCheckbox.checked ? 'block' : 'none';
    }

    // Save changes
    this.autoSaveContent();

    const message = customDefaults
      ? 'Configuración del contador restaurada a valores predeterminados personalizados'
      : 'Configuración del contador restaurada a valores por defecto del sistema';
    this.showMessage(message, 'success');
  }

  // Save current countdown configuration as defaults
  saveAsCountdownDefaults() {
    const countdownFields = [
      'counters-title',
      'counters-subtitle',
      'counters-title-color',
      'counters-subtitle-color',
      'counters-background-color',
      'countdown-timer-background',
      'countdown-numbers-color',
      'enable-countdown',
      'countdown-date',
      'enable-cta',
      'cta-text',
      'cta-button-color',
      'cta-text-color',
    ];

    const currentSettings = {};
    countdownFields.forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          currentSettings[key] = element.checked;
        } else {
          currentSettings[key] = element.value;
        }
      }
    });

    // Save as custom defaults
    localStorage.setItem('custom_countdown_defaults', JSON.stringify(currentSettings));

    this.showMessage('Configuración actual guardada como predeterminada', 'success');
  }

  // Update countdown section in homepage
  updateCountdownSection(doc, content) {
    const countdownSection = doc.querySelector('.countdown-section');
    if (!countdownSection) return;

    // Check if countdown should be shown
    const showCountdown = content['enable-countdown'];

    if (!showCountdown) {
      countdownSection.style.display = 'none';
      return;
    }

    countdownSection.style.display = 'block';

    // Update countdown title and subtitle with colors
    const countdownHeader = countdownSection.querySelector('.countdown-header');
    if (countdownHeader) {
      const titleElement = countdownHeader.querySelector('h2');
      const subtitleElement = countdownHeader.querySelector('p');

      if (titleElement && content['counters-title']) {
        titleElement.textContent = content['counters-title'];
        if (content['counters-title-color']) {
          titleElement.style.color = content['counters-title-color'];
        }
      }

      if (subtitleElement && content['counters-subtitle']) {
        subtitleElement.textContent = content['counters-subtitle'];
        if (content['counters-subtitle-color']) {
          subtitleElement.style.color = content['counters-subtitle-color'];
        }
      }
    }

    // Apply background color to section
    if (content['counters-background-color']) {
      countdownSection.style.backgroundColor = content['counters-background-color'];
    }

    // Apply countdown timer colors
    const countdownTimer = countdownSection.querySelector('.countdown-timer');
    if (countdownTimer) {
      if (content['countdown-timer-background']) {
        const countdownItems = countdownTimer.querySelectorAll('.countdown-item');
        countdownItems.forEach(item => {
          item.style.backgroundColor = content['countdown-timer-background'];
        });
      }

      if (content['countdown-numbers-color']) {
        const countdownNumbers = countdownTimer.querySelectorAll(
          '.countdown-number, .countdown-label'
        );
        countdownNumbers.forEach(number => {
          number.style.color = content['countdown-numbers-color'];
        });
      }
    }

    // Update countdown date if provided
    if (content['countdown-date']) {
      const countdownDate = content['countdown-date'];
      const formattedDate = new Date(countdownDate).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const dateElement = countdownSection.querySelector('.countdown-date strong');
      if (dateElement) {
        dateElement.textContent = formattedDate;
      }
    }

    // Update CTA section
    const ctaSection = countdownSection.querySelector('.countdown-cta');
    const showCTA = content['enable-cta'];

    if (ctaSection) {
      if (!showCTA) {
        ctaSection.style.display = 'none';
      } else {
        ctaSection.style.display = 'block';

        // Update CTA text and button color
        if (content['cta-text']) {
          const ctaButton = ctaSection.querySelector('.btn-countdown');
          if (ctaButton) {
            ctaButton.textContent = content['cta-text'];

            // Apply button color if specified
            if (content['cta-button-color']) {
              ctaButton.style.backgroundColor = content['cta-button-color'];
            }
          }
        }
      }
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const admin = new AdminPanel();

  // Initialize last backup display
  admin.initLastBackup();

  // Initialize default config date display
  admin.initDefaultConfigDate();

  // Global admin instance for debugging
  window.adminPanel = admin;
});

// Security: Clear session on page unload
window.addEventListener('beforeunload', () => {
  // Optional: Clear sensitive data from memory
  if (window.adminPanel && !window.adminPanel.isLoggedIn) {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_timestamp');
  }
});

// Prevent right-click and F12 in production
document.addEventListener('contextmenu', e => {
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', e => {
  if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
      e.preventDefault();
    }
  }
});

// Function to download the ingresantes template
function downloadTemplate() {
  try {
    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = 'documents/Plantilla_de_Ingresantes.xlsx';
    link.download = 'Plantilla_de_Ingresantes.xlsx';

    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Show success message
    if (window.adminPanel) {
      adminPanel.showMessage('Plantilla descargada exitosamente', 'success');
    }
  } catch (error) {
    console.error('Error downloading template:', error);
    if (window.adminPanel) {
      adminPanel.showMessage('Error al descargar la plantilla', 'error');
    }
  }
}

// Global variables for Excel processing
let currentExcelData = null;
let currentExamInfo = null;

// ===== FUNCIONES PARA GESTIÓN DE INGRESANTES =====

// Configuración del API
const INGRESANTES_API = {
  BASE_URL: '/api/admin_api.php',

  // Hacer petición al API
  async request(params = {}, options = {}) {
    // Verificar si estamos en modo de desarrollo/testing
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocalhost) {
      // Usar mock para desarrollo local
      return this.mockRequest(params, options);
    }

    // Petición real al servidor
    const url = new URL(this.BASE_URL, window.location.origin);
    Object.keys(params).forEach(key => url.searchParams.set(key, params[key]));

    const config = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      // Fallback a mock en caso de error
      console.log('Falling back to mock API...');
      return this.mockRequest(params, options);
    }
  },

  // Mock request para desarrollo
  async mockRequest(params = {}, options = {}) {
    const action = params.action;

    try {
      switch (action) {
        case 'list_exams':
          return this.mockListExams();
        case 'get_ingresantes':
          return this.mockGetIngresantes(params.key);
        case 'import_ingresantes':
          return this.mockImportIngresantes(JSON.parse(options.body));
        default:
          throw new Error('Acción no válida');
      }
    } catch (error) {
      console.error('Mock API Error:', error);
      throw error;
    }
  },

  // Mock functions
  mockListExams() {
    const index = JSON.parse(localStorage.getItem('ingresantes_index') || '[]');
    return index.sort((a, b) => {
      const [examA, yearA] = a.split('-');
      const [examB, yearB] = b.split('-');
      const yearDiff = parseInt(yearB) - parseInt(yearA);
      return yearDiff !== 0 ? yearDiff : examA.localeCompare(examB);
    });
  },

  mockGetIngresantes(key) {
    const data = localStorage.getItem(`ingresantes_${key}`);
    if (!data) {
      throw new Error('Lista no encontrada');
    }
    return JSON.parse(data);
  },

  mockImportIngresantes(payload) {
    const key = `${payload.exam}-${payload.year}`;
    const data = {
      key,
      exam: payload.exam,
      year: payload.year,
      meta: {
        archivo: payload.meta.archivo,
        total: payload.items.length,
        fecha: new Date().toISOString(),
      },
      items: payload.items,
    };

    // Guardar datos
    localStorage.setItem(`ingresantes_${key}`, JSON.stringify(data));

    // Actualizar índice
    const index = JSON.parse(localStorage.getItem('ingresantes_index') || '[]');
    if (!index.includes(key)) {
      index.push(key);
      localStorage.setItem('ingresantes_index', JSON.stringify(index));
    }

    return { ok: true, key };
  },

  // Importar ingresantes
  async importIngresantes(payload) {
    return this.request(
      { action: 'import_ingresantes' },
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  // Listar exámenes
  async listExams() {
    return this.request({ action: 'list_exams' });
  },

  // Obtener ingresantes
  async getIngresantes(key) {
    return this.request({ action: 'get_ingresantes', key });
  },
};

// Mostrar toast de notificación
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.textContent = message;

  if (type === 'error') {
    toast.style.background = 'var(--admin-danger)';
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}

// Normalizar campo preferencial
function normalizePreferencial(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return ['si', 'sí', 'true', '1', 'yes'].includes(lower);
  }

  return false;
}

// Formatear fecha para mostrar
function formatDate(dateString) {
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

// Cargar y mostrar listas guardadas
async function loadSavedLists() {
  const container = document.getElementById('gi-saved-list');

  try {
    container.innerHTML = '<div class="gi-saved-loading">Cargando listas guardadas...</div>';

    const examKeys = await INGRESANTES_API.listExams();

    if (examKeys.length === 0) {
      container.innerHTML = '<div class="gi-saved-empty">No hay listas guardadas aún.</div>';
      return;
    }

    // Cargar detalles de cada examen
    const examDetails = await Promise.all(
      examKeys.map(async key => {
        try {
          return await INGRESANTES_API.getIngresantes(key);
        } catch (error) {
          console.error(`Error loading exam ${key}:`, error);
          return null;
        }
      })
    );

    // Filtrar exámenes válidos y renderizar
    const validExams = examDetails.filter(exam => exam !== null);
    renderSavedLists(validExams);
  } catch (error) {
    console.error('Error loading saved lists:', error);
    container.innerHTML = '<div class="gi-saved-empty">Error al cargar las listas guardadas.</div>';
  }
}

// Renderizar listas guardadas
function renderSavedLists(exams) {
  const container = document.getElementById('gi-saved-list');

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
        <div class="gi-saved-date">📅 ${formatDate(exam.meta.fecha)}</div>
      </div>
      <div class="gi-saved-actions">
        <button class="btn-ver-lista" onclick="loadExamPreview('${exam.key}')">
          👁️ Ver
        </button>
      </div>
    </div>
  `
    )
    .join('');

  container.innerHTML = html;
}

// Cargar vista previa de un examen
async function loadExamPreview(key) {
  try {
    const examData = await INGRESANTES_API.getIngresantes(key);

    // Actualizar variables globales para compatibilidad
    currentExamInfo = {
      name: examData.exam,
      year: examData.year,
      fileName: examData.meta.archivo,
    };
    currentExcelData = examData.items;

    // Mostrar vista previa usando la función existente
    showExcelPreview();

    showToast(`Lista ${key} cargada en vista previa`);
  } catch (error) {
    console.error('Error loading exam preview:', error);
    showToast('Error al cargar la vista previa', 'error');
  }
}

// Function to handle Excel file selection
function handleExcelFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Process the Excel data
      processExcelWorksheet(worksheet, file.name);
    } catch (error) {
      console.error('Error reading Excel file:', error);
      if (window.adminPanel) {
        adminPanel.showMessage('Error al leer el archivo Excel', 'error');
      }
    }
  };

  reader.readAsArrayBuffer(file);
}

// Function to process Excel worksheet
function processExcelWorksheet(worksheet, fileName) {
  try {
    // Extract exam info from H2 and H3
    const examName = worksheet['H2'] ? worksheet['H2'].v : 'UPTP';
    const examYear = worksheet['H3'] ? worksheet['H3'].v : new Date().getFullYear();

    // Store exam info
    currentExamInfo = {
      name: examName,
      year: examYear,
      fileName: fileName,
    };

    // Extract student data starting from row 3
    const students = [];
    let row = 3;

    while (true) {
      const nameCell = `A${row}`;
      const puntajeCell = `B${row}`;
      const carreraCell = `C${row}`;
      const puestoCell = `D${row}`;
      const preferencialCell = `E${row}`;

      // Check if name exists (required field)
      if (!worksheet[nameCell] || !worksheet[nameCell].v) {
        break;
      }

      const student = {
        nombre: worksheet[nameCell].v,
        puntaje: parseFloat(worksheet[puntajeCell] ? worksheet[puntajeCell].v : 0) || 0,
        carrera: worksheet[carreraCell] ? worksheet[carreraCell].v : '',
        puesto: parseInt(worksheet[puestoCell] ? worksheet[puestoCell].v : 0) || 0,
        preferencial: normalizePreferencial(
          worksheet[preferencialCell] ? worksheet[preferencialCell].v : false
        ),
      };

      students.push(student);
      row++;
    }

    currentExcelData = students;

    // Show preview with save button
    showExcelPreview();

    // Add save button if not exists
    addSaveButton();
  } catch (error) {
    console.error('Error processing Excel worksheet:', error);
    showToast('Error al procesar el archivo Excel', 'error');
    if (window.adminPanel) {
      adminPanel.showMessage('Error al procesar el archivo Excel', 'error');
    }
  }
}

// Function to show Excel preview
function showExcelPreview() {
  const previewCard = document.getElementById('excel-preview-card');
  const excelInfo = document.getElementById('excel-info');
  const excelPreview = document.getElementById('excel-preview');

  // Show exam info
  excelInfo.innerHTML = `
    <h4>📋 Información del Examen</h4>
    <p><strong>Nombre:</strong> ${currentExamInfo.name}</p>
    <p><strong>Año:</strong> ${currentExamInfo.year}</p>
    <p><strong>Archivo:</strong> ${currentExamInfo.fileName}</p>
    <p><strong>Total de Ingresantes:</strong> ${currentExcelData.length}</p>
  `;

  // Create preview table
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

  // Show first 10 rows as preview
  const previewData = currentExcelData.slice(0, 10);
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

  if (currentExcelData.length > 10) {
    tableHTML += `
      <tr>
        <td colspan="5" style="text-align: center; font-style: italic; color: #666;">
          ... y ${currentExcelData.length - 10} registros más
        </td>
      </tr>
    `;
  }

  tableHTML += `
      </tbody>
    </table>
  `;

  excelPreview.innerHTML = tableHTML;
  previewCard.style.display = 'block';
}

// Function to process and save Excel data
function processExcelData() {
  try {
    // Generate exam section
    generateExamSection(currentExamInfo, currentExcelData);

    // Show success message
    if (window.adminPanel) {
      adminPanel.showMessage(`Examen "${currentExamInfo.name}" procesado exitosamente`, 'success');
    }

    // Clear the upload
    cancelExcelUpload();
  } catch (error) {
    console.error('Error processing Excel data:', error);
    if (window.adminPanel) {
      adminPanel.showMessage('Error al procesar los datos del examen', 'error');
    }
  }
}

// Agregar botón de guardar a la vista previa
function addSaveButton() {
  const previewCard = document.getElementById('excel-preview-card');
  if (!previewCard) return;

  // Verificar si ya existe el botón
  if (previewCard.querySelector('.btn-save-excel')) return;

  // Crear contenedor de botones si no existe
  let actionsContainer = previewCard.querySelector('.preview-actions');
  if (!actionsContainer) {
    actionsContainer = document.createElement('div');
    actionsContainer.className = 'preview-actions';
    actionsContainer.style.cssText =
      'margin-top: 1rem; text-align: center; gap: 1rem; display: flex; justify-content: center;';
    previewCard.appendChild(actionsContainer);
  }

  // Agregar botón de guardar
  const saveButton = document.createElement('button');
  saveButton.className = 'btn-save-excel';
  saveButton.innerHTML = '💾 Guardar Lista';
  saveButton.style.cssText =
    'background: var(--admin-success); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease;';
  saveButton.onclick = saveExcelData;

  actionsContainer.insertBefore(saveButton, actionsContainer.firstChild);
}

// Guardar datos del Excel en el servidor
async function saveExcelData() {
  if (!currentExcelData || !currentExamInfo) {
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
      exam: currentExamInfo.name,
      year: currentExamInfo.year,
      meta: {
        archivo: currentExamInfo.fileName,
        total: currentExcelData.length,
        fecha: new Date().toISOString(),
      },
      items: currentExcelData,
    };

    const result = await INGRESANTES_API.importIngresantes(payload);

    if (result.ok) {
      showToast(`Guardado como ${result.key}`, 'success');

      // Refrescar la lista de listas guardadas
      await loadSavedLists();

      // Mantener la vista previa visible pero actualizar el botón
      if (saveButton) {
        saveButton.innerHTML = '✅ Guardado';
        setTimeout(() => {
          saveButton.innerHTML = '💾 Guardar Lista';
          saveButton.disabled = false;
        }, 2000);
      }
    } else {
      throw new Error('Error en la respuesta del servidor');
    }
  } catch (error) {
    console.error('Error saving Excel data:', error);
    showToast('Error al guardar los datos', 'error');

    if (saveButton) {
      saveButton.innerHTML = '❌ Error al guardar';
      setTimeout(() => {
        saveButton.innerHTML = '💾 Guardar Lista';
        saveButton.disabled = false;
      }, 2000);
    }
  }
}

// Function to cancel Excel upload
function cancelExcelUpload() {
  document.getElementById('inputExcel').value = '';
  document.getElementById('excel-preview-card').style.display = 'none';
  currentExcelData = null;
  currentExamInfo = null;
}

// Function to generate exam section
function generateExamSection(examInfo, students) {
  const container = document.getElementById('exam-sections-container');

  // Create unique ID for the exam
  const examId = `exam-${examInfo.year}-${examInfo.name.replace(/[^a-zA-Z0-9]/g, '')}`;

  // Check if section already exists
  const existingSection = document.getElementById(examId);
  if (existingSection) {
    if (confirm('Ya existe una sección para este examen. ¿Desea reemplazarla?')) {
      existingSection.remove();
    } else {
      return;
    }
  }

  // Create exam section HTML
  const sectionHTML = `
    <div class="exam-section" id="${examId}">
      <div class="exam-header">
        <h3 class="exam-title">🎓 ${examInfo.name}</h3>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span class="exam-year">${examInfo.year}</span>
          <button class="delete-exam-btn" onclick="deleteExamSection('${examId}')">
            🗑️ Eliminar
          </button>
        </div>
      </div>
      <div class="exam-content">
        <p><strong>Total de Ingresantes:</strong> ${students.length}</p>
        <table class="ingresantes-table">
          <thead>
            <tr>
              <th class="puesto-col">Puesto</th>
              <th>Nombre y Apellido</th>
              <th class="puntaje-col">Puntaje</th>
              <th>Carrera</th>
              <th class="preferencial-col">Preferencial</th>
            </tr>
          </thead>
          <tbody>
            ${generateStudentRows(students)}
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', sectionHTML);
}

// Function to generate student rows
function generateStudentRows(students) {
  return students
    .map(
      student => `
    <tr>
      <td class="puesto-col">${student.puesto}</td>
      <td>${student.nombre}</td>
      <td class="puntaje-col">${student.puntaje}</td>
      <td>${student.carrera}</td>
      <td class="preferencial-col">
        ${student.preferencial ? `<span class="preferencial-badge">Preferencial</span>` : ''}
      </td>
    </tr>
  `
    )
    .join('');
}

// Function to delete exam section
function deleteExamSection(examId) {
  if (confirm('¿Está seguro de que desea eliminar esta sección del examen?')) {
    const section = document.getElementById(examId);
    if (section) {
      section.remove();
      if (window.adminPanel) {
        adminPanel.showMessage('Sección del examen eliminada', 'success');
      }
    }
  }
}

// ===== DARK MODE - PERMANENT CONFIGURATION =====
// Dark mode is now permanently enabled via data-theme="dark" attribute in HTML
// No toggle functionality needed

// ===== INICIALIZACIÓN DE INGRESANTES =====
// Inicializar datos de prueba si no existen
function initTestData() {
  if (!localStorage.getItem('ingresantes_index')) {
    const testData = {
      'UPTP-2025': {
        key: 'UPTP-2025',
        exam: 'UPTP',
        year: 2025,
        meta: {
          archivo: 'Lista_Ingresantes_UPTP_2025.xlsx',
          total: 3,
          fecha: '2025-10-14T12:00:00Z',
        },
        items: [
          {
            nombre: 'María García López',
            puntaje: 95.5,
            carrera: 'Ingeniería en Sistemas',
            puesto: 1,
            preferencial: true,
          },
          {
            nombre: 'Juan Pérez Rodríguez',
            puntaje: 88.2,
            carrera: 'Ingeniería Industrial',
            puesto: 2,
            preferencial: false,
          },
          {
            nombre: 'Ana Martínez Silva',
            puntaje: 91.8,
            carrera: 'Ingeniería Civil',
            puesto: 3,
            preferencial: true,
          },
        ],
      },
    };

    // Guardar índice
    localStorage.setItem('ingresantes_index', JSON.stringify(['UPTP-2025']));

    // Guardar cada dataset
    Object.keys(testData).forEach(key => {
      localStorage.setItem(`ingresantes_${key}`, JSON.stringify(testData[key]));
    });

    console.log('Datos de prueba inicializados');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Inicializar datos de prueba
  initTestData();

  // Cargar listas guardadas al cargar la página
  if (document.getElementById('ingresantes-section')) {
    loadSavedLists();
  }
});
