# Tareas 004 — sui-button-group

Status: approved (2026-10-17)

Plan: `specs/004-sui-button-group/plan.md` (aprobado el 2026-10-17). Una tarea cada vez: primero los tests (en rojo
cuando el comportamiento es nuevo; los tests que recogen comportamiento existente pueden pasar a la primera), después el
código, `pnpm nx run smooth-ui:test` en verde, `pnpm nx format:check --files=<archivos tocados>` limpio, `MEMORY.md`
actualizado, marcar la tarea y parar. Las rutas son relativas a `libs/smooth-ui/src/lib/components/` salvo que empiecen
por `apps/`, `libs/`, `specs/` o un punto. Sin archivos nuevos, ni cambios en `.scss`, textos, tokens, `SuiButton` o
`public-api.ts`; la API pública conserva todos sus campos e inputs. Sin flechas en este ciclo. Las dudas de diseño se
consultan primero en `docs/smoothui-interactivo.html` y después al usuario. Se mantienen los cambios propios del usuario
en el árbol de trabajo (`(trigger)` en el envío reactivo de la demo, `name` del split obligatorio, spinner sin
`color`). El implementer informa de la salida exacta de cada comando; el coordinador contrasta cada resultado con los
archivos.

- [x] **T1. Mantener la referencia de diseño fuera de Prettier.** NFR-1 (comprobaciones del proyecto)
  - Archivos: `.prettierignore` (aprobado por el usuario).
  - Código: una línea nueva `docs/smoothui-interactivo.html`; nada más cambia en el archivo.
  - Hecho cuando: el diff es esa línea, `pnpm nx format:check` sale con 0 sobre el árbol (informar de su salida) y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T2. `pressed` en `sui-button`.** FR-7 de 002, FR-7 de 004
  - Archivos: `sui-button/sui-button.component.spec.ts`, `sui-button.component.ts`, `sui-button.component.html`.
  - Primero los tests (rojo): `pressed` `true` → `aria-pressed="true"`; `false` → `"false"`; sin valor y `undefined` →
    sin `aria-pressed`; con `expanded` `false` → `aria-pressed`, `aria-expanded` y `aria-haspopup` a la vez; se mantiene
    mientras `disabled` y mientras `loading`. El test existente "`selected` no da `aria-pressed`" no cambia.
  - Código: después de `expanded`,
    `public pressed: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);` y
    `[aria-pressed]="pressed() ?? null"` en el `<button>`. Nunca `booleanAttribute` (D1: convierte `undefined` en
    `false` y anuncia "no pulsado" en cada botón sin valor).
  - Si `hasAttribute('aria-pressed')` sigue siendo `true` con `null`: parar e informar; `[attr.aria-pressed]` se aparta
    de la regla `[aria-*]` del proyecto y necesita antes la aprobación del usuario.
  - Hecho cuando: los tests nuevos pasan, el diff son esas dos líneas más los tests, y `pnpm nx run smooth-ui:test` está
    en verde.

- [x] **T3. `pressed` en `sui-icon-button`.** FR-7 de 003, FR-7 de 004
  - Archivos: `sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`, `.component.html`.
  - Primero los tests (rojo): `true`/`false`/sin valor/`undefined` como en T2; se mantiene mientras `disabled`. El test
    existente "`selected` no da `aria-pressed`" no cambia.
  - Código: el mismo input después de `variant` y el mismo binding `[aria-pressed]`; sin `booleanAttribute`; la misma
    regla de parada.
  - Hecho cuando: los tests nuevos pasan, el diff son esas dos líneas más los tests, y `pnpm nx run smooth-ui:test` está
    en verde.

- [x] **T4. Rol del grupo y `label` opcional.** FR-6, NFR-2
  - Archivos: `sui-button-group/sui-button-group.component.spec.ts`, `sui-button-group.component.ts`.
  - Primero los tests (rojo): el `role` del host es `group`; `label` `" Tools "` → `aria-label` del host `" Tools "`;
    `""`, `"  "` y sin valor → sin `aria-label`; los segmentos no tienen atributo `tabindex`, `tabIndex` 0, en el orden
    de la lista; un keydown de `ArrowRight` lanzado en el primer segmento deja `document.activeElement` en él.
  - Código: `public label: InputSignal<string> = input<string>('');`, un computed `groupName: Signal<string | null>`
    (`label()` sin recortar si `label().trim()`; si no, `null`) y
    `host: { role: 'group', '[aria-label]': 'groupName()' }`. Sin elemento envoltorio, sin `tabindex`, sin listener de
    teclas.
  - Si `[aria-label]` con `null` deja el atributo en el host: parar y plantearlo al usuario antes de usar
    `'[attr.aria-label]'` (riesgo del plan; desviación de la regla de bindings ARIA).
  - Hecho cuando: los tests nuevos pasan, los tests existentes del grupo no cambian y `pnpm nx run smooth-ui:test` está
    en verde.

