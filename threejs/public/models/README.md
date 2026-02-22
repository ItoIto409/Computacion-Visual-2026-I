# Carpeta de Modelos 3D

Coloca tus modelos 3D en esta carpeta.

## Formatos Soportados

- **GLTF/GLB** (Recomendado) - `.gltf`, `.glb`
- **OBJ** - `.obj`
- **STL** - `.stl`

## Cómo Usar

1. Coloca tu archivo de modelo aquí (por ejemplo, `mi-modelo.glb`)
2. En `src/App.tsx`, actualiza estas líneas:

```typescript
const useSimpleModel = false; // Cambiar a false para cargar tu modelo
const modelPath = '/models/mi-modelo.glb'; // Nombre de tu archivo
const modelType: 'gltf' | 'obj' | 'stl' = 'gltf'; // Tipo de archivo
```

3. Guarda y recarga la aplicación

## Recursos para Modelos 3D Gratuitos

- [Sketchfab](https://sketchfab.com/feed) - Modelos 3D gratuitos
- [Poly Haven](https://polyhaven.com/models) - Modelos 3D de alta calidad
- [Free3D](https://free3d.com/) - Modelos 3D gratuitos en varios formatos
- [Thingiverse](https://www.thingiverse.com/) - Modelos 3D para impresión 3D
