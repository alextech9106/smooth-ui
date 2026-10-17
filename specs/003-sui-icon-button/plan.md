# Plan 003 — sui-icon-button

Status: approved (2026-10-17, reaprobado después de revisar D2 a accent 300 por el cambio de FR-8/NFR-4)

Spec: `specs/003-sui-icon-button/spec.md` (aprobada el 2026-10-17; reaprobada el mismo día tras el cambio del anillo de
FR-8/NFR-4). Sus cinco preguntas abiertas quedan para más adelante, así que este plan solo cambia lo que dicen los FR y
los NFR: el nombre de FR-4 (sin recurso al nombre del icono), la eliminación de `iconSize` del componente y de
`SuiIconButton` (incompatible), el color del anillo de foco compartido (FR-8, NFR-4), los tests que faltan y la matriz
de la demo. Los aspectos, tamaños, formas, el badge y el `.scss` no cambian. Se mantienen los cambios del usuario en el
árbol de trabajo (el envío del formulario reactivo de la demo usa `(trigger)`, el `name` del split es obligatorio, el
`sui-button.component.scss` actual).

## Archivos y responsabilidades

Sin archivos nuevos. `public-api.ts` no cambia (ya exporta el componente, `SUI_ICON_BUTTON_VARIANT` y `SuiIconButton`).

Modificados:

- `sui-icon-button.component.ts` — quita el input `iconSize` (línea 19); `accessibleName` pasa a ser
  `protected readonly accessibleName: Signal<string | null> = computed(() => (this.label().trim() ? this.label() : null));`
  (D1). Nada más cambia. FR-4, FR-6.
- `interfaces/sui-icon-button.interface.ts` — quita `iconSize?: number` (incompatible). FR-6.
- `libs/smooth-ui/theme/theme.scss` — línea 227 (claro) y línea 296 (oscuro): `--sui-focus-ring` pasa a ser
  `0 0 0 3px var(--sui-accent-300)` en los dos bloques (D2). `--sui-focus-ring-danger` (líneas 228, 297) no se toca.
  FR-8, NFR-4.
- `sui-icon-button.component.spec.ts` — se actualiza el test del nombre del icono y se añaden los tests nuevos (ver
  Estrategia de tests).
- `apps/smooth-ui-demo/src/app/app.component.ts` — datos tipados de la demo para la matriz de icon buttons y la fila de
  formas (D3).
- `apps/smooth-ui-demo/src/app/app.component.html` — las líneas 71-85 (13 icon buttons sin label, en parte duplicados)
  se sustituyen por una fila de formas con label y la matriz diferida (D3, D4). Criterios de finalización 3 y 4.

Leídos, sin cambios:

- `sui-icon-button.component.html` — `[aria-label]="accessibleName()"` se queda; `null` quita el atributo (FR-4). El
  `<button type="button">` nativo da la activación por teclado y no envía ni reinicia formularios (FR-2), y `[disabled]`
  lo deja no disponible (FR-3); `sui-icon` recibe `computedIconSize()` (16/20/24, FR-6); el badge es un `<span>` hermano
  fuera del `<button>` (FR-9, FR-10). El `NgClass` del ancla es legacy, pero ningún FR lo toca, así que no se migra.
- `sui-icon-button.component.scss` — todas las reglas de aspecto, tamaño, forma, `selected`, `focus`, deshabilitado y
  badge (FR-3, FR-5 a FR-9); `transition: all` usa `--sui-duration-fast`, que el movimiento reducido pone a cero en
  `theme.scss` (NFR-3). Todos los anillos usan `var(--sui-focus-ring)`, así que D2 llega a `:focus-visible` y a
  `state` `focus` sin cambiar el `.scss` (FR-8).
- `sui-icon/sui-icon.component.html` — el `<svg>` es `aria-hidden="true"` y `focusable="false"` (FR-4).
- `sui-theme-toggle.component.html` — siempre pasa un `label` no en blanco y nunca `iconSize`: FR-4 y FR-6 no le
  afectan; su anillo cambia con D2 (aceptado, fuera de alcance). Mantiene su `(click)` en bruto.
