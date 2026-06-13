import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei';
import { CanvasTexture, DataTexture, RepeatWrapping, RGBAFormat, SRGBColorSpace, UnsignedByteType } from 'three';

function makeTextureBase(texture) {
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1.4, 1.4);
  texture.needsUpdate = true;
  return texture;
}

function createDiffuseTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');

  context.fillStyle = '#7a5b39';
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < 8; row += 1) {
    for (let column = 0; column < 8; column += 1) {
      const hueOffset = (row + column) % 3;
      const shade = 110 + row * 8 + column * 3;
      context.fillStyle = `rgb(${shade + hueOffset * 2}, ${86 + row * 2}, ${52 + column * 2})`;
      context.fillRect(column * 64, row * 64, 64, 64);

      context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      context.lineWidth = 2;
      context.strokeRect(column * 64 + 1, row * 64 + 1, 62, 62);
    }
  }

  context.strokeStyle = 'rgba(34, 23, 15, 0.42)';
  context.lineWidth = 8;
  for (let row = 0; row <= 8; row += 1) {
    context.beginPath();
    context.moveTo(0, row * 64);
    context.lineTo(canvas.width, row * 64);
    context.stroke();
  }

  for (let column = 0; column <= 8; column += 1) {
    context.beginPath();
    context.moveTo(column * 64, 0);
    context.lineTo(column * 64, canvas.height);
    context.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return makeTextureBase(texture);
}

function createRoughnessTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  const image = context.createImageData(size, size);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const wave = Math.sin(x * 0.13) * 0.5 + Math.cos(y * 0.17) * 0.5;
      const noise = Math.random() * 28;
      const value = Math.max(24, Math.min(235, 150 + wave * 45 + noise));
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = value;
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  return makeTextureBase(texture);
}

function createNormalTexture() {
  const size = 128;
  const data = new Uint8Array(size * size * 4);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const nx = Math.sin(x * 0.18) * 0.12;
      const ny = Math.cos(y * 0.16) * 0.12;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));

      data[index] = Math.round((nx * 0.5 + 0.5) * 255);
      data[index + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[index + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      data[index + 3] = 255;
    }
  }

  return makeTextureBase(new DataTexture(data, size, size, RGBAFormat, UnsignedByteType));
}

function createSceneTextures() {
  return {
    map: createDiffuseTexture(),
    normalMap: createNormalTexture(),
    roughnessMap: createRoughnessTexture(),
  };
}

function buildPyramid(levels = 6) {
  const boxes = [];
  const size = 0.96;
  const spacing = 1.04;
  const verticalStep = 0.98;

  for (let level = 0; level < levels; level += 1) {
    const rowCount = levels - level;
    const offset = (rowCount - 1) * spacing * 0.5;
    const y = level * verticalStep + size * 0.5;

    for (let x = 0; x < rowCount; x += 1) {
      for (let z = 0; z < rowCount; z += 1) {
        boxes.push({
          id: `${level}-${x}-${z}`,
          position: [x * spacing - offset, y, z * spacing - offset],
          level,
        });
      }
    }
  }

  return boxes;
}

function PyramidBlock({ position, level, textures }) {
  return (
    <mesh castShadow receiveShadow position={position} rotation={[0, level * 0.02, 0]}>
      <boxGeometry args={[0.96, 0.96, 0.96]} />
      <meshStandardMaterial
        map={textures.map}
        normalMap={textures.normalMap}
        roughnessMap={textures.roughnessMap}
        metalnessMap={textures.metalnessMap}
        roughness={1}
        metalness={0.35}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

function PyramidStage() {
  const boxes = useMemo(() => buildPyramid(6), []);
  const textures = useMemo(() => createSceneTextures(), []);

  return (
    <group position={[0, -0.2, 0]} rotation={[0, -0.45, 0]}>
      {boxes.map((box) => (
        <PyramidBlock key={box.id} position={box.position} level={box.level} textures={textures} />
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.52, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#11131d" roughness={1} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <Canvas
      shadows
      camera={{ position: [8.5, 7, 10], fov: 42 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <color attach="background" args={['#090b14']} />
      <fog attach="fog" args={['#090b14', 14, 28]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.4} color="#ffe9c7" groundColor="#12131a" />
      <directionalLight
        position={[6, 12, 8]}
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-6, 3, -4]} intensity={0.45} color="#9eb4ff" />
      <pointLight position={[0, 7, 0]} intensity={18} color="#ffb35c" />

      <Suspense fallback={null}>
        <Environment preset="studio" />
        <PyramidStage />
        <ContactShadows opacity={0.5} scale={18} blur={2.8} far={8} resolution={1024} color="#000000" />
      </Suspense>

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={7}
        maxDistance={20}
        maxPolarAngle={Math.PI * 0.495}
      />
    </Canvas>
  );
}

export default function App() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">Ejercicio 2</p>
        <h1>Pirámide escalonada 3D</h1>
        <p className="lead">
          Escena construida con React Three Fiber y materiales PBR. La pirámide se arma con cajas apiladas por niveles, con iluminación de estudio y cámara orbital.
        </p>

        <div className="meta-grid">
          <article>
            <span className="meta-label">Geometría</span>
            <strong>6 niveles de Box</strong>
          </article>
          <article>
            <span className="meta-label">Material</span>
            <strong>Diffuse + normal + roughness</strong>
          </article>
          <article>
            <span className="meta-label">Navegación</span>
            <strong>OrbitControls</strong>
          </article>
          <article>
            <span className="meta-label">Render</span>
            <strong>Shadows + Environment</strong>
          </article>
        </div>

        <div className="notes-card">
          <h2>Entregable</h2>
          <ul>
            <li>Enlace al sandbox del template base.</li>
            <li>Captura final en <code>captura.png</code>.</li>
            <li>Texturas locales opcionales en <code>texturas/</code>.</li>
          </ul>
        </div>
      </section>

      <section className="viewer-panel">
        <div className="viewer-frame">
          <Scene />
        </div>
      </section>
    </main>
  );
}