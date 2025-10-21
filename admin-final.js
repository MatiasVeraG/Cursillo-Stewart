/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║           CURSILLO STEWART - PANEL DE ADMINISTRACIÓN          ║
 * ║                                                                ║
 * ║  Desarrollado por: Matías Vera                                 ║
 * ║  GitHub: https://github.com/MatiasVeraG                        ║
 * ║  Año: 2025                                                     ║
 * ║                                                                ║
 * ║  Sistema completo de administración para el Cursillo Stewart   ║
 * ║  © 2025 Todos los derechos reservados                          ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

// ==================== UTILIDADES DE LOCALSTORAGE ====================
const LocalStorageUtils = {
  /**
   * Verifica el uso actual de localStorage
   * @returns {Object} Información sobre el uso de localStorage
   */
  checkUsage() {
    let total = 0;
    const items = {};
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = (localStorage[key].length + key.length) * 2; // UTF-16
        items[key] = {
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        };
        total += size;
      }
    }
    
    return {
      totalBytes: total,
      totalKB: (total / 1024).toFixed(2),
      totalMB: (total / 1024 / 1024).toFixed(2),
      items: items,
      itemCount: Object.keys(items).length
    };
  },

  /**
   * Obtiene los items más pesados en localStorage
   * @param {number} limit - Cantidad de items a retornar
   * @returns {Array} Array de items ordenados por tamaño
   */
  getLargestItems(limit = 5) {
    const usage = this.checkUsage();
    return Object.entries(usage.items)
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, limit)
      .map(([key, data]) => ({ key, ...data }));
  },

  /**
   * Muestra información de uso en consola
   */
  logUsage() {
    const usage = this.checkUsage();
    console.group('📊 LocalStorage Usage Report');
    console.log(`Total: ${usage.totalKB} KB (${usage.totalMB} MB)`);
    console.log(`Items: ${usage.itemCount}`);
    console.log('\n🔝 Top 5 Largest Items:');
    this.getLargestItems(5).forEach((item, i) => {
      console.log(`${i + 1}. ${item.key}: ${item.sizeKB} KB`);
    });
    console.groupEnd();
  }
};

// ==================== AUTENTICACIÓN ====================
class AuthSystem {
  constructor() {
    this.sessionKey = 'admin_session';
    this.timestampKey = 'admin_timestamp';
    this.sessionDuration = 30 * 60 * 1000;
  }

  init() {
    this.checkSession();
    this.bindLoginForm();
  }

  checkSession() {
    const session = localStorage.getItem(this.sessionKey);
    const timestamp = localStorage.getItem(this.timestampKey);

    if (session && timestamp) {
      const elapsed = Date.now() - parseInt(timestamp);
      if (elapsed < this.sessionDuration) {
        this.showAdminPanel();
        localStorage.setItem(this.timestampKey, Date.now().toString());
        return;
      }
    }

    this.showLoginScreen();
  }

  bindLoginForm() {
    const form = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Get stored username and password or use defaults
        const storedUsername = localStorage.getItem('admin_username') || 'admin';
        const storedPassword = localStorage.getItem('admin_password') || 'stewart2024';

        if (username === storedUsername && password === storedPassword) {
          localStorage.setItem(this.sessionKey, 'active');
          localStorage.setItem(this.timestampKey, Date.now().toString());
          this.showAdminPanel();
        } else {
          const errorEl = document.getElementById('login-error');
          errorEl.textContent = 'Usuario o contraseña incorrectos';
          errorEl.style.display = 'block';
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Cerrar sesión?')) {
          localStorage.removeItem(this.sessionKey);
          localStorage.removeItem(this.timestampKey);
          this.showLoginScreen();
        }
      });
    }
  }

  showLoginScreen() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-panel').style.display = 'none';
  }

  showAdminPanel() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
  }
}

// ==================== SISTEMA DE BANNER PRINCIPAL ====================
class BannerSystem {
  constructor() {
    this.bannerData = {};
    this.defaultImages = [
      'images/Imagen de Fondo 1.jpeg',
      'images/Imagen de Fondo 3.jpeg',
      'images/Imagen de Fondo 4.jpeg',
      'images/Imagen de Fondo 5.jpeg'
    ];
  }

  init() {
    this.loadBannerData();
    this.bindEvents();
    this.initBackgroundManager();
    this.initLogoUpload();
    console.log('✅ Banner System initialized');
  }

