# Plan 005 — sui-button-split

Status: approved

Spec: `specs/005-sui-button-split/spec.md` (aprobada el 2026-10-18, sin preguntas abiertas). Este plan solo cambia lo que
dicen los FR: los dos textos sustituibles (FR-6, FR-8), no abrir sin opciones (FR-7), abrir con las flechas (FR-11),
opciones fuera del Tab y Flecha arriba desde el contenedor (FR-12), Tab y Mayús+Tab (FR-14, FR-16), lista vaciada con el
menú abierto (FR-15), los tests que faltan y la demo en modo `icon`. El grupo interno, `sui-button`, `MenuItem`, el
`.scss`, la colocación (FR-8), Escape y el clic fuera (FR-13) no cambian de comportamiento. La API pública conserva todos
sus inputs, outputs y campos.

## Archivos y responsabilidades

Sin archivos nuevos. `public-api.ts` no cambia: los inputs nuevos van en un componente ya exportado y no hay tipos
exportados nuevos.

Modificados:

- `sui-button-split/sui-button-split.component.ts` — inputs `arrowLabel` y `menuFallbackLabel`, estado `menuOpen` como
  `linkedSignal`, computeds `hasItems` y `menuName`, `inject(DOCUMENT)` en lugar de `window`/`document`, manejo de
  Flecha abajo/arriba en la flecha, `Tab`/`Mayús+Tab` y Flecha arriba desde el contenedor en el menú, y el `effect()` de
  foco de FR-15 (ver Estado y Plantilla). FR-6, FR-7, FR-8, FR-11, FR-12, FR-14, FR-15, FR-16, NFR-2.
- `sui-button-split/sui-button-split.component.html` — `[aria-label]="menuName()"` en el menú (sin el literal
  `'Options'`), `tabindex="-1"` en cada `menuitem`, condición `@if (menuOpen() && hasItems())`. FR-8, FR-12.
- `sui-button-split/sui-button-split.component.spec.ts` — la mayoría de los tests nuevos (ver Estrategia de tests).
- `apps/smooth-ui-demo/src/app/app.component.html` — fila nueva de split buttons en modo `icon` en las dos variantes, un
  split con `arrowLabel` sustituido, uno sin opciones y el control de vaciado (split "Share" y dos botones) (ver Demo).
  FR-15, NFR-4, criterio de finalización 4.
- `apps/smooth-ui-demo/src/app/app.component.ts` — `protected readonly emptiableMenuItems: WritableSignal<MenuItem[]>`
  iniciado con una copia de `menuItems`, el id del temporizador en un campo privado y `inject(DestroyRef).onDestroy(...)`
  que lo cancela; orden de miembros de ESLint (ver Demo). FR-15.

Leídos, sin cambios:

- `sui-button-split.component.scss` — fondo, borde, sombra y radio del menú, hover y `:focus-visible` de las opciones
  (FR-10), `split-menu-top` (FR-8), el hueco de 6 px (`padding-bottom`) y sin transiciones (NFR-3).
- `sui-button-group` (`.ts`/`.html`) — `role="group"` sin `label` (FR-3), segmentos `flat`, `track button.label ??
button.name` (reutilización del DOM), el split no pasa `type`, así que los dos modos usan `sui-button` (FR-4).
- `sui-button` (`.ts`/`.html`) — `expanded` → `aria-expanded` + `aria-haspopup="menu"` (FR-6), regla de nombre de la
  spec 002 FR-5 para el segmento principal en modo `icon` y para la flecha (FR-4, FR-6), `type="button"` (FR-5).
- `interfaces/menu-item.interface.ts`, `interfaces/sui-button.interface.ts`, los tipos `SUI_BUTTON_SPLIT_*` — sin cambios.
- `sui-icon.component.html` — `<svg aria-hidden="true">` con `<use href="#<name>">`, usado en los tests de icono.

## API pública

- Selector `sui-button-split`. Inputs sin cambios: `name` (obligatorio, FR-1), `icon` (`''`), `menuItems` (`[]`),
  `mode` (`default`), `shape` (`flat`), `size` (`md`), `variant` (`ghost`). Outputs sin cambios: `trigger: void` (FR-5)
  e `itemSelected: MenuItem` (FR-9).
