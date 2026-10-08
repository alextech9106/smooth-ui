# AGENTS.md — Smooth UI

Angular 22 component library with a demo app. Published as `@alextech9106/smooth-ui`.

## Stack and structure

- Angular 22.1, Nx 23.2, pnpm 12.3.4, TypeScript 6.0, Vitest 4, ng-packagr
- `libs/smooth-ui/` — publishable library (entry: `src/public-api.ts`)
- `apps/smooth-ui-demo/` — app showcasing all components
- Theme: CSS custom properties in `libs/smooth-ui/theme/theme.scss`, toggled via `[data-theme]` on `<html>`

## Commands

```sh
pnpm install --frozen-lockfile

# CI order (full verification)
pnpm nx format:check
pnpm nx run-many -t lint test build typecheck

# Individual targets
pnpm nx run smooth-ui:build         # build library -> dist/smooth-ui
pnpm nx run smooth-ui:test          # unit tests (vitest)
pnpm nx run smooth-ui-demo:serve    # dev server

# Single test
pnpm nx run smooth-ui:test -- --testFile=sui-button.component.spec.ts

# Sync TypeScript project references (after adding cross-project deps)
pnpm nx sync
pnpm nx sync:check   # verify in CI that they are up to date

# Release (runs build first via preVersionCommand)
pnpm nx release --dry-run

# Local registry (Verdaccio) to test publishes
pnpm nx run @org/source:local-registry
```

## Conventions

- **Selector prefix**: `sui` in library, `app` in demo (enforced by ESLint)
- **Signal-based inputs** (`input()`, `output()`, `computed()`), not `@Input`/`@Output`
- **Styling**: SCSS; Prettier with `singleQuote: true`, `printWidth: 150`
- **Angular strict**: `strictTemplates`, `strictInjectionParameters`, `strictInputAccessModifiers`
- **Library tsconfig**: `moduleResolution: "bundler"`, `module: "preserve"`, `experimentalDecorators: true`

## Domain rules / known pitfalls

- The `@alextech9106/smooth-ui` alias resolves to **source** (`src/public-api.ts`), not `dist/`
- Theme uses `[data-theme="light"]` / `[data-theme="dark"]`, not a CSS class
- `packages/` is empty — do not create new libraries there
- Production build uses `tsconfig.lib.prod.json` with `compilationMode: "partial"` (not `tsconfig.lib.json`)
- `nx release` runs `pnpm dlx nx run-many -t build` as `preVersionCommand`

## Rules

- Read `docs/constitution.md` and the active spec (`specs/NNN-*/`) before touching code.

## How to work

- Plan before touching code if the change affects multiple components or the theme
- When done: explain what changed, why, and what verification was run

## Limits

- ✅ Always: run `lint`, `test`, `build`, and `format:check` before considering work done; update `MEMORY.md` after finishing each task
- ⚠ Ask before: new dependencies, new files, changes to data format or public API
- 🚫 Never: touch `packages/`, rename theme CSS variables, break the `sui` prefix, break the path alias

## Verification

```sh
pnpm nx format:check && pnpm nx run-many -t lint test build typecheck
```

If only one component changed: `pnpm nx run smooth-ui:test -- --testFile=<name>.spec.ts`

## Memory

- On start, read `MEMORY.md` to learn the project state and decisions made.
- After finishing a task, update it: current state, important decisions (with rationale), and pitfalls to avoid.
- Keep it brief (max ~50 lines): summarize or remove what no longer adds value.
- If something becomes a permanent rule, propose moving it to `AGENTS.md` instead of leaving it in memory.
- Never store sensitive data (keys, tokens, personal data).

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
