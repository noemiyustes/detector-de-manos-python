# Detector de Manos en Tiempo Real

**Proyecto de Visión por Computadora - DAM (Desarrollo de Aplicaciones Multiplataforma)**

Aplicación desarrollada como parte de mi formación en DAM, que implementa un sistema de detección y seguimiento de manos en tiempo real utilizando técnicas de visión artificial y aprendizaje automático.

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Objetivos de Aprendizaje](#objetivos-de-aprendizaje)
3. [Análisis Técnico](#análisis-técnico)
4. [Requisitos del Sistema](#requisitos-del-sistema)
5. [Instalación](#instalación)
6. [Uso de la Aplicación](#uso-de-la-aplicación)
7. [Arquitectura del Código](#arquitectura-del-código)
8. [Tecnologías Implementadas](#tecnologías-implementadas)
9. [Desarrollo y Decisiones Técnicas](#desarrollo-y-decisiones-técnicas)
10. [Problemas Encontrados y Soluciones](#problemas-encontrados-y-soluciones)
11. [Posibles Ampliaciones](#posibles-ampliaciones)
12. [Conclusiones](#conclusiones)

## Descripción del Proyecto

Esta aplicación de escritorio permite la detección y el rastreo en tiempo real de hasta dos manos utilizando la cámara web del sistema. El programa identifica 21 puntos de referencia (landmarks) en cada mano detectada y dibuja las conexiones entre ellos, proporcionando una representación visual clara de la estructura de la mano.

El proyecto demuestra la aplicación práctica de conceptos de visión por computadora, procesamiento de imágenes en tiempo real y el uso de modelos de machine learning pre-entrenados.

## Objetivos de Aprendizaje

Durante el desarrollo de este proyecto se han trabajado los siguientes conceptos del ciclo de DAM:

- **Programación**: Implementación de código Python orientado a objetos y programación funcional
- **Sistemas de Gestión Empresarial**: Integración de librerías externas y gestión de dependencias
- **Desarrollo de Interfaces**: Manejo de ventanas y visualización en tiempo real
- **Acceso a Datos**: Procesamiento de flujos de video (streams) como fuente de datos
- **Programación Multimedia**: Tratamiento de imágenes y video frame a frame
- **Programación de Servicios**: Uso de APIs de terceros (MediaPipe, OpenCV)

## Análisis Técnico

### Funcionamiento del Sistema

1. **Captura de Video**: OpenCV accede al dispositivo de captura de video (cámara web)
2. **Conversión de Espacio de Color**: Cada frame se convierte de BGR (formato OpenCV) a RGB (formato MediaPipe)
3. **Procesamiento con IA**: MediaPipe procesa el frame utilizando su modelo de detección de manos
4. **Identificación de Landmarks**: Si se detectan manos, se identifican 21 puntos clave por mano
5. **Renderizado**: Se dibujan los puntos y conexiones sobre el frame original
6. **Visualización**: El frame procesado se muestra con efecto espejo para mayor intuitividad

### Puntos de Referencia (Landmarks)

MediaPipe identifica 21 puntos por mano:
- 0: Muñeca (WRIST)
- 1-4: Pulgar (THUMB)
- 5-8: Índice (INDEX_FINGER)
- 9-12: Medio (MIDDLE_FINGER)
- 13-16: Anular (RING_FINGER)
- 17-20: Meñique (PINKY)

## Requisitos del Sistema

### Software
- **Sistema Operativo**: Windows 10/11, Linux, macOS
- **Python**: Versión 3.8 o superior
- **Cámara Web**: Integrada o externa

### Dependencias
- `opencv-python >= 4.5.0`: Procesamiento de video e imágenes
- `mediapipe >= 0.10.0`: Framework de ML para detección de manos

## Instalación

### Opción 1: Script Automatizado (Windows)

He creado un script PowerShell que automatiza la instalación de dependencias:

```powershell
.\install.ps1
```

### Opción 2: Instalación Manual

```bash
# Clonar o descargar el repositorio
cd detector-manos

# Crear entorno virtual (recomendado)
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install opencv-python mediapipe
```

## Uso de la Aplicación

### Ejecución

```bash
python main.py
```

## Versión Web (para compartir en LinkedIn)

Esta versión permite abrir un enlace y solicitar permiso de cámara desde el navegador.

### Ejecutar en local

```bash
# Opción 1: usar el servidor estático de Python
python -m http.server 5500
```

Luego abre: `http://localhost:5500/index.html`

### Publicar en GitHub Pages

1. Sube los archivos `index.html`, `style.css` y `app.js` al repositorio.
2. En GitHub: Settings → Pages → Source → `main` / `root`.
3. Guarda y espera a que se publique.

El enlace HTTPS que genera GitHub Pages solicitará el permiso de cámara.

### Controles

- **q**: Cerrar la aplicación
- La ventana muestra el video en modo espejo para una experiencia más natural

### Recomendaciones de Uso

- Asegurar buena iluminación en el entorno
- Mantener las manos visibles dentro del encuadre de la cámara
- Fondo contrastado mejora la precisión de detección
- Distancia recomendada: 30-100 cm de la cámara

## Arquitectura del Código

### Estructura del Proyecto

```
detector-manos/
│
├── main.py                 # Archivo principal con la lógica de detección
├── install.ps1             # Script de instalación para Windows
└── README.md               # Documentación del proyecto
```

### Diagrama de Flujo

```
Inicio
  ↓
Inicializar cámara
  ↓
Configurar MediaPipe Hands
  ↓
Bucle Principal ←──┐
  ↓                │
Capturar frame     │
  ↓                │
¿Frame válido? ────┘ (No)
  ↓ (Sí)
Convertir BGR → RGB
  ↓
Procesar con MediaPipe
  ↓
¿Manos detectadas?
  ↓ (Sí)
Dibujar landmarks
  ↓
Mostrar frame
  ↓
¿Tecla 'q'? ───────┘ (No)
  ↓ (Sí)
Liberar recursos
  ↓
Fin
```

### Componentes Principales

**1. Inicialización de MediaPipe**
```python
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
```

**2. Función Principal: `run_hand_detection()`**
- Gestiona el ciclo de vida completo de la aplicación
- Implementa el patrón de context manager para gestión de recursos
- Maneja la captura, procesamiento y visualización

**3. Configuración del Detector**
- `model_complexity=0`: Modelo más rápido (0) vs más preciso (1)
- `max_num_hands=2`: Permite detectar hasta 2 manos simultáneamente
- `min_detection_confidence=0.5`: Umbral del 50% para considerar una detección válida
- `min_tracking_confidence=0.5`: Umbral del 50% para mantener el seguimiento

## Tecnologías Implementadas

### OpenCV (Open Source Computer Vision Library)

**Versión utilizada**: 4.x

**Funcionalidades implementadas**:
- `cv2.VideoCapture()`: Acceso a dispositivos de captura de video
- `cv2.cvtColor()`: Conversión entre espacios de color (BGR ↔ RGB)
- `cv2.imshow()`: Visualización de imágenes en ventana
- `cv2.flip()`: Efecto espejo horizontal
- `cv2.waitKey()`: Captura de eventos de teclado
- `cv2.destroyAllWindows()`: Limpieza de recursos

**Ventajas**: Biblioteca madura, amplia documentación, gran comunidad, rendimiento optimizado.

### MediaPipe

**Versión utilizada**: 0.10.x

**Componente utilizado**: MediaPipe Hands

MediaPipe es un framework de código abierto desarrollado por Google que proporciona soluciones de ML multiplataforma para percepción visual. El módulo Hands implementa un pipeline de dos etapas:

1. **Palm Detection**: Detecta la palma de la mano usando un modelo SSD ligero
2. **Hand Landmark Model**: Identifica los 21 puntos 3D de la mano

**Características técnicas**:
- Inferencia en tiempo real (30+ FPS en dispositivos modernos)
- Coordenadas normalizadas (0-1) independientes de la resolución
- Capacidad de detección multi-mano
- Robustez ante diferentes condiciones de iluminación

### Python

**Versión**: 3.8+

**Paradigmas aplicados**:
- Programación imperativa para el flujo principal
- Context managers (`with` statement) para gestión de recursos
- Programación orientada a objetos (uso de clases de las librerías)

## Desarrollo y Decisiones Técnicas

### Por qué Python

- Excelente ecosistema para visión por computadora
- Sintaxis clara y legible
- Amplio soporte de librerías especializadas
- Rápido prototipado y desarrollo

### Gestión de Recursos

Uso de context manager (`with`) para garantizar la correcta liberación de recursos:

```python
with mp_hands.Hands(...) as hands:
    # Código de procesamiento
# Recursos liberados automáticamente
```

### Optimización de Rendimiento

- `model_complexity=0`: Sacrifica algo de precisión por velocidad
- Procesamiento frame a frame sin almacenamiento intermedio
- Conversión de color eficiente
- Mínima manipulación de datos entre captura y visualización

### Manejo de Errores

- Verificación de frames válidos antes de procesar
- Mensaje informativo cuando no se captura correctamente
- Continuación del bucle ante frames defectuosos

## Problemas Encontrados y Soluciones

### Problema 1: Rendimiento en Hardware Limitado

**Síntoma**: FPS bajos en equipos con procesadores antiguos

**Solución**: Configurar `model_complexity=0` para usar el modelo más ligero

### Problema 2: Detección Inestable con Poca Luz

**Síntoma**: Pérdida de tracking en ambientes oscuros

**Solución**: Documentar recomendaciones de iluminación y ajustar umbrales de confianza

### Problema 3: Cámara No Disponible

**Síntoma**: Error al inicializar `VideoCapture`

**Solución**: Implementar verificación con `cam.isOpened()` y mensaje de error claro

### Problema 4: Visualización Poco Intuitiva

**Síntoma**: Los usuarios mueven las manos en dirección opuesta

**Solución**: Implementar efecto espejo con `cv2.flip(frame, 1)`

## Posibles Ampliaciones

Como proyecto en evolución, he identificado las siguientes mejoras potenciales:

### Funcionalidades Básicas
- Implementar contador de dedos levantados
- Detectar gestos específicos (pulgar arriba, puño cerrado, etc.)
- Añadir grabación de sesiones en formato de video
- Implementar captura de screenshots

### Funcionalidades Avanzadas
- Interfaz gráfica (GUI) con Tkinter o PyQt
- Sistema de reconocimiento de gestos personalizados
- Control de aplicaciones mediante gestos
- Detección de lenguaje de señas básico
- Integración con otros sistemas (domótica, juegos, etc.)

### Mejoras Técnicas
- Implementar configuración mediante archivo JSON o YAML
- Añadir logging detallado para debugging
- Crear tests unitarios
- Implementar multithreading para mejor rendimiento
- Añadir soporte para múltiples cámaras

### Aspecto Profesional
- Añadir métricas de rendimiento (FPS, latencia)
- Implementar sistema de calibración
- Crear documentación técnica detallada
- Añadir interfaz CLI con argumentos

## Conclusiones

Este proyecto ha permitido aplicar conocimientos del ciclo de DAM en un contexto real, trabajando con tecnologías actuales de aprendizaje automático. 

### Conocimientos Adquiridos

- Uso práctico de OpenCV para procesamiento de video
- Integración de modelos de ML pre-entrenados
- Gestión eficiente de recursos en aplicaciones de tiempo real
- Optimización de rendimiento en aplicaciones multimedia
- Documentación técnica de proyectos

### Aplicabilidad

Las técnicas aprendidas son aplicables a:
- Interfaces de usuario sin contacto
- Sistemas de accesibilidad
- Aplicaciones de realidad aumentada
- Sistemas de control gestual
- Herramientas educativas interactivas

---

**Autor**: Noemí Yuste Estrada  
**Fecha**: 11/2025
**Licencia**: MIT

