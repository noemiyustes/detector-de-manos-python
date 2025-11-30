# Detector de Manos en Tiempo Real

Sistema de detección y rastreo de manos en tiempo real utilizando MediaPipe y OpenCV.

## Descripción

Aplicación que detecta y rastrea hasta 2 manos simultáneamente mediante la cámara web. Visualiza 21 puntos de referencia por mano y las conexiones entre ellos.

## Tecnologías

- Python 3.8+
- OpenCV
- MediaPipe

## Instalación

### Windows
```powershell
.\install.ps1
```

### Manual
```bash
pip install opencv-python mediapipe
```

## Uso

```bash
python main.py
```

Presiona 'q' para salir de la aplicación.

## Estructura

```
detector-manos/
├── main.py           # Código principal
├── install.ps1       # Script de instalación
└── README.md         # Documentación
```

## Configuración

Parámetros ajustables en `main.py`:

- `model_complexity`: 0 o 1 (precisión vs velocidad)
- `max_num_hands`: Número máximo de manos a detectar
- `min_detection_confidence`: Umbral de confianza para detección
- `min_tracking_confidence`: Umbral de confianza para seguimiento

