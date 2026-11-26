# Estructura del Proyecto

## 1. Stack tecnológico
- **Web estática:** HTML5, CSS3 y JavaScript vanilla mediante scripts clásicos, sin necesidad de compilación o servidor *backend*, compatible con Live Server y GitHub Pages.
- **Gráficos e interfaz:** `<canvas>` de `640x360` para escenas y personajes pixel-art, variables CSS con estética carbón y acentos cian/morado, diseño responsivo para escritorio y móvil, e íconos de Bootstrap Icons con respaldos ante fallos de red.
- **Persistencia local:** Uso de `localStorage` en el navegador (`macroclash_save_v1`, `macroclash_look_v1` y `macroclash_mute_v1`) para guardar partida, apariencia y configuración sin base de datos externa.

## 2. Organización de carpetas y archivos
```text
Macro-Clash-Tecnologias/
├── index.html              # Estructura base de la aplicación, canvas, modales y carga de scripts
├── css/
│   └── styles.css          # Variables carbón/neón, diseño responsivo y estilos de interfaz
├── js/
│   ├── confetti-loader.js  # Carga de confeti con respaldo local/CDN/canvas
│   ├── utils.js            # Funciones auxiliares y manejo de temporizadores
│   ├── data.js             # Catálogos de metas, alimentos, ejercicios, eventos y habilidades
│   ├── state.js            # Estado global de partida y persistencia en localStorage
│   ├── audio.js            # Audio procedural y control de silencio
│   ├── fx.js               # Efectos visuales, partículas, textos flotantes y confeti
│   ├── sprites.js          # Dibujo de sprites pixel-art y personalización del personaje
│   ├── scenes.js           # Escenarios del gimnasio, ring y elementos visuales
│   ├── ui.js               # Interfaz, menús, personalización y flujo narrativo
│   ├── game.js             # Mecánicas de cocina, minijuegos, ciclo diario, batalla y resumen
│   ├── render.js           # Dibujo de cada escena en el canvas
│   ├── export.js           # Modal de guía/mecánicas y exportación/copiado de resumen
│   └── main.js             # Bucle principal, controles, eventos y arranque del juego
├── docs/
│   ├── descripcion-del-proyecto.md
│   ├── estructura-del-proyecto.md
│   └── como-jugar.md
├── LICENSE
└── README.md