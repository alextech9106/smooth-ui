# Plan 001 — sui-icon

Spec: `specs/001-sui-icon/spec.md` (aprobada). La spec recoge el comportamiento de hoy y no propone ningún cambio, así
que este plan no cambia código de producción. El único trabajo son los tests que faltan y las comprobaciones que quedan
para la validación.

## Archivos y responsabilidades

Modificado:

- `libs/smooth-ui/src/lib/components/sui-icon/sui-icon.component.spec.ts` — recibe los tests de FR-2 a FR-10. Es el
  único archivo que cambia este plan.

Leídos, sin cambios:

- `sui-icon.component.ts` — declara los dos inputs y pide los dibujos al servicio al crearse. FR-1, FR-4, FR-9.
- `sui-icon.component.html` — el elemento del icono: tamaño, referencia al dibujo, oculto a la tecnología de apoyo.
  FR-2, FR-3, FR-5, FR-7, FR-8.
- `sui-icon.component.scss` — centra el área del dibujo. FR-5.
- `sui-icon.service.ts` — añade la copia de los dibujos a la página, una vez por aplicación y solo en un navegador.
  FR-9, FR-10.
- `constants/sui-icon.ts` — los 79 dibujos; cada uno toma su color del texto que lo rodea. FR-2, FR-6.

## API pública

Sin cambios. `public-api.ts` solo exporta `SuiIconComponent`; el servicio y los dibujos quedan internos.

- Selector `sui-icon`.
- Input `name: string`, obligatorio. FR-1, FR-2, FR-3.
- Input `size: number`, por defecto `20`. FR-4, FR-5.
- Sin outputs ni tipos exportados.

## Estado y lo que se deriva de él

- El componente no tiene estado propio: la plantilla lee `name()` y `size()` directamente, así que un cambio en
  cualquiera de los dos inputs llega a la página sin ningún valor derivado. FR-8.
- El servicio guarda un indicador, "dibujos ya añadidos". Hay una instancia del servicio por aplicación, y eso es lo que
  hace que la copia sea "una por aplicación". FR-9.

## Dónde viven los efectos secundarios del navegador

Solo en `SuiIconService.ensureSpriteInjected()` (constitución, principio 3). No hace nada fuera de un navegador (FR-10)
ni la segunda vez que se llama (FR-9); en otro caso, pone los dibujos al principio del body de la página. El componente
no toca ningún global del navegador.

## Plantilla y accesibilidad

- El área del dibujo es un `svg` cuyo `width` y `height` son el tamaño (FR-4, FR-5), dentro de un envoltorio que lo
  centra (FR-5).
- El `svg` apunta al dibujo con una referencia construida a partir del nombre (FR-2). Un nombre sin dibujo deja el área
  vacía, y un nombre que es el identificador de otro elemento de la página apunta a ese elemento (FR-3).
- `aria-hidden="true"` y `focusable="false"` en el `svg`, y ningún `tabindex` en ninguna parte (FR-7).

## Decisiones

- **D1. Sin cambios en el código de producción.** Descartado: arreglar lo que encontró la revisión (nombres de texto
  libre, choques de identificadores). La spec lo deja todo fuera de alcance.
- **D2. Todos los tests nuevos van en el archivo de spec existente del componente.** Descartado: un archivo de spec
  aparte para el servicio. FR-9 y FR-10 se pueden observar a través del componente, y `AGENTS.md` pide preguntar antes
  de añadir archivos.
- **D3. Los tests miran la página, no el servicio.** La copia de los dibujos se cuenta en `document.body`. Descartado:
  leer el indicador privado del servicio, que prueba la implementación en lugar del comportamiento.
- **D4. Cada test empieza desde una página sin copia de los dibujos.** Un `TestBed` es una aplicación, y todos los tests
  del archivo comparten una página, así que antes de cada test se quitan las copias que dejaron los anteriores.
  Descartado: contar la diferencia antes y después, que es más difícil de leer.
- **D5. "Fuera de un navegador" se simula dando `PLATFORM_ID` como `'server'`.** Descartado: un renderizado real en
  servidor, que necesita herramientas que no están instaladas (constitución, principios 1 y 4).
- **D6. "No escribe nada en la consola" se comprueba con espías en `console.error`, `console.warn` y `console.log`.**
  Descartado: dejar sin verificar el silencio de FR-3.
- **D7. Los 79 nombres no se copian en un test.** Se comparan con la spec durante la validación. Descartado: un test con
  una tercera copia de la lista.

## Estrategia de tests (Vitest y TestBed)

Se ejecutan con `pnpm nx run smooth-ui:test`. Cada test da los inputs con `fixture.componentRef.setInput()` y espera con
`await fixture.whenStable()`.

- **FR-2**: con el nombre `check`, el `svg` apunta a `#check`, y la página tiene un dibujo con ese identificador.
- **FR-3**: con un nombre fuera del conjunto, crear el icono no lanza errores, no se llama a ninguno de los tres espías
  de consola, el `svg` mantiene el tamaño pedido y la página no tiene ningún elemento con ese identificador. Se repite
  con `""`, `Check` y `" check"` (caso límite).
- **FR-4**: sin tamaño, `width` y `height` valen `20`.
- **FR-5**: con tamaño `32`, `width` y `height` valen `32`.
- **FR-6**: el dibujo al que apunta `check` toma su color del texto que lo rodea (`currentColor`).
- **FR-7**: `aria-hidden` y `focusable` (ya probados), y además ningún `tabindex` en el icono ni dentro de él.
- **FR-8**: cambiar el nombre cambia la referencia; cambiar el tamaño cambia `width` y `height`.
- **FR-9**: un icono añade exactamente una copia; un segundo icono en la misma aplicación no añade ninguna; destruir un
  icono no quita ninguna. Una segunda aplicación añade una segunda copia (caso límite "Copias de los dibujos").
- **FR-10**: con `PLATFORM_ID` en `'server'`, crear el icono no lanza errores y la página no tiene ninguna copia.

## Lo que queda para la validación

Se comprueba una vez, en `/sdd-validate`, con el MCP de Chrome DevTools sobre la aplicación demo o haciendo la build:

- **FR-1**: un `sui-icon` sin nombre en una plantilla de la demo hace fallar `pnpm nx run smooth-ui-demo:build`. La
  línea se quita después.
- **FR-2, FR-5, FR-6**: se ve un icono; su caja medida es de N por N px y está centrada; su color es igual al del texto
  que tiene al lado, en los temas claro y oscuro.
- **NFR-1**: ningún `package.json` ha cambiado.
- **NFR-2**: la auditoría de accesibilidad de la demo no informa de ninguna infracción en un icono.
- **NFR-3 y el conjunto incluido**: los nombres de la spec son exactamente los identificadores de los dibujos, y la
  galería de la demo muestra los 79.

## Riesgos

- FR-1, FR-10 y "un tamaño dado como texto no compila" salen de leer el código y no se han ejecutado. Si alguno resulta
  falso, la spec se corrige antes de cerrar la validación.
- D4 supone que el entorno de tests mantiene una sola página para todo el archivo. Si no es así, la limpieza no hace daño.
