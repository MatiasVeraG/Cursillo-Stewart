# 🎬 Sistema de Animaciones Elegantes y Performantes

**Autor:** Matías Vera G  
**Año:** 2025  
**Versión:** 1.0.0

---

## 📋 Resumen

Sistema completo de animaciones web modernas, elegantes y optimizadas para performance que mejora la experiencia de usuario del sitio Cursillo Stewart sin comprometer la funcionalidad existente.

---

## ✨ Características Implementadas

### 1. 🔢 Conteos Animados (CountUp.js)

**Elementos afectados:**
- Estadísticas de ingresantes dinámicas (por año y total)
- Cualquier elemento con clase `.metric-number[data-count]`

**Características:**
- Animación numérica suave de 0 al valor final
- Duración: 2.2 segundos
- Separador de miles con punto
- Se ejecuta **una sola vez** al entrar en viewport
- Compatible con contenido dinámico (usa MutationObserver)

**Uso:**
```html
<span class="metric-number" data-count="35">0</span>
```

---

### 2. 📜 Aparición Progresiva al Scroll (Scroll Reveal)

**Variantes disponibles:**

- **`.reveal.fade-up`** (default): Aparece desde abajo con fade
- **`.reveal.fade-in`**: Solo fade, sin movimiento
- **`.reveal.zoom-in`**: Aparece con zoom desde 96%
- **`.reveal.blur-in`**: Aparece desde blur hacia nítido

**Características:**
- Usa IntersectionObserver (alta performance)
- Threshold: 15% del elemento visible
- Transición suave de 0.6 segundos
- Se ejecuta una sola vez por elemento

**Uso:**
```html
<div class="reveal fade-up">Contenido</div>
<div class="reveal zoom-in">Botón</div>
```

---

### 3. 🎯 Stagger (Retardo Escalonado)

Crea efecto cascada en listas y grids.

**Uso:**
```html
<div class="stagger">
  <div class="reveal fade-up">Item 1</div>
  <div class="reveal fade-up">Item 2</div>
  <div class="reveal fade-up">Item 3</div>
</div>
```

Cada hijo se retrasa 80ms respecto al anterior.

---

### 4. 📌 Navbar Sticky con Sombra

**Comportamiento:**
- Al hacer scroll > 10px, aparece sombra elegante
- Backdrop filter con blur sutil
- Transición suave

**Clases afectadas:**
- `.navbar`, `header`, `.site-header`

---

### 5. 🌄 Parallax Sutil en Hero/Carrusel

**Características:**
- Movimiento vertical máximo: ±20px
- Basado en posición del scroll
- Usa requestAnimationFrame para smooth 60fps
- No afecta layout (transform only)

**Uso:**
```html
<section class="banner">
  <div class="parallax-wrap">
    <!-- Contenido que se moverá -->
  </div>
</section>
```

---

### 6. 🎨 Microinteracciones en Botones

Todos los botones tienen hover/focus mejorado:

```css
- transform: translateY(-1px)
- box-shadow aumentada
- Transición: 180ms
```

**Elementos afectados:**
- `.btn`, `.btn-primary`
- `.toggle-btn`, `.year-tab`

---

### 7. 🖼️ Imágenes Optimizadas

**Características aplicadas automáticamente:**
- `loading="lazy"` - Carga diferida
- `decoding="async"` - Decodificación asíncrona
- `object-fit: cover` - En carruseles/hero
- `image-rendering: auto` - Máxima calidad

---

### 8. ⚓ Smooth Scroll y Offset

```css
:root {
  scroll-behavior: smooth;
}

section[id] {
  scroll-margin-top: 80px; /* Compensación header fijo */
}
```

---

### 9. ♿ Accesibilidad: prefers-reduced-motion

**Respeta preferencias del sistema:**

```css
@media (prefers-reduced-motion: reduce) {
  /* Desactiva todas las animaciones */
  .reveal, .btn, .parallax-wrap {
    transition: none;
    animation: none;
  }
  
  :root {
    scroll-behavior: auto;
  }
}
```

El JavaScript también detecta esta preferencia y desactiva parallax y conteos.

---

## 📁 Archivos Modificados

### HTML (`index.html`)
- ✅ Actualizado header de créditos
- ✅ Agregadas clases `.reveal` en secciones clave
- ✅ Agregado `parallax-wrap` en banner
- ✅ Agregados atributos `loading="lazy"` y `decoding="async"` a imágenes
- ✅ Agregados `role` y `aria-label` en navegación
- ✅ Agregado script de animaciones (type="module") antes de `</body>`

### CSS (`styles.css`)
- ✅ Agregados estilos para `.reveal` y variantes
- ✅ Agregados estilos para `.stagger`
- ✅ Agregados estilos para navbar sticky
- ✅ Agregados estilos para parallax
- ✅ Agregadas microinteracciones de botones
- ✅ Agregado soporte `prefers-reduced-motion`
- ✅ Agregado smooth scroll y scroll-margin

### JavaScript (`homepage.ingresantes.js`)
- ✅ Modificadas estadísticas para incluir `data-count="X"`
- ✅ Agregadas clases `.reveal` en elementos dinámicos
- ✅ Compatible con MutationObserver del script principal

### JavaScript (Script inline en `index.html`)
- ✅ CountUp.js importado desde CDN (Skypack)
- ✅ IntersectionObserver para scroll reveal
- ✅ IntersectionObserver para conteos animados
- ✅ MutationObserver para contenido dinámico
- ✅ Scroll listener para navbar sticky
- ✅ Scroll listener + rAF para parallax
- ✅ Lazy loading automático
- ✅ Detección de `prefers-reduced-motion`

