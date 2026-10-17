# Tasks 004 — sui-button-group

Status: approved (2026-10-17)

Plan: `specs/004-sui-button-group/plan.md` (approved 2026-10-17). One task at a time: tests first (red where the
behaviour is new; tests that record existing behaviour may pass at once), then the code, `pnpm nx run smooth-ui:test`
green, `pnpm nx format:check --files=<touched files>` clean, `MEMORY.md` updated, mark the task and stop. Paths are
relative to `libs/smooth-ui/src/lib/components/` unless they start with `apps/`, `libs/`, `specs/` or a dot. No new
files, `.scss` change, string, token, `SuiButton` or `public-api.ts` change; the public API keeps every field and input.
No arrow keys this cycle. Design doubts go to `docs/smoothui-interactivo.html` first, then to the user. The user's own
working-tree changes (demo `(trigger)` on the reactive submit, split `name` required, spinner without `color`) stay.
The implementer reports the exact output of every command; the coordinator checks each result against the files.

- [x] **T1. Keep the design reference out of Prettier.** NFR-1 (project checks)
  - Files: `.prettierignore` (user-approved).
  - Code: one new line `docs/smoothui-interactivo.html`; nothing else in the file changes.
  - Done when: the diff is that one line, `pnpm nx format:check` exits 0 on the tree (report its output) and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T2. `pressed` on `sui-button`.** 002 FR-7, 004 FR-7
  - Files: `sui-button/sui-button.component.spec.ts`, `sui-button.component.ts`, `sui-button.component.html`.
  - Tests first (red): `pressed` `true` → `aria-pressed="true"`; `false` → `"false"`; unset and `undefined` → no
    `aria-pressed`; with `expanded` `false` → `aria-pressed`, `aria-expanded` and `aria-haspopup` together; kept while
    `disabled` and while `loading`. The existing "`selected` gives no `aria-pressed`" test stays unchanged.
  - Code: after `expanded`,
    `public pressed: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);` and
    `[aria-pressed]="pressed() ?? null"` on the `<button>`. Never `booleanAttribute` (D1: it turns `undefined` into
    `false` and announces "not pressed" on every unset button).
  - If `hasAttribute('aria-pressed')` stays `true` with `null`: stop and report it; `[attr.aria-pressed]` deviates from
    the project's `[aria-*]` rule and needs the user's approval first.
  - Done when: the new tests pass, the diff is those two lines plus tests, and `pnpm nx run smooth-ui:test` is green.

- [x] **T3. `pressed` on `sui-icon-button`.** 003 FR-7, 004 FR-7
  - Files: `sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`, `.component.html`.
  - Tests first (red): `true`/`false`/unset/`undefined` as in T2; kept while `disabled`. The existing "`selected` gives
    no `aria-pressed`" test stays unchanged.
  - Code: the same input after `variant` and the same `[aria-pressed]` binding; no `booleanAttribute`; same stop rule.
  - Done when: the new tests pass, the diff is those two lines plus tests, and `pnpm nx run smooth-ui:test` is green.

- [x] **T4. Group role and optional `label`.** FR-6, NFR-2
  - Files: `sui-button-group/sui-button-group.component.spec.ts`, `sui-button-group.component.ts`.
  - Tests first (red): host `role` is `group`; `label` `" Tools "` → host `aria-label` `" Tools "`; `""`, `"  "` and
    unset → no `aria-label`; segments have no `tabindex` attribute, `tabIndex` 0, in list order; a dispatched
    `ArrowRight` keydown on the first segment leaves `document.activeElement` on it.
  - Code: `public label: InputSignal<string> = input<string>('');`, a `groupName: Signal<string | null>` computed
    (`label()` untrimmed if `label().trim()`, else `null`) and `host: { role: 'group', '[aria-label]': 'groupName()' }`.
    No wrapper element, no `tabindex`, no key listener.
  - If `[aria-label]` with `null` leaves the attribute on the host: stop and raise it to the user before using
    `'[attr.aria-label]'` (plan risk; deviation from the ARIA binding rule).
  - Done when: the new tests pass, the existing group tests are unchanged and `pnpm nx run smooth-ui:test` is green.

- [x] **T5. Segment pressed state and `icon`-type naming.** FR-5, FR-7
  - Files: `sui-button-group/sui-button-group.component.spec.ts`, `.component.ts`, `.component.html`.
  - Tests first (red where new): FR-7 in both types: `selected` `true` → selected class + `aria-pressed="true"`;
    `false` → no class + `"false"`; absent and explicit `undefined` → no class, no `aria-pressed`; one group mixing
    all three; `button` type `expanded` `false` with and without `selected` → `aria-expanded="false"`,
    `aria-haspopup="menu"`, `aria-pressed` only with `selected`; `icon` type with `expanded` → no `aria-expanded`.
    FR-5: every name case of the plan's test strategy (`button` and `icon` type, the three no-name results) with a
    `console.error`/`console.warn` spy left uncalled.
  - Code: `iconLabels: Signal<string[]>` (per entry: `label` as given if `label?.trim()`, else `name`); the `icon`
    branch binds `[label]="iconLabels()[$index]"`; both branches add `[pressed]="button.selected"` raw, next to the
    unchanged `[selected]="button.selected ?? false"`. Keep both `track button.label ?? button.name` (the split's
    focus return relies on DOM reuse) and add no wrapper between segments (scoped divider selectors).
  - Done when: the new tests pass, the tracks and the inner `div` are byte-identical, and `pnpm nx run smooth-ui:test`
    is green.

