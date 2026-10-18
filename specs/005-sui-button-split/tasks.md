# Tareas 005 — sui-button-split

Status: approved

Plan: `specs/005-sui-button-split/plan.md` (aprobado el 2026-10-18). Una tarea cada vez: primero los tests (en rojo
cuando el comportamiento es nuevo), después el código, `pnpm nx run smooth-ui:test` en verde,
`pnpm nx format:check --files=<archivos tocados>` limpio, `MEMORY.md` actualizado, marcar la tarea y parar. Los tests
que recogen comportamiento ya existente no pueden empezar en rojo: el implementer confirma cada uno de ellos con una
mutación temporal del valor esperado en el propio test (nunca en la librería), comprueba que falla, la deshace e informa
de cada test mutado y de su fallo. Las rutas son relativas a `libs/smooth-ui/src/lib/components/sui-button-split/`
salvo que empiecen por `apps/`, `libs/`, `specs/` o un punto. Sin archivos nuevos, ni cambios en `.scss`, `sui-button`,
`sui-button-group`, `MenuItem`, tipos `SUI_BUTTON_SPLIT_*` o `public-api.ts`; la API pública conserva todos sus inputs,
outputs y campos. Orden de miembros de ESLint (private → public → protected, `constructor`, métodos private → public →
protected), tipos explícitos y `_` en los privados. Tests: `setInput()` + `await fixture.whenStable()`, sin `fakeAsync`;
eventos de teclado con `{ key, shiftKey?, bubbles: true, cancelable: true }`; Enter/Espacio se simulan con `click()`.
Los tests existentes del split no se borran ni se debilitan. Las dudas de diseño se consultan primero en
`docs/smoothui-interactivo.html` y después al usuario. El implementer informa de la salida exacta de cada comando; el
coordinador contrasta cada resultado con los archivos.

