# Plan 002 — sui-button

Status: approved (2026-10-16, D6-D8; el propietario acepta que el pulsado de `danger` siga siendo más claro que el hover)

Spec: `specs/002-sui-button/spec.md` (aprobada el 2026-10-16, nombre de FR-5 `label().trim() ? label() : name()`;
reaprobada el 2026-10-16 con el cambio de contraste del tema claro). La revisión anterior de este plan se aprobó el
2026-10-16 con D1 y está implementada (T1-T8); esta revisión añade D6-D8 por el fallo de contraste de NFR-4 que se
encontró en V7. Las seis preguntas abiertas quedan para más adelante, así que este plan solo cambia lo que ya dicen los
FR y los NFR: el nombre de FR-5 (sin icono como nombre, un `label` solo con espacios recurre al texto), la eliminación
de `SuiButton.iconSize` (incompatible), los tests que faltan, la demo ampliada y, para NFR-4, cinco tokens del tema claro
más un fondo de página en la demo. Los aspectos y estilos del componente (`.scss`) no cambian. Los cambios del usuario
en el árbol de trabajo son el punto de partida y se mantienen: el `name` del split es `input.required<string>()`, el
botón de envío del formulario reactivo de la demo usa `(trigger)` (línea 192), y el `sui-button.component.scss` actual.

## Archivos y responsabilidades

Sin archivos nuevos. `public-api.ts` no cambia.

Modificados:

- `sui-button.component.ts` — una línea: `accessibleName` pasa a ser
  `protected readonly accessibleName: Signal<string> = computed(() => (this.label().trim() ? this.label() : this.name()));`
  (se mantiene el tipo explícito, como en el resto del archivo). Nada más cambia. FR-4, FR-5.
- `interfaces/sui-button.interface.ts` — quita `iconSize?: number` (incompatible). Caso límite "Sin tamaño de icono".
- `sui-button.component.spec.ts` — se actualiza el test que espera el id del icono como nombre y se añaden los tests
  nuevos.
- `sui-button-split.component.spec.ts` — FR-1 (creado desde código sin `name`) y FR-5 (`name` en blanco).
- `sui-button-group.component.spec.ts` — FR-5 para las entradas de texto.
- `apps/smooth-ui-demo/src/app/app.component.ts` — listas tipadas para la matriz de la demo. Criterio de finalización 4.
- `apps/smooth-ui-demo/src/app/app.component.html` — la matriz diferida y los ejemplos nuevos. Criterio de
  finalización 4.
- `libs/smooth-ui/theme/theme.scss` — cinco líneas del bloque `:root, [data-theme='light']` (D6). NFR-4.
- `apps/smooth-ui-demo/src/styles.scss` — recibe `html, body { background-color: var(--sui-color-bg-canvas); }` después
  del `@use` del tema que ya existe (D7). NFR-4, criterio de finalización 5.
- `apps/smooth-ui-demo/project.json` — la entrada `styles` de la build pasa de `["./libs/smooth-ui/theme/theme.scss"]`
  a `["apps/smooth-ui-demo/src/styles.scss"]`, que ya hace `@use` del tema; hoy `styles.scss` no entra en la build, así
  que sin esta línea D7 no tiene efecto (D7, cambio de configuración aprobado por el propietario el 2026-10-16).

Leídos, sin cambios:

- `sui-button.component.html` — el binding `[aria-label]` se queda como hoy (ver D1). FR-4, FR-5, FR-6.
- `sui-button.component.scss` — todas las reglas de aspecto, tamaño, forma, indicador y movimiento reducido. FR-3, FR-4,
  FR-7 a FR-10, NFR-3. La clase de deshabilitado depende solo de `disabled`, así que cargando mantiene los aspectos de la
  variante, de `selected` y de `focus`.
- `sui-button-split.component.ts/html` — `name` ya es obligatorio (FR-1); sus entradas alimentan al grupo, así que FR-5
  llega al split sin cambiar código (entrada principal: `name`; modo icono: `name` como `label`; parte del menú: `""` +
  "More options").
- `sui-button-group.component.ts/html` — pasa `name` y `label ?? ''` a cada `sui-button`; FR-5 llega a las entradas de
  texto sin cambiar código. Las entradas de icono pintan `sui-icon-button` y no se ven afectadas.