  bindEvents() {
    // Bind banner text inputs
    const titleInput = document.getElementById('banner-title');
    const subtitleInput = document.getElementById('banner-subtitle');
    const descriptionInput = document.getElementById('banner-description');

    if (titleInput) {
      titleInput.addEventListener('input', () => this.saveBannerData());
    }
    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => this.saveBannerData());
    }
    if (descriptionInput) {
      descriptionInput.addEventListener('input', () => this.saveBannerData());
    }

    // Bind color inputs
    const titleColorInput = document.getElementById('banner-title-color');
    const subtitleColorInput = document.getElementById('banner-subtitle-color');
    const descriptionColorInput = document.getElementById('banner-description-color');

    if (titleColorInput) {
      titleColorInput.addEventListener('input', () => this.saveBannerColors());
    }
    if (subtitleColorInput) {
      subtitleColorInput.addEventListener('input', () => this.saveBannerColors());
    }
    if (descriptionColorInput) {
      descriptionColorInput.addEventListener('input', () => this.saveBannerColors());
    }

    // Bind overlay controls
    const overlayColorInput = document.getElementById('banner-overlay-color');
    const overlayOpacityInput = document.getElementById('banner-overlay-opacity');
    const brightnessInput = document.getElementById('banner-image-brightness');

    if (overlayColorInput) {
      overlayColorInput.addEventListener('input', () => this.updateBannerOverlay());
    }
    if (overlayOpacityInput) {
      overlayOpacityInput.addEventListener('input', () => this.updateBannerOverlay());
    }
    if (brightnessInput) {
      brightnessInput.addEventListener('input', () => this.updateBannerOverlay());
    }

    // Carousel interval
    const intervalInput = document.getElementById('carousel-interval');
    if (intervalInput) {
      intervalInput.addEventListener('change', (e) => this.updateCarouselInterval(e.target.value));
    }
  }

  loadBannerData() {
    try {
      // Load banner content
      const savedContent = JSON.parse(localStorage.getItem('website_content') || '{}');
      
      const titleInput = document.getElementById('banner-title');
      const subtitleInput = document.getElementById('banner-subtitle');
      const descriptionInput = document.getElementById('banner-description');

      if (titleInput) {
        titleInput.value = savedContent['banner-title'] || 'Cursillo Stewart';
      }
      if (subtitleInput) {
        subtitleInput.value = savedContent['banner-subtitle'] || 'Universidad Politécnica Taiwan Paraguay';
      }
      if (descriptionInput) {
        descriptionInput.value = savedContent['banner-description'] || 
          'Somos el cursillo #1 para la Universidad Politécnica Taiwan-Paraguay en porcentaje, cantidad y calidad de ingresantes';
      }

      // Load banner colors
      const savedColors = JSON.parse(localStorage.getItem('banner_text_colors') || '{}');
      
      const titleColorInput = document.getElementById('banner-title-color');
      const subtitleColorInput = document.getElementById('banner-subtitle-color');
      const descriptionColorInput = document.getElementById('banner-description-color');

      if (titleColorInput) {
        titleColorInput.value = savedColors.title || '#ffffff';
      }
      if (subtitleColorInput) {
        subtitleColorInput.value = savedColors.subtitle || '#ffffff';
      }
      if (descriptionColorInput) {
        descriptionColorInput.value = savedColors.description || '#ffffff';
      }

      // Load overlay settings
      const savedOverlay = JSON.parse(localStorage.getItem('banner_overlay_settings') || '{}');
      
      const overlayColorInput = document.getElementById('banner-overlay-color');
      const overlayOpacityInput = document.getElementById('banner-overlay-opacity');
      const brightnessInput = document.getElementById('banner-image-brightness');

      if (overlayColorInput) {
        overlayColorInput.value = savedOverlay.color || '#1e40af';
        const colorValueEl = document.getElementById('overlay-color-value');
        if (colorValueEl) colorValueEl.textContent = savedOverlay.color || '#1e40af';
      }
      if (overlayOpacityInput) {
        overlayOpacityInput.value = savedOverlay.opacity || 15;
        const opacityValueEl = document.getElementById('overlay-opacity-value');
        if (opacityValueEl) opacityValueEl.textContent = (savedOverlay.opacity || 15) + '%';
      }
      if (brightnessInput) {
        brightnessInput.value = savedOverlay.brightness || 100;
        const brightnessValueEl = document.getElementById('brightness-value');
        if (brightnessValueEl) brightnessValueEl.textContent = (savedOverlay.brightness || 100) + '%';
      }

      // Load carousel interval
      const savedInterval = localStorage.getItem('carousel_interval') || '10';
      const intervalInput = document.getElementById('carousel-interval');
      const currentIntervalEl = document.getElementById('current-interval');
      if (intervalInput) intervalInput.value = savedInterval;
      if (currentIntervalEl) currentIntervalEl.textContent = savedInterval;

      // Load current logo
      const savedLogo = localStorage.getItem('website_logo');
      const logoImg = document.getElementById('current-logo');
      if (logoImg && savedLogo) {
        logoImg.src = savedLogo;
      }

      console.log('✅ Banner data loaded');
    } catch (error) {
      console.error('Error loading banner data:', error);
    }
  }

  saveBannerData() {
    try {
      const titleInput = document.getElementById('banner-title');
      const subtitleInput = document.getElementById('banner-subtitle');
      const descriptionInput = document.getElementById('banner-description');

      // Get current website content
      const currentContent = JSON.parse(localStorage.getItem('website_content') || '{}');
      
      // Update with banner data
      if (titleInput) {
        currentContent['banner-title'] = titleInput.value;
      }
      if (subtitleInput) {
        currentContent['banner-subtitle'] = subtitleInput.value;
      }
      if (descriptionInput) {
        currentContent['banner-description'] = descriptionInput.value;
      }

      // Save updated content
      localStorage.setItem('website_content', JSON.stringify(currentContent));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      console.log('✅ Banner data saved');
    } catch (error) {
      console.error('Error saving banner data:', error);
    }
  }

  saveBannerColors() {
    try {
      const titleColorInput = document.getElementById('banner-title-color');
      const subtitleColorInput = document.getElementById('banner-subtitle-color');
      const descriptionColorInput = document.getElementById('banner-description-color');

      const colors = {};
      
      if (titleColorInput) {
        colors.title = titleColorInput.value;
      }
      if (subtitleColorInput) {
        colors.subtitle = subtitleColorInput.value;
      }
      if (descriptionColorInput) {
        colors.description = descriptionColorInput.value;
      }

      localStorage.setItem('banner_text_colors', JSON.stringify(colors));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      console.log('✅ Banner colors saved');
    } catch (error) {
      console.error('Error saving banner colors:', error);
    }
  }

  updateBannerOverlay() {
    try {
      const overlayColorInput = document.getElementById('banner-overlay-color');
      const overlayOpacityInput = document.getElementById('banner-overlay-opacity');
      const brightnessInput = document.getElementById('banner-image-brightness');

      const settings = {
        color: overlayColorInput?.value || '#1e40af',
        opacity: overlayOpacityInput ? parseInt(overlayOpacityInput.value) : 15,
        brightness: brightnessInput ? parseInt(brightnessInput.value) : 100,
        gradient: '135deg' // Default gradient
      };

      // Update UI display values
      const colorValueEl = document.getElementById('overlay-color-value');
      const opacityValueEl = document.getElementById('overlay-opacity-value');
      const brightnessValueEl = document.getElementById('brightness-value');

      if (colorValueEl) colorValueEl.textContent = settings.color;
      if (opacityValueEl) opacityValueEl.textContent = settings.opacity + '%';
      if (brightnessValueEl) brightnessValueEl.textContent = settings.brightness + '%';

      // Save settings
      localStorage.setItem('banner_overlay_settings', JSON.stringify(settings));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      console.log('✅ Banner overlay updated:', settings);
    } catch (error) {
      console.error('Error updating banner overlay:', error);
    }
  }

  resetBannerOverlay() {
    if (!confirm('¿Restaurar filtro de banner a valores por defecto?')) return;

    const overlayColorInput = document.getElementById('banner-overlay-color');
    const overlayOpacityInput = document.getElementById('banner-overlay-opacity');
    const brightnessInput = document.getElementById('banner-image-brightness');

    if (overlayColorInput) overlayColorInput.value = '#1e40af';
    if (overlayOpacityInput) overlayOpacityInput.value = 15;
    if (brightnessInput) brightnessInput.value = 100;

    this.updateBannerOverlay();
    showToast('🔄 Filtro de banner restaurado', 'success');
  }

  updateCarouselInterval(value) {
    const interval = parseInt(value);
    if (interval < 3 || interval > 30) {
      showToast('⚠️ El intervalo debe estar entre 3 y 30 segundos', 'error');
      return;
    }

    localStorage.setItem('carousel_interval', interval.toString());
    localStorage.setItem('admin_update_timestamp', Date.now().toString());

    const currentIntervalEl = document.getElementById('current-interval');
    if (currentIntervalEl) currentIntervalEl.textContent = interval;

    showToast(`✅ Intervalo actualizado a ${interval} segundos`, 'success');
    console.log('✅ Carousel interval updated:', interval);
  }

  updateBannerTextColor(type) {
    this.saveBannerColors();
  }

  // ============= GESTIÓN DE IMÁGENES DE FONDO =============
  initBackgroundManager() {
    const fileInput = document.getElementById('background-file-input');
    const uploadArea = document.getElementById('background-upload-area');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => this.handleBackgroundUpload(e));
    }

    if (uploadArea) {
      // Drag & Drop
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        this.handleBackgroundUpload({ target: { files: e.dataTransfer.files } });
      });
    }

    // Load and display current images
    this.loadBackgroundImages();
  }

  loadBackgroundImages() {
    const savedImages = JSON.parse(localStorage.getItem('carousel_images') || 'null');
    let images = savedImages || this.defaultImages;

    // Migrar formato legacy (strings) a nuevo formato {src, thumb}
    // Los defaults permanecen como strings (rutas de archivo)
    const needsMigration = images.some(img => typeof img === 'string' && img.startsWith('data:'));
    
    if (needsMigration) {
      console.warn('⚠️ Imágenes en formato legacy detectadas. Considera re-subirlas para mejor calidad.');
      console.warn('💡 Formato legacy usa la misma imagen para admin y carousel.');
    }

    this.displayBackgroundImages(images);
  }

  displayBackgroundImages(images) {
    const container = document.getElementById('background-images-container');
    const countEl = document.getElementById('background-count');
    
    if (!container) return;

    container.innerHTML = '';
    
    if (countEl) {
      countEl.textContent = `${images.length} imagen${images.length !== 1 ? 'es' : ''}`;
    }

    images.forEach((imageData, index) => {
      const imageCard = document.createElement('div');
      imageCard.className = 'background-image-card';
      imageCard.draggable = true;
      imageCard.dataset.index = index;

      // Detectar formato: objeto {src, thumb} o string legacy
      const isObject = typeof imageData === 'object' && imageData !== null;
      const thumbnailSrc = isObject ? imageData.thumb : imageData;
      const originalSrc = isObject ? imageData.src : imageData;

      imageCard.innerHTML = `
        <div class="thumbnail">
          <img src="${thumbnailSrc}" alt="Imagen ${index + 1}" data-original-size="${isObject ? 'full-res' : 'legacy'}">
        </div>
        <div class="image-controls">
          <button class="btn-delete" onclick="bannerSystem.removeBackgroundImage(${index})" title="Eliminar">
            🗑️
          </button>
          <span class="image-number">${index + 1}</span>
        </div>
      `;

      // Verificar dimensiones del thumbnail en admin
      const imgEl = imageCard.querySelector('img');
      imgEl.addEventListener('load', function() {
        const naturalW = this.naturalWidth;
        const naturalH = this.naturalHeight;
        const displayW = this.offsetWidth;
        const displayH = this.offsetHeight;
        
        console.log(`🖼️ [Admin] Imagen ${index + 1}: Natural ${naturalW}x${naturalH} → Display ${displayW}x${displayH}`);
        
        if (isObject) {
          console.log(`   ✅ Usando thumbnail para admin (original disponible: full-res)`);
        } else {
          console.warn(`   ⚠️ Imagen legacy detectada - considera re-subir para obtener versión full-res`);
        }
        
        if (naturalW < displayW || naturalH < displayH) {
          console.warn(`   ⚠️ Thumbnail siendo upscaleado en admin panel!`);
        }
      });

      // Drag events
      imageCard.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', index);
        imageCard.classList.add('dragging');
      });

      imageCard.addEventListener('dragend', () => {
        imageCard.classList.remove('dragging');
      });

      imageCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      imageCard.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/html'));
        const toIndex = parseInt(imageCard.dataset.index);
        this.reorderBackgroundImages(fromIndex, toIndex);
      });

      container.appendChild(imageCard);
    });
  }

  handleBackgroundUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const savedImages = JSON.parse(localStorage.getItem('carousel_images') || 'null');
    const currentImages = savedImages || [...this.defaultImages];

    let processedCount = 0;
    const totalFiles = files.length;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        showToast('⚠️ Solo se permiten archivos de imagen', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalBase64 = e.target.result; // Guardar ORIGINAL en alta resolución
        
        // Crear thumbnail HiDPI SOLO para el panel de administración
        const img = new Image();
        img.onload = () => {
          // Configuración del thumbnail para admin
          const maxCSS = 200; // Tamaño máximo en píxeles CSS
          const dpr = window.devicePixelRatio || 1;
          
          // Calcular dimensiones CSS manteniendo proporción (sin upscale)
          let cssWidth = img.width;
          let cssHeight = img.height;
          
          if (cssWidth > maxCSS || cssHeight > maxCSS) {
            const scale = Math.min(maxCSS / cssWidth, maxCSS / cssHeight);
            cssWidth = Math.floor(cssWidth * scale);
            cssHeight = Math.floor(cssHeight * scale);
          }
          
          // Dimensiones del canvas con DPR para HiDPI
          const canvasWidth = cssWidth * dpr;
          const canvasHeight = cssHeight * dpr;
          
          // Crear canvas HiDPI
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          canvas.style.width = `${cssWidth}px`;
          canvas.style.height = `${cssHeight}px`;
          
          // Configurar alta calidad de rendering
          ctx.scale(dpr, dpr);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Dibujar imagen escalada
          ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
          
          // Exportar thumbnail como WebP
          const thumbnailBase64 = canvas.toDataURL('image/webp', 0.9);
          
          // Logging para verificar dimensiones
          console.log(`📸 Imagen procesada: ${img.width}x${img.height}`);
          console.log(`   └─ Original: ${(originalBase64.length / 1024).toFixed(0)}KB (para carousel)`);
          console.log(`   └─ Thumbnail: ${cssWidth}x${cssHeight} CSS @ ${dpr}x DPR (solo admin)`);
          
          // GUARDAR AMBOS: original para carousel + thumbnail para admin
          currentImages.push({
            src: originalBase64,      // ORIGINAL en alta resolución para el carousel
            thumb: thumbnailBase64    // Thumbnail optimizado SOLO para admin
          });
          
          localStorage.setItem('carousel_images', JSON.stringify(currentImages));
          localStorage.setItem('admin_update_timestamp', Date.now().toString());
          
          processedCount++;
          if (processedCount === totalFiles) {
            this.displayBackgroundImages(currentImages);
            showToast(`✅ ${totalFiles} imagen${totalFiles > 1 ? 'es' : ''} agregada${totalFiles > 1 ? 's' : ''} al carousel`, 'success');
          }
        };
        img.src = originalBase64;
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    event.target.value = '';
  }

  removeBackgroundImage(index) {
    if (!confirm('¿Eliminar esta imagen del carousel?')) return;

    const savedImages = JSON.parse(localStorage.getItem('carousel_images') || 'null');
    const currentImages = savedImages || [...this.defaultImages];

    if (currentImages.length <= 1) {
      showToast('⚠️ Debe haber al menos una imagen en el carousel', 'error');
      return;
    }

    currentImages.splice(index, 1);
    localStorage.setItem('carousel_images', JSON.stringify(currentImages));
    localStorage.setItem('admin_update_timestamp', Date.now().toString());
    this.displayBackgroundImages(currentImages);
    showToast('🗑️ Imagen eliminada', 'success');
  }

  reorderBackgroundImages(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    const savedImages = JSON.parse(localStorage.getItem('carousel_images') || 'null');
    const currentImages = savedImages || [...this.defaultImages];

    const [movedImage] = currentImages.splice(fromIndex, 1);
    currentImages.splice(toIndex, 0, movedImage);

    localStorage.setItem('carousel_images', JSON.stringify(currentImages));
    localStorage.setItem('admin_update_timestamp', Date.now().toString());
    this.displayBackgroundImages(currentImages);
    showToast('✅ Imágenes reordenadas', 'success');
  }

  resetToDefaultImages() {
    if (!confirm('¿Restaurar imágenes de fondo por defecto? Se perderán las imágenes personalizadas.')) return;

    localStorage.removeItem('carousel_images');
    localStorage.setItem('admin_update_timestamp', Date.now().toString());
    this.displayBackgroundImages(this.defaultImages);
    showToast('🔄 Imágenes restauradas por defecto', 'success');
  }

  // Limpiar imágenes legacy en baja resolución
  clearLegacyImages() {
    if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODAS las imágenes personalizadas del carousel.\n\n¿Estás seguro de que deseas continuar?\n\nDeberás re-subir las imágenes después de esta operación para obtener versiones de alta resolución.')) {
      return;
    }

    try {
      // Eliminar imágenes guardadas
      localStorage.removeItem('carousel_images');
      localStorage.setItem('admin_update_timestamp', Date.now().toString());
      
      // Recargar con imágenes por defecto
      this.loadBackgroundImages();
      
      console.log('🧹 Imágenes legacy eliminadas del localStorage');
      console.log('💡 Por favor, re-sube tus imágenes para obtener versiones full-res');
      showToast('🧹 Imágenes legacy eliminadas. Re-sube tus imágenes ahora.', 'success');
      
    } catch (error) {
      console.error('Error clearing legacy images:', error);
      showToast('❌ Error al limpiar imágenes legacy', 'error');
    }
  }

  // ============= GESTIÓN DE LOGO =============
  initLogoUpload() {
    const logoInput = document.getElementById('logo-upload');
    if (logoInput) {
      logoInput.addEventListener('change', (e) => this.handleLogoUpload(e));
    }
  }

  handleLogoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Solo se permiten archivos de imagen', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      // Crear thumbnail HiDPI optimizado para el logo
      const img = new Image();
      img.onload = () => {
        // Configuración del logo thumbnail
        const maxCSS = 200; // Tamaño máximo en píxeles CSS
        const dpr = window.devicePixelRatio || 1;
        
        // Calcular dimensiones CSS manteniendo proporción (sin upscale)
        let cssWidth = img.width;
        let cssHeight = img.height;
        
        if (cssWidth > maxCSS || cssHeight > maxCSS) {
          const scale = Math.min(maxCSS / cssWidth, maxCSS / cssHeight);
          cssWidth = Math.floor(cssWidth * scale);
          cssHeight = Math.floor(cssHeight * scale);
        }
        
        // Dimensiones del canvas con DPR para HiDPI
        const canvasWidth = cssWidth * dpr;
        const canvasHeight = cssHeight * dpr;
        
        // Crear canvas HiDPI
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        
        // Configurar alta calidad de rendering
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
        
        // Exportar como WebP de alta calidad
        const logoThumbnail = canvas.toDataURL('image/webp', 0.9);
        
        // Logging para verificar dimensiones
        console.log(`🏷️ Logo generado: ${img.width}x${img.height} → ${cssWidth}x${cssHeight} CSS (${canvasWidth}x${canvasHeight} canvas @ ${dpr}x DPR)`);
        
        // Update preview
        const logoImg = document.getElementById('current-logo');
        if (logoImg) {
          logoImg.src = logoThumbnail;
        }

        // Save to localStorage
        localStorage.setItem('website_logo', logoThumbnail);
        localStorage.setItem('admin_update_timestamp', Date.now().toString());

        showToast('✅ Logo actualizado correctamente', 'success');
        console.log('✅ Logo saved as optimized HiDPI thumbnail');
      };
      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }

  // ============= CONFIGURACIÓN POR DEFECTO =============
  setAsDefaultConfiguration() {
    if (!confirm('¿Guardar la configuración actual del banner como valores por defecto?\n\nEstos valores se usarán cuando restaures la configuración.')) {
      return;
    }

    try {
      // Recopilar toda la configuración actual del banner
      const defaultConfig = {
        // Textos del banner
        bannerContent: {
          'banner-title': document.getElementById('banner-title')?.value || 'Cursillo Stewart',
          'banner-subtitle': document.getElementById('banner-subtitle')?.value || 'Universidad Politécnica Taiwan Paraguay',
          'banner-description': document.getElementById('banner-description')?.value || 'Somos el cursillo #1 para la Universidad Politécnica Taiwan-Paraguay'
        },
        
        // Colores del banner
        bannerColors: {
          title: document.getElementById('banner-title-color')?.value || '#ffffff',
          subtitle: document.getElementById('banner-subtitle-color')?.value || '#ffffff',
          description: document.getElementById('banner-description-color')?.value || '#ffffff'
        },
        
        // Configuración del overlay
        overlaySettings: {
          color: document.getElementById('banner-overlay-color')?.value || '#1e40af',
          opacity: parseInt(document.getElementById('banner-overlay-opacity')?.value || 15),
          brightness: parseInt(document.getElementById('banner-image-brightness')?.value || 100),
          gradient: '135deg'
        },
        
        // Intervalo del carousel
        carouselInterval: parseInt(document.getElementById('carousel-interval')?.value || 10),
        
        // NO guardar imágenes grandes en Base64 para evitar QuotaExceededError
        // Solo guardar referencias a si existen imágenes personalizadas
        hasCustomImages: !!localStorage.getItem('carousel_images'),
        hasCustomLogo: !!localStorage.getItem('website_logo'),
        
        // Timestamp
        savedAt: new Date().toISOString()
      };

      // Guardar configuración por defecto (sin imágenes pesadas)
      localStorage.setItem('banner_default_config', JSON.stringify(defaultConfig));
      
      showToast('✅ Configuración guardada como predeterminada', 'success');
      console.log('✅ Default configuration saved (without heavy images):', defaultConfig);
      console.log('ℹ️ Las imágenes del carousel y el logo se mantienen en sus claves separadas');
      
    } catch (error) {
      console.error('Error saving default configuration:', error);
      
      // Mostrar error más específico
      if (error.name === 'QuotaExceededError') {
        showToast('❌ Error: Espacio insuficiente en localStorage. Considera limpiar datos antiguos.', 'error');
        console.error('💾 localStorage está lleno. Limpia datos con: localStorage.clear() o elimina items específicos');
      } else {
        showToast('❌ Error al guardar configuración por defecto', 'error');
      }
    }
  }

  restoreDefaultConfiguration() {
    if (!confirm('¿Restaurar la configuración del banner a los valores por defecto guardados?\n\nSe perderá la configuración actual.')) {
      return;
    }

    try {
      // Intentar cargar configuración guardada por el usuario
      const savedDefaultConfig = localStorage.getItem('banner_default_config');
      
      let defaultConfig;
      if (savedDefaultConfig) {
        // Usar configuración guardada por el usuario
        defaultConfig = JSON.parse(savedDefaultConfig);
        console.log('📂 Restaurando configuración guardada por usuario');
      } else {
        // Usar configuración del sistema por defecto
        defaultConfig = {
          bannerContent: {
            'banner-title': 'Cursillo Stewart',
            'banner-subtitle': 'Universidad Politécnica Taiwan Paraguay',
            'banner-description': 'Somos el cursillo #1 para la Universidad Politécnica Taiwan-Paraguay en porcentaje, cantidad y calidad de ingresantes'
          },
          bannerColors: {
            title: '#ffffff',
            subtitle: '#ffffff',
            description: '#ffffff'
          },
          overlaySettings: {
            color: '#1e40af',
            opacity: 15,
            brightness: 100,
            gradient: '135deg'
          },
          carouselInterval: 10,
          carouselImages: this.defaultImages,
          logo: null
        };
        console.log('🏭 Restaurando configuración del sistema');
      }

      // Restaurar textos del banner
      if (defaultConfig.bannerContent) {
        const titleInput = document.getElementById('banner-title');
        const subtitleInput = document.getElementById('banner-subtitle');
        const descriptionInput = document.getElementById('banner-description');
        
        if (titleInput) titleInput.value = defaultConfig.bannerContent['banner-title'];
        if (subtitleInput) subtitleInput.value = defaultConfig.bannerContent['banner-subtitle'];
        if (descriptionInput) descriptionInput.value = defaultConfig.bannerContent['banner-description'];
      }

      // Restaurar colores
      if (defaultConfig.bannerColors) {
        const titleColorInput = document.getElementById('banner-title-color');
        const subtitleColorInput = document.getElementById('banner-subtitle-color');
        const descriptionColorInput = document.getElementById('banner-description-color');
        
        if (titleColorInput) titleColorInput.value = defaultConfig.bannerColors.title;
        if (subtitleColorInput) subtitleColorInput.value = defaultConfig.bannerColors.subtitle;
        if (descriptionColorInput) descriptionColorInput.value = defaultConfig.bannerColors.description;
      }

      // Restaurar overlay
      if (defaultConfig.overlaySettings) {
        const overlayColorInput = document.getElementById('banner-overlay-color');
        const overlayOpacityInput = document.getElementById('banner-overlay-opacity');
        const brightnessInput = document.getElementById('banner-image-brightness');
        
        if (overlayColorInput) overlayColorInput.value = defaultConfig.overlaySettings.color;
        if (overlayOpacityInput) overlayOpacityInput.value = defaultConfig.overlaySettings.opacity;
        if (brightnessInput) brightnessInput.value = defaultConfig.overlaySettings.brightness;
      }

      // Restaurar intervalo del carousel
      if (defaultConfig.carouselInterval) {
        const intervalInput = document.getElementById('carousel-interval');
        if (intervalInput) intervalInput.value = defaultConfig.carouselInterval;
      }

      // Restaurar imágenes del carousel (si existen en la config antigua)
      // Nueva versión: solo verificar si había imágenes personalizadas
      if (defaultConfig.carouselImages) {
        // Configuración antigua (compatibilidad)
        localStorage.setItem('carousel_images', JSON.stringify(defaultConfig.carouselImages));
        this.displayBackgroundImages(defaultConfig.carouselImages);
      } else if (defaultConfig.hasCustomImages === false) {
        // Nueva versión: restaurar imágenes por defecto
        localStorage.setItem('carousel_images', JSON.stringify(this.defaultImages));
        this.displayBackgroundImages(this.defaultImages);
      }
      // Si hasCustomImages === true, mantener las imágenes actuales en localStorage

      // Restaurar logo (si existe en la config antigua)
      if (defaultConfig.logo) {
        // Configuración antigua (compatibilidad)
        localStorage.setItem('website_logo', defaultConfig.logo);
        const logoImg = document.getElementById('current-logo');
        if (logoImg) logoImg.src = defaultConfig.logo;
      } else if (defaultConfig.hasCustomLogo === false) {
        // Nueva versión: restaurar logo por defecto
        localStorage.removeItem('website_logo');
        const logoImg = document.getElementById('current-logo');
        if (logoImg) logoImg.src = 'images/1-1-logo-cursillo-stewart.png';
      }
      // Si hasCustomLogo === true, mantener el logo actual en localStorage

      // Guardar todos los cambios
      this.saveBannerData();
      this.saveBannerColors();
      this.updateBannerOverlay();
      if (defaultConfig.carouselInterval) {
        localStorage.setItem('carousel_interval', defaultConfig.carouselInterval.toString());
      }

      // Actualizar timestamp
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      showToast('🔄 Configuración restaurada correctamente', 'success');
      console.log('✅ Configuration restored');
      
    } catch (error) {
      console.error('Error restoring default configuration:', error);
      showToast('❌ Error al restaurar configuración', 'error');
    }
  }
}

// ==================== SISTEMA DE CONÓCENOS Y TIMELINE ====================
class ConocenosSystem {
  constructor() {
    this.timelineData = [];
  }

  init() {
    this.loadTimeline();
    this.bindEvents();
  }

  bindEvents() {
    // Bind inputs for auto-save
    const titleInput = document.getElementById('about-title');
    const descInput = document.getElementById('about-description');

    if (titleInput) {
      titleInput.addEventListener('input', () => this.autoSave());
    }

    if (descInput) {
      descInput.addEventListener('input', () => this.autoSave());
    }
  }

