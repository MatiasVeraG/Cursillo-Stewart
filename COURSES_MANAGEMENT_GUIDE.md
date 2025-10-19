# 📚 Sistema de Gestión de Cursos - Documentación

## ✨ Funcionalidades Implementadas

### 1. **Interfaz de Administración**

- Panel completo para gestionar cursos en `admin.html`
- Pestañas para cada curso con colores personalizables
- Editor visual para turnos/horarios
- Diseño responsive y moderno

### 2. **Características Principales**

#### **Gestión de Cursos**

- ➕ **Agregar nuevos cursos**: Botón "Agregar Nuevo Curso"
- ✏️ **Editar nombre del curso**: Campo editable en tiempo real
- 🎨 **Personalizar color**: Selector de color con preview en hex
- 🗑️ **Eliminar cursos**: Con confirmación de seguridad

#### **Gestión de Turnos**

- ➕ **Agregar turnos**: Ilimitados por curso
- ✏️ **Editar turnos**: Modal completo con todos los campos
  - Título del turno
  - Tipo de modalidad (Presencial, Sábados, Virtual, MOFA)
  - Etiqueta personalizada
  - Horario
  - Días de clase
  - Período académico
- 🗑️ **Eliminar turnos**: Con confirmación

### 3. **Visualización en Homepage**

#### **Diseño Responsive**

- ✅ Máximo 3 columnas en pantallas grandes
- ✅ Layout adaptativo para tablets y móviles
- ✅ **Centralidad automática**: Los elementos siempre están centrados, sin importar la cantidad

#### **Organización Visual**

- Cards con colores según tipo de modalidad:
  - 🔵 Presencial (azul)
  - 🟡 Sábados (amarillo)
  - 🟢 Virtual (verde)
  - 🔴 MOFA (rojo)

### 4. **Sincronización en Tiempo Real**

- Los cambios se guardan automáticamente en `localStorage`
- Actualización instantánea en la página principal
- Sistema de mensajes para confirmar acciones

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:

1. **`data/courses.json`**: Estructura de datos de los cursos
2. **`homepage.courses.js`**: Script para renderizar cursos en homepage

### Archivos Modificados:

1. **`admin.html`**: Nueva sección de gestión de cursos
2. **`admin.css`**: Estilos para el editor de cursos
3. **`admin.js`**: Lógica de gestión de cursos
4. **`admin-final.js`**: Sistema de cursos integrado
5. **`index.html`**: Importación del script de cursos
6. **`styles.css`**: Grid responsive con máximo 3 columnas

## 🎯 Cómo Usar

### En el Panel de Administración:

1. **Acceder a la sección Cursos**

   - Ir a `admin.html`
   - Click en la pestaña "📚 Cursos"

2. **Editar un Curso Existente**

   - Seleccionar el curso en las pestañas superiores
   - Cambiar nombre o color según necesites
   - Los cambios se guardan automáticamente

3. **Agregar un Nuevo Turno**

   - Click en "➕ Agregar Turno"
   - Se abrirá un modal con todos los campos
   - Llenar la información
   - Click en "Guardar"

4. **Editar un Turno**

   - Click en "✏️ Editar" en cualquier turno
   - Modificar los campos necesarios
   - Guardar cambios

5. **Eliminar un Turno**

   - Click en "🗑️ Eliminar"
   - Confirmar la acción

6. **Crear un Nuevo Curso**
   - Click en "➕ Agregar Nuevo Curso"
   - Ingresar el nombre
   - Configurar color y agregar turnos

## 🎨 Personalización

### Colores de Modalidades

Los colores de las badges se pueden personalizar en `styles.css` y `admin.css`:

```css
.schedule-type-badge.presencial {
  background: #dbeafe;
  color: #1e40af;
}
```

### Grid Layout

El grid se ajusta automáticamente pero respeta un máximo de 3 columnas:

```css
.schedule-grid {
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  max-width: 1400px;
}
```

## 🔄 Flujo de Datos

1. **Carga inicial**: `data/courses.json` → `localStorage`
2. **Edición**: Panel Admin → `localStorage` → Homepage
3. **Visualización**: Homepage lee de `localStorage` o JSON
4. **Sincronización**: `postMessage` entre ventanas

## ✅ Características de Calidad

- ✨ **Sin pérdida de centralidad**: Elementos siempre centrados
- 📱 **Responsive**: Se adapta a todos los tamaños de pantalla
- 🎨 **UI consistente**: Mantiene el diseño actual del index.html
- ⚡ **Rendimiento**: Carga rápida y eficiente
- 💾 **Persistencia**: Los datos se guardan localmente
- 🔒 **Seguridad**: Confirmaciones antes de eliminar

## 🚀 Próximas Mejoras Sugeridas

1. Exportar/Importar cursos en JSON
2. Duplicar cursos existentes
3. Reordenar turnos con drag & drop
4. Preview en tiempo real antes de guardar
5. Historial de cambios (undo/redo)

## 📞 Soporte

Si encuentras algún problema o necesitas agregar funcionalidades, revisa:

- Consola del navegador (F12) para errores
- `localStorage` para verificar datos guardados
- Archivos `.js` para lógica de negocio

---

**Desarrollado con ❤️ para Cursillo Stewart**