- [x] **T5. Estado pulsado de los segmentos y nombres del tipo `icon`.** FR-5, FR-7
  - Archivos: `sui-button-group/sui-button-group.component.spec.ts`, `.component.ts`, `.component.html`.
  - Primero los tests (rojo donde son nuevos): FR-7 en los dos tipos: `selected` `true` → clase de seleccionado +
    `aria-pressed="true"`; `false` → sin clase + `"false"`; ausente y `undefined` explícito → sin clase, sin
    `aria-pressed`; un grupo que mezcla los tres; tipo `button` con `expanded` `false`, con y sin `selected` →
    `aria-expanded="false"`, `aria-haspopup="menu"`, `aria-pressed` solo con `selected`; tipo `icon` con `expanded` →
    sin `aria-expanded`. FR-5: todos los casos de nombre de la estrategia de tests del plan (tipos `button` e `icon`, los
    tres resultados sin nombre) con un espía de `console.error`/`console.warn` sin llamar.
  - Código: `iconLabels: Signal<string[]>` (por entrada: el `label` tal cual si `label?.trim()`; si no, el `name`); la
    rama `icon` enlaza `[label]="iconLabels()[$index]"`; las dos ramas añaden `[pressed]="button.selected"` tal cual,
    junto al `[selected]="button.selected ?? false"` sin cambios. Mantener los dos `track button.label ?? button.name`
    (la vuelta del foco del split depende de reutilizar el DOM) y no añadir envoltorio entre segmentos (selectores de
    los separadores con ámbito).
  - Hecho cuando: los tests nuevos pasan, los tracks y el `div` interior son idénticos byte a byte, y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T6. Tests del comportamiento del grupo que no cambia y del split.** FR-1 a FR-4, FR-6, FR-7, FR-8, FR-9, NFR-2
  - Archivos: `sui-button-group/sui-button-group.component.spec.ts`,
    `sui-button-split/sui-button-split.component.spec.ts`.
  - Tests (estrategia de tests del plan): FR-1 (`NG0950` sin `buttons`, `[]` no pinta ningún botón), FR-2, FR-3
    (`this` es la entrada, sin argumentos, sin cambio de `selected`, sin envío de formulario), FR-4, clases de
    FR-8/FR-9, NFR-2 (texto del host vacío). Split, en los dos modos: grupo interior con `role="group"`, sin
    `aria-label`, ningún segmento con `aria-pressed`, también después de abrir el menú.
  - Hecho cuando: los tests pasan sin cambiar código de la librería, los tests existentes del split siguen en verde sin
    cambios y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T7. Demo: grupos con nombre, `selected` mezclado y grupo de una entrada.** NFR-4, criterio de finalización 4
  - Archivos: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Código: en `buttonsGroup`, Button 1 con `selected: true`, Button 2 con `selected: false` y Button 3 sin `selected`;
    `public singleButtonGroup: SuiButton[] = [{ name: 'Single action', icon: 'star' }];`; un `label` distinto en cada
    uno de los 12 grupos (tipo, variante, forma, tamaño, por ejemplo `label="Icon group (primary, pill, lg)"`); una fila
    nueva con `<sui-button-group [buttons]="singleButtonGroup" label="Single action group" />`. Los split buttons y
    `app.component.scss` no se tocan.
  - Hecho cuando: `pnpm nx run smooth-ui-demo:build` pasa sin ningún aviso nuevo de `anyComponentStyle` (el de 4.35 kB
    de `sui-button` es anterior a 004), `pnpm nx run smooth-ui-demo:typecheck` pasa, hay 13 grupos con su `label`, y
    `pnpm nx run smooth-ui:test` está en verde.

- [x] **T8. Comprobación en build de FR-1 con marcado temporal.** FR-1
  - Archivos (temporales, se revierten en esta tarea): `apps/smooth-ui-demo/src/app/app.component.html`.
  - Pasos: añadir `<sui-button-group />`, ejecutar `pnpm nx run smooth-ui-demo:build`, informar del fallo y de su
    código de error, quitar la línea.
  - Hecho cuando: se informa del fallo con su salida, el archivo es idéntico byte a byte a como estaba tras T7, la build
    vuelve a pasar y `pnpm nx run smooth-ui:test` está en verde.

