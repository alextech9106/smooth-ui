# Spec 002 — sui-button

Status: implemented (2026-10-16); FR-7 amended for spec 004, approved and implemented 2026-10-17

**Enmienda (spec 004, aprobada el 2026-10-17; implementada el 2026-10-17).** FR-7 añade el input `pressed` y su
anuncio; "Fuera de alcance" acota la exclusión de los botones conmutadores; los tests cubren `pressed` `true`, `false` y
sin valor.

## Contexto y objetivo

Las aplicaciones necesitan botones coherentes, con tema, que funcionen con teclado y con tecnología de apoyo.
`sui-button` es un botón nativo con un texto, un icono opcional, seis aspectos, tres tamaños y formas, que puede estar
deshabilitado, ocupado o seleccionado. Esta revisión (incompatible) documenta la regla del nombre accesible, deja de usar
el icono como nombre, mantiene obligatorio el `name` del split y quita el tamaño del icono. También oscurece los colores
`primary` y `danger` del tema claro, porque su texto no llega al contraste WCAG AA (unos 3.8:1 en lugar de 4.5:1).

## Usuarios

- **Desarrolladores consumidores** y **mantenedores de la librería** (grupos, split buttons); **usuarios finales**,
  incluidos los que usan teclado o control por voz y las personas que usan tecnología de apoyo.

## Historias de usuario

- US-1. Como desarrollador consumidor, quiero un botón con un texto y un icono opcional para no tener que dar estilo a
  los botones yo mismo.
- US-2. Como desarrollador consumidor, quiero eventos de activación y envío/reinicio de formulario para que funcione
  como un botón nativo.
- US-3. Como desarrollador consumidor, quiero marcar un botón como no disponible u ocupado para que no se pueda activar
  mientras tanto.
- US-4. Como desarrollador consumidor, quiero elegir el aspecto, el tamaño y la forma de un botón para que encaje en
  cada sitio.
- US-5. Como usuario de tecnología de apoyo o de control por voz, quiero un nombre que coincida con el texto visible
  para poder invocarlo.

## Definiciones

- **Activación**: un clic de puntero, o Enter o Espacio con el foco del teclado. **En reposo**: ni con el puntero encima
  ni pulsado. **No disponible**: la activación se ignora, queda fuera del orden de foco y se anuncia como no disponible.
- **Texto visible**: el `name` tal cual, mostrado dentro del botón; `""` no muestra ninguno. **En blanco**: vacío o solo
  con espacios. **Contiene**: tras recortar, colapsar los espacios internos e ignorar mayúsculas, el texto visible está
  dentro del `label`.
- **Aspectos de las variantes** (roles del tema): `primary` fondo de acento sólido, texto sobre sólido de acento;
  `secondary` fondo de superficie, texto primario, borde por defecto; `tonal` fondo de acento suave, texto de acento;
  `outline` transparente, texto y borde de acento; `ghost` transparente, texto secundario, sin sombra; `danger` fondo
  sólido de peligro, texto sobre sólido.
- **Aspecto deshabilitado**: fondo, texto y borde de deshabilitado, sin sombra, cursor not-allowed. **Indicador de
  carga**: un anillo que gira, oculto a la tecnología de apoyo, de 20 px (16 px más un borde de 2 px por lado), en el
  color de texto actual.
- **Tamaños** `sm`/`md`/`lg`: alto 32/40/48 px, relleno lateral 12/16/20 px, texto `md` de 14 px (tokens del tema); el
  texto `sm`/`lg` de 13/15 px y el icono de 16/20/24 px son fijos. **Formas**: `flat`, `rounded` (radio 6/10/14 px,
  tokens) y `pill`.

## Requisitos funcionales

- FR-1: SI `sui-button` o el split button no tienen `name`, ENTONCES EL SISTEMA falla en tiempo de compilación cuando se
  usa en el marcado (spec 001), o informa de un fallo cuando se crea desde código; `""` pasa esta comprobación.
- FR-2: CUANDO se activa sin estar deshabilitado ni cargando, EL SISTEMA emite un `trigger` sin datos y, según `type`,
  no hace nada (`button`, por defecto), envía (`submit`) o reinicia (`reset`) el formulario que lo rodea.
- FR-3: MIENTRAS `disabled` está activo, con o sin `loading`, EL SISTEMA no está disponible, no emite nada y, en reposo,
  muestra el aspecto deshabilitado en lugar de los aspectos de la variante, de `selected` y de `state` `focus`.
