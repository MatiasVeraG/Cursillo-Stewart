# 📞 Guía de Administración - Sección de Contacto

## 📋 Descripción General

Esta guía explica cómo editar y configurar la sección de **Contacto** y la **Configuración de EmailJS** desde el panel de administración.

---

## 🎨 Edición de Títulos y Subtítulos

### 1. **Título Principal de la Sección**

- **Campo**: "Título Principal"
- **Ubicación**: Panel Admin → Contacto → Títulos de la Sección
- **Función**: Cambia el título principal de la sección de contacto
- **Color**: Usa el selector de color junto al campo para cambiar el color del título
- **Ejemplo**: "Contacto", "¡Contáctanos!", "Hablemos"

### 2. **Descripción de la Sección**

- **Campo**: "Descripción"
- **Ubicación**: Panel Admin → Contacto → Títulos de la Sección
- **Función**: Texto descriptivo debajo del título principal
- **Ejemplo**: "Estamos aquí para resolver todas tus dudas"

### 3. **Título del Formulario**

- **Campo**: "Título del Formulario"
- **Ubicación**: Panel Admin → Contacto → Títulos de la Sección
- **Función**: Título que aparece arriba del formulario de contacto
- **Color**: Ajustable mediante selector de color
- **Ejemplo**: "Envíanos un Mensaje", "Escríbenos"

### 4. **Título de Información de Contacto**

- **Campo**: "Título de Información"
- **Ubicación**: Panel Admin → Contacto → Títulos de la Sección
- **Función**: Título de la columna de información de contacto
- **Color**: Ajustable mediante selector de color
- **Ejemplo**: "Información de Contacto", "Datos de Contacto"

---

## 📞 Edición de Información de Contacto

### 1. **Teléfono**

- **Campo**: "Teléfono"
- **Formato**: +595 XXX XXXXXX
- **Ejemplo**: +595 985 350550

### 2. **Email**

- **Campo**: "Email"
- **Formato**: email@dominio.com
- **Ejemplo**: cursillostewart@gmail.com

### 3. **Dirección**

- **Campo**: "Dirección"
- **Tipo**: Área de texto (multi-línea)
- **Ejemplo**:
  ```
  Independencia Nacional 1159 entre
  Av. Rodríguez de Francia y Rca. de Colombia,
  Asunción
  ```

### 4. **Horarios de Atención**

- **Campo**: "Horarios de Atención"
- **Ejemplo**: Lun - Sáb: 8:00 - 12:00 y 14:00 - 18:00

---

## 🗺️ Configuración del Mapa (Google Maps)

### Cómo Obtener el Link del Mapa:

