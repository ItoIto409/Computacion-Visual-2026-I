import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid } from '@react-three/drei'
import { useControls } from 'leva'
import HierarchyScene from './components/HierarchyScene'
import './App.css'

function App() {
  // Controls for parent transformations
  const parentControls = useControls('Parent (Level 1)', {
    positionX: { value: 0, min: -5, max: 5, step: 0.1 },
    positionY: { value: 0, min: -5, max: 5, step: 0.1 },
    positionZ: { value: 0, min: -5, max: 5, step: 0.1 },
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
  })

  // Controls for child transformations
  const childControls = useControls('Child (Level 2)', {
    positionX: { value: 2, min: -5, max: 5, step: 0.1 },
    positionY: { value: 0, min: -5, max: 5, step: 0.1 },
    positionZ: { value: 0, min: -5, max: 5, step: 0.1 },
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
  })

  // Controls for grandchild transformations
  const grandchildControls = useControls('Grandchild (Level 3)', {
    positionX: { value: 1, min: -5, max: 5, step: 0.1 },
    positionY: { value: 0, min: -5, max: 5, step: 0.1 },
    positionZ: { value: 0, min: -5, max: 5, step: 0.1 },
    rotationX: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationY: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
    rotationZ: { value: 0, min: 0, max: Math.PI * 2, step: 0.01 },
  })

  return (
    <div className="app-container">
      <div className="info-panel">
        <h1>Jerarquías y Transformaciones 3D</h1>
        <p>Usa los controles de la derecha para modificar las transformaciones de cada nivel de la jerarquía.</p>
        <p>Observa cómo las transformaciones del padre afectan a los hijos.</p>
      </div>
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <color attach="background" args={['#1a1a2e']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        
        <HierarchyScene
          parentTransform={parentControls}
          childTransform={childControls}
          grandchildTransform={grandchildControls}
        />
        
        <Grid 
          args={[20, 20]} 
          cellSize={0.5} 
          cellThickness={0.5} 
          cellColor="#6f6f6f" 
          sectionSize={2} 
          sectionThickness={1} 
          sectionColor="#9d4b4b" 
          fadeDistance={30} 
          fadeStrength={1} 
          followCamera={false}
          infiniteGrid={true}
        />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}

export default App