- FR-4: MIENTRAS `loading` está activo, EL SISTEMA muestra el indicador de carga en lugar del icono y el texto, no está
  disponible y se anuncia ocupado, mantiene el nombre de FR-5, el aspecto de la variante y el cursor pointer, y nunca
  mueve el foco a otro elemento.
- FR-5: El nombre accesible de EL SISTEMA es el `label` tal cual si no está vacío ni es solo espacios y, si no, el texto
  visible; nunca el icono. La regla documentada, que no se comprueba en tiempo de ejecución, es un `label` no en blanco
  que contenga el texto visible.
- FR-6: CUANDO se da `expanded`, EL SISTEMA anuncia que abre un menú y si está expandido; si no, ninguna de las dos
  cosas.
- FR-7: EL SISTEMA muestra el aspecto de su variante (`primary` por defecto); MIENTRAS `selected` está activo, EL
  SISTEMA muestra el fondo de seleccionado y el texto de acento en reposo, en hover y al pulsar con el puntero (no al
  pulsar Espacio), sin anunciarlo; CUANDO `pressed` es `true` o `false`, EL SISTEMA lo anuncia como pulsado o no
  pulsado; MIENTRAS no tiene valor o es `undefined`, no hay estado pulsado.
- FR-8: EL SISTEMA ofrece los tamaños definidos (`md` por defecto) y las formas (`rounded` por defecto) y, MIENTRAS
  `fullWidth` está activo, ocupa todo el ancho de su contenedor.
- FR-9: CUANDO se da un icono, EL SISTEMA lo muestra oculto a la tecnología de apoyo, antes del texto visible o después
  de él MIENTRAS `iconEnd` está activo (spec 001 FR-3); CUANDO `name` es `""`, EL SISTEMA reduce el relleno lateral a
  8 px.
- FR-10: CUANDO recibe el foco por teclado, EL SISTEMA dibuja el anillo de foco (anillo de peligro en `danger`);
  MIENTRAS `state` es `focus` y no está deshabilitado, dibuja el anillo normal salvo en el hover de `primary` y al pulsar
  `primary`/`secondary`.

## Requisitos no funcionales

- NFR-1: El botón no añade ninguna dependencia a ningún paquete del proyecto (constitución, principio 1).
- NFR-2: Todo texto y nombre accesible viene del consumidor (principio 6); el botón no añade texto propio.
- NFR-3: MIENTRAS el usuario pide movimiento reducido, todas las transiciones (color, borde, sombra, movimiento) son
  instantáneas y el indicador de carga da una vuelta cada 2 s en lugar de cada 0.7 s.
- NFR-4: Cada combinación de las 6 variantes × 3 tamaños × 4 estados (`selected`, `loading`, `disabled`, `state`
  `focus`), más `loading` con `selected`, con `state` `focus` y con `disabled`, cada una con un nombre accesible no en
  blanco, tiene cero infracciones de AXE frente a WCAG 2.2 AA en los temas claro y oscuro; el texto sobre sólido de
  `primary` y `danger` tiene un contraste de al menos 4.5:1 contra su fondo sólido en reposo, en hover y al pulsar, en
  los dos temas.

## Casos límite

- **Nombre accesible** (incompatible): un `label` solo con espacios recurre al texto visible, así que solo un `label` en
  blanco con un `name` en blanco da un nombre en blanco, aunque haya icono, y nada lo avisa. El `name` "Save" encaja con
  el `label` `"save  DRAFT"`, no con "Store" (tampoco se avisa).
- **Split button y grupos**: un split con un `name` en blanco, y una entrada de grupo con un nombre en blanco y sin
  label o con un label que no contiene su nombre, incumplen la regla documentada de FR-5 sin que nada lo avise; la parte
  del menú del split la cumple.
- **API de activación**: solo el evento `trigger` del botón es una forma admitida de reaccionar a la activación;
  escuchar los clics en bruto sobre el componente no está admitido. El botón no detiene la propagación del clic. Un
  evento de clic lanzado por script sobre un botón deshabilitado o cargando sigue emitiendo `trigger` (aceptado; los
  clics reales y Enter o Espacio no lo hacen).
- **Sin tamaño de icono** (API pública incompatible): una descripción de botón escrita directamente con un tamaño de
  icono se rechaza al compilar el código; una que pasa por otro tipo conserva el campo, que se ignora.
