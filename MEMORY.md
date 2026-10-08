# MEMORY.md — Smooth UI

Project memory across sessions. Max ~50 lines: summarize or remove what no longer adds value.

## Current state

- Angular 22 component library with demo app in Nx monorepo (pnpm workspaces).
- Published components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle,
  error.
- Theme via CSS custom properties (light/dark via `[data-theme]`).
- Build with ng-packagr, tests with Vitest, lint with ESLint + angular-eslint.
- CI: `format:check` → `lint` → `test` → `build` → `typecheck`.
- ESLint enforces class member order (private → public → protected; fields, constructor, methods) and a `_` prefix on
  private members.
- Agent skills live in `.claude/skills/`: `format-code`, `web-design-guidelines`, `frontend-design`.
- Project MCP servers are declared in `.mcp.json`: `angular` (`pnpm exec ng mcp`) and `nx` (`pnpm exec nx mcp`).

## Decisions (and why)

- No backend or external dependencies: demo app runs with `pnpm nx run smooth-ui-demo:serve`.
- Path alias `@alextech9106/smooth-ui` resolves to source (`src/public-api.ts`), not `dist/`: enables development
  without prior build.
- Signal-based inputs (`input()`, `output()`), not `@Input`/`@Output`: modern Angular 22 pattern.
- `packages/` is empty: the library lives in `libs/smooth-ui/`, not in `packages/`.
- Accessibility pass (2026-10-06): buttons bind native `disabled` and take a `label` input for `aria-label`; fields link
  to hint/errors with
  `aria-describedby` and one `aria-live` container; ARIA is bound as `[aria-*]`, not `[attr.aria-*]`.
- `sui-button-split` emits `trigger` and `itemSelected`; `MenuItem` stays plain data with a required `id` (no
  callbacks).
- Reduced motion zeroes the `--sui-duration-*` tokens instead of a global `*` rule, so consumer apps keep their own
  animations.
- `docs/constitution.md` (2026-10-07) holds the six non-negotiable principles. Principle 2 was amended the same day
  (owner-approved) to name `specs/NNN-<name>/spec.md` as source of truth, the layout the sdd skill and the `/sdd-*`
  commands expect.
- `specs/001-sui-icon/spec.md` (implemented 2026-10-08) records how `sui-icon` behaves today and proposes no change.
  `plan.md` (same day) changes no production code and only adds tests; all 7 tasks in `tasks.md` are done (24 icon
  tests, 69 in the library; format, lint, test, build and typecheck green); `/sdd-validate` (2026-10-08) found it
  fulfilled. Not run: FR-3's exception (a name that is another element's identifier) and a real server render. Seen on
  the way: at 375 px the demo scrolls sideways because of `sui-text-field`. A 241-line earlier draft was deleted for
  being too long, and the sdd skill now sets a spec at about 100 lines. Restricting icon names to the built-in set would
  be a later spec.
- `transition: all` in text-field, textarea and icon-button is kept on purpose (owner's decision).

## Learnings and pitfalls to avoid

- Production build uses `tsconfig.lib.prod.json` with `compilationMode: "partial"` — do not use `tsconfig.lib.json`
  directly.
- Theme toggles via `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`, not a CSS class.
- `nx release` runs `pnpm dlx nx run-many -t build` automatically as `preVersionCommand`.
- `format:check --all` passes since 2026-10-06. `pnpm-lock.yaml` and the vendored skills (`.agents`,
  `.claude/skills/web-design-guidelines`) are
  in `.prettierignore`: never format them, the skills are hash-locked in `skills-lock.json`.
- In `sui-text-field`, `rawValue` reads `this.value` at initialization and must stay declared below it.
- `origin` uses SSH (`git@github.com:alextech9106/smooth-ui.git`); HTTPS has no stored credentials.

## Next steps

- Unreleased breaking changes since 0.5.0: `MenuItem.id` required, `sui-error` lost `inputId`, `getCustomMessage` takes
  the error object.
- Open accessibility items: `name`/`autocomplete` on fields, badge text, `role="group"` on button-group, demo headings
  and icon-button labels.
- Suspected defect, untested: the way the icon drawings are added to the page may be blocked by a strict content
  security policy and break the app on its first icon. Needs its own check or spec.
- Keep expanding test coverage (behaviour tests exist for buttons, split, link, icon and form fields).
- Add more components or variants as project needs evolve.
