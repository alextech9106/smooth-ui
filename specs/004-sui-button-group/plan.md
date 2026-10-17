# Plan 004 — sui-button-group

Status: approved (2026-10-17)

Spec: `specs/004-sui-button-group/spec.md` (aprobada el 2026-10-17) y las enmiendas de FR-7 (`pressed`) de
`specs/002-sui-button/spec.md` y `specs/003-sui-icon-button/spec.md` (aprobadas el 2026-10-17). La pregunta abierta
(entradas deshabilitadas, identidad de las entradas, output de activación, línea de `primary`, radio de `rounded`) queda
diferida y no bloquea. Este plan solo cambia lo que dicen los FR: la regla de nombre del tipo `icon` (FR-5), el rol y el
`label` del grupo (FR-6), el estado pulsado (FR-7, FR-7 de 002/003), los tests que faltan y la demo. Los aspectos, los
anillos, el recorte, los archivos `.scss`, `SuiButton` y la navegación con flechas no cambian (propietario: sin flechas
en este ciclo). La API pública conserva todos sus campos e inputs.

## Archivos y responsabilidades

Sin archivos nuevos en la librería. `public-api.ts` no cambia: ningún tipo exportado nuevo; el componente y los dos
tipos del grupo ya se exportan, y los inputs nuevos van en componentes exportados.

Modificados:

- `sui-button/sui-button.component.ts` — input nuevo, colocado después de `expanded`:
  `public pressed: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);` (D1). FR-7 de 002.
- `sui-button/sui-button.component.html` — `[aria-pressed]="pressed() ?? null"` en el `<button>`. FR-7 de 002.
- `sui-icon-button/sui-icon-button.component.ts` — el mismo input `pressed`, después de `variant` (D1). FR-7 de 003.
- `sui-icon-button/sui-icon-button.component.html` — `[aria-pressed]="pressed() ?? null"` en el `<button>`. FR-7 de 003.
- `sui-button-group/sui-button-group.component.ts` — input `label`, los computeds `groupName` e `iconLabels` y los
  metadatos `host` (ver API pública y Estado). FR-5, FR-6.
- `sui-button-group/sui-button-group.component.html` — las dos ramas enlazan `[pressed]="button.selected"` (tal cual)
  junto al `[selected]="button.selected ?? false"` sin cambios; la rama `icon` enlaza `[label]="iconLabels()[$index]"`
  en lugar de `button.label ?? button.name`. Todo lo demás (tracks, `callback?.()`, `'flat'`, tamaño, variante, el
  `div` interior) se queda. FR-4, FR-5, FR-7.
- Specs: `sui-button-group.component.spec.ts` (la mayoría de los tests nuevos), `sui-button.component.spec.ts`,
  `sui-icon-button.component.spec.ts`, `sui-button-split.component.spec.ts` (ver Estrategia de tests).
- `apps/smooth-ui-demo/src/app/app.component.ts` y `.html` — añadidos de la demo (ver Demo).
- `.prettierignore` — línea nueva `docs/smoothui-interactivo.html` (aprobada por el usuario): la referencia de diseño es
  HTML de terceros y no debe hacer fallar `format:check`.
- `specs/003-sui-icon-button/spec.md` — nada: su caso límite "Nombre accesible" ya recoge la regla de FR-5 (criterio de
  finalización 1, comprobado).

Leídos, sin cambios:

- `sui-button-group.component.scss` — radios de FR-8 (`-flat`/`-rounded`/`-pill`), contorno y separadores de FR-9, y el
  `overflow: hidden` que hay detrás de FR-10. Sin movimiento propio (NFR-3).
- `sui-button.component.scss`, `sui-icon-button.component.scss` — aspecto de seleccionado, anillos (FR-7, FR-10).
- `sui-button-split.component.ts/html` — no pasa `label` ni `selected`, así que su grupo no tiene nombre y sus segmentos
  no anuncian estado pulsado; `expanded` se queda en la flecha; nunca pone `type`, así que el cambio del tipo `icon` de
  FR-5 no le llega. `_focusTrigger` busca `sui-button-group button` y sigue encontrando la flecha. Sin cambios de código.