- `interfaces/sui-icon-button.interface.ts` — conserva su propio `iconSize` (`sui-icon-button` está fuera de alcance).
- `sui-button.component.scss` (otra vez, para D6) — `primary` usa `accent-solid`/`-hover`/`-active` en reposo/hover/
  pulsado; `danger` usa `danger-solid` en reposo, `danger-solid-hover` en hover y otra vez `danger-solid` en `:active`
  (línea 129), lo que confirma la consecuencia aceptada en la spec: en claro, el pulsado (`danger-600`) es más claro que
  el hover (`danger-700`). El borde en hover de `outline` también usa `accent-solid`, así que en claro se oscurece un
  paso (no es texto, no afecta a ningún FR).
- `.scss` de `sui-icon-button`, `sui-button-group`, `sui-text-field` y `sui-textarea` — 9 usos de los tokens
  reasignados (icon-button 4, text-field 2, textarea 2, group 1); no cambian ni se revisan (spec, fuera de alcance).

## API pública

- Selector `sui-button`. Inputs sin cambios: `name` (obligatorio, FR-1), `icon`, `label`, `expanded`
  (`boolean | undefined`, FR-6), `shape` (`rounded`), `size` (`md`), `state` (`default`), `type` (`button`), `variant`
  (`primary`), y los inputs de atributo booleano `disabled`, `fullWidth`, `iconEnd`, `loading`, `selected`.
- Output `trigger: void` (FR-2), la única forma admitida de reaccionar a la activación; sin `stopPropagation`.
- El tipo exportado `SuiButton` pierde `iconSize` (incompatible; nota de release en "Next steps" de `MEMORY.md`).
- Cambio de comportamiento (incompatible): un icono ya no da nombre al botón; un `label` solo con espacios ya no se
  convierte en el nombre. Nada se comprueba ni se avisa en tiempo de ejecución (FR-5).

## Estado y lo que se deriva de él

Todo derivado con `computed()`; sin `effect()`, sin hooks del ciclo de vida, sin estado escribible nuevo.

- `accessibleName: Signal<string>` — `label()` tal cual (sin recortar) si `label().trim()` no está vacío y, si no,
  `name()`; nunca `icon()`. FR-4 (se mantiene mientras carga), FR-5.
- Sin cambios: `showIconStart`, `showIconEnd`, `computedIconSize` (16/20/24), `classes` (FR-3, FR-7, FR-8, FR-10).

## Dónde viven los efectos secundarios del navegador

No se añade ninguno. El componente no toca ningún global del navegador; el sprite de iconos sigue en `SuiIconService`
(spec 001).

## Plantilla y accesibilidad

- `<button>` nativo con `[type]` (FR-2) y `[disabled]="disabled() || loading()"`: no disponible y fuera del orden de
  foco (FR-3, FR-4); la activación por teclado la da el botón nativo, sin manejador de teclas propio (FR-2).
- `[aria-label]` sin cambios: `accessibleName()` cuando `label` no es `""`, mientras carga, o cuando `name` es `""`; si
  no, `null`, de modo que el texto visible es el nombre nativo. Con el nuevo computed esto da, caso por caso: `label` no
  en blanco → el `label`; `label` solo con espacios → el `name` (igual que el texto visible, FR-5); cargando → el nombre
  de FR-5 (FR-4); `label` en blanco y `name` `""` → un `aria-label` vacío, un nombre en blanco, sin aviso (caso límite
  "Nombre accesible").
- `[aria-busy]` mientras carga (FR-4), `[aria-expanded]` y `[aria-haspopup]="'menu'"` solo cuando se da `expanded`
  (FR-6). Sin `aria-pressed` para `selected` (FR-7).
- El spinner `aria-hidden="true"` sustituye al icono y al texto mientras carga (FR-4); los iconos se ocultan mediante
  `sui-icon` (FR-9).
- `sui-spacing-8` solo cuando `name` es `""`; un `name` solo con espacios mantiene el span de texto y el relleno normal
  (FR-9).

## Demo

