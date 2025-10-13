/**
 * Gestor completo de secciones de ingresantes
 * Maneja importación de Excel, normalización de datos y persistencia
 */

class SectionManager {
  constructor() {
    this.sectionsPath = 'data/sections.json';
    this.ingresantesBasePath = 'data/ingresantes';
  }

  /**
   * Carga las secciones desde el archivo JSON
   */
  async loadSections() {
    try {
      const response = await fetch(this.sectionsPath);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn('Error loading sections:', error);
      return [];
    }
  }

  /**
   * Guarda las secciones en el archivo JSON
   */
  async saveSections(sections) {
    try {
      const response = await fetch('/api/save-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sections),
      });
      return response.ok;
    } catch (error) {
      console.error('Error saving sections:', error);
      return false;
    }
  }

  /**
   * Carga los ingresantes de una sección específica
   */
  async loadIngresantes(slug) {
    try {
      const response = await fetch(`${this.ingresantesBasePath}/ingresantes.${slug}.json`);
      if (!response.ok) {
        return [];
      }
      return await response.json();
    } catch (error) {
      console.warn(`Error loading ingresantes for ${slug}:`, error);
      return [];
    }
  }

  /**
   * Guarda los ingresantes de una sección específica
   */
  async saveIngresantes(slug, ingresantes) {
    try {
      const response = await fetch(`/api/save-ingresantes/${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ingresantes),
      });
      return response.ok;
    } catch (error) {
      console.error(`Error saving ingresantes for ${slug}:`, error);
      return false;
    }
  }

  /**
   * Crea o actualiza una sección
   */
  async createOrUpdateSection(exam, year, ingresantesData, metadata = {}) {
    const slug = IngresantesNormalizer.generarSlug(exam, year);
    const sections = await this.loadSections();

    // Buscar sección existente
    let section = sections.find(s => s.slug === slug);
    const now = new Date().toISOString();

    if (section) {
      // Actualizar sección existente
      section.rows_count = ingresantesData.length;
      section.updated_at = now;
      section.title = `${exam.toUpperCase()}-${year}`;
      section.description = `Ingresantes ${exam} ${year}`;
    } else {
      // Crear nueva sección
      const newOrder = Math.max(...sections.map(s => s.order || 0), 0) + 1;
      section = {
        id: this.generateId(),
        slug: slug,
        exam: exam.toUpperCase(),
        year: parseInt(year),
        title: `${exam.toUpperCase()}-${year}`,
        description: `Ingresantes ${exam} ${year}`,
        order: newOrder,
        is_public: true,
        rows_count: ingresantesData.length,
        excel_path: metadata.excel_path || '',
        created_at: now,
        updated_at: now,
      };

      // Insertar al principio para que aparezca a la izquierda
      sections.unshift(section);
    }

    // Guardar secciones actualizadas
    await this.saveSections(sections);

    // Guardar datos de ingresantes
    await this.saveIngresantes(slug, ingresantesData);

    return {
      success: true,
      section: section,
      slug: slug,
      ingresantes_count: ingresantesData.length,
    };
  }

  /**
   * Procesa un archivo Excel y crea/actualiza la sección correspondiente
   */
  async processExcelFile(file, fallbackExam = '', fallbackYear = '') {
    try {
      // Leer archivo Excel (simulado - en implementación real usarías FileReader + SheetJS)
      const excelData = await this.readExcelFile(file);

      if (!excelData.success) {
        throw new Error(excelData.error);
      }

      // Extraer metadatos
      let exam = excelData.metadata.exam || fallbackExam;
      let year = excelData.metadata.year || fallbackYear;

      // Validar metadatos
      if (!exam || !year) {
        // Intentar inferir del nombre del archivo
        const fileName = file.name.toLowerCase();
        const match = fileName.match(/([a-zA-Z]+)-?(\d{4})/);
        if (match) {
          exam = exam || match[1];
          year = year || match[2];
        }
      }

      if (!exam || !year) {
        throw new Error('No se pudo determinar el examen y año. Especifique manualmente.');
      }

      // Normalizar datos
      const normalizedIngresantes = excelData.records.map((record, index) => {
        return IngresantesNormalizer.normalizarRegistro(record, index);
      });

      // Ordenar por puesto
      normalizedIngresantes.sort((a, b) => a.puesto - b.puesto);

      // Crear/actualizar sección
      const result = await this.createOrUpdateSection(exam, year, normalizedIngresantes, {
        excel_path: file.name,
      });

      return {
        success: true,
        message: `Sección ${exam.toUpperCase()}-${year} ${
          result.section.created_at === result.section.updated_at ? 'creada' : 'actualizada'
        } exitosamente`,
        section: result.section,
        ingresantes_count: result.ingresantes_count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Lee un archivo Excel (simulación - implementar con SheetJS en producción)
   */
  async readExcelFile(file) {
    // Esta es una simulación - en producción usarías SheetJS o similar
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.onload = e => {
        try {
          // Aquí iría el parsing real del Excel con SheetJS
          // Por ahora simulamos datos para testing
          const simulatedData = {
            success: true,
            metadata: {
              exam: 'UPTP',
              year: '2025',
            },
            records: [
              {
                'Nombre y Apellido': 'Juan Pérez García',
                Puntaje: '95.5',
                Carrera: 'Ing. Informática',
                Puesto: '1',
                Preferencial: 'Sí',
              },
            ],
          };

          resolve(simulatedData);
        } catch (error) {
          resolve({
            success: false,
            error: error.message,
          });
        }
      };

      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Obtiene las secciones públicas ordenadas para mostrar en homepage
   */
  async getPublicSections() {
    const sections = await this.loadSections();
    return sections.filter(s => s.is_public).sort((a, b) => (b.order || 0) - (a.order || 0)); // Más nuevos primero
  }

  /**
   * Genera un ID único para nuevas secciones
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Exporta una sección a formato Excel
   */
  async exportSection(slug) {
    const sections = await this.loadSections();
    const section = sections.find(s => s.slug === slug);

    if (!section) {
      throw new Error('Sección no encontrada');
    }

    const ingresantes = await this.loadIngresantes(slug);

    // Convertir datos normalizados de vuelta al formato Excel
    const excelData = ingresantes.map(ing => ({
      'Nombre y Apellido': ing.nombre_completo,
      Puntaje: ing.puntaje,
      Carrera: ing.carrera,
      Puesto: ing.puesto,
      Preferencial: ing.preferencial ? 'Sí' : 'No',
    }));

    return {
      metadata: {
        exam: section.exam,
        year: section.year,
      },
      data: excelData,
      filename: `${section.exam}-${section.year}_Ingresantes.xlsx`,
    };
  }
}

// Instancia global del gestor
window.sectionManager = new SectionManager();