- [x] **T9. Validación en el navegador (MCP de Chrome DevTools).** FR-6 a FR-10, NFR-3, NFR-4, criterio de
      finalización 3
  - Archivos: ninguno. Demo servida en el puerto 4200; preguntar al usuario antes de reiniciar o parar su servidor de
    desarrollo.
  - Carga: esperar a que la página haya cargado del todo y se hayan pintado todos los bloques diferidos
    (`#button-matrix` 144 botones, `#icon-button-matrix` 36, sin textos de placeholder ni de carga) antes de cualquier
    comprobación; repetirlo tras una recarga o un cambio de tema.
  - Árbol, en los dos temas: cada grupo de la demo es un `group` con su `label` como nombre; segmentos nombrados según
    FR-5; Button 1 pulsado `true`, Button 2 `false`, Button 3 sin estado pulsado; grupos del split sin nombre, sin
    estado pulsado, `aria-expanded` de la flecha false/true con el menú; Tab recorre cada segmento en el orden de la
    lista.
  - Aspecto, en los dos temas: radios de FR-8 (0, 10 px, extremos redondos); contorno y líneas de 1 px de FR-9
    (`ghost`), sin contorno y con línea de acento (`primary`); anillo de teclado de FR-10 leído ~500 ms después del
    foco. NFR-3: el movimiento reducido da transiciones de `0s`.
  - NFR-4: canvas rgb (248, 249, 251) en claro y rgb (16, 20, 27) en oscuro; axe-core 4.10.2 desde cdnjs (sin paquete)
    sobre las secciones del grupo y del split con `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: cero
    infracciones en cada tema.
  - Problemas conocidos REGISTRADOS con los valores medidos, sin contar como aprobados: anillo recortado y tapado, ninguno
    visible en el primer segmento `primary` ni en el grupo de una entrada (SC 2.4.7); anillo oscuro ~1:1 en el hover de
    `primary`, ~1.4:1 en reposo; anillo claro 1.92:1 sobre el canvas (axe no los detecta). Restaurar al final el tema
    guardado.
  - Hecho cuando: cada comprobación de arriba se informa como aprobada o fallida con sus valores; cualquier comprobación
    manual del estado pulsado (`:active`, Espacio mantenido) se enumera para el usuario, que la hace (el MCP no puede
    mantener `:active`).
  - Resultado (2026-10-17, en los dos temas): todas las comprobaciones pasan; árbol idéntico en los dos temas (13
    grupos con nombre, 6 grupos del split sin nombre; el árbol del MCP solo muestra pulsado `true`, así que `false` y
    ninguno se leyeron de `aria-pressed`); 49 paradas de Tab en orden, las flechas mantienen el foco; axe 0
    infracciones, también con un menú del split abierto. Problemas conocidos medidos: el primer segmento `primary` y el
    grupo de una entrada no muestran anillo; anillo oscuro rgb (166, 178, 252) = hover de `primary` (1:1), 1.42:1 en
    reposo; anillo claro 1.92:1 sobre el canvas, 1.81:1 sobre un segmento seleccionado. Las comprobaciones manuales con
    lector de pantalla y Espacio mantenido quedan para el usuario.
  - Comprobación manual con lector de pantalla y pulsado del propietario (2026-10-17): correcta (nombres de los grupos;
    Button 1/2/3 pulsado true/false/ninguno en los dos tipos de grupo; grupo de una entrada; split sin nombre, Save no
    pulsado, More options contraído/expandido; Espacio mantenido sobre el segmento `primary` seleccionado ejecuta la
    acción una vez).

- [x] **T10. Verificación completa, estados, nota de release y memoria.** Todos los FR, NFR-1 a NFR-4
  - Archivos: `specs/002-sui-button/spec.md`, `specs/003-sui-icon-button/spec.md`,
    `specs/004-sui-button-group/spec.md`, este archivo, `MEMORY.md` (sin código).
  - Pasos: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (se informa de la salida exacta);
    las líneas de estado y las notas de enmienda de 002 y 003 dicen que la enmienda de FR-7 está implementada (fecha);
    la spec 004 con `Status: implemented`.
  - Nota de release en `MEMORY.md` (texto del plan): incompatible, en el tipo `icon` un `label` en blanco recurre a
    `name`; `role="group"` y `label` opcional del grupo; input `pressed` en los dos botones, alimentado por el `selected`
    de cada entrada; problemas conocidos.
  - Hecho cuando: el comando pasa, ningún `package.json` ha cambiado, ningún texto nuevo en la librería, los estados se
    leen como arriba y `MEMORY.md` se queda en unas 50 líneas.
