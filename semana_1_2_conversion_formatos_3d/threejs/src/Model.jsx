import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function Model({ type }) {

  if(type === "obj"){
    const obj = useLoader(OBJLoader, "/models/model.obj")
    return <primitive object={obj} scale={1}/>
  }

  if(type === "stl"){
    const geom = useLoader(STLLoader, "/models/model.stl")
    return <mesh geometry={geom}><meshStandardMaterial color="orange"/></mesh>
  }

  if(type === "gltf"){
    const gltf = useLoader(GLTFLoader, "/models/model.gltf")
    return <primitive object={gltf.scene}/>
  }
}