# Tareas 002 — sui-button

Status: approved (T1-T10 hechas el 2026-10-16; el pulsado de V6 lo comprobó a mano el propietario)

Plan: `specs/002-sui-button/plan.md` (aprobado el 2026-10-16, D1: se mantiene el binding `[aria-label]`; reaprobado el
2026-10-16 con D6-D8 para el contraste de NFR-4). Una tarea cada vez: primero los tests (en rojo cuando el
comportamiento es nuevo; los tests que recogen comportamiento existente pueden pasar a la primera), después el código,
`pnpm nx run smooth-ui:test` en verde, marcar la tarea y parar. Las rutas son relativas a `libs/smooth-ui/src/` salvo
que empiecen por `apps/` o `libs/`. Sin archivos nuevos; sin token, helper, error ni cambio en `public-api.ts` nuevos
(T9 solo reasigna cinco tokens existentes del tema claro).

- [x] **T1. Quitar `iconSize` de la interfaz `SuiButton` (incompatible).** Caso límite "Sin tamaño de icono"
  - Archivos: `lib/interfaces/sui-button.interface.ts` (y cualquier uso de `SuiButton.iconSize` en la librería que
    encuentre el typecheck).
  - Hecho cuando: `SuiButton` no tiene `iconSize`; `SuiIconButton` conserva el suyo; `pnpm nx typecheck smooth-ui` y
    `pnpm nx run smooth-ui:test` están en verde.

