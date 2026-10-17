# Tareas 003 — sui-icon-button

Status: approved (2026-10-17, reaprobadas tras el cambio del anillo a accent 300)

Plan: `specs/003-sui-icon-button/plan.md` (reaprobado el 2026-10-17, D2: anillo accent 300 opaco en los dos temas,
decisión del usuario, en lugar de accent 500). Una tarea cada vez: primero los tests (escribir el test que falla y
después el cambio; los tests que recogen comportamiento existente pueden pasar a la primera), después
`pnpm nx run smooth-ui:test` en verde, marcar la tarea y parar. Las rutas son relativas a `libs/smooth-ui/src/` salvo
que empiecen por `apps/` o `libs/`. Sin archivos nuevos, sin token, helper, texto ni cambio en `public-api.ts` nuevos. Se
mantienen los cambios del usuario en el árbol de trabajo (`(trigger)` en el envío del formulario reactivo de la demo,
`name` del split obligatorio, `sui-button.component.scss`). El implementer informa de la salida exacta de cada comando
que ejecuta; el coordinador contrasta el resultado de cada tarea con los archivos reales antes de marcarla.

- [x] **T1. Línea base y después quitar `iconSize` del componente y de `SuiIconButton`.** FR-6, caso límite "Sin
      tamaño de icono"
  - Primero: ejecutar `pnpm nx format:check` sobre el árbol sin tocar e informar de su código de salida (se espera 0).
  - Archivos: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`,
    `lib/interfaces/sui-icon-button.interface.ts`.
  - Primero el test (rojo): `fixture.componentRef.setInput('iconSize', 32)` lanza un error (`NG0303`).
  - Código: borrar el input `iconSize` (línea 19) y `iconSize?: number` de `SuiIconButton`; nada más cambia.
  - Hecho cuando: el test nuevo pasa, `grep -rn iconSize` no encuentra nada en
    `libs/smooth-ui/src/lib/components/sui-icon-button/` ni en la interfaz, y `pnpm nx typecheck smooth-ui` y
    `pnpm nx run smooth-ui:test` están en verde.

- [x] **T2. Nombre accesible de FR-4: `label` no en blanco tal cual y, si no, ninguno (D1).** FR-4, NFR-2
  - Archivos: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`.
  - Primero los tests (rojo donde son nuevos): el test "falls back to the icon name when no label is given" pasa a ser
    "never uses the icon name as accessible name": icono `check`, sin `label` →
    `button.hasAttribute('aria-label') === false`; `label` `"   "` → `hasAttribute('aria-label') === false`; `label`
    `" Close "` → `aria-label` `" Close "`;
    el `<svg>` tiene `aria-hidden="true"` y `focusable="false"`; el `textContent.trim()` del botón es `""` (NFR-2). Se
    queda "exposes the label as accessible name".
  - Código: una línea,
    `protected readonly accessibleName: Signal<string | null> = computed(() => (this.label().trim() ? this.label() : null));`.
    La plantilla mantiene `[aria-label]` (regla del proyecto).
  - Si `hasAttribute('aria-label')` sigue siendo `true` con `null`: parar e informar al coordinador; cambiar a
    `[attr.aria-label]` se aparta de la regla de bindings ARIA del proyecto y necesita antes la aprobación del usuario.
  - Hecho cuando: los tests actualizados y nuevos pasan, el diff del `.ts` es esa línea, ningún otro test existente ha
    cambiado y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T3. Tests del icono obligatorio y de la activación.** FR-1, FR-2
  - Archivos: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: un `TestBed.createComponent` nuevo sin `icon` lanza un error en `fixture.detectChanges()` (`NG0950`); `icon`
    `""` pinta el `<svg>`; un clic emite un `trigger` con `undefined`; keydown/keyup de Enter y Espacio lanzados no
    emiten nada por sí solos; `button.type` es `button`; un componente anfitrión dentro del spec (formulario, input de
    texto, icon button): tras editar el input, un clic en el icon button no lanza ningún evento `submit` y deja el valor
    del input sin cambios.
  - Hecho cuando: los tests pasan sin cambiar código de la librería y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T4. Tests de deshabilitado, aspectos, tamaños, formas, seleccionado y estado de foco.** FR-3, FR-5, FR-6, FR-7,
      FR-8
  - Archivos: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: `disabled` → `disabled` nativo, un clic no emite nada, `sui-icon-button-disabled` presente (también junto
    con `selected`: las dos clases), `button.focus()` no lo convierte en `document.activeElement`; por defecto
    `sui-icon-button-ghost`, clases `outline` y `primary`; por defecto `sui-icon-button-md` y
    `sui-icon-button-rounded`, clases `sm`/`lg` y `flat`/`pill`; `width` del `<svg>` 16/20/24 para `sm`/`md`/`lg`;
    `selected` → `sui-icon-button-selected` y sin `aria-pressed`; `state` `focus` → `sui-icon-button-focus`, que se
    mantiene con `disabled`.
  - Hecho cuando: los tests pasan sin cambiar código de la librería y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T5. Tests del badge.** FR-9, FR-10, NFR-2
  - Archivos: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: `badge` 5, -1 y 1.5 muestran "5", "-1" y "1.5" en `.badge`; 0, `NaN` y sin valor no muestran `.badge`; con
    `badge` 3 y `label` "Show notifications": `.badge` no está dentro del `<button>`, el `aria-label` sigue siendo "Show
    notifications" y un clic sobre `.badge` no emite `trigger`.
  - Hecho cuando: los tests pasan sin cambiar código de la librería y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T6. Anillo de foco compartido: accent 300 opaco en los dos temas (D2).** FR-8, NFR-4
  - Archivos: `libs/smooth-ui/theme/theme.scss`.
  - Código: la línea 227 (bloque claro) y la línea 296 (bloque oscuro) pasan a ser
    `--sui-focus-ring: 0 0 0 3px var(--sui-accent-300);`. `--sui-focus-ring-danger` (líneas 228, 297) y todos los demás
    tokens se quedan. Sin test unitario (D5: ningún spec comprueba tokens ni colores calculados; el anillo se comprueba
    en V5).
  - Hecho cuando: el diff de `theme.scss` son exactamente esas dos líneas, `pnpm nx run smooth-ui:build` pasa,
    `pnpm nx format:check` está limpio y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T7. Demo: fila de formas con label y matriz diferida de 36 botones (D3, D4).** NFR-4, criterios de
      finalización 3 y 4
  - Archivos: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Código (TS): añadir `SUI_ICON_BUTTON_VARIANT` al import; interfaces locales `DemoIconButtonState` (`id`, `action`,
    `icon`, `selected`, `disabled`, `state: SUI_STATE`, `badge`), `DemoIconButton` (lo mismo más `id` y `label`
    únicos), una fila (`id`, `size`, `buttons`) y un grupo de variante (`variant`, `rows`); campos `protected readonly`
    `iconButtonVariants: SUI_ICON_BUTTON_VARIANT[]` (`ghost`, `outline`, `primary`),
    `iconButtonStates: DemoIconButtonState[]` (`selected` `star` "Add to favourites", `disabled` `trash` "Delete",
    `state` `focus` `settings` "Open settings", badge 3 `bell` "Show notifications") e
    `iconButtonMatrix: DemoIconButtonVariantGroup[]`, construido una vez por una función pura a nivel de módulo a partir
    de esas listas y de los `buttonSizes` existentes; cada `label` es la acción más la variante y el tamaño, por ejemplo
    "Delete (outline, lg)".
  - Código (HTML): sustituir las líneas 71-85 por una `.row` inmediata de tres botones `outline` `md` `edit`, `shape`
    `flat`/`rounded`/`pill`, con los labels "Edit (flat)", "Edit (rounded)" y "Edit (pill)"; después
    `<div id="icon-button-matrix">` alrededor de `@defer (on viewport)` con `@for` por grupo (`track group.variant`, un
    `<h2>`), por fila (`track row.id`, una `.row`) y por botón (`track button.id`) enlazando `badge`, `disabled`,
    `icon`, `label`, `selected`, `size`, `state` y `variant`; `@placeholder` `<p>Icon button matrix</p>`, `@loading`
    `<p>Loading icon button matrix…</p>`. Ninguna regla nueva en `app.component.scss`; el selector de tema y los grupos
    no se tocan.
  - Hecho cuando: `pnpm nx run smooth-ui-demo:build` pasa sin ningún aviso nuevo de `anyComponentStyle` (el aviso de
    4.35 kB de `sui-button.component.scss` es anterior a 003), `pnpm nx run smooth-ui-demo:typecheck` pasa, la
    plantilla tiene 3 + 1 etiquetas `sui-icon-button` en la sección y ninguna sin binding de `label`, no hay `iconSize`
    en `apps/`, y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T8. Comprobaciones en build de FR-1 y FR-6 con marcado temporal (V1).** FR-1, FR-6
  - Archivos (temporales, se revierten en esta tarea): `apps/smooth-ui-demo/src/app/app.component.html`,
    `apps/smooth-ui-demo/src/app/app.component.ts`.
  - Pasos, uno cada vez, revirtiendo cada uno antes del siguiente: añadir `<sui-icon-button label="Tmp" />` →
    `pnpm nx run smooth-ui-demo:build` falla por el `icon` obligatorio que falta; añadir
    `<sui-icon-button icon="sun" label="Tmp" [iconSize]="20" />` → la build falla (`NG8002`); añadir un literal
    `const tmp: SuiIconButton = { ..., iconSize: 20 }` en `app.component.ts` → `pnpm nx run smooth-ui-demo:typecheck`
    falla (propiedad de más). Informar de cada código de error.
  - Hecho cuando: se informa de los tres fallos con su salida, los archivos quedan idénticos byte a byte a como estaban
    tras T7 (sin `Tmp`, `iconSize` ni literal `SuiIconButton`), `pnpm nx run smooth-ui-demo:build` vuelve a pasar y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T9. Validación en el navegador (V2-V8 de abajo).** FR-2 a FR-10, NFR-3, NFR-4, criterios de finalización 3-5
  - Archivos: ninguno (demo servida, `pnpm nx run smooth-ui-demo:serve`, MCP de Chrome DevTools).
  - Hecho cuando: V2-V8 están comprobadas o informadas como fallidas con los valores medidos, en los temas claro y
    oscuro donde se indica; el pulsado (`:active`) y cualquier hover que el MCP no pueda forzar se enumeran para la
    comprobación manual del propietario.
  - Comprobación manual del propietario (el pulsado no se puede medir con el MCP; el hover sí se midió): en los dos
    temas, mantener pulsado cada botón `md` de la matriz de cada variante: `ghost`/`outline` con fondo apagado,
    `primary` con solid-active, icono legible; el seleccionado (estrella) mantiene su aspecto al pulsar con el puntero,
    y con Espacio el `primary` seleccionado muestra la excepción aceptada (1.85:1 en claro, 1.34:1 en oscuro); pulsar
    uno deshabilitado (papelera) no cambia nada.
    Resultado: hecho por el propietario, 2026-10-17, OK.

