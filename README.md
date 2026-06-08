# 📚 MyStudySpace

Una plataforma web completa y personalizable para estudiar de forma eficiente. Almacena tus apuntes, gestiona flashcards, usa un temporizador personalizable y organiza tus materiales por asignatura.

## ✨ Características

### 📝 **Pestaña 1: Apuntes**
- **Organización por asignaturas**: Crea y gestiona múltiples asignaturas
- **Editor de notas**: Escribe tus apuntes con herramientas de formato básico (negrita, cursiva, subrayado)
- **Plantillas**: Inserta automáticamente plantillas de estructura de temas
- **Gestor de archivos**: 
  - Carga archivos (máximo 10MB por archivo)
  - Arrastra y suelta o selecciona desde el explorador
  - Descarga y elimina archivos cuando lo necesites
  - Soporte para múltiples formatos

### 🎴 **Pestaña 2: Flashcards y Cuestionarios**
- **Crear flashcards**: Pregunta y respuesta personalizadas
- **Estudiar interactivo**: Voltea las tarjetas para ver las respuestas
- **Navegación**: Muévete entre flashcards con botones anterior/siguiente
- **Eliminación**: Borra flashcards que ya no necesites
- **Contador**: Visualiza tu progreso en el tema

### ⏱️ **Pestaña 3: Temporizador Personalizable**

#### Funcionalidades básicas:
- **Personalizable**: Ajusta minutos y segundos
- **Controles**: Inicia, pausa y reinicia en cualquier momento
- **Alarma**: Sonido notificador cuando se acaba el tiempo
- **Control de volumen**: Ajusta el volumen de la alarma (0-100%)
- **Técnica Pomodoro**: Perfecto para sesiones de estudio enfocadas

#### 🎨 Personalización avanzada:
- **Foto de fondo**: 
  - Carga una imagen personalizada (máximo 5MB)
  - Arrastra y suelta la imagen
  - Vista previa en tiempo real
  - Opción para eliminar la imagen

- **Color de fondo personalizado**:
  - Selector de color integrado
  - Múltiples opciones de gradiente
  - Cambio automático

- **Opacidad del fondo**:
  - Ajusta la transparencia del fondo (0-100%)
  - Controla la visibilidad del temporizador
  - Cambios en tiempo real

- **📝 Notas personalizadas**:
  - Escribe notas, motivación o recordatorios
  - Se guardan automáticamente
  - Perfectas para sesiones de estudio enfocadas
  - Edita manualmente en cualquier momento

### ⚙️ **Pestaña 4: Configuración**
- **Tema**: Elige entre claro, oscuro o automático
- **Color personalizado**: Cambia el color de fondo según tu preferencia
- **Exportar datos**: Descarga todos tus datos en formato JSON
- **Limpiar datos**: Elimina todo si lo necesitas (con confirmación de seguridad)
- **Información**: Detalles de la aplicación

## 🚀 Inicio Rápido

### Instalación

1. Descarga o clona el repositorio:
```bash
git clone https://github.com/lgonbat9-max/Mystudyspace.git
cd Mystudyspace
```

