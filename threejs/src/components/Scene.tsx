import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import ModelViewer from './ModelViewer';
import SimpleModel from './SimpleModel';

interface SceneProps {
  modelPath?: string;
  modelType?: 'gltf' | 'obj' | 'stl';
  viewMode: 'faces' | 'edges' | 'vertices' | 'wireframe';
  onModelLoad?: (info: { vertices: number; faces: number; edges: number }) => void;
  useSimpleModel?: boolean;
}

const Scene: React.FC<SceneProps> = ({ 
  modelPath, 
  modelType, 
  viewMode, 
  onModelLoad,
  useSimpleModel = true
}) => {
  return (
    <Canvas 
      camera={{ position: [3, 3, 3], fov: 50 }}
      style={{ background: '#1a1a2e' }}
    >
      {/* Iluminación */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} />

      {/* Entorno */}
      <Environment preset="studio" />

      {/* Grilla de referencia */}
      <Grid 
        args={[10, 10]} 
        cellSize={0.5} 
        cellThickness={0.5}
        cellColor="#6f6f6f"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={true}
      />

      {/* Controles de órbita */}
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={1}
        maxDistance={20}
      />

      {/* Modelo 3D */}
      <Suspense fallback={null}>
        {useSimpleModel ? (
          <SimpleModel 
            viewMode={viewMode}
            onModelLoad={onModelLoad}
          />
        ) : (
          modelPath && modelType && (
            <ModelViewer 
              modelPath={modelPath}
              modelType={modelType}
              viewMode={viewMode}
              onModelLoad={onModelLoad}
            />
          )
        )}
      </Suspense>
    </Canvas>
  );
};

export default Scene;