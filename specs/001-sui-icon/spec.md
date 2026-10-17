# Spec 001 — sui-icon

Status: implemented

## Contexto y objetivo

Las aplicaciones hechas con la librería necesitan imágenes pequeñas (iconos) dentro de botones, campos, enlaces y texto.
Dibujarlas o importarlas una a una en cada aplicación es repetitivo y hace que se vean distintas entre sí.

`sui-icon` muestra un icono de un conjunto que viene con la librería, elegido por su nombre, al tamaño que pide el
desarrollador y en el color del texto que lo rodea. Esta spec recoge cómo se comporta `sui-icon` hoy. Se modificó el
2026-10-16 para que un nombre fuera del conjunto incluido se rechace en tiempo de compilación (FR-3, FR-11, FR-12).

## Usuarios

- **Desarrolladores consumidores**: crean aplicaciones con la librería y eligen los iconos por su nombre.
- **Usuarios finales** de esas aplicaciones, incluidas las personas que usan tecnología de apoyo.
- **Mantenedores de la librería**: añaden iconos al conjunto y crean componentes que muestran iconos.

## Historias de usuario

- US-1. Como desarrollador consumidor, quiero mostrar un icono por su nombre para no tener que dibujar ni importar
  iconos yo mismo.
- US-2. Como desarrollador consumidor, quiero elegir el tamaño de un icono para que encaje con el texto o el control que
  tiene al lado.
- US-3. Como desarrollador consumidor, quiero que un icono tome el color del texto que lo rodea para que siga el tema sin
  trabajo extra.
- US-4. Como usuario final de tecnología de apoyo, quiero que los iconos se omitan para oír solo el texto o el nombre
  accesible del control al que pertenecen.
- US-5. Como mantenedor de la librería, quiero que los dibujos de todos los iconos se carguen una vez por aplicación
  para que mostrar muchos iconos no cueste más que mostrar uno.

## Definiciones

- **Conjunto incluido**: los 79 iconos cuyo dibujo viene con la librería. Sus nombres son:
  `check`, `x`, `chevron-down`, `chevron-up`, `chevron-right`, `chevron-left`, `arrow-right`, `arrow-left`, `arrow-up`,
  `arrow-down`, `plus`, `minus`, `plus-circle`, `minus-circle`, `search`, `info`, `alert-triangle`, `alert-circle`,
  `check-circle`, `x-circle`, `star`, `heart`, `thumbs-up`, `thumbs-down`, `user`, `settings`, `bell`, `calendar`,
  `mail`, `message-circle`, `phone`, `lock`, `shield`, `key`, `eye`, `eye-off`, `trash`, `edit`, `save`, `download`,
  `upload`, `undo`, `redo`, `refresh`, `loader`, `more-horizontal`, `more-vertical`, `filter`, `external-link`, `link`,
  `share`, `copy`, `sun`, `moon`, `menu`, `list`, `home`, `image`, `camera`, `play`, `pause`, `file`, `folder`,
  `bookmark`, `tag`, `credit-card`, `shopping-cart`, `gift`, `map-pin`, `globe`, `grid`, `circle`, `square`, `maximize`,
  `minimize`, `clock`, `help`, `log-out`, `log-in`.
- **Tiempo de compilación**: el momento en que se comprueba y compila la aplicación del consumidor, antes de ejecutarse.
- **Aplicación**: una instancia en ejecución del programa de un consumidor que usa la librería. Una página puede
  albergar varias.
- **Icono decorativo**: un icono que no aporta información más allá del texto o del nombre accesible de lo que lo rodea.

## Requisitos funcionales

- FR-1: SI un desarrollador usa `sui-icon` sin darle un nombre, ENTONCES EL SISTEMA informa de un error en tiempo de
  compilación.
- FR-2: CUANDO `sui-icon` recibe el nombre de un icono del conjunto incluido, EL SISTEMA muestra ese icono.
- FR-3: SI un desarrollador da a `sui-icon` un nombre que no está en el conjunto incluido ni está vacío, ENTONCES EL
  SISTEMA informa de un error en tiempo de compilación.
- FR-4: CUANDO no se da un tamaño, EL SISTEMA usa un tamaño de 20.
- FR-5: CUANDO se da un tamaño N, siendo N un número mayor que cero, EL SISTEMA dibuja el icono dentro de un área
  cuadrada de N px de ancho y N px de alto, manteniendo las proporciones del icono, y centra esa área en el ancho que el
  elemento que lo contiene da al icono.
- FR-6: EL SISTEMA dibuja el icono en el color que tendría un texto colocado en ese mismo punto de la página, y CUANDO
  ese color cambia, el icono cambia con él.
