# Constitución de Smooth UI

Siete principios innegociables. Un cambio que rompa uno es incorrecto, salvo que antes se modifique este archivo.

1. **Stack sencillo.** Angular, RxJS y tslib son las únicas dependencias de runtime. Comprobación: ningún `package.json`
   gana una entrada sin la aprobación del propietario.
2. **Primero la spec.** `specs/NNN-<nombre>/spec.md` es la fuente de verdad. Comprobación: un cambio de API pública o de
   comportamiento actualiza su spec en el mismo commit.
3. **Lógica separada de la interfaz.** Las plantillas enlazan y emiten; el estado se deriva en `computed()`; los efectos
   secundarios del navegador viven en servicios. Comprobación: ningún global de almacenamiento, red o DOM en los
   componentes.
4. **Tests con lo que está instalado.** Solo Vitest y TestBed. Comprobación: cada cambio de comportamiento incluye un
   spec junto al componente y `pnpm nx run smooth-ui:test` está en verde.
5. **Los datos del usuario se quedan con el usuario.** Sin red, telemetría ni registro de los valores de los campos;
   solo se persiste la preferencia de tema. Comprobación: `localStorage` solo aparece en `theme.service.ts`.
6. **Código en inglés, documentación en español.** El código, los comentarios, los commits y los textos por defecto van
   en inglés; los documentos `.md` (specs, planes, tareas, memoria y esta constitución) van en español. Comprobación:
   cada texto visible para el usuario es un input o se puede sustituir con uno.
7. **Diseño SOLID.** Cada componente, servicio o función tiene un único motivo para cambiar; el comportamiento se amplía
   con inputs, proyección de contenido o tipos nuevos, no editando ramas existentes; las dependencias llegan con
   `inject()` e `InjectionToken`, nunca como instancias fijas en el código. Comprobación: ninguna clase mezcla UI y
   lógica de dominio, ninguna cadena de `switch`/`if` crece para admitir una variante nueva, y cada servicio se puede
   sustituir en un spec mediante providers.

Las modificaciones necesitan la aprobación explícita del propietario y una nota en `MEMORY.md`.