- Inputs nuevos (compatibles, D1), colocados después de `menuItems`:
  - `public arrowLabel: InputSignal<string> = input<string>('More options');` — nombre accesible de la flecha. FR-6.
  - `public menuFallbackLabel: InputSignal<string> = input<string>('Options');` — nombre del menú solo cuando `name` es
    `''`. FR-8.
- Cambios de comportamiento (nota de release): sin opciones la flecha no abre y `aria-expanded` sigue en `false` (FR-7);
  Flecha abajo/arriba sobre la flecha abren el menú (FR-11); las opciones salen del orden de Tab (FR-12); Mayús+Tab
  desde el menú va a la flecha (FR-16); vaciar `menuItems` con el menú abierto lo cierra (FR-15).
- Tipos exportados sin cambios: `MenuItem`, `SUI_BUTTON_SPLIT_MODE`, `SUI_BUTTON_SPLIT_PLACEMENT`,
  `SUI_BUTTON_SPLIT_VARIANT`.

## Estado y lo que se deriva de él

Orden de miembros según ESLint (`eslint.config.mjs:17`: campos private → public → protected, `constructor`, métodos
private → public → protected), tipos explícitos y `_` en los privados.

- `private readonly _document: Document = inject(DOCUMENT);` — sustituye a `window.innerHeight` (por
  `_document.defaultView?.innerHeight ?? 0`) y a `document.activeElement` (D4).
- `protected readonly hasItems: Signal<boolean> = computed(() => this.menuItems().length > 0);` FR-7, FR-15.
- `protected readonly menuOpen: WritableSignal<boolean> = linkedSignal({ source: this.hasItems, computation: () =>
false });` — vuelve a `false` cada vez que `hasItems` cambia (en la práctica, al vaciarse la lista); una lista que
  cambia sin vaciarse no lo toca. Sigue siendo escribible para abrir y cerrar (D2). FR-15.
- `protected readonly menuName: Signal<string> = computed(() => (this.name() === '' ? this.menuFallbackLabel() :
this.name()));` — solo `''` recurre al texto de reserva; un `name` de espacios nombra el menú con espacios (caso
  límite). FR-8, NFR-2.
- `buttonSplit` e `iconSplit`: la entrada de la flecha usa `label: this.arrowLabel()` en lugar del literal; el resto
  igual (`expanded: this.menuOpen()`, `chevron-down`, callbacks). La flecha sigue su clave de track (`label`), así que
  el DOM se reutiliza al abrir y cerrar. FR-2, FR-4, FR-6.
- `placement` (`WritableSignal`) se queda: se escribe solo al abrir, en `afterNextRender`. FR-8.

## Dónde viven los efectos secundarios del navegador

Todo dentro del componente, sobre sus propios elementos, y los globales llegan por inyección (D4): ningún `window` ni
`document` directo.

- Flecha: un único helper privado `_arrowElement(): HTMLButtonElement | null` devuelve el último `button` de
  `sui-button-group` dentro del host (el criterio que hoy usa `_focusTrigger`). Lo comparten `_focusArrow()` y
  `onArrowKeydown` (`event.target === this._arrowElement()`), para que el elemento que se enfoca y el que se reconoce
  como flecha no puedan divergir. FR-7, FR-11.
- Foco: `_focusArrow()` (hoy `_focusTrigger`, privado) enfoca `_arrowElement()`; `_focusItem('first' | 'last')` enfoca
  la primera o la última opción. FR-9, FR-11, FR-13, FR-15, FR-16.
- Medidas: `_resolvePlacement()` lee `getBoundingClientRect()` del host, `offsetHeight` del menú y el alto de la ventana
  por `_document.defaultView`; la regla no cambia (`spaceBelow < menuHeight && top > spaceBelow` → `top`). FR-8.
- `_openMenu(focus: 'first' | 'last')`: si está cerrado, `menuOpen.set(true)` y en `afterNextRender` coloca y enfoca; si
  ya está abierto, enfoca directamente (no hay render pendiente y la colocación solo se calcula al abrir). FR-11.
