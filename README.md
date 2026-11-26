# MACRO-CLASH: Camino al Olimpo del Gym

Videojuego serio (*serious game*) web, 2D / pixel-art, sobre educación nutricional y hábitos saludables. Combina simulación diaria de macronutrientes, minijuegos de entrenamiento, dilemas contra mitos y una batalla final por turnos.

> **Aviso:** Este proyecto tiene fines educativos y de simulación; no sustituye la orientación de un profesional de la salud o la nutrición.

## Problemática, necesidad y público objetivo
- **Ámbito:** salud y educación preventiva en nutrición deportiva y hábitos diarios.
- **Problemática:** muchos principiantes en el gimnasio caen en desinformación: dietas extremas sin carbohidratos, exceso de ultraprocesados, falta de descanso o productos "milagro".
- **Necesidad:** que estudiantes y jóvenes o adultos principiantes comprendan de forma práctica cómo influyen los macronutrientes (proteínas, carbohidratos, grasas y calorías totales), el descanso, la constancia y las decisiones cotidianas en su rendimiento y su salud metabólica.
- **Público objetivo:** estudiantes y personas que inician en el gimnasio y quieren entender, de forma visual e interactiva, cómo se relacionan alimentación, hábitos y rendimiento.

## Concepto y dinámica
Estética pixel-art sobre fondo carbón con acentos cian y morado. El jugador personaliza a su atleta, elige una meta y recorre **14 días** de preparación para vencer a **Braulio "El Ciclado" Broscience** en la batalla del **Día 15**.

### Ciclo diario
1. **Objetivo y personalización:** *Ganancia muscular*, *Recomposición corporal* o *Resistencia atlética*. El atleta se personaliza (piel, cabello, peinado, ropa, lentes, barba, tenis, etc.) y evoluciona visualmente según mejoran sus estadísticas (Novato → Constante → Atleta → Olímpico).
2. **La cocina:** arma hasta 4 platos (12 alimentos disponibles cada día, de un catálogo de 48) acercando las barras de kcal, proteína, carbohidratos y grasas a la franja verde. Los ultraprocesados tienen consecuencias.
3. **El gimnasio:** minijuegos de precisión y ritmo cuya zona de acierto depende de la calidad de tu dieta:
   - Fuerza: *Press de banca* y *Curl con mancuernas*.
   - Cardio: *Cuerda al ritmo* y *Sprint en banda*.
   - Recuperación: *Movilidad y core* y *Descanso activo*.
   - Las rachas de aciertos multiplican la ganancia.
4. **Dilemas diarios:** 8 por partida, elegidos de un banco de 15 (influencers, ventana anabólica, creatina, detox, sueño, anabólicos, ayuno, etc.), con retroalimentación que explica por qué es mito o evidencia.
5. **Batalla final (Día 15):** combate por turnos con 4 habilidades ligadas a tus estadísticas. El *Golpe de Glucógeno* solo se desbloquea con 8 días de buenos carbohidratos.
6. **Resumen:** puntaje de hábitos, mapa de calor de los 14 días, consejos personalizados y exportación (copiar texto, copiar JSON o descargar `.json`).

### Estadísticas
Fuerza, Resistencia, Recuperación, Energía y Salud metabólica.

### Reglas clave
- Carbohidratos < 35 % de la meta → glucógeno bajo: ganancias a la mitad.
- Proteína < 70 % → catabolismo: ese día no sube la Fuerza.
- Kcal dentro de ±15 % → +25 % de ganancias. Más de 130 % de kcal o 2+ ultraprocesados → pesadez (cardio a la mitad).
- Energía < 35 → −30 % de ganancias; descansar la recupera.

### Controles
`Espacio` / `Enter` / clic o toque: entrenar · `1`-`6`: opciones, ejercicios y habilidades · `M`: sonido · `G`: guía de mecánicas · `Esc`: cerrar guía o saltar la historia.

## Historia, personajes e inspiración
- **Historia:** el protagonista da sus primeros pasos en el gimnasio, es humillado por Braulio y decide prepararse durante 14 días, equilibrando dieta, entrenamiento y hábitos, para enfrentarlo en una competencia fitness.
- **Personajes:** el protagonista personalizable, Braulio "El Ciclado" Broscience (el rival del combate final) y el elenco del gimnasio, todos con arte pixelado original generado por código.
- **Inspiración:** la cultura de entrenamiento en gimnasio, los juegos retro tipo arcade/RPG de progresión y la necesidad de traducir nutrición deportiva y hábitos saludables a una experiencia interactiva.