- `app.component.ts` recibe `buttonVariants: SUI_BUTTON_VARIANT[]` (6), `buttonSizes: SUI_SIZE[]` (3) y
  `buttonStates: DemoButtonState[]` (8: por defecto, `selected`, `loading`, `disabled`, `state` `focus`,
  `selected`+`loading`, `focus`+`loading`, `disabled`+`loading`). `DemoButtonState` es una interfaz local
  `{ id; text; selected; loading; disabled; state: SUI_STATE }`; cada `text` no está en blanco (NFR-4).
- `app.component.html`: `@for` anidados (variante `track variant`, tamaño `track size`, estado `track state.id`)
  pintan 6 × 3 × 8 = 144 botones, una `.row` por variante y tamaño bajo un `<h2>` por variante. Sustituyen a los
  botones existentes de una sola variante, un solo estado y tamaño (líneas 21-29 y 35-38); se quedan los ejemplos de
  icono, `iconEnd`, formas y `fullWidth`. Ejemplos nuevos: un botón solo con `label` (`name=""`, icono, `label`), un
  `label` que contiene su texto (`name="Save"`, `label="Save draft"`) y `expanded` `false` y `true`.
- La matriz va dentro de `@defer (on viewport)` con un `@placeholder` (un elemento, un texto corto como "Button matrix")
  y un bloque `@loading` (texto corto). El bloque `@defer` va envuelto en un contenedor con un `id` estable
  (`button-matrix`) al que hacer scroll: el contenedor se mantiene cuando el bloque carga, mientras que el placeholder se
  sustituye. Los ejemplos nuevos quedan fuera del defer.
  `sui-button` también se usa de forma inmediata en la página, así que el defer solo retrasa el renderizado; no se
  espera un chunk aparte.
- La línea 192 mantiene `(trigger)`; ningún `sui-button` usa `(click)`.
- Presupuesto: ninguna regla nueva en `app.component.scss` (reutiliza `.row` y `.col`), así que `anyComponentStyle`
  (aviso a 4 kb) no se ve afectado; el tamaño de la plantilla no cuenta para él.

## Decisiones

- **D1. Mantener el binding `[aria-label]` de hoy.** La spec fija el nombre, no cómo se expone, y el binding ya da el
  nombre de FR-5 en todos los casos; un `label` solo con espacios da un `aria-label` igual al texto visible, que es
  redundante pero correcto. Descartado: poner siempre `aria-label` (redundante en todas partes, un cambio mayor en la
  salida) y cambiar la condición a `label().trim()` (la spec no lo pide; un cambio sin FR).
- **D2. FR-5 es un solo computed, sin comprobación en tiempo de ejecución.** Elección del usuario: sin token, helpers,
  errores ni cambio en `public-api.ts`. Descartado: un fallo en modo desarrollo (más código del que pide la spec).
- **D3. Sin cambios de código en el split button ni en el grupo.** FR-5 les llega a través de `sui-button`. Descartado:
  proteger los nombres en el grupo (los grupos están fuera de alcance salvo FR-1 y FR-5).
- **D4. La matriz de la demo se genera con `@for` a partir de listas tipadas, dentro de `@defer (on viewport)`.**
  Mantiene ligero el primer renderizado. Descartado: 144 líneas escritas a mano y renderizar la matriz de inmediato.
- **D5. Los aspectos se prueban mediante clases; los colores, tamaños, anillos y movimiento, en el navegador.** jsdom no
  aplica de forma fiable los estilos del componente. Descartado: aserciones con `getComputedStyle` en Vitest.
