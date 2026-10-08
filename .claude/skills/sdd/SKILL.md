---
name: sdd
description: Use it whenever you work with Spec-Driven Development in this project (docs/constitution.md or any file
  inside specs/) - drafting, reviewing or changing specs, plans and tasks, or implementing and validating tasks from a
  spec.
---

# Spec-Driven Development (SDD)

## Flow

Constitution → Spec → Clarification → Plan → Tasks → Implementation → Validation → Change.

- Never move on to the next phase without the user's explicit approval.
- The spec rules: if something is not in the spec, it does not get implemented. If a decision is missing, stop and ask.
- A requirements change is made first in the spec, then in the plan and the tasks, and last in the code.
- Each spec lives in its own folder: `specs/NNN-name/` with `spec.md`, `plan.md` and `tasks.md`.
- When each phase is finished, update `MEMORY.md`.

## Spec template (spec.md)

```
# Spec NNN — <Name>
Status: draft | approved | implemented
## Context and goal
## Users
## User stories
- US-1. As a <role>, I want <action> so that <benefit>.
## Definitions (only if there are terms that could be interpreted in several ways)
## Functional requirements
## Non-functional requirements
## Edge cases
## Out of scope
## Completion criteria
## Open questions
- [NEEDS CLARIFICATION] <question>
```

The spec describes the WHAT and the WHY. No stack, architecture or file names.

A spec is about 100 lines: 5 user stories, 10 FRs, 4 NFRs, 5 edge cases, 5 out-of-scope items and 6 completion criteria
at most, each in one or two lines. Edge cases and out-of-scope items cover only what the change touches or what a reader
would expect from it. Behaviour the change leaves as it is, and how something will be verified, stay out of the spec. If
it does not fit, propose splitting the spec.

## Requirements in EARS (in English)

- FR-x: WHEN <event>, THE SYSTEM <response>.
- FR-x: IF <unwanted condition>, THEN THE SYSTEM <response>.
- FR-x: WHILE <state>, THE SYSTEM <response>.
- FR-x: THE SYSTEM <permanent behavior>.

Every FR must be verifiable: no "fast", "intense" or "pretty" without a measurable criterion.

## Plan (plan.md)

Files and responsibilities · Public API (inputs, outputs, exported types) · State and what derives from it · Where
browser side effects live · Template and accessibility · Decisions justified with their discarded alternative · Test
strategy with Vitest and TestBed, and what is left for validation in a browser. State which FR each part covers.

## Tasks (tasks.md)

```
- [ ] **Tn. <Description>.** FR-x, FR-y
- Done when: <verifiable check>.
```

At most 20-30 min per task, in dependency order. If there are more than 10, propose splitting the spec.

## Implementation

One task at a time: tests first (red), then the code, `pnpm nx run smooth-ui:test` green, mark the task and stop.
