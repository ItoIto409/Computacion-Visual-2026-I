import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AnimatedSphere Component
 * 
 * Demuestra transformaciones animadas con trayectoria senoidal:
 * 1. TRASLACIÓN: Movimiento vertical senoidal
 * 2. ROTACIÓN: Giro sobre el eje Y
 * 3. ESCALA: Pulso sincronizado con el movimiento
 */
function AnimatedSphere({ position }) {
  const meshRef = useRef()
  const basePosition = new THREE.Vector3(...position)

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()

    // ═══ 1. TRASLACIÓN: Trayectoria senoidal vertical ═══
    // Movimiento oscilatorio en el eje Y
    // y(t) = y₀ + A * sin(ωt + φ)
    const amplitude = 2.0       // Amplitud del movimiento
    const frequency = 1.2       // Frecuencia (ciclos por segundo)
    const phase = Math.PI / 4   // Desfase inicial
    
    const x = basePosition.x
    const y = basePosition.y + amplitude * Math.sin(frequency * time + phase)
    const z = basePosition.z
    
    meshRef.current.position.set(x, y, z)

    // ═══ 2. ROTACIÓN: Giro sobre eje Y ═══
    // Rotación continua solo en el eje Y
    meshRef.current.rotation.y = time * 1.5  // 1.5 rad/s

    // También agregamos una pequeña inclinación sincronizada
    meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3
    meshRef.current.rotation.z = Math.cos(time * 0.7) * 0.2

    // ═══ 3. ESCALA: Pulso sincronizado ═══
    // La escala está sincronizada con el movimiento vertical
    // Cuando sube, se hace más grande; cuando baja, más pequeña
    const baseScale = 0.8
    const scaleAmplitude = 0.3
    const scaleFactor = baseScale + scaleAmplitude * Math.sin(frequency * time + phase)
    
    meshRef.current.scale.setScalar(scaleFactor)
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshStandardMaterial 
        color="#ec4899" 
        metalness={0.6}
        roughness={0.3}
        emissive="#ec4899"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

export default AnimatedSphere