1. **Ve a Google Maps**

   - Abre [Google Maps](https://www.google.com/maps)

2. **Busca tu Ubicación**

   - Escribe la dirección o nombre del lugar en el buscador
   - Asegúrate de que el pin esté en el lugar correcto

3. **Obtén el Código de Inserción**

   - Haz clic en el botón **"Compartir"** (icono de compartir)
   - Selecciona la pestaña **"Insertar un mapa"**
   - Verás un código HTML que empieza con `<iframe src="`

4. **Copia SOLO la URL**
   - Del código que aparece, copia **SOLAMENTE** la parte que está entre comillas después de `src="`
   - Debe empezar con: `https://www.google.com/maps/embed?pb=...`
   - NO copies todo el código HTML, solo el link

### Ejemplo de URL Correcta:

```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14290.629488811443!2d-57.63289752233832!3d-25.288506144782207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da78778a93781%3A0xa7c23edfe28540ce!2sCursillo%20STEWART!5e0!3m2!1sen!2spy!4v1758971873336!5m2!1sen!2spy
```

### Pegado en el Panel:

1. En el panel de admin, ve a **Contacto** → **Mapa y Ubicación**
2. Pega el link completo en el campo **"URL del Mapa Embebido"**
3. Haz clic en **"👁️ Vista Previa del Mapa"** para verificar que funciona
4. Haz clic en **"💾 Guardar Cambios"** para aplicar

### Vista Previa del Mapa:

- El botón **"👁️ Vista Previa del Mapa"** te permite ver cómo se verá el mapa antes de guardar
- Si el mapa no se muestra correctamente, verifica que copiaste el link correcto

---

## 📧 Configuración de EmailJS

EmailJS permite que el formulario de contacto envíe emails sin necesidad de un servidor backend.

### ¿Qué es EmailJS?

- Servicio gratuito para enviar emails desde formularios web
- No requiere programación de servidor
- Fácil de configurar

### Configuración Paso a Paso:

#### 1. **Crear una Cuenta en EmailJS**

- Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
- Regístrate con tu email
- Verifica tu cuenta

#### 2. **Obtener el Service ID**

- En tu dashboard de EmailJS, ve a **"Email Services"**
- Haz clic en **"Add New Service"** si no tienes ninguno
- Selecciona tu proveedor de email (Gmail, Outlook, etc.)
- Conecta tu cuenta de email
- Copia el **Service ID** (ejemplo: `service_xxxxxxx`)
- **Pégalo en el panel de admin** en el campo **"Service ID"**

#### 3. **Obtener el Template ID**

- En tu dashboard de EmailJS, ve a **"Email Templates"**
- Haz clic en **"Create New Template"**
- Usa esta plantilla básica:

  ```
  From: {{from_name}} ({{from_email}})
  Subject: {{subject}}

  Message:
  {{message}}
  ```

- Guarda el template
- Copia el **Template ID** (ejemplo: `template_xxxxxxx`)
- **Pégalo en el panel de admin** en el campo **"Template ID"**

#### 4. **Obtener la Public Key**

- En tu dashboard de EmailJS, ve a **"Account"** → **"General"**
- Busca la sección **"Public Key"**
- Copia la clave (ejemplo: `xW-mdqdZ0aTjeEmGS`)
- **Pégala en el panel de admin** en el campo **"Public Key"**

### Campos del Panel:

| Campo           | Descripción                            | Dónde Encontrarlo                        |
| --------------- | -------------------------------------- | ---------------------------------------- |
| **Service ID**  | Identificador del servicio de email    | EmailJS → Email Services                 |
| **Template ID** | Identificador de la plantilla de email | EmailJS → Email Templates                |
| **Public Key**  | Clave pública de tu cuenta             | EmailJS → Account → General → Public Key |

### Ejemplo de Configuración:

```
Service ID:    service_te8wv9r
Template ID:   template_3zx8m6v
Public Key:    xW-mdqdZ0aTjeEmGS
```

### ⚠️ Importante:

- Después de guardar los cambios, **recarga la página principal** para que la configuración de EmailJS se aplique
- Los cambios en EmailJS requieren que se reinicialice el servicio
- Prueba el formulario enviando un mensaje de prueba

---

## 💾 Guardar Cambios

1. Después de realizar cualquier cambio en la sección de Contacto:
   - Haz clic en el botón **"💾 Guardar Cambios"** en la parte superior del panel
2. Verás una confirmación: **"Todos los cambios guardados exitosamente"**

3. **Recarga la página principal** (index.html) para ver los cambios aplicados

---

## 🎨 Consejos de Diseño

### Colores Recomendados:

- **Azul Marino** (`#002147`): Color corporativo, profesional
- **Rojo** (`#dc2626`): Para llamar la atención
- **Blanco** (`#ffffff`): Para contraste en fondos oscuros
- **Negro** (`#000000`): Para máxima legibilidad

### Textos:

- Mantén los títulos **cortos y descriptivos**
- La información de contacto debe ser **clara y fácil de leer**
- Usa **formato consistente** en horarios y teléfonos

---

## 🔄 Flujo de Trabajo Recomendado

1. **Editar Títulos y Colores**

   - Prueba diferentes combinaciones de texto y color
   - Usa la vista previa para verificar

2. **Actualizar Información de Contacto**

   - Verifica que todos los datos estén correctos
   - Prueba los links de teléfono y email

3. **Configurar el Mapa**

   - Obtén el link de Google Maps
   - Usa la vista previa para verificar
   - Asegúrate de que el pin esté en el lugar correcto

4. **Configurar EmailJS**

   - Sigue los pasos para obtener las credenciales
   - Pega los datos en el panel
   - Prueba el formulario después de guardar

5. **Guardar y Verificar**
   - Guarda todos los cambios
   - Recarga la página principal
   - Verifica que todo se vea correcto
   - Envía un mensaje de prueba

---

## ❓ Preguntas Frecuentes

### ¿Por qué no veo los cambios después de guardar?

- Asegúrate de **recargar la página principal** (F5 o Ctrl+R)
- Limpia la caché del navegador si es necesario

### ¿El mapa no se muestra?

- Verifica que copiaste **solo el URL**, no todo el código HTML
- El link debe empezar con `https://www.google.com/maps/embed?pb=`
- Usa la vista previa para verificar

### ¿El formulario no envía emails?

- Verifica que la configuración de EmailJS esté correcta
- Asegúrate de haber **recargado la página** después de guardar
- Revisa que los 3 campos (Service ID, Template ID, Public Key) estén completos
- Verifica tu cuenta de EmailJS para ver si hay límites alcanzados

### ¿Puedo cambiar los iconos de contacto?

- Los iconos están en la carpeta `Icons/`
- Puedes reemplazarlos por otros archivos SVG con el mismo nombre
- Mantén el formato SVG para mejor calidad

---

## 🎯 Resumen Rápido

1. ✅ Edita títulos y colores en **Contacto → Títulos de la Sección**
2. ✅ Actualiza información en **Contacto → Información de Contacto**
3. ✅ Configura el mapa en **Contacto → Mapa y Ubicación**
4. ✅ Configura EmailJS en **Contacto → Configuración de EmailJS**
5. ✅ Guarda los cambios
6. ✅ Recarga la página principal
7. ✅ ¡Listo! Todo funcionando

---

## 📞 Soporte

Si tienes problemas o preguntas:

- Revisa esta guía cuidadosamente
- Verifica que seguiste todos los pasos
- Contacta al administrador del sistema

---

**Última actualización**: Octubre 2025