- `effect()` de FR-15 (D3): se crea dentro de un `constructor()` (como `services/theme.service.ts:14`), no asignado a un
  campo privado que nadie lee (daría TS6138 con `noUnusedLocals`). El `constructor()` va tras los campos `protected` y
  antes de los métodos (`@typescript-eslint/member-ordering`). Lee `hasItems()`; cuando es `false`, si
  `untracked(this._menuElement)` contiene `_document.activeElement`, llama a `_focusArrow()`. No escribe ningún signal
  (el cierre lo hace el `linkedSignal`).
- `(document:pointerdown)` del host se queda (FR-13).

## Plantilla y accesibilidad

- Host: `'(document:pointerdown)'` y `'(keydown.escape)': 'closeMenu()'` se quedan; nuevos
  `'(keydown.arrowdown)': 'onArrowKeydown($event, "first")'` y `'(keydown.arrowup)': 'onArrowKeydown($event, "last")'`.
  `onArrowKeydown` actúa solo si `event.target === this._arrowElement()` (el mismo helper que `_focusArrow()`): siempre `preventDefault()` (no desplaza la página, FR-7) y,
  si `hasItems()`, `_openMenu(focus)` (FR-11). Las teclas que suben desde el menú no son la flecha y se ignoran (el menú
  ya las cancela).
- `toggleMenu()`: si está cerrado y `!hasItems()`, no hace nada (FR-6, FR-7); si no, alterna; al cerrar no mueve el foco
  (FR-6); al abrir llama a `_openMenu('first')` (FR-11). Enter y Espacio sobre la flecha llegan como clic nativo.
- `closeMenu()` sin cambios: solo si está abierto, cierra y enfoca la flecha (FR-9, FR-13, FR-16); sin
  `stopPropagation` (caso límite del diálogo).
- `onMenuKeydown`: el índice actual sale de `items.indexOf(event.target)` (no de `document.activeElement`). Flecha abajo:
  `(current + 1) % n` (desde el contenedor, `-1` → `0`); Flecha arriba: `current === -1 ? n - 1 : (current - 1 + n) % n`
  (arregla la penúltima de hoy); Inicio/Fin igual; `Tab` sin Mayús: `menuOpen.set(false)` sin `preventDefault` (FR-14);
  `Tab` con Mayús: `preventDefault()` y `closeMenu()` (FR-16, D5). FR-12.
- Menú: `role="menu"`, `tabindex="-1"`, `[aria-label]="menuName()"`, `[class.split-menu-top]`. Cada opción
  `<button type="button" role="menuitem" tabindex="-1">` con `sui-icon` (`aria-hidden`) y el `title`; separador
  `role="separator"` tras cada opción con `separatorAfter`. Con todas las opciones en `-1`, Tab desde una opción salta al
  siguiente enfocable tras el split, porque el menú es lo último del componente en el DOM (FR-12, FR-14).
- Flecha: `sui-button` con `label` = `arrowLabel()`, `aria-haspopup="menu"` y `aria-expanded` = `menuOpen()` (FR-6,
  FR-7). Segmento principal: texto `name` (modo `default`) o icono con `aria-label` = `name` (modo `icon`) (FR-4).
- Estilos sin cambios: tokens `--sui-*`, sin `::ng-deep`, sin movimiento propio (FR-10, NFR-3).

## Demo

`app.component.html`, sección "Smooth UI Button Split", fila nueva bajo la existente:

- `<sui-button-split [menuItems]="menuItems" icon="save" mode="icon" name="Save" shape="flat" size="sm" />`, otra
  `rounded` y otra `pill` `lg`, y las mismas tres con `variant="primary"` (modo `icon` en las dos variantes).