- [x] **T10. Verificación completa, nota de release y memoria.** NFR-1, NFR-2, todos los FR
  - Archivos: `MEMORY.md` (sin código).
  - Hecho cuando: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` pasa (se informa de la salida
    exacta), ningún `package.json` ha cambiado, ningún texto nuevo en la librería, y `MEMORY.md` recoge el resultado y
    la nota de release: incompatible, `sui-icon-button` ya no usa el nombre del icono como nombre accesible (pasar un
    `label` no en blanco); `iconSize` quitado de `sui-icon-button` y de `SuiIconButton`; `--sui-focus-ring` es ahora
    accent 300 opaco en los dos temas, lo que cambia todos los anillos de foco (`sui-button`, split, link, text field,
    textarea, icon button), a diferencia de la spec 002, que los mantenía; el anillo de peligro no cambia. Problemas
    conocidos: el anillo en claro tiene 1.92:1 contra el canvas, por debajo de WCAG 2.2 SC 1.4.11 (AA, 3:1); en el
    tema oscuro el anillo se confunde (1:1) con el fondo de hover de `primary`.

## Lista de validación (V1 en T8, V2-V8 en T9)

- [x] V1. FR-1, FR-6: un `icon` que falta y un `[iconSize]` enlazado hacen fallar la build de la demo; un literal
      `SuiIconButton` con `iconSize` hace fallar el typecheck de la demo; se quita todo el código temporal.
- [x] V2. Matriz diferida cargada: hacer scroll hasta `#icon-button-matrix` y esperar a que tenga 36 `sui-icon-button`
      y hayan desaparecido los textos del placeholder y de carga. Obligatorio antes de V3-V7, y otra vez después de
      cualquier recarga o cambio de tema que recargue la página.
