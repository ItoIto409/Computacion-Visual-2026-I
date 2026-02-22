import React, { useState } from 'react';
import './styles/App.css';
import Scene from './components/Scene';
import ControlPanel from './components/ControlPanel';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'faces' | 'edges' | 'vertices' | 'wireframe'>('faces');
  const [modelInfo, setModelInfo] = useState<{
    vertices: number;
    faces: number;
    edges: number;
  } | null>(null);

  // Configuración del modelo
  // Para usar un modelo externo, cambia useSimpleModel a false y proporciona modelPath y modelType
  const useSimpleModel = true; // true = modelo de ejemplo integrado, false = cargar desde archivo
  const modelPath = '/models/example.glb'; // Ruta al modelo en la carpeta public
  const modelType: 'gltf' | 'obj' | 'stl' = 'gltf';

  const handleModelLoad = (info: { vertices: number; faces: number; edges: number }) => {
    setModelInfo(info);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎨 Visualizador 3D - React Three Fiber</h1>
        <p>Explora modelos 3D con diferentes modos de visualización</p>
      </header>

      <div className="app-content">
        <div className="canvas-container">
          <Scene 
            modelPath={modelPath}
            modelType={modelType}
            viewMode={viewMode}
            onModelLoad={handleModelLoad}
            useSimpleModel={useSimpleModel}
          />
        </div>

        <ControlPanel 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          modelInfo={modelInfo}
        />
      </div>
    </div>
  );
};

export default App;