- `<sui-button-split [menuItems]="menuItems" arrowLabel="More save options" name="Save" />` (FR-6 sustituido).
- `<sui-button-split [menuItems]="[]" arrowLabel="No options" name="Publish" />` (FR-7 en el navegador).
- Control de FR-15 (vaciado temporizado): un split propio `name="Share"` con `[menuItems]="emptiableMenuItems()"` y,
  junto a él, dos `<sui-button type="button">` (fuera de cualquier `<form>`) con texto visible: "Empty options in 3 s"
  (programa un único `setTimeout` de 3000 ms que hace `emptiableMenuItems.set([])`, cancelando el anterior si lo hay) y
  "Restore options" (cancela el temporizador pendiente y hace `emptiableMenuItems.set([...this.menuItems])`). En
  `app.component.ts`: `protected readonly emptiableMenuItems: WritableSignal<MenuItem[]>` iniciado con una copia de
  `menuItems`, el id del temporizador en un campo privado y `inject(DestroyRef).onDestroy(...)` que lo cancela; orden de
  miembros de ESLint. Siempre un array nuevo (mutar el mismo no dispara FR-15). Los demás splits no se tocan. Motivo del
  temporizador: con el menú abierto no se puede accionar ningún otro control de la página, porque el `pointerdown` fuera
  lo cierra (FR-13) y Tab también (FR-14); el retardo separa la acción del vaciado y se acciona igual con ratón o
  teclado, con un botón nativo y texto visible, sin atajos globales que choquen con el lector de pantalla.

Todos con `name` no en blanco y `arrowLabel` distinto de `name` (sin `button-name` de AXE ni NG0955). Sin reglas nuevas
en `app.component.scss` (presupuesto `anyComponentStyle` intacto). No es un control de formulario: las reglas de Signal
Forms / Reactive Forms no aplican.

## Decisiones

- **D1. Nombres `arrowLabel` y `menuFallbackLabel` (confirmados por el usuario el 2026-10-18).** `arrowLabel` usa el término de la spec ("flecha") y evita
  `triggerLabel`, que se confundiría con el output `trigger` del segmento principal; `menuFallbackLabel` deja claro que
  solo se usa cuando `name` es `''`. Descartado: `menuLabel` (se esperaría que nombrara siempre el menú, contra FR-8) y
  `moreOptionsLabel` (ata el nombre al texto por defecto).
- **D2. `menuOpen` es un `linkedSignal` con origen `hasItems`.** El cierre de FR-15 se deriva sin `effect()` que escriba
  estado y una lista que cambia sin vaciarse no lo cierra. Descartado: `computed(() => open() && hasItems())` (el menú se
  reabriría solo al volver las opciones) y un `effect()` que haga `set(false)` (prohibido por CLAUDE.md).
- **D3. El foco de FR-15 va en un `effect()` de componente.** Mover el foco es DOM imperativo, el único uso permitido; el
  effect de componente corre en la detección de cambios antes de refrescar la plantilla, así que el menú aún está en el
  DOM y se puede saber si tenía el foco. Se registra en el `constructor()` (contexto de inyección, sin campo sin leer).
  Descartado: `afterRenderEffect` (corre con el menú ya quitado y el foco en
  `body`) y escuchar `focusout` (no se dispara de forma fiable al quitar un nodo enfocado).
- **D4. `inject(DOCUMENT)` en lugar de `window`/`document`.** Cumple el principio 3 (sin globales del DOM) y el 7
  (dependencias por `inject()`) sin archivo nuevo; el foco y las medidas son de los propios elementos del componente.
  Aceptado por el usuario el 2026-10-18 (pregunta A, opción a). Justificación frente al principio 3: su comprobación
  ("ningún global de DOM en los componentes") se cumple porque `DOCUMENT` llega inyectado y es sustituible en un spec;
  el foco, `getBoundingClientRect()` y `offsetHeight` actúan sobre los propios elementos del componente, no sobre estado
  global del navegador; y el alto de la ventana es una lectura puntual al abrir, no un efecto que haya que aislar.
  Descartado: un servicio de viewport nuevo (archivo y API nuevos que ningún FR pide) y ampliar `BreakpointService`
  (solo expone el ancho por `matchMedia`; el alto le daría un segundo motivo para cambiar, principio 7).
- **D5. Mayús+Tab se cancela y el foco va a la flecha por código.** Sin `preventDefault`, el navegador ejecutaría
  Mayús+Tab después de enfocar la flecha y el foco acabaría en el segmento principal; en jsdom el test pasaría igual
  porque no hay navegación con Tab. Por eso FR-16 se comprueba dos veces, a propósito: tests unitarios (destino +
  `defaultPrevented`) y navegador (Mayús+Tab real). Descartado: dejar la acción nativa (depende del orden del DOM).