## Estructura del proyecto
Sitio 100 % estático (HTML5, CSS3 y JavaScript vanilla, sin dependencias de compilación).

```
index.html              Estructura, contenido y enlaces a css/ y js/
css/styles.css          Estilos, variables carbón/neón, layout y responsive
js/confetti-loader.js   Cargador de confeti (vendor/ → CDN → respaldo propio)
js/utils.js             Utilidades, store (localStorage seguro), temporizadores
js/data.js              Catálogos: metas, alimentos, eventos, habilidades, fuentes
js/state.js             Estado y claves de guardado
js/audio.js             Audio procedural (Web Audio, sin archivos)
js/fx.js                Partículas, textos flotantes, sacudida, confeti
js/sprites.js           Sprites pixel-art procedurales
js/scenes.js            Escenarios (gimnasio, ring), elenco y globos de diálogo
js/ui.js                Interfaz, menú, personalización, historia y objetivos
js/game.js              Cocina, gimnasio, batalla final y resumen
js/render.js            Dibujo de cada escena en <canvas>
js/export.js            Guía modal y exportación del resumen
js/main.js              Bucle principal, controles y arranque (se carga al final)
```

Los scripts son clásicos (no módulos ES) y comparten ámbito global, por lo que **el orden de las etiquetas `<script>` en `index.html` es importante**.

## Persistencia
Se usa `localStorage` con estas claves:
- `macroclash_save_v1`: partida (se guarda al inicio de cada día y al llegar a la batalla).
- `macroclash_look_v1`: apariencia del atleta.
- `macroclash_mute_v1`: preferencia de sonido.

El almacenamiento es por origen: la partida de Live Server (`127.0.0.1`) y la de GitHub Pages son independientes.

## Ejecución local y despliegue
- **Local (recomendado):** sirve la carpeta por HTTP, por ejemplo con la extensión *Live Server* de VS Code o `python -m http.server`, y abre `http://localhost:<puerto>/`.
- **Web:** publicado con **GitHub Pages** (las rutas son relativas, por lo que funciona también en subcarpetas del repositorio).
- **Dependencias opcionales:** Bootstrap Icons y Google Fonts (CDN) y `canvas-confetti`. Si no cargan, el juego funciona igual con iconos emoji, tipografías de respaldo y un confeti propio.

## Proceso con IA e iteraciones
El juego se desarrolló mediante iteraciones con inteligencia artificial a partir de un prototipo inicial, con pruebas continuas y refinamientos visuales y funcionales:
- paleta carbón/neón y Bootstrap Icons;
- textos más grandes y controles más cómodos en móvil;
- más alimentos, ejercicios y opciones de personalización;
- guía de mecánicas dentro del juego;
- exportación del resumen y persistencia en `localStorage`;
- modularización de `index.html` en `css/` y `js/`.

Las versiones, los problemas técnicos o de diseño detectados y su solución mediante lenguaje natural con la IA se documentan en el reporte del proyecto (PDF) y en el historial de commits.

## Referencias educativas
Las referencias generales que cita el juego (para personas adultas sanas y activas):
- [ISSN: proteína y ejercicio (2017)](https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0177-8)
- [ISSN: creatina (2017)](https://jissn.biomedcentral.com/articles/10.1186/s12970-017-0173-z)
- [ACSM/AND: nutrición y rendimiento (2016)](https://pubmed.ncbi.nlm.nih.gov/26917108/)

## Equipo y control de versiones
Proyecto desarrollado en equipo para el curso de *Videojuego serio*. El historial de versiones, ramas y *pull requests* documenta las iteraciones técnicas y de diseño realizadas con apoyo de inteligencia artificial.

- Christopher Daniel Ladrón de Guevara Mace
- Christopher Etienne Torres Gudiño
- Angel Alejandro Reynoso Delgado
- Jorge Moreno Ramírez
- Diego Oswaldo Vargas Piceno
- Kenneth Abraham Murillo Corona