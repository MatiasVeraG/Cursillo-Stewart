# 🧩 SISTEMA MODULAR DE ADMINISTRACIÓN

## 📁 Estructura

```
admin/
├── modules/
│   ├── auth.module.js           # Autenticación (login/logout)
│   ├── ingresantes.module.js    # Gestión de listas de ingresantes
│   └── countdown.module.js      # Contador regresivo y CTA
├── admin-modular.js             # Inicializador principal
└── styles/                      # Estilos específicos (opcional)

admin-modular.html               # Nueva página de admin modular
admin.css                        # Estilos compartidos
```

## 🎯 Ventajas del Sistema Modular

### ✅ **Independencia Total**

- Cada módulo funciona por separado
- Si un módulo falla, los demás siguen funcionando
- Puedes agregar/quitar módulos sin afectar al resto

### ✅ **Fácil Mantenimiento**

- Código organizado por funcionalidad
- Fácil de encontrar y corregir errores
- Un cambio en un módulo NO afecta a otros

### ✅ **Escalabilidad**

- Agregar nuevas funcionalidades es simple
- Solo creas un nuevo módulo
- Lo conectas al inicializador principal

## 📦 Módulos Disponibles

### 🔐 **auth.module.js**

**Responsabilidad:** Autenticación y sesiones

**Métodos públicos:**

- `init()` - Inicializa el módulo
- `checkSession()` - Verifica sesión activa
- `handleLogin()` - Procesa login
- `handleLogout()` - Cierra sesión

**No afecta:** Contenido, countdown, ingresantes

---

### 🎓 **ingresantes.module.js**

**Responsabilidad:** Gestión completa de listas de ingresantes

**Métodos públicos:**

- `init()` - Inicializa el módulo
- `loadSavedLists()` - Carga listas desde API
- `saveExcelData()` - Guarda nueva lista
- `editList(key)` - Edita nombre de lista
- `deleteList(key)` - Elimina lista
- `saveTitles()` - Guarda títulos de sección
- `resetTitles()` - Restaura títulos por defecto

**No afecta:** Login, countdown, otros contenidos

---

### ⏰ **countdown.module.js**

**Responsabilidad:** Contador regresivo y CTA

**Métodos públicos:**

- `init()` - Inicializa el módulo
- `autoSave()` - Guarda cambios automáticamente
- `saveAsDefaults()` - Establece configuración predeterminada
- `restoreDefaults()` - Restaura valores por defecto

**No afecta:** Login, ingresantes, otros contenidos

---

## 🚀 Cómo Usar

### 1. **Abrir el Admin Modular**

```
http://localhost:8000/admin-modular.html
```

### 2. **Iniciar Sesión**

- Usuario: `admin`
- Contraseña: `stewart2024`

### 3. **Cada Sección es Independiente**

- 🎓 **Ingresantes**: Cargar Excel, editar listas, cambiar títulos
- ⏰ **Contador**: Configurar countdown y CTA
- 📝 **Contenido**: (Próximamente)

### 4. **Los Cambios se Guardan Automáticamente**

- Ingresantes: Al hacer clic en "Guardar"
- Countdown: Auto-save en cada cambio
- Títulos: Al hacer clic en "Guardar Títulos"

---

## 🔧 Agregar un Nuevo Módulo

### Paso 1: Crear el archivo del módulo

```javascript
// admin/modules/mi-modulo.module.js
class MiModulo {
  constructor() {
    // Configuración inicial
  }

  init() {
    console.log('🎯 Mi Módulo iniciado');
    this.bindEvents();
    this.loadData();
  }

  bindEvents() {
    // Event listeners
  }

  loadData() {
    // Cargar datos
  }

  showMessage(text, type) {
    // Mensajes de feedback
  }
}

window.MiModulo = new MiModulo();
```

### Paso 2: Agregarlo al HTML

```html
<script src="admin/modules/mi-modulo.module.js"></script>
```

### Paso 3: Inicializarlo en admin-modular.js

```javascript
if (window.MiModulo) {
  window.MiModulo.init();
}
```

---

## 🐛 Debugging

### Ver qué módulos están cargados:

```javascript
console.log(window.AuthModule);
console.log(window.IngresantesModule);
console.log(window.CountdownModule);
```

### Verificar inicialización:

Abre la consola del navegador (F12) y busca:

```
🔐 Módulo de Autenticación iniciado
🎓 Módulo de Ingresantes iniciado
⏰ Módulo de Countdown iniciado
✅ Todos los módulos inicializados correctamente
```

### Si un módulo falla:

1. Verifica que el archivo .js exista
2. Revisa errores en consola (F12)
3. Verifica que el módulo esté en `window`
4. Los demás módulos seguirán funcionando

---

## 📝 Notas Importantes

### ⚠️ **Archivos Antiguos**

- `admin.html` - Admin antiguo (NO USAR)
- `admin.js` - Código monolítico (NO USAR)
- `admin-fixes-v2.js` - Parches antiguos (NO USAR)

### ✅ **Archivos Nuevos (USAR ESTOS)**

- `admin-modular.html` - Nueva interfaz
- `admin/modules/*.module.js` - Módulos independientes
- `admin/admin-modular.js` - Inicializador

### 🔄 **Migración**

1. Usa `admin-modular.html` de ahora en adelante
2. Los datos se mantienen (mismo localStorage)
3. El API sigue igual (api/admin_api.php)

---

## 🎓 Ejemplo: Editar Lista de Ingresantes

### ❌ Antes (Admin Antiguo)

```
Problema: Al editar, se rompía el countdown
Causa: Todo mezclado en un solo archivo
```

### ✅ Ahora (Admin Modular)

```
1. Abres admin-modular.html
2. Vas a sección "Ingresantes"
3. Haces clic en "Editar" en una lista
4. Cambias el nombre
5. Se guarda sin afectar countdown ni nada más
```

**Resultado:** Cada módulo funciona independiente ✅

---

## 📞 Soporte

Si algo falla:

1. Revisa la consola (F12)
2. Verifica qué módulo da error
3. Solo ese módulo necesita corrección
4. Los demás siguen funcionando

---

**Fecha:** Octubre 2025  
**Versión:** 1.0.0 - Sistema Modular
