# 🧪 CHECKLIST DE VALIDACIÓN - Animaciones Elegantes

**Proyecto:** Cursillo Stewart UPTP  
**Autor:** Matías Vera G  
**Fecha:** 20 de Octubre de 2025

---

## 📋 INSTRUCCIONES

1. Abre `index.html` en tu navegador
2. Abre DevTools (F12) > Console
3. Verifica que aparezca el mensaje: `✨ Sistema de animaciones inicializado`
4. Sigue este checklist paso a paso

---

## ✅ VALIDACIÓN VISUAL

### 🏠 1. BANNER / HERO

- [ ] **Al cargar la página:**
  - [ ] Logo aparece con fade-in suave
  - [ ] Título "Cursillo Stewart" aparece desde abajo
  - [ ] Subtítulo aparece después del título
  - [ ] Descripción aparece después del subtítulo
  - [ ] Botón "Inscríbete Ahora" hace zoom-in
  - [ ] NO hay "saltos" en el layout

- [ ] **Al hacer scroll lento hacia abajo y luego volver arriba:**
  - [ ] Background del banner se mueve sutilmente (parallax)
  - [ ] Movimiento NO excede ±20px (verificar visualmente)

- [ ] **Al hacer hover sobre el botón principal:**
  - [ ] Se eleva ligeramente (translateY -1px)
  - [ ] Sombra se hace más prominente
  - [ ] Transición es suave (~180ms)

---

### 📖 2. SECCIÓN CONÓCENOS

- [ ] **Al scrollear a esta sección:**
  - [ ] Header "Conócenos" aparece desde abajo
  - [ ] Subtítulo aparece después
  - [ ] Timeline items aparecen progresivamente
  - [ ] Imagen del departamento aparece con fade-in
  - [ ] Imagen carga con lazy loading (Network tab: ver que carga al acercarse)

---

### ⏰ 3. CONTADOR REGRESIVO

- [ ] **Al scrollear a esta sección:**
  - [ ] Header "Próximo Cursillo Intensivo" aparece desde abajo
  - [ ] Timer completo hace zoom-in
  - [ ] Countdown funciona correctamente (días/horas/minutos/segundos)
  - [ ] NO interfiere con la lógica del countdown existente

---

### 🎓 4. NUESTROS INGRESANTES

- [ ] **Al scrollear a esta sección:**
  - [ ] Header aparece desde abajo
  - [ ] Tabs de años aparecen con fade-up
  - [ ] Contenido de ingresantes aparece

- [ ] **Estadísticas (IMPORTANTE):**
  - [ ] Números inician en **0** (no aparecen directamente en su valor final)
  - [ ] Números **cuentan animadamente** de 0 al valor final
  - [ ] Ejemplo: "35 Ingresantes 2025" cuenta 0→35 en ~2.2 segundos
  - [ ] Ejemplo: "Total Ingresantes" cuenta 0→total en ~2.2 segundos
  - [ ] Cada stat-item aparece con un pequeño retardo (efecto cascada/stagger)
  - [ ] Animación ocurre **UNA SOLA VEZ** (no se repite al volver a scrollear)

- [ ] **Al cambiar de tab (ej: 2024 → 2025):**
  - [ ] Nuevas estadísticas también animan de 0→valor
  - [ ] Contenido cambia correctamente

---

### 📚 5. CURSOS / PROGRAMA

- [ ] **Al scrollear a esta sección:**
  - [ ] Header "Cursos" aparece desde abajo
  - [ ] Botones de toggle aparecen con fade-up
  - [ ] Cards de horarios aparecen con efecto cascada (stagger)
  - [ ] Cada card aparece con un pequeño retardo

- [ ] **Al cambiar de curso (Intensivo/Extensivo/MOFA):**
  - [ ] Contenido cambia correctamente
  - [ ] NO hay animaciones rotas o duplicadas

---

### ✍️ 6. INSCRIPCIÓN