- `interfaces/sui-button.interface.ts` — `SuiButton` sin cambios; `selected` es el origen de la entrada para `pressed`
  (D2).

## API pública

- `sui-button`: input nuevo `pressed: boolean | undefined` (por defecto `undefined`). `true`/`false` ponen
  `aria-pressed`; `undefined` no pone ninguno. Independiente de `selected`; se mantiene mientras está deshabilitado o
  cargando. FR-7 de 002.
- `sui-icon-button`: el mismo input `pressed` con el mismo comportamiento, se mantiene mientras está deshabilitado. FR-7
  de 003.
- `sui-button-group`: input nuevo `label: string` (por defecto `''`), el nombre accesible del grupo cuando no está en
  blanco (FR-6). Los inputs `buttons` (obligatorio, FR-1), `shape` (`flat`), `size` (`md`), `type` (`button`) y
  `variant` (`ghost`) no cambian. Sin output (FR-3). El host recibe `role="group"` (FR-6).
- Cambio de comportamiento (incompatible, tipo `icon`): un `label` en blanco ahora recurre a `name` en lugar de no dar
  nombre (FR-5).
- Tipos exportados sin cambios: `SuiButton`, `SUI_BUTTON_GROUP_TYPE`, `SUI_BUTTON_GROUP_VARIANT`.

## Estado y lo que se deriva de él

Todo derivado con `computed()`; sin `effect()`, sin hooks del ciclo de vida, sin estado escribible. El orden de miembros
sigue a ESLint (private → public → protected), con tipos explícitos como en el resto de los archivos.

- `groupName: Signal<string | null>` del grupo — `label()` tal cual (sin recortar) cuando `label().trim()` no está vacío
  y, si no, `null` (se quita el atributo). FR-6, NFR-2.
- `iconLabels: Signal<string[]>` del grupo — por entrada, en el orden de la lista: el `label` tal cual cuando
  `label?.trim()` no está vacío y, si no, el `name` tal cual. Se pasa a `sui-icon-button`, cuya propia regla convierte
  un valor en blanco en ningún `aria-label`. FR-5 (D3).
- Segmentos de texto: el camino no cambia — `name` y `label ?? ''` van a `sui-button`, cuyo computed de FR-5 da el
  nombre.
- Pulsado: `button.selected` tal cual a `pressed` (`true`/`false`/`undefined`); `selected ?? false` solo para el
  aspecto. Un `selected: undefined` explícito es "no dado" (Definiciones de la spec) y no da `aria-pressed`. FR-7 (D2).
- Sin cambios: las `classes` del grupo (FR-8, FR-9 mediante `sui-button-group-<shape|size|variant>`).

## Dónde viven los efectos secundarios del navegador

No se añade ninguno. Ningún componente toca un global del navegador; el uso existente de `window`/`document` del split
no se toca.

## Plantilla y accesibilidad

- Host: `host: { role: 'group', '[aria-label]': 'groupName()' }` (regla del proyecto: `[aria-*]`, no
  `[attr.aria-*]`). El rol va en el propio `sui-button-group`, así que el `div` interior y el orden de los segmentos se
  quedan y los selectores del `.scss` siguen coincidiendo (D4). FR-6.
- Sin `tabindex`, sin listener de teclas, sin gestión del foco: cada segmento es un `<button>` nativo, su propia parada
  de Tab en el orden de la lista. Sin flechas (fuera de alcance). FR-6.
- Segmentos: `[aria-pressed]` a partir de `pressed` (FR-7); el tipo texto mantiene `[expanded]` → `aria-expanded` +
  `aria-haspopup` junto a él (se anuncian los dos, caso límite "Pulsado"); el tipo icono no recibe `expanded` (sin
  anunciar, como hoy).
- Activación: `(trigger)="button.callback?.()"` mantiene la entrada como `this`, no pasa datos y el grupo no emite
  nada; los dos botones interiores son `type="button"` por defecto, así que no envían el formulario (FR-3).
- Los anillos no se tocan (FR-10, problemas conocidos). Los nombres vienen solo de las entradas y de `label` (NFR-2).

## Demo

