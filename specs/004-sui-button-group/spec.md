# Spec 004 — sui-button-group

Status: implemented (2026-10-17; aprobada como el comportamiento de hoy, reaprobada con el cambio de nombres, rol y
nombre del grupo y estado pulsado, y después implementada)

## Contexto y objetivo

Las aplicaciones necesitan unir acciones relacionadas en un solo control (barras de herramientas, elecciones
segmentadas) que funcione con teclado y con tecnología de apoyo. `sui-button-group` muestra descripciones de botones
como segmentos contiguos de texto o de icono con un único tamaño, aspecto y forma, y ejecuta la acción de cada entrada.
Esta revisión da a los dos tipos una sola regla de nombre, expone el conjunto como un grupo con nombre opcional y
anuncia `selected` como pulsado mediante un nuevo estado pulsado de las specs 002 y 003 (FR-7); llega al split button
("Casos límite"). Los aspectos de los segmentos y los anillos de foco siguen las specs 002 y 003.

**Problemas conocidos (decisión del propietario, 2026-10-17).** El grupo deja el anillo de foco de cada segmento como
está: el grupo lo recorta en sus bordes exteriores y un segmento siguiente con fondo lo tapa, así que el primer segmento
`primary` y un grupo de una sola entrada no muestran un anillo visible (un hueco de WCAG 2.2 SC 2.4.7 Foco visible). En
el tema oscuro el anillo (accent 300) es el color de hover de `primary` (unos 1:1) y tiene unos 1.4:1 contra `primary`
en reposo (accent 400). Los dos se aceptan, como el contraste del anillo del tema claro de la spec 003 (1.92:1 sobre el
canvas); axe no los detecta.

## Usuarios

- **Desarrolladores consumidores** y **mantenedores de la librería** (el split button lo usa); **usuarios finales**,
  incluidos los que usan teclado y las personas que usan tecnología de apoyo.

## Historias de usuario

- US-1. Como desarrollador consumidor, quiero unir acciones relacionadas en un solo control para que se lean como un
  conjunto.
- US-2. Como desarrollador consumidor, quiero segmentos de texto o de icono con un único tamaño, aspecto y forma para
  que el conjunto quede uniforme.
- US-3. Como desarrollador consumidor, quiero que cada segmento ejecute su propia acción y muestre si está seleccionado.
- US-4. Como mantenedor de la librería, quiero construir el split button sobre el grupo para que los dos se vean igual.
- US-5. Como usuario de teclado o de tecnología de apoyo, quiero llegar a cada segmento, identificarlo y usarlo, y saber
  cuál está seleccionado.

## Definiciones

- **Entrada**: un elemento de la lista `buttons` (la descripción de botón exportada). **Segmento**: el botón que se
  dibuja para una entrada. Los conjuntos de valores del `type` (`button` | `icon`) y del `variant` (`ghost` |
  `primary`) del grupo se exportan.
- **Activación**, **en blanco**, **en reposo** y los aspectos `ghost`/`primary`: como en las specs 002 (texto) y 003
  (icono).
- **Dado**: presente en la entrada con un valor, `true` o `false` para `selected` y `expanded`; un `undefined` explícito
  cuenta como no dado.

## Requisitos funcionales

- FR-1: SI `sui-button-group` no tiene `buttons`, ENTONCES EL SISTEMA falla en tiempo de compilación cuando se usa en el
  marcado, o informa de un fallo cuando se crea desde código; una lista vacía pasa y no muestra ningún segmento.
- FR-2: EL SISTEMA muestra un segmento por entrada, en el orden de la lista, en una fila: MIENTRAS `type` es `button`
  (por defecto), el `name` de la entrada como texto después de su `icon`, si lo tiene; MIENTRAS es `icon`, el `icon` (un
  espacio en blanco del tamaño del icono si no lo tiene).
- FR-3: CUANDO se activa un segmento, EL SISTEMA llama una vez al `callback` de su entrada, como método de la entrada y
  sin datos, o no hace nada si no lo tiene; el grupo no emite ningún evento, nunca cambia ningún `selected` y nunca
  envía un formulario.
