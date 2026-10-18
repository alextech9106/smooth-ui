# Spec 005 — sui-button-split

Status: implemented

## Contexto y objetivo

Las aplicaciones necesitan una acción principal con acciones alternativas a mano ("Guardar" y, en un menú, "Guardar una
copia", "Guardar como plantilla"). `sui-button-split` ya existe: une un segmento principal y un segmento de flecha en un
grupo (spec 004), y la flecha abre un menú de opciones. Esta spec recoge cómo se comporta hoy y los cambios que el
usuario eligió el 2026-10-18 al resolver las preguntas de la clarificación, con el patrón menu button de WAI-ARIA como
referencia: textos sustituibles (principio 6), abrir con las flechas, no abrir sin opciones y foco itinerante en el menú.

Excepción de tamaño: la spec tiene 16 FR, por encima del máximo de 10 de la skill sdd. El usuario decidió de forma
explícita el 2026-10-18 mantenerla como una sola spec en lugar de dividirla.

## Usuarios

- **Desarrolladores consumidores**; **usuarios finales**, incluidos los que usan teclado y tecnología de apoyo.

## Historias de usuario

- US-1. Como desarrollador consumidor, quiero una acción principal con un menú de alternativas en un solo control.
- US-2. Como desarrollador consumidor, quiero saber qué opción del menú se eligió para reaccionar a ella.
- US-3. Como desarrollador consumidor, quiero el modo texto o icono, el tamaño, el aspecto, la forma y los textos.
- US-4. Como usuario de teclado, quiero abrir el menú, recorrerlo, elegir y cerrarlo sin perder el foco.
- US-5. Como usuario de tecnología de apoyo, quiero saber que la flecha abre un menú y si está abierto.

## Definiciones

- **Segmento principal** y **flecha**: los dos segmentos del grupo interno, en ese orden. **Opción**: un `MenuItem` de
  `menuItems` (`id` y `title` obligatorios, `icon` con nombre y tamaño, `separatorAfter` opcional) y su elemento de menú.
- **Abierto**: el estado interno del menú; el menú solo se ve MIENTRAS está abierto y hay al menos una opción.
- **Valores por defecto**: `mode` `default`, `size` `md`, `variant` `ghost` (también `primary`), `shape` `flat`, `icon`
  `""` (ningún icono), `menuItems` lista vacía, nombre de la flecha "More options" y nombre de reserva del menú
  "Options". **Activación** y **en blanco**: como en las specs 002 y 004.

## Requisitos funcionales

- FR-1: SI se usa `sui-button-split` sin `name`, ENTONCES EL SISTEMA falla al compilar la plantilla o, si se crea desde
  código, informa de un fallo; `""` se acepta.
- FR-2: EL SISTEMA muestra el segmento principal y la flecha (icono `chevron-down`) con el `size`, el `variant` y la
  `shape` dados.
- FR-3: EL SISTEMA expone los segmentos como un grupo sin nombre y sin estado pulsado, y cada segmento es su propia
  parada de Tab (spec 004 FR-6).
- FR-4: MIENTRAS `mode` es `default`, el segmento principal muestra el `name` como texto; MIENTRAS es `icon`, muestra solo
  el `icon` (con `""`, el segmento queda vacío) y se nombra con el `name` como un `sui-button` (spec 002 FR-5).
- FR-5: CUANDO se activa el segmento principal, EL SISTEMA emite un `trigger` sin datos, no cambia el estado del menú y
  nunca envía un formulario.
- FR-6: EL SISTEMA nombra la flecha con un texto que da el consumidor (por defecto "More options") y anuncia que abre un
  menú y si está abierto; CUANDO se activa la flecha y hay al menos una opción, EL SISTEMA abre el menú si está cerrado
  o lo cierra si está abierto, sin mover el foco al cerrar.
- FR-7: MIENTRAS el menú está cerrado, SI `menuItems` está vacía, ENTONCES EL SISTEMA no abre el menú al activar la
  flecha ni con las teclas de FR-11, la flecha sigue anunciando que está cerrado y Flecha abajo y Flecha arriba sobre
  ella no desplazan la página.
- FR-8: MIENTRAS el menú se ve, EL SISTEMA lo expone con el rol `menu`, nombrado `name` o, si `name` es `""`, con un
  texto que da el consumidor (por defecto "Options"), con un `menuitem` por opción en orden (icono y `title`) y un
  separador tras cada opción con `separatorAfter`; lo coloca bajo el control, alineado a la izquierda, o encima SI al
  abrir el espacio bajo el componente (con su hueco de 6 px) es menor que el alto del menú y el de arriba es mayor.
- FR-9: CUANDO se activa una opción (clic, Enter o Espacio), EL SISTEMA emite `itemSelected` con esa misma `MenuItem`,
  cierra el menú y devuelve el foco a la flecha.
- FR-10: EL SISTEMA dibuja el menú con `--sui-color-bg-surface-raised`, borde `--sui-border-width-thin` de
  `--sui-color-border-subtle`, sombra `--sui-elevation-lg` y radio `--sui-radius-md`; cada opción toma
  `--sui-color-bg-subtle` en hover y, solo con `:focus-visible`, ese fondo más `--sui-focus-ring`.
- FR-11: CUANDO se abre el menú con clic, Enter o Espacio sobre la flecha, EL SISTEMA enfoca la primera opción; CUANDO,
  con el foco en la flecha y al menos una opción, se pulsa Flecha abajo o Flecha arriba, EL SISTEMA abre el menú si está
  cerrado (si ya está abierto, sigue abierto) y enfoca la primera o la última opción.
- FR-12: MIENTRAS el menú está abierto, ninguna opción es parada de Tab; con el foco en el menú, Flecha abajo y Flecha
  arriba mueven el foco a la opción siguiente o anterior, de forma circular, e Inicio y Fin a la primera y la última;
  con el foco en el contenedor del menú, Flecha abajo va a la primera y Flecha arriba a la última.
- FR-13: MIENTRAS el menú está abierto, CUANDO se pulsa Escape en cualquier punto del componente, EL SISTEMA lo cierra y
  enfoca la flecha; CUANDO se pulsa el puntero fuera del componente, EL SISTEMA cierra el menú y no devuelve el foco a
  la flecha.
- FR-14: CUANDO se pulsa Tab con el foco en el menú, EL SISTEMA lo cierra y el foco pasa al siguiente elemento enfocable
  de la página tras el split.
- FR-15: SI `menuItems` se vacía MIENTRAS el menú está abierto, ENTONCES EL SISTEMA cierra el menú, la flecha anuncia
  que está cerrado y, si el foco estaba en el menú, EL SISTEMA lo mueve a la flecha.
- FR-16: CUANDO se pulsa Mayús+Tab con el foco en el menú, EL SISTEMA lo cierra y mueve el foco a la flecha.

## Requisitos no funcionales

- NFR-1: El split button no añade ninguna dependencia a ningún paquete del proyecto (constitución, principio 1).
- NFR-2: Todos los textos visibles y nombres vienen del consumidor o se pueden sustituir; los únicos por defecto, en
  inglés, son "More options" y "Options" (principio 6).
- NFR-3: El split button no añade movimiento propio; respeta el movimiento reducido de las specs 002 y 004.
- NFR-4: Cero infracciones de AXE (WCAG 2.2 AA) en los dos temas, en los dos modos y variantes, con el menú cerrado y
  abierto; los problemas de anillo de foco aceptados en la spec 004 siguen siendo excepciones.

## Casos límite

- **Escape y navegadores**: desde el segmento principal con el menú abierto, Escape mueve el foco a la flecha y no se
  detiene (dentro de un diálogo también lo cerraría); al abrir con clic, el foco por código puede no mostrar fondo ni
  anillo (FR-10); en Safari un clic no enfoca el botón pulsado.
- **Nombres**: con `name` en blanco el segmento principal queda sin nombre accesible (AXE `button-name`) y uno solo de
  espacios nombra el menú con espacios; un nombre de flecha en blanco la deja sin nombre (spec 004), y uno igual a
  `name` repite la clave de seguimiento de los segmentos: ambos son errores del consumidor.
- **Opciones**: si `menuItems` cambia con el menú abierto y desaparece la opción enfocada sin vaciarse la lista, el foco
  pasa a `body`; si se vacía, se aplica FR-15; `separatorAfter` en la última dibuja un separador final; `id` repetidos
  son un error del consumidor.
- **Tab al final de la página**: si no hay ningún elemento enfocable tras el split, el foco sale a lo que decida el
  navegador (FR-14).
- **Colocación y tamaño**: se calcula solo al abrir (puede verse un fotograma con la anterior); scroll o redimensionado
  no la recalculan; el menú puede salirse por la derecha y no tiene alto máximo ni scroll si es largo.

## Fuera de alcance

- Opciones deshabilitadas, de peligro, seleccionadas, con atajo, con encabezado de grupo o con submenú, que muestra el
  diseño "Menu desplegable": irán en otra spec, para no cambiar ahora `MenuItem` ni la navegación de FR-12.
- Ancho mínimo de 210 px del diseño y quitar el hueco de 6 px reservado bajo el grupo: se mantienen como hoy en este
  ciclo; tampoco colocación a izquierda o derecha, recolocar con scroll, derecha a izquierda ni colores forzados.
- Búsqueda por la primera letra (type-ahead) y Alt+Flecha abajo del diseño.
- Split button deshabilitado o cargando, otros aspectos (`secondary` del diseño) y la orientación vertical.
- Los aspectos, nombres y anillos de los segmentos, que siguen las specs 002, 003 y 004.

## Criterios de finalización

- Tests unitarios (principio 4) de todo lo comprobable sin un navegador real: FR-1 al crear desde código y FR-2 a FR-16,
  incluidos modo icon, separadores, textos sustituidos, sin opciones y el destino del foco de FR-16. De FR-14 solo se
  comprueba que el menú se cierra, que `aria-expanded` vuelve a `false` y que la tecla no se cancela; su destino del
  foco va al navegador.
- Enter y Espacio sobre un botón nativo no generan un clic fuera de un navegador real: esa parte de FR-9 y FR-11 se
  verifica en un navegador o se simula.
- En un navegador, en los dos temas: colocación arriba y abajo de FR-8, aspecto y anillo de FR-10, y destino del foco de
  FR-11 a FR-16 (Tab y Mayús+Tab reales).
- NFR-1 a NFR-4 se cumplen en los split buttons de la demo, que muestra los modos `default` e `icon` en las dos
  variantes.
- Pasan todas las comprobaciones del proyecto.

## Preguntas abiertas

- Ninguna.
