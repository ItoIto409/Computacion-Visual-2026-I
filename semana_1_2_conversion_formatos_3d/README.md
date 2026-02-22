# Taller Conversion Formatos 3D

**Estudiante:** Jerónimo Bermúdez Hernández  
**Fecha de entrega:** 21 de febrero de 2026

---

## Descripción

Este taller explora la conversión entre distintos formatos de modelos 3D: **OBJ**, **STL** y **GLTF**, analizando sus diferencias estructurales, compatibilidad entre entornos y cómo se interpretan en distintas plataformas de visualización. El objetivo principal es comprender la estructura interna de cada formato, realizar conversiones entre ellos y observar cómo estas conversiones afectan la geometría, materiales y calidad del renderizado.

Se trabajó tanto en Python como en Three.js, implementando herramientas de análisis, conversión automatizada y visualización interactiva que permiten comparar los modelos convertidos y observar las diferencias en tiempo real.

---

## Implementaciones

### 1. Python con Jupyter Notebook

**Plataforma:** Jupyter Notebook / Google Colab  
**Tecnologías:** Python, trimesh, open3d, numpy, matplotlib

#### Funcionalidades implementadas:

- Carga de modelos 3D en formatos OBJ, STL y GLTF usando `trimesh`
- Análisis comparativo de propiedades estructurales:
  - Número de vértices
  - Número de caras (triángulos)
  - Presencia de normales
  - Detección de vértices duplicados
- Conversión entre formatos utilizando `trimesh.exchange`
- Visualización de cada modelo y sus propiedades
- Exportación de modelos convertidos
- Script automatizado para comparación entre múltiples modelos

#### Análisis realizado:

- Comparación cuantitativa entre formatos (diferencias en conteo de elementos)
- Pérdida de información durante conversiones (materiales, texturas, colores)
- Validación de integridad geométrica post-conversión
- Análisis de tamaño de archivo según formato

**Código relevante:** Ver notebook [python/conversion_formatos.ipynb](python/conversion_formatos.ipynb)

### 2. Three.js con React Three Fiber

**Plataforma:** Web  
**Tecnologías:** Vite, React, React Three Fiber, @react-three/drei

#### Funcionalidades implementadas:

- Carga dinámica de los tres formatos (.OBJ, .STL, .GLTF) en la misma escena
- Sistema de alternancia entre modelos con botones/selector
- OrbitControls para exploración interactiva de cada modelo
- Visualización comparativa de diferencias en renderizado:
  - Suavidad de superficies
  - Aplicación de materiales
  - Preservación de texturas
- Panel de información que muestra:
  - Formato actual del modelo
  - Número de vértices
  - Número de caras
  - Tamaño aproximado
- Iluminación configurada para resaltar diferencias visuales

#### Características técnicas:

- Loaders específicos para cada formato: `GLTFLoader`, `OBJLoader`, `STLLoader`
- Gestión de estado para alternancia de modelos
- Cálculo dinámico de estadísticas de geometría
- Interfaz responsiva y controles intuitivos

**Código relevante:** Ver carpeta [threejs/](threejs/)

---

## Resultados Visuales

### Three.js - Comparador de Formatos

![Visualizador de formatos](media/threejs_comparacion.png)
*Fig 1: Interfaz del visualizador mostrando el mismo modelo en diferentes formatos*

![Demostración de conversión](media/conversion_demo.gif)
*Fig 2: Alternancia entre modelos OBJ, STL y GLTF mostrando diferencias visuales*

![Detalles de renderizado](media/render_differences.png)
*Fig 3: Comparación lado a lado de las diferencias en suavidad y materiales*

### Python - Análisis de Conversiones

![Análisis Python](media/python_conversion.png)
*Fig 4: Comparación de propiedades estructurales entre formatos*

![Estadísticas de conversión](media/python_stats.png)
*Fig 5: Tabla comparativa de vértices, caras y tamaño de archivo*

---

## Código Relevante

### Three.js - Selector de formatos

```jsx
const [currentFormat, setCurrentFormat] = useState('gltf');

const formatButtons = [
  { format: 'gltf', label: 'GLTF' },
  { format: 'obj', label: 'OBJ' },
  { format: 'stl', label: 'STL' }
];

return (
  <div className="format-selector">
    {formatButtons.map(({ format, label }) => (
      <button
        key={format}
        onClick={() => setCurrentFormat(format)}
        className={currentFormat === format ? 'active' : ''}
      >
        {label}
      </button>
    ))}
  </div>
);
```

### Python - Conversión automática entre formatos

```python
import trimesh

def convert_model(input_path, output_format):
    """
    Convierte un modelo 3D a otro formato
    """
    # Cargar el modelo original
    mesh = trimesh.load(input_path)
    
    # Generar nombre de salida
    output_path = input_path.replace(
        input_path.split('.')[-1], 
        output_format
    )
    
    # Exportar según formato
    mesh.export(output_path)
    
    # Mostrar estadísticas
    print(f'Conversión completada:')
    print(f'  Vértices: {len(mesh.vertices)}')
    print(f'  Caras: {len(mesh.faces)}')
    print(f'  Archivo: {output_path}')
    
    return output_path

# Ejemplo de uso
convert_model('modelo.obj', 'stl')
convert_model('modelo.obj', 'gltf')
```

### Python - Comparación automatizada

