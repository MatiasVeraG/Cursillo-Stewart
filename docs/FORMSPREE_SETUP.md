# 📋 Configuración SUPER FÁCIL - Formspree

## ✅ Lo que ya está hecho:

- Formulario preparado en la página web
- Campos con nombres correctos
- Validación añadida

## 🚀 Solo necesitas hacer esto (3 pasos):

### **Paso 1: Crear cuenta en Formspree**

1. Ir a: https://formspree.io/
2. Hacer clic en "Get Started Free"
3. Registrarse (puedes usar cualquier email)

### **Paso 2: Crear tu formulario**

1. Una vez dentro, hacer clic en "New Form"
2. En "Email" poner: `cursillostewart-reclamos@gmail.com`
3. En "Form Name" poner: "Contacto Cursillo Stewart"
4. Hacer clic en "Create Form"

### **Paso 3: Copiar el endpoint**

Te dará algo como:

```
https://formspree.io/f/xpznvqko
```

### **Paso 4: Actualizar el código**

En el archivo `index.html`, buscar la línea ~548:

```html
<form action="https://formspree.io/f/TU_ENDPOINT_AQUI" method="POST"
```

Reemplazar `TU_ENDPOINT_AQUI` con tu endpoint real.

**Ejemplo:**

```html
<form action="https://formspree.io/f/xpznvqko" method="POST"
```

## ✅ ¡Y LISTO!

### **Cómo funciona:**

1. Usuario llena el formulario en tu página
2. Hace clic en "Enviar Mensaje"
3. La página se recarga con mensaje de confirmación
4. **TÚ RECIBES EL EMAIL** en `cursillostewart-reclamos@gmail.com`

### **Email que recibirás:**

```
De: noreply@formspree.io
Para: cursillostewart-reclamos@gmail.com
Asunto: New submission from Contacto Cursillo Stewart

nombre: Juan Pérez
email: juan@gmail.com
asunto: Consulta sobre horarios
mensaje: Hola, quiero saber más sobre los horarios disponibles...

---
You can reply directly to: juan@gmail.com
```

### **Ventajas:**

- ✅ **GRATIS**: 50 emails/mes
- ✅ **SIN MANTENIMIENTO**: Formspree maneja todo
- ✅ **ANTI-SPAM**: Protección automática
- ✅ **RESPUESTA FÁCIL**: Reply directo al email del usuario
- ✅ **DASHBOARD**: Ver todos los mensajes en formspree.io

## 🎯 **Resultado final:**

- Formulario funciona en tu página
- Sin redireccionar a Google Forms
- Sin costo mensual
- Súper fácil de configurar
- Emails directos a tu Gmail

## 🔧 **Prueba:**

1. Configurar el endpoint
2. Abrir tu página web
3. Llenar el formulario
4. Enviar
5. Verificar que llegue el email

---

**¡Es exactamente lo que pediste! Sin costo, fácil como Google Forms, pero en tu página.**