- [x] V3. FR-2, FR-3: en un botón de la matriz, suscribirse mediante `ng.getComponent(host).trigger` en la consola de
      desarrollo (decisión del usuario del 2026-10-17: solo comprobación por consola, sin cambiar la spec ni la demo);
      Enter y Espacio reales dan un `trigger` cada uno; Tab salta los botones deshabilitados, que muestran el aspecto
      deshabilitado y el cursor not-allowed en reposo (el hover, el propietario si el MCP no puede forzarlo).
- [x] V4. FR-4, FR-10: en el árbol de accesibilidad, los 3 botones de forma y los 36 de la matriz exponen su propio
      `label` y ningún nombre de icono; el badge "3" es texto aparte fuera del nombre del botón.
- [x] V5. FR-5 a FR-9 y el anillo (D2): aspectos, tamaños (32/40/48 px), radios y posición del badge según la spec.
      Dar el foco por teclado y leer el `box-shadow` calculado: un icon button con `:focus-visible` y uno con `state`
      `focus` muestran rgb (166, 178, 252) en los dos temas. En oscuro, comprobar que su contraste contra el canvas es
      de al menos 3:1 (9.14:1); en claro, registrar el valor medido (1.92:1) como el fallo conocido aceptado, no como
      aprobado. Repetir la lectura del color en `sui-button` (no danger), `sui-link`, `sui-text-field` y `sui-textarea`;
      el anillo del botón `danger` no cambia; echar un vistazo a los elementos del menú del split. Observar, como
      contrapartida conocida y no como fallo que arreglar, que en el tema oscuro el anillo se confunde (1:1) con el
      fondo de hover de `primary`.
      Resultado (2026-10-17): todos los anillos rgb (166, 178, 252); oscuro 9.14:1 sobre el canvas (aprobado); claro
      1.92:1 sobre el canvas y 2.02:1 sobre blanco (fallo conocido aceptado, no aprobado); anillo de peligro sin
      cambios; se observó la confusión 1:1 en oscuro.
- [x] V6. NFR-3: con `prefers-reduced-motion: reduce` emulado, el `transition-duration` calculado de un icon button es
      `0s`.
- [x] V7. NFR-4: confirmar que `getComputedStyle(document.body).backgroundColor` es rgb (248, 249, 251) en claro y
      rgb (16, 20, 27) en oscuro; inyectar `axe-core` 4.10.2 desde cdnjs (sin añadir paquetes) y ejecutarlo sobre la
      sección de icon buttons (la `.col` que contiene la fila de formas y `#icon-button-matrix`) con `wcag2a`,
      `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: cero infracciones en claro y después en oscuro (cada vez, V2
      primero). Muestrear el contraste del icono (3:1, ghost contra el canvas) y del texto del badge (4.5:1) por
      variante; la excepción del `primary` seleccionado al pulsar Espacio y todos los aspectos de pulsado los comprueba
      a mano el propietario. axe no mide el contraste del anillo de foco, así que no detecta el anillo en claro (1.92:1,
      V5); enumerarlo como excepción conocida junto a la del `primary` seleccionado al pulsar Espacio.
- [x] V8. 375 px: con un viewport de 375 px, `document.documentElement.scrollWidth` no pasa de 444.
