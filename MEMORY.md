# MEMORY.md — Smooth UI

Project memory across sessions. Max ~50 lines: summarize or remove what no longer adds value.

## Current state

- Angular 22 component library with demo app in Nx monorepo (pnpm workspaces).
- Published components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
- Theme via CSS custom properties (light/dark via `[data-theme]`).
- Build with ng-packagr, tests with Vitest, lint with ESLint + angular-eslint.
- CI: `format:check` → `lint` → `test` → `build` → `typecheck`.

## Decisions (and why)

- No backend or external dependencies: demo app runs with `pnpm nx run smooth-ui-demo:serve`.
- Path alias `@alextech9106/smooth-ui` resolves to source (`src/public-api.ts`), not `dist/`: enables development without prior build.
- Signal-based inputs (`input()`, `output()`), not `@Input`/`@Output`: modern Angular 22 pattern.
- `packages/` is empty: the library lives in `libs/smooth-ui/`, not in `packages/`.

## Learnings and pitfalls to avoid

- Production build uses `tsconfig.lib.prod.json` with `compilationMode: "partial"` — do not use `tsconfig.lib.json` directly.
- Theme toggles via `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`, not a CSS class.
- `nx release` runs `pnpm dlx nx run-many -t build` automatically as `preVersionCommand`.

## Next steps

- Expand test coverage (only one basic test per component currently).
- Add more components or variants as project needs evolve.
