import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei'
import AnimatedCube from './components/AnimatedCube'
import AnimatedSphere from './components/AnimatedSphere'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <div className="info-panel">
        <h1>Transformaciones Animadas 3D</h1>
        <p>
          Este proyecto demuestra el uso de <code>useFrame</code> para aplicar
          transformaciones animadas en tiempo real.
        </p>
        
        <h2>Cubo (Izquierda)</h2>
        <ul>
          <li><strong>Traslación:</strong> Trayectoria circular</li>
          <li><strong>Rotación:</strong> Giro continuo en todos los ejes</li>
          <li><strong>Escala:</strong> Pulso suave con Math.sin()</li>
        </ul>

        <h2>Esfera (Derecha)</h2>
        <ul>
          <li><strong>Traslación:</strong> Trayectoria senoidal vertical</li>
          <li><strong>Rotación:</strong> Giro sobre eje Y</li>
          <li><strong>Escala:</strong> Pulso sincronizado con movimiento</li>
        </ul>
      </div>

      <div className="controls-hint">
        <strong>Controles:</strong> Clic + arrastrar para rotar | Rueda para zoom | Clic derecho + arrastrar para pan
      </div>

      <Canvas>
        <color attach="background" args={['#0d1117']} />
        
        <PerspectiveCamera makeDefault position={[0, 5, 12]} />
        
        {/* Iluminación */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[10, -10, -5]} intensity={0.5} color="#ec4899" />

        {/* Objetos animados */}
        <AnimatedCube position={[-3, 0, 0]} />
        <AnimatedSphere position={[3, 0, 0]} />

        {/* Grid de referencia */}
        <Grid 
          args={[20, 20]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor="#30363d" 
          sectionSize={2} 
          sectionThickness={1} 
          sectionColor="#424a53" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false}
          infiniteGrid={true}
        />

        {/* Controles de órbita */}
        <OrbitControls 
          makeDefault 
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  )
}

export default App