- **D6. Reasignar un paso más oscuros los tokens semánticos compartidos del tema claro.** Elección del propietario, solo
  en el bloque claro; el texto sobre sólido se queda en `--sui-neutral-0` (#ffffff); el bloque oscuro y los dos anillos
  de foco escritos a mano no se tocan. Contraste WCAG estimado del texto blanco (a medir, D8):

  | Token (claro)                     | Antes                      | Después                    | Texto blanco |
  | --------------------------------- | -------------------------- | -------------------------- | ------------ |
  | `--sui-color-accent-solid`        | `--sui-accent-500` #6e76ee | `--sui-accent-600` #5a5fd8 | 3.82 → ~5.2  |
  | `--sui-color-accent-solid-hover`  | `--sui-accent-600` #5a5fd8 | `--sui-accent-700` #494cb0 | ~5.2 → ~7.1  |
  | `--sui-color-accent-solid-active` | `--sui-accent-700` #494cb0 | `--sui-accent-800` #3a3c8a | ~7.1 → ~9.6  |
  | `--sui-color-danger-solid`        | `--sui-danger-500` #de5265 | `--sui-danger-600` #c03c50 | 3.81 → ~5.2  |
  | `--sui-color-danger-solid-hover`  | `--sui-danger-600` #c03c50 | `--sui-danger-700` #9a2f3f | ~5.2 → ~7.4  |

  El pulsado de `danger` reutiliza `--sui-color-danger-solid` (~5.2:1). Descartado: tokens nuevos solo para el botón
  (nombres de token públicos nuevos en un recurso distribuido, y AGENTS.md prohíbe renombrar variables del tema) y un
  token `danger-solid-active` (el propietario no quiere tokens nuevos). Motivo de bajar un paso: es el cambio más
  pequeño que supera 4.5:1 con margen.

- **D7. La demo pinta el canvas del tema en `html` y `body`.** `ThemeService` pone `data-theme` en `<html>`, y el
  bloque claro también coincide con `:root`, así que `--sui-color-bg-canvas` se resuelve en `html` y `body` lo hereda en
  los dos temas. La regla va en el `styles.scss` global de la demo, que entra en la build al poner el
  `build.options.styles` de `apps/smooth-ui-demo/project.json` en `["apps/smooth-ui-demo/src/styles.scss"]` (relativo
  al workspace y sin `./` inicial, como `browser` y `tsConfig`); así el tema llega a la build solo a través del `@use`
  de ese archivo y no se carga dos veces. Da a axe el color real de la página detrás de los botones transparentes.
  Descartado: un fondo de página en `theme.scss` (cambia la página de cada consumidor, nadie lo ha pedido),
  `app.component.scss` (`:host` no llega a `html`/`body` sin `::ng-deep` o sin desactivar la encapsulación) y un
  `<style>` en línea en `index.html` (estilos que dependen del tema fuera del flujo de SCSS).
- **D8. El contraste se mide en el navegador, no se comprueba en los tests.** jsdom no carga `theme.scss` (D5). V7
  ejecuta axe en los dos temas y una comprobación de contraste por estado (reposo, hover y pulsado de `primary` y
  `danger`) contra los valores de D6. Descartado: tests unitarios que lean los valores de los tokens (probarían el
  texto de la hoja de estilos, no los colores renderizados).

## Estrategia de tests (Vitest y TestBed, jsdom)

Se ejecutan con `pnpm nx run smooth-ui:test`. Inputs con `fixture.componentRef.setInput()` y después
`await fixture.whenStable()`. El resto de tests existentes se quedan como están (el test de `name` "Test" + `label`
"More options" no se ve afectado). D6-D7 no añaden ningún test unitario: ningún spec de `libs/smooth-ui/src` comprueba
nombres de token, valores hex o colores calculados (se buscaron `accent-solid`, `danger-solid`, valores hex y
`getComputedStyle`: sin coincidencias), así que ninguno se rompe; se verifican en el navegador (D8).

Test actualizado (`sui-button.component.spec.ts`, ~línea 70):

- "uses the icon as accessible name when there is no text" pasa a ser "never uses the icon as accessible name": `name`
  `""`, icono `check`, sin label → `aria-label` es `""`, no `check`.

Tests nuevos en `sui-button.component.spec.ts`:

- **FR-1**: un fixture nuevo sin `name` falla en `detectChanges()` (input obligatorio, `NG0950`).
- **FR-2**: un clic emite un `trigger` con `undefined`; keydown/keyup de Enter y Espacio no emiten nada por sí solos
  (sin manejo propio de teclas, así que una pulsación real da una emisión). Un componente anfitrión dentro del spec con
  un formulario, un input y botones de `type` `submit`/`reset`/por defecto: `submit` lanza un evento de envío del
  formulario (el anfitrión evita el comportamiento por defecto) y un `trigger`; `reset` restaura el valor inicial del
  input; el tipo por defecto no lanza ningún evento de envío.
- **FR-3**: `disabled` solo y con `loading`: `disabled` nativo, sin emisión, `sui-button-disabled` presente, `focus()`
  no le da el foco.
- **FR-4**: spinner presente y `aria-hidden`, sin `sui-icon` y sin texto; `aria-busy="true"`; `aria-label` "Test";
  con `label` "Save draft" el `aria-label` sigue siendo "Save draft"; se mantiene la clase de la variante, sin
  `sui-button-disabled`; con `selected` o `state` `focus` se mantienen sus clases. Foco: dar el foco al botón, entrar
  en `loading`, `document.activeElement` es el botón o `body`.
- **FR-5**: `label` usado tal cual: `label` `" Save draft "` → `aria-label` `" Save draft "` (sin recortar); recurso
  por espacios: `name` "Save", `label` `"  "` → `aria-label` "Save"; sin recurso al icono: `name` `""`, icono `check`,
  `label` `"  "` → `aria-label` `""`; `name` `""` + icono + `label` "Save" → `aria-label` "Save"; un `label` que no lo
  contiene ("Save"/"Store") se renderiza con `aria-label` "Store" y sin error (no se avisa de nada).
- **FR-6**: sin valor → sin `aria-expanded`/`aria-haspopup`; `false` y `true` → el valor y `menu`.
- **FR-7**: por defecto `sui-button-primary`; `variant` `danger` → `sui-button-danger`; `selected` →
  `sui-button-selected` y sin `aria-pressed`.
- **FR-8**: por defecto `sui-button-md` y `sui-button-rounded`; clases `lg`/`pill`; `fullWidth` →
  `sui-button-full-width`.
- **FR-9**: icono antes del texto, después con `iconEnd`; ancho del icono 16/20/24 para `sm`/`md`/`lg`; `name` `""` →
  `sui-spacing-8` y sin texto; `name` de espacios con `label` "Save" → se mantiene el span de texto, sin `sui-spacing-8`.
- **FR-10**: `state` `focus` → `sui-button-focus`.

Tests nuevos en otros archivos:

- `sui-button-split.component.spec.ts`: sin `name` falla en `detectChanges()` (FR-1); `name` `"  "` se renderiza sin
  error en los modos por defecto e icono (FR-5, sin aviso); los tests existentes siguen pasando con `name` "Save".
- `sui-button-group.component.spec.ts`: la entrada de texto `{ name: 'Bold', label: 'Italic' }` se renderiza con
  `aria-label` "Italic" y sin error; `{ name: '', icon: 'check', label: 'Bold' }` recibe `aria-label` "Bold" (FR-5).

## Lo que queda para la validación (navegador, MCP de Chrome DevTools)

- **FR-1 en el marcado**: un `<sui-button />` y un `<sui-button-split />` temporales en la demo hacen fallar
  `pnpm nx run smooth-ui-demo:build`; se quitan después. **Sin tamaño de icono**: un literal `SuiButton` temporal con
  `iconSize` hace fallar `pnpm nx typecheck smooth-ui`; se quita después.
- **FR-2**: Enter y Espacio reales dan un `trigger`; el envío del formulario reactivo funciona mediante `(trigger)`.
- **FR-3, FR-4**: aspecto y cursor de deshabilitado, aspecto de carga, cursor pointer, estrechamiento y foco tras entrar
  en carga. Observar también (no es un requisito) si un listener de clic en bruto se dispara mientras no está disponible
  (trampa de `MEMORY.md`).
- **FR-5**: en el árbol de accesibilidad, los botones de la demo solo con `label` y con un `label` que contiene su texto
  exponen su `label`.
- **Matriz diferida**: antes de cualquier comprobación de la matriz, hacer scroll hasta el contenedor `#button-matrix` y
  esperar a que la página tenga los 144 botones de la matriz (los textos del placeholder y de carga han desaparecido).
  Repetirlo tras cambiar de tema solo si la página se recarga.
- **FR-7, FR-8, FR-10**: aspectos de hover y pulsado, altos, rellenos y radios medidos, anillo de foco por teclado y
  anillo de `state` `focus`, en los temas claro y oscuro. **NFR-3**: con movimiento reducido emulado, las transiciones
  son `0s` y el indicador da una vuelta cada 2 s.
- **NFR-4**: en la demo servida, con la matriz diferida cargada, cargar `axe-core` en la sesión de la página desde un
  CDN (consola de DevTools o la evaluación de scripts del MCP; sin añadir paquetes) y ejecutarlo sobre la sección de
  botones con las etiquetas `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; se esperan cero infracciones,
  después cambiar al tema oscuro y volver a ejecutarlo. Los estados de hover y pulsado quedan fuera de lo que comprueba
  axe; axe tampoco mide el contraste de los botones deshabilitados (WCAG exime a los controles inactivos). Antes de
  ejecutarlo, confirmar que `getComputedStyle(document.body).backgroundColor` es el color del canvas (#f8f9fb en claro,
  #10141b en oscuro); si no, axe mide contra una página blanca supuesta (D7).
- **Contraste de NFR-4 por estado (V7)**: en el tema claro, leer el `background-color` y el `color` calculados de un
  botón `primary` y uno `danger` en reposo y con `:hover` forzado ("Force element state" de DevTools); el pulsado
  (`:active`) lo comprueba a mano el propietario, como en V6. Se esperan #5a5fd8/#494cb0/#3a3c8a y
  #c03c50/#9a2f3f/#c03c50 con texto blanco, cada uno medido a 4.5:1 o más (D6 estima un mínimo de unos 5.2:1). En el
  tema oscuro, comprobar que los mismos estados llegan a 4.5:1 con los tokens sin cambios. Echar también un vistazo a
  icon-button, group, text-field y textarea en la demo (efecto secundario, sin FR).
- **NFR-1, NFR-2**: ningún `package.json` ha cambiado; ningún texto nuevo en la librería.
- Comprobaciones completas: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck`; la build de la
  demo no da ningún aviso nuevo de `anyComponentStyle` (el de `sui-button.component.scss` que ya existe sigue pendiente).

## Cobertura de los FR

FR-1 tests + comprobación de build · FR-2 tests + navegador · FR-3, FR-4 tests + navegador · FR-5 tests + árbol de
accesibilidad · FR-6 tests · FR-7 a FR-10 tests de clases + navegador · NFR-1, NFR-2 comprobaciones · NFR-3 navegador ·
NFR-4 D6 + D7 + navegador (axe en los dos temas y la comprobación de contraste por estado).

## Riesgos

- Se supone que jsdom admite el envío y el reinicio de formularios; si no, submit/reset pasan a la validación en el
  navegador.
- Incompatible para los consumidores: los nombres que solo venían del icono (en botones y entradas de grupo) quedan en
  blanco, sin aviso; hace falta una nota de release.
- La spec permite un `aria-label` vacío en un botón con `label` y `name` en blanco; axe lo marcaría, así que la demo no
  debe tener ninguno (NFR-4 exige un nombre no en blanco).
- Si axe se ejecuta antes de que cargue el bloque diferido, solo comprobaría el placeholder y pasaría en falso; el paso
  de validación de arriba lo evita.
- D6 cambia tokens compartidos de un recurso distribuido: `sui-icon-button` (fondos sólido/hover/pulsado, fondo de
  peligro), `sui-button-group` (separador) y los bordes de foco/error de `sui-text-field` y `sui-textarea` se oscurecen
  un paso en el tema claro, en la demo y en cada consumidor. Lo acepta la spec, sin revisar; necesita una nota de
  release.
- `anyComponentStyle` no se ve afectado: solo mide los archivos `styleUrl` de los componentes, y `theme.scss` y
  `styles.scss` son estilos globales (cuentan para el presupuesto `initial`, aviso a 500 kB, por unos pocos bytes).
- `sui-button.component.scss` se queda en 4.35 kB, por encima del aviso de 4 kB; es anterior a 002, D6 no lo toca y
  sigue como tema pendiente (la build de la demo mantiene ese aviso que ya existía, y ninguno nuevo).
- D7 depende del cambio de `styles` en `project.json`; si el propietario lo rechaza, la regla del canvas no tiene efecto
  y los resultados de axe en oscuro no son válidos.
