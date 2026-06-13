# Ejercicio 2: Escena 3D Interactiva Temática

**Estudiante:** Jerónimo Bermúdez Hernández

**Fecha de entrega:** 13 de junio de 2026

## Descripción general

Se construyó una escena 3D temática de tipo futurista usando Three.js. La propuesta representa un laboratorio orbital con una base tecnológica, un brazo mecánico, un dron autónomo y un núcleo energético. La escena integra jerarquía de objetos, transformaciones, materiales PBR simulados, iluminación coherente, animaciones continuas e interacción del usuario mediante mouse, teclado y botones.

## Tema seleccionado

**Entorno futurista**

La elección permite mostrar elementos claramente jerárquicos y animables, como un dron, un brazo robótico y un núcleo brillante, con una estética de laboratorio avanzado.

## Requerimientos cubiertos

- Escena 3D completa basada en un tema futurista.
- Jerarquía de objetos 3D con grupos y subcomponentes.
- Transformaciones de traslación, rotación y escala.
- Cámara interactiva con mouse, rueda y teclado.
- Materiales con acabado tipo PBR usando `MeshStandardMaterial`.
- Iluminación ambiente, direccional, puntual y de rebote.
- Animaciones en la estación, el brazo, el núcleo y el dron.
- Interacción entre elementos dentro de la escena mediante órbita y pulsos.
- Interacción del usuario con botones y teclado.

## Dependencias

- Node.js 18 o superior
- Three.js
- Vite
- gif-encoder-2
- pngjs

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

La aplicación se abrirá en el navegador con Vite.

## Estructura del repositorio

```text
ejercicio_2_escena_3d_interactiva/
├── README.md
├── index.html
├── package.json
├── vite.config.js
├── media/
│   ├── captura_1.png
│   ├── captura_2.png
│   └── demo.gif
├── scripts/
│   └── make-gif.mjs
└── src/
    ├── main.js
    └── style.css
```

## Evidencias

- [Captura 1](media/captura_1.png)
- [Captura 2](media/captura_2.png)
- [Demo GIF](media/demo.gif)

## Análisis técnico

- La jerarquía principal se organiza con `Group` para que la base, el brazo y el dron compartan transformaciones de manera controlada.
- Se usaron materiales `MeshStandardMaterial` con valores altos de metalness y roughness bajos para simular un acabado técnico y brillante.
- La cámara es orbital e interactiva: el usuario puede moverla con mouse, rueda y teclado.
- Las animaciones se implementan en el bucle principal para que el laboratorio tenga movimiento continuo y coherente.
- La interacción con botones permite alternar el dron flotante, pausar la órbita automática y reiniciar la cámara.
- La escena está pensada para generar un GIF o video corto donde se vea la cámara, la animación y la interacción.

## Uso de IA

No se utilizó IA generativa para decidir el tema ni para construir la lógica principal de la escena. La implementación se resolvió con Three.js y código manual para cumplir los requisitos de jerarquía, animación e interacción.
