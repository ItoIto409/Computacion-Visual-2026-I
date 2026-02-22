import React from 'react';
import { Canvas } from '@react-three/fiber';

interface BoxProps {
  position?: [number, number, number];
  color?: string;
}

const Box: React.FC<BoxProps> = ({ position = [0, 0, 0], color = 'orange' }) => {
  return (
    <mesh position={position}>
      <boxBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

export default Box;