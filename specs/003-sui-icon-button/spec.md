# Spec 003 — sui-icon-button

Status: implemented (2026-10-17); FR-7 amended for spec 004, approved and implemented 2026-10-17

**Enmienda (spec 004, aprobada el 2026-10-17; implementada el 2026-10-17).** FR-7 añade el input `pressed` y su
anuncio; la nota de "Nombre accesible" sobre los grupos de iconos sigue el FR-5 de la spec 004; los tests cubren
`pressed` `true`, `false` y sin valor.

## Contexto y objetivo

Las aplicaciones necesitan botones compactos, con tema, que muestren solo un icono (barras de herramientas, selector de
tema, grupos de iconos) y que aun así funcionen con teclado y con tecnología de apoyo. `sui-icon-button` es un botón
nativo con un icono, tres aspectos, tres tamaños y formas, que puede estar deshabilitado o seleccionado y puede mostrar
un badge con un número. Esta revisión (incompatible) hace que el `label` sea el único nombre accesible (sin recurso al
nombre del icono), quita el tamaño de icono que se ignoraba, y exige cero infracciones de AXE y un anillo de foco de al
menos 3:1 contra el canvas (antes: unos 1.5:1 en claro y 2.27:1 en oscuro). Los colores del tema claro son los que
reasignó la spec 002 (accent sólido 600/700/800, danger sólido 600/700).

**Conflicto conocido (decisión del propietario, 2026-10-17).** El anillo usa accent 300 en los dos temas, así que en el
tema claro el anillo tiene 1.92:1 contra el canvas e incumple WCAG 2.2 SC 1.4.11 Contraste no textual (AA), en contra
de la regla del proyecto "WCAG AA innegociable" (CLAUDE.md §12) y de la intención AA de NFR-4. axe no mide el contraste
del anillo de foco, así que una ejecución con cero infracciones no lo muestra; SC 2.4.13 Apariencia del foco es AAA y no
es el criterio aquí.

## Usuarios

- **Desarrolladores consumidores** y **mantenedores de la librería** (el selector de tema y los grupos de iconos lo
  usan); **usuarios finales**, incluidos los que usan teclado y las personas que usan tecnología de apoyo.

## Historias de usuario

- US-1. Como desarrollador consumidor, quiero un botón que muestre solo un icono para que las barras de herramientas
  sigan siendo compactas.
- US-2. Como desarrollador consumidor, quiero un único evento de activación para reaccionar al botón como a uno nativo.
- US-3. Como desarrollador consumidor, quiero elegir el aspecto, el tamaño y la forma, y marcarlo como deshabilitado o
  seleccionado.
- US-4. Como desarrollador consumidor, quiero mostrar un contador en el botón para que los usuarios vean los elementos
  pendientes.
- US-5. Como usuario de tecnología de apoyo, quiero que cada icon button nombre su acción para saber qué hace.

## Definiciones

- **Activación**: un clic de puntero, o Enter o Espacio con el foco del teclado. **En reposo**: ni con el puntero encima
  ni pulsado. **No disponible**: la activación se ignora, queda fuera del orden de foco y se anuncia como no disponible.
  **En blanco**: vacío o solo con espacios. **Color pintado del anillo**: el color del anillo de foco tal como se pinta
  sobre el canvas del tema (puede ser translúcido).
- **Aspectos de las variantes** (roles del tema): `ghost` fondo transparente, color de icono secundario, en hover fondo
  sutil y color de texto primario, al pulsar fondo apagado; `outline` fondo de superficie, borde por defecto, color de
  texto primario, en hover sutil, al pulsar apagado; `primary` fondo de acento sólido, color sobre sólido de acento, en
  hover solid-hover, al pulsar solid-active (en claro accent 600/700/800 con icono blanco; en oscuro accent 400/300/200
  con icono neutral 950).
- **Tamaños** `sm`/`md`/`lg`: un cuadrado de 32/40/48 px con un icono de 16/20/24 px; **formas**: `flat` (esquinas
  rectas), `rounded` (radio de 6/10/14 px según el tamaño) y `pill` (totalmente redondo).

## Requisitos funcionales

- FR-1: SI `sui-icon-button` no tiene `icon`, ENTONCES EL SISTEMA falla en tiempo de compilación cuando se usa en el
  marcado, o informa de un fallo cuando se crea desde código; `""` pasa y muestra un espacio vacío del tamaño del icono
  (spec 001).
- FR-2: CUANDO se activa sin estar deshabilitado, EL SISTEMA emite un `trigger` sin datos y nunca envía ni reinicia un
  formulario que lo rodee.
- FR-3: MIENTRAS `disabled` está activo, EL SISTEMA no está disponible, no emite `trigger` ante un clic real, Enter o
  Espacio y, en reposo y en hover, muestra el color de icono deshabilitado, un fondo transparente y un cursor not-allowed
  por encima de los aspectos de la variante y de `selected`.