- [ ] **Al scrollear a esta sección:**
  - [ ] Header aparece desde abajo
  - [ ] Formulario completo hace zoom-in elegante
  - [ ] Inputs del formulario funcionan correctamente

---

### 📞 7. CONTACTO

- [ ] **Al scrollear a esta sección:**
  - [ ] Header aparece desde abajo
  - [ ] Formulario de contacto aparece (izquierda)
  - [ ] Información de contacto aparece (derecha)
  - [ ] Efecto cascada entre formulario e información
  - [ ] Mapa de Google carga correctamente

---

### 🔝 8. NAVBAR / HEADER

- [ ] **Al cargar la página (scroll = 0):**
  - [ ] Navbar NO tiene sombra adicional
  - [ ] Backdrop filter NO está aplicado

- [ ] **Al hacer scroll hacia abajo (>10px):**
  - [ ] Navbar agrega sombra elegante
  - [ ] Backdrop filter blur aparece
  - [ ] Transición es suave

- [ ] **Al volver arriba (scroll <10px):**
  - [ ] Sombra desaparece suavemente

---

## 🧪 PRUEBAS DE PERFORMANCE

### 📊 1. SMOOTH SCROLLING

- [ ] **Hacer scroll rápido por toda la página:**
  - [ ] NO hay stuttering ni lag
  - [ ] Animaciones se ejecutan a 60 FPS
  - [ ] Console NO muestra errores

### 🔄 2. RE-ANIMACIÓN

- [ ] **Scrollear hacia abajo hasta el final:**
  - [ ] Todas las secciones animan correctamente

- [ ] **Scrollear de vuelta hacia arriba:**
  - [ ] Elementos NO vuelven a animarse
  - [ ] (Cada animación ocurre UNA SOLA VEZ)

### 🖼️ 3. LAZY LOADING

- [ ] **Abrir DevTools > Network > Img:**
  - [ ] Filtrar por imágenes
  - [ ] Recargar página (Ctrl + R)
  - [ ] Verificar que imágenes de secciones inferiores NO cargan de inmediato
  - [ ] Hacer scroll lento hacia abajo
  - [ ] Imágenes cargan justo antes de entrar en viewport

### 🎬 4. PARALLAX

- [ ] **En la sección del banner:**
  - [ ] Hacer scroll lento hacia abajo
  - [ ] Background/contenido se mueve sutilmente
  - [ ] Movimiento es apenas perceptible (±20px máx)
  - [ ] NO hay saltos ni glitches

---

## ♿ PRUEBAS DE ACCESIBILIDAD

### 🎯 1. NAVEGACIÓN CON TECLADO

- [ ] **Tab por todos los enlaces:**
  - [ ] Focus visible en todos los enlaces
  - [ ] Navegación funciona correctamente