- **Cargando o deshabilitado**: sin `fullWidth` se estrecha hasta el indicador más el relleno; con los dos, gana el
  deshabilitado. Cargando mantiene, en reposo, el aspecto de `selected` (indicador en el color de texto de acento) y el
  anillo de `state` `focus`. **Pulsado**: `pressed` y `selected` son independientes; con `expanded` se anuncian los
  dos; deshabilitado o cargando mantienen el estado pulsado.

## Fuera de alcance

- Navegar a otra página (`sui-link`), contenido enriquecido proyectado, conmutar por sí mismo (el botón nunca cambia
  `pressed` ni `selected`), colores fuera del tema, páginas de derecha a izquierda y modos de colores forzados.
- `sui-icon-button`, los grupos y los split buttons (salvo FR-1 y FR-5) y el resto de la descripción del botón (campos
  que el grupo no aplica, sin `disabled`, `size`/`variant` que los grupos no aplican), que quedan para una spec del
  grupo de botones.
- Los textos fijos del split "More options" y "Options" (no se pueden sustituir, en contra del principio 6): para una
  spec del split o del grupo.
- El resto del tema: solo cambian en claro `--sui-color-accent-solid`/`-hover`/`-active` (a
  `--sui-accent-600`/`700`/`800`) y `--sui-color-danger-solid`/`-hover` (a `--sui-danger-600`/`700`); el texto blanco,
  el tema oscuro y los anillos de foco se mantienen.
- Un token de pulsado para `danger`: al pulsar se mantiene el color sólido de peligro, ahora más claro que el hover
  (aceptado). Revisar `sui-icon-button`, `sui-button-group`, `sui-text-field` y `sui-textarea`, que comparten estos
  tokens y se ven más oscuros.

## Criterios de finalización

- FR-1, FR-2: no hay build sin `name` en `sui-button` ni en el split button usados en el marcado, y hay un fallo
  informado al crearlos desde código sin él; un clic, Enter o Espacio emite un `trigger`; `submit`/`reset` actúan
  sobre el formulario.
- FR-3, FR-4: deshabilitado y cargando no emiten nada y salen del orden de foco; al entrar en `loading` el foco está en
  el botón o en ningún elemento, nunca en otro; los aspectos, el indicador y el cursor siguen los FR.
- FR-5 en cada caso límite de nombre: el nombre es el `label` tal cual si no está en blanco y, si no, el texto visible
  (también con un `label` solo de espacios), nunca el id del icono, y no se avisa de nada; se cumplen FR-6, el
  `pressed` de FR-7 (`true`/`false`/sin valor) y FR-9; no hay campo de tamaño de icono.
- La demo muestra las 6 variantes × 3 tamaños × 4 estados y las tres combinaciones con `loading` de NFR-4, un botón solo
  con `label` y un `label` que contiene su texto, y reacciona a la activación solo mediante `trigger`; allí se cumplen
  FR-7, FR-8, FR-10, NFR-3 y NFR-4 (WCAG 2.2 AA) en los temas claro y oscuro.
- Contraste de NFR-4: el texto de `primary` y `danger` llega a 4.5:1 en reposo, en hover y al pulsar en los dos temas;
  la página de la demo pinta el fondo canvas del tema detrás de todo su contenido en los dos temas, y NFR-4 se cumple
  sobre él.
- Se cumplen NFR-1 y NFR-2; el comportamiento que cambia incluye tests (principio 4), el test existente que espera el id
  del icono como nombre se actualiza al nuevo nombre de FR-5, el resto de tests existentes se quedan como están; pasan
  todas las comprobaciones del proyecto.

## Preguntas abiertas

- [NEEDS CLARIFICATION] `selected` (FR-7): ¿mantener su aspecto al pulsar Espacio (se anuncia mediante `pressed` desde
  la spec 004)?
- [NEEDS CLARIFICATION] `state="focus"` (FR-10) solo lo usa la demo y es incoherente: ¿quitarlo o hacerlo coherente?
- [NEEDS CLARIFICATION] Carga (FR-4): se sugiere un indicador con el tamaño del botón y mantener el ancho; decidir el
  aspecto, el cursor y el foco.
- [NEEDS CLARIFICATION] Deshabilitado en hover (FR-3): se cuelan el texto de `ghost`, el borde de `secondary`/`outline`
  y el texto de `selected`.
- [NEEDS CLARIFICATION] Valores fijos (FR-8): se sugieren tokens del tema para el texto `sm`/`lg` y los tamaños de icono.
- [NEEDS CLARIFICATION] `name` solo con espacios (FR-9): se sugiere no mostrar texto y usar el relleno de 8 px, como con
  `""`.