- FR-4: EL SISTEMA da a cada segmento el `size` (`md` por defecto), el `variant` (`ghost` por defecto, o `primary`) y
  las esquinas rectas del grupo, y aplica de cada entrada su `name`, `label`, `icon`, `selected` (FR-7), `expanded`
  (tipo `button`, FR-7) y `callback`; la descripción de la entrada se queda como está.
- FR-5: EL SISTEMA nombra cada segmento, en los dos tipos, con su `label` tal cual si no está en blanco y, si no, con
  su `name` tal cual, salvo en el tipo `button` con un `label` vacío, donde lo nombra su texto visible (recortado). SI
  los dos están en blanco, ENTONCES el segmento no tiene nombre accesible: en el tipo `button` un `name` vacío da un
  `aria-label` vacío, y un `name` de espacios da un contenido solo de espacios, y ningún `aria-label` si el `label` está
  vacío o, si no, un `aria-label` solo de espacios; en el tipo `icon`, ningún `aria-label`. Nada avisa de un nombre en
  blanco (como en las specs 002 y 003).
- FR-6: EL SISTEMA expone el grupo con el rol `group`, nombrado por su `label` opcional tal cual si no está en blanco;
  SI el `label` está en blanco o no se da, ENTONCES el grupo no tiene nombre accesible. Cada segmento sigue siendo su
  propia parada de Tab, en el orden de la lista, y el grupo no añade ningún manejo de teclas propio.
- FR-7: MIENTRAS el `selected` de una entrada es true, EL SISTEMA muestra el aspecto de seleccionado de las specs 002 y
  003 (FR-7); CUANDO se da `selected`, el segmento lo anuncia como pulsado (`true`) o no pulsado (`false`) y, si no, no
  tiene estado pulsado; MIENTRAS `type` es `button` y se da `expanded`, también anuncia un menú y su estado (spec 002
  FR-6).
- FR-8: EL SISTEMA mantiene los segmentos dentro del contorno del grupo: esquinas rectas en `flat` (por defecto), un
  radio de 10 px en todos los tamaños en `rounded`, extremos totalmente redondos en `pill`.
- FR-9: MIENTRAS `variant` es `ghost`, EL SISTEMA dibuja un contorno de 1 px alrededor del grupo y una línea de 1 px
  entre segmentos contiguos, los dos en el color de borde por defecto; MIENTRAS es `primary`, sin contorno y con la línea
  en el color de acento sólido.
- FR-10: CUANDO un segmento recibe el foco por teclado, EL SISTEMA dibuja el anillo propio de ese segmento (spec 002
  FR-10, spec 003 FR-8), sin que el grupo lo cambie: recortado en los bordes exteriores del grupo y tapado por un
  segmento siguiente con fondo (los problemas conocidos de "Contexto y objetivo").

## Requisitos no funcionales

- NFR-1: El grupo no añade ninguna dependencia a ningún paquete del proyecto (constitución, principio 1).
- NFR-2: Todo texto y nombre accesible viene del consumidor (principio 6): los nombres de los segmentos, de las
  entradas; el nombre del grupo, de su `label`; el grupo no añade texto propio.
- NFR-3: El grupo no añade movimiento propio; sus segmentos mantienen el comportamiento de movimiento reducido de las
  specs 002 y 003.
- NFR-4: Cero infracciones de AXE (WCAG 2.2 AA) en los dos temas para cada tipo, variante y forma al menos una vez, en
  grupos con nombre y entradas con nombre, una de ellas `selected`; los problemas conocidos de "Contexto y objetivo" son
  las excepciones aceptadas.

## Casos límite

- **Nombres** (incompatible en el tipo `icon`): un `label` en blanco ahora recurre a un `name` no en blanco. Un `label`
  `" Bold "` conserva sus espacios en el atributo `aria-label` en los dos tipos; un `name` `" Bold "` conserva sus
  espacios en el `aria-label` en el tipo `icon`, y en el tipo `button` cuando el `label` es solo de espacios; con un
  `label` vacío nombra el segmento mediante su texto visible, que se recorta.
- **Nombre del grupo**: un `label` de grupo `" Tools "` nombra el grupo con sus espacios; `""` o `"  "` no dan nombre de
  grupo.