- **D6. Tab sin Mayús no se cancela.** El destino natural ya es el siguiente enfocable tras el split (opciones en `-1`,
  menú al final del componente). Descartado: calcular el siguiente enfocable por código (frágil y fuera de la spec).

## Estrategia de tests (Vitest y TestBed, jsdom, zoneless)

`pnpm nx run smooth-ui:test`. Inputs con `fixture.componentRef.setInput()` y después `await fixture.whenStable()`; sin
`fakeAsync`. Consultas por rol y nombre accesible (`[role="menu"]`, `[role="menuitem"]`, `aria-label`). Los eventos de
teclado se crean con `{ key, shiftKey?, bubbles: true, cancelable: true }`: sin `cancelable`, "no cancelado" no prueba
nada. Enter y Espacio sobre botones nativos no generan clic en jsdom: se simulan con `click()` (FR-9, FR-11). Los tests
existentes se quedan.

`sui-button-split.component.spec.ts` (nuevos):

- **FR-1**: el test existente (`NG0950` sin `name`); `name` `''` se crea sin error.
- **FR-2**: dos segmentos; la flecha contiene `use[href="#chevron-down"]`; valores por defecto `sui-button-group-flat`,
  `sui-button-md`, `sui-button-ghost`; `size` `lg` y `variant` `primary` llegan al grupo y a los dos segmentos; `shape`
  `pill` llega solo al grupo y los dos segmentos siguen con `sui-button-flat` (el grupo les pasa siempre `flat`).
- **FR-3**: tests existentes del grupo sin nombre ni `aria-pressed`; los dos segmentos tienen `tabIndex` 0.
- **FR-4**: modo `default`: texto `Save`, sin `aria-label`; modo `icon` con `icon` `check`: `use[href="#check"]`, sin
  texto, `aria-label` `Save`; modo `icon` con `icon` `''`: sin `svg` ni texto en el segmento principal.
- **FR-5**: clic en el principal emite una vez con `undefined`; con el menú abierto, sigue abierto; con el menú cerrado,
  sigue cerrado; un anfitrión en el spec con `<form (submit)>` no registra envío al pulsar los dos segmentos.
- **FR-6**: `aria-label` `More options` por defecto y `More save options` con `arrowLabel`; `aria-haspopup` `menu`;
  clic abre (`aria-expanded` `true`), segundo clic cierra con la flecha enfocada antes y el foco sigue en ella.
- **FR-7**: con `menuItems` `[]`: clic no abre, `aria-expanded` `false`, `aria-haspopup` `menu`; Flecha abajo y Flecha
  arriba sobre la flecha → `defaultPrevented` `true` y sin menú.
- **FR-8**: `role="menu"` con `aria-label` `Save`; `name` `''` → `Options`, y con `menuFallbackLabel` `Choices` →
  `Choices`; `name` `"  "` → `"  "`; opciones en orden con su `use[href]` y `title`; un separador tras cada
  `separatorAfter`, también al final. Colocación con medidas simuladas (`vi.spyOn(host, 'getBoundingClientRect')`,
  `vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get')`, `Object.defineProperty(window, 'innerHeight', …)`,
  restaurados en `afterEach`): espacio abajo suficiente → sin `split-menu-top`; abajo insuficiente y arriba mayor → con
  ella; abajo insuficiente y arriba menor → sin ella; frontera: espacio abajo igual al alto del menú → sin ella (la
  comparación es estricta, `<`). El hueco de 6 px: el menú abierto (abajo y arriba) conserva la regla del `.scss`; en
  jsdom solo se comprueba la clase (`split-menu` / `split-menu-top`), la distancia real va al navegador.
- **FR-9**: clic en una opción emite la misma referencia (`toBe`), cierra y enfoca la flecha (test existente ampliado);
  las opciones son `<button type="button">`.
- **FR-10**: el menú tiene `split-menu` y las opciones `split-menu-item` (el aspecto va al navegador).
- **FR-11**: clic → primera enfocada (existente); Flecha abajo sobre la flecha cerrada → abre y enfoca la primera;
  Flecha arriba → la última; con el menú abierto y la flecha enfocada por código, Flecha abajo/arriba lo dejan abierto y
  enfocan la primera/última; todas con `defaultPrevented`.
