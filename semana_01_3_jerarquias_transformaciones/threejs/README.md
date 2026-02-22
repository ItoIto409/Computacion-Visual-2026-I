# Jerarquías y Transformaciones 3D - Three.js

Este proyecto demuestra el uso de jerarquías y transformaciones en Three.js usando React Three Fiber.

## Características

- Jerarquía de 3 niveles de objetos 3D
- Transformaciones en tiempo real (traslación y rotación)
- Controles interactivos con Leva
- Visualización de ejes de coordenadas
- Grid de referencia
- Observación del comportamiento de transformaciones heredadas

## Estructura de la jerarquía

```
Parent (Cubo rojo)
  └── Child (Cilindro verde)
        └── Grandchild (Esfera azul)
```

Cada nivel hereda las transformaciones de su padre, demostrando cómo funcionan las transformaciones en un grafo de escena.

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

1. Usa los controles de la derecha para modificar las transformaciones de cada nivel
2. Observa cómo las transformaciones del padre afectan a los hijos
3. Experimenta con diferentes combinaciones de rotaciones y traslaciones
4. Usa el mouse para orbitar la cámara alrededor de la escena

## Tecnologías

- React 18
- Vite
- Three.js
- React Three Fiber
- @react-three/drei
- Leva (para controles UI)
