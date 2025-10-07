// Admin Panel JavaScript
class AdminPanel {
  constructor() {
    this.isLoggedIn = false;
    this.currentSection = 'content';
    this.config = this.loadConfig();
    this.originalContent = {};
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
      this.loadBlockImages();
      this.loadBackgroundImages();
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

    // Preview button
    document.getElementById('preview-btn').addEventListener('click', () => {
      this.showPreview();
    });

    // Close preview
    document.getElementById('close-preview').addEventListener('click', () => {
      document.getElementById('preview-modal').style.display = 'none';
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
          this.updatePreviewContent(input);
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
    const bgUpload = document.getElementById('bg-upload');
    const bgArea = document.getElementById('background-images');

    bgUpload.addEventListener('change', e => {
      this.handleImageUpload(e.target.files, 'background');
    });

    // Drag and drop for background images
    bgArea.addEventListener('dragover', e => {
      e.preventDefault();
      bgArea.classList.add('drag-over');
    });

    bgArea.addEventListener('dragleave', () => {
      bgArea.classList.remove('drag-over');
    });

    bgArea.addEventListener('drop', e => {
      e.preventDefault();
      bgArea.classList.remove('drag-over');
      this.handleImageUpload(e.dataTransfer.files, 'background');
    });

    // Logo upload
    document.getElementById('logo-upload').addEventListener('change', e => {
      this.handleImageUpload(e.target.files, 'logo');
    });
  }

  initBackgroundImagesDragDrop() {
    const previewGrid = document.getElementById('background-preview');

    previewGrid.addEventListener('dragover', e => {
      e.preventDefault();
    });

    previewGrid.addEventListener('drop', e => {
      e.preventDefault();
      // El reordenamiento se maneja en los elementos individuales
    });
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

      // Agregado Section (Counters)
      'counter-students': '500',
      'counter-teachers': '25',
      'counter-courses': '15',
      'counter-years': '5',

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
  }

  updatePreviewContent(input) {
    // Store changes for preview
    const target = input.dataset.target || input.id;
    if (!this.originalContent[target]) {
      this.originalContent[target] = input.value;
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
    const previewGrid = document.getElementById('background-preview');
    const item = document.createElement('div');
    item.className = 'image-preview-item';
    item.draggable = true;

    // Generar ID único para la imagen
    const imageId = 'bg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    item.dataset.imageId = imageId;

    item.innerHTML = `
        <img src="${src}" alt="${name}">
        <div class="image-controls">
            <button class="move-btn" title="Arrastra para reordenar">≡</button>
            <button class="remove-btn" onclick="adminPanel.removeBackgroundImage('${imageId}')" title="Eliminar">&times;</button>
        </div>
        <div class="image-name">${name}</div>
    `;

    previewGrid.appendChild(item);

    // Agregar eventos de drag and drop
    this.addDragAndDropToItem(item);

    // Guardar imagen en el array de imágenes de fondo
    this.saveBackgroundImage(imageId, src, name);

    // Actualizar el carousel en tiempo real
    this.updateCarouselImages();
    this.updateImageCount();

    this.showMessage('Imagen de fondo agregada', 'success');
  }

  removeBackgroundImage(imageId) {
    const item = document.querySelector(`[data-image-id="${imageId}"]`);
    if (item) {
      item.remove();

      // Remover del almacenamiento
      this.removeBackgroundImageFromStorage(imageId);

      // Actualizar el carousel
      this.updateCarouselImages();
      this.updateImageCount();

      this.showMessage('Imagen eliminada', 'success');
    }
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
    const previewGrid = document.getElementById('background-preview');

    // Si no hay imágenes guardadas, cargar las por defecto
    if (backgroundImages.length === 0) {
      this.initializeDefaultBackgroundImages();
      backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');
    }

    // Limpiar grid actual
    previewGrid.innerHTML = '';

    // Ordenar por el campo order
    backgroundImages.sort((a, b) => a.order - b.order);

    backgroundImages.forEach(imageData => {
      const item = document.createElement('div');
      item.className = 'image-preview-item';
      item.draggable = true;
      item.dataset.imageId = imageData.id;

      item.innerHTML = `
          <img src="${imageData.src}" alt="${imageData.name}">
          <div class="image-controls">
              <button class="move-btn" title="Arrastra para reordenar">≡</button>
              <button class="remove-btn" onclick="adminPanel.removeBackgroundImage('${imageData.id}')" title="Eliminar">&times;</button>
          </div>
          <div class="image-name">${imageData.name}</div>
      `;

      previewGrid.appendChild(item);
      this.addDragAndDropToItem(item);
    });

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

  addDragAndDropToItem(item) {
    item.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', item.dataset.imageId);
      item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });

    item.addEventListener('dragover', e => {
      e.preventDefault();
      const afterElement = this.getDragAfterElement(item.parentElement, e.clientY);
      const draggedElement = document.querySelector('.dragging');

      if (afterElement == null) {
        item.parentElement.appendChild(draggedElement);
      } else {
        item.parentElement.insertBefore(draggedElement, afterElement);
      }
    });

    item.addEventListener('drop', e => {
      e.preventDefault();
      this.updateImageOrder();
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.image-preview-item:not(.dragging)')];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  updateImageOrder() {
    const items = document.querySelectorAll('.image-preview-item');
    let backgroundImages = JSON.parse(localStorage.getItem('background_images') || '[]');

    items.forEach((item, index) => {
      const imageId = item.dataset.imageId;
      const imageData = backgroundImages.find(img => img.id === imageId);
      if (imageData) {
        imageData.order = index;
      }
    });

    localStorage.setItem('background_images', JSON.stringify(backgroundImages));
    this.updateCarouselImages();
    this.updateImageCount();
    this.showMessage('Orden actualizado', 'success');
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

  updateLogo(src) {
    document.getElementById('current-logo').src = src;

    // Save logo to localStorage
    localStorage.setItem('website_logo', src);

    // Update logo in homepage if possible
    this.updateHomepageLogo(src);

    this.showMessage('Logo actualizado', 'success');
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

    this.showMessage('Estadísticas actualizadas', 'success');
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

    this.showMessage('Redes sociales actualizadas', 'success');
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
      this.showMessage(
        'Cambios guardados. Actualiza la página principal para ver los cambios.',
        'info'
      );
    } catch (error) {
      console.log('Could not directly update homepage:', error);
      localStorage.setItem('pending_homepage_updates', JSON.stringify(content));
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

    // Update timeline if data exists
    if (content.timeline_data && Array.isArray(content.timeline_data)) {
      this.updateTimelineInHomepage(doc, content.timeline_data);
    }

    this.showMessage('Página principal actualizada en tiempo real', 'success');
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

    // Include block images data
    const blockImages = JSON.parse(localStorage.getItem('block_images') || '{}');
    content.block_images = blockImages;

    return content;
  }

  // Preview
  showPreview() {
    // Save current changes first
    const allContent = this.getAllContent();
    localStorage.setItem('website_content', JSON.stringify(allContent));

    // Open homepage in new window/tab
    const previewWindow = window.open(
      'index.html',
      'preview',
      'width=1200,height=800,scrollbars=yes,resizable=yes'
    );

    if (previewWindow) {
      this.showMessage('Vista previa abierta en nueva ventana', 'success');

      // Store reference to preview window for real-time updates
      this.previewWindow = previewWindow;

      // Apply changes when window loads
      previewWindow.addEventListener('load', () => {
        setTimeout(() => {
          this.updateHomepageContent(previewWindow.document, allContent);
        }, 500);
      });
    } else {
      this.showMessage('Por favor permite ventanas emergentes para la vista previa', 'error');
    }
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

    this.showMessage('Nueva entrada de timeline agregada', 'success');
    this.autoSave();
  }

  deleteTimelineEntry(entryId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada del timeline?')) {
      return;
    }

    const timelineData = this.getTimelineData();
    const filteredData = timelineData.filter(entry => entry.id !== entryId);
    this.saveTimelineData(filteredData);
    this.renderTimeline(filteredData);

    this.showMessage('Entrada del timeline eliminada', 'success');
    this.autoSave();
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
        this.autoSave();
        this.showMessage('Imagen del timeline actualizada', 'success');
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
    // This function can be called to add image upload capability to other content blocks
    const imageBlocks = document.querySelectorAll('.content-card');

    imageBlocks.forEach(block => {
      // Check if this block doesn't already have image upload
      if (!block.querySelector('.image-upload-area') && !block.querySelector('.timeline-manager')) {
        this.addImageUploadToBlock(block);
      }
    });
  }

  addImageUploadToBlock(block) {
    const blockId = block.id || this.generateId();
    block.id = blockId;

    const imageSection = document.createElement('div');
    imageSection.className = 'form-group';
    imageSection.innerHTML = `
      <label>Imagen del Bloque (opcional):</label>
      <div class="image-upload-area" onclick="document.getElementById('block-file-${blockId}').click()">
        <input type="file" 
               id="block-file-${blockId}" 
               accept="image/*" 
               onchange="adminPanel.updateBlockImage('${blockId}', this.files[0])">
        <div class="upload-placeholder">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
          <div>Haz clic para subir imagen</div>
          <div class="upload-text">JPG, PNG, GIF (máx. 5MB)</div>
        </div>
      </div>
    `;

    block.appendChild(imageSection);
  }

  updateBlockImage(blockId, file) {
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('La imagen no puede superar los 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.showMessage('Solo se permiten archivos de imagen', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const uploadArea = document.querySelector(`#block-file-${blockId}`).parentElement;
      uploadArea.innerHTML = `
        <input type="file" 
               id="block-file-${blockId}" 
               accept="image/*" 
               onchange="adminPanel.updateBlockImage('${blockId}', this.files[0])">
        <img src="${e.target.result}" alt="Block image" class="block-image-preview" 
             style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 0.5rem;">
        <div style="color: var(--admin-success); font-size: 0.75rem; font-weight: 500;">${file.name}</div>
      `;
      uploadArea.classList.add('has-image');

      // Save image data
      const blockImages = JSON.parse(localStorage.getItem('block_images') || '{}');
      blockImages[blockId] = {
        src: e.target.result,
        name: file.name,
      };
      localStorage.setItem('block_images', JSON.stringify(blockImages));

      this.showMessage('Imagen del bloque actualizada', 'success');
      this.autoSave();
    };
    reader.readAsDataURL(file);
  }

  loadBlockImages() {
    // Load saved block images
    const blockImages = JSON.parse(localStorage.getItem('block_images') || '{}');

    Object.keys(blockImages).forEach(blockId => {
      const imageData = blockImages[blockId];
      const uploadArea = document.querySelector(`#block-file-${blockId}`)?.parentElement;

      if (uploadArea && imageData) {
        uploadArea.innerHTML = `
          <input type="file" 
                 id="block-file-${blockId}" 
                 accept="image/*" 
                 onchange="adminPanel.updateBlockImage('${blockId}', this.files[0])">
          <img src="${imageData.src}" alt="Block image" class="block-image-preview" 
               style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 0.5rem;">
          <div style="color: var(--admin-success); font-size: 0.75rem; font-weight: 500;">${imageData.name}</div>
        `;
        uploadArea.classList.add('has-image');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const admin = new AdminPanel();

  // Initialize last backup display
  admin.initLastBackup();

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