- [x] **T1. Tests del comportamiento que no cambia: nombre, segmentos, modos y acción principal.** FR-1, FR-2, FR-3,
      FR-4, FR-5
  - Archivos: `sui-button-split.component.spec.ts`.
  - Tests (comportamiento existente, con la mutación del preámbulo): FR-1, el test de `NG0950` se queda y, con `name`
    `''` y `vi.spyOn(console, 'error')`, se pintan los dos segmentos y `console.error` no se llama (no vale
    `not.toThrow()`); FR-2, dos segmentos, la flecha con `use[href="#chevron-down"]`, por defecto
    `sui-button-group-flat`, `sui-button-md`, `sui-button-ghost`; con `size` `lg`, `variant` `primary` y `shape`
    `pill`:
    `size` y `variant` llegan al grupo y a los dos segmentos, `shape` solo al grupo (`sui-button-group-pill`) y los
    dos
    segmentos siguen con `sui-button-flat` (el grupo les pasa siempre `[shape]="'flat'"`, spec 004); FR-3, los dos
    segmentos con `tabIndex` 0; FR-4, modo `default` con texto `Save` sin `aria-label`, modo `icon` con `icon` `check`
    (`use[href="#check"]`, sin texto, `aria-label` `Save`) y con `icon` `''` (sin `svg` ni texto); FR-5, un clic emite
    una vez con `undefined` y no cambia el menú (abierto sigue abierto, cerrado sigue cerrado), y un anfitrión de test
    con `<form (submit)>` no registra envío al pulsar los dos segmentos.
  - Hecho cuando: los tests pasan sin cambiar código de la librería, cada uno se ha visto fallar con su mutación
    temporal (informado), los existentes siguen sin cambios y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T2. Tests del menú que no cambia: estructura, elección, aspecto y cierre.** FR-8, FR-9, FR-10, FR-13
  - Archivos: `sui-button-split.component.spec.ts`.
  - Tests (comportamiento existente, con la mutación del preámbulo): FR-8, `role="menu"` con `aria-label` `Save`,
    opciones en orden con su `use[href]` y su `title`, un `role="separator"` tras cada `separatorAfter`, también tras
    la
    última; FR-9, el clic en una opción emite la misma referencia (`toBe`), cierra y enfoca la flecha, y las opciones
    son
    `<button type="button">`; FR-10, clases `split-menu` y `split-menu-item`; FR-13, Escape desde una opción y desde
    el
    segmento principal cierra y enfoca la flecha, Escape con el menú cerrado no mueve el foco, `pointerdown` en
    `document.body` cierra sin enfocar la flecha y `pointerdown` dentro del menú no cierra
    (`MouseEvent('pointerdown')` si jsdom no tiene `PointerEvent`).
  - Hecho cuando: los tests pasan sin cambiar código de la librería, cada uno se ha visto fallar con su mutación
    temporal (informado) y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T3. Colocación con medidas simuladas e `inject(DOCUMENT)`.** FR-8 (D4)
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`.
  - Primero los tests (verdes contra el código actual: recogen la regla existente; con la mutación del preámbulo): con
    `vi.spyOn(host, 'getBoundingClientRect')`, `vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get')` y
    `Object.defineProperty(window, 'innerHeight', …)`, abrir el menú y comprobar: espacio abajo suficiente → sin
    `split-menu-top`; abajo insuficiente y arriba mayor → con ella; abajo insuficiente y arriba menor → sin ella;
    frontera, espacio abajo igual al alto del menú → sin ella (comparación estricta `<`). En los dos casos el menú
    lleva
    `split-menu` (el hueco de 6 px se mide en el navegador, T10). `afterEach`: `vi.restoreAllMocks()` y el
    `innerHeight` original.
  - Código: `private readonly _document: Document = inject(DOCUMENT);` y `_resolvePlacement()` lee
    `this._document.defaultView?.innerHeight ?? 0`; la regla no cambia. `document.activeElement` en `onMenuKeydown` se
    quita en T7.
  - Hecho cuando: los tests de colocación pasan antes y después del cambio, cada uno se ha visto fallar con su
    mutación
    temporal (informado), `_resolvePlacement()` no usa `window` y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T4. Inputs `arrowLabel` y `menuFallbackLabel`.** FR-6, FR-8, NFR-2 · Depende de: T2
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`,
    `sui-button-split.component.html`.
  - Primero los tests (rojo): la flecha con `aria-label` `More options` por defecto y `More save options` con
    `arrowLabel`, en los dos modos; el menú con `name` `''` → `Options`, y con `menuFallbackLabel` `Choices` →
    `Choices`; `name` `"  "` → `aria-label` `"  "`; NFR-2, con `arrowLabel` y `menuFallbackLabel` sustituidos y `name`
    `''`, ningún `aria-label` ni texto del componente contiene `More options` ni `Options`.
  - Código: tras `menuItems`, `public arrowLabel: InputSignal<string> = input<string>('More options');` y
    `public menuFallbackLabel: InputSignal<string> = input<string>('Options');`; `menuName: Signal<string>`
    (`name() === '' ? menuFallbackLabel() : name()`); `label: this.arrowLabel()` en la flecha de `buttonSplit` e
    `iconSplit`; `[aria-label]="menuName()"` en el menú, sin el literal `'Options'`.
  - Hecho cuando: los tests nuevos pasan, ningún literal `'More options'` ni `'Options'` queda fuera de los valores
    por
    defecto de los inputs y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T5. Sin opciones no abre con clic.** FR-6, FR-7 · Depende de: T3
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`,
    `sui-button-split.component.html`.
  - Primero los tests (rojo en FR-7; los de FR-6 recogen comportamiento existente, con la mutación del preámbulo):
    FR-6, clic abre (`aria-expanded` `true`) y un segundo clic con la flecha enfocada cierra y el foco sigue en ella;
    FR-7, con `menuItems` `[]` el clic no abre, no hay `role="menu"`, `aria-expanded` `false` y `aria-haspopup`
    `menu`.
  - Código: `protected readonly hasItems: Signal<boolean> = computed(() => this.menuItems().length > 0);`;
    `toggleMenu()` no hace nada si está cerrado y `!hasItems()`, si no alterna como hoy (al abrir sigue enfocando la
    primera opción, al cerrar no mueve el foco); el menú se pinta con `@if (menuOpen() && hasItems())`.
  - Hecho cuando: los tests nuevos pasan, los de FR-6 se han visto fallar con su mutación temporal (informado) y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T6. Flecha abajo/arriba sobre la flecha.** FR-7, FR-11 · Depende de: T5
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`.
  - Primero los tests (rojo): FR-7, con `menuItems` `[]`, Flecha abajo y Flecha arriba sobre la flecha dan
    `defaultPrevented` `true` sin menú; FR-11, Flecha abajo sobre la flecha cerrada abre y enfoca la primera opción,
    Flecha arriba la última; con el menú abierto y la flecha enfocada por código, Flecha abajo/arriba lo dejan abierto
    y
    enfocan la primera/última; todas con `defaultPrevented` `true`; un keydown de Flecha abajo lanzado en el segmento
    principal no abre ni se cancela. Con al menos tres opciones para distinguir la última de la penúltima.
  - Código: `_arrowElement(): HTMLButtonElement | null` (último `button` de `sui-button-group` del host), usado por
    `_focusArrow()` (renombrado desde `_focusTrigger`) y por `onArrowKeydown`; `_openMenu(focus: 'first' | 'last')`
    (cerrado: `menuOpen.set(true)` y en `afterNextRender` coloca y enfoca; abierto: enfoca directamente);
    `_focusItem('first' | 'last')`; `toggleMenu()` al abrir llama a `_openMenu('first')`; host
    `'(keydown.arrowdown)': 'onArrowKeydown($event, "first")'` y
    `'(keydown.arrowup)': 'onArrowKeydown($event, "last")'`;
    `onArrowKeydown` solo actúa si `event.target === this._arrowElement()`: siempre `preventDefault()` y, si
    `hasItems()`, `_openMenu(focus)`.
  - Hecho cuando: los tests nuevos pasan, los de T5 siguen en verde, `_arrowElement()` es el único sitio que localiza
    la
    flecha y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T7. Teclado dentro del menú: foco itinerante, Tab y Mayús+Tab.** FR-12, FR-14, FR-16 (D5, D6) ·
      Depende de: T6
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`,
    `sui-button-split.component.html`.
  - Primero los tests (rojo donde son nuevos; los de comportamiento existente, con la mutación del preámbulo): FR-12,
    cada opción y el contenedor con `tabIndex` -1; Flecha abajo/arriba circulares, Inicio y Fin; con el foco en el
    contenedor (`menu.focus()`), Flecha abajo → primera y Flecha arriba → última (regresión: hoy va a la penúltima),
    con al menos tres opciones; FR-14, Tab en una opción → sin menú, `aria-expanded` `false`, `defaultPrevented`
    `false` (el destino va al navegador, T10); FR-16, Mayús+Tab en una opción → `defaultPrevented` `true`, sin menú,
    `aria-expanded` `false`, foco en la flecha. Sin `cancelable: true` los tests de Tab no valen.
  - Código: `tabindex="-1"` en cada `menuitem`; en `onMenuKeydown` el índice sale de `items.indexOf(event.target)`
    (sin
    `document.activeElement`); Flecha arriba `current === -1 ? n - 1 : (current - 1 + n) % n`; `Tab` sin `shiftKey` →
    `menuOpen.set(false)` sin `preventDefault`; con `shiftKey` → `preventDefault()` y `closeMenu()`; el resto igual.
  - Hecho cuando: los tests nuevos pasan, los de Tab comprueban `defaultPrevented` en los dos casos, el componente no
    usa los globales `document` ni `window` (solo `_document`) y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T8. Lista vaciada con el menú abierto.** FR-15 (D2, D3) · Depende de: T6
  - Archivos: `sui-button-split.component.spec.ts`, `sui-button-split.component.ts`.
  - Primero los tests (rojo): con el foco en una opción, `menuItems` `[]` → sin menú, `aria-expanded` `false`, foco en
    la flecha; con el menú abierto y el foco en el segmento principal → se cierra y el foco se queda; volver a dar
    opciones no reabre; cambiar a otra lista no vacía con el menú abierto lo deja abierto.
  - Código: `menuOpen` pasa a `linkedSignal({ source: this.hasItems, computation: () => false })` (sigue
    `WritableSignal<boolean>`); un `constructor()` tras los campos `protected` y antes de los métodos registra un
    `effect()` que lee `hasItems()` y, si es `false` y `untracked(this._menuElement)` contiene
    `this._document.activeElement`, llama a `_focusArrow()`; no escribe ningún signal. Sin campo para el effect
    (TS6138).
  - Si el test del foco falla porque el menú ya no está en el DOM cuando corre el effect: parar e informar
    (alternativa
    del plan, Riesgos y trampas), sin aplicarla sin aprobación.
  - Hecho cuando: los tests nuevos pasan, ningún `effect()` escribe un signal y `pnpm nx run smooth-ui:test` está en
    verde.