  loadTimeline() {
    // Load from localStorage or set defaults
    const saved = localStorage.getItem('timeline_data');
    
    if (saved) {
      this.timelineData = JSON.parse(saved);
    } else {
      // Default timeline
      this.timelineData = [
        {
          id: this.generateId(),
          year: '2022',
          title: 'Los Inicios',
          description:
            'Todo comenzó cuando cuatro educadores visionarios: Prof. Facundo Rolón, Prof. Alejandro López, Prof. Leandro Volta y Prof. Mirella López fundaron el Cursillo Stewart. Con la determinación de brindar una preparación matemática excepcional, iniciaron este proyecto en un departamento, creando un ambiente íntimo y personalizado para la enseñanza del reconocido libro "Precalculus - Mathematics for Calculus" de James Stewart.',
          image: 'images/departamento-inicial.jpeg',
          imageName: 'departamento-inicial.jpeg',
        },
        {
          id: this.generateId(),
          year: '2023',
          title: 'Primera Mudanza',
          description:
            'Con el crecimiento inicial y el reconocimiento de la calidad educativa, el Cursillo Stewart se mudó a nuevas instalaciones más amplias. Este cambio permitió recibir a más estudiantes y ofrecer mejores condiciones de aprendizaje, manteniendo siempre el enfoque personalizado que caracteriza nuestra metodología de enseñanza.',
          image: null,
        },
        {
          id: this.generateId(),
          year: '2025',
          title: 'Nueva Sede',
          description:
            'En nuestro tercer año de funcionamiento, nos establecimos en nuestra sede actual. Esta nueva mudanza representa el crecimiento sostenido y el compromiso continuo con la excelencia educativa. Con instalaciones modernas y un equipo docente ampliado, continuamos preparando a los futuros ingenieros y profesionales del Paraguay.',
          image: null,
        },
        {
          id: this.generateId(),
          year: 'Presente',
          title: 'Consolidación',
          description:
            'Hoy, tras tres años de dedicación y múltiples mudanzas que reflejan nuestro crecimiento, el Cursillo Stewart se ha consolidado como una institución de referencia en preparación universitaria. Los fundadores originales, junto con nuevos profesores especializados, continúan comprometidos con la formación académica de calidad, manteniendo vivo el espíritu emprendedor que dio origen a esta iniciativa educativa.',
          image: null,
        },
      ];
      this.saveTimelineData();
    }

    // Load titles
    const titleEl = document.getElementById('about-title');
    const descEl = document.getElementById('about-description');
    const savedContent = JSON.parse(localStorage.getItem('website_content') || '{}');

    if (titleEl) {
      titleEl.value = savedContent['about-title'] || 'Conócenos';
    }

    if (descEl) {
      descEl.value =
        savedContent['about-description'] ||
        'Descubre la historia y evolución del Cursillo Stewart, desde sus humildes inicios hasta convertirse en el programa de preparación universitaria más reconocido de Paraguay.';
    }

    this.renderTimeline();
  }

  generateId() {
    return 'timeline_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  renderTimeline() {
    const container = document.getElementById('timeline-entries');
    if (!container) return;

    container.innerHTML = '';

    // Sort by year
    const sorted = [...this.timelineData].sort((a, b) => {
      const yearA = a.year === 'Presente' ? 9999 : parseInt(a.year) || 0;
      const yearB = b.year === 'Presente' ? 9999 : parseInt(b.year) || 0;
      return yearA - yearB;
    });

    sorted.forEach(entry => {
      const entryEl = this.createTimelineEntry(entry);
      container.appendChild(entryEl);
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
               data-id="${entry.id}">
        <div class="timeline-controls-group">
          <button type="button" 
                  class="btn-delete-timeline" 
                  data-id="${entry.id}"
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
                   data-id="${entry.id}">
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea class="timeline-description" 
                      placeholder="Describe qué pasó en este año..."
                      data-id="${entry.id}">${entry.description || ''}</textarea>
          </div>
        </div>
        
        <div class="timeline-image-section">
          <label>Imagen (opcional):</label>
          <div class="timeline-image-upload ${entry.image ? 'has-image' : ''}" 
               data-id="${entry.id}">
            <input type="file" 
                   id="timeline-file-${entry.id}" 
                   accept="image/*" 
                   data-id="${entry.id}"
                   style="display: none;">
            
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

    // Bind events
    const yearInput = div.querySelector('.timeline-year-input');
    const titleInput = div.querySelector('.timeline-title-input');
    const descInput = div.querySelector('.timeline-description');
    const deleteBtn = div.querySelector('.btn-delete-timeline');
    const imageUpload = div.querySelector('.timeline-image-upload');
    const fileInput = div.querySelector('input[type="file"]');

    yearInput.addEventListener('change', e => this.updateYear(entry.id, e.target.value));
    titleInput.addEventListener('change', e => this.updateTitle(entry.id, e.target.value));
    descInput.addEventListener('change', e => this.updateDescription(entry.id, e.target.value));
    deleteBtn.addEventListener('click', () => this.deleteEntry(entry.id));
    imageUpload.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', e => this.updateImage(entry.id, e.target.files[0]));

    return div;
  }

  addTimelineEntry() {
    const newEntry = {
      id: this.generateId(),
      year: new Date().getFullYear().toString(),
      title: 'Nuevo Evento',
      description: 'Describe qué pasó en este año...',
      image: null,
      imageName: null,
    };

    this.timelineData.push(newEntry);
    this.saveTimelineData();
    this.renderTimeline();
    this.autoSave();
    showToast('Nueva entrada agregada', 'success');
  }

  updateYear(id, value) {
    const entry = this.timelineData.find(e => e.id === id);
    if (entry) {
      entry.year = value;
      this.saveTimelineData();
      this.renderTimeline(); // Re-render to resort
      this.autoSave();
    }
  }

  updateTitle(id, value) {
    const entry = this.timelineData.find(e => e.id === id);
    if (entry) {
      entry.title = value;
      this.saveTimelineData();
      this.autoSave();
    }
  }

  updateDescription(id, value) {
    const entry = this.timelineData.find(e => e.id === id);
    if (entry) {
      entry.description = value;
      this.saveTimelineData();
      this.autoSave();
    }
  }

  updateImage(id, file) {
    if (!file) return;

    // Validate
    if (file.size > 5 * 1024 * 1024) {
      showToast('La imagen no puede superar los 5MB', 'error');
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast('Solo se permiten archivos de imagen', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      const entry = this.timelineData.find(en => en.id === id);
      if (entry) {
        entry.image = e.target.result;
        entry.imageName = file.name;
        this.saveTimelineData();
        this.renderTimeline();
        this.autoSave();
        showToast('Imagen agregada', 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  deleteEntry(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      return;
    }

    this.timelineData = this.timelineData.filter(e => e.id !== id);
    this.saveTimelineData();
    this.renderTimeline();
    this.autoSave();
    showToast('Entrada eliminada', 'success');
  }

  saveTimelineData() {
    localStorage.setItem('timeline_data', JSON.stringify(this.timelineData));
  }

  restoreTimelineDefaults() {
    if (
      !confirm(
        '¿Restaurar timeline a valores por defecto? Se perderán todos los cambios actuales.'
      )
    ) {
      return;
    }

    localStorage.removeItem('timeline_data');
    this.loadTimeline();
    this.autoSave();
    showToast('Timeline restaurado', 'success');
  }

  saveAsTimelineDefaults() {
    const content = {
      'about-title': document.getElementById('about-title')?.value || 'Conócenos',
      'about-description':
        document.getElementById('about-description')?.value || 'Descubre nuestra historia...',
    };

    localStorage.setItem('default_timeline_data', JSON.stringify(this.timelineData));
    localStorage.setItem('default_timeline_timestamp', Date.now().toString());
    localStorage.setItem('default_conocenos_content', JSON.stringify(content));

    showToast('Configuración guardada como predeterminada', 'success');
  }

  autoSave() {
    const content = JSON.parse(localStorage.getItem('website_content') || '{}');
    
    content['about-title'] = document.getElementById('about-title')?.value || '';
    content['about-description'] = document.getElementById('about-description')?.value || '';
    content.timeline_data = this.timelineData;

    localStorage.setItem('website_content', JSON.stringify(content));
    localStorage.setItem('admin_update_timestamp', Date.now().toString());

    // Trigger event for homepage
    window.dispatchEvent(
      new CustomEvent('adminContentChange', { detail: content })
    );
  }
}

// ==================== SISTEMA DE CONTADOR REGRESIVO ====================
class CountdownSystem {
  constructor() {
    this.saveTimeout = null;
    this.defaultConfig = {
      enabled: true,
      title: "Próximo Cursillo Intensivo",
      titleColor: "#ffffff",
      subtitle: "¡No te pierdas nuestro próximo cursillo intensivo!",
      subtitleColor: "#ffffff",
      backgroundColor: "#dc2626",
      targetDate: this.getDefaultTargetDate(),
      timerBackground: "#1e40af",
      numbersColor: "#ffffff",
      ctaEnabled: true,
      ctaText: "Inscribirme Ahora",
      ctaButtonColor: "#dc2626",
      ctaTextColor: "#ffffff"
    };
  }

  /**
   * Obtiene una fecha objetivo por defecto (30 días desde hoy)
   */
  getDefaultTargetDate() {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setHours(8, 0, 0, 0);
    return date.toISOString().slice(0, 16);
  }

  /**
   * Inicializa el sistema
   */
  init() {
    this.loadConfig();
    this.bindEvents();
    this.updateColorLabels();
  }

  /**
   * Vincula eventos de los controles
   */
  bindEvents() {
    // Toggle principal para mostrar/ocultar countdown
    const enableCheckbox = document.getElementById("enable-countdown");
    const countdownOptions = document.getElementById("countdown-options");
    
    if (enableCheckbox) {
      enableCheckbox.addEventListener("change", (e) => {
        if (countdownOptions) {
          countdownOptions.style.display = e.target.checked ? "block" : "none";
        }
        this.scheduleAutoSave();
      });
    }

    // Toggle para CTA
    const ctaCheckbox = document.getElementById("enable-cta");
    const ctaOptions = document.getElementById("cta-options");
    
    if (ctaCheckbox) {
      ctaCheckbox.addEventListener("change", (e) => {
        if (ctaOptions) {
          ctaOptions.style.display = e.target.checked ? "block" : "none";
        }
        this.scheduleAutoSave();
      });
    }

    // Inputs de texto
    const textInputs = [
      "counters-title",
      "counters-subtitle",
      "cta-text"
    ];
    textInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", () => this.scheduleAutoSave());
      }
    });

    // Inputs de color con labels
    const colorInputs = [
      { id: "counters-title-color", labelId: null },
      { id: "counters-subtitle-color", labelId: null },
      { id: "counters-background-color", labelId: "background-color-label" },
      { id: "countdown-timer-background", labelId: "timer-background-label" },
      { id: "countdown-numbers-color", labelId: "numbers-color-label" },
      { id: "cta-button-color", labelId: "cta-color-label" },
      { id: "cta-text-color", labelId: "cta-text-color-label" }
    ];

    colorInputs.forEach(({ id, labelId }) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", (e) => {
          if (labelId) {
            const label = document.getElementById(labelId);
            if (label) {
              label.textContent = e.target.value;
            }
          }
          this.scheduleAutoSave();
        });
      }
    });

    // Input de fecha
    const dateInput = document.getElementById("countdown-date");
    if (dateInput) {
      dateInput.addEventListener("change", () => this.scheduleAutoSave());
    }
  }

  /**
   * Actualiza las etiquetas de colores
   */
  updateColorLabels() {
    const colorMappings = [
      { inputId: "counters-background-color", labelId: "background-color-label" },
      { inputId: "countdown-timer-background", labelId: "timer-background-label" },
      { inputId: "countdown-numbers-color", labelId: "numbers-color-label" },
      { inputId: "cta-button-color", labelId: "cta-color-label" },
      { inputId: "cta-text-color", labelId: "cta-text-color-label" }
    ];

    colorMappings.forEach(({ inputId, labelId }) => {
      const input = document.getElementById(inputId);
      const label = document.getElementById(labelId);
      if (input && label) {
        label.textContent = input.value;
      }
    });
  }

  /**
   * Carga la configuración guardada o valores por defecto
   */
  loadConfig() {
    const content = JSON.parse(localStorage.getItem("website_content") || "{}");
    const savedConfig = content.countdown || {};
    const config = { ...this.defaultConfig, ...savedConfig };

    // Aplicar valores a los controles
    this.setInputValue("enable-countdown", config.enabled, "checkbox");
    this.setInputValue("counters-title", config.title);
    this.setInputValue("counters-title-color", config.titleColor);
    this.setInputValue("counters-subtitle", config.subtitle);
    this.setInputValue("counters-subtitle-color", config.subtitleColor);
    this.setInputValue("counters-background-color", config.backgroundColor);
    this.setInputValue("countdown-date", config.targetDate);
    this.setInputValue("countdown-timer-background", config.timerBackground);
    this.setInputValue("countdown-numbers-color", config.numbersColor);
    this.setInputValue("enable-cta", config.ctaEnabled, "checkbox");
    this.setInputValue("cta-text", config.ctaText);
    this.setInputValue("cta-button-color", config.ctaButtonColor);
    this.setInputValue("cta-text-color", config.ctaTextColor);

    // Mostrar/ocultar opciones según los toggles
    const countdownOptions = document.getElementById("countdown-options");
    if (countdownOptions) {
      countdownOptions.style.display = config.enabled ? "block" : "none";
    }

    const ctaOptions = document.getElementById("cta-options");
    if (ctaOptions) {
      ctaOptions.style.display = config.ctaEnabled ? "block" : "none";
    }
  }

  /**
   * Establece el valor de un input
   */
  setInputValue(id, value, type = "text") {
    const input = document.getElementById(id);
    if (!input) return;

    if (type === "checkbox") {
      input.checked = value;
    } else {
      input.value = value || "";
    }
  }

  /**
   * Programa el autoguardado (debounce de 2 segundos)
   */
  scheduleAutoSave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    this.saveTimeout = setTimeout(() => this.autoSave(), 2000);
  }

  /**
   * Guarda automáticamente los cambios
   */
  autoSave() {
    const content = JSON.parse(localStorage.getItem("website_content") || "{}");
    
    content.countdown = {
      enabled: document.getElementById("enable-countdown")?.checked || false,
      title: document.getElementById("counters-title")?.value || "",
      titleColor: document.getElementById("counters-title-color")?.value || "#ffffff",
      subtitle: document.getElementById("counters-subtitle")?.value || "",
      subtitleColor: document.getElementById("counters-subtitle-color")?.value || "#ffffff",
      backgroundColor: document.getElementById("counters-background-color")?.value || "#dc2626",
      targetDate: document.getElementById("countdown-date")?.value || "",
      timerBackground: document.getElementById("countdown-timer-background")?.value || "#1e40af",
      numbersColor: document.getElementById("countdown-numbers-color")?.value || "#ffffff",
      ctaEnabled: document.getElementById("enable-cta")?.checked || false,
      ctaText: document.getElementById("cta-text")?.value || "",
      ctaButtonColor: document.getElementById("cta-button-color")?.value || "#dc2626",
      ctaTextColor: document.getElementById("cta-text-color")?.value || "#ffffff"
    };

    localStorage.setItem("website_content", JSON.stringify(content));
    localStorage.setItem("admin_update_timestamp", Date.now().toString());

    // Disparar evento para que homepage se actualice
    window.dispatchEvent(
      new CustomEvent("adminContentChange", { detail: content })
    );

    console.log("✅ Configuración del countdown guardada automáticamente");
  }

  /**
   * Restaura la configuración por defecto del sistema
   */
  restoreDefaults() {
    if (!confirm("¿Estás seguro de que deseas restaurar los valores por defecto del sistema?\n\nEsto eliminará tu configuración personalizada guardada.")) {
      return;
    }

    // Limpiar configuración guardada
    const content = JSON.parse(localStorage.getItem("website_content") || "{}");
    delete content.countdown;
    delete content.countdown_defaults;
    localStorage.setItem("website_content", JSON.stringify(content));

    // Recargar con valores por defecto
    this.loadConfig();
    this.updateColorLabels();

    // Guardar inmediatamente
    this.autoSave();

    alert("✅ Configuración restaurada a valores por defecto del sistema");
  }

  /**
   * Guarda la configuración actual como valores por defecto personalizados
   */
  saveAsDefaults() {
    if (!confirm("¿Deseas guardar la configuración actual como tus valores por defecto?\n\nEstos valores se usarán cuando restaures la configuración.")) {
      return;
    }

    const content = JSON.parse(localStorage.getItem("website_content") || "{}");
    
    const currentConfig = {
      enabled: document.getElementById("enable-countdown")?.checked || false,
      title: document.getElementById("counters-title")?.value || "",
      titleColor: document.getElementById("counters-title-color")?.value || "#ffffff",
      subtitle: document.getElementById("counters-subtitle")?.value || "",
      subtitleColor: document.getElementById("counters-subtitle-color")?.value || "#ffffff",
      backgroundColor: document.getElementById("counters-background-color")?.value || "#dc2626",
      targetDate: document.getElementById("countdown-date")?.value || "",
      timerBackground: document.getElementById("countdown-timer-background")?.value || "#1e40af",
      numbersColor: document.getElementById("countdown-numbers-color")?.value || "#ffffff",
      ctaEnabled: document.getElementById("enable-cta")?.checked || false,
      ctaText: document.getElementById("cta-text")?.value || "",
      ctaButtonColor: document.getElementById("cta-button-color")?.value || "#dc2626",
      ctaTextColor: document.getElementById("cta-text-color")?.value || "#ffffff"
    };

    content.countdown_defaults = currentConfig;
    localStorage.setItem("website_content", JSON.stringify(content));

    alert("✅ Configuración guardada como valores por defecto personalizados");
  }

  /**
   * Save countdown data (used by global save button)
   */
  saveCountdownData() {
    this.autoSave();
    console.log('✅ Countdown data saved');
  }
}

