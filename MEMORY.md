# MEMORY.md — Smooth UI (max ~50 lines; stack, alias, theme, prod tsconfig and release are in AGENTS.md)

## Current state

- Components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
  ESLint: member order private → public → protected, `_` on private. Skills/agents in `.claude/`, MCP in `.mcp.json`.
- 001 (sui-icon) validated, amended 2026-10-16. 002 (sui-button) implemented 2026-10-16 (@reviewer APPROVED, axe 0).
- 003 validated 2026-10-17 (@reviewer APPROVED, 148/148). Dark re-checked: ring rgb(166,178,252), Enter/Space 1 trigger
  each, 375 px = 444, reduce → 0s. Owner's press check OK 2026-10-17; spec 003 implemented. T1-T10, V1-V8, axe 0 pass.
- User's own changes, kept out of tasks: demo `(trigger)` on reactive submit, split `name` required, spinner no `color`.
- Pending: `sui-button` scss 4.35 kB (> 4 kB); NG0505 on dev load; 375 px overflow (444 px); 002 final checks; dev 4200.

## Decisions (and why)

- Buttons bind native `disabled` and take `label` for `aria-label`; fields use `aria-describedby` and one `aria-live`
  container; ARIA bound as `[aria-*]`, not `[attr.aria-*]`. `trigger` is the only supported button activation.
- `sui-button-split` emits `trigger` and `itemSelected`; `MenuItem` is plain data with a required `id` (no callbacks).
- Reduced motion zeroes the `--sui-duration-*` tokens, not a global `*` rule, so consumer apps keep their animations.
- 002 FR-5: `label().trim() ? label() : name()`; blank `label` + `name` `""` gives `aria-label=""` (keep out of demo).
- 002 contrast (owner): light `primary`/`danger` one step darker (accent 600/700/800, danger 600/700) via shared
  semantic tokens; side effect accepted on other components. Danger press reuses solid. Canvas painted on `html`/`body`.
- Accepted as-is: script-dispatched click emits `trigger` while disabled/loading; `transition: all` (fields, icon btn).
- 003: name = non-blank `label` untrimmed, else `null`, never the icon; `iconSize` gone; 36-button demo matrix from
  module-level `buildIconButtonMatrix()` (declare the fields it reads above it). D2 (user, replaced accent 500):
  `--sui-focus-ring` opaque accent 300 in both themes; light below 3:1 accepted (conflicts with CLAUDE.md §12).

## Learnings and pitfalls to avoid

- Check implementer reports against the file. Planner can't run Prettier; reviewer only `smooth-ui:test`: owner or
  implementer re-run format:check + run-many. Stable id for deferred content on a container around `@defer`.
- jsdom: no click from Enter/Space, keeps focus on a button that becomes disabled (Chrome blurs to `body`); NG0950
  throws on `detectChanges()`. `smooth-ui-demo:typecheck` (plain `tsc`) skips templates: NG8008 shows only in build.
- DevTools MCP: no clicks on disabled elements, no held `:active`; `hover` applies `:hover`. axe 4.10.2 from cdnjs,
  never a package; it misses ring contrast. Read `box-shadow` ~500 ms after focus. Restore the persisted theme.
- V results (error codes, measurements) are stored in tasks.md next to their V item, not only in MEMORY.
- 003 measured: ring 9.14:1 dark, 1.92:1 light canvas (2.02:1 white); badge 6.42/5.25, selected icon 6.15/4.64.
- Prettier collapses double spaces in Markdown and joins a wrapped line starting `27)` (list marker): use backticks;
  never format `pnpm-lock.yaml` or vendored skills. Format one file: `pnpm nx format:write --files=<path>`.
- Buttons are border-box by default. In `sui-text-field`, `rawValue` stays declared below `value`. Constitution 7
  (SOLID) added 2026-10-15. sdd: an existing component's spec records current behaviour.
- `[aria-label]` bound to `null` removes the attribute. A removed input: bound `[x]` fails to compile (NG8002), static
  `x` is ignored, `setInput('x')` throws NG0303, a typed literal gives TS2353. Group's `label ?? name` misses `""`.

## Release note (since 0.5.0) and open items

- Breaking: light `primary`/`danger` darker; `MenuItem.id`, split `name` required; `sui-error` lost `inputId`;
  `getCustomMessage` takes the error; `SUI_ICON_NAME`; neither button uses the icon name as accessible name (pass a
  non-blank `label`); `iconSize` removed from both buttons and their types (`SuiIconButton`, unused); `--sui-focus-ring`
  is opaque accent 300 in both themes, changing every focus ring (button, split, link, fields, icon button), unlike
  spec 002; danger ring unchanged. Known issues: light ring 1.92:1 on the canvas, below WCAG 2.2 SC 1.4.11 (AA, 3:1);
  dark ring merges 1:1 with `primary` hover; selected `primary` Space press 1.85:1 light, 1.34:1 dark.
- Open: field `name`/`autocomplete`, badge text, group `role="group"`, demo headings; strict CSP vs sprite (untested).
