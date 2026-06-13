# Ejercicio 1: Procesamiento visual e IA

**Estudiante:** Jerónimo Bermúdez Hernández

**Fecha de entrega:** 13 de junio de 2026

## Descripción general

Este ejercicio implementa una secuencia clara de procesamiento visual sobre una imagen de entrada usando Python y OpenCV. El flujo incluye carga de la entrada, conversión a escala de grises, una segunda representación en LAB, suavizado, detección de bordes y una etapa final de segmentación clásica con contornos y máscaras.

Cuando no se proporciona un archivo de entrada, el script genera una escena de demostración para que la entrega siga siendo ejecutable y produzca las evidencias solicitadas.

## Dependencias

- Python 3.10 o superior
- OpenCV
- NumPy

## Instalación

1. Crear y activar un entorno virtual si se desea aislar la ejecución.
2. Instalar dependencias:

```bash
pip install opencv-python numpy
```

## Ejecución

Ejecutar el script principal desde la raíz del ejercicio:

```bash
python src/main.py
```

Opcionalmente se puede indicar una imagen o un video corto de entrada:

```bash
python src/main.py --input ruta/a/entrada.jpg
python src/main.py --input ruta/a/video.mp4
```

## Estructura del repositorio

```text
ejercicio_1_procesamiento_visual/
├── README.md
├── resultados/
└── src/
    └── main.py
```

## Evidencias

- [original.png](resultados/original.png)
- [grises.png](resultados/grises.png)
- [hsv_o_lab.png](resultados/hsv_o_lab.png)
- [suavizado.png](resultados/suavizado.png)
- [bordes.png](resultados/bordes.png)
- [deteccion_o_segmentacion.png](resultados/deteccion_o_segmentacion.png)

## Análisis técnico

- La conversión a escala de grises se usa para simplificar el análisis y alimentar la etapa de bordes.
- La segunda representación se implementa en LAB porque separa luminancia y crominancia de forma útil para análisis visual.
- Se eligió un suavizado gaussiano con kernel de 5x5 para reducir ruido sin borrar por completo los contornos relevantes.
- La detección de bordes se realiza con Canny usando umbrales 80 y 160, lo que ofrece un balance razonable entre sensibilidad y limpieza del resultado.
- La segmentación final se resuelve con umbral Otsu, operaciones morfológicas y contornos externos para generar una máscara comparativa sobre la escena original.
- Los resultados se guardan como archivos separados para comparar cada etapa del procesamiento.

## Uso de IA

No se utilizó IA generativa para redactar el flujo principal ni un modelo preentrenado en esta entrega. La etapa final se resolvió con segmentación clásica de OpenCV, porque cumple la consigna de detección o segmentación y mantiene la ejecución ligera y reproducible.
