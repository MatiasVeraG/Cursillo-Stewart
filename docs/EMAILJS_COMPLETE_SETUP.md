# 📧 Configuración EmailJS - Cursillo Stewart

## ✅ Lo que ya está implementado:

- ✅ Script EmailJS cargado
- ✅ Formulario preparado con campos correctos
- ✅ JavaScript completo para envío
- ✅ Estados de carga y validación
- ✅ 200 emails gratis/mes

## 🚀 Pasos de configuración (10 minutos):

### **Paso 1: Crear cuenta EmailJS**

1. Ir a: https://www.emailjs.com/
2. Hacer clic en "Sign Up"
3. Registrarse con cualquier email (recomendado: tu email personal)
4. Verificar email

### **Paso 2: Configurar Gmail Service**

1. En el dashboard, ir a "Services"
2. Hacer clic en "Add Service"
3. Seleccionar "Gmail"
4. Hacer clic en "Connect Account"
5. **Autorizar con:** `cursillostewart-reclamos@gmail.com`
6. **Copiar el SERVICE_ID** (ejemplo: `service_xxxxxxx`)

### **Paso 3: Crear Email Template**

1. Ir a "Email Templates"
2. Hacer clic en "Create New Template"
3. Configurar así:

**Settings:**

- Template Name: `Contacto Cursillo Stewart`
- To Email: `cursillostewart-reclamos@gmail.com`

**Subject:**

```
Nuevo mensaje: {{subject}}
```

**Content (HTML):**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #1e40af; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
    📧 Nuevo mensaje desde Cursillo Stewart
  </h2>

  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>👤 Nombre:</strong> {{from_name}}</p>
    <p><strong>📧 Email:</strong> {{from_email}}</p>
    <p><strong>📋 Asunto:</strong> {{subject}}</p>
  </div>

  <div style="background: white; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
    <h3 style="color: #1e40af; margin-top: 0;">💬 Mensaje:</h3>
    <p style="line-height: 1.6;">{{message}}</p>
  </div>

  <div
    style="background: white; color: #1e40af; padding: 15px; border-radius: 8px; text-align: center; border: 2px solid #1e40af;"
  >
    <p style="margin: 0;"><strong>📞 Puedes responder directamente a:</strong></p>
    <p style="margin: 5px 0; font-size: 18px;">{{from_email}}</p>
    <p style="margin: 0; font-size: 14px; opacity: 0.7;">O llamar al +595 985 350550</p>
  </div>
</div>
```

4. **Guardar y copiar el TEMPLATE_ID** (ejemplo: `template_xxxxxxx`)

### **Paso 4: Obtener Public Key**

1. Ir a "Account" → "General"
2. **Copiar la PUBLIC_KEY** (ejemplo: `xxxxxxxxxxxxxxx`)

### **Paso 5: Actualizar el código**

En `index.html`, buscar y reemplazar estas 3 líneas:

**Línea ~704:**

```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // ← Reemplazar
```

**Línea ~725:**

```javascript
emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this);
```

**Ejemplo con datos reales:**

```javascript
emailjs.init('user_xxxxxxxxxxxxxxxxx');
emailjs.sendForm('service_xxxxxxx', 'template_xxxxxxx', this);
```

## 🎯 Resultado final:

### **📧 Email que recibirás:**

- **Para:** cursillostewart-reclamos@gmail.com
- **De:** noreply@emailjs.com
- **Asunto:** Nuevo mensaje: [Asunto del usuario]
- **Contenido:** Formato profesional con toda la info
- **Reply-To:** Email del usuario (puedes responder directo)

### **🔥 Funcionalidades:**

- ✅ **200 emails gratis/mes**
- ✅ **Formulario en tu página** (no redirecciona)
- ✅ **Botón con estado de carga** ("Enviando...")
- ✅ **Validación automática** (campos requeridos)
- ✅ **Confirmación al usuario**
- ✅ **Error handling** (si falla, muestra teléfono)
- ✅ **Dashboard completo** en EmailJS
- ✅ **Templates personalizables**

## 🧪 Probar el formulario:

1. Configurar las 3 claves
2. Abrir tu sitio web
3. Ir a sección "Contacto"
4. Llenar formulario de prueba
5. Ver que diga "Enviando..."
6. Verificar email en Gmail
7. ¡Responder al usuario!

## 📊 Dashboard EmailJS:

- Ver emails enviados
- Estadísticas mensuales
- Logs de errores
- Gestión de templates

---

**💡 Es la solución perfecta: profesional, gratis, y completamente integrada en tu página.**
