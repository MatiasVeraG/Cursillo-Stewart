# Sistema de Edición de Cursos y Calendario

## 📋 Resumen de Cambios

Se han implementado las siguientes funcionalidades en el panel de administración:

### ✅ 1. Edición de Títulos en la Sección de Cursos

**Ubicación**: Panel Admin → Pestaña "Cursos"

#### Características:
- **Título Principal**: Campo editable para cambiar el título de la sección de cursos (por defecto: "Cursos")
- **Subtítulo**: Campo opcional para agregar un subtítulo descriptivo
- **Sincronización automática**: Los cambios se reflejan instantáneamente en el sitio web
- **Persistencia**: Los títulos se guardan en localStorage y se mantienen entre sesiones

#### Archivos modificados:
- `admin.html` - Agregada interfaz de edición de títulos
- `admin-final.js` - Clase `CoursesSystem` actualizada con métodos `loadTitles()` y `saveTitles()`
- `homepage.courses.js` - Funciones `updateCourseTitles()` y `loadSavedTitles()` para aplicar cambios

---

### ✅ 2. Sistema Completo de Gestión de Calendario

**Ubicación**: Panel Admin → Pestaña "Calendario"

#### Características principales:

##### 📝 Información de la Sección
- **Título**: Editable (por defecto: "Calendario de Eventos")
- **Subtítulo**: Editable (por defecto: "Mantente informado sobre fechas importantes")
- **Color de fondo**: Selector de color para la sección completa

##### 🎨 Personalización de Colores
- **Color del círculo de fecha**: Color de fondo del círculo que muestra el día
- **Color del texto del círculo**: Color del número del día
- **Color de fondo de la tarjeta**: Color de fondo de cada evento
- **Color del borde de la tarjeta**: Color del borde de las tarjetas

##### 📅 Gestión de Eventos
- **Agregar eventos**: Botón para crear nuevos eventos sin límite
- **Editar eventos**: Cada evento tiene campos editables para:
  - Día (1-31)
  - Mes (texto)
  - Año (número)
  - Título del evento
  - Descripción del evento
- **Eliminar eventos**: Botón de eliminación en cada tarjeta de evento
- **Vista previa instantánea**: Los cambios se reflejan inmediatamente

##### 📐 Sistema de Grid Inteligente
- **Máximo 3 columnas**: Los eventos se organizan en un máximo de 3 columnas
- **Centralidad automática**: El contenido se mantiene centrado sin importar la cantidad de eventos
- **Responsive**: Se adapta a dispositivos móviles (1 columna en pantallas pequeñas)

#### Archivos creados/modificados:

**Nuevos archivos:**
- `homepage.calendar.js` - Script para manejar la actualización dinámica del calendario en index.html

**Modificados:**
- `admin.html` - Nueva interfaz completa de gestión de calendario
- `admin-final.js` - Nueva clase `CalendarSystem` con todas las funcionalidades
- `admin.css` - Estilos para las tarjetas de eventos del calendario
- `index.html` - Agregado script homepage.calendar.js
- `styles.css` - Grid mejorado con máximo de 3 columnas y centralidad

---

## 🔧 Arquitectura Técnica

### Flujo de Datos

```
Panel Admin (admin.html)
    ↓
CalendarSystem/CoursesSystem (admin-final.js)
    ↓
localStorage + postMessage
    ↓
Homepage Scripts (homepage.calendar.js / homepage.courses.js)
    ↓
Sitio Web (index.html)
```

### Almacenamiento

**LocalStorage Keys:**
- `courses_titles` - Títulos de la sección de cursos
- `courses_data` - Datos de los cursos
- `calendar_data` - Toda la información del calendario

**Estructura de calendar_data:**
```json
{
  "title": "Calendario de Eventos",
  "subtitle": "Mantente informado sobre fechas importantes",
  "bgColor": "#f8fafc",
  "dateCircleColor": "#1e3a8a",
  "dateCircleText": "#ffffff",
  "cardBg": "#ffffff",
  "cardBorder": "#e2e8f0",
  "events": [
    {
      "day": 15,
      "month": "Enero",
      "year": 2024,
      "title": "Inicio de Inscripciones",
      "description": "Apertura del período de inscripciones para el cursillo"
    }
  ]
}
```

---

## 🎯 Funcionalidades Clave

### Auto-guardado
- Todos los cambios se guardan automáticamente al modificar cualquier campo
- No es necesario hacer clic en "Guardar"

### Sincronización en Tiempo Real
- Los cambios se sincronizan inmediatamente con el sitio web abierto
- Funciona mediante `postMessage` API y eventos de `storage`

### Validación
- Días: Solo números del 1-31
- Año: Solo números
- Colores: Validación de formato hexadecimal

### Diseño Responsive
- **Desktop**: Hasta 3 columnas
- **Tablet**: 2 columnas
- **Mobile**: 1 columna
- El contenido siempre permanece centrado

---

## 📱 Uso del Sistema

### Para editar títulos de Cursos:
1. Ir a Panel Admin → Pestaña "Cursos"
2. En la parte superior, editar "Título Principal" y/o "Subtítulo"
3. Los cambios se guardan automáticamente

### Para gestionar el Calendario:
1. Ir a Panel Admin → Pestaña "Calendario"
2. Editar título y subtítulo de la sección
3. Personalizar colores usando los selectores de color
4. Agregar eventos con el botón "➕ Agregar Nuevo Evento"
5. Editar campos de cada evento directamente
6. Eliminar eventos con el botón 🗑️

### Para verificar los cambios:
1. Abrir el sitio web (index.html) en otra pestaña
2. Los cambios del admin se reflejan automáticamente
3. También funciona al recargar la página (datos persistentes)

---

## 🔒 Seguridad y Persistencia

- Todos los datos se almacenan en localStorage del navegador
- Los datos persisten entre sesiones
- No se requiere base de datos
- Los cambios son específicos por navegador/dispositivo

---

## 🚀 Mejoras Futuras Sugeridas

1. Exportar/Importar configuración del calendario
2. Selector de fecha visual (date picker)
3. Preview en vivo dentro del panel admin
4. Templates predefinidos de eventos
5. Ordenar eventos por fecha automáticamente
6. Duplicar eventos existentes

---

## 📞 Soporte

Para cualquier duda o problema con el sistema, revisar:
- `admin-final.js` - Lógica principal
- `homepage.calendar.js` - Renderizado del calendario
- `homepage.courses.js` - Renderizado de cursos
- Consola del navegador para mensajes de error

---

**Fecha de implementación**: Octubre 2025
**Versión**: 1.0
**Estado**: ✅ Completamente funcional