- [x] **T9. Demo en modo `icon`, control de vaciado y comprobación de FR-1 en la build.** FR-1, FR-4, FR-6, FR-7,
      FR-15, NFR-4, criterio de finalización 4 · Depende de: T4, T5, T8
  - Archivos: `apps/smooth-ui-demo/src/app/app.component.html`, `apps/smooth-ui-demo/src/app/app.component.ts` (sin
    cambios en `.scss`).
  - Código: bajo la fila existente de "Smooth UI Button Split", seis split buttons en modo `icon` con `icon="save"`,
    `name="Save"` y `[menuItems]="menuItems"`: `flat` `sm`, `rounded` y `pill` `lg` en `ghost`, y las mismas tres con
    `variant="primary"`; `<sui-button-split [menuItems]="menuItems" arrowLabel="More save options" name="Save" />`;
    `<sui-button-split [menuItems]="[]" arrowLabel="No options" name="Publish" />`.
  - Control de FR-15 (vaciado temporizado): un split propio `name="Share"` con
    `[menuItems]="emptiableMenuItems()"` y, junto a él, dos `<sui-button type="button">` (fuera de cualquier `<form>`)
    con texto visible: "Empty options in 3 s"
    (programa un único `setTimeout` de 3000 ms que hace `emptiableMenuItems.set([])`, cancelando el anterior si lo
    hay)
    y "Restore options" (cancela el temporizador pendiente y hace `emptiableMenuItems.set([...this.menuItems])`). En
    `app.component.ts`: `protected readonly emptiableMenuItems: WritableSignal<MenuItem[]>` iniciado con una copia de
    `menuItems`, el id del temporizador en un campo privado y `inject(DestroyRef).onDestroy(...)` que lo cancela;
    orden
    de miembros de ESLint. Siempre un array nuevo (mutar el mismo no dispara FR-15). Los demás splits no se tocan.
    Motivo del temporizador: con el menú abierto no se puede accionar ningún otro control de la página, porque el
    `pointerdown` fuera lo cierra (FR-13) y Tab también (FR-14); el retardo separa la acción del vaciado y se acciona
    igual con ratón o teclado, con un botón nativo y texto visible, sin atajos globales que choquen con el lector de
    pantalla.
  - FR-1 en el marcado (temporal): añadir `<sui-button-split />`, ejecutar `pnpm nx run smooth-ui-demo:build`,
    informar
    del fallo NG8008 con su salida y quitar la línea.
  - Hecho cuando: los archivos quedan con solo las filas y el control nuevos (idénticos tras quitar la línea
    temporal),
    `emptiableMenuItems` solo se escribe con `set()` y arrays nuevos, el temporizador se cancela al destruir y al
    restaurar, `pnpm nx run smooth-ui-demo:build` pasa sin ningún aviso nuevo de `anyComponentStyle` (el de 4.35 kB de
    `sui-button` es anterior), `pnpm nx run smooth-ui-demo:typecheck` pasa y `pnpm nx run smooth-ui:test` está en
    verde.