- [x] **T6. Tests for unchanged group behaviour and the split.** FR-1 to FR-4, FR-6, FR-7, FR-8, FR-9, NFR-2
  - Files: `sui-button-group/sui-button-group.component.spec.ts`, `sui-button-split/sui-button-split.component.spec.ts`.
  - Tests (plan's test strategy): FR-1 (`NG0950` without `buttons`, `[]` renders no button), FR-2, FR-3 (`this` is the
    entry, no arguments, no `selected` change, no form submit), FR-4, FR-8/FR-9 classes, NFR-2 (empty host text).
    Split, both modes: inner group `role="group"`, no `aria-label`, no segment with `aria-pressed`, also after opening
    the menu.
  - Done when: the tests pass with no library code change, the existing split tests stay green unchanged and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T7. Demo: named groups, mixed `selected`, one-entry group.** NFR-4, completion criterion 4
  - Files: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Code: `buttonsGroup` Button 1 `selected: true`, Button 2 `selected: false`, Button 3 without `selected`;
    `public singleButtonGroup: SuiButton[] = [{ name: 'Single action', icon: 'star' }];`; a distinct `label` on each of
    the 12 groups (type, variant, shape, size, e.g. `label="Icon group (primary, pill, lg)"`); one new row with
    `<sui-button-group [buttons]="singleButtonGroup" label="Single action group" />`. Split buttons and
    `app.component.scss` untouched.
  - Done when: `pnpm nx run smooth-ui-demo:build` passes with no new `anyComponentStyle` warning (the `sui-button`
    4.35 kB one predates 004), `pnpm nx run smooth-ui-demo:typecheck` passes, 13 groups each with a `label`, and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T8. FR-1 build-time check with temporary markup.** FR-1
  - Files (temporary, reverted in this task): `apps/smooth-ui-demo/src/app/app.component.html`.
  - Steps: add `<sui-button-group />`, run `pnpm nx run smooth-ui-demo:build`, report the failure and its error code,
    remove the line.
  - Done when: the failure is reported with its output, the file is byte-identical to its T7 state, the build passes
    again and `pnpm nx run smooth-ui:test` is green.

- [x] **T9. Browser validation (Chrome DevTools MCP).** FR-6 to FR-10, NFR-3, NFR-4, completion criterion 3
  - Files: none. Served demo on port 4200; ask the user before restarting or stopping their dev server there.
  - Load: wait until the page is fully loaded and every deferred block has rendered (`#button-matrix` 144 buttons,
    `#icon-button-matrix` 36, no placeholder or loading text) before any check; repeat after a reload or theme switch.
  - Tree, both themes: each demo group is a `group` with its `label` as name; segments named per FR-5; Button 1
    pressed `true`, Button 2 `false`, Button 3 no pressed state; split groups unnamed, no pressed state, chevron
    `aria-expanded` false/true with the menu; Tab visits every segment in list order.
  - Looks, both themes: FR-8 radii (0, 10 px, round ends); FR-9 1 px outline and lines (`ghost`), no outline and accent
    line (`primary`); FR-10 keyboard ring read ~500 ms after focus. NFR-3: reduced motion gives `0s` transitions.
  - NFR-4: canvas rgb (248, 249, 251) light and rgb (16, 20, 27) dark; axe-core 4.10.2 from cdnjs (no package) on the
    group and split sections with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: zero violations per theme.
  - Known issues RECORDED with measured values, not counted as passing: ring clipped and covered, none visible on the
    first `primary` segment or the one-entry group (SC 2.4.7); dark ring ~1:1 on `primary` hover, ~1.4:1 at rest;
    light ring 1.92:1 on the canvas (axe does not catch them). Restore the persisted theme at the end.
  - Done when: every check above is reported as passing or failing with values; any manual press-state check
    (`:active`, held Space) is listed for the user, who does it (the MCP cannot hold `:active`).
  - Result (2026-10-17, both themes): all checks pass; tree identical in both themes (13 named groups, 6 unnamed
    split groups; the MCP tree shows only pressed `true`, so `false` and none were read from `aria-pressed`); 49 Tab
    stops in order, arrows keep focus; axe 0 violations, also with a split menu open. Known issues measured: first
    `primary` segment and one-entry group show no ring; dark ring rgb (166, 178, 252) = `primary` hover (1:1), 1.42:1
    at rest; light ring 1.92:1 on the canvas, 1.81:1 on a selected segment. Manual screen-reader and held-Space checks
    are left to the user.
  - Manual screen-reader/press check by the owner (2026-10-17): correct (group names; Button 1/2/3 pressed
    true/false/none in both group types; one-entry group; split unnamed, Save not pressed, More options
    collapsed/expanded; held Space on the selected `primary` segment runs the action once).

- [x] **T10. Full verification, statuses, release note and memory.** All FRs, NFR-1 to NFR-4
  - Files: `specs/002-sui-button/spec.md`, `specs/003-sui-icon-button/spec.md`, `specs/004-sui-button-group/spec.md`,
    this file, `MEMORY.md` (no code).
  - Steps: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (exact output reported); 002 and
    003 status lines and amendment notes say the FR-7 amendment is implemented (date); spec 004 `Status: implemented`.
  - Release note in `MEMORY.md` (plan's text): breaking `icon`-type blank `label` falls back to `name`; group
    `role="group"` and optional `label`; `pressed` input on both buttons, fed by each entry's `selected`; known issues.
  - Done when: the command passes, no `package.json` changed, no new library string, the statuses read as above and
    `MEMORY.md` stays within ~50 lines.