// ==================== SISTEMA DE INGRESANTES ====================
class IngresantesSystem {
  constructor() {
    this.apiBase = 'api/admin_api.php';
    this.currentExcelData = null;
    this.currentExamInfo = null;
  }

  init() {
    this.bindEvents();
    this.loadSavedLists();
    this.loadTitles();
  }

  bindEvents() {
    // Excel upload
    const excelInput = document.getElementById('inputExcel');
    if (excelInput) {
      excelInput.addEventListener('change', e => this.handleExcelFile(e));
    }

    // Cancelar preview
    const cancelBtn = document.querySelector('.btn-cancel-excel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.cancelExcelUpload());
    }

    // Títulos
    const saveTitlesBtn = document.getElementById('save-titles-btn');
    const resetTitlesBtn = document.getElementById('reset-titles-btn');

    if (saveTitlesBtn) {
      saveTitlesBtn.addEventListener('click', () => this.saveTitles());
    }

    if (resetTitlesBtn) {
      resetTitlesBtn.addEventListener('click', () => this.resetTitles());
    }
  }

  // ===== TÍTULOS =====
  loadTitles() {
    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (!titleEl || !subtitleEl) return;

    try {
      const saved = JSON.parse(localStorage.getItem('ingresantes_section_titles') || '{}');
      titleEl.value = saved.title || '🎓 Nuestros Ingresantes';
      subtitleEl.value =
        saved.subtitle ||
        'Conoce a los estudiantes que han confiado en nosotros para su preparación.';
    } catch (error) {
      console.error('Error cargando títulos:', error);
    }
  }

  saveTitles() {
    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (!titleEl || !subtitleEl) {
      showToast('Error: Elementos no encontrados', 'error');
      return;
    }

    const titles = {
      title: titleEl.value.trim(),
      subtitle: subtitleEl.value.trim(),
      lastUpdated: new Date().toISOString(),
    };

    if (!titles.title || !titles.subtitle) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    try {
      localStorage.setItem('ingresantes_section_titles', JSON.stringify(titles));
      localStorage.setItem('ingresantes_titles_changed', Date.now().toString());
      showToast('✅ Títulos guardados correctamente', 'success');
    } catch (error) {
      console.error('Error guardando títulos:', error);
      showToast('Error al guardar títulos', 'error');
    }
  }

  resetTitles() {
    if (!confirm('¿Restaurar los títulos por defecto?')) return;

    const titleEl = document.getElementById('ingresantes-title');
    const subtitleEl = document.getElementById('ingresantes-subtitle');

    if (titleEl && subtitleEl) {
      titleEl.value = '🎓 Nuestros Ingresantes';
      subtitleEl.value =
        'Conoce a los estudiantes que han confiado en nosotros para su preparación.';

      localStorage.removeItem('ingresantes_section_titles');
      localStorage.setItem('ingresantes_titles_changed', Date.now().toString());

      showToast('🔄 Títulos restaurados', 'success');
    }
  }

