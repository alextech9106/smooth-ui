# MEMORY.md — Smooth UI (máx. ~50 líneas; stack, alias, tema, tsconfig de producción y release están en AGENTS.md)

## Estado actual

- Componentes: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
- Specs 001-005 `implemented`. 005 `sui-button-split` validada por @reviewer APPROVED el 2026-10-18 (16 FR y 4 NFR, 289
  tests, axe 0 en claro y oscuro). Falta el commit: `specs/005-sui-button-split/` nunca se ha confirmado en git y va en el
  mismo commit que el código (principio 2).
- `.md` en español (salvo AGENTS.md, CLAUDE.md, README.md y `.agents/`); código, comentarios y commits en inglés.

## Decisiones vigentes (y por qué)

- Propietario: mantener la API pública (falta lógica de negocio); nunca proponer quitar campos o inputs sin uso. Dudas
  de diseño: primero `docs/smoothui-interactivo.html` (fuera de git); su navegación ← → del grupo no entra en este ciclo.
- Botones: `disabled` nativo, `label` → `aria-label`, `trigger` como única activación; ARIA con `[aria-*]` (a `null`
  quita el atributo). Campos: `aria-describedby` + `aria-live`. Ningún botón se nombra por su icono.
- Grupo (004): `role="group"`, cada segmento su parada de Tab; nombre del segmento = `label` no en blanco, si no `name`;
  `selected` → `aria-pressed`. Reduced motion pone a cero `--sui-duration-*`; `--sui-focus-ring` opaco accent 300.
- Split (005): `arrowLabel`/`menuFallbackLabel` como inputs con "More options"/"Options" por defecto (compatibles);
  Flecha abajo/arriba en la flecha abre y enfoca primera/última y sin opciones no abre (WAI-ARIA, no anunciar un menú
  vacío); opciones con `tabindex="-1"` y foco itinerante; Mayús+Tab con `preventDefault` + foco a la flecha por código.
- Split (005): `menuOpen` = `linkedSignal` sobre `hasItems` (cierra sin un effect que escriba estado); el foco de FR-15
  en un `effect()` de componente, que corre con el menú aún en el DOM; `inject(DOCUMENT)` en vez de globales (principio 3).
- Fuera del ciclo 005: disabled/danger/atajo/encabezado en opciones; ancho 210 px y hueco 6 px se mantienen.

## Trampas

- Vitest: `--include` debe apuntar a `*.spec.ts` (con `**/sui-button-split/**` falla por "No loader is configured for
  .html") y en zsh va entre comillas. Ejecución real: `--skip-nx-cache`.
- `setInput()` de un input inexistente lanza NG0303: ese rojo no prueba el comportamiento; confirmarlo con una mutación
  temporal del valor esperado. Con varias aserciones, la mutación solo prueba la primera que falla.
- `host` con `keydown.arrowdown` tipa `$event` como `Event`, no `KeyboardEvent` (TS2345).
- `hasItems` debe declararse antes de `menuOpen` (el `linkedSignal` lo lee al inicializar el campo).
- `effect()` en el `constructor()`: guardarlo en un campo private sin leer da TS6138 (`noUnusedLocals`).
- ESLint `member-ordering`: private → public → protected; métodos private tras el `constructor()`, `_` en los privados.
- jsdom: Enter/Espacio no generan clic; sin navegación con Tab (un test de Tab solo comprueba cierre y que no hay
  `preventDefault`); mantiene el foco en un botón deshabilitado. NG8008 solo aparece en la build, no en typecheck.
- `sui-button-group` pinta sus clases en el `div` interno, no en el host; `track button.label ?? button.name`.
- Prettier: no partir código en línea entre dos líneas; colapsa dobles espacios y une líneas que empiezan por `27)`. Un
  archivo: `pnpm nx format:write --files=<ruta>`; nunca `pnpm-lock.yaml`.
- Chrome DevTools MCP: `emulate` para viewport < 500 px (recarga la página: se pierde el `data-theme` puesto a mano);
  esperar a los bloques diferidos antes de medir; axe 4.10.2 desde cdnjs; capturas solo en `tmp/`.

## Pendientes

- Anillo de foco heredado de la spec 004 con contraste bajo: claro 1,92:1 con la página; oscuro 1,42:1 con primary.
- Tema oscuro: `--sui-color-bg-subtle`, `--sui-color-border-subtle` y `--sui-color-bg-surface-raised` valen #232935, así
  que hover, borde y separador del menú no se distinguen.
- Comprobación manual del split con lector de pantalla.
- Tab desde el segmento principal con el menú abierto deja el menú abierto (seguimiento en otra spec).
- `menuItems` mutado in situ no dispara FR-15 (los signals comparan la referencia; uso incorrecto del consumidor).
- Aviso de presupuesto: `sui-button.component.scss` pesa 4,35 kB (> 4 kB).
- Demo: desbordamiento a 375 px por la cabecera (`sui-theme-toggle`).

## Nota de release (desde 0.5.0)

- Incompatibles: `primary`/`danger` del claro más oscuros; `MenuItem.id` y `name` del split obligatorios; `sui-error`
  sin `inputId`; `iconSize` eliminado; `--sui-focus-ring` opaco; segmentos `icon` nombrados por `label` o `name`.
- Nuevo: `label` en `sui-button-group`; `pressed` en botones; split con `arrowLabel`, `menuFallbackLabel` y teclado.