- **FR-12**: opciones y contenedor con `tabIndex` -1; Flecha abajo/arriba circulares, Inicio/Fin; con el foco en el
  contenedor, Flecha abajo → primera y Flecha arriba → última (regresión de la penúltima).
- **FR-13**: Escape desde una opción y desde el segmento principal cierra y enfoca la flecha; Escape con el menú cerrado
  no mueve el foco; `pointerdown` en `document.body` cierra y el foco no es la flecha; `pointerdown` dentro del menú no
  cierra. Si jsdom no tiene `PointerEvent`, se usa `MouseEvent('pointerdown')`.
- **FR-14**: Tab en una opción → sin menú, `aria-expanded` `false`, `defaultPrevented` `false`.
- **FR-15**: con el foco en una opción, `menuItems` `[]` → sin menú, `aria-expanded` `false`, foco en la flecha; con el
  foco en el segmento principal → se cierra y el foco se queda; volver a dar opciones no reabre; cambiar a otra lista no
  vacía con el menú abierto lo deja abierto.
- **FR-16**: Mayús+Tab en una opción → `defaultPrevented` `true`, sin menú, `aria-expanded` `false`, foco en la flecha.
- **NFR-2**: con `arrowLabel` y `menuFallbackLabel` sustituidos y `name` `''`, ningún `aria-label` ni texto contiene
  `More options` ni `Options`.

## Lo que queda para la validación (navegador, MCP de Chrome DevTools)

- **FR-1 en el marcado**: un `<sui-button-split />` temporal en la demo hace fallar `pnpm nx run smooth-ui-demo:build`
  con NG8008 (no aparece en Vitest ni en `typecheck`); se quita.
- **FR-8**: colocación abajo y arriba (desplazando la página hasta dejar el split cerca del borde inferior), en los dos
  temas, con un hueco de 6 px entre el split y el menú en ambas posiciones (medido con `getBoundingClientRect()`). **FR-10**: fondo, borde, sombra, radio, hover y anillo solo con `:focus-visible`.
- **FR-9, FR-11**: Enter y Espacio reales sobre la flecha y sobre una opción. **FR-12 a FR-16**: destino real del foco;
  FR-14 (Tab real al siguiente enfocable tras el split) solo se puede comprobar aquí; FR-16 con Mayús+Tab real acaba en
  la flecha (segunda comprobación, D5). **FR-7**: Flecha abajo sobre la flecha del split sin opciones no desplaza.
- **NFR-3**: movimiento reducido emulado, sin transiciones propias. **NFR-4**: axe 4.10.2 desde cdnjs con `wcag2a`,
  `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` sobre la sección del split, temas claro y oscuro, modos `default` e
  `icon`, variantes `ghost` y `primary`, menú cerrado y abierto: cero infracciones (problemas de anillo de la spec 004
  aceptados). **NFR-1**: ningún `package.json` cambiado.

## Cobertura de los FR

- FR-1: sin cambio · test unitario + build de la demo. FR-2, FR-3: sin cambio · tests de clases, icono y `tabIndex`.
- FR-4, FR-5: sin cambio · tests de modo, nombre, emisión y formulario.
- FR-6: `arrowLabel` en la entrada de la flecha + guarda de `toggleMenu` · tests unitarios.
- FR-7: `hasItems` en `toggleMenu` y `onArrowKeydown` (siempre `preventDefault`) · tests unitarios + navegador.
- FR-8: `menuFallbackLabel`, `menuName`, `_document` en la colocación · tests con medidas simuladas + navegador.
- FR-9: sin cambio · test unitario (clic) + navegador (Enter/Espacio). FR-10: sin cambio · clases + navegador.
- FR-11: `onArrowKeydown` + `_openMenu` · tests unitarios + navegador. FR-12: `tabindex="-1"` + índice desde
  `event.target` + regla de `-1` · tests unitarios.
- FR-13: sin cambio · tests unitarios + navegador. FR-14: `Tab` sin cancelar · cierre en unitarios, destino en navegador.
- FR-15: `linkedSignal` + `effect()` de foco · tests unitarios (T8) + navegador con el control de vaciado de la demo
  (T10). FR-16: `Tab` con Mayús cancelado + `closeMenu()` ·
  tests unitarios y navegador (dos veces, D5).