---

## 🎯 Secciones Animadas

### ✅ Header/Navbar
- Logo con `.reveal.fade-in`
- Enlaces con atributos ARIA
- Sticky shadow al scroll

### ✅ Banner/Hero
- Título, subtítulo, descripción con `.reveal.fade-up`
- Botón con `.reveal.zoom-in`
- Parallax en background

### ✅ Conócenos
- Header con `.reveal.fade-up`
- Imagen del departamento con `.reveal.fade-in` y lazy loading

### ✅ Countdown
- Header con `.reveal.fade-up`
- Timer con `.reveal.zoom-in`

### ✅ Ingresantes
- Header con `.reveal.fade-up`
- Tabs con `.reveal.fade-up`
- Contenido con `.reveal.fade-in`
- Estadísticas con `.stagger` y conteos animados

### ✅ Programa/Cursos
- Header con `.reveal.fade-up`
- Toggle nav con `.reveal.fade-up`
- Cards con `.stagger` y `.reveal.fade-up`

### ✅ Inscripción
- Header con `.reveal.fade-up`
- Formulario con `.reveal.zoom-in`

### ✅ Contacto
- Header con `.reveal.fade-up`
- Grid con `.stagger`
- Formulario e info con `.reveal.fade-up`

---

## 🚀 Performance

**Optimizaciones implementadas:**

1. **IntersectionObserver** en lugar de scroll listeners pesados
2. **requestAnimationFrame** para parallax suave
3. **will-change** solo en elementos que lo necesitan
4. **Lazy loading** de imágenes
5. **CSS transforms** (no afectan layout)
6. **Passive event listeners** donde corresponde
7. **Unobserve** después de animación (no re-anima)

**Métricas esperadas:**
- ✅ No hay CLS (Cumulative Layout Shift)
- ✅ Smooth 60 FPS en animaciones
- ✅ Carga de imágenes diferida
- ✅ No bloquea el thread principal

---

## 🧪 Validación

### ✅ Checklist de Pruebas

- [x] Números cuentan de 0 al valor final una sola vez
- [x] Elementos aparecen suavemente al hacer scroll
- [x] Navbar muestra sombra al scrollear > 10px
- [x] Parallax se mueve ±20px máximo
- [x] Botones tienen hover suave
- [x] No hay saltos en el layout
- [x] Imágenes cargan lazy
- [x] Smooth scroll funciona
- [x] Anclas compensan header fijo
- [x] Con `prefers-reduced-motion` no hay animaciones fuertes

### 🧪 Pruebas Recomendadas

1. **Scroll lento por toda la página:** Ver todas las animaciones
2. **Recarga rápida:** Verificar que no hay flashes
3. **Scroll rápido:** Verificar que no se rompe
4. **Resize:** Verificar parallax se recalcula
5. **Tab dinámico (ingresantes):** Verificar números animan al cambiar
6. **DevTools > Rendering > Emulate prefers-reduced-motion:** Verificar desactivación

---

## 🔧 Configuración y Customización

### Ajustar velocidad de animaciones

En `styles.css`:
```css
.reveal {
  transition: opacity 0.6s ease, transform 0.6s ease; /* Cambiar 0.6s */
}
```

### Ajustar retardo de stagger

En `styles.css`:
```css
.stagger > * {
  transition-delay: calc(var(--i, 0) * 80ms); /* Cambiar 80ms */
}
```

### Ajustar parallax intensity

En el script de animaciones:
```javascript
const translate = pct * 20; // Cambiar 20 (px máximo)
```

### Ajustar threshold de scroll reveal

En el script de animaciones:
```javascript
{ threshold: 0.15 } // Cambiar 0.15 (15% visible)
```

---

## 📦 Dependencias

### Externas (CDN)
- **CountUp.js** v2.0.8 (https://cdn.skypack.dev/countup.js@2.0.8)

### Internas (Vanilla JS)
- IntersectionObserver (nativo)
- MutationObserver (nativo)
- requestAnimationFrame (nativo)

**No requiere jQuery, GSAP ni otras librerías.**

---

## 🐛 Troubleshooting

### Los números no animan
1. Verificar que tienen `class="metric-number"` y `data-count="X"`
2. Verificar que están en viewport (hacer scroll hacia ellos)
3. Revisar consola por errores de importación de CountUp

### Los elementos no aparecen
1. Verificar que tienen clase `.reveal`
2. Verificar que no están ocultos con CSS
3. Revisar que IntersectionObserver está soportado (todos los navegadores modernos)

### Parallax no funciona
1. Verificar que hay elementos con clase `.parallax-wrap`
2. Verificar que no está activado `prefers-reduced-motion`
3. Revisar consola por errores

### Animaciones muy lentas/rápidas
1. Ajustar valores de `transition` en CSS
2. Ajustar `duration` de CountUp en el script

---

## 📚 Recursos

- [CountUp.js Documentation](https://github.com/inorganik/CountUp.js)
- [IntersectionObserver API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [will-change](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)

---

## 📝 Notas Finales

- ✅ Sistema 100% retrocompatible con código existente
- ✅ No modifica lógicas de countdown, ingresantes, cursos
- ✅ Performance-first approach
- ✅ Accesible y progresivo
- ✅ Preparado para contenido dinámico

**Desarrollado con ❤️ por Matías Vera G - 2025**

---

## 🎉 ¡Listo para Producción!

El sistema está completamente implementado y probado. Todos los archivos están actualizados y listos para despliegue.

**Disfruta de las animaciones elegantes sin sacrificar performance!** ✨
