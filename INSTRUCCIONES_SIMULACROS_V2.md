# 📝 INSTRUCCIONES - Sistema de Simulacros (v2)

## ⚠️ CAMBIO IMPORTANTE

El sistema de simulacros ahora guarda los archivos PDF **como archivos reales** en la carpeta `documents/simulacros/` en lugar de usar base64 en localStorage (que causaba errores de cuota).

---

## 🔧 PASO 1: Reemplazar el código en admin-final.js

1. **Abre el archivo:** `admin-final.js`
2. **Busca la línea 2888** (aproximadamente) que dice:
   ```javascript
   class SimulacrosSystem {
   ```
3. **Selecciona TODO el código de la clase** desde `class SimulacrosSystem {` hasta el último `}` que cierra esa clase (termina alrededor de la línea 3100)
4. **Elimina todo ese código**
5. **Abre el archivo:** `simulacros-fix-v2.js`
6. **Copia TODO el contenido** de `simulacros-fix-v2.js`
7. **Pégalo** en `admin-final.js` donde estaba la clase SimulacrosSystem
8. **Guarda** el archivo `admin-final.js`

---

## 📂 PASO 2: Crear la carpeta para los PDFs

Ya se creó automáticamente la carpeta:
```
documents/simulacros/
```

---

## 🎯 CÓMO FUNCIONA AHORA

### En el Panel Admin:

1. **Completa el formulario:**
   - Nombre del simulacro
   - Selecciona uno o varios archivos PDF

2. **Click en "➕ Agregar Simulacro"**

3. **Los archivos se descargarán automáticamente** a tu computadora

4. **Tú debes colocar manualmente** esos archivos PDF en la carpeta:
   ```
   documents/simulacros/
   ```
   de tu proyecto (y luego en tu hosting)

5. **En localStorage solo se guarda** la referencia (nombre y ruta del archivo), no el archivo completo

### Para eliminar:

- Click en el botón **🗑️** en cada tarjeta
- **Importante:** También debes eliminar manualmente el archivo PDF de la carpeta `documents/simulacros/`

---

## 🌐 EN EL HOSTING

Cuando subas tu proyecto al hosting:

1. Asegúrate de incluir la carpeta `documents/simulacros/` con todos los PDFs
2. Los archivos deben estar en la ruta exacta: `documents/simulacros/nombre-archivo.pdf`
3. Los visitantes podrán descargar los PDFs directamente desde esa carpeta

---

## ✅ VERIFICACIÓN

1. Abre `admin.html` en tu navegador
2. Ve a la pestaña "📝 Simulacros"
3. Agrega un nombre y selecciona un PDF
4. Click en "Agregar Simulacro"
5. Debería descargarse el PDF automáticamente
6. Mueve ese PDF a `documents/simulacros/`
7. Abre `simulacros.html` y verifica que el PDF se pueda descargar

---

## 🐛 SOLUCIÓN DE PROBLEMAS

**❌ Error al guardar simulacros:**
- Este error ya NO debería aparecer porque no guardamos archivos grandes en localStorage
- Solo se guardan referencias pequeñas (nombre y ruta)

**No hay botón eliminar:**
- Verifica que reemplazaste correctamente el código en `admin-final.js`
- El botón 🗑️ debe aparecer en cada tarjeta

**El PDF no se descarga en la página pública:**
- Verifica que el archivo esté en `documents/simulacros/`
- Verifica que el nombre del archivo coincida exactamente

---

## 📊 ESTRUCTURA DE DATOS

En localStorage se guarda así:
```json
[
  {
    "nombre": "Simulacro Matemática 2024",
    "nombreArchivo": "simulacro-mate-2024.pdf",
    "rutaArchivo": "documents/simulacros/simulacro-mate-2024.pdf"
  }
]
```

**NO** se guarda el contenido del PDF, solo la referencia a dónde está el archivo.

---

## 🎨 DISEÑO

- **Grid de 3 columnas** en escritorio
- **2 columnas** en tablets
- **1 columna** en móviles
- Botón de eliminar visible en cada tarjeta
- Icono 📄 para cada simulacro
