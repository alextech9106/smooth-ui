---
description: SDD · Generate the technical plan for an approved spec
agent: plan
---

Read docs/constitution.md, AGENTS.md and specs/$0/spec.md. Use the sdd skill.
Do not write code.

Generate specs/$0/plan.md with: files that are created or modified and the responsibility of each one, the
public API (inputs, outputs, exported types), the state and what derives from it, where browser side effects live, the
template and its accessibility, justified technical decisions (with their discarded alternative) and the test strategy
with Vitest and TestBed, including what is left for validation in a browser.

Everything must respect the constitution and cover every FR. Mark which FR each part covers. If the spec is not approved
or has open questions, stop and let me know.
