# Carpeta de Modelos 3D

Coloca tus archivos de modelos 3D en esta carpeta:

- `model.obj` - Tu modelo en formato OBJ
- `model.stl` - Tu modelo en formato STL  
- `model.gltf` (o `model.glb`) - Tu modelo en formato GLTF

## Notas importantes:

1. Si usas formato OBJ con materiales, también necesitas el archivo `.mtl` correspondiente
2. Los modelos GLTF pueden incluir texturas embebidas (recomendado usar .glb)
3. Los archivos STL no soportan materiales, se les aplicará uno por defecto

## Ejemplos de nombres de archivo:
```
models/
  ├── model.obj
  ├── model.mtl
  ├── model.stl
  └── model.gltf
```

Si no tienes modelos aún, la aplicación mostrará geometrías de fallback (cubos, esferas).
