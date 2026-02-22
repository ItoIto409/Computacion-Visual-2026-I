import { Suspense } from 'react';
import { ModelLoader } from './ModelLoader';

export function ModelViewer({ selectedModel, onModelLoad }) {
  // Configuración de modelos - usando tus archivos convertidos
  const models = {
    obj: {
      path: '/models/converted_from_gltf.obj',
      type: 'OBJ',
      name: 'Modelo OBJ (convertido desde GLTF)'
    },
    stl: {
      path: '/models/converted_from_obj.stl',
      type: 'STL',
      name: 'Modelo STL (convertido desde OBJ)'
    },
    gltf: {
      path: '/models/converted_from_stl.gltf',
      type: 'GLTF',
      name: 'Modelo GLTF (convertido desde STL)'
    }
  };

  const currentModel = models[selectedModel];

  return (
    <Suspense fallback={<LoadingModel />}>
      <ModelLoader 
        modelPath={currentModel.path}
        modelType={currentModel.type}
        onModelLoad={onModelLoad}
      />
    </Suspense>
  );
}

function LoadingModel() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="yellow" wireframe />
    </mesh>
  );
}