- `app.component.ts`: `buttonsGroup` pasa a tener Button 1 con `selected: true`, Button 2 con `selected: false` y
  Button 3 sin `selected` (pulsado, no pulsado y sin estado, uno junto a otro; criterio de finalización 4). Nuevo
  `public singleButtonGroup: SuiButton[] = [{ name: 'Single action', icon: 'star' }];` (grupo de una entrada).
- `app.component.html`: cada uno de los 12 grupos existentes recibe un `label` distinto que nombra el tipo, la variante,
  la forma y el tamaño, por ejemplo `label="Icon group (primary, pill, lg)"`. Ya cubren los dos tipos × las dos
  variantes × las tres formas, así que se cumple el conjunto de NFR-4 (cada tipo, variante y forma al menos una vez).
  Una fila nueva debajo: `<sui-button-group [buttons]="singleButtonGroup" label="Single action group" />`.
- Los split buttons no cambian (sirven para comprobar el rol de FR-6 y "sin estado pulsado"). Ninguna regla nueva en
  `app.component.scss`, así que el presupuesto `anyComponentStyle` no se ve afectado; las reglas de Signal Forms /
  Reactive Forms no aplican (no es un control de formulario).

## Decisiones

- **D1. `pressed` es un input simple `boolean | undefined`, sin `booleanAttribute`.** La transformación convertiría
  `undefined` en `false` y anunciaría "no pulsado" donde la spec no quiere estado. Descartado: `booleanAttribute`
  (incorrecto para `undefined`) y reutilizar `selected` para ARIA (el FR-7 de 002/003 mantiene separados el aspecto y el
  anuncio).
- **D2. El grupo traslada `selected` a `pressed`; `SuiButton` no recibe un campo `pressed`.** La spec nombra `selected`
  como el origen de la entrada y mantiene la descripción como está. Descartado: un `SuiButton.pressed` nuevo (un cambio
  de API que ningún FR pide).
- **D3. La regla de nombre del tipo `icon` es una lista `computed()` indexada por `$index`.** Las plantillas enlazan y
  el estado se deriva en `computed()` (principio 3), y el `@for` y su `track` se quedan como están, así que la
  reutilización del DOM del split no cambia. Descartado: un ternario `label?.trim() ? … : …` en línea (lógica en el
  marcado) y una lista de view-model con un seguimiento nuevo (la identidad de las entradas está diferida).
- **D4. `role` y `aria-label` van en el host.** Sin envoltorio nuevo y sin cambios en el `.scss`. Descartado: ponerlos
  en el `div` interior (también funciona, pero el encargo y el contenedor `role="group"` del diseño apuntan al propio
  componente).
- **D5. Aspectos mediante clases en Vitest; esquinas, líneas, colores, anillos y el árbol de accesibilidad en el
  navegador.** jsdom no aplica los estilos de los componentes ni `theme.scss`. Descartado: aserciones con
  `getComputedStyle`.

## Estrategia de tests (Vitest y TestBed, jsdom)

Se ejecutan con `pnpm nx run smooth-ui:test`. Inputs con `fixture.componentRef.setInput()` y después
`await fixture.whenStable()`. Los tests existentes se quedan; "names icon buttons after the button name" del grupo y los
dos tests de entradas de texto siguen pasando.

`sui-button-group.component.spec.ts` (nuevos):

- **FR-1**: un fixture nuevo sin `buttons` lanza `NG0950` en `detectChanges()`; `[]` no pinta ningún `<button>`.
- **FR-2**: tres entradas pintan tres botones en el orden de la lista, en una fila (un solo `div` interior); el tipo
  `button` muestra el `<svg>` del icono antes del texto del `name`; el tipo `icon` muestra un `<svg>` por segmento y
  ningún texto, también para una entrada sin `icon`.
- **FR-3**: en cada tipo, un clic llama a `callback` una vez, sin argumentos y con la entrada como `this`
  (`mock.contexts[0]`); una entrada sin `callback` recibe el clic sin error; la entrada sigue siendo igual a una copia
  tomada antes (ningún cambio de `selected`); un anfitrión dentro del spec con un `<form (submit)>` alrededor del grupo
  no registra ningún envío.
