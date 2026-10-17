# Plan 004 — sui-button-group

Status: approved (2026-10-17)

Spec: `specs/004-sui-button-group/spec.md` (approved 2026-10-17) and the FR-7 `pressed` amendments of
`specs/002-sui-button/spec.md` and `specs/003-sui-icon-button/spec.md` (approved 2026-10-17). The open question
(disabled entries, entry identity, activation output, `primary` line, `rounded` radius) is deferred and does not block.
This plan changes only what the FRs state: the `icon`-type name rule (FR-5), the group role and `label` (FR-6), the
pressed state (FR-7, 002/003 FR-7), the missing tests and the demo. Looks, rings, clipping, `.scss` files, `SuiButton`
and arrow-key navigation are not changed (owner: no arrows this cycle). The public API keeps every field and input.

## Files and responsibilities

No new library files. `public-api.ts` is not changed: no new exported type; the component and both group types are
already exported, and the new inputs ride on exported components.

Modified:

- `sui-button/sui-button.component.ts` — new input, placed after `expanded`:
  `public pressed: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);` (D1). 002 FR-7.
- `sui-button/sui-button.component.html` — `[aria-pressed]="pressed() ?? null"` on the `<button>`. 002 FR-7.
- `sui-icon-button/sui-icon-button.component.ts` — the same `pressed` input, after `variant` (D1). 003 FR-7.
- `sui-icon-button/sui-icon-button.component.html` — `[aria-pressed]="pressed() ?? null"` on the `<button>`. 003 FR-7.
- `sui-button-group/sui-button-group.component.ts` — `label` input, `groupName` and `iconLabels` computeds and the
  `host` metadata (see Public API and State). FR-5, FR-6.
- `sui-button-group/sui-button-group.component.html` — both branches bind `[pressed]="button.selected"` (raw) next to
  the unchanged `[selected]="button.selected ?? false"`; the `icon` branch binds `[label]="iconLabels()[$index]"`
  instead of `button.label ?? button.name`. Everything else (tracks, `callback?.()`, `'flat'`, size, variant, the inner
  `div`) stays. FR-4, FR-5, FR-7.
- Specs: `sui-button-group.component.spec.ts` (most new tests), `sui-button.component.spec.ts`,
  `sui-icon-button.component.spec.ts`, `sui-button-split.component.spec.ts` (see Test strategy).
- `apps/smooth-ui-demo/src/app/app.component.ts` and `.html` — demo additions (see Demo).
- `.prettierignore` — new line `docs/smoothui-interactivo.html` (user-approved): the design reference is vendored
  HTML and must not fail `format:check`.
- `specs/003-sui-icon-button/spec.md` — nothing: its "Accessible name" edge case already states the FR-5 rule
  (completion criterion 1, checked).

Read, not changed:

- `sui-button-group.component.scss` — FR-8 radii (`-flat`/`-rounded`/`-pill`), FR-9 outline and dividers, and the
  `overflow: hidden` behind FR-10. No motion of its own (NFR-3).
- `sui-button.component.scss`, `sui-icon-button.component.scss` — selected look, rings (FR-7, FR-10).
- `sui-button-split.component.ts/html` — passes no `label` and no `selected`, so its group is unnamed and its segments
  announce no pressed state; `expanded` stays on the chevron; it never sets `type`, so FR-5's `icon`-type change does
  not reach it. `_focusTrigger` queries `sui-button-group button` and still finds the chevron. No code change.
- `interfaces/sui-button.interface.ts` — `SuiButton` unchanged; `selected` is the entry's source for `pressed` (D2).

## Public API

- `sui-button`: new input `pressed: boolean | undefined` (default `undefined`). `true`/`false` set `aria-pressed`;
  `undefined` sets none. Independent of `selected`; kept while disabled or loading. 002 FR-7.
- `sui-icon-button`: the same `pressed` input and behaviour, kept while disabled. 003 FR-7.
- `sui-button-group`: new input `label: string` (default `''`), the group's accessible name when not blank (FR-6).
  Inputs `buttons` (required, FR-1), `shape` (`flat`), `size` (`md`), `type` (`button`), `variant` (`ghost`) unchanged.
  No output (FR-3). Host gets `role="group"` (FR-6).
