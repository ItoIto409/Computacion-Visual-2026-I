# 📚 Guía de Desarrollo - Visualizador 3D

## Arquitectura del Proyecto

### Componentes Principales

#### 1. App.tsx
Componente raíz que maneja:
- Estado del modo de visualización (`viewMode`)
- Información del modelo (`modelInfo`)
- Configuración de qué modelo mostrar

#### 2. Scene.tsx
Configura la escena 3D con:
- Canvas de React Three Fiber
- Iluminación (ambient, directional, point lights)
- Grilla de referencia
- OrbitControls para navegación
- Suspense para carga de modelos

#### 3. ModelViewer.tsx
Carga y renderiza modelos 3D externos:
- Soporta GLTF/GLB, OBJ, STL
- Extrae geometría del modelo
- Calcula estadísticas (vértices, caras, aristas)
- Renderiza según el modo seleccionado

#### 4. SimpleModel.tsx
Modelo de ejemplo integrado:
- Genera un dodecaedro mediante código
- No requiere archivos externos
- Ideal para pruebas rápidas

#### 5. ControlPanel.tsx
Panel de interfaz de usuario:
- Botones para cambiar modo de visualización
- Display de información del modelo
- Instrucciones de uso

## Flujo de Datos

```
App.tsx (estado)
    ↓
    ├─→ Scene.tsx (escena 3D)
    │       ↓
    │       ├─→ SimpleModel.tsx (modelo por defecto)
    │       └─→ ModelViewer.tsx (modelo externo)
    │
    └─→ ControlPanel.tsx (UI)
```

## Modos de Visualización

### Faces (Caras)
```typescript
<mesh geometry={geometry}>
  <meshStandardMaterial 
    color="#4a90e2" 
    roughness={0.3} 
    metalness={0.5} 
  />
</mesh>
```
Renderiza el modelo sólido con material PBR (Physically Based Rendering).

### Edges (Aristas)
```typescript
<mesh geometry={geometry}>
  <meshBasicMaterial color="#1a1a1a" transparent opacity={0.1} />
  <Edges color="#00ff00" lineWidth={2} />
</mesh>
```
Muestra el modelo semi-transparente con aristas resaltadas.

### Vertices (Vértices)
```typescript
<points>
  <bufferGeometry>
    <bufferAttribute ... />
  </bufferGeometry>
  <pointsMaterial size={0.05} color="#ff00ff" />
</points>
```
Convierte cada vértice en un punto visible.

### Wireframe
```typescript
<mesh geometry={geometry}>
  <meshBasicMaterial color="#ff6b6b" wireframe={true} />
</mesh>
```
Renderiza toda la malla como alambre.

## Personalización Avanzada

### Agregar Nuevos Modos de Visualización

1. Actualiza el tipo en `App.tsx`:
```typescript
type ViewMode = 'faces' | 'edges' | 'vertices' | 'wireframe' | 'tuNuevoModo';
```

2. Agrega el caso en `ModelViewer.tsx` o `SimpleModel.tsx`:
```typescript
{viewMode === 'tuNuevoModo' && (
  <mesh geometry={geometry}>
    {/* Tu renderizado personalizado */}
  </mesh>
)}
```

3. Agrega el botón en `ControlPanel.tsx`:
```typescript
<button
  className={viewMode === 'tuNuevoModo' ? 'active' : ''}
  onClick={() => onViewModeChange('tuNuevoModo')}
>
  🎨 Tu Nuevo Modo
</button>
```

### Cambiar Comportamiento de la Cámara

En `Scene.tsx`, modifica OrbitControls:
```typescript
<OrbitControls 
  enableDamping
  dampingFactor={0.05}
  minDistance={0.5}      // Zoom mínimo
  maxDistance={50}       // Zoom máximo
  minPolarAngle={0}      // Ángulo vertical mínimo
  maxPolarAngle={Math.PI} // Ángulo vertical máximo
  enablePan={true}       // Permitir movimiento lateral
/>
```

### Modificar Iluminación

En `Scene.tsx`:
```typescript
// Luz ambiente - iluminación general
<ambientLight intensity={0.5} />

// Luz direccional - simula el sol
<directionalLight 
  position={[10, 10, 5]} 
  intensity={1}
  castShadow // Opcional: habilitar sombras
/>

// Luz puntual - como una bombilla
<pointLight 
  position={[0, 10, 0]} 
  intensity={0.5}
  distance={100}
  decay={2}
/>
```

## Optimización

### Para Modelos Grandes

1. Usar nivel de detalle (LOD):
```typescript
import { Lod } from '@react-three/drei';

<Lod>
  <mesh geometry={highDetailGeo} />
  <mesh geometry={mediumDetailGeo} />
  <mesh geometry={lowDetailGeo} />
</Lod>
```

2. Instancing para múltiples objetos:
```typescript
import { Instances, Instance } from '@react-three/drei';

<Instances>
  <boxGeometry />
  <meshStandardMaterial />
  <Instance position={[0, 0, 0]} />
  <Instance position={[2, 0, 0]} />
</Instances>
```

### Caché de Geometrías

```typescript
const geometry = useMemo(() => {
  return new THREE.BoxGeometry(1, 1, 1);
}, []);
```

## Debugging

### Ver Estadísticas de Rendimiento

Agrega Stats:
```typescript
import { Stats } from '@react-three/drei';

<Canvas>
  <Stats />
  {/* resto del contenido */}
</Canvas>
```

### Inspeccionar en DevTools

React Three Fiber se integra con React DevTools. Puedes inspeccionar el árbol de componentes 3D.

## Recursos Adicionales

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Three.js Manual](https://threejs.org/manual/)
- [Three.js Examples](https://threejs.org/examples/)

## Solución de Problemas

### El modelo no se carga

1. Verifica que la ruta sea correcta: `/models/nombre.glb`
2. Asegúrate de que el archivo esté en `public/models/`
3. Verifica que el tipo de archivo coincida con la extensión
4. Revisa la consola del navegador para errores

### Performance bajo

1. Reduce la complejidad del modelo
2. Usa modelos optimizados (menos polígonos)
3. Considera usar LOD (Level of Detail)
4. Desactiva opciones como sombras si no son necesarias

### Modelo aparece negro

1. Verifica que haya iluminación en la escena
2. Asegúrate de que las normales del modelo sean correctas
3. Prueba con un material MeshBasicMaterial simple primero

## Contribuir

Si mejoras el proyecto, considera:
1. Agregar tests
2. Documentar nuevas características
3. Optimizar el rendimiento
4. Mejorar la accesibilidad