- **FR-4**: los valores por defecto dan `sui-button-md`, `sui-button-ghost`, `sui-button-flat` (y `sui-icon-button-*`);
  `size` `lg` y `variant` `primary` llegan a todos los segmentos en los dos tipos; una entrada con su propio `size`,
  `variant` o `shape` sigue mostrando los valores del grupo; `name`, `label` e `icon` llegan al segmento.
- **FR-5**, tipo `button`: `label` `" Bold "` → `aria-label` `" Bold "`; `label` `""`, `name` `" Bold "` → sin
  `aria-label`, texto `"Bold"` recortado; `label` `"  "`, `name` `" Bold "` → `aria-label` `" Bold "`; resultados sin
  nombre: `name` `""` + `label` `""` → `aria-label` `""`; `name` `"  "` + `label` `""` → sin `aria-label`, texto de
  espacios; `name` `"  "` + `label` `" "` → `aria-label` solo de espacios. Tipo `icon`: `label` `" Bold "` →
  `" Bold "`; `label` `"  "`, `""` o ausente con `name` `" Bold "` → `" Bold "`; los dos en blanco → sin `aria-label`.
  Un espía de `console.error`/`warn` no se llama (no se avisa de nada).
- **FR-6**: el `role` del host es `group`; `label` `" Tools "` → `aria-label` del host `" Tools "`; `""`, `"  "` y sin
  valor → sin `aria-label`; los segmentos no tienen atributo `tabindex` y tienen `tabIndex` 0, en el orden de la lista;
  un keydown de `ArrowRight` lanzado en el primer segmento deja `document.activeElement` en él (sin manejo de teclas).
- **FR-7**, en los dos tipos: `selected` `true` → clase de seleccionado + `aria-pressed="true"`; `false` → sin clase +
  `"false"`; ausente y `undefined` explícito → sin clase y sin `aria-pressed`; un grupo que mezcla los tres. Tipo
  `button`: `expanded` `false` con y sin `selected` → `aria-expanded="false"`, `aria-haspopup="menu"`, y `aria-pressed`
  solo con `selected`. Tipo `icon` con `expanded` → sin `aria-expanded`.
- **FR-8, FR-9**: clases del grupo `sui-button-group-flat` (por defecto), `-rounded`, `-pill`; `-ghost` (por defecto),
  `-primary`; los segmentos mantienen `flat` en cualquier forma del grupo.
- **NFR-2**: con `[]` y sin `label`, el contenido de texto del host está vacío y no tiene `aria-label` (sin texto
  propio).

`sui-button.component.spec.ts` (FR-7 de 002): `pressed` `true` → `aria-pressed="true"`; `false` → `"false"`; sin valor y
`undefined` → ninguno; `selected` sin `pressed` → ninguno (test existente); `pressed` con `expanded` → los dos; se
mantiene mientras `disabled` y mientras `loading`.

`sui-icon-button.component.spec.ts` (FR-7 de 003): `true`/`false`/sin valor/`undefined` como arriba; `selected` solo →
ninguno (test existente); se mantiene mientras `disabled`.

`sui-button-split.component.spec.ts`: en los dos modos, el `sui-button-group` interior tiene `role="group"` y ningún
`aria-label`, y ningún segmento tiene `aria-pressed`, también después de abrir el menú; los tests existentes de foco,
Escape y selección siguen en verde (cubren las entradas reconstruidas y el `track` sin cambios).

## Lo que queda para la validación (navegador, MCP de Chrome DevTools)

- **FR-1 en el marcado**: un `<sui-button-group />` temporal hace fallar `pnpm nx run smooth-ui-demo:build`; se quita.
- **FR-8, FR-9**: radios (0, 10 px, extremos redondos) y líneas (1 px, borde por defecto; `primary` acento sólido, sin
  contorno) en los dos temas. **FR-10**: anillo de teclado por segmento, recortado en los bordes y tapado por el
  segmento siguiente; ninguno visible en el primer segmento `primary` ni en el grupo de una entrada (problemas conocidos
  confirmados, no arreglados).
- **FR-6, FR-7**: el árbol de accesibilidad muestra el `group` con nombre, los nombres de los segmentos y pulsado
  `true`/`false`/ninguno; el split muestra un grupo sin nombre y sin estado pulsado; Tab recorre cada segmento en orden.
