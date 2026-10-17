# Tareas 001 — sui-icon

Spec: `specs/001-sui-icon/spec.md`. Plan: `specs/001-sui-icon/plan.md`. Todas las tareas editan solo
`libs/smooth-ui/src/lib/components/sui-icon/sui-icon.component.spec.ts`; no cambia código de producción.

- [x] **T1. Empezar cada test desde una página sin copia de los dibujos, y probar la copia en un navegador.** FR-9
- Hecho cuando: las copias que quedan en la página se quitan antes de cada test; los tests muestran que un icono añade
  exactamente una copia, que un segundo icono en la misma aplicación no añade ninguna, que destruir un icono no quita
  ninguna y que una segunda aplicación añade una segunda copia; `pnpm nx run smooth-ui:test` está en verde, incluidos
  los dos tests que ya existían.

- [x] **T2. Probar la página renderizada fuera de un navegador.** FR-10
- Hecho cuando: un test que da `PLATFORM_ID` como `'server'` muestra que crear el icono no lanza errores y que la página
  no tiene ninguna copia de los dibujos; `pnpm nx run smooth-ui:test` está en verde.

- [x] **T3. Probar que un nombre del conjunto incluido apunta a su dibujo.** FR-2, FR-6
- Hecho cuando: los tests muestran que con el nombre `check` el icono apunta a `#check`, que la página tiene un dibujo
  con ese identificador y que ese dibujo toma su color del texto que lo rodea; `pnpm nx run smooth-ui:test` está en
  verde.

- [x] **T4. Probar un nombre que no está en el conjunto incluido.** FR-3
- Hecho cuando: los tests muestran, para un nombre desconocido y para `""`, `Check` y `" check"`, que crear el icono no
  lanza errores, que no se llama a `console.error`, `console.warn` ni `console.log`, que el icono mantiene el tamaño
  pedido y que la página no tiene ningún elemento con ese identificador; `pnpm nx run smooth-ui:test` está en verde.

- [x] **T5. Probar el tamaño y los cambios de nombre y tamaño.** FR-4, FR-5, FR-8
- Hecho cuando: los tests muestran que sin tamaño el ancho y el alto valen `20`, que con tamaño `32` valen `32`, que
  cambiar el nombre cambia el dibujo al que apunta el icono y que cambiar el tamaño cambia el ancho y el alto;
  `pnpm nx run smooth-ui:test` está en verde.

- [x] **T6. Completar el test de que los iconos están ocultos y fuera del orden de foco.** FR-7
- Hecho cuando: además de las comprobaciones que ya existen, un test muestra que no hay ningún `tabindex` en el icono ni
  dentro de él; `pnpm nx run smooth-ui:test` está en verde.

- [x] **T7. Ejecutar todas las comprobaciones.** FR-2 a FR-10
- Hecho cuando: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` está en verde, cada FR de FR-2 a
  FR-10 tiene al menos un test en el archivo y `MEMORY.md` recoge el resultado.

No son tareas: FR-1, el aspecto real del icono (FR-2, FR-5, FR-6), los tres NFR y la lista de 79 nombres se comprueban en
`/sdd-validate`, como dice el plan en "Lo que queda para la validación".
