import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

/**
 * HierarchyScene Component
 * 
 * This component demonstrates a three-level hierarchy with transformations:
 * - Parent (Level 1): Red cube
 * - Child (Level 2): Green cylinder (child of parent)
 * - Grandchild (Level 3): Blue sphere (child of child)
 * 
 * Each level can be transformed independently, and transformations
 * are inherited down the hierarchy tree.
 */
function HierarchyScene({ parentTransform, childTransform, grandchildTransform }) {
  const parentRef = useRef()
  const childRef = useRef()
  const grandchildRef = useRef()

  // Optional: Add automatic rotation for visual effect
  useFrame((state, delta) => {
    // You can add automatic animations here if needed
    // For example: parentRef.current.rotation.y += delta * 0.1
  })

  return (
    <group
      ref={parentRef}
      position={[
        parentTransform.positionX,
        parentTransform.positionY,
        parentTransform.positionZ
      ]}
      rotation={[
        parentTransform.rotationX,
        parentTransform.rotationY,
        parentTransform.rotationZ
      ]}
    >
      {/* Parent object - Red Cube */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff4757" />
      </mesh>

      {/* Label for parent */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Parent
      </Text>

      {/* Child group (Level 2) */}
      <group
        ref={childRef}
        position={[
          childTransform.positionX,
          childTransform.positionY,
          childTransform.positionZ
        ]}
        rotation={[
          childTransform.rotationX,
          childTransform.rotationY,
          childTransform.rotationZ
        ]}
      >
        {/* Child object - Green Cylinder */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
          <meshStandardMaterial color="#2ed573" />
        </mesh>

        {/* Label for child */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Child
        </Text>

        {/* Grandchild group (Level 3) */}
        <group
          ref={grandchildRef}
          position={[
            grandchildTransform.positionX,
            grandchildTransform.positionY,
            grandchildTransform.positionZ
          ]}
          rotation={[
            grandchildTransform.rotationX,
            grandchildTransform.rotationY,
            grandchildTransform.rotationZ
          ]}
        >
          {/* Grandchild object - Blue Sphere */}
          <mesh castShadow receiveShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color="#5352ed" />
          </mesh>

          {/* Label for grandchild */}
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            Grandchild
          </Text>

          {/* Additional visual: small satellite sphere */}
          <mesh position={[0.7, 0, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffa502" />
          </mesh>
        </group>
      </group>

      {/* Origin indicator for parent */}
      <axesHelper args={[1.5]} />
    </group>
  )
}

export default HierarchyScene
