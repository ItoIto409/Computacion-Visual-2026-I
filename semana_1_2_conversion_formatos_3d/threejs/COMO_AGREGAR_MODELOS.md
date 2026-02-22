# Guía: Cómo agregar tus propios modelos 3D

## 📦 Preparar tus modelos

### 1. Convertir modelos a los formatos requeridos

Puedes usar herramientas online o software para convertir tus modelos:

**Herramientas recomendadas:**
- Blender (gratuito) - https://www.blender.org/
- Meshmixer (gratuito) - http://www.meshmixer.com/
- Online: https://products.aspose.app/3d/conversion

**Desde Blender:**
1. Importa tu modelo (File > Import)
2. Exporta en cada formato:
   - File > Export > Wavefront (.obj)
   - File > Export > STL (.stl)
   - File > Export > glTF 2.0 (.gltf o .glb)

### 2. Colocar los archivos

Coloca tus modelos en: `public/models/`

```
public/
└── models/
    ├── model.obj      # Tu modelo en formato OBJ
    ├── model.mtl      # Materiales para OBJ (opcional)
    ├── model.stl      # Tu modelo en formato STL
    ├── model.gltf     # Tu modelo en formato GLTF
    └── textures/      # Texturas si las usas (opcional)
        └── texture.png
```

### 3. Verificar que los archivos se carguen

Los archivos deben ser accesibles en:
- `http://localhost:5173/models/model.obj`
- `http://localhost:5173/models/model.stl`
- `http://localhost:5173/models/model.gltf`

## 🎨 Formatos y características

### OBJ (.obj + .mtl)
- **Ventajas:** Simple, ampliamente soportado
- **Desventajas:** No soporta animaciones
- **Materiales:** Requiere archivo .mtl
- **Texturas:** Referencias externas

### STL (.stl)
- **Ventajas:** Simple, usado en impresión 3D
- **Desventajas:** Solo geometría, sin materiales/texturas
- **Uso típico:** Modelos de ingeniería, impresión 3D

### GLTF (.gltf o .glb)
- **Ventajas:** Formato moderno, soporta todo (texturas, materiales PBR, animaciones)
- **Desventajas:** Archivos pueden ser más grandes
- **.gltf:** JSON + archivos externos
- **.glb:** Binario, todo embebido (recomendado)

## 🔧 Troubleshooting

### El modelo no se carga
1. Verifica la consola del navegador (F12)
2. Asegúrate que los archivos estén en `public/models/`
3. Los nombres deben coincidir exactamente: `model.obj`, `model.stl`, `model.gltf`

### El modelo se ve negro
- Falta iluminación o materiales
- Para OBJ: asegúrate de incluir el archivo .mtl
- Para STL: es normal, usa un solo color

### El modelo es muy grande o muy pequeño
Edita en `src/App.jsx` la posición de la cámara:
```javascript
camera={{ position: [10, 10, 20] }} // Números más grandes = más lejos
```

O escala el modelo en Blender antes de exportar.

### Modelo con textura no se ve correctamente
- Para GLTF: usa formato .glb (todo embebido)
- Para OBJ: coloca las texturas en `public/models/textures/`

## 📚 Recursos útiles

### Modelos 3D gratuitos para probar:
- Sketchfab: https://sketchfab.com/
- Free3D: https://free3d.com/
- TurboSquid Free: https://www.turbosquid.com/Search/3D-Models/free

### Tutoriales:
- Blender para principiantes: https://www.youtube.com/watch?v=nIoXOplUvAw
- Convertir modelos: https://www.youtube.com/results?search_query=convert+3d+models+blender

## 💡 Modo demostración

Si no agregas modelos propios, la aplicación mostrará modelos de demostración:
- **OBJ (Demo):** Nudo toroidal verde
- **STL (Demo):** Icosaedro rojo 
- **GLTF (Demo):** Cubo con esferas orbitando

¡Esto te permite probar la aplicación inmediatamente!