- **NFR-3**: con movimiento reducido emulado, las transiciones de los segmentos son `0s`. **NFR-4**: confirmar el fondo
  canvas, cargar axe 4.10.2 desde cdnjs (sin paquete) y ejecutarlo sobre las secciones del grupo y del split con
  `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: cero infracciones en los temas claro y oscuro. **NFR-1,
  NFR-2**: ningún `package.json` cambiado, ningún texto nuevo en la librería.

## Cobertura de los FR

- FR-1: sin cambio (input obligatorio) · test unitario + comprobación de build de la demo.
- FR-2, FR-3, FR-4: sin cambio · tests unitarios (orden del DOM, callback, clases e inputs).
- FR-5: `iconLabels` + el `[label]` de la rama de icono · tests unitarios de cada caso límite y resultado sin nombre.
- FR-6: `label`, `groupName`, rol y nombre del `host` · tests unitarios + árbol de accesibilidad.
- FR-7: `pressed` en los dos botones + `[pressed]` en las dos ramas · tests unitarios (grupo, 002, 003, split) + árbol.
- FR-8, FR-9: sin cambio · tests de clases + navegador. FR-10: sin cambio · navegador (problemas conocidos recogidos).
- NFR-1 a NFR-4: labels de la demo, grupo de una entrada, `selected` mezclado · comprobaciones + axe en los dos temas.

## Comprobación de la constitución

1 sin dependencias · 2 specs 002/003/004 actualizadas antes del código · 3 la plantilla enlaza, los nombres se derivan en
`computed()`, sin efectos secundarios · 4 specs de Vitest/TestBed junto a cada componente · 5 sin tratamiento de datos ·
6 ningún texto nuevo, cada nombre es un input · 7 el comportamiento se añade con inputs nuevos (`pressed`, `label`);
ninguna rama crece por una variante nueva.

## Nota de release (para `MEMORY.md` y la release)

Incompatible: en el tipo `icon`, un `label` de entrada en blanco ahora recurre a su `name`. Nuevo: `sui-button-group`
tiene `role="group"` y un `label` opcional (su nombre accesible cuando no está en blanco); `sui-button` y
`sui-icon-button` ganan un input `pressed` (`aria-pressed`; sin valor no da ninguno), que los segmentos del grupo
reciben del `selected` de cada entrada. Problemas conocidos: los anillos del grupo se recortan en los bordes y los tapa
el segmento siguiente, sin anillo visible en el primer segmento `primary` ni en un grupo de una entrada (SC 2.4.7);
anillo oscuro de unos 1:1 con el hover de `primary` y 1.4:1 en reposo.

## Verificación

`pnpm nx run smooth-ui:test` después de cada tarea; al final
`pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (el propietario o el implementer; el planner no
puede ejecutar Prettier).

## Riesgos y trampas

- `booleanAttribute` en `pressed` anunciaría en silencio "no pulsado" en cada botón sin valor (D1).
- El split reconstruye sus entradas en cada apertura o cierre del menú; `iconLabels` se recalcula, pero los tracks siguen
  siendo `label ?? name`, así que el DOM se reutiliza y el foco se queda en la flecha. Cambiar el `track` rompería la
  vuelta del foco del split.
- La encapsulación emulada (ShadowCss) limita `sui-button:not(:first-child)` a los elementos de la propia plantilla del
  grupo: un envoltorio nuevo alrededor de los segmentos o un elemento con `role` entre ellos haría que los separadores
  dejaran de coincidir (`::ng-deep` prohibido).
- Si `'[aria-label]'` en `host` no quita el atributo con `null` en jsdom o en el navegador, los tests de FR-6 fallan; la
  alternativa es `'[attr.aria-label]'`, una desviación de la regla de bindings ARIA que hay que plantear antes de
  aplicarla.
- Un `label ?? name` duplicado entre entradas da un aviso de track duplicado (identidad de las entradas diferida, no se
  arregla aquí).
- Los consumidores que dependían de segmentos de icono sin nombre con un `label` en blanco ahora reciben el `name`
  (incompatible, nota de release).
