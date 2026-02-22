import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

interface SimpleModelProps {
  viewMode: 'faces' | 'edges' | 'vertices' | 'wireframe';
  onModelLoad?: (info: { vertices: number; faces: number; edges: number }) => void;
}

const SimpleModel: React.FC<SimpleModelProps> = ({ viewMode, onModelLoad }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Crear una geometría más compleja (Dodecaedro)
  const geometry = new THREE.DodecahedronGeometry(1, 0);

  useEffect(() => {
    if (geometry && onModelLoad) {
      const positions = geometry.attributes.position;
      const indices = geometry.index;
      
      const vertexCount = positions ? positions.count : 0;
      const faceCount = indices ? indices.count / 3 : (positions ? positions.count / 3 : 0);
      const edgeCount = Math.floor((3 * faceCount + vertexCount - 2) / 2);

      onModelLoad({
        vertices: vertexCount,
        faces: Math.floor(faceCount),
        edges: edgeCount
      });
    }
  }, [geometry, onModelLoad]);

  // Crear puntos para visualización de vértices
  const verticesPoints: THREE.Vector3[] = [];
  if (viewMode === 'vertices') {
    const positions = geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      verticesPoints.push(
        new THREE.Vector3(
          positions.getX(i),
          positions.getY(i),
          positions.getZ(i)
        )
      );
    }
  }

  return (
    <group>
      {/* Visualización de CARAS (faces) - Modelo sólido normal */}
      {viewMode === 'faces' && (
        <mesh ref={meshRef} geometry={geometry}>
          <meshStandardMaterial 
            color="#4a90e2" 
            roughness={0.3} 
            metalness={0.5} 
          />
        </mesh>
      )}

      {/* Visualización de ARISTAS (edges) - Solo bordes */}
      {viewMode === 'edges' && (
        <mesh geometry={geometry}>
          <meshBasicMaterial color="#1a1a1a" transparent opacity={0.1} />
          <Edges color="#00ff00" lineWidth={2} />
        </mesh>
      )}

      {/* Visualización de WIREFRAME - Malla de alambre */}
      {viewMode === 'wireframe' && (
        <mesh ref={meshRef} geometry={geometry}>
          <meshBasicMaterial color="#ff6b6b" wireframe={true} />
        </mesh>
      )}

      {/* Visualización de VÉRTICES (vertices) - Puntos */}
      {viewMode === 'vertices' && (
        <>
          <mesh geometry={geometry}>
            <meshBasicMaterial color="#1a1a1a" transparent opacity={0.05} />
          </mesh>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={verticesPoints.length}
                array={new Float32Array(verticesPoints.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial 
              size={0.05} 
              color="#ff00ff" 
              sizeAttenuation={true}
            />
          </points>
        </>
      )}
    </group>
  );
};

export default SimpleModel;
