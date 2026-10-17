---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development en este proyecto (docs/constitution.md o cualquier
  archivo dentro de specs/) - redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una
  spec.
---

# Spec-Driven Development (SDD)

## Flujo

Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio.

- Nunca pases a la siguiente fase sin la aprobación explícita del usuario.
- La spec manda: si algo no está en la spec, no se implementa. Si falta una decisión, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, después en el plan y las tareas, y por último en el código.
- Cada spec vive en su propia carpeta: `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`.
- Si el componente ya existe en `libs/smooth-ui/src/lib/components/`, la spec recoge cómo se comporta hoy.
  Los huecos van en "Preguntas abiertas" como cambios sugeridos. Cuando la spec esté aprobada, pregunta al usuario qué
  preguntas abiertas resolver (cada una se convierte en un cambio de FR) y si quiere cubrir los FR sin tests; con esa
  respuesta el flujo sigue por Plan, Tareas, Implementación y Validación. Si el usuario no elige ninguna, el flujo para
  tras la Clarificación.
- Al terminar cada fase, actualiza `MEMORY.md`.

## Idioma

Los documentos `.md` (specs, planes, tareas, `MEMORY.md`, constitución) se escriben en español. El código, los
identificadores, los nombres de los tests y los mensajes de commit van en inglés. La línea `Status:` y sus valores
(`draft`, `approved`, `implemented`) y la marca `[NEEDS CLARIFICATION]` se mantienen tal cual, porque los agentes los
leen.

## Plantilla de la spec (spec.md)

```
# Spec NNN — <Nombre>
Status: draft | approved | implemented
## Contexto y objetivo
## Usuarios
## Historias de usuario
- US-1. Como <rol>, quiero <acción> para <beneficio>.
## Definiciones (solo si hay términos que se puedan interpretar de varias formas)
## Requisitos funcionales
## Requisitos no funcionales
## Casos límite
## Fuera de alcance
## Criterios de finalización
## Preguntas abiertas
- [NEEDS CLARIFICATION] <pregunta>
```

La spec describe el QUÉ y el PORQUÉ. Sin stack, arquitectura ni nombres de archivos.

Una spec tiene unas 100 líneas: como máximo 5 historias de usuario, 10 FR, 4 NFR, 5 casos límite, 5 puntos fuera de
alcance y 6 criterios de finalización, cada uno en una o dos líneas. Los casos límite y lo que queda fuera de alcance
cubren solo lo que toca el cambio o lo que un lector esperaría de él. El comportamiento que el cambio deja como está, y
cómo se va a verificar algo, quedan fuera de la spec. Si no cabe, propón dividir la spec.

## Requisitos en EARS

- FR-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- FR-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- FR-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- FR-x: EL SISTEMA <comportamiento permanente>.

Cada FR debe ser verificable: nada de "rápido", "intenso" o "bonito" sin un criterio medible.

## Plan (plan.md)

Archivos y responsabilidades · API pública (inputs, outputs, tipos exportados) · Estado y lo que se deriva de él ·
Dónde viven los efectos secundarios del navegador · Plantilla y accesibilidad · Decisiones justificadas con su
alternativa descartada · Estrategia de tests con Vitest y TestBed, y lo que queda para validar en un navegador. Indica
qué FR cubre cada parte.

## Tareas (tasks.md)

```
- [ ] **Tn. <Descripción>.** FR-x, FR-y
- Hecho cuando: <comprobación verificable>.
```

Como máximo 20-30 min por tarea, en orden de dependencia. Si hay más de 10, propón dividir la spec.

## Implementación

Una tarea cada vez: primero los tests (rojo), después el código, `pnpm nx run smooth-ui:test` en verde, marca la tarea
y para.
