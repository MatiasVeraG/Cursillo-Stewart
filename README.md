# Cursillo Stewart – Sitio Oficial UPTP

[![GitHub Pages](https://img.shields.io/badge/demo-live-success?logo=github)](https://matiasverag.github.io/Cursillo-Stewart/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![HTML5](https://img.shields.io/badge/HTML-5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS-3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?logo=javascript&logoColor=black)

**Preparación universitaria para aspirantes a la Universidad Politécnica Taiwan Paraguay (UPTP).**  
Landing page moderna + Panel de Administración sin backend para gestión de ingresantes, simulacros, countdown y contenido editable.

👉 **[Ver Demo en Vivo](https://matiasverag.github.io/Cursillo-Stewart/)** 

---

## 📸 Capturas de Pantalla

### 🏠 Página Principal
![Homepage Hero](docs/assets/hero-screenshot.png)
*Landing page con animaciones elegantes y diseño responsive*

### 🎛️ Panel de Administración
![Admin Panel](docs/assets/admin-screenshot.png)
*Panel de administración completo sin necesidad de backend*

### 📄 Gestión de Simulacros
![Simulacros](docs/assets/simulacros-screenshot.png)
*Sistema de gestión y descarga de simulacros en PDF*

---

## ✨ Características

- **🎯 Admin sin Backend**: JSON + localStorage para gestión completa
- **📊 Gestión de Ingresantes**: Carga CSV, preferenciales destacados, filtros por examen
- **📄 Simulacros**: PDFs organizados por categoría con descarga directa
- **⏰ Countdown Editable**: Contador regresivo personalizable desde admin
- **📝 Contenido Dinámico**: Sección "Conócenos", cursos, calendario editables
- **🎨 Animaciones Elegantes**: CountUp.js, scroll reveal, parallax sutil
- **📱 Responsive**: Optimizado para mobile, tablet y desktop
- **♿ Accesible**: Soporte prefers-reduced-motion, ARIA labels
- **🚀 Performance**: Lazy loading, IntersectionObserver, 60 FPS

---

## ⚡️ Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/MatiasVeraG/Cursillo-Stewart.git
cd Cursillo-Stewart

# Abrir index.html en tu navegador
start index.html       # Windows
open index.html        # macOS
xdg-open index.html    # Linux

# O usar un servidor local (opcional)
tools/run-server.bat   # Windows con PHP
python -m http.server  # Cualquier OS con Python
```

**¡Eso es todo!** No requiere instalación de dependencias.

### 🎛️ Acceder al Panel de Admin

1. Abre `admin.html` en tu navegador
2. Gestiona ingresantes, simulacros, countdown y más
3. Los cambios se reflejan automáticamente en `index.html`

---

## 📚 Documentación

| Guía | Descripción |
|------|-------------|
| [**📖 Índice de Docs**](docs/README.md) | TOC completo de toda la documentación |
| [🎛️ Guía Admin](docs/ADMIN.md) | Panel de administración completo |
| [⏰ Countdown](docs/COUNTDOWN_EDITABLE_GUIDE.md) | Sistema de contador regresivo |
| [📖 Conócenos](docs/CONOCENOS_EDITABLE_GUIDE.md) | Gestión de contenido "Conócenos" |
| [📄 Simulacros](docs/INSTRUCCIONES_SIMULACROS.md) | Sistema de PDFs de simulacros |
| [✨ Animaciones](docs/ANIMACIONES_SISTEMA.md) | Sistema completo de animaciones |
| [📊 Implementación](docs/IMPLEMENTACION_ANIMACIONES.md) | Resumen técnico de features |

---

## 🧱 Estructura del Proyecto

```
Cursillo-Stewart/
├── index.html              # Página principal
├── styles.css              # Estilos globales
├── admin.html              # Panel de administración
├── simulacros.html         # Página de simulacros
├── profesores.html         # Página de profesores
├── homepage.*.js           # Scripts modulares (countdown, ingresantes, etc.)
│
├── /admin                  # Sistema modular de admin
│   ├── admin-modular.js
│   └── modules/            # Módulos por funcionalidad
│
├── /api                    # API REST simulada (PHP)
│   └── admin_api.php
│
├── /data                   # JSON de contenido
│   ├── courses.json
│   ├── sections.json
│   ├── simulacros.json
│   └── ingresantes/        # CSVs de ingresantes por examen
│
├── /documents              # PDFs de simulacros
│   └── simulacros/
│
├── /images                 # Assets de producción
├── /Icons                  # Iconografía SVG
├── /schemas                # JSON schemas de validación
│
├── /docs                   # 📚 Documentación completa
│   ├── README.md           # Índice de docs
│   ├── assets/             # Capturas, GIFs para docs
│   └── *.md                # Guías técnicas
│
├── /examples               # 🧪 Archivos de prueba
│   └── test-*.html
│
└── /tools                  # 🔧 Scripts auxiliares
    ├── run-server.bat
    └── *.js (fixes, patches)
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este proyecto usa **[Conventional Commits](https://www.conventionalcommits.org/)**.

### Pasos para Contribuir

```bash
# 1. Fork el repositorio
# 2. Crea una rama
git checkout -b feature/mi-funcionalidad

# 3. Haz tus cambios y commit
git commit -m "feat: agregar búsqueda de ingresantes"

# 4. Push y abre un PR
git push origin feature/mi-funcionalidad
```

**Convenciones de Commits:**

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Formateo de código
- `refactor:` Refactorización
- `perf:` Mejoras de performance
- `test:` Tests
- `chore:` Mantenimiento

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

## 🧪 Testing y Ejemplos

Archivos de prueba disponibles en `/examples/`:

- `test-countdown-system.html` - Probar contador regresivo
- `test-ingresantes.html` - Probar sistema de ingresantes
- `test-simulacros-descarga.html` - Probar descarga de PDFs
- `test-sistema-completo.html` - Validación end-to-end

---

## 📝 Licencia

[MIT](LICENSE) © 2025 Matías Vera G

---

## 👨‍💻 Autor

**Matías Vera G**

- GitHub: [@MatiasVeraG](https://github.com/MatiasVeraG)
- Proyecto: [Cursillo Stewart](https://github.com/MatiasVeraG/Cursillo-Stewart)

---

## 🎨 Social Preview

Para configurar la imagen de preview en redes sociales:

1. Ir a **Settings** > **General** (del repositorio)
2. En **Social preview**, hacer clic en **Edit**
3. Subir la imagen: `docs/assets/social-preview.png` (1280×640 px)

Esta imagen aparecerá cuando compartas el repo en redes sociales.

---

## 🌟 Features Destacados

- ✅ **Zero Dependencies**: Solo Vanilla JS (excepto CountUp.js desde CDN)
- ✅ **No Build Step**: Abre y funciona, sin npm install
- ✅ **Offline-Ready**: localStorage para persistencia
- ✅ **Modern Web APIs**: IntersectionObserver, MutationObserver, fetch
- ✅ **Accessible**: WCAG compliance, keyboard navigation
- ✅ **SEO Friendly**: Semantic HTML, meta tags optimizados

---

## 📊 Stack Técnico

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Custom properties, Grid, Flexbox, Animations |
| JavaScript ES6+ | Modules, async/await, observers |
| CountUp.js | Conteos animados |
| EmailJS | Formulario de contacto sin backend |
| localStorage | Persistencia de datos |
| JSON | Almacenamiento de contenido |

---

<div align="center">

**[⬆ Volver arriba](#cursillo-stewart--sitio-oficial-uptp)**

Made with ❤️ by [Matías Vera G](https://github.com/MatiasVeraG)

</div>