- [x] **T10. Validación en el navegador, axe y verificación completa.** FR-7 a FR-16, NFR-1, NFR-3, NFR-4,
      criterios de finalización 2, 3 y 5 · Depende de: T1 a T9
  - Archivos: este archivo, `MEMORY.md` (sin código). Demo en el puerto 4200 (MCP de Chrome DevTools); preguntar al
    usuario antes de reiniciar o parar su servidor. Esperar a que se pinten todos los bloques diferidos antes de cada
    comprobación y tras recargar o cambiar de tema.
  - Teclado real: Enter y Espacio sobre la flecha abren y enfocan la primera opción y sobre una opción la eligen y
    vuelven a la flecha (FR-9, FR-11); Flecha abajo/arriba sobre la flecha (FR-11) y, en el split sin opciones, no
    abren
    ni desplazan la página (FR-7); Tab desde una opción cierra y lleva al siguiente enfocable tras el split (FR-14);
    Mayús+Tab desde una opción acaba en la flecha y no en el segmento principal (FR-16, D5); Escape y clic fuera
    (FR-13); opciones fuera del Tab (FR-12).
  - FR-15 con el control de T9: (1) pulsar "Empty options in 3 s", abrir el split "Share" desde la flecha y, antes de
    3 s, Flecha abajo para enfocar una opción; tras el vaciado: sin `role="menu"`, `aria-expanded` `false` y
    `document.activeElement` es la flecha; (2) repetir dejando el foco en el segmento principal con el menú abierto
    mediante un clic en él (el `pointerdown` cae dentro del host y no cierra el menú, FR-5/FR-13; Chrome enfoca el
    botón): se cierra y el foco sigue en el principal; (3) "Restore options": el menú no se reabre solo. Para entrar
    en
    los 3 s, la secuencia puede hacerse en un único `evaluate_script` o con `press_key` seguidos; si aun así no
    bastan,
    informar en lugar de cambiar el retardo sin aprobación.
  - Colocación (FR-8), en los dos temas: abajo y arriba (desplazando la página hasta dejar el split cerca del borde
    inferior), con un hueco de 6 px entre el split y el menú en las dos posiciones, medido con
    `getBoundingClientRect()`. Aspecto (FR-10): fondo, borde, sombra, radio, hover y anillo solo con `:focus-visible`
    (leer `box-shadow` ~500 ms tras el foco). NFR-3: con movimiento reducido emulado, sin transiciones propias.
  - NFR-4: axe-core 4.10.2 desde cdnjs (sin paquete) sobre la sección del split con `wcag2a`, `wcag2aa`, `wcag21a`,
    `wcag21aa`, `wcag22aa`, en claro y oscuro, modos `default` e `icon`, variantes `ghost` y `primary`, menú cerrado y
    abierto: cero infracciones. Problemas de anillo de la spec 004 registrados con sus valores, sin contar como
    aprobados. Restaurar al final el tema guardado.
  - Verificación completa: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (salida exacta);
    NFR-1, ningún `package.json` cambiado. Nota de release del plan en `MEMORY.md`.
  - Nota: esta tarea no cambia el `Status` de la spec. El coordinador la pasa a `Status: implemented` solo tras el
    APPROVED de @reviewer en la fase de Validación.
  - Hecho cuando: cada comprobación se informa como aprobada o fallida con sus valores, el comando completo pasa, las
    comprobaciones manuales con lector de pantalla se enumeran para el usuario y `MEMORY.md` se queda en unas 50
    líneas.

## Trazabilidad

| FR / NFR | Tareas          |
| -------- | --------------- |
| FR-1     | T1, T9          |
| FR-2     | T1              |
| FR-3     | T1              |
| FR-4     | T1, T9          |
| FR-5     | T1              |
| FR-6     | T4, T5, T9      |
| FR-7     | T5, T6, T9, T10 |
| FR-8     | T2, T3, T4, T10 |
| FR-9     | T2, T10         |
| FR-10    | T2, T10         |
| FR-11    | T6, T10         |
| FR-12    | T7, T10         |
| FR-13    | T2, T10         |
| FR-14    | T7, T10         |
| FR-15    | T8, T9, T10     |
| FR-16    | T7, T10         |
| NFR-1    | T10             |
| NFR-2    | T4              |
| NFR-3    | T10             |
| NFR-4    | T9, T10         |