- **Pulsado**: `selected: false` anuncia no pulsado y una entrada sin `selected` no anuncia ningún estado pulsado, así
  que un mismo grupo puede mezclar los dos. En el tipo `button`, una entrada con `selected` y `expanded` anuncia los
  dos, sin regla extra; en el tipo `icon`, `expanded` no se anuncia (como hoy).
- **Split button**: su modo icono es un grupo de tipo `button` con segmentos de `name` en blanco nombrados por el
  `label` (no le llega ningún cambio del tipo `icon`); su menú se nombra `name() || 'Options'`. Reconstruye sus
  entradas en cada apertura o cierre del menú; un `name` del split en blanco deja su segmento principal sin nombre
  (FR-5); no pasa `label` de grupo (grupo sin nombre) ni `selected` (sin estado pulsado), mantiene `expanded` en la
  flecha y su orden de Tab; se le aplican el rol de FR-6 y FR-10.
- **Grupo vacío o de una entrada**: un grupo vacío no tiene nada que enfocar; un grupo de una entrada no muestra un
  anillo visible (FR-10).

## Fuera de alcance

- El comportamiento propio del split button (menú, teclas, textos fijos "More options" y "Options") más allá de lo que
  cambia el grupo.
- Los aspectos y nombres de `sui-button` y `sui-icon-button` (specs 002 y 003), salvo su enmienda de FR-7 del estado
  pulsado; el color del anillo compartido, cómo se dibujan, recortan o tapan los anillos, el anillo oscuro sobre
  `primary` y los tokens del tema.
- La navegación con flechas, una sola parada de Tab para el grupo y la selección gestionada por el grupo (propietario:
  solo el rol `group`).
- Segmentos o grupos deshabilitados, la identidad de las entradas, un output de activación, la línea de `primary`, el
  radio de `rounded` según el tamaño, y avisar de los nombres en blanco.
- Disposiciones verticales o que salten de línea, páginas de derecha a izquierda, modos de colores forzados y colores
  fuera del tema.

## Criterios de finalización

- Aprobada el 2026-10-17 como el comportamiento de hoy; esta revisión y las enmiendas de FR-7 de las specs 002 y 003
  (estado pulsado) se aprueban antes de su plan; la nota de "Nombre accesible" de la spec 003 sobre los grupos de iconos
  sigue FR-5 (principio 2).
- Los tests unitarios (principio 4) cubren cada FR: la parte de FR-1 desde código (la parte de compilación con una build
  de consumidor, como en 002/003), FR-2 en los dos tipos, FR-3, FR-4, FR-5 en cada caso límite de nombre y los tres
  resultados sin nombre, FR-6 rol, nombre (dado, en blanco, ausente) y orden de Tab, FR-7 aspecto y estado pulsado
  (`true`, `false`, ausente) en los dos tipos y `expanded` con y sin `selected`; FR-8 y FR-9 mediante las clases que
  ponen; el estado pulsado en los tests de 002 y 003; los tests del split se actualizan donde haga falta y siguen en
  verde.
- En un navegador, en los dos temas: esquinas de FR-8, líneas y colores de FR-9, anillos de FR-10 tal como se recogen
  (problemas conocidos confirmados, no arreglados) y el estado pulsado en el árbol de accesibilidad.
- La demo muestra un grupo con nombre, un grupo `primary`, un grupo de una entrada, una entrada con `selected` junto a
  una sin él, y grupos que cubren el conjunto de NFR-4; NFR-1 a NFR-4 se cumplen en los grupos y split buttons de la
  demo; pasan todas las comprobaciones del proyecto.
- La nota de release enumera el recurso de nombre incompatible del tipo `icon`, el rol `group` y su `label` opcional,
  el nuevo input pressed de `sui-button` y `sui-icon-button` que usan los segmentos del grupo para `selected`, y los
  problemas conocidos.

## Preguntas abiertas

- Diferidas (no bloquean): entradas y grupos deshabilitados; la identidad de las entradas (`id`, seguimiento por él) y
  un output de activación en lugar de `callback`; una línea visible entre segmentos `primary` en reposo y un radio de
  `rounded` que siga a `size`.