- `sui-button-group.component.html` — pasa `label ?? name` y nunca `iconSize`; el recurso del grupo queda fuera de
  alcance. Las entradas de `buttonsGroup` de la demo tienen nombres no en blanco, así que sus 18 icon buttons siguen
  teniendo nombre.
- Otros usos de `--sui-focus-ring` (efecto secundario de D2, aceptado por la spec): `sui-button` (5 anillos),
  `sui-button-split` (elementos del menú, sobre `--sui-color-bg-surface-raised`), `sui-link` (2), `sui-text-field` (2,
  junto a un borde de acento en `:focus-within`), `sui-textarea` (1). El `danger` de `sui-button` mantiene
  `--sui-focus-ring-danger`.
- Búsqueda de otros consumidores: ningún archivo de `libs/` ni de `apps/` enlaza `iconSize` en `sui-icon-button`,
  construye un `SuiIconButton` (exportado, sin uso hoy) ni depende del recurso al nombre del icono; solo lo hacían los
  13 botones sin label de la demo, que se sustituyen. Ningún test unitario comprueba `--sui-focus-ring`, valores hex ni
  colores calculados.

## API pública

- Selector `sui-icon-button`. Inputs: `icon` (obligatorio, FR-1), `badge` (`0`), `label` (`''`), `shape` (`rounded`),
  `size` (`md`), `state` (`default`), `variant` (`ghost`), y los de atributo booleano `disabled` y `selected`. Se quita
  `iconSize` (incompatible, FR-6).
- Output `trigger: void` (FR-2), sin `stopPropagation`.
- El tipo exportado `SuiIconButton` pierde `iconSize` (incompatible); todo lo demás se queda (fuera de alcance).
- Cambio de comportamiento (incompatible): el nombre del icono nunca se convierte en el nombre accesible; un `label` en
  blanco no da `aria-label`. Nada se comprueba ni se avisa en tiempo de ejecución (FR-4).
- Cambio de tema (incompatible en el aspecto): `--sui-focus-ring` tiene un color nuevo en los dos temas, así que cambian
  todos los anillos que lo usan; el nombre de la variable se mantiene (AGENTS.md prohíbe renombrar variables del tema).

## Estado y lo que se deriva de él

Todo derivado con `computed()`; sin `effect()`, sin hooks del ciclo de vida, sin estado escribible nuevo.

- `accessibleName: Signal<string | null>` — `label()` tal cual (sin recortar) cuando `label().trim()` no está vacío y,
  si no, `null`; nunca `icon()`. FR-4.
- Sin cambios: `computedIconSize` (solo a partir de `size`, FR-6) y `classes` (FR-3, FR-5 a FR-8).

## Dónde viven los efectos secundarios del navegador

No se añade ninguno. El componente no toca ningún global del navegador; el sprite de iconos sigue en `SuiIconService`
(spec 001).

## Plantilla y accesibilidad

- `<button type="button">` nativo: Enter y Espacio los gestiona el navegador, sin manejador de teclas propio; nunca
  envía ni reinicia un formulario (FR-2). `[disabled]` lo saca del orden de foco y lo anuncia como no disponible (FR-3).
- `[aria-label]` es el `label` no en blanco sin recortar, o no existe; el botón no tiene contenido de texto, así que sin
  `label` queda sin nombre (la infracción documentada de FR-4, que no aparece en la demo). Sin `aria-pressed` para
  `selected` (FR-7).
- El icono se oculta mediante `sui-icon` (FR-4). El badge es texto simple en un `<span>` hermano, así que se expone como
  texto propio, no está en el nombre y un clic sobre él no llega al `<button>` (FR-10).

## Demo

- `app.component.ts` recibe, como campos `protected readonly`: `iconButtonVariants: SUI_ICON_BUTTON_VARIANT[]`
  (`ghost`, `outline`, `primary`), `iconButtonStates: DemoIconButtonState[]` (4) e
  `iconButtonMatrix: DemoIconButtonVariantGroup[]`, construido una vez por una función pura a nivel de módulo a partir
  de las variantes, los `buttonSizes` existentes y los estados (D3). Interfaces locales: `DemoIconButtonState` (`id`,
  `action`, `icon`, `selected`, `disabled`, `state: SUI_STATE`, `badge`), `DemoIconButton` (lo mismo más un `id` y un
  `label` únicos), una fila (`id`, `size`, `buttons`) y un grupo de variante (`variant`, `rows`). Se añade
  `SUI_ICON_BUTTON_VARIANT` al import.