  // ===== EXCEL =====
  handleExcelFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        this.processExcelWorksheet(firstSheet, file.name);
      } catch (error) {
        console.error('Error leyendo Excel:', error);
        showToast('Error al leer el archivo Excel', 'error');
      }
    };

    reader.readAsArrayBuffer(file);
  }

  processExcelWorksheet(worksheet, fileName) {
    try {
      const examName = worksheet['H2'] ? worksheet['H2'].v : 'UPTP';
      const examYear = worksheet['H3'] ? worksheet['H3'].v : new Date().getFullYear();

      this.currentExamInfo = {
        name: examName,
        year: examYear,
        fileName: fileName,
      };

      const students = [];
      let row = 3;

      // Leer TODAS las filas hasta que no haya más datos
      while (true) {
        const nameCell = `A${row}`;
        if (!worksheet[nameCell] || !worksheet[nameCell].v) break;

        students.push({
          nombre: worksheet[nameCell].v,
          puntaje: parseFloat(worksheet[`B${row}`]?.v || 0) || 0,
          carrera: worksheet[`C${row}`]?.v || '',
          puesto: parseInt(worksheet[`D${row}`]?.v || 0) || 0,
          preferencial: this.normalizePreferencial(worksheet[`E${row}`]?.v || false),
        });

        row++;
      }

      this.currentExcelData = students;
      console.log(`✅ Procesados ${students.length} estudiantes`);
      this.showExcelPreview();
      this.addSaveButton();
    } catch (error) {
      console.error('Error procesando Excel:', error);
      showToast('Error al procesar el archivo', 'error');
    }
  }

  normalizePreferencial(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const lower = value.toLowerCase().trim();
      return ['si', 'sí', 'true', '1', 'yes'].includes(lower);
    }
    return false;
  }

  showExcelPreview() {
    const previewCard = document.getElementById('excel-preview-card');
    const excelInfo = document.getElementById('excel-info');
    const excelPreview = document.getElementById('excel-preview');

    if (!previewCard || !excelInfo || !excelPreview) return;

    excelInfo.innerHTML = `
      <h4>📋 Información del Examen</h4>
      <p><strong>Nombre:</strong> ${this.currentExamInfo.name}</p>
      <p><strong>Año:</strong> ${this.currentExamInfo.year}</p>
      <p><strong>Archivo:</strong> ${this.currentExamInfo.fileName}</p>
      <p><strong>Total de Ingresantes:</strong> ${this.currentExcelData.length}</p>
    `;

    // Mostrar TODA la lista (no solo 10)
    let tableHTML = `
      <div style="max-height: 500px; overflow-y: auto;">
        <table class="preview-table">
          <thead style="position: sticky; top: 0; background: #1a1a1a;">
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

    // Mostrar TODOS los estudiantes
    this.currentExcelData.forEach(student => {
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

    tableHTML += `
          </tbody>
        </table>
      </div>
      <p style="margin-top: 10px; text-align: center; color: #888;">
        Mostrando todos los ${this.currentExcelData.length} estudiantes
      </p>
    `;

    excelPreview.innerHTML = tableHTML;
    previewCard.style.display = 'block';
  }

  addSaveButton() {
    const previewCard = document.getElementById('excel-preview-card');
    if (!previewCard || previewCard.querySelector('.btn-save-excel')) return;

    let actionsContainer = previewCard.querySelector('.preview-actions');
    if (!actionsContainer) {
      actionsContainer = document.createElement('div');
      actionsContainer.className = 'preview-actions';
      actionsContainer.style.cssText =
        'margin-top: 1rem; text-align: center; gap: 1rem; display: flex; justify-content: center;';
      previewCard.appendChild(actionsContainer);
    }

    const saveButton = document.createElement('button');
    saveButton.className = 'btn-save-excel';
    saveButton.innerHTML = '💾 Guardar Lista Completa';
    saveButton.style.cssText =
      'background: #10b981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.375rem; font-weight: 600; cursor: pointer;';
    saveButton.onclick = () => this.saveExcelData();

    actionsContainer.insertBefore(saveButton, actionsContainer.firstChild);
  }

  async saveExcelData() {
    if (!this.currentExcelData || !this.currentExamInfo) {
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
        exam: this.currentExamInfo.name,
        year: this.currentExamInfo.year,
        meta: {
          archivo: this.currentExamInfo.fileName,
          total: this.currentExcelData.length,
          fecha: new Date().toISOString(),
        },
        items: this.currentExcelData,
      };

      console.log(`Guardando ${this.currentExcelData.length} estudiantes...`);

      const response = await fetch(`${this.apiBase}?action=import_ingresantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(
          `✅ ${this.currentExcelData.length} estudiantes guardados como ${result.key}`,
          'success'
        );
        await this.loadSavedLists();

        if (saveButton) {
          saveButton.innerHTML = '✅ Guardado';
          setTimeout(() => {
            saveButton.innerHTML = '💾 Guardar Lista Completa';
            saveButton.disabled = false;
          }, 2000);
        }
      } else {
        throw new Error(result.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error('Error guardando:', error);
      showToast('Error al guardar los datos', 'error');

      if (saveButton) {
        saveButton.innerHTML = '❌ Error';
        setTimeout(() => {
          saveButton.innerHTML = '💾 Guardar Lista Completa';
          saveButton.disabled = false;
        }, 2000);
      }
    }
  }

  cancelExcelUpload() {
    const input = document.getElementById('inputExcel');
    const previewCard = document.getElementById('excel-preview-card');

    if (input) input.value = '';
    if (previewCard) previewCard.style.display = 'none';

    this.currentExcelData = null;
    this.currentExamInfo = null;
  }

  // ===== LISTAS GUARDADAS =====
  async loadSavedLists() {
    const container = document.getElementById('gi-saved-list');
    if (!container) return;

    try {
      container.innerHTML = '<div class="gi-saved-loading">Cargando listas...</div>';

      const response = await fetch(`${this.apiBase}?action=list_exams`, {
        credentials: 'same-origin',
      });

      const examKeys = await response.json();

      if (!examKeys || examKeys.length === 0) {
        container.innerHTML = '<div class="gi-saved-empty">No hay listas guardadas aún.</div>';
        return;
      }

      const examDetails = await Promise.all(
        examKeys.map(async key => {
          try {
            const res = await fetch(`${this.apiBase}?action=get_ingresantes&key=${key}`, {
              credentials: 'same-origin',
            });
            return await res.json();
          } catch (error) {
            console.error(`Error cargando ${key}:`, error);
            return null;
          }
        })
      );

      const validExams = examDetails.filter(exam => exam !== null);
      this.renderSavedLists(validExams);
    } catch (error) {
      console.error('Error loading lists:', error);
      container.innerHTML = '<div class="gi-saved-empty">Error al cargar las listas.</div>';
    }
  }

  renderSavedLists(exams) {
    const container = document.getElementById('gi-saved-list');
    if (!container) return;

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
          <div class="gi-saved-date">📅 ${this.formatDate(exam.meta.fecha)}</div>
        </div>
        <div class="gi-saved-actions">
          <button class="btn-ver-lista gi-ver" onclick="ingresantesSystem.viewList('${
            exam.key
          }')">👁️ Ver</button>
          <button class="btn-editar-lista gi-editar" onclick="ingresantesSystem.editList('${
            exam.key
          }')">✏️ Editar</button>
          <button class="btn-eliminar-lista gi-eliminar" onclick="ingresantesSystem.deleteList('${
            exam.key
          }')">🗑️ Eliminar</button>
        </div>
      </div>
    `
      )
      .join('');

    container.innerHTML = html;
  }

  async viewList(key) {
    try {
      const response = await fetch(`${this.apiBase}?action=get_ingresantes&key=${key}`, {
        credentials: 'same-origin',
      });
      const examData = await response.json();

      this.currentExamInfo = {
        name: examData.exam,
        year: examData.year,
        fileName: examData.meta.archivo,
      };
      this.currentExcelData = examData.items;

      this.showExcelPreview();
      showToast(`Lista ${key} cargada (${examData.items.length} estudiantes)`, 'info');
    } catch (error) {
      console.error('Error:', error);
      showToast('Error al cargar la lista', 'error');
    }
  }

  async editList(key) {
    const newName = prompt(
      `Editar nombre de la lista:\nActual: ${key}\n\nFormato: EXAMEN-AÑO (ej: UPTP-2025)`,
      key
    );

    if (!newName || newName === key) return;

    if (!/^[A-Z0-9]+-\d{4}$/.test(newName)) {
      showToast('❌ Formato inválido. Usa: EXAMEN-AÑO', 'error');
      return;
    }

    try {
      const [exam, year] = newName.split('-');

      const response = await fetch(`${this.apiBase}?action=update_ingresantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ key, exam, year }),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(`✅ Lista renombrada: ${result.key}`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Error al editar', 'error');
    }
  }

  async deleteList(key) {
    if (!confirm(`¿Eliminar la lista "${key}"?\n\nEsta acción no se puede deshacer.`)) return;

    try {
      const response = await fetch(`${this.apiBase}?action=delete_ingresantes&key=${key}`, {
        method: 'POST',
        credentials: 'same-origin',
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast(`✅ Lista "${key}" eliminada`, 'success');
        await this.loadSavedLists();
        localStorage.setItem('ingresantes_update_timestamp', Date.now().toString());
      } else {
        throw new Error(result.error || 'Error');
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('❌ Error al eliminar', 'error');
    }
  }

  formatDate(dateString) {
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
}

// ==================== UTILIDADES ====================
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;

  const colors = {
    success: 'background: #10b981; color: white;',
    error: 'background: #ef4444; color: white;',
    info: 'background: #3b82f6; color: white;',
  };

  toast.style.cssText += colors[type] || colors.info;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);

// ==================== NAVEGACIÓN DE PESTAÑAS ====================
class TabNavigationSystem {
  constructor() {
    this.currentSection = 'inicio';
  }

  init() {
    console.log('📑 Inicializando navegación de pestañas...');
    this.bindTabButtons();
  }

  bindTabButtons() {
    const navTabs = document.querySelectorAll('.nav-tab');

    if (navTabs.length === 0) {
      console.warn('⚠️ No se encontraron pestañas de navegación');
      return;
    }

    navTabs.forEach(tab => {
      tab.addEventListener('click', e => {
        const targetSection = tab.dataset.section;
        if (targetSection) {
          this.switchToSection(targetSection);
        }
      });
    });

    console.log(`✅ ${navTabs.length} pestañas configuradas`);
  }

  switchToSection(sectionId) {
    console.log(`🔄 Cambiando a sección: ${sectionId}`);

    // Remover active de todas las pestañas
    const allTabs = document.querySelectorAll('.nav-tab');
    allTabs.forEach(tab => tab.classList.remove('active'));

    // Remover active de todas las secciones
    const allSections = document.querySelectorAll('.admin-section');
    allSections.forEach(section => section.classList.remove('active'));

    // Agregar active a la pestaña seleccionada
    const selectedTab = document.querySelector(`.nav-tab[data-section="${sectionId}"]`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }

    // Agregar active a la sección seleccionada
    const selectedSection = document.getElementById(`${sectionId}-section`);
    if (selectedSection) {
      selectedSection.classList.add('active');
      console.log(`✅ Sección "${sectionId}" activada`);
    } else {
      console.error(`❌ No se encontró la sección: ${sectionId}-section`);
    }

    this.currentSection = sectionId;
  }

  getCurrentSection() {
    return this.currentSection;
  }
}

// ==================== FUNCIÓN DE DESCARGA DE PLANTILLA ====================
window.downloadTemplate = function () {
  try {
    console.log('Iniciando descarga de plantilla...');

    // Create a link element to trigger the download
    const link = document.createElement('a');
    link.href = 'documents/Plantilla_de_Ingresantes.xlsx';
    link.download = 'Plantilla_de_Ingresantes.xlsx';
    link.setAttribute('target', '_blank');

    // Append to body temporarily
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Remove link after a short delay to ensure download started
    setTimeout(() => {
      document.body.removeChild(link);
      console.log('✅ Plantilla descargada exitosamente');

      // Show success message if available
      showMessage('Plantilla descargada exitosamente', 'success');
    }, 100);
  } catch (error) {
    console.error('❌ Error downloading template:', error);
    showMessage('Error al descargar la plantilla: ' + error.message, 'error');
  }
};

// Function to handle Excel file
window.handleExcelFile = function (event) {
  try {
    if (
      window.ingresantesSystem &&
      typeof window.ingresantesSystem.handleExcelFile === 'function'
    ) {
      window.ingresantesSystem.handleExcelFile(event);
    } else {
      console.error('❌ Sistema de ingresantes no disponible');
      showMessage('Error: Sistema no inicializado', 'error');
    }
  } catch (error) {
    console.error('❌ Error al procesar archivo:', error);
    showMessage('Error al procesar el archivo: ' + error.message, 'error');
  }
};

// Function to cancel Excel upload
window.cancelExcelUpload = function () {
  try {
    console.log('Cancelando carga de Excel...');

    if (
      window.ingresantesSystem &&
      typeof window.ingresantesSystem.cancelExcelUpload === 'function'
    ) {
      window.ingresantesSystem.cancelExcelUpload();
      console.log('✅ Carga cancelada exitosamente');
      showMessage('Carga cancelada', 'info');
    } else {
      // Fallback si el sistema no está disponible
      const input = document.getElementById('inputExcel');
      const previewCard = document.getElementById('excel-preview-card');

      if (input) input.value = '';
      if (previewCard) previewCard.style.display = 'none';

      console.log('✅ Carga cancelada (fallback)');
      showMessage('Carga cancelada', 'info');
    }
  } catch (error) {
    console.error('❌ Error al cancelar:', error);
    showMessage('Error al cancelar: ' + error.message, 'error');
  }
};

// ==================== SISTEMA DE CURSOS ====================
class CoursesSystem {
  constructor() {
    this.coursesData = null;
    this.currentCourse = null;
  }

  async init() {
    await this.loadCourses();
    this.loadTitles();
    this.bindEvents();
    this.renderCourseTabs();
  }

  async loadCourses() {
    try {
      const stored = localStorage.getItem('courses_data');
      if (stored) {
        this.coursesData = JSON.parse(stored);
      } else {
        const response = await fetch('data/courses.json');
        this.coursesData = await response.json();
        localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      this.coursesData = {};
    }
  }

  loadTitles() {
    const storedTitles = localStorage.getItem('courses_titles');
    let titles = storedTitles
      ? JSON.parse(storedTitles)
      : {
          mainTitle: 'Cursos',
          subtitle: '',
        };

    const mainTitleInput = document.getElementById('courses-main-title');
    const subtitleInput = document.getElementById('courses-subtitle');

    if (mainTitleInput) {
      mainTitleInput.value = titles.mainTitle;
      mainTitleInput.addEventListener('input', () => this.saveTitles());
    }

    if (subtitleInput) {
      subtitleInput.value = titles.subtitle;
      subtitleInput.addEventListener('input', () => this.saveTitles());
    }
  }

  saveTitles() {
    const mainTitle = document.getElementById('courses-main-title').value;
    const subtitle = document.getElementById('courses-subtitle').value;

    const titles = { mainTitle, subtitle };
    localStorage.setItem('courses_titles', JSON.stringify(titles));

    this.updateCoursesOnHomepage();
    showMessage('Títulos actualizados correctamente', 'success');
  }

  bindEvents() {
    const addCourseBtn = document.getElementById('add-course-btn');
    const addScheduleBtn = document.getElementById('add-schedule-btn');
    const deleteCourseBtn = document.getElementById('delete-course-btn');
    const courseName = document.getElementById('current-course-name');
    const colorPicker = document.getElementById('current-course-color');
    const colorHex = document.getElementById('current-course-color-hex');

    if (addCourseBtn) {
      addCourseBtn.addEventListener('click', () => this.addNewCourse());
    }

    if (addScheduleBtn) {
      addScheduleBtn.addEventListener('click', () => this.addNewSchedule());
    }

    if (deleteCourseBtn) {
      deleteCourseBtn.addEventListener('click', () => this.deleteCourse());
    }

    if (colorPicker && colorHex) {
      colorPicker.addEventListener('input', e => {
        colorHex.value = e.target.value;
        if (this.currentCourse) {
          this.coursesData[this.currentCourse].color = e.target.value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });

      colorHex.addEventListener('input', e => {
        const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
        colorPicker.value = value;
        if (this.currentCourse) {
          this.coursesData[this.currentCourse].color = value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });
    }

    if (courseName) {
      courseName.addEventListener('change', e => {
        if (this.currentCourse && this.coursesData[this.currentCourse]) {
          this.coursesData[this.currentCourse].name = e.target.value;
          this.renderCourseTabs();
          this.saveCourses();
        }
      });
    }
  }

  renderCourseTabs() {
    const tabsContainer = document.getElementById('courses-tabs');
    if (!tabsContainer || !this.coursesData) return;

    tabsContainer.innerHTML = '';

    Object.keys(this.coursesData).forEach(courseId => {
      const course = this.coursesData[courseId];
      const tab = document.createElement('button');
      tab.className = 'course-tab';
      tab.textContent = course.name;
      tab.style.color = course.color;
      tab.dataset.courseId = courseId;

      if (courseId === this.currentCourse) {
        tab.classList.add('active');
      }

      tab.addEventListener('click', () => {
        this.selectCourse(courseId);
      });

      tabsContainer.appendChild(tab);
    });

    if (!this.currentCourse && Object.keys(this.coursesData).length > 0) {
      this.selectCourse(Object.keys(this.coursesData)[0]);
    }
  }

  selectCourse(courseId) {
    this.currentCourse = courseId;
    this.renderCourseTabs();
    this.renderCourseEditor();
  }

  renderCourseEditor() {
    if (!this.currentCourse || !this.coursesData[this.currentCourse]) return;

    const course = this.coursesData[this.currentCourse];
    const courseName = document.getElementById('current-course-name');
    const courseColor = document.getElementById('current-course-color');
    const courseColorHex = document.getElementById('current-course-color-hex');

    if (courseName) courseName.value = course.name;
    if (courseColor) courseColor.value = course.color;
    if (courseColorHex) courseColorHex.value = course.color;

    this.renderSchedulesList();
  }

  renderSchedulesList() {
    const schedulesList = document.getElementById('schedules-list');
    if (!schedulesList || !this.currentCourse) return;

    const course = this.coursesData[this.currentCourse];
    schedulesList.innerHTML = '';

    if (!course.schedules || course.schedules.length === 0) {
      schedulesList.innerHTML =
        '<p style="text-align: center; color: var(--admin-text-light); padding: 20px;">No hay turnos agregados. Haz clic en "Agregar Turno" para crear uno.</p>';
      return;
    }

    course.schedules.forEach((schedule, index) => {
      const scheduleItem = document.createElement('div');
      scheduleItem.className = 'schedule-item';

      // Get custom colors or use defaults
      const defaultColors = {
        presencial: { bg: '#dbeafe', text: '#1e40af' },
        sabados: { bg: '#fef3c7', text: '#92400e' },
        virtual: { bg: '#dcfce7', text: '#166534' },
        mofa: { bg: '#fee2e2', text: '#991b1b' },
      };

      const bgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
      const textColor = schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';

      scheduleItem.innerHTML = `
        <div class="schedule-header-row">
          <h4 class="schedule-title">${schedule.title}</h4>
          <div class="schedule-actions">
            <button class="btn-icon edit" data-index="${index}" title="Editar">
              ✏️ Editar
            </button>
            <button class="btn-icon delete" data-index="${index}" title="Eliminar">
              🗑️ Eliminar
            </button>
          </div>
        </div>
        <div class="schedule-details">
          <div class="schedule-detail">
            <strong>Horario:</strong> ${schedule.time}
          </div>
          <div class="schedule-detail">
            <strong>Días:</strong> ${schedule.days}
          </div>
          <div class="schedule-detail">
            <strong>Período:</strong> ${schedule.period}
          </div>
        </div>
        <div class="schedule-type-badge ${schedule.type}" style="background: ${bgColor}; color: ${textColor};">
          ${schedule.typeLabel}
        </div>
      `;

      const editBtn = scheduleItem.querySelector('.btn-icon.edit');
      const deleteBtn = scheduleItem.querySelector('.btn-icon.delete');

      editBtn.addEventListener('click', () => this.editSchedule(index));
      deleteBtn.addEventListener('click', () => this.deleteSchedule(index));

      schedulesList.appendChild(scheduleItem);
    });
  }

  addNewSchedule() {
    if (!this.currentCourse) {
      showMessage('Selecciona un curso primero', 'error');
      return;
    }

    const newSchedule = {
      id: `${this.currentCourse}-${Date.now()}`,
      title: 'Nuevo Turno',
      type: 'presencial',
      typeLabel: 'Presencial',
      time: '9:00 - 12:00',
      days: 'Lunes a Viernes',
      period: 'Por definir',
      borderColor: '#2563eb',
    };

    this.coursesData[this.currentCourse].schedules.push(newSchedule);
    this.renderSchedulesList();
    this.saveCourses();

    setTimeout(() => {
      this.editSchedule(this.coursesData[this.currentCourse].schedules.length - 1);
    }, 100);
  }

  editSchedule(index) {
    const schedule = this.coursesData[this.currentCourse].schedules[index];

    // Default colors for each type
    const defaultColors = {
      presencial: { bg: '#dbeafe', text: '#1e40af' },
      sabados: { bg: '#fef3c7', text: '#92400e' },
      virtual: { bg: '#dcfce7', text: '#166534' },
      mofa: { bg: '#fee2e2', text: '#991b1b' },
    };

    // Get current colors or use defaults
    const currentBgColor = schedule.customBgColor || defaultColors[schedule.type]?.bg || '#dbeafe';
    const currentTextColor =
      schedule.customTextColor || defaultColors[schedule.type]?.text || '#1e40af';

    const modal = document.createElement('div');
    modal.className = 'schedule-modal active';
    modal.innerHTML = `
      <div class="schedule-modal-content">
        <div class="schedule-modal-header">
          <h3>Editar Turno</h3>
          <button class="schedule-modal-close">✕</button>
        </div>
        <div class="schedule-modal-body">
          <div class="form-group">
            <label>Título del Turno:</label>
            <input type="text" id="edit-schedule-title" value="${schedule.title}" />
          </div>
          <div class="form-group">
            <label>Tipo de Modalidad:</label>
            <select id="edit-schedule-type">
              <option value="presencial" ${
                schedule.type === 'presencial' ? 'selected' : ''
              }>Presencial</option>
              <option value="sabados" ${
                schedule.type === 'sabados' ? 'selected' : ''
              }>Sábados</option>
              <option value="virtual" ${
                schedule.type === 'virtual' ? 'selected' : ''
              }>Virtual</option>
              <option value="mofa" ${schedule.type === 'mofa' ? 'selected' : ''}>MOFA</option>
            </select>
          </div>
          <div class="form-group">
            <label>Etiqueta de Tipo:</label>
            <input type="text" id="edit-schedule-type-label" value="${schedule.typeLabel}" />
          </div>
          
          <div class="form-group">
            <h4 style="margin-bottom: 12px; color: var(--admin-text);">🎨 Colores del Turno</h4>
            
            <!-- Paleta de colores predeterminados -->
            <div style="margin-bottom: 16px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600;">🎨 Combinaciones Predeterminadas:</label>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px;">
                <button type="button" class="color-preset-btn" data-bg="#dbeafe" data-text="#1e40af" data-border="#2563eb" style="background: #dbeafe; color: #1e40af; border-left: 4px solid #2563eb; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🔵 Azul
                </button>
                <button type="button" class="color-preset-btn" data-bg="#dcfce7" data-text="#166534" data-border="#10b981" style="background: #dcfce7; color: #166534; border-left: 4px solid #10b981; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟢 Verde
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fee2e2" data-text="#991b1b" data-border="#dc2626" style="background: #fee2e2; color: #991b1b; border-left: 4px solid #dc2626; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🔴 Rojo
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fef3c7" data-text="#92400e" data-border="#f59e0b" style="background: #fef3c7; color: #92400e; border-left: 4px solid #f59e0b; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟡 Amarillo
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fed7aa" data-text="#7c2d12" data-border="#ea580c" style="background: #fed7aa; color: #7c2d12; border-left: 4px solid #ea580c; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟠 Naranja
                </button>
                <button type="button" class="color-preset-btn" data-bg="#fae8ff" data-text="#86198f" data-border="#c026d3" style="background: #fae8ff; color: #86198f; border-left: 4px solid #c026d3; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🟣 Morado
                </button>
                <button type="button" class="color-preset-btn" data-bg="#e0f2fe" data-text="#075985" data-border="#0284c7" style="background: #e0f2fe; color: #075985; border-left: 4px solid #0284c7; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  🩵 Celeste
                </button>
                <button type="button" class="color-preset-btn" data-bg="#f3f4f6" data-text="#1f2937" data-border="#6b7280" style="background: #f3f4f6; color: #1f2937; border-left: 4px solid #6b7280; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                  ⚫ Gris
                </button>
              </div>
            </div>

            <!-- Colores personalizados -->
            <div style="padding: 16px; background: var(--admin-bg); border-radius: 8px; border: 2px dashed var(--admin-border);">
              <label style="display: block; margin-bottom: 12px; font-weight: 600;">✏️ Personalizar Colores:</label>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <label style="display: block; margin-bottom: 8px;">Color de Fondo:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-bg-color" value="${currentBgColor}" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-bg-color-hex" value="${currentBgColor}" placeholder="#dbeafe" style="flex: 1;" />
                  </div>
                </div>
                <div>
                  <label style="display: block; margin-bottom: 8px;">Color de Texto:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-text-color" value="${currentTextColor}" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-text-color-hex" value="${currentTextColor}" placeholder="#1e40af" style="flex: 1;" />
                  </div>
                </div>
                <div style="grid-column: 1 / -1;">
                  <label style="display: block; margin-bottom: 8px;">Color del Borde Lateral:</label>
                  <div style="display: flex; gap: 10px; align-items: center;">
                    <input type="color" id="edit-schedule-border-color" value="${
                      schedule.borderColor || '#2563eb'
                    }" style="width: 60px; height: 40px; cursor: pointer;" />
                    <input type="text" id="edit-schedule-border-color-hex" value="${
                      schedule.borderColor || '#2563eb'
                    }" placeholder="#2563eb" style="flex: 1;" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Vista previa -->
            <div style="margin-top: 12px; padding: 12px; border-radius: 6px; background: var(--admin-bg);">
              <small style="color: var(--admin-text-light);">💡 Vista Previa:</small>
              <div id="color-preview" style="margin-top: 8px; padding: 8px 16px; border-radius: 12px; background: ${currentBgColor}; color: ${currentTextColor}; font-weight: 600; text-align: center; font-size: 13px; border-left: 4px solid ${
      schedule.borderColor || '#2563eb'
    };">
                ${schedule.typeLabel}
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Horario:</label>
            <input type="text" id="edit-schedule-time" value="${
              schedule.time
            }" placeholder="Ej: 8:00 - 12:00" />
          </div>
          <div class="form-group">
            <label>Días:</label>
            <input type="text" id="edit-schedule-days" value="${
              schedule.days
            }" placeholder="Ej: Lunes a Viernes" />
          </div>
          <div class="form-group">
            <label>Período:</label>
            <input type="text" id="edit-schedule-period" value="${
              schedule.period
            }" placeholder="Ej: Marzo - Noviembre" />
          </div>
        </div>
        <div class="schedule-modal-footer">
          <button class="btn-secondary modal-cancel">Cancelar</button>
          <button class="btn-primary modal-save">Guardar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Color picker sync
    const bgColorPicker = modal.querySelector('#edit-schedule-bg-color');
    const bgColorHex = modal.querySelector('#edit-schedule-bg-color-hex');
    const textColorPicker = modal.querySelector('#edit-schedule-text-color');
    const textColorHex = modal.querySelector('#edit-schedule-text-color-hex');
    const borderColorPicker = modal.querySelector('#edit-schedule-border-color');
    const borderColorHex = modal.querySelector('#edit-schedule-border-color-hex');
    const preview = modal.querySelector('#color-preview');

    const updatePreview = () => {
      preview.style.background = bgColorPicker.value;
      preview.style.color = textColorPicker.value;
      preview.style.borderLeftColor = borderColorPicker.value;
    };

    bgColorPicker.addEventListener('input', e => {
      bgColorHex.value = e.target.value;
      updatePreview();
    });

    bgColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      bgColorPicker.value = value;
      updatePreview();
    });

    textColorPicker.addEventListener('input', e => {
      textColorHex.value = e.target.value;
      updatePreview();
    });

    textColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      textColorPicker.value = value;
      updatePreview();
    });

    borderColorPicker.addEventListener('input', e => {
      borderColorHex.value = e.target.value;
      updatePreview();
    });

    borderColorHex.addEventListener('input', e => {
      const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
      borderColorPicker.value = value;
      updatePreview();
    });

    // Preset color buttons
    modal.querySelectorAll('.color-preset-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const bg = btn.dataset.bg;
        const text = btn.dataset.text;
        const border = btn.dataset.border;

        // Update color pickers
        bgColorPicker.value = bg;
        bgColorHex.value = bg;
        textColorPicker.value = text;
        textColorHex.value = text;
        borderColorPicker.value = border;
        borderColorHex.value = border;

        // Update preview
        updatePreview();
      });
    });

    modal.querySelector('.schedule-modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-cancel').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-save').addEventListener('click', () => {
      schedule.title = document.getElementById('edit-schedule-title').value;
      schedule.type = document.getElementById('edit-schedule-type').value;
      schedule.typeLabel = document.getElementById('edit-schedule-type-label').value;
      schedule.time = document.getElementById('edit-schedule-time').value;
      schedule.days = document.getElementById('edit-schedule-days').value;
      schedule.period = document.getElementById('edit-schedule-period').value;
      schedule.customBgColor = bgColorPicker.value;
      schedule.customTextColor = textColorPicker.value;
      schedule.borderColor = borderColorPicker.value;

      this.renderSchedulesList();
      this.saveCourses();
      modal.remove();
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove();
    });
  }

  deleteSchedule(index) {
    if (!confirm('¿Estás seguro de eliminar este turno?')) return;

    this.coursesData[this.currentCourse].schedules.splice(index, 1);
    this.renderSchedulesList();
    this.saveCourses();
  }

  addNewCourse() {
    const courseName = prompt('Nombre del nuevo curso:');
    if (!courseName) return;

    const courseId = courseName.toLowerCase().replace(/\s+/g, '-');

    if (this.coursesData[courseId]) {
      showMessage('Ya existe un curso con ese nombre', 'error');
      return;
    }

    this.coursesData[courseId] = {
      id: courseId,
      name: courseName,
      color: '#2563eb',
      schedules: [],
    };

    this.selectCourse(courseId);
    this.saveCourses();
  }

  deleteCourse() {
    if (!this.currentCourse) return;

    if (
      !confirm(`¿Estás seguro de eliminar el curso "${this.coursesData[this.currentCourse].name}"?`)
    )
      return;

    delete this.coursesData[this.currentCourse];
    this.currentCourse = null;
    this.renderCourseTabs();
    this.saveCourses();
  }

  saveCourses() {
    localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
    this.updateCoursesOnHomepage();
    showMessage('Cursos guardados correctamente', 'success');
  }

  updateCoursesOnHomepage() {
    try {
      const titles = localStorage.getItem('courses_titles');
      const courseTitles = titles ? JSON.parse(titles) : { mainTitle: 'Cursos', subtitle: '' };

      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'UPDATE_COURSES',
            data: this.coursesData,
            titles: courseTitles,
          },
          '*'
        );
      }
      localStorage.setItem('courses_data', JSON.stringify(this.coursesData));
    } catch (error) {
      console.error('Error updating homepage:', error);
    }
  }
}

// ==================== SISTEMA DE CALENDARIO ====================
class CalendarSystem {
  constructor() {
    this.calendarData = {
      title: 'Calendario de Eventos',
      subtitle: 'Mantente informado sobre fechas importantes',
      bgColor: '#f8fafc',
      dateCircleColor: '#1e3a8a',
      dateCircleText: '#ffffff',
      cardBg: '#ffffff',
      cardBorder: '#e2e8f0',
      events: [],
    };
  }

  init() {
    this.loadCalendar();
    this.bindEvents();
    this.renderEvents();
  }

  loadCalendar() {
    const stored = localStorage.getItem('calendar_data');
    if (stored) {
      this.calendarData = JSON.parse(stored);
    } else {
      // Cargar eventos por defecto
      this.calendarData.events = [
        {
          day: 15,
          month: 'Enero',
          year: 2024,
          title: 'Inicio de Inscripciones',
          description: 'Apertura del período de inscripciones para el cursillo',
        },
        {
          day: 1,
          month: 'Febrero',
          year: 2024,
          title: 'Inicio de Clases',
          description: 'Comienzo oficial del programa académico',
        },
        {
          day: 15,
          month: 'Marzo',
          year: 2024,
          title: 'Evaluación Parcial',
          description: 'Primera evaluación del progreso académico',
        },
        {
          day: 30,
          month: 'Abril',
          year: 2024,
          title: 'Examen Final',
          description: 'Evaluación final del cursillo',
        },
        {
          day: 15,
          month: 'Mayo',
          year: 2024,
          title: 'Graduación',
          description: 'Ceremonia de clausura y entrega de certificados',
        },
        {
          day: 1,
          month: 'Junio',
          year: 2024,
          title: 'Ingreso UPTP',
          description: 'Inicio del período universitario regular',
        },
      ];
      this.saveCalendar();
    }

    // Cargar valores en inputs
    document.getElementById('calendar-title').value = this.calendarData.title;
    document.getElementById('calendar-subtitle').value = this.calendarData.subtitle;

    // Colores
    this.setColorInputs('calendar-bg-color', this.calendarData.bgColor);
    this.setColorInputs('calendar-date-circle-color', this.calendarData.dateCircleColor);
    this.setColorInputs('calendar-date-circle-text', this.calendarData.dateCircleText);
    this.setColorInputs('calendar-card-bg', this.calendarData.cardBg);
    this.setColorInputs('calendar-card-border', this.calendarData.cardBorder);
  }

  setColorInputs(id, color) {
    const colorPicker = document.getElementById(id);
    const colorHex = document.getElementById(id + '-hex');

    if (colorPicker) colorPicker.value = color;
    if (colorHex) colorHex.value = color;
  }

  bindEvents() {
    // Inputs de título y subtítulo
    const titleInput = document.getElementById('calendar-title');
    const subtitleInput = document.getElementById('calendar-subtitle');

    if (titleInput) {
      titleInput.addEventListener('input', () => {
        this.calendarData.title = titleInput.value;
        this.saveCalendar();
      });
    }

    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => {
        this.calendarData.subtitle = subtitleInput.value;
        this.saveCalendar();
      });
    }

    // Color pickers
    this.bindColorPicker('calendar-bg-color', 'bgColor');
    this.bindColorPicker('calendar-date-circle-color', 'dateCircleColor');
    this.bindColorPicker('calendar-date-circle-text', 'dateCircleText');
    this.bindColorPicker('calendar-card-bg', 'cardBg');
    this.bindColorPicker('calendar-card-border', 'cardBorder');

    // Botón agregar evento
    const addBtn = document.getElementById('add-calendar-event-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => this.addNewEvent());
    }
  }

  bindColorPicker(id, property) {
    const colorPicker = document.getElementById(id);
    const colorHex = document.getElementById(id + '-hex');

    if (colorPicker) {
      colorPicker.addEventListener('input', e => {
        this.calendarData[property] = e.target.value;
        if (colorHex) colorHex.value = e.target.value;
        this.saveCalendar();
      });
    }

    if (colorHex) {
      colorHex.addEventListener('input', e => {
        const value = e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value;
        this.calendarData[property] = value;
        if (colorPicker) colorPicker.value = value;
        this.saveCalendar();
      });
    }
  }

  renderEvents() {
    const container = document.getElementById('calendar-events-container');
    if (!container) return;

    container.innerHTML = '';

    if (this.calendarData.events.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; color: #64748b; padding: 2rem;">No hay eventos agregados aún. Haz clic en "Agregar Nuevo Evento" para comenzar.</p>';
      return;
    }

    this.calendarData.events.forEach((event, index) => {
      const eventCard = document.createElement('div');
      eventCard.className = 'calendar-event-card';
      eventCard.innerHTML = `
        <div class="calendar-event-header">
          <h4>Evento ${index + 1}</h4>
          <button class="btn-delete-event" onclick="calendarSystem.deleteEvent(${index})" title="Eliminar evento">
            🗑️
          </button>
        </div>
        <div class="calendar-event-body">
          <div class="form-group">
            <label>Día:</label>
            <input type="number" class="form-input" min="1" max="31" value="${event.day}" 
              onchange="calendarSystem.updateEvent(${index}, 'day', this.value)" />
          </div>
          <div class="form-group">
            <label>Mes:</label>
            <input type="text" class="form-input" value="${event.month}" 
              onchange="calendarSystem.updateEvent(${index}, 'month', this.value)" />
          </div>
          <div class="form-group">
            <label>Año:</label>
            <input type="number" class="form-input" value="${event.year}" 
              onchange="calendarSystem.updateEvent(${index}, 'year', this.value)" />
          </div>
          <div class="form-group">
            <label>Título del Evento:</label>
            <input type="text" class="form-input" value="${event.title}" 
              onchange="calendarSystem.updateEvent(${index}, 'title', this.value)" />
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea class="form-input" rows="2" 
              onchange="calendarSystem.updateEvent(${index}, 'description', this.value)">${
        event.description
      }</textarea>
          </div>
        </div>
      `;
      container.appendChild(eventCard);
    });
  }

  addNewEvent() {
    const newEvent = {
      day: 1,
      month: 'Enero',
      year: new Date().getFullYear(),
      title: 'Nuevo Evento',
      description: 'Descripción del evento',
    };

    this.calendarData.events.push(newEvent);
    this.renderEvents();
    this.saveCalendar();
  }

  updateEvent(index, field, value) {
    if (field === 'day' || field === 'year') {
      value = parseInt(value);
    }
    this.calendarData.events[index][field] = value;
    this.saveCalendar();
  }

  deleteEvent(index) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;

    this.calendarData.events.splice(index, 1);
    this.renderEvents();
    this.saveCalendar();
  }

  saveCalendar() {
    localStorage.setItem('calendar_data', JSON.stringify(this.calendarData));
    this.updateCalendarOnHomepage();
    showMessage('Calendario actualizado correctamente', 'success');
  }

  updateCalendarOnHomepage() {
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage(
          {
            type: 'UPDATE_CALENDAR',
            data: this.calendarData,
          },
          '*'
        );
      }
    } catch (error) {
      console.error('Error updating homepage calendar:', error);
    }
  }

  // Aplicar preset de colores
  applyColorPreset(preset) {
    const presets = {
      blue: {
        bgColor: '#f8fafc',
        dateCircleColor: '#1e3a8a',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#dbeafe',
      },
      red: {
        bgColor: '#fef2f2',
        dateCircleColor: '#dc2626',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#fecaca',
      },
      green: {
        bgColor: '#f0fdf4',
        dateCircleColor: '#059669',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#bbf7d0',
      },
      purple: {
        bgColor: '#faf5ff',
        dateCircleColor: '#7c3aed',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e9d5ff',
      },
      orange: {
        bgColor: '#fff7ed',
        dateCircleColor: '#ea580c',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#fed7aa',
      },
      teal: {
        bgColor: '#f0fdfa',
        dateCircleColor: '#0d9488',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#99f6e4',
      },
    };

    if (presets[preset]) {
      const colors = presets[preset];

      // Actualizar datos
      this.calendarData.bgColor = colors.bgColor;
      this.calendarData.dateCircleColor = colors.dateCircleColor;
      this.calendarData.dateCircleText = colors.dateCircleText;
      this.calendarData.cardBg = colors.cardBg;
      this.calendarData.cardBorder = colors.cardBorder;

      // Actualizar inputs
      this.setColorInputs('calendar-bg-color', colors.bgColor);
      this.setColorInputs('calendar-date-circle-color', colors.dateCircleColor);
      this.setColorInputs('calendar-date-circle-text', colors.dateCircleText);
      this.setColorInputs('calendar-card-bg', colors.cardBg);
      this.setColorInputs('calendar-card-border', colors.cardBorder);

      // Guardar
      this.saveCalendar();
      showMessage(`Tema ${preset} aplicado correctamente`, 'success');
    }
  }

  // Restaurar configuración por defecto del sistema
  restoreDefaultCalendar() {
    if (
      !confirm(
        '¿Estás seguro de restaurar la configuración por defecto del sistema? Esto sobrescribirá tu configuración actual.'
      )
    ) {
      return;
    }

    const defaultConfig = localStorage.getItem('calendar_default_config');

    if (defaultConfig) {
      this.calendarData = JSON.parse(defaultConfig);
    } else {
      // Configuración por defecto del sistema
      this.calendarData = {
        title: 'Calendario de Eventos',
        subtitle: 'Mantente informado sobre fechas importantes',
        bgColor: '#f8fafc',
        dateCircleColor: '#1e3a8a',
        dateCircleText: '#ffffff',
        cardBg: '#ffffff',
        cardBorder: '#e2e8f0',
        events: [
          {
            day: 15,
            month: 'Enero',
            year: 2024,
            title: 'Inicio de Inscripciones',
            description: 'Apertura del período de inscripciones para el cursillo',
          },
          {
            day: 1,
            month: 'Febrero',
            year: 2024,
            title: 'Inicio de Clases',
            description: 'Comienzo oficial del programa académico',
          },
          {
            day: 15,
            month: 'Marzo',
            year: 2024,
            title: 'Evaluación Parcial',
            description: 'Primera evaluación del progreso académico',
          },
          {
            day: 30,
            month: 'Abril',
            year: 2024,
            title: 'Examen Final',
            description: 'Evaluación final del cursillo',
          },
          {
            day: 15,
            month: 'Mayo',
            year: 2024,
            title: 'Graduación',
            description: 'Ceremonia de clausura y entrega de certificados',
          },
          {
            day: 1,
            month: 'Junio',
            year: 2024,
            title: 'Ingreso UPTP',
            description: 'Inicio del período universitario regular',
          },
        ],
      };
    }

    // Actualizar todos los inputs
    document.getElementById('calendar-title').value = this.calendarData.title;
    document.getElementById('calendar-subtitle').value = this.calendarData.subtitle;

    this.setColorInputs('calendar-bg-color', this.calendarData.bgColor);
    this.setColorInputs('calendar-date-circle-color', this.calendarData.dateCircleColor);
    this.setColorInputs('calendar-date-circle-text', this.calendarData.dateCircleText);
    this.setColorInputs('calendar-card-bg', this.calendarData.cardBg);
    this.setColorInputs('calendar-card-border', this.calendarData.cardBorder);

    // Re-renderizar eventos
    this.renderEvents();

    // Guardar
    this.saveCalendar();
    showMessage('Configuración restaurada correctamente', 'success');
  }

  // Guardar configuración actual como predeterminada
  saveAsDefaultCalendar() {
    if (
      !confirm(
        '¿Guardar la configuración actual como predeterminada? Esta será la configuración que se restaurará al usar "Restaurar por Defecto".'
      )
    ) {
      return;
    }

    localStorage.setItem('calendar_default_config', JSON.stringify(this.calendarData));
    showMessage('Configuración guardada como predeterminada', 'success');
  }
}

// ==================== SISTEMA DE CONTACTO ====================
class ContactSystem {
  constructor() {
    this.storageKey = 'website_content';
  }

  init() {
    this.loadContactData();
    this.bindContactInputs();
    console.log('📞 ContactSystem initialized');
  }

  loadContactData() {
    try {
      const savedContent = localStorage.getItem(this.storageKey);
      if (!savedContent) return;

      const content = JSON.parse(savedContent);

      // Load titles and colors
      this.setInputValue('contact-section-title-input', content['contact-section-title-input']);
      this.setInputValue(
        'contact-section-description-input',
        content['contact-section-description-input']
      );
      this.setInputValue('contact-form-title-input', content['contact-form-title-input']);
      this.setInputValue('contact-info-title-input', content['contact-info-title-input']);

      // Load colors
      this.setInputValue(
        'contact-section-title-color',
        content['contact-section-title-color'] || '#002147'
      );
      this.setInputValue(
        'contact-form-title-color',
        content['contact-form-title-color'] || '#002147'
      );
      this.setInputValue(
        'contact-info-title-color',
        content['contact-info-title-color'] || '#002147'
      );

      // Load contact information
      this.setInputValue('contact-phone-input', content['contact-phone-input']);
      this.setInputValue('contact-email-input', content['contact-email-input']);
      this.setInputValue('contact-address-input', content['contact-address-input']);
      this.setInputValue('contact-hours-input', content['contact-hours-input']);

      // Load map URL
      this.setInputValue('contact-map-url', content['contact-map-url']);

      // Load inscription form texts
      this.setInputValue('inscription-title-input', content['inscription-title-input']);
      this.setInputValue('inscription-subtitle-input', content['inscription-subtitle-input']);
      this.setInputValue('inscription-welcome-input', content['inscription-welcome-input']);

      console.log('✅ Contact data loaded');
    } catch (error) {
      console.error('Error loading contact data:', error);
    }
  }

  setInputValue(id, value) {
    const element = document.getElementById(id);
    if (element && value !== undefined && value !== null) {
      element.value = value;
    }
  }

  bindContactInputs() {
    const contactInputIds = [
      'contact-section-title-input',
      'contact-section-description-input',
      'contact-form-title-input',
      'contact-info-title-input',
      'contact-section-title-color',
      'contact-form-title-color',
      'contact-info-title-color',
      'contact-phone-input',
      'contact-email-input',
      'contact-address-input',
      'contact-hours-input',
      'contact-map-url',
      'inscription-title-input',
      'inscription-subtitle-input',
      'inscription-welcome-input',
    ];

    contactInputIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => {
          this.saveContactData();
        });
      }
    });

    console.log('📞 Contact inputs bound');
  }

  saveContactData() {
    try {
      // Get all existing content
      const existingContent = JSON.parse(localStorage.getItem(this.storageKey) || '{}');

      // Update contact fields
      const contactInputIds = [
        'contact-section-title-input',
        'contact-section-description-input',
        'contact-form-title-input',
        'contact-info-title-input',
        'contact-section-title-color',
        'contact-form-title-color',
        'contact-info-title-color',
        'contact-phone-input',
        'contact-email-input',
        'contact-address-input',
        'contact-hours-input',
        'contact-map-url',
        'inscription-title-input',
        'inscription-subtitle-input',
        'inscription-welcome-input',
      ];

      contactInputIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
          existingContent[id] = element.value;
        }
      });

      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(existingContent));
      localStorage.setItem('pending_homepage_updates', JSON.stringify(existingContent));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      // Dispatch event for real-time update
      window.dispatchEvent(new CustomEvent('adminContentChange', { detail: existingContent }));

      console.log('✅ Contact data saved');
    } catch (error) {
      console.error('Error saving contact data:', error);
    }
  }

  /**
   * Apply color preset to contact section
   */
  applyContactColorPreset(presetName) {
    const presets = {
      blue: '#002147',
      red: '#dc2626',
      green: '#059669',
      purple: '#7c3aed',
      orange: '#ea580c',
      teal: '#0d9488',
    };

    const color = presets[presetName];
    if (!color) return;

    // Apply to all three color pickers
    const titleColor = document.getElementById('contact-section-title-color');
    const formTitleColor = document.getElementById('contact-form-title-color');
    const infoTitleColor = document.getElementById('contact-info-title-color');

    if (titleColor) titleColor.value = color;
    if (formTitleColor) formTitleColor.value = color;
    if (infoTitleColor) infoTitleColor.value = color;

    // Save changes
    this.saveContactData();

    // Show feedback
    this.showMessage(`Colores aplicados: ${presetName}`, 'success');
  }

  /**
   * Show temporary message
   */
  showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  /**
   * Save all contact data (used by global save button)
   */
  saveAllContactData() {
    this.saveContactData();
    console.log('✅ All contact data saved');
  }
}

// ==================== SISTEMA DE REDES SOCIALES ====================
class SocialMediaSystem {
  constructor() {
    this.storageKey = 'social_media_links';
  }

  init() {
    this.loadData();
    this.bindEvents();
  }

  bindEvents() {
    const inputs = ['facebook-url', 'instagram-url', 'tiktok-url', 'twitter-url', 'whatsapp-link'];

    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.saveData());
      }
    });
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return;

      const data = JSON.parse(saved);

      Object.entries(data).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
          element.value = value || '';
        }
      });
    } catch (error) {
      console.error('Error loading social media data:', error);
    }
  }

  saveData() {
    try {
      const data = {
        'facebook-url': document.getElementById('facebook-url')?.value || '',
        'instagram-url': document.getElementById('instagram-url')?.value || '',
        'tiktok-url': document.getElementById('tiktok-url')?.value || '',
        'twitter-url': document.getElementById('twitter-url')?.value || '',
        'whatsapp-link': document.getElementById('whatsapp-link')?.value || '',
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      localStorage.setItem('pending_homepage_updates', JSON.stringify(data));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      window.dispatchEvent(new CustomEvent('socialMediaChange', { detail: data }));
      console.log('✅ Social media links saved');
    } catch (error) {
      console.error('Error saving social media data:', error);
    }
  }

  /**
   * Save all data (used by global save button)
   */
  saveAllData() {
    this.saveData();
    console.log('✅ All social media data saved');
  }
}

// ==================== SISTEMA DE PROFESORES ====================
class ProfesoresSystem {
  constructor() {
    this.storageKey = 'profesores_settings';
    this.profesores = [];
    this.cropper = null;
    this.currentIndex = null;
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.renderProfesoresList();
  }

  bindEvents() {
    const titleInput = document.getElementById('profesores-section-title');
    const subtitleInput = document.getElementById('profesores-section-subtitle');

    if (titleInput) {
      titleInput.addEventListener('input', () => this.saveData());
    }
    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => this.saveData());
    }
  }

  loadData() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsed = JSON.parse(data);
        this.profesores = parsed.profesores || [];

        const titleInput = document.getElementById('profesores-section-title');
        const subtitleInput = document.getElementById('profesores-section-subtitle');

        if (titleInput && parsed.title) titleInput.value = parsed.title;
        if (subtitleInput && parsed.subtitle) subtitleInput.value = parsed.subtitle;
      }
    } catch (error) {
      console.error('Error loading profesores data:', error);
    }
  }

  saveData() {
    try {
      const titleInput = document.getElementById('profesores-section-title');
      const subtitleInput = document.getElementById('profesores-section-subtitle');

      const data = {
        title: titleInput ? titleInput.value : 'Equipo Docente Profesionales',
        subtitle: subtitleInput
          ? subtitleInput.value
          : 'Conoce al equipo que te guiará hacia el éxito académico',
        profesores: this.profesores,
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      console.log('✅ Profesores data saved');
    } catch (error) {
      console.error('Error saving profesores data:', error);
    }
  }

  renderProfesoresList() {
    const container = document.getElementById('profesores-list');
    if (!container) return;

    container.innerHTML = '';

    this.profesores.forEach((profesor, index) => {
      const card = this.createProfesorCard(profesor, index);
      container.appendChild(card);
    });
  }

  createProfesorCard(profesor, index) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.style.marginBottom = '1rem';
    card.style.background = 'var(--admin-card-bg)';
    card.style.padding = '1.5rem';

    const initials = profesor.nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    card.innerHTML = `
      <div style="display: flex; gap: 1.5rem; align-items: start; flex-wrap: wrap;">
        <div style="flex-shrink: 0;">
          ${
            profesor.imagen
              ? `<img src="${profesor.imagen}" alt="${profesor.nombre}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);" />`
              : `<div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #002147, #004080); color: white; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: bold;">${initials}</div>`
          }
          <div 
            id="dropzone-${index}" 
            style="
              margin-top: 1rem;
              border: 2px dashed #ccc;
              border-radius: 0.5rem;
              padding: 1rem;
              text-align: center;
              cursor: pointer;
              transition: all 0.3s;
              background: var(--admin-bg);
            "
            ondragover="event.preventDefault(); this.style.borderColor='#002147'; this.style.background='rgba(0,33,71,0.1)';"
            ondragleave="this.style.borderColor='#ccc'; this.style.background='var(--admin-bg)';"
            ondrop="profesoresSystem.handleDrop(event, ${index})"
            onclick="document.getElementById('file-input-${index}').click()"
          >
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">📷</div>
            <div style="font-size: 0.875rem; color: var(--admin-text-light);">
              Arrastra imágenes aquí<br>o haz clic para seleccionar
            </div>
          </div>
          <input 
            type="file" 
            id="file-input-${index}" 
            accept="image/*" 
            style="display: none;" 
            onchange="profesoresSystem.handleFileSelect(event, ${index})"
          />
        </div>
        <div style="flex-grow: 1; min-width: 300px;">
          <div class="form-group">
            <label>Nombre del Profesor:</label>
            <input type="text" id="profesor-nombre-${index}" value="${profesor.nombre}" />
          </div>
          <div class="form-group">
            <label>Cargo/Especialidad:</label>
            <input type="text" id="profesor-cargo-${index}" value="${
      profesor.cargo || ''
    }" placeholder="Ej: Especialista en Cálculo" />
          </div>
          <div class="form-group">
            <label>Descripción:</label>
            <textarea id="profesor-descripcion-${index}" rows="3" style="resize: vertical;">${
      profesor.descripcion
    }</textarea>
          </div>
          <div class="form-group">
            <label>Logros (uno por línea):</label>
            <textarea id="profesor-logros-${index}" rows="3" style="resize: vertical;" placeholder="Logro 1&#10;Logro 2&#10;Logro 3">${(
      profesor.logros || []
    ).join('\n')}</textarea>
          </div>
          
          <div style="border-top: 1px solid #ddd; margin: 1rem 0; padding-top: 1rem;">
            <label style="font-weight: 600; margin-bottom: 0.5rem; display: block;">🌐 Redes Sociales:</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.75rem;">
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.875rem;">Facebook:</label>
                <input type="url" id="profesor-facebook-${index}" value="${
      profesor.redes?.facebook || ''
    }" placeholder="https://facebook.com/..." />
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.875rem;">Instagram:</label>
                <input type="url" id="profesor-instagram-${index}" value="${
      profesor.redes?.instagram || ''
    }" placeholder="https://instagram.com/..." />
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.875rem;">Twitter/X:</label>
                <input type="url" id="profesor-twitter-${index}" value="${
      profesor.redes?.twitter || ''
    }" placeholder="https://twitter.com/..." />
              </div>
              <div class="form-group" style="margin: 0;">
                <label style="font-size: 0.875rem;">LinkedIn:</label>
                <input type="url" id="profesor-linkedin-${index}" value="${
      profesor.redes?.linkedin || ''
    }" placeholder="https://linkedin.com/..." />
              </div>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button type="button" class="btn-primary" onclick="profesoresSystem.updateProfesor(${index})" style="flex: 1;">
              💾 Guardar Cambios
            </button>
            <button type="button" class="btn-danger" onclick="profesoresSystem.deleteProfesor(${index})" style="background: #dc2626;">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  handleDrop(event, index) {
    event.preventDefault();
    event.stopPropagation();

    const dropzone = event.currentTarget;
    dropzone.style.borderColor = '#ccc';
    dropzone.style.background = 'var(--admin-bg)';

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.processImage(files[0], index);
    }
  }

  handleFileSelect(event, index) {
    const files = event.target.files;
    if (files.length > 0) {
      this.processImage(files[0], index);
    }
  }

  processImage(file, index) {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      this.currentIndex = index;
      this.showCropModal(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  showCropModal(imageSrc) {
    const modal = document.getElementById('crop-modal');
    const image = document.getElementById('crop-image');

    if (modal && image) {
      image.src = imageSrc;
      modal.style.display = 'flex';

      // Destruir cropper anterior si existe
      if (this.cropper) {
        this.cropper.destroy();
      }

      // Crear nuevo cropper
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    }
  }

  applyCrop() {
    if (this.cropper && this.currentIndex !== null) {
      const canvas = this.cropper.getCroppedCanvas({
        width: 300,
        height: 300,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      const croppedImage = canvas.toDataURL('image/jpeg', 0.9);

      // Guardar imagen
      this.profesores[this.currentIndex].imagen = croppedImage;
      this.saveData();
      this.renderProfesoresList();
      this.cancelCrop();
    }
  }

  cancelCrop() {
    const modal = document.getElementById('crop-modal');
    if (modal) {
      modal.style.display = 'none';
    }
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = null;
    }
    this.currentIndex = null;
  }

  addProfesor() {
    const newProfesor = {
      nombre: 'Nuevo Profesor',
      cargo: 'Cargo/Especialidad',
      imagen: '',
      descripcion: 'Descripción del profesor',
      logros: ['Logro 1', 'Logro 2', 'Logro 3'],
      redes: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
      },
    };

    this.profesores.push(newProfesor);
    this.saveData();
    this.renderProfesoresList();
  }

  updateProfesor(index) {
    const nombreInput = document.getElementById(`profesor-nombre-${index}`);
    const cargoInput = document.getElementById(`profesor-cargo-${index}`);
    const descripcionInput = document.getElementById(`profesor-descripcion-${index}`);
    const logrosInput = document.getElementById(`profesor-logros-${index}`);
    const facebookInput = document.getElementById(`profesor-facebook-${index}`);
    const instagramInput = document.getElementById(`profesor-instagram-${index}`);
    const twitterInput = document.getElementById(`profesor-twitter-${index}`);
    const linkedinInput = document.getElementById(`profesor-linkedin-${index}`);

    if (nombreInput && descripcionInput) {
      this.profesores[index] = {
        ...this.profesores[index],
        nombre: nombreInput.value,
        cargo: cargoInput ? cargoInput.value : '',
        descripcion: descripcionInput.value,
        logros: logrosInput ? logrosInput.value.split('\n').filter(l => l.trim()) : [],
        redes: {
          facebook: facebookInput ? facebookInput.value : '',
          instagram: instagramInput ? instagramInput.value : '',
          twitter: twitterInput ? twitterInput.value : '',
          linkedin: linkedinInput ? linkedinInput.value : '',
        },
      };

      this.saveData();
      this.renderProfesoresList();
      alert('✅ Profesor actualizado correctamente');
    }
  }

  deleteProfesor(index) {
    if (confirm('¿Eliminar este profesor?')) {
      this.profesores.splice(index, 1);
      this.saveData();
      this.renderProfesoresList();
    }
  }
}

// ==================== SISTEMA DE FOOTER ====================
class FooterEditorSystem {
  constructor() {
    this.storageKey = 'footer_settings';
  }

  init() {
    this.loadData();
    this.bindEvents();
    this.initImageUpload();
  }

  bindEvents() {
    const inputs = [
      'footer-bg-color',
      'footer-text-color',
      'footer-description',
      'footer-copyright',
      'footer-logo-url',
    ];

    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.saveData());
      }
    });
  }

  initImageUpload() {
    const uploadZone = document.getElementById('footer-logo-upload-zone');
    const fileInput = document.getElementById('footer-logo-input');
    const preview = document.getElementById('footer-logo-preview');
    const urlInput = document.getElementById('footer-logo-url');

    if (!uploadZone || !fileInput || !preview) return;

    // Click to upload
    uploadZone.addEventListener('click', () => fileInput.click());

    // File input change
    fileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (file) {
        this.handleImageFile(file);
      }
    });

    // Drag & drop
    uploadZone.addEventListener('dragover', e => {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
      uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', e => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.handleImageFile(file);
      }
    });

    // URL input - update preview when URL changes
    if (urlInput) {
      urlInput.addEventListener('input', () => {
        const url = urlInput.value.trim();
        if (url) {
          preview.src = url;
          preview.style.display = 'block';
          uploadZone.classList.add('has-image');
        }
      });
    }
  }

  handleImageFile(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.showMessage('❌ La imagen es demasiado grande (máximo 5MB)', 'error');
      return;
    }

    // Read file and convert to base64
    const reader = new FileReader();
    reader.onload = e => {
      const originalBase64 = e.target.result;
      
      // Crear thumbnail optimizado para el logo del footer
      const img = new Image();
      img.onload = () => {
        // Configuración del logo thumbnail
        const maxCSS = 200; // Tamaño máximo en píxeles CSS
        const dpr = window.devicePixelRatio || 1;
        
        // Calcular dimensiones CSS manteniendo proporción (sin upscale)
        let cssWidth = img.width;
        let cssHeight = img.height;
        
        if (cssWidth > maxCSS || cssHeight > maxCSS) {
          const scale = Math.min(maxCSS / cssWidth, maxCSS / cssHeight);
          cssWidth = Math.floor(cssWidth * scale);
          cssHeight = Math.floor(cssHeight * scale);
        }
        
        // Dimensiones del canvas con DPR para HiDPI
        const canvasWidth = cssWidth * dpr;
        const canvasHeight = cssHeight * dpr;
        
        // Crear canvas HiDPI
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        
        // Configurar alta calidad de rendering
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Dibujar imagen escalada
        ctx.drawImage(img, 0, 0, cssWidth, cssHeight);
        
        // Exportar como WebP optimizado
        const logoThumbnail = canvas.toDataURL('image/webp', 0.85);
        
        // Logging
        console.log(`🏷️ Footer logo: ${img.width}x${img.height} → ${cssWidth}x${cssHeight} CSS`);
        console.log(`   └─ Original: ${(originalBase64.length / 1024).toFixed(0)}KB`);
        console.log(`   └─ Optimizado: ${(logoThumbnail.length / 1024).toFixed(0)}KB (${((1 - logoThumbnail.length / originalBase64.length) * 100).toFixed(0)}% reducción)`);
        
        const preview = document.getElementById('footer-logo-preview');
        const uploadZone = document.getElementById('footer-logo-upload-zone');
        const urlInput = document.getElementById('footer-logo-url');

        // Show preview con thumbnail
        preview.src = logoThumbnail;
        preview.style.display = 'block';
        uploadZone.classList.add('has-image');

        // Update URL input con thumbnail optimizado
        if (urlInput) {
          urlInput.value = logoThumbnail;
        }

        // Save
        this.saveData();
        this.showMessage('✅ Logo optimizado y cargado correctamente', 'success');
      };
      img.src = originalBase64;
    };

    reader.readAsDataURL(file);
  }

  loadData() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return;

      const data = JSON.parse(saved);

      Object.entries(data).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
          element.value = value || '';
        }
      });
    } catch (error) {
      console.error('Error loading footer data:', error);
    }
  }

  saveData() {
    try {
      const data = {
        'footer-bg-color': document.getElementById('footer-bg-color')?.value || '#1a1a1a',
        'footer-text-color': document.getElementById('footer-text-color')?.value || '#ffffff',
        'footer-description': document.getElementById('footer-description')?.value || '',
        'footer-copyright': document.getElementById('footer-copyright')?.value || '',
        'footer-logo-url': document.getElementById('footer-logo-url')?.value || '',
      };

      localStorage.setItem(this.storageKey, JSON.stringify(data));
      localStorage.setItem('pending_homepage_updates', JSON.stringify(data));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());

      window.dispatchEvent(new CustomEvent('footerChange', { detail: data }));
      console.log('✅ Footer settings saved');
    } catch (error) {
      console.error('Error saving footer data:', error);
    }
  }

  applyFooterColorPreset(presetName) {
    const presets = {
      dark: { bg: '#1a1a1a', text: '#ffffff' },
      blue: { bg: '#000080', text: '#ffffff' }, // Navy blue
      green: { bg: '#065f46', text: '#ffffff' },
      purple: { bg: '#5b21b6', text: '#ffffff' },
      red: { bg: '#991b1b', text: '#ffffff' },
      orange: { bg: '#9a3412', text: '#ffffff' },
    };

    const preset = presets[presetName];
    if (!preset) return;

    const bgColor = document.getElementById('footer-bg-color');
    const textColor = document.getElementById('footer-text-color');

    if (bgColor) bgColor.value = preset.bg;
    if (textColor) textColor.value = preset.text;

    this.saveData();
    this.showMessage(`Colores de footer aplicados: ${presetName}`, 'success');
  }

  showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }

  /**
   * Save footer settings (used by global save button)
   */
  saveFooterSettings() {
    this.saveData();
    console.log('✅ Footer settings saved');
  }
}