- FR-4: El nombre accesible de EL SISTEMA es un `label` no en blanco exactamente como se da (sin recortar), nunca el
  nombre del `icon`, y el icono está oculto a la tecnología de apoyo. SI `label` está en blanco o no se da, ENTONCES EL
  SISTEMA no pone ningún nombre accesible propio. Un `label` no en blanco es solo una regla documentada: no es
  obligatorio y nada avisa de que falte.
- FR-5: EL SISTEMA muestra el aspecto de su variante (`ghost` por defecto) en reposo, en hover y al pulsar.
- FR-6: EL SISTEMA ofrece los tamaños definidos (`md` por defecto) y las formas (`rounded` por defecto), y el tamaño del
  icono sigue solo a `size`; no hay opción de tamaño de icono en el componente ni en la descripción exportada del icon
  button (incompatible).
- FR-7: MIENTRAS `selected` está activo, EL SISTEMA muestra el fondo de seleccionado y el color de icono de acento en
  reposo, en hover y al pulsar con el puntero (no al pulsar Espacio), sin anunciarlo; CUANDO `pressed` es `true` o
  `false`, EL SISTEMA lo anuncia como pulsado o no pulsado; MIENTRAS no tiene valor o es `undefined`, no hay estado
  pulsado.
- FR-8: CUANDO recibe el foco por teclado, y MIENTRAS `state` es `focus` (también en hover, al pulsar y mientras está
  deshabilitado), EL SISTEMA dibuja en todas las variantes el anillo de foco compartido del tema en accent 300, cuyo
  color pintado llega a 3:1 contra el canvas en los dos temas, salvo el fallo aceptado del tema claro recogido en NFR-4.
- FR-9: CUANDO `badge` es un número distinto de 0 y de `NaN`, EL SISTEMA lo muestra tal cual en una marca redonda de
  color de peligro, de 24 px de alto y texto de 10 px, que se superpone a la esquina superior derecha (10 px por encima,
  12 px más allá del borde); CUANDO `badge` es 0, `NaN` o no se da, no muestra ninguna.
- FR-10: MIENTRAS se muestra un badge, EL SISTEMA lo mantiene fuera del botón: no forma parte del nombre accesible, se
  expone como texto aparte y un clic sobre él no emite `trigger`.

## Requisitos no funcionales

- NFR-1: El icon button no añade ninguna dependencia a ningún paquete del proyecto (constitución, principio 1).
- NFR-2: Todo texto y nombre accesible viene del consumidor (principio 6): el número del badge, de `badge`; el nombre,
  de `label`; el icon button no añade texto propio.
- NFR-3: MIENTRAS el usuario pide movimiento reducido, todas las transiciones (color, fondo, borde, sombra) son
  instantáneas.
- NFR-4: Cero infracciones de AXE (WCAG 2.2 AA) en los temas claro y oscuro para 3 variantes × 3 tamaños × 4 estados
  sueltos (`selected`, `disabled`, `state` `focus`, un badge), cada uno con un `label` no en blanco. En los dos temas:
  anillo pintado a 3:1 contra el canvas; icono a 3:1 contra su fondo en reposo, en hover y al pulsar con puntero o
  teclado en cada variante y en `selected` (ghost contra el canvas); texto del badge a 4.5:1. Excepciones aceptadas
  (fallos conocidos): `primary` seleccionado al pulsar Espacio (1.85:1 en claro, 1.34:1 en oscuro) y el anillo del tema
  claro (1.92:1 sobre el canvas, 2.02:1 sobre superficies blancas).

## Casos límite

- **Nombre accesible** (incompatible): un `label` en blanco o ausente no da ningún nombre (una infracción de FR-4 sin
  aviso), nunca el nombre del icono; `" Close "` conserva sus espacios. Los grupos de iconos pasan el `label` de la
  entrada tal cual si no está en blanco y, si no, su `name` tal cual (spec 004 FR-5), así que solo un `label` en blanco
  con un `name` en blanco da un botón sin nombre.
- **Sin tamaño de icono** (incompatible): un tamaño de icono enlazado no compila, un atributo simple se ignora sin aviso
  y darlo desde código falla en tiempo de ejecución; un literal de descripción con él no compila, y uno que pasa por
  otro tipo conserva el campo ignorado.
- **Valores y posición del badge**: 0 y `NaN` no muestran ninguno; los números negativos y decimales se muestran tal
  cual (`-1`, `1.5`); los números grandes no tienen tope y ensanchan la marca. Tapa hasta 12 × 14 px de la esquina
  superior derecha (una parte grande de `sm`), donde un clic no emite `trigger`, puede superponerse a los vecinos y
  mantiene sus colores de peligro completos mientras está deshabilitado.
- **Deshabilitado con otros estados**: el aspecto deshabilitado gana a `selected`; `outline` mantiene su borde; `state`
  `focus` mantiene su anillo. **Pulsado**: `pressed` y `selected` son independientes; deshabilitado mantiene el estado
  pulsado.
