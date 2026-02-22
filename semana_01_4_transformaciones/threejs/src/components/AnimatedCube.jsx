import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * AnimatedCube Component
 * 
 * Demuestra tres tipos de transformaciones animadas:
 * 1. TRASLACIÓN: Movimiento circular en el plano XZ
 * 2. ROTACIÓN: Giro continuo en los tres ejes
 * 3. ESCALA: Pulso suave usando Math.sin()
 */
function AnimatedCube({ position }) {
  const meshRef = useRef()
  const basePosition = new THREE.Vector3(...position)

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const time = clock.getElapsedTime()

    // ═══ 1. TRASLACIÓN: Trayectoria circular ═══
    // Ecuaciones paramétricas del círculo:
    // x(t) = radio * cos(ωt)
    // z(t) = radio * sin(ωt)
    const radius = 2.5          // Radio del círculo
    const angularSpeed = 0.5    // Velocidad angular (rad/s)
    
    const x = basePosition.x + radius * Math.cos(angularSpeed * time)
    const z = basePosition.z + radius * Math.sin(angularSpeed * time)
    const y = basePosition.y   // Mantiene altura constante
    
    meshRef.current.position.set(x, y, z)

    // ═══ 2. ROTACIÓN: Giro continuo en los tres ejes ═══
    // Incremento continuo de los ángulos de rotación
    meshRef.current.rotation.x += 0.01  // Rotación en X
    meshRef.current.rotation.y += 0.015 // Rotación en Y (más rápida)
    meshRef.current.rotation.z += 0.007 // Rotación en Z (más lenta)

    // ═══ 3. ESCALA: Pulso suave ═══
    // Math.sin() oscila entre -1 y 1
    // Escalamos al rango [0.8, 1.2] para el pulso
    const baseScale = 1.0
    const scaleAmplitude = 0.2
    const scaleFrequency = 2.0
    
    const scale = baseScale + scaleAmplitude * Math.sin(scaleFrequency * time)
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#3b82f6" 
        metalness={0.5}
        roughness={0.2}
      />
    </mesh>
  )
}

export default AnimatedCube