```python
def compare_formats(model_paths):
    """
    Compara las propiedades de un mismo modelo en diferentes formatos
    """
    results = {}
    
    for path in model_paths:
        mesh = trimesh.load(path)
        format_name = path.split('.')[-1].upper()
        
        results[format_name] = {
            'vertices': len(mesh.vertices),
            'faces': len(mesh.faces),
            'has_normals': mesh.vertex_normals is not None,
            'has_colors': mesh.visual.vertex_colors is not None,
            'watertight': mesh.is_watertight,
            'file_size': os.path.getsize(path)
        }
    
    # Crear DataFrame para visualización
    df = pd.DataFrame(results).T
    print(df)
    
    return results
```

---

## Prompts Utilizados

Durante el desarrollo de este taller se utilizaron prompts de IA generativa para:

1. **Configuración de conversión en Python**
   - "Cómo usar trimesh para convertir entre formatos OBJ, STL y GLTF en Python"
   - "Crear script automatizado para comparar propiedades de modelos en diferentes formatos"
   - "Detectar pérdida de información al convertir entre formatos 3D"

2. **Implementación del selector de formatos en Three.js**
   - "Crear sistema para alternar entre diferentes modelos 3D en React Three Fiber"
   - "Cargar GLTFLoader, OBJLoader y STLLoader en el mismo componente"
   - "Mostrar información del modelo actual en pantalla"

3. **Análisis de diferencias de renderizado**
   - "Por qué los modelos STL se ven más facetados que los GLTF"
   - "Cómo se preservan los materiales al convertir entre formatos"
   - "Diferencias entre formato binario y ASCII en archivos 3D"

4. **Optimización y análisis**
   - "Calcular tamaño de archivo y número de elementos en geometría Three.js"
   - "Comparar rendimiento de carga entre formatos OBJ, STL y GLTF"
   - "Mejores prácticas para conversión de modelos 3D sin pérdida de calidad"

5. **Documentación del proceso**
   - "Explicar ventajas y desventajas de cada formato 3D"
   - "Cuándo usar OBJ vs STL vs GLTF en proyectos 3D"

---

## Aprendizajes y Dificultades

### Aprendizajes clave:

1. **Características de cada formato:**
   - **OBJ**: Formato de texto legible, ampliamente compatible, soporta materiales (archivo .mtl), pero puede ser pesado y no incluye animaciones.
   - **STL**: Formato simple enfocado en geometría pura (triángulos), ideal para impresión 3D, pero no incluye información de color, textura o materiales. Los modelos STL pueden verse facetados por falta de normales suavizadas.
   - **GLTF**: Formato moderno optimizado para web, soporta materiales PBR, animaciones, texturas embebidas, y tiene versión binaria (GLB) muy eficiente. Es el más completo pero menos universal.

2. **Pérdida de información en conversiones:**
   - Al convertir de GLTF/GLB a OBJ se pierden materiales PBR complejos.
   - Al convertir a STL se pierde toda información de color, textura y materiales.
   - STL no almacena normales de vértices, por lo que el suavizado debe recalcularse.
   - Algunos formatos duplican vértices para almacenar normales diferentes por cara.

3. **Diferencias en renderizado:**
   - Los modelos GLTF se renderizan con mayor calidad gracias a materiales PBR.
   - Los modelos STL requieren cálculo de normales para suavizado de superficies.
   - La iluminación afecta diferente a cada formato según la información disponible.

4. **Herramientas de conversión:**
   - `trimesh` es excelente para conversiones rápidas y análisis estructural.
   - `open3d` ofrece algoritmos avanzados de procesamiento de mallas.
   - La conversión no siempre es perfecta; algunos formatos almacenan información de forma diferente.

5. **Tamaño de archivo:**
   - GLTF binario (GLB) suele ser el más compacto.
   - OBJ en formato texto puede ser muy pesado.
   - STL binario es eficiente para geometría pura.

### Dificultades encontradas:

1. **Incompatibilidad de materiales:**
   - Al cargar OBJ sin archivo .mtl, el modelo aparece sin textura.
   - Solución: Aplicar material por defecto en Three.js o incluir el .mtl en la conversión.

2. **Modelos STL facetados:**
   - Los modelos STL se veían con bordes muy marcados comparados con GLTF.
   - Solución: Configurar `flatShading={false}` y asegurar que las normales estén calculadas correctamente en Three.js.

3. **Carga asíncrona de múltiples formatos:**
   - Gestionar el estado de carga de tres loaders diferentes resultó complejo.
   - Solución: Usar componentes separados y Suspense de React para manejar la carga.

4. **Diferencias en sistemas de coordenadas:**
   - Algunos modelos aparecían rotados o en escala incorrecta según el formato.
   - Solución: Normalizar escala y orientación después de cargar cada modelo.

5. **Conversión de GLTF con texturas:**
   - Al convertir GLTF con texturas embebidas a OBJ, las texturas no se exportaban automáticamente.
   - Solución: Exportar texturas por separado y referenciarlas en el archivo .mtl.

---

## Conclusiones

Este taller permitió comprender en profundidad las diferencias estructurales y funcionales entre los formatos 3D más utilizados. Se evidenció que no existe un formato "mejor", sino que cada uno tiene casos de uso específicos:

- **GLTF/GLB**: Ideal para web, visualización interactiva, y proyectos que requieren materiales avanzados.
- **OBJ**: Excelente para intercambio entre diferentes aplicaciones 3D, fácil de editar manualmente.
- **STL**: Perfecto para impresión 3D y cuando solo importa la geometría.

La capacidad de convertir entre formatos es esencial en el flujo de trabajo 3D, pero es importante ser consciente de qué información se preserva y qué se pierde en cada conversión.
