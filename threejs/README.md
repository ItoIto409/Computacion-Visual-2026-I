# 🎨 Visualizador 3D - React Three Fiber

Aplicación interactiva para visualizar modelos 3D con diferentes modos de renderizado (caras, aristas, vértices, wireframe) construida con Vite, React y React Three Fiber.

## ✨ Características

- 🔷 **Visualización de Caras**: Renderizado sólido del modelo con materiales realistas
- 📐 **Visualización de Aristas**: Destaca las aristas del modelo con líneas verdes
- ⚫ **Visualización de Vértices**: Muestra todos los vértices como puntos individuales
- 🕸️ **Modo Wireframe**: Vista de malla de alambre completa
- 📊 **Información del Modelo**: Muestra número de vértices, caras y aristas
- 🎮 **Controles Interactivos**: OrbitControls para rotar, hacer zoom y mover la cámara
- 🌐 **Soporte Múltiples Formatos**: Compatible con GLTF/GLB, OBJ y STL

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd vite-r3f-app
```

2. Instala las dependencias:
```bash
npm install
```

### Ejecutar la Aplicación

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Compilar para Producción

```bash
npm run build
```

El build optimizado se generará en el directorio `dist/`.

## 🎮 Uso

### Controles de Cámara

- **Rotar**: Click izquierdo + arrastrar
- **Zoom**: Rueda del ratón
- **Pan (mover)**: Click derecho + arrastrar

### Modos de Visualización

Usa el panel de control lateral para cambiar entre:

1. **Caras** - Vista sólida del modelo con materiales y luces
2. **Aristas** - Solo los bordes del modelo resaltados
3. **Vértices** - Todos los puntos del modelo visibles
4. **Wireframe** - Malla de alambre completa

## 📁 Estructura del Proyecto

```
vite-r3f-app/
├── src/
│   ├── main.tsx              # Punto de entrada
│   ├── App.tsx               # Componente principal
│   ├── components/
│   │   ├── Scene.tsx         # Configuración de la escena 3D
│   │   ├── ModelViewer.tsx   # Cargador de modelos 3D externos
│   │   ├── SimpleModel.tsx   # Modelo de ejemplo integrado
│   │   └── ControlPanel.tsx  # Panel de controles UI
│   └── styles/
│       └── App.css           # Estilos globales
├── public/
│   └── models/               # Carpeta para tus modelos 3D
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Cargar tus Propios Modelos

### Opción 1: Modelo Integrado (Por defecto)

El proyecto viene con un modelo de ejemplo (dodecaedro) generado en código. Está activado por defecto.

### Opción 2: Cargar Modelo Externo

1. Coloca tu modelo 3D en la carpeta `public/models/`
2. En `src/App.tsx`, modifica:

```typescript
const useSimpleModel = false; // Cambiar a false
const modelPath = '/models/tu-modelo.glb'; // Ruta a tu modelo
const modelType: 'gltf' | 'obj' | 'stl' = 'gltf'; // Tipo de archivo
```

### Formatos Soportados

- **GLTF/GLB** (recomendado) - `.gltf`, `.glb`
- **OBJ** - `.obj`
- **STL** - `.stl`

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Three.js** - Motor 3D
- **@react-three/fiber** - React renderer para Three.js
- **@react-three/drei** - Utilidades y helpers para R3F

## 📦 Dependencias Principales

```json
{
  "@react-three/fiber": "^8.15.12",
  "@react-three/drei": "^9.92.7",
  "three": "^0.160.0",
  "react": "^18.2.0"
}
```

## 🎨 Personalización

### Cambiar Colores

En `src/components/SimpleModel.tsx` o `ModelViewer.tsx`, modifica los colores:

```typescript
// Caras
<meshStandardMaterial color="#4a90e2" />

// Aristas
<Edges color="#00ff00" />

// Vértices
<pointsMaterial color="#ff00ff" />
```

### Ajustar Iluminación

En `src/components/Scene.tsx`:

```typescript
<ambientLight intensity={0.5} />
<directionalLight position={[10, 10, 5]} intensity={1} />
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.