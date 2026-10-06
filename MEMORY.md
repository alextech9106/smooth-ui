# MEMORY.md — Smooth UI

Project memory across sessions. Max ~50 lines: summarize or remove what no longer adds value.

## Current state

- Angular 22 component library with demo app in Nx monorepo (pnpm workspaces).
- Published components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
- Theme via CSS custom properties (light/dark via `[data-theme]`).
- Build with ng-packagr, tests with Vitest, lint with ESLint + angular-eslint.
- CI: `format:check` → `lint` → `test` → `build` → `typecheck`.
- ESLint enforces class member order (private → public → protected; fields, constructor, methods) and a `_` prefix on private members.
- Agent skills live in `.claude/skills/`: `format-code`, `web-design-guidelines`, `frontend-design`.

## Decisions (and why)

- No backend or external dependencies: demo app runs with `pnpm nx run smooth-ui-demo:serve`.
- Path alias `@alextech9106/smooth-ui` resolves to source (`src/public-api.ts`), not `dist/`: enables development without prior build.
- Signal-based inputs (`input()`, `output()`), not `@Input`/`@Output`: modern Angular 22 pattern.
- `packages/` is empty: the library lives in `libs/smooth-ui/`, not in `packages/`.
- Accessibility pass (2026-10-06): buttons bind native `disabled` and take a `label` input for `aria-label`; fields link to hint/errors with
  `aria-describedby` and one `aria-live` container; ARIA is bound as `[aria-*]`, not `[attr.aria-*]`.
- `sui-button-split` emits `trigger` and `itemSelected`; `MenuItem` stays plain data with a required `id` (no callbacks).
- Reduced motion zeroes the `--sui-duration-*` tokens instead of a global `*` rule, so consumer apps keep their own animations.
- `transition: all` in text-field, textarea and icon-button is kept on purpose (owner's decision).

## Learnings and pitfalls to avoid

- Production build uses `tsconfig.lib.prod.json` with `compilationMode: "partial"` — do not use `tsconfig.lib.json` directly.
- Theme toggles via `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`, not a CSS class.
- `nx release` runs `pnpm dlx nx run-many -t build` automatically as `preVersionCommand`.
- `format:check --all` passes since 2026-10-06. `pnpm-lock.yaml` and the vendored skills (`.agents`, `.claude/skills/web-design-guidelines`) are
  in `.prettierignore`: never format them, the skills are hash-locked in `skills-lock.json`.
- In `sui-text-field`, `rawValue` reads `this.value` at initialization and must stay declared below it.
- `origin` uses SSH (`git@github.com:alextech9106/smooth-ui.git`); HTTPS has no stored credentials.

## Next steps

- Unreleased breaking changes since 0.5.0: `MenuItem.id` required, `sui-error` lost `inputId`, `getCustomMessage` takes the error object.
- Open accessibility items: `name`/`autocomplete` on fields, badge text, `role="group"` on button-group, demo headings and icon-button labels.
- Keep expanding test coverage (behaviour tests exist for buttons, split, link, icon and form fields).
- Add more components or variants as project needs evolve.
