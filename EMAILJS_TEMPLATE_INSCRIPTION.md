# 📧 Template para EmailJS - Formulario de Inscripción

## 🔧 Configuración en EmailJS Dashboard

### 1. Template ID

```
template_inscription
```

### 2. Template Name

```
Cursillo Stewart - Nueva Inscripción
```

### 3. Subject

```
Nueva Inscripción - {{nombre_apellido}} - Cursillo Stewart
```

### 4. Content (HTML)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .header {
        background: #1e40af;
        color: white;
        padding: 20px;
        text-align: center;
      }
      .content {
        padding: 20px;
      }
      .section {
        margin-bottom: 25px;
        padding: 15px;
        background: #f8f9fa;
        border-left: 4px solid #1e40af;
      }
      .section h3 {
        margin-top: 0;
        color: #1e40af;
      }
      .field {
        margin-bottom: 10px;
      }
      .field strong {
        color: #1e40af;
      }
      .footer {
        background: #f1f3f4;
        padding: 15px;
        text-align: center;
        font-size: 12px;
        color: #666;
      }
      .status {
        padding: 8px 12px;
        border-radius: 4px;
        font-weight: bold;
      }
      .status.accepted {
        background: #d4edda;
        color: #155724;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>🎓 Nueva Inscripción - Cursillo Stewart</h1>
    </div>

    <div class="content">
      <div class="section">
        <h3>👤 Datos Personales</h3>
        <div class="field"><strong>Nombre y Apellido:</strong> {{nombre_apellido}}</div>
        <div class="field"><strong>Número de Cédula:</strong> {{cedula}}</div>
        <div class="field"><strong>Número de Teléfono:</strong> {{telefono}}</div>
      </div>

      <div class="section">
        <h3>🏫 Información Académica</h3>
        <div class="field"><strong>Colegio/Institución:</strong> {{colegio}}</div>
      </div>

      <div class="section">
        <h3>👨‍👩‍👧‍👦 Contacto de Emergencia</h3>
        <div class="field"><strong>Familiar/Encargado:</strong> {{familiar_nombre}}</div>
        <div class="field"><strong>Teléfono del Familiar:</strong> {{familiar_telefono}}</div>
      </div>

      <div class="section">
        <h3>📋 Términos y Condiciones</h3>
        <div class="status accepted">✅ Términos Aceptados: {{acepto_terminos}}</div>
      </div>

      <div class="section">
        <h3>📅 Información del Sistema</h3>
        <div class="field"><strong>Fecha de Inscripción:</strong> {{fecha_inscripcion}}</div>
      </div>
    </div>

    <div class="footer">
      <p>
        📧 Este email fue generado automáticamente desde el formulario de inscripción del sitio web
        de Cursillo Stewart.
      </p>
      <p>📞 Para más información: +595 985 350550 | ✉️ cursillostewart@gmail.com</p>
    </div>
  </body>
</html>
```

### 5. Settings (Configuración)

#### To Email:

```
cursillostewart@gmail.com
```

#### From Name:

```
Cursillo Stewart - Inscripciones
```

#### Reply To:

```
{{telefono}}
```

## 🚀 Pasos para implementar:

### Paso 1: Crear el Template

1. Ve a https://dashboard.emailjs.com/
2. Click en "Email Templates" → "Create New Template"
3. Copia y pega la configuración de arriba

### Paso 2: Probar el Template

1. Abre el archivo `test-emailjs-inscription.html` en tu navegador
2. Llena el formulario con datos de prueba
3. Envía el formulario
4. Verifica que el email llegue a cursillostewart@gmail.com

### Paso 3: Verificar Funcionamiento

- ✅ El email debe llegar con el formato correcto
- ✅ Todos los campos deben mostrar los datos
- ✅ El diseño debe verse profesional

## 🔍 Troubleshooting

Si no funciona, verifica:

1. **Template ID** debe ser exactamente: `template_inscription`
2. **Service ID** debe ser: `service_t7mw6ob`
3. **Nombres de campos** deben coincidir exactamente
4. **Clave pública** ya está configurada: `xW-mdqdZ0aTjeEmGS`

## 📱 Variables disponibles:

- `{{nombre_apellido}}`
- `{{cedula}}`
- `{{telefono}}`
- `{{colegio}}`
- `{{familiar_nombre}}`
- `{{familiar_telefono}}`
- `{{acepto_terminos}}`
- `{{fecha_inscripcion}}`
