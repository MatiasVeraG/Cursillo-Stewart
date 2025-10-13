/**
 * Sistema de normalización de datos de ingresantes
 * Implementa las reglas especificadas para nombres, puntajes, puestos y preferenciales
 */

class IngresantesNormalizer {
  /**
   * Normaliza un nombre completo según las reglas de partículas
   * @param {string} nombreCompleto - Nombre completo del ingresante
   * @returns {object} - {nombre, apellido, nombre_completo}
   */
  static normalizarNombre(nombreCompleto) {
    if (!nombreCompleto || typeof nombreCompleto !== 'string') {
      return { nombre: '', apellido: '', nombre_completo: '' };
    }

    // Trim y colapsar espacios múltiples
    const limpio = nombreCompleto.trim().replace(/\s+/g, ' ');

    // Partículas que forman parte del apellido
    const particulas = [
      'de',
      'del',
      'de la',
      'da',
      'do',
      'das',
      'dos',
      'las',
      'los',
      'san',
      'santa',
    ];

    const palabras = limpio.split(' ');

    if (palabras.length === 1) {
      return { nombre: palabras[0], apellido: '', nombre_completo: limpio };
    }

    // Encontrar el primer apellido (primera palabra que no sea partícula o después de partícula)
    let indiceApellido = 1; // Por defecto, el segundo elemento es apellido

    for (let i = 1; i < palabras.length; i++) {
      const palabraAnterior = palabras[i - 1].toLowerCase();
      const palabraActual = palabras[i].toLowerCase();

      // Si la palabra anterior es partícula, esta palabra es parte del apellido
      if (particulas.includes(palabraAnterior)) {
        indiceApellido = i - 1;
        break;
      }

      // Si esta palabra es partícula, marca el inicio del apellido
      if (particulas.includes(palabraActual)) {
        indiceApellido = i;
        break;
      }
    }

    const nombre = palabras.slice(0, indiceApellido).join(' ');
    const apellido = palabras.slice(indiceApellido).join(' ');

    return { nombre, apellido, nombre_completo: limpio };
  }

  /**
   * Normaliza puntaje, convirtiendo comas a puntos y validando rango
   * @param {string|number} puntaje - Puntaje a normalizar
   * @returns {number} - Puntaje normalizado [0..100]
   */
  static normalizarPuntaje(puntaje) {
    if (puntaje === null || puntaje === undefined || puntaje === '') {
      return 0;
    }

    // Convertir a string y reemplazar coma por punto
    let puntajeStr = String(puntaje).replace(',', '.');

    // Remover espacios
    puntajeStr = puntajeStr.trim();

    // Convertir a número
    const numero = parseFloat(puntajeStr);

    // Validar que sea un número válido
    if (isNaN(numero)) {
      return 0;
    }

    // Clampear al rango [0..100]
    return Math.max(0, Math.min(100, numero));
  }

  /**
   * Normaliza el puesto, debe ser entero > 0
   * @param {string|number} puesto - Puesto a normalizar
   * @param {number} autoIncrement - Valor para auto-incremento si está vacío
   * @returns {number} - Puesto normalizado
   */
  static normalizarPuesto(puesto, autoIncrement = 1) {
    if (puesto === null || puesto === undefined || puesto === '') {
      return autoIncrement;
    }

    const numero = parseInt(String(puesto).trim(), 10);

    if (isNaN(numero) || numero <= 0) {
      return autoIncrement;
    }

    return numero;
  }

  /**
   * Normaliza el campo preferencial a boolean
   * @param {string|boolean|number} preferencial - Valor a normalizar
   * @returns {boolean} - true si es preferencial, false en caso contrario
   */
  static normalizarPreferencial(preferencial) {
    if (preferencial === null || preferencial === undefined || preferencial === '') {
      return false;
    }

    // Si ya es boolean, retornarlo
    if (typeof preferencial === 'boolean') {
      return preferencial;
    }

    // Convertir a string y normalizar
    const valor = String(preferencial).toLowerCase().trim();

    // Patrones que indican "true"
    const patronesTrue = /^(si|sí|true|1|yes|y)$/i;

    return patronesTrue.test(valor);
  }

  /**
   * Normaliza una carrera
   * @param {string} carrera - Carrera a normalizar
   * @returns {string} - Carrera normalizada
   */
  static normalizarCarrera(carrera) {
    if (!carrera || typeof carrera !== 'string') {
      return '';
    }

    return carrera.trim().replace(/\s+/g, ' ');
  }

  /**
   * Genera un slug válido a partir del examen y año
   * @param {string} examen - Nombre del examen
   * @param {string|number} año - Año del examen
   * @returns {string} - Slug en formato "examen-año"
   */
  static generarSlug(examen, año) {
    if (!examen || !año) {
      throw new Error('Examen y año son requeridos para generar el slug');
    }

    const examenLimpio = String(examen)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios por guiones
      .replace(/-+/g, '-') // Colapsar guiones múltiples
      .replace(/^-|-$/g, ''); // Remover guiones al inicio y final

    const añoLimpio = String(año).replace(/[^0-9]/g, '');

    return `${examenLimpio}-${añoLimpio}`;
  }

  /**
   * Normaliza un registro completo de ingresante
   * @param {object} registro - Registro crudo del Excel
   * @param {number} indice - Índice del registro (para auto-incremento)
   * @returns {object} - Registro normalizado
   */
  static normalizarRegistro(registro, indice = 0) {
    const nombreInfo = this.normalizarNombre(
      registro['Nombre y Apellido'] || registro.nombre || ''
    );
    const puntaje = this.normalizarPuntaje(registro['Puntaje'] || registro.puntaje);
    const puesto = this.normalizarPuesto(registro['Puesto'] || registro.puesto, indice + 1);
    const preferencial = this.normalizarPreferencial(
      registro['Preferencial'] || registro.preferencial
    );
    const carrera = this.normalizarCarrera(registro['Carrera'] || registro.carrera || '');

    // Generar medalla basada en el puesto
    let medal = '';
    if (puesto === 1) medal = '🥇';
    else if (puesto === 2) medal = '🥈';
    else if (puesto === 3) medal = '🥉';

    return {
      nombre: nombreInfo.nombre,
      apellido: nombreInfo.apellido,
      nombre_completo: nombreInfo.nombre_completo,
      puntaje: puntaje,
      carrera: carrera,
      puesto: puesto,
      posicion: `#${puesto}`,
      preferencial: preferencial,
      medal: medal,
      // Campos adicionales para compatibilidad
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
}

// Para uso en Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IngresantesNormalizer;
}

// Para uso en navegador
if (typeof window !== 'undefined') {
  window.IngresantesNormalizer = IngresantesNormalizer;
}
