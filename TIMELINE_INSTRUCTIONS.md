# 📅 **Instrucciones del Timeline Dinámico**

## ✅ **Nuevas Funcionalidades Implementadas**

### **🔄 Timeline Completamente Dinámico**

- **Modificar años**: Puedes cambiar cualquier año haciendo clic en el campo del año
- **Agregar nuevos años**: Botón "➕ Agregar Nuevo Año" para crear nuevas entradas
- **Eliminar años**: Botón 🗑️ para eliminar entradas existentes
- **Ordenación automática**: El timeline se ordena automáticamente por año

### **🖼️ Imágenes en Todo el Panel**

- **Timeline con imágenes**: Cada entrada del timeline puede tener su propia imagen
- **Imagen del departamento inicial**: Integrada automáticamente en la entrada del 2022
- **Bloques con imágenes**: Todos los bloques de contenido ahora pueden tener imágenes
- **Subida de archivos**: Arrastra y suelta o haz clic para subir imágenes
- **Validación**: Solo permite imágenes (JPG, PNG, GIF) de máximo 5MB

## 🚀 **Cómo Usar el Timeline Dinámico**

### **Para Agregar una Nueva Entrada:**

1. Ve a la pestaña **"Conócenos"**
2. En la sección "📅 Historia - Timeline"
3. Haz clic en **"➕ Agregar Nuevo Año"**
4. Se creará una nueva entrada con el año actual
5. Modifica el año, título y descripción según necesites
6. Opcionalmente, agrega una imagen haciendo clic en el área de imagen

### **Para Modificar una Entrada Existente:**

1. **Cambiar año**: Haz clic en el campo del año y escribe el nuevo año
2. **Cambiar título**: Modifica el campo "Título del Evento"
3. **Cambiar descripción**: Edita el área de texto grande
4. **Agregar/cambiar imagen**: Haz clic en el área de imagen para subir una nueva

### **Para Eliminar una Entrada:**

1. Haz clic en el botón **🗑️** en la esquina superior derecha de la entrada
2. Confirma la eliminación en el diálogo que aparece
3. La entrada se eliminará permanentemente

## 🖼️ **Cómo Agregar Imágenes a Otros Bloques**

### **Timeline:**

- Cada entrada del timeline tiene su propia área de imagen
- Haz clic en el área que dice "Haz clic para subir imagen"
- Selecciona una imagen de tu computadora
- La imagen se mostrará inmediatamente en el timeline

### **Otros Bloques de Contenido:**

- El sistema automáticamente detecta otros bloques y les agrega capacidad de imagen
- Busca el área "Imagen del Bloque (opcional)" en cualquier sección
- Funciona igual que las imágenes del timeline

### **Imagen del Departamento Inicial:**

- **Integrada automáticamente**: La imagen del departamento inicial ahora forma parte del timeline del año 2022
- **Editable**: Puedes cambiar esta imagen directamente desde la entrada del 2022 en el timeline
- **Organizada**: Ya no es una sección separada, está contextualizada en la historia

## ⚙️ **Características Técnicas**

### **Guardado Automático:**

- Todos los cambios se guardan automáticamente
- Los datos se almacenan en el navegador (localStorage)
- No se pierden los cambios al recargar la página

### **Ordenación Inteligente:**

- Las entradas se ordenan automáticamente por año
- "Presente" siempre aparece al final
- Al cambiar un año, el timeline se reorganiza automáticamente

### **Validación de Imágenes:**

- Solo acepta archivos de imagen (JPG, PNG, GIF)
- Tamaño máximo: 5MB por imagen
- Muestra preview inmediato de la imagen subida

### **Integración con Homepage:**

- Los cambios del timeline se reflejan automáticamente en la página principal
- Usa el botón "Vista Previa" para ver los cambios en tiempo real
- Las imágenes del timeline aparecerán en la sección de historia del sitio web

## 🔧 **Datos Técnicos**

### **Almacenamiento:**

- **Timeline**: `timeline_data` en localStorage
- **Imágenes de bloques**: `block_images` en localStorage
- **Contenido general**: `website_content` en localStorage

### **Estructura de Datos del Timeline:**

```javascript
{
  id: "timeline_1728316234567_abc123def",
  year: "2023",
  title: "Primera Mudanza",
  description: "Con el crecimiento inicial...",
  image: "data:image/jpeg;base64,...",  // Base64 de la imagen
  imageName: "foto-mudanza.jpg"
}
```

## 📱 **Compatibilidad**

- **Responsive**: Funciona en móviles y tablets
- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Persistent**: Los datos se mantienen entre sesiones

¡El timeline dinámico está completamente funcional y listo para usar! 🎉
