import './style.css';
import * as THREE from 'three';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <section class="panel">
      <p class="eyebrow">Ejercicio 2</p>
      <h1>Laboratorio futurista orbital</h1>
      <p class="description">Escena 3D interactiva con jerarquía de objetos, animaciones, materiales PBR simulados, iluminación temática y controles por teclado.</p>

      <div class="controls">
        <button id="toggleDrone">Alternar dron</button>
        <button id="toggleOrbit">Pausa órbita</button>
        <button id="resetCamera">Reset cámara</button>
      </div>

      <div class="status">
        <div><span>Cámara</span><strong>Mouse + rueda</strong></div>
        <div><span>Teclado</span><strong>WASD / flechas</strong></div>
        <div><span>Interacción</span><strong>Botones + teclado</strong></div>
        <div><span>Temática</span><strong>Entorno futurista</strong></div>
      </div>

      <ul class="notes">
        <li>Jerarquía principal: base, brazo, dron y núcleo.</li>
        <li>Animaciones: órbita, flotación, pulsos y apertura.</li>
        <li>Interacción: mover la cámara y alternar el dron.</li>
      </ul>
    </section>

    <section class="viewport">
      <canvas id="scene"></canvas>
      <div class="overlay">Scene ready</div>
    </section>
  </main>
`;

const canvas = document.querySelector('#scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050816);
scene.fog = new THREE.Fog(0x050816, 12, 40);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(10, 8, 14);

const hemi = new THREE.HemisphereLight(0x8fd3ff, 0x0b1020, 0.75);
scene.add(hemi);

const keyLight = new THREE.DirectionalLight(0x7ec8ff, 2.2);
keyLight.position.set(8, 14, 6);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xff7cff, 0.9);
rimLight.position.set(-8, 5, -6);
scene.add(rimLight);

const pointLight = new THREE.PointLight(0x57f6ff, 20, 30, 2);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(16, 64),
  new THREE.MeshStandardMaterial({ color: 0x09111f, roughness: 0.9, metalness: 0.08 })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(28, 28, 0x2cf4ff, 0x123044);
grid.position.y = 0.01;
scene.add(grid);

const labGroup = new THREE.Group();
labGroup.position.set(0, 0.5, 0);
scene.add(labGroup);

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(3.5, 4.2, 0.8, 8),
  new THREE.MeshStandardMaterial({ color: 0x1f2f4c, roughness: 0.35, metalness: 0.75 })
);
base.castShadow = true;
base.receiveShadow = true;
labGroup.add(base);

const pillar = new THREE.Mesh(
  new THREE.CylinderGeometry(0.55, 0.75, 5.5, 12),
  new THREE.MeshStandardMaterial({ color: 0x5ce1ff, roughness: 0.28, metalness: 0.9, emissive: 0x0b1c2a, emissiveIntensity: 0.8 })
);
pillar.position.y = 3.0;
pillar.castShadow = true;
labGroup.add(pillar);

const armGroup = new THREE.Group();
armGroup.position.y = 5.0;
pillar.add(armGroup);

const arm = new THREE.Mesh(
  new THREE.BoxGeometry(4.5, 0.35, 0.35),
  new THREE.MeshStandardMaterial({ color: 0xa6f7ff, roughness: 0.22, metalness: 0.95, emissive: 0x112233, emissiveIntensity: 0.5 })
);
arm.position.x = 2.2;
arm.castShadow = true;
armGroup.add(arm);

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.7, 0),
  new THREE.MeshStandardMaterial({ color: 0xff7cff, roughness: 0.15, metalness: 0.7, emissive: 0x441144, emissiveIntensity: 0.9 })
);
core.position.x = 4.8;
core.castShadow = true;
armGroup.add(core);

const droneGroup = new THREE.Group();
droneGroup.position.set(0, 4.2, 0);
scene.add(droneGroup);

const droneBody = new THREE.Mesh(
  new THREE.OctahedronGeometry(1.1, 0),
  new THREE.MeshStandardMaterial({ color: 0x8fd3ff, roughness: 0.2, metalness: 0.92, emissive: 0x0c1e30, emissiveIntensity: 0.8 })
);
droneBody.castShadow = true;
droneGroup.add(droneBody);

const droneRing = new THREE.Mesh(
  new THREE.TorusGeometry(1.8, 0.16, 12, 32),
  new THREE.MeshStandardMaterial({ color: 0x47f0ff, roughness: 0.2, metalness: 0.95, emissive: 0x103850, emissiveIntensity: 0.4 })
);
droneRing.rotation.x = Math.PI / 2;
droneRing.castShadow = true;
droneGroup.add(droneRing);

const leftWing = new THREE.Mesh(
  new THREE.BoxGeometry(0.28, 1.4, 0.8),
  new THREE.MeshStandardMaterial({ color: 0x25354f, roughness: 0.5, metalness: 0.75 })
);
leftWing.position.set(-1.4, 0, 0);
leftWing.castShadow = true;
droneGroup.add(leftWing);

const rightWing = leftWing.clone();
rightWing.position.x = 1.4;
droneGroup.add(rightWing);

const orbitAnchor = new THREE.Group();
orbitAnchor.position.set(0, 2.3, 0);
labGroup.add(orbitAnchor);

const satellite = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0x87ffda, roughness: 0.1, metalness: 0.4, emissive: 0x0a332d, emissiveIntensity: 1.0 })
);
satellite.position.set(2.2, 0, 0);
satellite.castShadow = true;
orbitAnchor.add(satellite);

const orbitalRail = new THREE.Mesh(
  new THREE.TorusGeometry(2.2, 0.05, 8, 64),
  new THREE.MeshStandardMaterial({ color: 0x24455f, roughness: 0.55, metalness: 0.7 })
);
orbitalRail.rotation.x = Math.PI / 2;
orbitalRail.position.y = 2.3;
scene.add(orbitalRail);

const keyState = { w: false, a: false, s: false, d: false, up: false, down: false, left: false, right: false };
let autoOrbit = true;
let droneEnabled = true;
let cameraAngle = 0;

const initialCamera = camera.position.clone();
const initialTarget = new THREE.Vector3(0, 3, 0);
const cameraTarget = initialTarget.clone();

function updateRendererSize() {
  const { clientWidth, clientHeight } = canvas.parentElement;
  renderer.setSize(clientWidth, clientHeight, false);
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
}

function handleKey(event, pressed) {
  const key = event.key.toLowerCase();
  if (key in keyState) {
    keyState[key] = pressed;
  }
}

window.addEventListener('keydown', (event) => handleKey(event, true));
window.addEventListener('keyup', (event) => handleKey(event, false));

canvas.parentElement.addEventListener('pointermove', (event) => {
  if (event.buttons === 1) {
    cameraAngle += event.movementX * 0.003;
  }
});

canvas.parentElement.addEventListener('wheel', (event) => {
  event.preventDefault();
  camera.position.y = THREE.MathUtils.clamp(camera.position.y - event.deltaY * 0.003, 4, 18);
}, { passive: false });

const toggleDrone = document.querySelector('#toggleDrone');
const toggleOrbit = document.querySelector('#toggleOrbit');
const resetCamera = document.querySelector('#resetCamera');

toggleDrone.addEventListener('click', () => {
  droneEnabled = !droneEnabled;
});

toggleOrbit.addEventListener('click', () => {
  autoOrbit = !autoOrbit;
});

resetCamera.addEventListener('click', () => {
  camera.position.copy(initialCamera);
  cameraTarget.copy(initialTarget);
  cameraAngle = 0;
});

function animate(time) {
  const elapsed = time * 0.001;

  if (autoOrbit) {
    cameraAngle += 0.0015;
  }

  if (keyState.w || keyState.up) cameraTarget.z -= 0.08;
  if (keyState.s || keyState.down) cameraTarget.z += 0.08;
  if (keyState.a || keyState.left) cameraTarget.x -= 0.08;
  if (keyState.d || keyState.right) cameraTarget.x += 0.08;

  camera.position.x = cameraTarget.x + Math.sin(cameraAngle) * 14;
  camera.position.z = cameraTarget.z + Math.cos(cameraAngle) * 14;
  camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);

  labGroup.rotation.y = elapsed * 0.15;
  pillar.rotation.y = Math.sin(elapsed * 0.6) * 0.08;
  armGroup.rotation.z = Math.sin(elapsed * 1.4) * 0.25;
  core.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.05);

  if (droneEnabled) {
    droneGroup.position.y = 4.2 + Math.sin(elapsed * 2) * 0.3;
    droneGroup.rotation.y = elapsed * 1.2;
    droneBody.rotation.x = Math.sin(elapsed * 1.5) * 0.2;
    droneRing.rotation.z = elapsed * 1.8;
    satellite.position.x = 2.2 * Math.cos(elapsed * 2.1);
    satellite.position.z = 2.2 * Math.sin(elapsed * 2.1);
  }

  orbitalRail.rotation.z = elapsed * 0.2;
  pointLight.intensity = 16 + Math.sin(elapsed * 3) * 4;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.addEventListener('resize', updateRendererSize);
updateRendererSize();
requestAnimationFrame(animate);