- **API de activación**: `trigger` es el evento de activación; la propagación del clic no se detiene. Un clic lanzado
  por script sobre un botón deshabilitado sigue emitiendo `trigger` (aceptado, como en la spec 002). El selector de tema
  escucha en cambio los clics en bruto, así que un clic sobre un badge también le llegaría (hoy no muestra ninguno).

## Fuera de alcance

- El selector de tema y los grupos de iconos como componentes (incluido el recurso del grupo al `label` y, si no, al
  `name`), y el resto de la descripción exportada del icon button: solo se quita su campo de tamaño de icono; sigue sin
  tener `label` ni `disabled`.
- Carga, menú (`expanded`), tipos submit/reset, un aspecto `danger` y ancho completo, que ofrece `sui-button` (ver la
  pregunta abierta sobre paridad); estados combinados en la matriz de NFR-4 (por ejemplo, deshabilitado con
  seleccionado o con un badge).
- Tooltips que muestren el nombre, colores fuera del tema, páginas de derecha a izquierda (lado del badge), modos de
  colores forzados y el desbordamiento de la demo a 375 px (pregunta abierta).
- Tokens del tema distintos del anillo de foco compartido, cuyo nuevo color (en los dos temas) también cambia los
  anillos de `sui-button`, el split button, `sui-link`, `sui-text-field` y `sui-textarea` (aceptado, aunque la spec 002
  mantenía los anillos como estaban; sus anillos del tema claro también quedan por debajo de 3:1).
- El anillo de foco de peligro, que solo usa `sui-button`, se queda como está.

## Criterios de finalización

- FR-1: la build de un consumidor falla cuando `sui-icon-button` se usa en el marcado sin `icon` o con un tamaño de
  icono enlazado, como se comprobó en la spec 002; un test unitario cubre el fallo cuando se crea desde código sin
  `icon`.
- FR-2 a FR-10 están cubiertos por tests (principio 4): FR-3 con su aspecto y con Enter o Espacio, FR-4 con el icono
  oculto y cada caso límite de nombre (`label` no en blanco tal cual, nunca el nombre del icono, ninguno con un `label`
  en blanco); el test existente que espera el nombre del icono se actualiza, el resto se queda; lo que un test unitario
  no puede observar se comprueba en un navegador.
- La sección de icon buttons de la demo sustituye sus filas duplicadas por los 36 botones de NFR-4 en un contenedor con
  id estable, que se cargan al hacer scroll hasta ellos con un placeholder y un estado de carga, más un botón por forma;
  cada icon button de la demo tiene su propio `label` no en blanco que nombra su acción, y el desbordamiento de la
  página a 375 px no crece.
- FR-8, NFR-3 y NFR-4 (AXE y contraste, con sus dos excepciones aceptadas) se cumplen en los 36 botones y en los botones
  de forma en los dos temas, con el anillo y ghost medidos contra el canvas; el selector de tema y los 18 icon buttons de
  los grupos no se comprueban.
- Se cumplen NFR-1 y NFR-2; pasan todas las comprobaciones del proyecto; la nota de release enumera los cambios
  incompatibles: sin nombre accesible por el nombre del icono, tamaño de icono quitado del componente y de la
  descripción exportada, y el nuevo color del anillo de foco compartido (accent 300; en el tema claro por debajo de
  3:1, un fallo WCAG AA conocido), que cambia todos los anillos de foco que la spec 002 decía que se mantendrían.

## Preguntas abiertas

- [NEEDS CLARIFICATION] Badge (FR-9, FR-10): se sugiere anunciarlo como parte del botón (texto sustituible, principio
  6); decidir un tope (por ejemplo `99+`), qué muestran los valores 0, `NaN`, negativos o decimales, si los clics sobre
  la marca activan el botón (tapa parte de `sm`) y si se atenúa mientras está deshabilitado.
- [NEEDS CLARIFICATION] `selected` (FR-7): ¿mantener su aspecto al pulsar Espacio (se anuncia mediante `pressed` desde
  la spec 004), lo que también quita la excepción de NFR-4?
- [NEEDS CLARIFICATION] `state` `focus` (FR-8): solo lo usa la demo y se dibuja mientras está deshabilitado; ¿quitarlo o
  hacerlo coherente?
- [NEEDS CLARIFICATION] Paridad con `sui-button`: aquí `outline` es neutro (allí de acento), el aspecto por defecto es
  `ghost` (allí `primary`), y no hay aspecto `danger`, carga, menú (`expanded`), submit/reset ni ancho completo;
  ¿alinearlos?, ¿y debería el selector de tema reaccionar mediante `trigger`?
- [NEEDS CLARIFICATION] Pantallas estrechas: el icon button del selector de tema es una de las causas del
  desbordamiento de la demo a 375 px (la página mide 444 px de ancho); ¿arreglarlo aquí o en una spec de la demo o del
  selector de tema?
