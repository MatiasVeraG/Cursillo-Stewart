# Guía de Edición de la Sección "Conócenos"

## 📋 Descripción General

La sección "Conócenos" ahora es completamente editable desde el panel de administración (`admin.html`). Puedes modificar títulos, subtítulos, y gestionar el timeline de eventos históricos de manera visual e intuitiva.

## 🎯 Características Principales

### 1. **Títulos y Subtítulos Editables**
- **Título de la Sección**: Edita el título principal "Conócenos"
- **Descripción de la Sección**: Modifica la descripción introductoria

### 2. **Timeline Dinámico y Editable**
El timeline (línea de tiempo) permite:
- ✅ **Agregar** nuevas entradas de eventos
- ✏️ **Editar** años, títulos y descripciones
- 📷 **Subir imágenes** para cada evento (opcional)
- 🗑️ **Eliminar** entradas que ya no necesites
- 🔄 **Ordenamiento automático** por año
- 💾 **Guardado automático** de cambios

### 3. **Actualizaciones en Tiempo Real**
- Los cambios se reflejan **inmediatamente** en `index.html`
- No necesitas recargar la página para ver los cambios
- Sistema de sincronización automática entre admin y homepage

## 📝 Cómo Usar

### Editar Títulos y Descripciones

1. Abre el panel de administración: `admin.html`
2. Inicia sesión con tus credenciales
3. Ve a la pestaña **"ℹ️ Conócenos"**
4. En la tarjeta **"📋 Información General"**:
   - Modifica el **Título de la Sección**
   - Edita la **Descripción Principal**
5. Los cambios se guardan automáticamente

### Gestionar el Timeline

#### Agregar un Nuevo Evento

1. En la sección **"📅 Historia - Timeline"**
2. Haz clic en el botón **"➕ Agregar Nuevo Año"**
3. Se creará una nueva entrada con el año actual
4. Completa los campos:
   - **Año**: Escribe el año (ej: 2025) o "Presente"
   - **Título del Evento**: Ej: "Los Inicios", "Nueva Sede"
   - **Descripción**: Describe qué pasó en ese año
   - **Imagen (opcional)**: Haz clic en el área de carga para subir una imagen

#### Editar un Evento Existente

1. Localiza la entrada que deseas editar
2. Modifica cualquiera de sus campos:
   - **Año**: Cambia el año (el timeline se reordenará automáticamente)
   - **Título**: Actualiza el título del evento
   - **Descripción**: Edita la descripción
   - **Imagen**: Haz clic en el área de imagen para cambiarla

#### Eliminar un Evento

1. Localiza la entrada que deseas eliminar
2. Haz clic en el botón **🗑️** (papelera) en la esquina superior derecha
3. Confirma la eliminación en el diálogo que aparece

### Subir Imágenes al Timeline

1. Haz clic en el área de carga de imagen (📷)
2. Selecciona una imagen de tu computadora
3. **Formatos aceptados**: JPG, PNG, GIF
4. **Tamaño máximo**: 5MB
5. La imagen se mostrará inmediatamente con su nombre

### Restaurar Configuración por Defecto

Si deseas volver a la configuración original:

1. Haz clic en **"🔄 Restaurar Timeline por Defecto"**
2. Confirma la acción
3. Se restaurarán los eventos predeterminados

### Establecer como Predeterminado

Para guardar tu configuración actual como nueva configuración por defecto:

1. Configura el timeline como desees
2. Haz clic en **"💾 Establecer como Predeterminado"**
3. Esta configuración será la nueva base para futuras restauraciones

## 🎨 Características de Diseño

### Centralidad de Objetos
- El timeline mantiene **todos los elementos centrados**
- No importa cuántas entradas agregues, el diseño se mantiene equilibrado
- Las imágenes se centran automáticamente con un tamaño máximo de 400px

### Responsive Design
- El timeline se adapta perfectamente a dispositivos móviles
- Las tarjetas se apilan verticalmente en pantallas pequeñas
- Las imágenes se redimensionan manteniendo su aspecto

### Transiciones Suaves
- Cambios con animaciones sutiles
- Efectos de hover en las tarjetas
- Transiciones de opacidad al actualizar contenido

## 💡 Consejos y Buenas Prácticas

### Para Años
- Usa años numéricos (ej: 2022, 2023, 2025)
- Puedes usar "Presente" para el evento actual
- El timeline se ordena automáticamente por año

### Para Títulos
- Mantén los títulos concisos (2-5 palabras)
- Ejemplos buenos: "Los Inicios", "Nueva Sede", "Primera Mudanza"

### Para Descripciones
- Sé descriptivo pero conciso
- Entre 2-4 oraciones es ideal
- Cuenta la historia de manera clara y atractiva

### Para Imágenes
- Usa imágenes de alta calidad
- Formato horizontal funciona mejor (4:3 o 16:9)
- Comprime las imágenes antes de subirlas (máx. 5MB)
- Asegúrate de que las imágenes sean relevantes al evento

## 🔧 Archivos Involucrados

### Frontend (Homepage)
- `index.html` - Sección "Conócenos" (líneas ~160-280)
- `homepage.conocenos.js` - Gestor de actualizaciones en tiempo real
- `styles.css` - Estilos del timeline

### Backend (Admin)
- `admin.html` - Panel de edición (pestaña "Conócenos")
- `admin.js` - Lógica de gestión del timeline
- `admin.css` - Estilos del panel de administración

### Almacenamiento
- `localStorage.timeline_data` - Datos del timeline
- `localStorage.website_content` - Contenido general incluyendo títulos

## 🐛 Solución de Problemas

### Los cambios no se reflejan en index.html
1. Verifica que hayas guardado los cambios (botón "💾 Guardar Cambios")
2. Refresca `index.html` (F5)
3. Limpia el caché del navegador si es necesario

### La imagen no se sube
1. Verifica que el archivo sea menor a 5MB
2. Asegúrate de que sea un formato de imagen válido (JPG, PNG, GIF)
3. Prueba con otra imagen

### El timeline no se ordena correctamente
1. Verifica que los años estén en formato numérico
2. "Presente" siempre aparece al final
3. El ordenamiento es automático al guardar

### Perdí mi configuración
1. Si guardaste tu configuración como predeterminada, puedes restaurarla
2. Haz clic en "🔄 Restaurar Timeline por Defecto"

## 🔐 Seguridad

- Solo usuarios autenticados pueden editar el contenido
- Las sesiones expiran después de 4 horas de inactividad
- Los datos se guardan localmente en el navegador
- No se envía información a servidores externos

## 📱 Compatibilidad

- ✅ Chrome, Edge, Firefox, Safari (últimas versiones)
- ✅ Dispositivos móviles (iOS y Android)
- ✅ Tablets y computadoras de escritorio

## 🎉 Funcionalidades Adicionales

### Auto-guardado
- Los cambios se guardan automáticamente después de 2 segundos de inactividad
- Indicador visual cuando se guarda: "✓ Guardado"

### Sistema de Confirmación
- Las acciones destructivas (eliminar, restaurar) requieren confirmación
- Previene pérdidas accidentales de datos

### Sincronización Cross-Tab
- Si tienes múltiples pestañas abiertas, los cambios se sincronizan
- Útil si trabajas con admin.html e index.html al mismo tiempo

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa esta guía completa
2. Verifica la consola del navegador (F12) para errores
3. Asegúrate de que JavaScript esté habilitado en tu navegador

---

**Última actualización**: Octubre 2025  
**Versión**: 2.0  
**Autor**: Sistema de Gestión Cursillo Stewart
