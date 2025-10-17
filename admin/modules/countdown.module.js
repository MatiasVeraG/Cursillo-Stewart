/**
 * MÓDULO DE COUNTDOWN/CONTADOR
 * Maneja el contador regresivo y CTA
 * Completamente independiente
 */

class CountdownModule {
  constructor() {
    this.storageKey = 'countdown_configuration';
    this.defaultsKey = 'custom_countdown_defaults';
  }

  init() {
    console.log('⏰ Módulo de Countdown iniciado');
    this.bindEvents();
    this.loadConfiguration();
    this.initColorLabels();
  }

  bindEvents() {
    // Toggle countdown
    const countdownCheckbox = document.getElementById('enable-countdown');
    const countdownOptions = document.getElementById('countdown-options');

    if (countdownCheckbox && countdownOptions) {
      countdownCheckbox.addEventListener('change', e => {
        countdownOptions.style.display = e.target.checked ? 'block' : 'none';
        this.autoSave();
      });
    }

    // Toggle CTA
    const ctaCheckbox = document.getElementById('enable-cta');
    const ctaOptions = document.getElementById('cta-options');

    if (ctaCheckbox && ctaOptions) {
      ctaCheckbox.addEventListener('change', e => {
        ctaOptions.style.display = e.target.checked ? 'block' : 'none';
        this.autoSave();
      });
    }

    // Botones de acción
    const saveDefaultsBtn = document.getElementById('save-countdown-defaults-btn');
    const restoreDefaultsBtn = document.getElementById('restore-countdown-defaults-btn');

    if (saveDefaultsBtn) {
      saveDefaultsBtn.addEventListener('click', () => this.saveAsDefaults());
    }

    if (restoreDefaultsBtn) {
      restoreDefaultsBtn.addEventListener('click', () => this.restoreDefaults());
    }

    // Auto-save en todos los campos
    const countdownFields = [
      'counters-title',
      'counters-subtitle',
      'counters-title-color',
      'counters-subtitle-color',
      'counters-background-color',
      'countdown-timer-background',
      'countdown-numbers-color',
      'countdown-date',
      'cta-text',
      'cta-button-color',
      'cta-text-color',
    ];

    countdownFields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', () => this.autoSave());

        // Actualizar labels para colores
        if (fieldId.includes('color')) {
          field.addEventListener('input', () => this.updateColorLabel(fieldId));
        }
      }
    });
  }

  loadConfiguration() {
    const saved = localStorage.getItem(this.storageKey);

    if (saved) {
      try {
        const config = JSON.parse(saved);
        this.applyConfiguration(config);
        console.log('✅ Configuración de countdown cargada');
      } catch (error) {
        console.error('Error cargando configuración de countdown:', error);
      }
    }
  }

  applyConfiguration(config) {
    Object.keys(config).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = config[key];

          // Mostrar/ocultar opciones según el checkbox
          if (key === 'enable-countdown') {
            const options = document.getElementById('countdown-options');
            if (options) options.style.display = config[key] ? 'block' : 'none';
          }
          if (key === 'enable-cta') {
            const options = document.getElementById('cta-options');
            if (options) options.style.display = config[key] ? 'block' : 'none';
          }
        } else {
          element.value = config[key];
        }
      }
    });

    this.initColorLabels();
  }

  autoSave() {
    const fields = [
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

    const config = {};
    fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        config[fieldId] = element.type === 'checkbox' ? element.checked : element.value;
      }
    });

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(config));
      localStorage.setItem('admin_update_timestamp', Date.now().toString());
      console.log('💾 Countdown auto-guardado');
    } catch (error) {
      console.error('Error guardando countdown:', error);
    }
  }

  saveAsDefaults() {
    const fields = [
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
    fields.forEach(fieldId => {
      const element = document.getElementById(fieldId);
      if (element) {
        currentSettings[fieldId] = element.type === 'checkbox' ? element.checked : element.value;
      }
    });

    localStorage.setItem(this.defaultsKey, JSON.stringify(currentSettings));
    this.showMessage('Configuración actual guardada como predeterminada', 'success');
  }

  restoreDefaults() {
    const customDefaults = localStorage.getItem(this.defaultsKey);

    const defaults = customDefaults
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

    this.applyConfiguration(defaults);
    this.autoSave();

    const message = customDefaults
      ? 'Configuración del contador restaurada a valores predeterminados personalizados'
      : 'Configuración del contador restaurada a valores por defecto del sistema';

    this.showMessage(message, 'success');
  }

  initColorLabels() {
    const colorInputs = [
      { input: 'counters-background-color', label: 'background-color-label' },
      { input: 'countdown-timer-background', label: 'timer-background-label' },
      { input: 'countdown-numbers-color', label: 'numbers-color-label' },
      { input: 'cta-button-color', label: 'cta-color-label' },
      { input: 'cta-text-color', label: 'cta-text-color-label' },
    ];

    colorInputs.forEach(({ input, label }) => {
      const inputEl = document.getElementById(input);
      const labelEl = document.getElementById(label);

      if (inputEl && labelEl) {
        labelEl.textContent = inputEl.value;
        labelEl.style.color = inputEl.value;
      }
    });
  }

  updateColorLabel(inputId) {
    const labelMap = {
      'counters-background-color': 'background-color-label',
      'countdown-timer-background': 'timer-background-label',
      'countdown-numbers-color': 'numbers-color-label',
      'cta-button-color': 'cta-color-label',
      'cta-text-color': 'cta-text-color-label',
    };

    const labelId = labelMap[inputId];
    if (!labelId) return;

    const inputEl = document.getElementById(inputId);
    const labelEl = document.getElementById(labelId);

    if (inputEl && labelEl) {
      labelEl.textContent = inputEl.value;
      labelEl.style.color = inputEl.value;
    }
  }

  showMessage(text, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `admin-message admin-message-${type}`;
    messageDiv.textContent = text;
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    const colors = {
      success: 'background: #10b981; color: white;',
      error: 'background: #ef4444; color: white;',
      info: 'background: #3b82f6; color: white;',
    };

    messageDiv.style.cssText += colors[type] || colors.info;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
      messageDiv.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
  }
}

// Exportar instancia global
window.CountdownModule = new CountdownModule();
