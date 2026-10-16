# MEMORY.md — Smooth UI

Project memory across sessions, max ~50 lines (stack, alias, theme, prod tsconfig and release are in AGENTS.md).

## Current state

- Published components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle,
  error. ESLint enforces member order (private → public → protected) and a `_` prefix on private members.
- Skills in `.claude/skills/`; MCP `angular`/`nx` in `.mcp.json`; SDD subagents in `.claude/agents/` (first run: 002).
- 001 (sui-icon) validated, amended 2026-10-16. 002 (sui-button) implemented 2026-10-16: @reviewer APPROVED, smooth-ui:test 121/121,
  V7 axe 0 violations both themes; reviewer observations 1-3 applied (relative spec imports, blank lines, typed console spies).
- User's uncommitted changes, kept out of every task: demo `(trigger)` on the reactive-form submit, split `name` is
  `input.required`; the spinner in `sui-button.component.scss` has no `color` (uses `currentColor`, intentional).
- Pending: `sui-button.component.scss` 4.35 kB, over the 4 kB `anyComponentStyle` warning; NG0505 on dev load; the 375 px
  demo overflow (scrollWidth 444) from sui-text-field, sui-theme-toggle/icon-button and the lg pill button-group (predates 002).

## Decisions (and why)

- Buttons bind native `disabled` and take `label` for `aria-label`; fields use `aria-describedby` and one `aria-live`
  container; ARIA bound as `[aria-*]`, not `[attr.aria-*]`. `trigger` is the only supported button activation.
- `sui-button-split` emits `trigger` and `itemSelected`; `MenuItem` is plain data with a required `id` (no callbacks).
- Reduced motion zeroes the `--sui-duration-*` tokens, not a global `*` rule, so consumer apps keep their animations.
- Constitution principle 7 (SOLID) added 2026-10-15. sdd: an existing component's spec records current behaviour.
- 002 FR-5: `label().trim() ? label() : name()`; blank `label` + `name` `""` gives `aria-label=""` (keep out of demo).
- 002 contrast (owner): light theme only, one step darker (accent 600/700/800, danger 600/700) so white text is about
  5.2:1. Shared semantic tokens reassigned to avoid new public names; side effect accepted on icon-button,
  button-group, text-field, textarea. Dark unchanged. Danger press reuses solid (600, lighter than hover 700),
  accepted. Demo paints `--sui-color-bg-canvas` on `html`/`body` so dark axe is valid.
- Accepted as-is: script-dispatched click emits `trigger` while disabled/loading; `transition: all` in text-field,
  textarea and icon-button.

## Learnings and pitfalls to avoid

- Check implementer reports against the file. A stable id for deferred content goes on a container around `@defer`;
  the 002 matrix is `<div id="button-matrix">`: scroll it into view before axe.
- jsdom: no click from Enter/Space, keeps focus on a button that becomes disabled (Chrome blurs to `body`); NG0950
  throws on `detectChanges()`. `smooth-ui-demo:typecheck` (plain `tsc`) skips templates: NG8008 shows only in build.
- DevTools MCP: no clicks on disabled elements, no held `:active`, no forced `:hover` (use real `hover` + read styles).
- axe 4.10.2 from cdnjs (not Lighthouse) for NFR-4; theme switched via `data-theme` keeps `localStorage` untouched.
- Prettier collapses double spaces in Markdown: use backticks; never format `pnpm-lock.yaml` or vendored skills.
- Planner can't run Prettier; reviewer may run only `smooth-ui:test`: owner/implementer re-run format:check + run-many pre-commit.
- In `sui-text-field`, `rawValue` stays declared below `value`.

## Next steps

- 002: implemented; the final full verification (`format:check` + `run-many -t lint test build typecheck`) runs last.
- Release note: light `primary`/`danger` darker (accent 600/700/800, danger 600/700), also in sui-icon-button,
  sui-button-group, sui-text-field and sui-textarea.
- Unreleased breaking changes since 0.5.0: `MenuItem.id` required, `sui-error` lost `inputId`, `getCustomMessage` takes
  the error object, icon names typed as `SUI_ICON_NAME`, `SuiButton.iconSize` removed, the icon is no longer an
  accessible-name fallback (nor a whitespace-only `label`), sui-button-split `name` is required.
- Open accessibility items: `name`/`autocomplete` on fields, badge text, `role="group"` on button-group, demo headings
  and icon-button labels. Suspected, untested: a strict content security policy may block the icon sprite injection.
