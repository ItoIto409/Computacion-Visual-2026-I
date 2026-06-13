# Ejercicio 2: Pirámide Escalonada 3D

**Estudiante:** Jerónimo Bermúdez Hernández

**Fecha de entrega:** 13 de junio de 2026

## Descripción

Escena 3D hecha con React Three Fiber para representar una pirámide escalonada construida con múltiples cajas y materiales PBR.

## Sandbox base

https://codesandbox.io/p/sandbox/threejs-basic-example-uvcc6

## Objetivos

- Construir una pirámide escalonada a partir de `Box`.
- Aplicar mapas PBR: diffuse, normal, roughness y metalness.
- Agregar iluminación de estudio para resaltar el relieve.
- Incluir `OrbitControls` para explorar la escena.

## Resultados

- [Captura de la escena](captura.png)

## Implementación local

La escena de referencia quedó preparada en `threejs/` para abrirse como proyecto Vite + React + React Three Fiber.

## Estructura

```text
ejercicio_2_piramide_3d/
├── README.md
├── captura.png
├── texturas/
└── threejs/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── styles/
            └── App.css
```

## Notas

- Si se usan texturas locales, colócalas dentro de `texturas/` y cambia las rutas en `threejs/src/App.jsx`.
- La captura final se guarda en `captura.png` dentro de esta carpeta.