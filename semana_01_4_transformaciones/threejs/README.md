# Transformaciones Animadas 3D - Three.js

Este proyecto demuestra el uso de transformaciones animadas en Three.js usando React Three Fiber y el hook `useFrame`.

## Características

- **Traslación animada**: Trayectorias circular y senoidal
- **Rotación continua**: Giro sobre múltiples ejes
- **Escala dinámica**: Pulso suave usando funciones temporales
- **OrbitControls**: Navegación interactiva de la escena
- **Iluminación avanzada**: Luces direccionales y puntuales con colores

## Objetos Animados

### Cubo (Azul)
- **Traslación**: Movimiento circular en el plano XZ
- **Rotación**: Giro continuo en los tres ejes (X, Y, Z)
- **Escala**: Pulso suave con `Math.sin(time)`

### Esfera (Rosa)
- **Traslación**: Movimiento vertical senoidal
- **Rotación**: Giro sobre el eje Y con inclinación suave
- **Escala**: Pulso sincronizado con el movimiento vertical

## Conceptos Demostrados

### 1. useFrame Hook
El hook `useFrame` se ejecuta en cada frame de renderizado (normalmente 60 fps) y proporciona:
- `clock`: Objeto con tiempo transcurrido
- Acceso al estado de la escena

```jsx
useFrame(({ clock }) => {
  const time = clock.getElapsedTime()
  // Aplicar transformaciones basadas en time
})
```

### 2. Trayectoria Circular
```javascript
x = radius * Math.cos(angularSpeed * time)
z = radius * Math.sin(angularSpeed * time)
```

### 3. Trayectoria Senoidal
```javascript
y = amplitude * Math.sin(frequency * time + phase)
```

### 4. Transformaciones en Three.js
- **position**: `mesh.position.set(x, y, z)`
- **rotation**: `mesh.rotation.x += delta`
- **scale**: `mesh.scale.setScalar(value)`

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El proyecto se abrirá en `http://localhost:5173`

## Uso

1. La animación se ejecuta automáticamente
2. Usa el mouse para orbitar la cámara:
   - **Clic izquierdo + arrastrar**: Rotar vista
   - **Rueda del mouse**: Zoom in/out
   - **Clic derecho + arrastrar**: Pan (mover cámara)

## Tecnologías

- React 18
- Vite
- Three.js
- React Three Fiber
- @react-three/drei

## Estructura del Código

```
src/
├── App.jsx                      # Componente principal con Canvas
├── components/
│   ├── AnimatedCube.jsx        # Cubo con trayectoria circular
│   └── AnimatedSphere.jsx      # Esfera con trayectoria senoidal
├── App.css                      # Estilos
├── index.css                    # Estilos globales
└── main.jsx                     # Punto de entrada
```

## Ecuaciones Matemáticas Usadas

### Movimiento Circular
Para un círculo de radio `r` con velocidad angular `ω`:
- `x(t) = r·cos(ωt)`
- `z(t) = r·sin(ωt)`

### Movimiento Armónico Simple (Senoidal)
- `y(t) = A·sin(ωt + φ)`
  - `A`: Amplitud
  - `ω`: Frecuencia angular
  - `φ`: Fase inicial

### Escala Pulsante
- `scale(t) = base + amplitude·sin(frequency·t)`

## Extensiones Posibles

- Agregar más objetos con diferentes trayectorias (lemniscata, espiral, etc.)
- Implementar interpolación entre trayectorias
- Agregar controles UI para modificar parámetros en tiempo real
- Implementar trazado de la trayectoria (trail effect)
- Agregar partículas que sigan los objetos
