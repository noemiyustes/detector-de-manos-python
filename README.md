# Detector de Manos

Detector de manos en tiempo real con cámara web. Incluye versión de escritorio (Python) y versión web.

## Requisitos

- **Python 3.8+** (para la versión de escritorio)
- **Cámara web**

## Escritorio (Python)

```bash
python main.py
```

## Web (GitHub Pages)

Enlace: `https://noemiyustes.github.io/detector-de-manos-python/`

### Local

```bash
python -m http.server 5500
```

Abre: `http://localhost:5500/index.html`

## Controles

- **q**: cerrar la app de escritorio
- Botón **Iniciar cámara** en la web

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

