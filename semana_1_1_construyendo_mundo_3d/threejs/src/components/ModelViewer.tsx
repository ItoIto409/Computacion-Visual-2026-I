import React, { useRef, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import * as THREE from 'three';
import { Edges } from '@react-three/drei';

interface ModelViewerProps {
  modelPath: string;
  modelType: 'gltf' | 'obj' | 'stl';
  viewMode: 'faces' | 'edges' | 'vertices' | 'wireframe';
  onModelLoad?: (info: { vertices: number; faces: number; edges: number }) => void;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelPath, 
  modelType, 
  viewMode,
  onModelLoad 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Cargar el modelo según el tipo
  const model = useLoader(
    modelType === 'gltf' ? GLTFLoader : modelType === 'obj' ? OBJLoader : STLLoader,
    modelPath,
    (loader) => {
      if (modelType === 'gltf') {
        // Configuración adicional para GLTF si es necesario
      }
    }
  );

  // Extraer la geometría del modelo cargado
  const geometry = useMemo(() => {
    let geom: THREE.BufferGeometry | null = null;

    if (modelType === 'gltf') {
      const gltfModel = model as any;
      gltfModel.scene.traverse((child: any) => {
        if (child.isMesh && !geom) {
          geom = child.geometry;
        }
      });
    } else if (modelType === 'obj') {
      const objModel = model as THREE.Group;
      objModel.traverse((child: any) => {
        if (child.isMesh && !geom) {
          geom = child.geometry;
        }
      });
    } else if (modelType === 'stl') {
      geom = model as THREE.BufferGeometry;
    }

    if (geom && onModelLoad) {
      const positions = geom.attributes.position;
      const indices = geom.index;
      
      const vertexCount = positions ? positions.count : 0;
      const faceCount = indices ? indices.count / 3 : (positions ? positions.count / 3 : 0);
      
      // Calcular el número de aristas (para triángulos: E = (3F + V - 2) / 2)
      const edgeCount = Math.floor((3 * faceCount + vertexCount - 2) / 2);

      onModelLoad({
        vertices: vertexCount,
        faces: Math.floor(faceCount),
        edges: edgeCount
      });
    }

    return geom;
  }, [model, modelType, onModelLoad]);

  // Crear puntos para visualización de vértices
  const verticesPoints = useMemo(() => {
    if (!geometry || viewMode !== 'vertices') return null;

    const positions = geometry.attributes.position;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < positions.count; i++) {
      points.push(
        new THREE.Vector3(
          positions.getX(i),
          positions.getY(i),
          positions.getZ(i)
        )
      );
    }

    return points;
  }, [geometry, viewMode]);

  if (!geometry) return null;

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
      {viewMode === 'vertices' && verticesPoints && (
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

export default ModelViewer;