// ==================== SISTEMA DE BACKUP Y RESTAURACIÓN ====================
class BackupRestoreSystem {
  constructor() {
    this.storageKeys = [
      'website_content',
      'courses_data',
      'calendar_events',
      'social_media_links',
      'footer_settings',
      'ingresantes_lists',
    ];
  }

  init() {
    this.bindEvents();
    this.updateLastBackupDate();
  }

  bindEvents() {
    const backupBtn = document.getElementById('backup-btn');
    const restoreBtn = document.getElementById('restore-btn');
    const restoreInput = document.getElementById('restore-input');

    if (backupBtn) {
      backupBtn.addEventListener('click', () => this.createBackup());
    }

    if (restoreBtn) {
      restoreBtn.addEventListener('click', () => restoreInput.click());
    }

    if (restoreInput) {
      restoreInput.addEventListener('change', e => this.restoreBackup(e));
    }
  }

  createBackup() {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {},
      };

      // Collect all data
      this.storageKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          backup.data[key] = JSON.parse(data);
        }
      });

      // Create download
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `stewart-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // Save backup date
      localStorage.setItem('last_backup_date', new Date().toISOString());
      this.updateLastBackupDate();

      this.showMessage('✅ Respaldo creado exitosamente', 'success');
    } catch (error) {
      console.error('Error creating backup:', error);
      this.showMessage('❌ Error al crear respaldo', 'error');
    }
  }

  restoreBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const backup = JSON.parse(e.target.result);

        if (!backup.data) {
          throw new Error('Formato de respaldo inválido');
        }

        if (
          confirm('¿Desea restaurar este respaldo? Se sobrescribirá toda la configuración actual.')
        ) {
          // Restore all data
          Object.entries(backup.data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });

          this.showMessage('✅ Respaldo restaurado exitosamente', 'success');

          setTimeout(() => {
            location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error('Error restoring backup:', error);
        this.showMessage('❌ Error al restaurar respaldo', 'error');
      }
    };

    reader.readAsText(file);
  }

  updateLastBackupDate() {
    const lastBackup = localStorage.getItem('last_backup_date');
    const element = document.getElementById('last-backup');

    if (element) {
      if (lastBackup) {
        const date = new Date(lastBackup);
        element.textContent = date.toLocaleString('es-PY');
      } else {
        element.textContent = 'Nunca';
      }
    }
  }

  showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

// ==================== SISTEMA DE CAMBIO DE NOMBRE DE USUARIO ====================
class UsernameChangeSystem {
  constructor() {
    this.usernameKey = 'admin_username';
  }

  init() {
    this.loadUsername();
    this.bindEvents();
    // Set default username if not exists
    if (!localStorage.getItem(this.usernameKey)) {
      localStorage.setItem(this.usernameKey, 'admin');
    }
  }

  bindEvents() {
    const changeBtn = document.getElementById('change-username-btn');
    if (changeBtn) {
      changeBtn.addEventListener('click', () => this.changeUsername());
    }
  }

  loadUsername() {
    const usernameInput = document.getElementById('admin-username');
    const currentUsername = localStorage.getItem(this.usernameKey) || 'admin';

    if (usernameInput) {
      usernameInput.value = currentUsername;
    }
  }

  changeUsername() {
    const newUsername = document.getElementById('admin-username')?.value?.trim();

    // Validations
    if (!newUsername) {
      this.showMessage('❌ El nombre de usuario no puede estar vacío', 'error');
      return;
    }

    if (newUsername.length < 3) {
      this.showMessage('❌ El nombre de usuario debe tener al menos 3 caracteres', 'error');
      return;
    }

    // Check if it contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      this.showMessage('❌ Solo letras, números y guión bajo (_) permitidos', 'error');
      return;
    }

    // Save new username
    localStorage.setItem(this.usernameKey, newUsername);

    this.showMessage('✅ Nombre de usuario cambiado exitosamente', 'success');
  }

  showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

// ==================== SISTEMA DE CAMBIO DE CONTRASEÑA ====================
class PasswordChangeSystem {
  constructor() {
    this.passwordKey = 'admin_password';
  }

  init() {
    this.bindEvents();
    // Set default password if not exists
    if (!localStorage.getItem(this.passwordKey)) {
      localStorage.setItem(this.passwordKey, 'stewart2024');
    }
  }

  bindEvents() {
    const changeBtn = document.getElementById('change-password-btn');
    if (changeBtn) {
      changeBtn.addEventListener('click', () => this.changePassword());
    }
  }

  changePassword() {
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;

    // Validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showMessage('❌ Por favor complete todos los campos', 'error');
      return;
    }

    const storedPassword = localStorage.getItem(this.passwordKey) || 'stewart2024';

    if (currentPassword !== storedPassword) {
      this.showMessage('❌ Contraseña actual incorrecta', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showMessage('❌ Las contraseñas nuevas no coinciden', 'error');
      return;
    }

    if (newPassword.length < 6) {
      this.showMessage('❌ La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    // Save new password
    localStorage.setItem(this.passwordKey, newPassword);

    // Clear fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';

    this.showMessage('✅ Contraseña cambiada exitosamente', 'success');
  }

  showMessage(message, type = 'success') {
    const container = document.getElementById('message-container');
    if (!container) return;

    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    container.appendChild(messageEl);

    setTimeout(() => {
      messageEl.style.opacity = '0';
      setTimeout(() => messageEl.remove(), 300);
    }, 3000);
  }
}

// ==================== SISTEMA DE SIMULACROS ====================
class SimulacrosSystem {
  constructor() {
    this.storageKey = 'simulacros_data';
    this.simulacros = [];
  }

  init() {
    this.loadSimulacros();
    this.renderSimulacrosList();
    this.loadTitles();
    this.bindTitleEvents();
  }

  bindTitleEvents() {
    const titleInput = document.getElementById('simulacros-section-title');
    const subtitleInput = document.getElementById('simulacros-section-subtitle');
    
    if (titleInput) {
      titleInput.addEventListener('input', () => this.saveTitles());
    }
    if (subtitleInput) {
      subtitleInput.addEventListener('input', () => this.saveTitles());
    }
  }

  loadSimulacros() {
    try {
      const data = localStorage.getItem(this.storageKey);
      this.simulacros = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al cargar simulacros:', error);
      this.simulacros = [];
    }
  }

  saveSimulacros() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.simulacros));
      this.showNotification('✅ Simulacros guardados correctamente', 'success');
    } catch (error) {
      console.error('Error al guardar simulacros:', error);
      this.showNotification('❌ Error al guardar simulacros', 'error');
    }
  }

  renderSimulacrosList() {
    const container = document.getElementById('simulacros-list');
    if (!container) return;

    if (this.simulacros.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #94a3b8; background: #1e293b; border-radius: 8px; border: 2px dashed #334155;">
          <p style="margin: 0; font-size: 1.1rem;">📚 No hay simulacros agregados</p>
          <small style="color: #64748b;">Completa el formulario arriba para agregar uno</small>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="simulacros-grid">
        ${this.simulacros.map((item, index) => `
          <div class="simulacro-card">
            <div class="simulacro-icon">📄</div>
            <div class="simulacro-info">
              <h4>${item.nombre}</h4>
              <p class="simulacro-filename">${item.nombreArchivo}</p>
            </div>
            <div class="simulacro-actions">
              <button onclick="simulacrosSystem.deleteSimulacro(${index})" class="btn-delete" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  async addSimulacro() {
    const nameInput = document.getElementById('simulacro-name');
    const fileInput = document.getElementById('simulacro-file');

    if (!nameInput.value.trim()) {
      this.showNotification('❌ Por favor ingresa un nombre', 'error');
      return;
    }

    if (!fileInput.files || fileInput.files.length === 0) {
      this.showNotification('❌ Por favor selecciona al menos un archivo PDF', 'error');
      return;
    }

    const files = Array.from(fileInput.files);
    
    // Procesar cada archivo
    for (const file of files) {
      if (file.type !== 'application/pdf') {
        this.showNotification(`❌ ${file.name} no es un archivo PDF válido`, 'error');
        continue;
      }

      const simulacro = {
        nombre: nameInput.value.trim(),
        nombreArchivo: file.name,
        rutaArchivo: `documents/simulacros/${file.name}`
      };

      this.simulacros.push(simulacro);

      // Descargar el PDF para que el usuario lo coloque manualmente
      this.downloadFile(file);
    }

    this.saveSimulacros();
    this.renderSimulacrosList();

    // Limpiar campos
    nameInput.value = '';
    fileInput.value = '';

    this.showNotification(`✅ ${files.length} archivo(s) agregado(s). Colócalos en documents/simulacros/`, 'success');
  }

  downloadFile(file) {
    try {
      const url = URL.createObjectURL(file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name || 'download';
      // Some browsers require the link to be in the DOM
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Delay revoke to ensure the browser has started the download process
      setTimeout(() => {
        try { URL.revokeObjectURL(url); } catch (e) { /* ignore */ }
      }, 500);
    } catch (err) {
      console.error('Error during downloadFile:', err);
      // Fallback: attempt to download by reading as data URL
      try {
        const reader = new FileReader();
        reader.onload = function (e) {
          const a2 = document.createElement('a');
          a2.href = e.target.result;
          a2.download = file.name || 'download';
          document.body.appendChild(a2);
          a2.click();
          document.body.removeChild(a2);
        };
        reader.readAsDataURL(file);
      } catch (e2) {
        console.error('Fallback download also failed:', e2);
        alert('Error al iniciar la descarga. Por favor, inténtalo manualmente desde la carpeta de archivos.');
      }
    }
  }

  deleteSimulacro(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este simulacro?')) {
      const deleted = this.simulacros.splice(index, 1)[0];
      this.saveSimulacros();
      this.renderSimulacrosList();
      this.showNotification(`✅ Simulacro "${deleted.nombre}" eliminado`, 'success');
    }
  }

  saveTitles() {
    const title = document.getElementById('simulacros-section-title')?.value || 'SIMULACROS';
    const subtitle = document.getElementById('simulacros-section-subtitle')?.value || 'Material de práctica';
    
    const titles = { title, subtitle };
    localStorage.setItem('simulacros_titles', JSON.stringify(titles));
  }

  loadTitles() {
    try {
      const data = localStorage.getItem('simulacros_titles');
      if (data) {
        const titles = JSON.parse(data);
        const titleInput = document.getElementById('simulacros-section-title');
        const subtitleInput = document.getElementById('simulacros-section-subtitle');
        
        if (titleInput) titleInput.value = titles.title || 'SIMULACROS';
        if (subtitleInput) subtitleInput.value = titles.subtitle || 'Material de práctica';
      }
    } catch (error) {
      console.error('Error al cargar títulos:', error);
    }
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
      font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
}
// ==================== INICIALIZACIÓN ====================
let authSystem;
let bannerSystem;
let ingresantesSystem;
let tabNavigation;
let coursesSystem;
let calendarSystem;
let contactSystem;
let socialMediaSystem;
let simulacrosSystem;
let conocenosSystem;
let countdownSystem;
let profesoresSystem;
let footerSystem;
let backupRestoreSystem;
let usernameChangeSystem;
let passwordChangeSystem;

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando sistema de administración...');

  // Verificar XLSX
  if (typeof XLSX === 'undefined') {
    alert('❌ Error: Librería XLSX no disponible. Recarga la página.');
    return;
  }

  // Inicializar sistemas
  authSystem = new AuthSystem();
  authSystem.init();

  // Inicializar sistema de banner
  bannerSystem = new BannerSystem();
  bannerSystem.init();
  window.bannerSystem = bannerSystem;

  ingresantesSystem = new IngresantesSystem();
  ingresantesSystem.init();

  // Hacer ingresantesSystem accesible globalmente para funciones onclick
  window.ingresantesSystem = ingresantesSystem;

  // Inicializar navegación de pestañas
  tabNavigation = new TabNavigationSystem();
  tabNavigation.init();

  // Inicializar sistema de cursos
  coursesSystem = new CoursesSystem();
  coursesSystem.init();

  // Inicializar sistema de calendario
  calendarSystem = new CalendarSystem();
  calendarSystem.init();

  // Hacer calendarSystem accesible globalmente
  window.calendarSystem = calendarSystem;

  // Inicializar sistema de contacto
  contactSystem = new ContactSystem();
  contactSystem.init();

  // Hacer contactSystem accesible globalmente
  window.contactSystem = contactSystem;

  // Inicializar sistema de redes sociales
  socialMediaSystem = new SocialMediaSystem();
  socialMediaSystem.init();
  window.socialMediaSystem = socialMediaSystem;

  // Inicializar sistema de simulacros
  simulacrosSystem = new SimulacrosSystem();
  simulacrosSystem.init();
  window.simulacrosSystem = simulacrosSystem;
  // Inicializar sistema de Conócenos/Timeline
  conocenosSystem = new ConocenosSystem();
  conocenosSystem.init();
  window.conocenosSystem = conocenosSystem;

  // Inicializar sistema de Countdown
  countdownSystem = new CountdownSystem();
  countdownSystem.init();
  window.countdownSystem = countdownSystem;

  // Inicializar sistema de profesores
  profesoresSystem = new ProfesoresSystem();
  profesoresSystem.init();
  window.profesoresSystem = profesoresSystem;

  // Inicializar sistema de footer
  footerSystem = new FooterEditorSystem();
  footerSystem.init();
  window.footerSystem = footerSystem;

  // Inicializar sistema de backup y restauración
  backupRestoreSystem = new BackupRestoreSystem();
  backupRestoreSystem.init();
  window.backupRestoreSystem = backupRestoreSystem;

  // Inicializar sistema de cambio de nombre de usuario
  usernameChangeSystem = new UsernameChangeSystem();
  usernameChangeSystem.init();
  window.usernameChangeSystem = usernameChangeSystem;

  // Inicializar sistema de cambio de contraseña
  passwordChangeSystem = new PasswordChangeSystem();
  passwordChangeSystem.init();
  window.passwordChangeSystem = passwordChangeSystem;

  // Inicializar botón de guardar global
  const saveAllBtn = document.getElementById('save-all-btn');
  if (saveAllBtn) {
    saveAllBtn.addEventListener('click', () => {
      // Guardar todos los datos
      if (bannerSystem) bannerSystem.saveBannerData();
      if (bannerSystem) bannerSystem.saveBannerColors();
      if (bannerSystem) bannerSystem.updateBannerOverlay();
      if (ingresantesSystem) ingresantesSystem.saveTitles();
      if (conocenosSystem) conocenosSystem.autoSave();
      if (countdownSystem) countdownSystem.saveCountdownData();
      if (contactSystem) contactSystem.saveAllContactData();
      if (socialMediaSystem) socialMediaSystem.saveAllData();
      if (footerSystem) footerSystem.saveFooterSettings();
      
      // Mostrar mensaje de éxito
      showToast('💾 ¡Todos los cambios han sido guardados exitosamente!', 'success');
      
      // Update timestamp para notificar cambios
      localStorage.setItem('admin_update_timestamp', Date.now().toString());
      
      console.log('✅ Todos los cambios guardados');
    });
  }

  // Crear objeto global adminPanel para compatibilidad con onclick en HTML
  window.adminPanel = {
    // Banner functions
    updateBannerTextColor: (type) => bannerSystem && bannerSystem.updateBannerTextColor(type),
    updateBannerOverlay: () => bannerSystem && bannerSystem.updateBannerOverlay(),
    resetBannerOverlay: () => bannerSystem && bannerSystem.resetBannerOverlay(),
    updateCarouselInterval: (value) => bannerSystem && bannerSystem.updateCarouselInterval(value),
    resetToDefaultImages: () => bannerSystem && bannerSystem.resetToDefaultImages(),
    clearLegacyImages: () => bannerSystem && bannerSystem.clearLegacyImages(),
    setAsDefaultConfiguration: () => bannerSystem && bannerSystem.setAsDefaultConfiguration(),
    restoreDefaultConfiguration: () => bannerSystem && bannerSystem.restoreDefaultConfiguration(),
    
    // Timeline/Conocenos functions
    addTimelineEntry: () => conocenosSystem && conocenosSystem.addTimelineEntry(),
    restoreTimelineDefaults: () => conocenosSystem && conocenosSystem.restoreTimelineDefaults(),
    saveAsTimelineDefaults: () => conocenosSystem && conocenosSystem.saveAsTimelineDefaults(),
    
    // Countdown functions
    restoreCountdownDefaults: () => countdownSystem && countdownSystem.restoreDefaults(),
    saveAsCountdownDefaults: () => countdownSystem && countdownSystem.saveAsDefaults(),
  };

  console.log('✅ Sistema iniciado correctamente');
});