- Estados, cada uno por separado (NFR-4): `selected` (`star`, "Add to favourites"), `disabled` (`trash`, "Delete"),
  `state` `focus` (`settings`, "Open settings") y un badge (`bell`, "Show notifications", `badge` 3). Cada `label` es la
  acción más la variante y el tamaño, por ejemplo "Delete (outline, lg)", así que los 36 son no en blanco y distintos.
- Fila de formas (inmediata, antes de la matriz, tres líneas escritas a mano en una `.row`): botones `outline` `md` con
  el icono `edit` y `shape` `flat`/`rounded`/`pill`, con los labels "Edit (flat)", "Edit (rounded)" y "Edit (pill)"
  (criterio de finalización 3).
- Matriz: `<div id="icon-button-matrix">` envuelve `@defer (on viewport)`; dentro, `@for` por grupo de variante
  (`track group.variant`) con un `<h2>`, por fila (`track row.id`, una `.row` por tamaño) y por botón
  (`track button.id`), enlazando `badge`, `disabled`, `icon`, `label`, `selected`, `size`, `state` y `variant`.
  `@placeholder` muestra "Icon button matrix" y `@loading` "Loading icon button matrix…". `sui-icon-button` también se
  usa de forma inmediata (fila de formas, selector de tema), así que el defer solo retrasa el renderizado.
- Maquetación: reutiliza `.row` (flex que salta de línea, separación de 1rem) y `.col`; ninguna regla nueva en
  `app.component.scss`, así que el presupuesto `anyComponentStyle` no se ve afectado. Una fila tiene 4 botones (como
  mucho 4 × 48 + 3 × 16 = 240 px, más los 12 px del badge), muy por dentro de los 343 px de ancho de contenido a 375 px,
  así que el desbordamiento de la página no crece.
- El selector de tema y los grupos de botones no necesitan cambios (fuera de alcance; no forman parte de las
  comprobaciones).

## Decisiones

- **D1. `accessibleName` devuelve `null` con un `label` en blanco.** `[aria-label]` con `null` quita el atributo, así
  que el botón no pone ningún nombre propio (FR-4); `label()` se mantiene sin recortar. Descartado: devolver `''` (un
  `aria-label` vacío, un nombre puesto en blanco en lugar de ninguno) y un aviso en tiempo de ejecución (la spec dice
  que nada lo avisa).
- **D2. `--sui-focus-ring` pasa a ser un `0 0 0 3px var(--sui-accent-300)` opaco en los dos temas (decisión del
  usuario, 2026-10-17, que sustituye al accent 500 aplicado primero en T6).** La misma forma de 3 px que antes, ahora
  opaca, así que el color pintado es el del token sobre cualquier fondo. Contraste WCAG calculado de #a6b2fc: en claro,
  sobre el canvas #f8f9fb 1.92:1 (antes 1.49:1) y sobre superficies blancas 2.02:1, los dos por debajo de 3:1; en
  oscuro, sobre el canvas #10141b 9.14:1 (antes 2.27:1). Motivo: el usuario eligió un anillo más suave en los dos temas,
  con un solo token compartido. Contrapartida: el anillo del tema claro incumple WCAG 2.2 SC 1.4.11 (AA) y la regla del
  proyecto "WCAG AA innegociable"; la spec lo recoge como fallo conocido aceptado (NFR-4). En el tema oscuro accent 300
  también es el fondo de hover de `primary`, así que en un botón `primary` enfocado y con el puntero encima el anillo se
  confunde con el botón (su borde exterior sigue contrastando 9.14:1 con el canvas). Descartado: accent 500 (3.63:1 en
  claro y 4.82:1 en oscuro, pasa en los dos; el usuario prefirió accent 300); un anillo por tema (accent 500 en claro y
  300 en oscuro: pasa, pero el usuario eligió un solo valor); un anillo translúcido (el color pintado cambia en cada
  superficie); anillos por componente (un único anillo compartido por coherencia).
