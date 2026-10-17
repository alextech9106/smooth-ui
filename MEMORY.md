# MEMORY.md — Smooth UI (max ~50 lines; stack, alias, theme, prod tsconfig and release are in AGENTS.md)

## Current state

- Components: button, icon-button, button-group, button-split, link, text-field, textarea, icon, theme-toggle, error.
  ESLint: member order private → public → protected, `_` on private. Skills/agents in `.claude/`, MCP in `.mcp.json`.
- 001 validated; 002 implemented 10-16; 003, 004 and the 002/003 FR-7 `pressed` amendments implemented 10-17; all
  @reviewer APPROVED (004: 2026-10-17, 232 tests green with `--skip-nx-cache`, real run ~4s; dark-theme axe 0 on 25
  group/split nodes; owner's manual screen-reader/held-Space check correct). 004 cycle closed.
- Reviewer follow-ups (non-blocking): group spec's "does nothing for an entry without a callback" and ArrowRight tests
  assert little; `pressed` false/none and ring measurements rely on T9 + owner's manual check.
- User's own changes, kept out of tasks: demo `(trigger)` on reactive submit, split `name` required, spinner no `color`.
- Pending: `sui-button` scss 4.35 kB (> 4 kB); NG0505 on dev load; 375 px overflow (444 px); dev server on 4200.

## Decisions (and why)

- Owner guidelines: keep the public API (business logic still missing); never propose removing fields/inputs or call
  them unused/ignored/dead; only fix logic that can cause real problems later. Resolve doubts with the design in
  `docs/smoothui-interactivo.html` first; its ← → group navigation is NOT wanted this cycle.
- 004: `role="group"`, each segment its own Tab stop, split Tab unchanged; group `label` = `aria-label` if not blank
  (split passes none); segment name = non-blank `label` as given, else `name`; `selected` given → `aria-pressed`
  true/false, absent → none; `selected`+`expanded` announce both; icon `expanded` unannounced.
- Buttons bind native `disabled`, take `label` for `aria-label`; fields use `aria-describedby` + one `aria-live`
  container; ARIA bound as `[aria-*]`, not `[attr.aria-*]` (deviation needs the user). `trigger` is the only activation.
- `sui-button-split` emits `trigger` and `itemSelected`; `MenuItem` is plain data with a required `id` (no callbacks).
- Reduced motion zeroes the `--sui-duration-*` tokens, not a global `*` rule, so consumer apps keep their animations.
- 002 FR-5: `label().trim() ? label() : name()`. 003: name = non-blank `label` untrimmed, else `null`, never the icon.
  Light `primary`/`danger` one step darker (owner). D2 (user): `--sui-focus-ring` opaque accent 300, light < 3:1 accepted.

## Learnings and pitfalls to avoid

- Check implementer reports against the file; owner or implementer re-run format:check + run-many (planner can't run
  Prettier, reviewer only `smooth-ui:test`). `smooth-ui:test` may hit the Nx cache: use `--skip-nx-cache` for a real run.
- jsdom: no click from Enter/Space, keeps focus on a button that becomes disabled (Chrome blurs to `body`); NG0950
  throws on `detectChanges()`. `smooth-ui-demo:typecheck` (plain `tsc`) skips templates: NG8008 shows only in build.
- `expect(() => el.click()).not.toThrow()` proves nothing: listener errors don't reach the `click()` caller.
- DevTools MCP: no clicks on disabled elements, no held `:active` (owner checks press by hand). axe 4.10.2 from cdnjs,
  never a package; it misses ring contrast. Wait for deferred blocks; read `box-shadow` ~500 ms after focus; after a
  mouse click press a real Tab first. Its tree shows only `pressed` true; snapshots only under `tmp/` (gitignored).
- Prettier collapses double spaces in Markdown and joins a wrapped line starting `27)` (list marker): use backticks;
  never format `pnpm-lock.yaml` or vendored files. Format one file: `pnpm nx format:write --files=<path>`.
- `[aria-label]`/`[aria-pressed]` bound to `null` remove the attr, also as a host binding. Buttons are border-box.
- Group: split never sets `type` and rebuilds entries on every menu toggle; keep the group's `track` (split focus
  return relies on DOM reuse) and no wrapper between segments (scoped divider selectors; `::ng-deep` forbidden).
  `pressed` must NOT use `booleanAttribute` (`undefined` would become `false`, "not pressed"); `?? false` only for look.
- `Array.from(el.children)` is `Element[]` (`HTMLElement[]`: TS2769); "no output" via `reflectComponentType`.

## Release note (since 0.5.0) and open items

- Breaking: light `primary`/`danger` darker; `MenuItem.id`, split `name` required; `sui-error` lost `inputId`;
  `getCustomMessage` takes the error; `SUI_ICON_NAME`; neither button names itself by icon; `iconSize` removed;
  `--sui-focus-ring` opaque accent 300; `icon`-type group segments are named by a non-blank `label`, else `name`.
- New: optional `label` input on `sui-button-group` (host `role="group"`, `aria-label` when not blank); `pressed`
  input on `sui-button` and `sui-icon-button` (`aria-pressed`; unset or `undefined` = no attribute); group segments
  announce each entry's `selected` through `aria-pressed`.
- Known issues: first `primary` segment and one-entry group show no visible focus ring (SC 2.4.7); dark ring over
  `primary` 1:1 on hover, 1.42:1 at rest; light ring 1.92:1 on the canvas (SC 1.4.11); selected `primary` icon
  button pressed with Space 1.85:1 light, 1.34:1 dark.
- Open: field `name`/`autocomplete`, badge text, demo headings; strict CSP vs sprite (untested).
