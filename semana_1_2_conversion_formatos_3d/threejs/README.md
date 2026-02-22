# Visor de Modelos 3D con React Three Fiber

Este proyecto es un visor interactivo de modelos 3D que permite cargar y visualizar modelos en diferentes formatos (OBJ, STL, GLTF) utilizando Three.js y React Three Fiber.

## 🎯 Características

- ✅ Carga de modelos en tres formatos: OBJ, STL, y GLTF
- ✅ Alternancia entre modelos mediante botones
- ✅ OrbitControls para explorar modelos (rotar, zoom, pan)
- ✅ Información del modelo en pantalla (formato y número de vértices)
- ✅ Iluminación y entorno configurados
- ✅ Grid de referencia
- ✅ Interfaz de usuario intuitiva

## 🚀 Instalación

```bash
npm install
```

## 📦 Dependencias principales

- `three` - Librería 3D
- `@react-three/fiber` - Integración de Three.js con React
- `@react-three/drei` - Helpers y componentes útiles

## 📁 Estructura del proyecto

```
threejs/
├── src/
│   ├── App.jsx              # Componente principal con UI
│   ├── ModelViewer.jsx      # Selector de modelos
│   ├── ModelLoader.jsx      # Cargador de modelos 3D
│   ├── App.css              # Estilos
│   └── main.jsx             # Punto de entrada
└── public/
    └── models/              # Carpeta para tus modelos 3D
        ├── model.obj
        ├── model.stl
        └── model.gltf
```

## 🎮 Uso

1. **Agregar tus modelos:**
   - Coloca tus archivos de modelos en la carpeta `public/models/`
   - Nombra los archivos como: `model.obj`, `model.stl`, `model.gltf`

2. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

3. **Controles:**
   - **Rotar:** Click izquierdo + arrastrar
   - **Zoom:** Rueda del mouse
   - **Pan:** Click derecho + arrastrar (o Shift + click izquierdo)
   - **Cambiar modelo:** Usa los botones OBJ, STL, o GLTF

## 📊 Observar diferencias

El visor te permite comparar cómo se renderiza el mismo modelo en diferentes formatos:

- **OBJ:** Formato simple, soporta materiales con archivos .mtl
- **STL:** Usado en impresión 3D, solo geometría (sin materiales/texturas)
- **GLTF:** Formato moderno, soporta texturas, animaciones, y materiales PBR

### Diferencias en renderizado:

1. **Suavidad:** Los modelos pueden verse más o menos suaves dependiendo de las normales
2. **Materiales:** Solo GLTF y OBJ (con .mtl) conservan materiales
3. **Texturas:** GLTF puede incluir texturas embebidas
4. **Vértices:** La información muestra el número de vértices de cada modelo

## 🔧 Personalización

### Cambiar rutas de modelos

Edita el archivo `src/ModelViewer.jsx`:

```javascript
const models = {
  obj: {
    path: '/models/tu-modelo.obj',
    type: 'OBJ',
    name: 'Tu Modelo OBJ'
  },
  // ... otros modelos
};
```

### Ajustar la cámara

En `src/App.jsx`, modifica la propiedad `camera`:

```javascript
<Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
```

### Cambiar la iluminación

Modifica las luces en `src/App.jsx`:

```javascript
<ambientLight intensity={0.5} />
<directionalLight position={[10, 10, 5]} intensity={1} />
```

## 📝 Notas

- Si no hay modelos en la carpeta `public/models/`, se mostrarán geometrías de fallback
- Los archivos STL requieren que se les aplique un material por defecto
- Para modelos OBJ con materiales, asegúrate de incluir el archivo .mtl correspondiente
- Los modelos GLTF pueden estar en formato .gltf (JSON) o .glb (binario)

## 🛠️ Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## 📚 Recursos

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Components](https://github.com/pmndrs/drei)
