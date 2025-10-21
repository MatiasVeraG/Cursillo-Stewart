# Assets para Documentación

Esta carpeta contiene los assets visuales para la documentación del proyecto.

## 📸 Capturas de Pantalla Requeridas

### 1. `hero-screenshot.png` o `.webp`
- **Descripción**: Captura de la página principal (hero/banner)
- **Dimensiones recomendadas**: 1920×1080 o 1280×720
- **Formato**: WebP preferido (< 400 KB)
- **Contenido**: Landing page con animaciones, título principal, botón CTA

### 2. `admin-screenshot.png` o `.webp`
- **Descripción**: Captura del panel de administración
- **Dimensiones recomendadas**: 1920×1080 o 1280×720
- **Formato**: WebP preferido (< 400 KB)
- **Contenido**: Admin panel mostrando gestión de ingresantes o countdown

### 3. `simulacros-screenshot.png` o `.webp`
- **Descripción**: Captura de la página de simulacros
- **Dimensiones recomendadas**: 1920×1080 o 1280×720
- **Formato**: WebP preferido (< 400 KB)
- **Contenido**: Tabla de simulacros con PDFs disponibles

### 4. `social-preview.png`
- **Descripción**: Imagen de preview para redes sociales (GitHub, Twitter, etc.)
- **Dimensiones**: 1280×640 px (exacto)
- **Formato**: PNG
- **Contenido**: Logo + nombre del proyecto + tagline

## 📹 GIF Opcional

### `admin-demo.gif`
- **Descripción**: Demo corta de edición en admin → reflejo en homepage
- **Duración**: ≤ 5 segundos
- **Formato**: GIF optimizado
- **Tamaño**: < 2 MB

---

## 🛠️ Cómo Generar las Capturas

### Herramientas Recomendadas

1. **Screenshots**: 
   - Windows: `Win + Shift + S`
   - macOS: `Cmd + Shift + 4`
   - Chrome DevTools: `Cmd/Ctrl + Shift + P` → "Capture screenshot"

2. **Optimización a WebP**:
   ```bash
   # Con ImageMagick
   convert screenshot.png -quality 85 screenshot.webp
   
   # Con cwebp (libwebp)
   cwebp -q 85 screenshot.png -o screenshot.webp
   ```

3. **GIF Recording**:
   - [ScreenToGif](https://www.screentogif.com/) (Windows)
   - [Kap](https://getkap.co/) (macOS)
   - [Peek](https://github.com/phw/peek) (Linux)

### Consejos

- ✅ Usar navegador en modo incógnito (sin extensiones)
- ✅ Zoom al 100%
- ✅ Limpiar console y localStorage si es demo fresca
- ✅ Usar datos realistas en capturas (no "test test")
- ✅ Verificar que el tamaño final < 400 KB

---

## 📋 Checklist

- [ ] `hero-screenshot.webp` (< 400 KB)
- [ ] `admin-screenshot.webp` (< 400 KB)
- [ ] `simulacros-screenshot.webp` (< 400 KB)
- [ ] `social-preview.png` (1280×640 px)
- [ ] `admin-demo.gif` (opcional, < 2 MB)

---

**Nota**: Las imágenes NO están incluidas en el repositorio inicial.  
Debes generarlas localmente y agregarlas a esta carpeta.
