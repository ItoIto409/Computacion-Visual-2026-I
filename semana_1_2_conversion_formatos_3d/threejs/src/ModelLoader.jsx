import { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Función para crear modelos de demostración
function createDemoModel(modelType) {
  let geometry, material, mesh;
  
  switch (modelType) {
    case 'OBJ':
      // Crear un toroide para demostrar OBJ
      geometry = new THREE.TorusKnotGeometry(0.7, 0.3, 100, 16);
      material = new THREE.MeshStandardMaterial({ 
        color: 0x00ff88,
        roughness: 0.3,
        metalness: 0.7
      });
      mesh = new THREE.Mesh(geometry, material);
      break;
      
    case 'STL':
      // Crear una esfera para demostrar STL (sin materiales fancy)
      geometry = new THREE.IcosahedronGeometry(1, 1);
      material = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        flatShading: true,
        side: THREE.DoubleSide 
      });
      mesh = new THREE.Mesh(geometry, material);
      break;
      
    case 'GLTF':
      // Crear un modelo más complejo para demostrar GLTF
      const group = new THREE.Group();
      
      // Cubo central
      const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
      const cubeMat = new THREE.MeshStandardMaterial({ 
        color: 0x4ecdc4,
        roughness: 0.2,
        metalness: 0.8
      });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);
      group.add(cube);
      
      // Esferas orbitando
      for (let i = 0; i < 4; i++) {
        const sphereGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMat = new THREE.MeshStandardMaterial({ 
          color: new THREE.Color().setHSL(i / 4, 1, 0.5),
          roughness: 0.4,
          metalness: 0.6
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        const angle = (i / 4) * Math.PI * 2;
        sphere.position.set(
          Math.cos(angle) * 1.5,
          Math.sin(angle * 2) * 0.5,
          Math.sin(angle) * 1.5
        );
        group.add(sphere);
      }
      
      return { object: group, vertices: geometry ? geometry.attributes.position.count : 1000 };
      
    default:
      geometry = new THREE.BoxGeometry(1, 1, 1);
      material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
      mesh = new THREE.Mesh(geometry, material);
  }
  
  return { 
    object: mesh, 
    vertices: geometry.attributes.position.count 
  };
}

export function ModelLoader({ modelPath, modelType, onModelLoad }) {
  const [modelData, setModelData] = useState(null);
  const [error, setError] = useState(null);
  const [useDemoModel, setUseDemoModel] = useState(false);

  useEffect(() => {
    let loader;
    setError(null);
    setUseDemoModel(false);
    
    // Crear un loader según el tipo de modelo
    switch (modelType) {
      case 'OBJ':
        loader = new OBJLoader();
        break;
      case 'STL':
        loader = new STLLoader();
        break;
      case 'GLTF':
        loader = new GLTFLoader();
        break;
      default:
        setError('Tipo de modelo no soportado');
        return;
    }

    // Cargar el modelo
    loader.load(
      modelPath,
      (data) => {
        let object;
        let vertexCount = 0;

        if (modelType === 'GLTF') {
          object = data.scene;
          
          // Asegurar que todos los meshes tengan materiales
          object.traverse((child) => {
            if (child.isMesh) {
              if (!child.material) {
                child.material = new THREE.MeshStandardMaterial({ 
                  color: 0x888888,
                  roughness: 0.5,
                  metalness: 0.3
                });
              }
              // Asegurar que el material tenga las propiedades correctas
              if (child.material) {
                child.material.side = THREE.DoubleSide;
                child.castShadow = true;
                child.receiveShadow = true;
              }
            }
          });
        } else if (modelType === 'STL') {
          const geometry = data;
          const material = new THREE.MeshPhongMaterial({ 
            color: 0x888888, 
            flatShading: false,
            side: THREE.DoubleSide 
          });
          object = new THREE.Mesh(geometry, material);
          vertexCount = geometry.attributes.position.count;
        } else if (modelType === 'OBJ') {
          object = data;
          
          // Asegurar que todos los meshes OBJ tengan materiales
          object.traverse((child) => {
            if (child.isMesh) {
              if (!child.material) {
                child.material = new THREE.MeshStandardMaterial({ 
                  color: 0x888888,
                  roughness: 0.5,
                  metalness: 0.3
                });
              }
              if (child.material) {
                child.material.side = THREE.DoubleSide;
              }
            }
          });
        }

        // Calcular número de vértices
        if (modelType !== 'STL') {
          object.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry && child.geometry.attributes.position) {
                vertexCount += child.geometry.attributes.position.count;
              }
            }
          });
        }
        
        // Centrar y escalar el modelo
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2 / maxDim; // Escalar para que quepa en un cubo de 2 unidades
        
        object.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        object.scale.setScalar(scale);

        console.log(`✓ Modelo ${modelType} cargado exitosamente`);
        console.log(`  Vértices: ${vertexCount}`);
        console.log(`  Tamaño: ${size.x.toFixed(2)} x ${size.y.toFixed(2)} x ${size.z.toFixed(2)}`);

        setModelData(object);
        
        if (onModelLoad) {
          onModelLoad({ vertices: vertexCount, format: modelType });
        }
      },
      (progress) => {
        if (progress.total > 0) {
          console.log((progress.loaded / progress.total) * 100 + '% loaded');
        }
      },
      (err) => {
        console.warn(`No se pudo cargar el modelo ${modelType}, usando modelo de demostración:`, err.message);
        setUseDemoModel(true);
        
        // Usar modelo de demostración cuando no se encuentra el archivo
        const demo = createDemoModel(modelType);
        setModelData(demo.object);
        
        if (onModelLoad) {
          onModelLoad({ 
            vertices: demo.vertices, 
            format: `${modelType} (Demo)` 
          });
        }
      }
    );
  }, [modelPath, modelType, onModelLoad]);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  if (!modelData) {
    return (
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="gray" wireframe />
      </mesh>
    );
  }

  return (
    <group>
      <primitive object={modelData} />
      {useDemoModel && (
        <mesh position={[0, -2, 0]}>
          <planeGeometry args={[4, 0.5]} />
          <meshBasicMaterial color="#333333" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