- Behaviour change (breaking, `icon` type): a blank `label` now falls back to `name` instead of giving no name (FR-5).
- Exported types unchanged: `SuiButton`, `SUI_BUTTON_GROUP_TYPE`, `SUI_BUTTON_GROUP_VARIANT`.

## State and what derives from it

All derived with `computed()`; no `effect()`, no lifecycle hooks, no writable state. Member order follows ESLint
(private → public → protected), explicit types as in the rest of the files.

- Group `groupName: Signal<string | null>` — `label()` as given (untrimmed) when `label().trim()` is not empty, else
  `null` (the attribute is removed). FR-6, NFR-2.
- Group `iconLabels: Signal<string[]>` — per entry, in list order: `label` as given when `label?.trim()` is not empty,
  else `name` as given. Passed to `sui-icon-button`, whose own rule turns a blank value into no `aria-label`. FR-5 (D3).
- Text segments: unchanged path — `name` and `label ?? ''` go to `sui-button`, whose FR-5 computed gives the name.
- Pressed: `button.selected` raw to `pressed` (`true`/`false`/`undefined`); `selected ?? false` only for the look. An
  explicit `selected: undefined` is "not given" (spec Definitions) and gives no `aria-pressed`. FR-7 (D2).
- Unchanged: group `classes` (FR-8, FR-9 through `sui-button-group-<shape|size|variant>`).

## Where browser side effects live

None added. No component touches a browser global; the split's existing `window`/`document` use is untouched.

## Template and accessibility

- Host: `host: { role: 'group', '[aria-label]': 'groupName()' }` (project rule: `[aria-*]`, not `[attr.aria-*]`).
  The role sits on `sui-button-group` itself, so the inner `div` and the segment order stay and the `.scss` selectors
  keep matching (D4). FR-6.
- No `tabindex`, no key listener, no focus management: every segment is a native `<button>`, its own Tab stop in list
  order. No arrow keys (out of scope). FR-6.
- Segments: `[aria-pressed]` from `pressed` (FR-7); text type keeps `[expanded]` → `aria-expanded` + `aria-haspopup`
  alongside it (both announced, edge case "Pressed"); icon type receives no `expanded` (unannounced, as today).
- Activation: `(trigger)="button.callback?.()"` keeps the entry as `this`, passes no data and the group emits nothing;
  both inner buttons are `type="button"` by default, so no form submit (FR-3).
- Rings untouched (FR-10, known issues). Names come only from entries and `label` (NFR-2).

## Demo

- `app.component.ts`: `buttonsGroup` becomes Button 1 `selected: true`, Button 2 `selected: false`, Button 3 with no
  `selected` (pressed, not pressed, no state side by side; completion criterion 4). New
  `public singleButtonGroup: SuiButton[] = [{ name: 'Single action', icon: 'star' }];` (one-entry group).
- `app.component.html`: each of the 12 existing groups gets a distinct `label` naming type, variant, shape and size,
  for example `label="Icon group (primary, pill, lg)"`. They already cover both types × both
  variants × three shapes, so the NFR-4 set (each type, variant and shape at least once) is met. One new row under them:
  `<sui-button-group [buttons]="singleButtonGroup" label="Single action group" />`.
- Split buttons unchanged (they check FR-6 role and "no pressed state"). No new rule in `app.component.scss`, so the
  `anyComponentStyle` budget is unaffected; Signal Forms / Reactive Forms rules do not apply (no form control).

## Decisions

- **D1. `pressed` is a plain `boolean | undefined` input, no `booleanAttribute`.** The transform would turn `undefined`
  into `false` and announce "not pressed" where the spec wants no state. Discarded: `booleanAttribute` (wrong for
  `undefined`) and reusing `selected` for ARIA (002/003 FR-7 keep the look and the announcement apart).
- **D2. The group maps `selected` to `pressed`; `SuiButton` gets no `pressed` field.** The spec names `selected` as the
  entry's source and keeps the description as it is. Discarded: a new `SuiButton.pressed` (API change no FR asks for).