2. Abre el archivo `index.html` en tu navegador:
```bash
# En Windows
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

O simplemente arrastra el archivo `index.html` a tu navegador.

### Sin instalación necesaria

Como es una aplicación web con almacenamiento local, no necesitas servidor. Funciona completamente offline una vez cargada.

## 📖 Guía de uso

### Crear una asignatura
1. Ve a la pestaña **Apuntes**
2. Escribe el nombre de la asignatura en el campo de entrada
3. Haz clic en "+ Agregar Asignatura"

### Tomar apuntes
1. Selecciona una asignatura
2. Usa el editor de notas para escribir
3. Utiliza los botones de formato para mejorar el aspecto
4. Haz clic en "💾 Guardar Apuntes"

### Cargar archivos
1. Selecciona una asignatura
2. Arrastra archivos al área de carga o haz clic para seleccionar
3. Los archivos se guardan automáticamente

### Crear flashcards
1. Ve a la pestaña **Flashcards**
2. Selecciona una asignatura
3. Haz clic en "+ Nueva Flashcard"
4. Completa pregunta y respuesta
5. Haz clic en "Guardar Flashcard"

### Estudiar con flashcards
1. Selecciona la asignatura con tus flashcards
2. Voltea las tarjetas haciendo clic en ellas
3. Navega entre preguntas con los botones

### Usar el temporizador
1. Ve a la pestaña **Temporizador**
2. Ajusta minutos y segundos
3. Haz clic en "Iniciar"
4. El temporizador contará hacia atrás
5. Cuando termine, sonarán los efectos de sonido

### Personalizar el temporizador

#### Agregar foto de fondo:
1. Desplázate a "Personalizar Fondo del Temporizador"
2. En la sección "Foto de fondo", arrastra una imagen o haz clic para seleccionar
3. La imagen aparecerá de fondo en el temporizador
4. Usa el control de opacidad para ajustar la visibilidad

#### Cambiar color de fondo:
1. Abre el selector de color personalizado
2. Elige el color que deseas
3. Haz clic en "Aplicar color"

#### Ajustar opacidad:
1. Usa el slider de opacidad (0-100%)
2. Observa los cambios en tiempo real

#### Añadir notas personalizadas:
1. En el área de notas, escribe lo que desees (motivación, objetivos, etc.)
2. Haz clic en "💾 Guardar notas"
3. Las notas se guardarán automáticamente

## 💾 Almacenamiento de datos

- **Local**: Todos tus datos se almacenan en el almacenamiento local del navegador
- **Privado**: Tus datos nunca se envían a servidores externos
- **Permanente**: Los datos persisten entre sesiones
- **Respaldo**: Exporta tus datos regularmente para mayor seguridad
- **Configurable**: Limpia datos cuando lo necesites

## 🎨 Personalización

### Cambiar tema general
- Ve a **Configuración**
- Selecciona Claro, Oscuro o Automático

### Cambiar color de fondo general
- Ve a **Configuración**
- Usa el selector de color personalizado

### Personalizar temporizador
- Ve a **Temporizador**
- Usa las opciones de "🎨 Personalizar Fondo"
- Configura fotos, colores, opacidad y notas

## 📁 Estructura del proyecto

```
Mystudyspace/
│
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y diseño responsive
├── app.js          # Lógica y funcionalidad
└── README.md       # Este archivo
```

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsive y moderno
- **JavaScript vanilla**: Sin dependencias externas
- **LocalStorage API**: Almacenamiento local
- **Web Audio API**: Sonidos de alarma
- **FileReader API**: Gestión de archivos
- **Drag & Drop API**: Carga por arrastrar y soltar

## 🌐 Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ✅ Navegadores móviles modernos

## 📱 Responsive

La aplicación está completamente optimizada para:
- 💻 Escritorio (1200px+)
- 📱 Tablet (768px - 1199px)
- 📲 Móvil (menos de 768px)

## 🐛 Troubleshooting

### Los datos no se guardan
- Verifica que LocalStorage esté habilitado en tu navegador
- Comprueba que no estés en modo incógnito/privado

### La alarma no suena
- Verifica que tu navegador tenga permisos de audio
- Ajusta el volumen en la configuración
- Comprueba que el volumen del sistema no esté silenciado

### Los archivos no se cargan
- Asegúrate de que sean menores a 10MB
- Verifica que tengas espacio en el almacenamiento local

### La foto de fondo no aparece
- Verifica que la imagen sea menor a 5MB
- Asegúrate de que sea un formato de imagen válido (JPG, PNG, GIF, etc.)
- Intenta con otra imagen si la anterior no funciona

### La opacidad no cambia
- Asegúrate de que haya una imagen de fondo o color seleccionado
- Usa el slider de opacidad lentamente para ver los cambios

## 🔐 Privacidad y seguridad

- Los datos se almacenan localmente en tu dispositivo
- No hay conexión a internet requerida después del primer uso
- No se recopila información personal
- Puedes eliminar todos tus datos en cualquier momento
- Las fotos y archivos se guardan localmente en tu navegador

## 📝 Licencia

Este proyecto está disponible bajo licencia libre para uso personal y educativo.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de:
- Reportar bugs
- Sugerir nuevas características
- Mejorar la documentación
- Enviar pull requests

## 📊 Características en desarrollo

Posibles mejoras futuras:
- 🎵 Más opciones de sonidos de alarma
- 📊 Estadísticas de estudio
- 🎯 Metas y objetivos
- 🌈 Temas personalizados
- 📱 Aplicación móvil nativa
- ☁️ Sincronización en la nube (opcional)

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en el repositorio.

---

**Versión**: 1.1  
**Última actualización**: Junio 2024  
**Autor**: lgonbat9-max

---

¡Feliz estudio! 📚✨