- [ ] **Enter en anclas (#inicio, #conocenos, etc):**
  - [ ] Scroll smooth al ancla
  - [ ] Ancla NO queda oculta bajo el header (scroll-margin-top funciona)

### 🔇 2. PREFERS-REDUCED-MOTION

- [ ] **Abrir DevTools > Rendering:**
  - [ ] Activar "Emulate CSS media feature prefers-reduced-motion: reduce"

- [ ] **Recargar página:**
  - [ ] Parallax NO funciona (elementos estáticos)
  - [ ] Animaciones de fade/zoom son mínimas o inexistentes
  - [ ] Conteos numéricos pueden omitirse o ser instantáneos
  - [ ] Scroll es normal (no smooth)

- [ ] **Desactivar emulación y recargar:**
  - [ ] Animaciones vuelven a funcionar normalmente

---

## 🎨 PRUEBAS RESPONSIVE

### 📱 MOBILE (< 768px)

- [ ] **Abrir DevTools > Toggle Device Toolbar (Ctrl + Shift + M):**
  - [ ] Seleccionar iPhone/Pixel/Galaxy

- [ ] **Verificar animaciones:**
  - [ ] Todas las animaciones funcionan igual que en desktop
  - [ ] NO hay desbordamientos
  - [ ] Parallax funciona correctamente
  - [ ] Navbar sticky funciona

### 💻 TABLET (768px - 1024px)

- [ ] **Cambiar viewport a iPad:**
  - [ ] Layout responsive funciona
  - [ ] Animaciones se ven bien

---

## 🔍 PRUEBAS DE CONSOLE

### ✅ MENSAJES ESPERADOS

Al cargar la página, en Console (F12) debería aparecer:

```
✨ Sistema de animaciones inicializado
📊 X elementos con animación reveal
🔢 X contadores animados
🎭 X elementos con parallax
```

### ❌ ERRORES NO ESPERADOS

- [ ] **Verificar que NO hay errores en rojo**
- [ ] **Verificar que CountUp.js cargó correctamente**
- [ ] **Verificar que NO hay warnings de performance**

---

## 🏆 PRUEBAS EXTRAS

### 1. RECARGA RÁPIDA

- [ ] **Presionar F5 varias veces rápido:**
  - [ ] NO hay flashes visuales
  - [ ] Animaciones se ejecutan correctamente cada vez

### 2. CAMBIO DE TABS

- [ ] **En sección Ingresantes:**
  - [ ] Cambiar entre tabs 2024/2025 rápidamente
  - [ ] Estadísticas animan cada vez
  - [ ] NO hay superposición de animaciones

### 3. RESIZE WINDOW

- [ ] **Redimensionar ventana del navegador:**
  - [ ] Parallax se recalcula correctamente
  - [ ] NO hay glitches visuales

### 4. SCROLL CON RUEDA DEL MOUSE

- [ ] **Scroll rápido con la rueda:**
  - [ ] Animaciones fluidas
  - [ ] NO se saltan frames

### 5. SCROLL CON BARRA LATERAL

- [ ] **Arrastrar la scrollbar:**
  - [ ] Elementos animan al aparecer en viewport
  - [ ] Navbar responde correctamente

---

## 📈 MÉTRICAS DE ÉXITO

### ✅ TODOS LOS CHECKS PASADOS

Si todos los items tienen ✅, entonces:

🎉 **¡SISTEMA DE ANIMACIONES FUNCIONANDO PERFECTAMENTE!**

### ⚠️ ALGUNOS CHECKS FALLARON

Si hay items sin ✅:

1. Revisar Console por errores
2. Verificar que CountUp.js cargó desde CDN
3. Verificar que IntersectionObserver está soportado
4. Revisar que los archivos modificados están actualizados

### 🐛 TROUBLESHOOTING COMÚN

| Problema | Solución |
|---|---|
| Números no animan | Verificar `data-count` y clase `.metric-number` |
| Elementos no aparecen | Verificar clase `.reveal` |
| Parallax no funciona | Verificar clase `.parallax-wrap` |
| Console muestra error | Verificar importación de CountUp.js |
| Animaciones muy lentas | Ajustar valores de `transition` en CSS |

---

## 📝 NOTAS FINALES

### ✅ LISTO PARA PRODUCCIÓN SI:

- [x] Todos los checks visuales pasados
- [x] No hay errores en console
- [x] Performance es fluida (60 FPS)
- [x] Lazy loading funciona
- [x] Accesibilidad validada
- [x] Responsive validado

### 🚀 DEPLOY CHECKLIST

Antes de hacer deploy a producción:

- [ ] Todos los cambios commiteados en Git
- [ ] Archivos minificados (si aplica)
- [ ] CDN de CountUp.js accesible
- [ ] Tested en Chrome, Firefox, Safari
- [ ] Tested en mobile real (no solo DevTools)
- [ ] Backup de versión anterior disponible

---

**Desarrollado con ❤️ por Matías Vera G - 2025**

---

## 🎓 FIN DEL CHECKLIST

Si completaste todo el checklist y todo funciona correctamente:

# 🎉 ¡FELICITACIONES! 🎉

**Tu sistema de animaciones elegantes está funcionando perfectamente y listo para impresionar a los usuarios.**

✨ **Disfruta de las animaciones!** ✨
