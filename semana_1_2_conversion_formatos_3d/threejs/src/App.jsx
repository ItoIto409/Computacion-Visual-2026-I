import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { ModelViewer } from './ModelViewer';
import './App.css';

export default function App() {
  const [selectedModel, setSelectedModel] = useState('obj');
  const [modelInfo, setModelInfo] = useState({ vertices: 0, format: '' });

  const handleModelLoad = (info) => {
    setModelInfo(info);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Panel de control */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>
          Visor de Modelos 3D
        </h2>
        
        <div style={{ marginBottom: '15px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold' }}>
            Seleccionar formato:
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setSelectedModel('obj')}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedModel === 'obj' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                if (selectedModel !== 'obj') e.target.style.backgroundColor = '#666';
              }}
              onMouseOut={(e) => {
                if (selectedModel !== 'obj') e.target.style.backgroundColor = '#555';
              }}
            >
              OBJ
            </button>
            <button
              onClick={() => setSelectedModel('stl')}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedModel === 'stl' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                if (selectedModel !== 'stl') e.target.style.backgroundColor = '#666';
              }}
              onMouseOut={(e) => {
                if (selectedModel !== 'stl') e.target.style.backgroundColor = '#555';
              }}
            >
              STL
            </button>
            <button
              onClick={() => setSelectedModel('gltf')}
              style={{
                padding: '10px 20px',
                backgroundColor: selectedModel === 'gltf' ? '#4CAF50' : '#555',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                if (selectedModel !== 'gltf') e.target.style.backgroundColor = '#666';
              }}
              onMouseOut={(e) => {
                if (selectedModel !== 'gltf') e.target.style.backgroundColor = '#555';
              }}
            >
              GLTF
            </button>
          </div>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '5px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
            Información del Modelo
          </h3>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Formato:</strong> {modelInfo.format || 'N/A'}
          </p>
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>Vértices:</strong> {modelInfo.vertices.toLocaleString() || 0}
          </p>
        </div>

        <div style={{
          marginTop: '15px',
          fontSize: '12px',
          color: '#aaa'
        }}>
          <p style={{ margin: '5px 0' }}>💡 Usa el mouse para rotar</p>
          <p style={{ margin: '5px 0' }}>🔍 Scroll para zoom</p>
        </div>
      </div>

      {/* Escena 3D */}
      <Canvas
        camera={{ position: [3, 3, 5], fov: 50 }}
        shadows
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />

        {/* Modelo */}
        <ModelViewer 
          selectedModel={selectedModel}
          onModelLoad={handleModelLoad}
        />

        {/* Grid y controles */}
        <Grid 
          args={[10, 10]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor="#6e6e6e"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={25}
          fadeStrength={1}
          followCamera={false}
        />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
        />

        {/* Entorno */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}