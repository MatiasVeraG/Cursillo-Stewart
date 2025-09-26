# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al proyecto Cursillo Stewart! Esta guía te ayudará a hacer contribuciones efectivas.

## 📋 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y colaborativo para todos.

## 🚀 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork del repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU-USUARIO/Cursillo-Stewart.git
cd Cursillo-Stewart
```

### 2. Configurar el Repositorio Upstream
```bash
git remote add upstream https://github.com/MatiasVeraG/Cursillo-Stewart.git
```

### 3. Crear una Rama de Feature
```bash
# Siempre trabaja desde develop
git checkout develop
git pull upstream develop

# Crear nueva rama
git checkout -b feature/nombre-descriptivo
```

### 4. Hacer Cambios
- Sigue las convenciones de código existentes
- Escribe commits descriptivos
- Prueba tus cambios en diferentes navegadores

### 5. Commit y Push
```bash
# Usar conventional commits
git add .
git commit -m "feat: descripción de la funcionalidad"
git push origin feature/nombre-descriptivo
```

### 6. Crear Pull Request
- Ve a GitHub y crea un PR desde tu rama hacia `develop`
- Completa la plantilla de PR
- Espera la revisión

## 📝 Convenciones de Código

### HTML
- Usar indentación de 2 espacios
- Incluir atributos `alt` en imágenes
- Usar etiquetas semánticas
- Validar HTML con W3C Validator

### CSS
- Usar metodología BEM para clases
- Agrupar propiedades relacionadas
- Usar variables CSS para colores
- Comentar secciones principales

### Commits
Usar [Conventional Commits](https://conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `style:` Cambios de formato
- `refactor:` Refactorización
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

### Nombres de Ramas
- `feature/descripcion-funcionalidad` - Nuevas funcionalidades
- `fix/descripcion-bug` - Corrección de bugs
- `docs/descripcion-cambio` - Cambios en documentación
- `refactor/descripcion-refactor` - Refactorización

## 🎨 Estándares de Diseño

### Colores
- Azul marino: `#1e40af` (elementos principales)
- Rojo: `#dc2626` (acentos y botones)
- Blanco: `#ffffff` (fondos)

### Tipografía
- Familia principal: Montserrat
- Pesos: 300, 400, 500, 600, 700

### Responsive
- Mobile first approach
- Breakpoints: 768px, 1024px, 1200px

## 🧪 Testing

### Navegadores Soportados
- Chrome (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Edge (últimas 2 versiones)

### Dispositivos
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 📚 Recursos Útiles

- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS Tricks](https://css-tricks.com/)
- [HTML Validator](https://validator.w3.org/)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)

## ❓ Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Contactar a [@MatiasVeraG](https://github.com/MatiasVeraG)

## 🙏 Reconocimientos

¡Todas las contribuciones son valoradas y reconocidas! Los contribuidores serán listados en el README.

---

¡Gracias por hacer de Cursillo Stewart un mejor proyecto! 🎓