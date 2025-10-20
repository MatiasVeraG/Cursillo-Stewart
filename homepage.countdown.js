/**
 * Sistema de Sincronización del Contador Regresivo
 * Gestiona la actualización en tiempo real del countdown desde el admin
 */

(function () {
  "use strict";

  let lastUpdateTimestamp = 0;
  let countdownInterval = null;
  let targetDate = null;

  /**
   * Carga y aplica los cambios del contador regresivo
   */
  function loadCountdownChanges() {
    try {
      const timestamp = localStorage.getItem("admin_update_timestamp");
      if (timestamp && parseInt(timestamp) > lastUpdateTimestamp) {
        lastUpdateTimestamp = parseInt(timestamp);
        const content = localStorage.getItem("website_content");

        if (content) {
          const data = JSON.parse(content);
          if (data.countdown) {
            updateCountdownSection(data.countdown);
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar cambios del countdown:", error);
    }
  }

  /**
   * Actualiza toda la sección del contador regresivo
   */
  function updateCountdownSection(countdownData) {
    const section = document.querySelector(".countdown-section");
    if (!section) return;

    // Mostrar u ocultar la sección completa
    if (countdownData.enabled !== undefined) {
      section.style.display = countdownData.enabled ? "block" : "none";
    }

    // Si está deshabilitado, no actualizar nada más
    if (countdownData.enabled === false) return;

    // Actualizar colores de fondo
    if (countdownData.backgroundColor) {
      section.style.backgroundColor = countdownData.backgroundColor;
    }

    // Actualizar título
    if (countdownData.title !== undefined) {
      const titleElement = section.querySelector(".countdown-header h2");
      if (titleElement) {
        titleElement.textContent = countdownData.title;
        if (countdownData.titleColor) {
          titleElement.style.color = countdownData.titleColor;
        }
      }
    }

    // Actualizar subtítulo
    if (countdownData.subtitle !== undefined) {
      const subtitleElement = section.querySelector(".countdown-header > p");
      if (subtitleElement) {
        subtitleElement.textContent = countdownData.subtitle;
        if (countdownData.subtitleColor) {
          subtitleElement.style.color = countdownData.subtitleColor;
        }
      }
    }

    // Actualizar fecha objetivo
    if (countdownData.targetDate) {
      targetDate = new Date(countdownData.targetDate);
      updateDateDisplay(targetDate);
      
      // Reiniciar el contador con la nueva fecha
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
      startCountdown(targetDate);
    }

    // Actualizar colores del timer
    const timerElement = section.querySelector(".countdown-timer");
    if (timerElement) {
      if (countdownData.timerBackground) {
        const countdownItems = section.querySelectorAll(".countdown-number");
        countdownItems.forEach((item) => {
          item.style.backgroundColor = countdownData.timerBackground;
        });
      }

      if (countdownData.numbersColor) {
        const countdownNumbers = section.querySelectorAll(".countdown-number");
        countdownNumbers.forEach((num) => {
          num.style.color = countdownData.numbersColor;
        });
      }
    }

    // Actualizar CTA (Call to Action)
    const ctaElement = section.querySelector(".countdown-cta");
    if (ctaElement) {
      if (countdownData.ctaEnabled !== undefined) {
        ctaElement.style.display = countdownData.ctaEnabled ? "block" : "none";
      }

      if (countdownData.ctaEnabled) {
        // Actualizar texto del CTA
        if (countdownData.ctaText !== undefined) {
          const ctaButton = ctaElement.querySelector(".btn-countdown");
          if (ctaButton) {
            ctaButton.textContent = countdownData.ctaText;

            // Actualizar colores del botón
            if (countdownData.ctaButtonColor) {
              ctaButton.style.backgroundColor = countdownData.ctaButtonColor;
            }
            if (countdownData.ctaTextColor) {
              ctaButton.style.color = countdownData.ctaTextColor;
            }
          }
        }
      }
    }
  }

  /**
   * Actualiza la visualización de la fecha objetivo
   */
  function updateDateDisplay(date) {
    const dateElement = document.querySelector(".countdown-date strong");
    if (dateElement && date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      const formattedDate = date.toLocaleDateString("es-ES", options);
      dateElement.textContent = formattedDate;
    }
  }

  /**
   * Inicia el contador regresivo
   */
  function startCountdown(targetDate) {
    function updateCounter() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("days").textContent = "0";
        document.getElementById("hours").textContent = "0";
        document.getElementById("minutes").textContent = "0";
        document.getElementById("seconds").textContent = "0";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days;
      document.getElementById("hours").textContent = hours;
      document.getElementById("minutes").textContent = minutes;
      document.getElementById("seconds").textContent = seconds;
    }

    updateCounter();
    countdownInterval = setInterval(updateCounter, 1000);
  }

  /**
   * Inicializa el sistema al cargar la página
   */
  function init() {
    // Cargar cambios iniciales
    loadCountdownChanges();

    // Escuchar cambios en localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === "website_content" || e.key === "admin_update_timestamp") {
        loadCountdownChanges();
      }
    });

    // Escuchar eventos personalizados del admin
    window.addEventListener("adminContentChange", () => {
      loadCountdownChanges();
    });

    // Polling de seguridad cada 500ms
    setInterval(loadCountdownChanges, 500);
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
