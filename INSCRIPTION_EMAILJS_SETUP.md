# Configuración de EmailJS para Formulario de Inscripción

## Pasos para configurar el envío de inscripciones

### 1. Crear un nuevo template en EmailJS

1. Ve a tu dashboard de EmailJS: https://dashboard.emailjs.com/
2. En la sección "Email Templates", haz click en "Create New Template"
3. Usa el ID: `template_g65oru4`

### 2. Configurar el template

**Subject:** Nueva Inscripción - Cursillo Stewart

**Content:**

```
Nueva inscripción recibida para el Cursillo Stewart:

DATOS PERSONALES:
- Nombre y Apellido: {{nombre_apellido}}
- Número de Cédula: {{cedula}}
- Número de Teléfono: {{telefono}}

INFORMACIÓN ACADÉMICA:
- Colegio/Institución: {{colegio}}

CONTACTO DE EMERGENCIA:
- Familiar/Encargado: {{familiar_nombre}}
- Teléfono del Familiar: {{familiar_telefono}}

TÉRMINOS Y CONDICIONES:
- Acepta términos: {{acepto_terminos}}

---
Fecha de inscripción: {{fecha_actual}}
IP del solicitante: {{user_ip}}

Este email fue enviado automáticamente desde el formulario de inscripción de Cursillo Stewart.
```

### 3. Configurar variables automáticas

En el template, agrega estas variables automáticas:

- `{{fecha_actual}}` - Fecha actual
- `{{user_ip}}` - IP del usuario (opcional)

### 4. Configurar destinatario

- **To Email:** cursillostewart@gmail.com
- **From Name:** Formulario de Inscripción
- **Reply To:** {{telefono}} (para poder responder directamente)

### 5. Probar el template

1. Guarda el template
2. Usa la función "Test" con datos de ejemplo
3. Verifica que el email llega correctamente

## Estado Actual

✅ JavaScript configurado en index.html
✅ Template ID actualizado: `template_g65oru4`
⏳ Pruebas del formulario pendientes

## Notas Importantes

- El template ID debe ser exactamente: `template_g65oru4`
- Usar el mismo service ID: `service_t7mw6ob`
- La misma clave pública ya está configurada: `xW-mdqdZ0aTjeEmGS`

## Alternativas de Respaldo

Si prefieres usar Google Sheets en lugar de EmailJS:

1. Crear una Google Sheet
2. Usar Google Apps Script
3. Configurar webhook para recibir datos del formulario

¿Prefieres continuar con EmailJS o cambiar a Google Sheets?