- FR-7: EL SISTEMA trata cada icono como decorativo: lo oculta a la tecnología de apoyo y lo deja fuera del orden de
  foco del teclado.
- FR-8: CUANDO cambian el nombre o el tamaño de un icono mostrado, EL SISTEMA actualiza el icono para que coincida.
- FR-9: MIENTRAS una página se ejecuta en un navegador, EL SISTEMA le añade exactamente una copia de los dibujos del
  conjunto incluido por cada aplicación que muestra un icono, muestre los iconos que muestre esa aplicación, y nunca la
  quita.
- FR-10: MIENTRAS una página se renderiza fuera de un navegador, EL SISTEMA no añade ninguna copia de los dibujos ni
  lanza ningún error.
- FR-11: CUANDO `sui-icon` recibe un nombre vacío, EL SISTEMA no lanza ningún error, no escribe nada en la consola del
  navegador y muestra un espacio vacío del tamaño pedido.
- FR-12: EL SISTEMA ofrece la lista de nombres válidos como un tipo que los consumidores pueden importar, y todo input o
  estructura de datos de la librería que recibe un nombre de icono acepta solo esos nombres.

## Requisitos no funcionales

- NFR-1: Mostrar iconos no añade ninguna dependencia a ningún paquete del proyecto (constitución, principio 1).
- NFR-2: Una auditoría de accesibilidad de una página que muestra iconos, ejecutada en un navegador, no informa de
  ninguna infracción en un icono.
- NFR-3: Los nombres de los iconos están en inglés (constitución, principio 6).

## Casos límite

- **Nombre con distintas mayúsculas o espacios alrededor** (`Check`, `" check"`): no está en el conjunto incluido, así
  que se rechaza en tiempo de compilación (FR-3). Un nombre vacío se acepta (FR-11).
- **Nombre que solo se conoce mientras la aplicación se ejecuta** (por ejemplo, leído de un servidor): las comprobaciones
  de compilación no lo ven; el consumidor debe convertirlo en un nombre válido antes de dárselo a `sui-icon`.
- **Tamaño que no es un número mayor que cero**: un texto en lugar de un número se rechaza en tiempo de compilación;
  cero o menos se acepta, el icono no se ve o se dibuja mal, y no se informa de nada.
- **Copias de los dibujos**: varias aplicaciones en una página, o una que se destruye y se vuelve a crear, añaden cada
  una su propia copia (FR-9), así que las copias se acumulan y los iconos se siguen mostrando. Si otro código quita las
  copias de la página, no se vuelven a añadir y los iconos dejan de mostrarse.
- **Identificador compartido entre la página y los dibujos**: los dibujos se identifican en la página por sus nombres
  sin más (`menu`, `search`, `user`…). Un elemento de la página con uno de esos identificadores hace que dos elementos lo
  compartan, y un nombre fuera del conjunto que sea el identificador de un elemento de la página hace que el icono
  apunte a ese elemento.
- **Icono que tiene significado por sí mismo** (por ejemplo, un icono de estado sin texto al lado): nunca se anuncia, por
  FR-7. El consumidor debe dar ese significado como texto o como nombre accesible del elemento que contiene el icono.

## Fuera de alcance

- Informar de un nombre desconocido o sustituirlo mientras la aplicación se ejecuta.
- Dar a un icono un nombre accesible propio.
- Dejar que los consumidores añadan sus propios iconos, y listar los nombres disponibles mientras la aplicación se
  ejecuta.
- Cómo eligen y colocan sus iconos otros componentes de la librería (botones, campos, enlaces).
- Páginas de derecha a izquierda, modos de colores forzados, partes de una página aisladas del resto y políticas de
  seguridad de contenido estrictas.

## Criterios de finalización

- Cada FR de FR-2 a FR-11, salvo FR-3, está cubierto por al menos un test automático de lo que declara el icono (el
  dibujo al que apunta, el tamaño que pide, que está oculto a la tecnología de apoyo, la copia de los dibujos), y todos
  pasan.
- Lo que solo puede mostrar un navegador real, una build o una lectura se comprueba una vez, durante la validación: que
  el icono se ve con el tamaño, la posición y el color correctos (FR-2, FR-5, FR-6), que un `sui-icon` sin nombre o con
  un nombre fuera del conjunto incluido no compila (FR-1, FR-3), que los consumidores pueden importar el tipo de nombres
  válidos (FR-12), la auditoría de NFR-2, que los nombres listados en "Conjunto incluido" son exactamente los iconos que
  existen en la librería, y que la aplicación demo los muestra todos.
- Pasan todas las comprobaciones automáticas que el proyecto ejecuta en cada cambio.

## Preguntas abiertas

Ninguna.