- **D3. The `icon`-type name rule is a `computed()` list indexed by `$index`.** Templates bind, state derives in
  `computed()` (principle 3), and the `@for` and its `track` stay as they are, so the split's DOM reuse is unchanged.
  Discarded: an inline `label?.trim() ? … : …` ternary (logic in markup) and a view-model list with new tracking (entry
  identity is deferred).
- **D4. `role` and `aria-label` go on the host.** No new wrapper and no `.scss` change. Discarded: putting them on the
  inner `div` (works too, but the brief and the design's `role="group"` container point at the component itself).
- **D5. Looks through classes in Vitest; corners, lines, colours, rings and the accessibility tree in the browser.**
  jsdom does not apply component styles or `theme.scss`. Discarded: `getComputedStyle` assertions.

## Test strategy (Vitest and TestBed, jsdom)

Run with `pnpm nx run smooth-ui:test`. Inputs via `fixture.componentRef.setInput()`, then `await fixture.whenStable()`.
Existing tests stay; the group's "names icon buttons after the button name" and both text-entry tests keep passing.

`sui-button-group.component.spec.ts` (new):

- **FR-1**: a fresh fixture without `buttons` throws `NG0950` on `detectChanges()`; `[]` renders no `<button>`.
- **FR-2**: three entries render three buttons in list order, one row (single inner `div`); `button` type shows the
  icon `<svg>` before the `name` text; `icon` type shows one `<svg>` per segment and no text, also for an entry
  without `icon`.
- **FR-3**: per type, a click calls `callback` once, with no arguments and `this` the entry (`mock.contexts[0]`); an
  entry without `callback` clicks without error; the entry still equals a copy taken before (no `selected` change); an
  in-spec host with a `<form (submit)>` around the group records no submit.
- **FR-4**: defaults give `sui-button-md`, `sui-button-ghost`, `sui-button-flat` (and `sui-icon-button-*`); `size` `lg`
  and `variant` `primary` reach every segment in both types; an entry with its own `size`, `variant` or `shape` still
  shows the group's values; `name`, `label`, `icon` reach the segment.
- **FR-5**, `button` type: `label` `" Bold "` → `aria-label` `" Bold "`; `label` `""`, `name` `" Bold "` → no
  `aria-label`, text `"Bold"` trimmed; `label` `"  "`, `name` `" Bold "` → `aria-label` `" Bold "`; no-name results:
  `name` `""` + `label` `""` → `aria-label` `""`; `name` `"  "` + `label` `""` → no `aria-label`, whitespace text;
  `name` `"  "` + `label` `" "` → whitespace-only `aria-label`. `icon` type: `label` `" Bold "` → `" Bold "`; `label`
  `"  "` or `""` or absent with `name` `" Bold "` → `" Bold "`; both blank → no `aria-label`. A `console.error`/`warn`
  spy stays uncalled (nothing reported).
- **FR-6**: host `role` is `group`; `label` `" Tools "` → host `aria-label` `" Tools "`; `""`, `"  "` and unset → no
  `aria-label`; segments have no `tabindex` attribute and `tabIndex` 0, in list order; a dispatched `ArrowRight`
  keydown on the first segment leaves `document.activeElement` on it (no key handling).
- **FR-7**, both types: `selected` `true` → selected class + `aria-pressed="true"`; `false` → no class +
  `"false"`; absent and explicit `undefined` → no class, no `aria-pressed`; one group mixing all three. `button` type:
  `expanded` `false` with and without `selected` → `aria-expanded="false"`, `aria-haspopup="menu"`, and `aria-pressed`
  only with `selected`. `icon` type with `expanded` → no `aria-expanded`.
- **FR-8, FR-9**: group classes `sui-button-group-flat` (default), `-rounded`, `-pill`; `-ghost` (default),
  `-primary`; segments keep `flat` in every group shape.
- **NFR-2**: with `[]` and no `label`, the host's text content is empty and it has no `aria-label` (no own text).

`sui-button.component.spec.ts` (002 FR-7): `pressed` `true` → `aria-pressed="true"`; `false` → `"false"`; unset and
`undefined` → none; `selected` without `pressed` → none (existing test); `pressed` with `expanded` → both; kept while
`disabled` and while `loading`.

`sui-icon-button.component.spec.ts` (003 FR-7): `true`/`false`/unset/`undefined` as above; `selected` alone → none
(existing test); kept while `disabled`.

`sui-button-split.component.spec.ts`: in both modes, the inner `sui-button-group` has `role="group"` and no
`aria-label`, and no segment has `aria-pressed`, also after opening the menu; the existing focus, Escape and selection
tests stay green (they cover the rebuilt entries and the unchanged `track`).

## Left for validation (browser, Chrome DevTools MCP)

- **FR-1 in markup**: a temporary `<sui-button-group />` makes `pnpm nx run smooth-ui-demo:build` fail; removed.
- **FR-8, FR-9**: radii (0, 10 px, round ends) and lines (1 px, border default; `primary` accent solid, no outline) in
  both themes. **FR-10**: keyboard ring per segment, clipped at the edges and covered by the next segment; none visible
  on the first `primary` segment and the one-entry group (known issues confirmed, not fixed).
- **FR-6, FR-7**: accessibility tree shows the named `group`, segment names and pressed `true`/`false`/none; the split
  shows an unnamed group and no pressed state; Tab visits every segment in order.
- **NFR-3**: with reduced motion emulated, segment transitions are `0s`. **NFR-4**: confirm the canvas background, load
  axe 4.10.2 from cdnjs (no package) and run it on the group and split sections with `wcag2a`, `wcag2aa`, `wcag21a`,
  `wcag21aa`, `wcag22aa`: zero violations in light and dark theme. **NFR-1, NFR-2**: no `package.json` change, no new
  library string.

## FR coverage

- FR-1: no change (required input) · unit test + demo build check.
- FR-2, FR-3, FR-4: no change · unit tests (DOM order, callback, classes and inputs).
- FR-5: `iconLabels` + the icon-branch `[label]` · unit tests for every edge case and no-name result.
- FR-6: `label`, `groupName`, `host` role and name · unit tests + accessibility tree.
- FR-7: `pressed` on both buttons + `[pressed]` in both branches · unit tests (group, 002, 003, split) + tree.
- FR-8, FR-9: no change · class tests + browser. FR-10: no change · browser (known issues recorded).
- NFR-1 to NFR-4: demo labels, one-entry group, mixed `selected` · checks + axe in both themes.

## Constitution check

1 no dependency · 2 specs 002/003/004 updated before code · 3 template binds, names derive in `computed()`, no side
effects · 4 Vitest/TestBed specs beside each component · 5 no data handling · 6 no new string, every name an input ·
7 behaviour added through new inputs (`pressed`, `label`); no branch grows for a new variant.

## Release note (for `MEMORY.md` and the release)

Breaking: in `icon` type a blank entry `label` now falls back to its `name`. New: `sui-button-group` has
`role="group"` and an optional `label` (its accessible name when not blank); `sui-button` and `sui-icon-button` gain a
`pressed` input (`aria-pressed`; unset gives none), which group segments receive from each entry's `selected`. Known
issues: group rings clipped at the edges and covered by the next segment, none visible on the first `primary` segment
or a one-entry group (SC 2.4.7); dark ring about 1:1 with `primary` hover and 1.4:1 at rest.

## Verification

`pnpm nx run smooth-ui:test` after each task; at the end
`pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` (owner or implementer; the planner cannot
run Prettier).

## Risks and pitfalls

- `booleanAttribute` on `pressed` would silently announce "not pressed" for every unset button (D1).
- The split rebuilds its entries on every menu toggle; `iconLabels` recomputes, but tracks stay `label ?? name`, so the
  DOM is reused and focus stays on the chevron. Changing the `track` would break the split's focus return.
- Emulated encapsulation (ShadowCss) scopes `sui-button:not(:first-child)` to the group's own template elements: a new
  wrapper around segments or a `role` element between them would stop the dividers matching (`::ng-deep` forbidden).
- If `'[aria-label]'` in `host` does not remove the attribute for `null` in jsdom or the browser, the FR-6 tests fail;
  fallback `'[attr.aria-label]'`, a deviation from the ARIA binding rule to raise before applying.
- Duplicate `label ?? name` among entries gives a duplicate-track warning (entry identity deferred, not fixed here).
- Consumers relying on unnamed icon segments with a blank `label` now get the `name` (breaking, release note).