- **D3. Los datos de la matriz de la demo se construyen en la clase del componente, no en la plantilla.** Los labels
  necesitan acción, variante y tamaño; construirlos una vez en TypeScript deja la plantilla en bindings. Descartado:
  concatenar textos en la plantilla (lógica en el marcado) y repetir un label por estado (no sería "su propio" label).
- **D4. La matriz se genera con `@for` dentro de `@defer (on viewport)` con un contenedor de id estable**, como en la 002. Descartado: 36 líneas escritas a mano y renderizarla de inmediato.
- **D5. Los aspectos se prueban mediante clases; los colores, anillos, tamaños y movimiento, en el navegador.** jsdom no
  aplica de forma fiable los estilos de los componentes ni `theme.scss`. Descartado: aserciones con `getComputedStyle`
  en Vitest.

## Estrategia de tests (Vitest y TestBed, jsdom)

Se ejecutan con `pnpm nx run smooth-ui:test`. Inputs con `fixture.componentRef.setInput()` y después
`await fixture.whenStable()`. Se quedan los tests existentes "should create", "exposes the label as accessible name" y
"disables the native button…".

Test actualizado: "falls back to the icon name when no label is given" pasa a ser "never uses the icon name as
accessible name": icono `check`, sin `label` → el botón no tiene atributo `aria-label` (y no es `check`).

Tests nuevos en `sui-icon-button.component.spec.ts`:

- **FR-1**: un fixture nuevo sin `icon` lanza un error en `detectChanges()` (`NG0950`); `icon` `""` pinta el `<svg>`.
- **FR-2**: un clic emite un `trigger` con `undefined`; keydown/keyup de Enter y Espacio lanzados no emiten nada por sí
  solos (sin manejo propio de teclas); el `type` del botón es `button`. Un anfitrión dentro del spec con un formulario,
  un input y el icon button: un clic no lanza ningún evento de envío y deja sin cambios el valor editado del input (sin
  reinicio).
- **FR-3**: con `disabled`, el botón nativo está deshabilitado, un clic no emite nada, `sui-icon-button-disabled` está
  presente (también con `selected`, las dos clases), y `focus()` no lo convierte en `document.activeElement`.
- **FR-4**: `label` `" Close "` → `aria-label` `" Close "`; `label` `"   "` → sin `aria-label`; el `<svg>` tiene
  `aria-hidden="true"`; el contenido de texto del botón está vacío (NFR-2).
- **FR-5**: por defecto `sui-icon-button-ghost`; clases `outline` y `primary`.
- **FR-6**: por defecto `sui-icon-button-md` y `sui-icon-button-rounded`; clases `sm`/`lg` y `flat`/`pill`; el ancho del
  `<svg>` es 16/20/24 para `sm`/`md`/`lg`; `setInput('iconSize', 32)` lanza un error (`NG0303`).
- **FR-7**: `selected` → `sui-icon-button-selected` y sin `aria-pressed`.
- **FR-8**: `state` `focus` → `sui-icon-button-focus`, que se mantiene con `disabled`.
- **FR-9**: `badge` 5, -1 y 1.5 muestran "5", "-1" y "1.5" en `.badge`; 0, `NaN` y sin valor no muestran `.badge`.
- **FR-10**: con `badge` 3 y `label` "Show notifications", el `.badge` no está dentro del `<button>`, el `aria-label`
  sigue siendo "Show notifications" y un clic sobre el `.badge` no emite `trigger`.

## Lo que queda para la validación (navegador, MCP de Chrome DevTools)

- **FR-1 y FR-6 en tiempo de compilación**: un `<sui-icon-button />` temporal y otro con `[iconSize]="20"` en la demo
  hacen fallar `pnpm nx run smooth-ui-demo:build`; un literal `SuiIconButton` temporal con `iconSize` en
  `app.component.ts` hace fallar `pnpm nx run smooth-ui-demo:typecheck`. Todo se quita después.
- **FR-2, FR-3**: Enter y Espacio reales dan un `trigger`; aspecto deshabilitado y cursor not-allowed en reposo y en
  hover.
- **FR-4**: en el árbol de accesibilidad, cada icon button de la demo expone su `label` y ningún nombre de icono.
- **Matriz diferida**: hacer scroll hasta `#icon-button-matrix` y esperar a los 36 botones de la matriz (sin los textos
  del placeholder y de carga) antes de cualquier comprobación.