- [x] **T2. Nombre accesible de FR-5: sin icono, un `label` de espacios recurre al texto.** FR-5, NFR-2
  - Archivos: `lib/components/sui-button/sui-button.component.spec.ts`, `sui-button.component.ts`.
  - Primero los tests: `label` `" Save draft "` → `aria-label` `" Save draft "` (tal cual); `name` "Save" + `label`
    `"  "` → `aria-label` "Save"; `name` `""` + icono `check` + `label` `"  "` → `aria-label` `""` (sin recurso al
    icono); `name` `""` + icono + `label` "Save" → `aria-label` "Save"; `name` "Save" + `label` "Store" se renderiza con
    `aria-label` "Store" y sin error; el test de la ~línea 70 pasa a ser "never uses the icon as accessible name" y
    espera `aria-label=""`.
  - Código: una línea, `protected readonly accessibleName: Signal<string> = computed(() => (this.label().trim() ? this.label() : this.name()));`.
    La plantilla no cambia (D1).
  - Hecho cuando: los tests nuevos y actualizados pasan, el diff de `sui-button.component.ts` es esa línea, ningún otro
    test existente ha cambiado y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T3. Tests de nombre, activación y estado del menú.** FR-1, FR-2, FR-6
  - Archivos: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: sin `name` falla en `detectChanges()` (`NG0950`); un clic da un `trigger` con `undefined`; keydown/keyup de
    Enter y Espacio no emiten nada por sí solos; formulario anfitrión dentro del spec: `submit` lanza un envío (sin el
    comportamiento por defecto) y un `trigger`, `reset` restaura el input, el tipo por defecto no lanza ningún envío;
    `expanded` sin valor → sin `aria-expanded`/`aria-haspopup`, `false`/`true` → el valor y `menu`.
  - Hecho cuando: los tests pasan (si jsdom no admite submit/reset, esos dos pasan a V2 con una nota) y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T4. Tests de deshabilitado y carga.** FR-3, FR-4
  - Archivos: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: `disabled` solo y con `loading`: `disabled` nativo, sin emisión, `sui-button-disabled`, `focus()` no le da el
    foco; `loading`: spinner `aria-hidden`, sin `sui-icon` ni texto, `aria-busy="true"`, `aria-label` "Test" (y "Save
    draft" con ese `label`), se mantienen las clases de variante/`selected`/`focus`, sin `sui-button-disabled`; dar el
    foco al botón, entrar en `loading`, `document.activeElement` es el botón o `body`.
  - Hecho cuando: los tests pasan y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T5. Tests de aspectos, tamaños, iconos y estado de foco.** FR-7, FR-8, FR-9, FR-10
  - Archivos: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: por defecto `sui-button-primary`, clase `danger`, clase `selected` sin `aria-pressed`; por defecto
    `sui-button-md`/`sui-button-rounded`, `lg`/`pill`, `sui-button-full-width`; icono antes del texto, después con
    `iconEnd`, ancho 16/20/24 según el tamaño; `name` `""` → `sui-spacing-8` y sin texto, un `name` de espacios mantiene
    el span de texto y no lleva `sui-spacing-8`; `state` `focus` → `sui-button-focus`.
  - Hecho cuando: los tests pasan y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T6. Tests del split y del grupo: se renderizan, sin avisos.** FR-1, FR-5
  - Archivos: `lib/components/sui-button-split/sui-button-split.component.spec.ts`,
    `lib/components/sui-button-group/sui-button-group.component.spec.ts`.
  - Tests: el split sin `name` falla en `detectChanges()`; el split con `name` `"  "` se renderiza sin error en los modos
    por defecto e icono; la entrada de grupo `{ name: 'Bold', label: 'Italic' }` se renderiza con `aria-label` "Italic" y
    sin error; `{ name: '', icon: 'check', label: 'Bold' }` recibe `aria-label` "Bold"; los tests existentes siguen
    pasando.
  - Hecho cuando: los tests pasan sin cambiar el código del split ni del grupo, y `pnpm nx run smooth-ui:test` está en
    verde.

- [x] **T7. Demo: matriz de botones diferida.** NFR-4, criterio de finalización 4
  - Archivos: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Código: `buttonVariants: SUI_BUTTON_VARIANT[]` (6), `buttonSizes: SUI_SIZE[]` (3) y
    `buttonStates: DemoButtonState[]` (8, interfaz local, textos no en blanco) tipados; `@for` anidados con
    `track variant`, `track size` y `track state.id`, dentro de `@defer (on viewport)` con un `@placeholder` (un
    elemento) y un bloque `@loading`, el `@defer` envuelto en un contenedor con un `id` estable (`button-matrix`);
    sustituye las líneas 21-29 y 35-38; ninguna regla nueva en `app.component.scss`.
  - Hecho cuando: `pnpm nx run smooth-ui-demo:build` pasa sin ningún aviso nuevo de `anyComponentStyle` (el aviso de
    `sui-button.component.scss`, 4.35 kB > 4 kB, es anterior a 002 y sigue pendiente), la matriz da 144 botones una vez
    cargada, ningún `sui-button` usa `(click)` y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T8. Demo: ejemplos de nombre y menú.** FR-5, FR-6, criterio de finalización 4
  - Archivos: `apps/smooth-ui-demo/src/app/app.component.html`.
  - Código, fuera del defer: un botón solo con `label` (`name=""`, icono, `label`), `name="Save"` con
    `label="Save draft"`, y `expanded` `false` y `true`; la línea 192 mantiene `(trigger)`.
  - Hecho cuando: `pnpm nx run smooth-ui-demo:build` pasa, ningún `sui-button` de la demo tiene a la vez un `label` y un
    `name` en blanco, y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T9. Tokens sólidos del tema claro y fondo canvas de la demo.** NFR-4, criterio de finalización 5 (contraste de
      NFR-4)
  - Archivos: `libs/smooth-ui/theme/theme.scss`, `apps/smooth-ui-demo/src/styles.scss`,
    `apps/smooth-ui-demo/project.json`.
  - Código (D6), solo en el bloque `:root, [data-theme='light']`: `--sui-color-accent-solid: var(--sui-accent-600);`,
    `--sui-color-accent-solid-hover: var(--sui-accent-700);`, `--sui-color-accent-solid-active: var(--sui-accent-800);`,
    `--sui-color-danger-solid: var(--sui-danger-600);`, `--sui-color-danger-solid-hover: var(--sui-danger-700);`. El
    bloque `[data-theme='dark']`, todos los tokens `*-on-solid` y los dos anillos de foco escritos a mano no cambian.
  - Código (D7): `html, body { background-color: var(--sui-color-bg-canvas); }` en `styles.scss`, después de su `@use`
    existente; en `project.json`, `build.options.styles` pasa de `["./libs/smooth-ui/theme/theme.scss"]` a
    `["apps/smooth-ui-demo/src/styles.scss"]`. Sin test unitario (D8): ningún spec comprueba tokens ni colores calculados.
  - Hecho cuando: el diff solo toca esas cinco líneas de token, esa regla y esa entrada `styles`;
    `pnpm nx run smooth-ui:test` está en verde; `pnpm nx run smooth-ui-demo:build` pasa sin avisos nuevos (se mantiene
    el aviso de `anyComponentStyle` de `sui-button.component.scss`); `pnpm nx format:check` está limpio; y en la demo
    servida `getComputedStyle(document.body).backgroundColor` es `rgb(248, 249, 251)` (#f8f9fb) en claro y
    `rgb(16, 20, 27)` (#10141b) en oscuro.

- [x] **T10. Verificación completa y memoria (se repite tras T9).** NFR-1, NFR-2, NFR-3, NFR-4, todos los FR
  - Archivos: `MEMORY.md` (sin código).
  - Hecho cuando: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` pasa, ningún `package.json`
    ha cambiado, ningún texto nuevo en la librería, V6 y V7 de abajo están comprobadas (o informadas como fallidas;
    V1-V5 siguen marcadas), y `MEMORY.md` recoge el resultado, los cambios incompatibles y los colores `primary`/`danger`
    más oscuros del tema claro (también en icon-button, button-group, text-field y textarea) para las notas de release.

## Lista de validación (navegador, MCP de Chrome DevTools, se ejecuta en T10)

- [x] V1. FR-1 y sin tamaño de icono: un `<sui-button />` y un `<sui-button-split />` temporales hacen fallar
      `pnpm nx run smooth-ui-demo:build`; un literal `SuiButton` temporal con `iconSize` hace fallar
      `pnpm nx typecheck smooth-ui`; los dos se quitan después.
- [x] V2. FR-2: Enter y Espacio reales dan un `trigger`; el envío del formulario reactivo funciona mediante `(trigger)`.
- [x] V3. FR-3, FR-4: aspecto deshabilitado y cursor not-allowed; aspecto de carga, cursor pointer, estrechamiento y
      foco tras entrar en carga; anotar si un listener de clic en bruto se dispara mientras no está disponible.
- [x] V4. FR-5: en el árbol de accesibilidad, los botones de la demo solo con `label` y con un `label` que contiene su
      texto exponen su `label`.
- [x] V5. Matriz diferida cargada: hacer scroll hasta el contenedor `#button-matrix` y esperar a que estén los 144
      botones de la matriz y hayan desaparecido los textos del placeholder y de carga. Obligatorio antes de V6 y V7.
- [x] V6. FR-7, FR-8, FR-10 y NFR-3: aspectos de hover, altos, rellenos, radios, anillos de foco por teclado y de
      `state` `focus` en los temas claro y oscuro; con movimiento reducido emulado, las transiciones son `0s` y el
      indicador da una vuelta cada 2 s. Los aspectos de pulsado (`:active`) los comprueba a mano el propietario (el MCP
      no puede mantener `:active`).
- [x] V7. NFR-4: con la matriz cargada (V5), confirmar primero que `getComputedStyle(document.body).backgroundColor` es
      el color del canvas (#f8f9fb en claro, #10141b en oscuro); inyectar `axe-core` desde un CDN (sin añadir paquetes)
      y ejecutarlo sobre la sección de botones con `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: cero
      infracciones; cambiar al tema oscuro (repetir V5 si la página se recargó) y volver a ejecutarlo: cero
      infracciones. Después, en cada tema, leer el `background-color` y el `color` calculados de un botón `primary` y
      uno `danger` en reposo y con `:hover` forzado:
  - claro: `primary` #5a5fd8 / #494cb0, `danger` #c03c50 / #9a2f3f, texto blanco, cada uno a 4.5:1 o más;
  - oscuro: los tokens sin cambios con su texto `*-on-solid`, cada uno a 4.5:1 o más;
  - el pulsado (`:active`, en claro se espera #3a3c8a y #c03c50) lo comprueba a mano el propietario, como en V6;
  - echar un vistazo a icon-button, button-group, text-field y textarea (efecto secundario, sin FR).
