# 🔐 Sistema de Administración - Cursillo Stewart

## 📋 Descripción

Sistema de administración web seguro y fácil de usar que permite al jefe/director modificar contenido, imágenes y configuraciones del sitio web directamente desde el navegador.

## ✨ Características

### 🔒 Seguridad

- **Login protegido** con múltiples usuarios
- **Sesiones con expiración** (4 horas)
- **Autenticación segura**
- **Protección CSRF**
- **Validación de archivos**

### 📝 Gestión de Contenido

- **Editor en tiempo real** de textos
- **Vista previa** de cambios
- **Gestión de imágenes** (drag & drop)
- **Estadísticas de estudiantes**
- **Información de contacto**
- **Redes sociales**

### 💾 Respaldo y Restauración

- **Backup automático** antes de cambios importantes
- **Descarga de respaldos** en formato JSON
- **Restauración** desde archivo de respaldo
- **Historial de backups**

## 🚀 Instalación

### 1. Subir Archivos al Hosting

Sube estos archivos a tu hosting de 1000MB:

```
/
├── admin.html          # Panel de administración
├── admin.css          # Estilos del panel
├── admin.js           # Funcionalidad JavaScript
├── admin_api.php      # API para guardar datos (opcional)
├── index.html         # Tu página principal
├── styles.css         # Estilos de la página
└── images/            # Carpeta de imágenes
```

### 2. Configurar Permisos

Si usas PHP, asegúrate de que estas carpetas tengan permisos de escritura:

```bash
chmod 755 backups/
chmod 755 uploads/
chmod 644 admin_data.json
```

### 3. Acceder al Panel

Ve a: `https://tu-dominio.com/admin.html`

## 🔑 Credenciales de Acceso

### Usuarios Predeterminados:

| Usuario    | Contraseña    | Descripción             |
| ---------- | ------------- | ----------------------- |
| `admin`    | `stewart2024` | Administrador principal |
| `jefe`     | `cursillo123` | Jefe/Director           |
| `director` | `uptp2024`    | Director académico      |

> ⚠️ **IMPORTANTE**: Cambia estas contraseñas después de la primera instalación

## 📖 Guía de Uso

### 🔓 Iniciar Sesión

1. Ve a `admin.html`
2. Ingresa usuario y contraseña
3. Haz clic en "Ingresar"

### 📝 Editar Contenido

1. **Sección "Contenido"**:

   - Modifica títulos, descripciones, información de contacto
   - Los cambios se ven en tiempo real

2. **Secciones Editables**:
   - 🏠 Banner principal (título, subtítulo, descripción)
   - ℹ️ Sección "Conócenos"
   - 📞 Información de contacto (teléfono, email, dirección, horarios)

### 🖼️ Gestionar Imágenes

1. **Imágenes de Fondo**:

   - Arrastra y suelta imágenes en el área designada
   - O haz clic en "Seleccionar Imágenes"
   - Formatos admitidos: JPG, PNG, GIF, WebP
   - Tamaño máximo: 5MB por imagen

2. **Logo**:
   - Haz clic en "Cambiar Logo"
   - Selecciona nueva imagen
   - Se actualiza automáticamente

### 📚 Cursos

1. Edita descripciones de los cursos:
   - Curso Intensivo
   - Curso Extensivo
   - Curso MOFA
2. Agrega precios (opcional)

### 🎓 Estudiantes

1. **Estadísticas**:
   - Actualiza números de ingresantes por año
   - Los cambios se reflejan en la página principal

### ⚙️ Configuración

1. **Redes Sociales**:

   - Agrega URLs de Facebook, Instagram
   - Configura número de WhatsApp

2. **Cambiar Contraseña**:
   - Ingresa contraseña actual
   - Define nueva contraseña (mínimo 6 caracteres)
   - Confirma la nueva contraseña

### 💾 Respaldos

1. **Crear Respaldo**:

   - Haz clic en "Crear Respaldo"
   - Se descarga archivo JSON con toda la información

2. **Restaurar**:
   - Haz clic en "Restaurar Respaldo"
   - Selecciona archivo JSON de respaldo
   - Confirma la restauración

### 👁️ Vista Previa

1. Haz clic en "Vista Previa"
2. Ve cómo se verán los cambios
3. Cierra la vista previa

### 💾 Guardar Cambios

1. Haz clic en "Guardar Cambios"
2. Espera confirmación de guardado exitoso
3. Los cambios se aplicarán al sitio web

## 🔧 Configuración Avanzada

### Cambiar Credenciales de Acceso

Edita el archivo `admin.js`, línea ~45:

```javascript
const validCredentials = {
  tu_usuario: 'tu_contraseña',
  otro_usuario: 'otra_contraseña',
};
```

### Configurar con PHP (Opcional)

Si tu hosting soporta PHP, el sistema puede:

- Guardar cambios en archivos del servidor
- Crear backups automáticos
- Validar uploads de manera más segura

Edita `admin_api.php` para configurar dominios permitidos:

```php
$allowed_origins = [
    'https://tu-dominio.com',
    'https://www.tu-dominio.com'
];
```

## 📱 Compatibilidad

### ✅ Navegadores Soportados:

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 70+

### ✅ Dispositivos:

- 💻 Escritorio (recomendado)
- 📱 Tablet
- 📱 Móvil (funcionalidad limitada)

## 🛡️ Seguridad

### Medidas Implementadas:

- ✅ Autenticación con contraseña
- ✅ Sesiones con expiración automática
- ✅ Validación de tipos de archivo
- ✅ Límites de tamaño de upload
- ✅ Sanitización de datos
- ✅ Protección contra XSS
- ✅ Headers de seguridad HTTP

### Recomendaciones:

1. **Cambia las contraseñas** predeterminadas
2. **Usa HTTPS** en producción
3. **Mantén backups** regulares
4. **Limita el acceso** al archivo admin.html
5. **Actualiza contraseñas** periódicamente

## 🆘 Solución de Problemas

### ❌ No puedo iniciar sesión

- Verifica usuario y contraseña
- Limpia caché del navegador
- Verifica que JavaScript esté habilitado

### ❌ No se guardan los cambios

- Verifica conexión a internet
- Revisa permisos de archivos (si usas PHP)
- Verifica espacio disponible en hosting

### ❌ No puedo subir imágenes

- Verifica que el archivo sea una imagen válida
- Confirma que el tamaño sea menor a 5MB
- Revisa permisos de la carpeta uploads/

### ❌ Error de sesión expirada

- Las sesiones duran 4 horas máximo
- Vuelve a iniciar sesión
- Guarda cambios frecuentemente

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: cursillostewart@gmail.com
- 📱 WhatsApp: +595 985 350550

## 📄 Licencia

Sistema desarrollado exclusivamente para Cursillo Stewart - UPTP.
Todos los derechos reservados © 2024.

---

**¡Disfruta de tu nuevo sistema de administración! 🎉**
