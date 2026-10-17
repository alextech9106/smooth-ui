---
description: SDD · Genera el plan técnico de una spec aprobada
agent: plan
---

Lee docs/constitution.md, AGENTS.md y specs/$0/spec.md. Usa la skill sdd.
No escribas código.

Genera specs/$0/plan.md con: los archivos que se crean o modifican y la responsabilidad de cada uno, la
API pública (inputs, outputs, tipos exportados), el estado y lo que se deriva de él, dónde viven los efectos secundarios
del navegador, la plantilla y su accesibilidad, las decisiones técnicas justificadas (con su alternativa descartada) y la
estrategia de tests con Vitest y TestBed, incluido lo que queda para validar en un navegador.

Todo debe respetar la constitución y cubrir cada FR. Marca qué FR cubre cada parte. Si la spec no está aprobada
o tiene preguntas abiertas, para y avísame.
