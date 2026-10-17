---
name: format-code
description: Formatea el código fuente de este workspace con Prettier a través de Nx. Úsala cuando el usuario pida formatear, embellecer o arreglar el estilo de archivos, o antes de redactar un commit.
---

# Formatear código

Prettier 3 es el único formateador. Su configuración está en `.prettierrc` (`singleQuote: true`, `printWidth: 150`) y
`.prettierignore`; nunca repitas ni sobrescribas esas opciones en línea, y nunca formatees a mano código que gestiona
Prettier.

## Pasos

1. Elige el alcance: los archivos que nombre el usuario o, si no, los cambios sin commitear.
2. Comprueba primero (solo lectura): `pnpm nx format:check --files=<a,b>` o `pnpm nx format:check --uncommitted`.
3. Enumera los archivos que cambiarían y pide aprobación.
4. Una vez aprobado, escribe: `pnpm nx format:write --files=<a,b>` o `pnpm nx format:write --uncommitted`.
5. Informa de los archivos que se reformatearon, nada más.

## Orden de los miembros de una clase

Prettier no reordena miembros, así que aplica este orden a mano al escribir o formatear una clase. ESLint lo exige con
`@typescript-eslint/member-ordering` en `eslint.config.mjs`:

1. Declaraciones privadas
2. Declaraciones públicas
3. Declaraciones protegidas
4. Constructor, si lo hay
5. Métodos y funciones privados
6. Métodos y funciones públicos
7. Métodos y funciones protegidos

## Nombres de los miembros privados

Todo miembro `private` (campos, métodos y funciones, estáticos o no) debe empezar por `_`, por ejemplo
`private readonly _injector` y `private _resolvePlacement()`. Los miembros públicos y protegidos nunca llevan el prefijo.
Si a un miembro privado le falta, renómbralo y actualiza todas las referencias de la clase.

## Reglas

- Nunca formatees todo el workspace (`--all`) salvo que el usuario lo pida.
- Solo formato: aparte del orden de miembros y del prefijo `_` de los privados, nada de correcciones de lint,
  reordenación de imports, renombrados ni refactors en la misma pasada.
- No toques `dist/`, `node_modules/`, `pnpm-lock.yaml` ni nada de `.prettierignore`.
- Si un archivo no se puede parsear, para y enseña el error en lugar de editar alrededor.
- Cambiar `.prettierrc` o `.prettierignore` es un cambio de configuración: propón el diff y espera.
