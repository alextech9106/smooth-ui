---
description: SDD · Valida la spec FR por FR (tests + Chrome DevTools)
agent: accept edits
---

Recorre specs/$0/spec.md requisito a requisito. Para cada FR indica qué test lo cubre y el resultado de ejecutarlo
con pnpm nx run smooth-ui:test.

Los FR que los tests no pueden verificar (lo que se ve en un navegador, o lo que solo muestra una build) verifícalos con
el MCP de Chrome DevTools en la aplicación demo (incluida la vista móvil de 375 px) o haciendo la build.

Si algún FR no está cubierto o falla, dilo con claridad. NO arregles nada todavía. Después revisa los criterios de
finalización y dame un veredicto: ¿se cumple la spec?