- **FR-5 a FR-9**: aspectos en hover y al pulsar, tamaños, radios, posición del badge, anillo de teclado y anillo de
  `state` `focus`. **FR-8, anillo de NFR-4**: el color calculado del `box-shadow` es rgb(166, 178, 252) en los dos temas;
  el contraste medido contra el canvas es de al menos 3:1 en oscuro (9.14) y, en claro, se registra como el fallo
  conocido aceptado (1.92, no como aprobado). Echar también un vistazo a los anillos de `sui-button`, el menú del split,
  `sui-link`, `sui-text-field` y `sui-textarea` (efecto secundario, sin FR). **NFR-3**: con movimiento reducido
  emulado, las transiciones son `0s`.
- **NFR-4**: confirmar que `getComputedStyle(document.body).backgroundColor` es el color del canvas, cargar axe desde un
  CDN (sin añadir paquetes) y ejecutarlo sobre la sección de icon buttons (fila de formas y matriz) con `wcag2a`,
  `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: cero infracciones, y después otra vez en el tema oscuro. Contraste del
  icono y del badge por estado como dice la spec, con su única excepción; los estados de pulsado los comprueba a mano el
  propietario.
- **375 px**: con un viewport de 375 px, `document.documentElement.scrollWidth` sigue en 444 (no más ancho).
- **NFR-1, NFR-2**: ningún `package.json` ha cambiado; ningún texto nuevo en la librería.
- Comprobaciones completas: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck`; la build de la
  demo no añade ningún aviso nuevo de `anyComponentStyle`.

## Cobertura de los FR

FR-1 test + comprobación de build · FR-2 a FR-4 tests + navegador · FR-5 a FR-7 tests de clases + navegador · FR-6
también comprobaciones de build y typecheck · FR-8 D2 + test de clases + navegador · FR-9, FR-10 tests + navegador ·
NFR-1, NFR-2 comprobaciones · NFR-3 navegador · NFR-4 D2 + demo + axe en los dos temas y comprobaciones de contraste.

## Nota de release (para `MEMORY.md` y la release)

Incompatible: `sui-icon-button` ya no usa el nombre del icono como nombre accesible (pasa un `label` no en blanco); se
quita `iconSize` de `sui-icon-button` y de `SuiIconButton`; `--sui-focus-ring` es ahora accent 300 opaco en los dos
temas, lo que cambia todos los anillos de foco (`sui-button`, split, link, text field, textarea, icon button), a
diferencia de la spec 002, que mantenía los anillos como estaban. Problema conocido: el anillo del tema claro tiene
1.92:1 contra el canvas, por debajo del 3:1 de WCAG 2.2 SC 1.4.11 (AA). El anillo de peligro no cambia.

## Riesgos

- Los consumidores con botones solo de icono y sin `label` (o grupos con `label`/`name` en blanco) se quedan sin nombre,
  sin aviso.
- Si `[aria-label]` con `null` deja un atributo en jsdom o en el navegador, los tests de FR-4 fallan; la alternativa es
  devolver `null` mediante `[attr.aria-label]`, una desviación de la regla de bindings ARIA del proyecto que hay que
  plantear antes de aplicarla.
- D2 se ve en todas partes: el anillo pasa de un halo translúcido a una banda opaca de acento pálido; junto al borde de
  acento de un text field o textarea enfocado se lee como un contorno más grueso. Lo acepta la spec; necesita la nota de
  release.
- D2 deja todos los anillos del tema claro por debajo de 3:1 (1.92:1 sobre el canvas): un fallo WCAG AA que axe no
  informará, así que V7 puede pasar aunque la librería no cumpla. Aceptado por el usuario; recogido en la spec y en la
  nota de release.
- Si axe se ejecuta antes de que cargue el bloque diferido, solo comprueba el placeholder y pasa en falso (se evita
  arriba); axe omite los controles deshabilitados y no comprueba los anillos ni el hover/pulsado, que se miden a mano.
- El badge sobresale 12 px a la derecha y 10 px hacia arriba; la separación de la fila (16 px) y el relleno del
  contenedor lo absorben a 375 px.
