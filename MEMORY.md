# MEMORY.md — Smooth UI (máx. ~50 líneas; stack, alias, tema, tsconfig de producción y release están en AGENTS.md)

## Estado actual

- Componentes: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
  ESLint: orden de miembros private → public → protected, `_` en los privados. Skills/agentes en `.claude/`, MCP en `.mcp.json`.
- 001 validada; 002 implementada el 10-16; 003, 004 y las enmiendas de FR-7 (`pressed`) de 002/003 implementadas el 10-17;
  todas con @reviewer APPROVED (004: 2026-10-17, 232 tests en verde con `--skip-nx-cache`, ejecución real ~4 s; axe en
  tema oscuro 0 sobre 25 nodos de grupo/split; comprobación manual del propietario con lector de pantalla y Espacio
  mantenido, correcta). Ciclo 004 cerrado.
- Seguimientos del reviewer (no bloquean): en el spec del grupo, los tests "does nothing for an entry without a callback"
  y de ArrowRight aportan poco; `pressed` false/ausente y las medidas del anillo dependen de T9 y de la comprobación manual.
- Cambios propios del usuario, fuera de las tareas: `(trigger)` en el submit reactivo de la demo, `name` del split
  obligatorio, spinner sin `color`.
- Pendiente: scss de `sui-button` 4.35 kB (> 4 kB); NG0505 al cargar en dev; desbordamiento a 375 px (444 px); servidor
  de dev en 4200.
- 2026-10-17: los `.md` (salvo AGENTS.md, CLAUDE.md, README.md y `.agents/`) traducidos al español; principio 6 de la
  constitución modificado con aprobación del propietario: código y commits en inglés, documentación `.md` en español.

## Decisiones (y por qué)

- Pautas del propietario: mantener la API pública (aún falta lógica de negocio); nunca proponer quitar campos o inputs
  ni llamarlos sin uso, ignorados o muertos; solo arreglar lógica que pueda dar problemas reales. Resolver dudas primero
  con el diseño de `docs/smoothui-interactivo.html` (ignorado en git); su navegación ← → del grupo NO se quiere en este ciclo.
- 004: `role="group"`, cada segmento es su propia parada de Tab, el Tab del split no cambia; `label` del grupo =
  `aria-label` si no está en blanco (el split no lo pasa); nombre del segmento = `label` no en blanco tal cual, si no
  `name`; `selected` dado → `aria-pressed` true/false, ausente → ninguno; `selected`+`expanded` anuncian los dos;
  `expanded` en icono no se anuncia.
- Los botones enlazan `disabled` nativo y toman `label` para `aria-label`; los campos usan `aria-describedby` + un
  contenedor `aria-live`; ARIA se enlaza como `[aria-*]`, no `[attr.aria-*]` (desviarse necesita al usuario).
  `trigger` es la única activación.
- `sui-button-split` emite `trigger` e `itemSelected`; `MenuItem` son datos simples con `id` obligatorio (sin callbacks).
- Reduced motion pone a cero los tokens `--sui-duration-*`, no una regla global `*`, para que las apps consumidoras
  mantengan sus animaciones.
- 002 FR-5: `label().trim() ? label() : name()`. 003: nombre = `label` no en blanco sin recortar, si no `null`, nunca el
  icono. `primary`/`danger` del tema claro un paso más oscuros (propietario). D2 (usuario): `--sui-focus-ring` opaco
  accent 300; en claro < 3:1, aceptado.

## Aprendizajes y trampas que evitar

- Contrastar los informes del implementer con el archivo; el propietario o el implementer repiten format:check +
  run-many (el planner no puede ejecutar Prettier, el reviewer solo `smooth-ui:test`). `smooth-ui:test` puede salir de
  la caché de Nx: usar `--skip-nx-cache` para una ejecución real.
- jsdom: Enter/Space no generan click, mantiene el foco en un botón que pasa a deshabilitado (Chrome lo pasa a
  `body`); NG0950 salta en `detectChanges()`. `smooth-ui-demo:typecheck` (`tsc` plano) no revisa plantillas: NG8008
  solo aparece en la build.
- `expect(() => el.click()).not.toThrow()` no prueba nada: los errores de los listeners no llegan a quien llama a `click()`.
- DevTools MCP: no hace clic en elementos deshabilitados ni mantiene `:active` (el propietario comprueba el pulsado a
  mano). axe 4.10.2 desde cdnjs, nunca como paquete; no mide el contraste del anillo. Esperar a los bloques diferidos;
  leer `box-shadow` ~500 ms después del foco; tras un clic de ratón, pulsar antes un Tab real. Su árbol solo muestra
  `pressed` true; capturas solo en `tmp/` (ignorado en git).
- Prettier colapsa los dobles espacios en Markdown y une una línea partida que empieza por `27)` (marca de lista): usar
  backticks; nunca formatear `pnpm-lock.yaml` ni archivos de terceros. Un archivo: `pnpm nx format:write --files=<ruta>`.
- `[aria-label]`/`[aria-pressed]` enlazados a `null` quitan el atributo, también como binding de host. Los botones son border-box.
- Grupo: el split nunca pone `type` y reconstruye sus entradas en cada apertura del menú; mantener el `track` del grupo
  (la vuelta del foco del split depende de reutilizar el DOM) y sin envoltorio entre segmentos (selectores del
  separador con ámbito; `::ng-deep` prohibido). `pressed` NO debe usar `booleanAttribute` (`undefined` pasaría a
  `false`, "no pulsado"); `?? false` solo para el aspecto.
- `Array.from(el.children)` es `Element[]` (`HTMLElement[]`: TS2769); "sin output" con `reflectComponentType`.

## Nota de release (desde 0.5.0) y temas abiertos

- Cambios incompatibles: `primary`/`danger` del tema claro más oscuros; `MenuItem.id` y `name` del split obligatorios;
  `sui-error` pierde `inputId`; `getCustomMessage` recibe el error; `SUI_ICON_NAME`; ningún botón se nombra por su
  icono; `iconSize` eliminado; `--sui-focus-ring` opaco accent 300; los segmentos de grupo de tipo `icon` se nombran
  por el `label` no en blanco, si no por `name`.
- Nuevo: input `label` opcional en `sui-button-group` (host `role="group"`, `aria-label` si no está en blanco); input
  `pressed` en `sui-button` y `sui-icon-button` (`aria-pressed`; sin valor o `undefined` = sin atributo); los segmentos
  del grupo anuncian el `selected` de cada entrada mediante `aria-pressed`.
- Problemas conocidos: el primer segmento `primary` y el grupo de una entrada no muestran anillo de foco visible
  (SC 2.4.7); anillo en oscuro sobre `primary` 1:1 en hover y 1.42:1 en reposo; anillo en claro 1.92:1 sobre el lienzo
  (SC 1.4.11); icon button `primary` seleccionado pulsado con Espacio 1.85:1 en claro y 1.34:1 en oscuro.
- Abierto: `name`/`autocomplete` de los campos, texto del badge, títulos de la demo; CSP estricta frente al sprite (sin probar).