- NFR-1 a NFR-4: inputs de texto, demo en modo `icon`, axe en los dos temas.

## Comprobación de la constitución

1 sin dependencias · 2 spec 005 aprobada antes del código · 3 la plantilla enlaza, `hasItems`/`menuName`/`menuOpen` se
derivan, sin globales del DOM (`DOCUMENT` inyectado; interpretación de D4 aceptada por el usuario: los efectos del
navegador que quedan en el componente son foco y medidas de sus propios elementos, sin servicio nuevo) · 4 tests de Vitest/TestBed junto al componente · 5 sin
tratamiento de datos · 6 "More options" y "Options" pasan a inputs con esos valores por defecto · 7 el comportamiento se
amplía con inputs nuevos; el `switch` del menú solo arregla `ArrowUp` y separa `Tab` por `shiftKey`, sin variantes
nuevas.

## Nota de release (para `MEMORY.md` y la release)

Nuevo: `arrowLabel` (por defecto "More options") y `menuFallbackLabel` (por defecto "Options") en `sui-button-split`;
Flecha abajo/arriba sobre la flecha abren el menú y enfocan la primera/última opción. Cambios de comportamiento: sin
opciones la flecha no abre ni anuncia "abierto"; las opciones ya no son paradas de Tab; Mayús+Tab desde el menú vuelve a
la flecha; vaciar `menuItems` con el menú abierto lo cierra; Flecha arriba desde el contenedor va a la última opción.

## Verificación

`pnpm nx run smooth-ui:test` después de cada tarea; al final
`pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (el propietario o el implementer; el planner no
ejecuta Prettier).

## Riesgos y trampas

- FR-16 da un falso verde en jsdom si no se cancela Mayús+Tab: el test debe comprobar `defaultPrevented` además del
  destino (D5).
- FR-14 depende de que la detección de cambios zoneless no corra entre el `keydown` y la acción por defecto, y de que
  las opciones estén en `-1`; si el menú se quitara antes, el foco caería en `body` (solo visible en el navegador).
- D3 depende de que el `effect()` de componente corra antes de refrescar la plantilla. El test de FR-15 lo vigila (con
  el menú ya quitado fallaría); si falla, la alternativa es guardar en un campo privado si el último `focusin` del host
  fue dentro del menú y enfocar la flecha en `afterNextRender` cuando el foco quede en `body`.
- `afterNextRender` no se dispara si no hay render: por eso `_openMenu` enfoca directamente cuando el menú ya está
  abierto (FR-11).
- Los espías de `offsetHeight` en `HTMLElement.prototype` y `innerHeight` afectan a todo el archivo: restaurarlos en
  `afterEach` (`vi.restoreAllMocks()` y el valor original de `innerHeight`).
- Cambiar `arrowLabel` en caliente cambia la clave de track de la flecha y la recrea (pierde el foco); `arrowLabel` igual
  a `name` da NG0955 y uno en blanco deja la flecha sin nombre: errores del consumidor (casos límite).
- Los `keydown` del menú suben al host: `onArrowKeydown` debe filtrar por `event.target` para no cancelar ni reabrir
  dos veces.
- FR-15 solo se dispara si `menuItems` recibe un array nuevo: si el consumidor lo vacía mutando el mismo array
  (`splice`, `length = 0`), el input no cambia de referencia, `hasItems` no se recalcula y el menú se queda abierto y
  vacío. Es uso incorrecto del consumidor (los signals comparan la referencia); no se cubre.
- Riesgo conocido, fuera de este ciclo (decisión del usuario, pregunta B opción a): con el menú abierto y el foco en el
  segmento principal, Tab va a la flecha y otro Tab sale del split con el menú aún abierto (solo lo cierran Escape o el
  clic fuera). Ningún FR lo cubre y la spec no cambia. Seguimiento: valorar en otra spec un FR del tipo "Cuando el foco
  salga del componente con el menú abierto, el componente cerrará el menú".

## Preguntas abiertas

Ninguna. Cerradas el 2026-10-18: A (principio 3) → D4 aceptado sin servicio nuevo; B (Tab fuera del split con el menú
abierto) → fuera de este ciclo, en Riesgos y trampas.
