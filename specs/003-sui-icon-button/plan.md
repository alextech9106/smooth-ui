# Plan 003 — sui-icon-button

Status: approved (2026-10-17, re-approved after D2 was revised to accent 300 for the FR-8/NFR-4 change)

Spec: `specs/003-sui-icon-button/spec.md` (approved 2026-10-17; re-approved the same day after the FR-8/NFR-4 ring
change). Its five open questions are left for later, so this plan changes only what the FRs and NFRs state: the FR-4 name (no icon-name fallback), the removal of `iconSize` from
the component and `SuiIconButton` (breaking), the shared focus ring colour (FR-8, NFR-4), the missing tests and the demo
matrix. Looks, sizes, shapes, badge and `.scss` are not changed. The user's working-tree changes are kept (the demo's
reactive-form submit uses `(trigger)`, the split's `name` is required, the current `sui-button.component.scss`).

## Files and responsibilities

No new files. `public-api.ts` is not changed (it already exports the component, `SUI_ICON_BUTTON_VARIANT` and
`SuiIconButton`).

Modified:

- `sui-icon-button.component.ts` — drops the `iconSize` input (line 19); `accessibleName` becomes
  `protected readonly accessibleName: Signal<string | null> = computed(() => (this.label().trim() ? this.label() : null));`
  (D1). Nothing else changes. FR-4, FR-6.
- `interfaces/sui-icon-button.interface.ts` — drops `iconSize?: number` (breaking). FR-6.
- `libs/smooth-ui/theme/theme.scss` — line 227 (light) and line 296 (dark): `--sui-focus-ring` becomes
  `0 0 0 3px var(--sui-accent-300)` in both blocks (D2). `--sui-focus-ring-danger` (lines 228, 297) is untouched. FR-8,
  NFR-4.
- `sui-icon-button.component.spec.ts` — the icon-name test is updated and the new tests added (see Test strategy).
- `apps/smooth-ui-demo/src/app/app.component.ts` — typed demo data for the icon-button matrix and the shape row (D3).
- `apps/smooth-ui-demo/src/app/app.component.html` — lines 71-85 (13 unlabelled, partly duplicated icon buttons) are
  replaced by a labelled shape row and the deferred matrix (D3, D4). Completion criteria 3, 4.

Read, not changed:

- `sui-icon-button.component.html` — `[aria-label]="accessibleName()"` stays; `null` removes the attribute (FR-4). The
  native `<button type="button">` gives keyboard activation and no form submit or reset (FR-2) and `[disabled]` makes it
  unavailable (FR-3); `sui-icon` gets `computedIconSize()` (16/20/24, FR-6); the badge is a sibling `<span>` outside the
  `<button>` (FR-9, FR-10). The `NgClass` on the anchor is legacy but no FR touches it, so it is not migrated.
- `sui-icon-button.component.scss` — every look, size, shape, `selected`, `focus`, disabled and badge rule (FR-3, FR-5
  to FR-9); `transition: all` uses `--sui-duration-fast`, which reduced motion zeroes in `theme.scss` (NFR-3). All rings
  use `var(--sui-focus-ring)`, so D2 reaches `:focus-visible` and `state` `focus` with no `.scss` change (FR-8).
- `sui-icon/sui-icon.component.html` — the `<svg>` is `aria-hidden="true"` and `focusable="false"` (FR-4).
- `sui-theme-toggle.component.html` — always passes a non-blank `label`, never `iconSize`: unaffected by FR-4 and FR-6;
  its ring changes with D2 (accepted, out of scope). It keeps its raw `(click)`.
- `sui-button-group.component.html` — passes `label ?? name`, never `iconSize`; the group's fallback is out of scope.
  The demo's `buttonsGroup` entries have non-blank names, so its 18 icon buttons stay named.
- Other `--sui-focus-ring` users (side effect of D2, accepted by the spec): `sui-button` (5 rings), `sui-button-split`
  (menu items, over `--sui-color-bg-surface-raised`), `sui-link` (2), `sui-text-field` (2, next to an accent border on
  `:focus-within`), `sui-textarea` (1). `sui-button`'s `danger` keeps `--sui-focus-ring-danger`.
- Search for other consumers: no file in `libs/` or `apps/` binds `iconSize` on `sui-icon-button`, builds a
  `SuiIconButton` (exported, unused) or relies on the icon-name fallback; only the demo's 13 unlabelled buttons did, and
  they are replaced. No unit test asserts `--sui-focus-ring`, hex values or computed colours.

## Public API

- Selector `sui-icon-button`. Inputs: `icon` (required, FR-1), `badge` (`0`), `label` (`''`), `shape` (`rounded`),
  `size` (`md`), `state` (`default`), `variant` (`ghost`), boolean-attribute `disabled` and `selected`. `iconSize` is
  removed (breaking, FR-6).
- Output `trigger: void` (FR-2), no `stopPropagation`.
- Exported type `SuiIconButton` loses `iconSize` (breaking); everything else in it stays (out of scope).
- Behaviour change (breaking): the icon name never becomes the accessible name; a blank `label` gives no `aria-label`.
  Nothing is checked or reported at runtime (FR-4).
- Theme change (breaking for looks): `--sui-focus-ring` gets a new colour in both themes, so every ring that uses it
  changes; the variable name stays (AGENTS.md forbids renaming theme variables).

## State and what derives from it

All derived with `computed()`; no `effect()`, no lifecycle hooks, no new writable state.

- `accessibleName: Signal<string | null>` — `label()` as given (untrimmed) when `label().trim()` is not empty, else
  `null`; never `icon()`. FR-4.
- Unchanged: `computedIconSize` (from `size` only, FR-6) and `classes` (FR-3, FR-5 to FR-8).

## Where browser side effects live

None added. The component touches no browser global; the icon sprite stays in `SuiIconService` (spec 001).

## Template and accessibility

- Native `<button type="button">`: Enter and Space come from the browser, no key handler of its own; never submits or
  resets a form (FR-2). `[disabled]` removes it from the focus order and announces it as unavailable (FR-3).
- `[aria-label]` is the non-blank `label` untrimmed, or absent; the button has no text content, so with no `label` it is
  unnamed (the documented FR-4 violation, kept out of the demo). No `aria-pressed` for `selected` (FR-7).
- The icon is hidden through `sui-icon` (FR-4). The badge is plain text in a sibling `<span>`, so it is exposed as its
  own text, is not in the name and a click on it does not reach the `<button>` (FR-10).

## Demo

- `app.component.ts` gains, as `protected readonly` fields: `iconButtonVariants: SUI_ICON_BUTTON_VARIANT[]` (`ghost`,
  `outline`, `primary`), `iconButtonStates: DemoIconButtonState[]` (4) and
  `iconButtonMatrix: DemoIconButtonVariantGroup[]`, built once by a module-level pure function from the variants, the existing
  `buttonSizes` and the states (D3). Local interfaces: `DemoIconButtonState` (`id`, `action`, `icon`, `selected`,
  `disabled`, `state: SUI_STATE`, `badge`), `DemoIconButton` (the same plus a unique `id` and `label`), a row (`id`,
  `size`, `buttons`) and a variant group (`variant`, `rows`). `SUI_ICON_BUTTON_VARIANT` is added to the import.
- States, each alone (NFR-4): `selected` (`star`, "Add to favourites"), `disabled` (`trash`, "Delete"), `state` `focus`
  (`settings`, "Open settings") and a badge (`bell`, "Show notifications", `badge` 3). Each `label` is the action plus
  variant and size, for example "Delete (outline, lg)", so all 36 are non-blank and distinct.
- Shape row (eager, before the matrix, three hand-written lines in a `.row`): `outline` `md` buttons with the `edit`
  icon and `shape` `flat`/`rounded`/`pill`, labelled "Edit (flat)", "Edit (rounded)" and "Edit (pill)" (completion
  criterion 3).
- Matrix: `<div id="icon-button-matrix">` wraps `@defer (on viewport)`; inside, `@for` per variant group
  (`track group.variant`) with an `<h2>`, per row (`track row.id`, one `.row` per size) and per button
  (`track button.id`), binding `badge`, `disabled`, `icon`, `label`, `selected`, `size`, `state` and `variant`.
  `@placeholder` shows "Icon button matrix", `@loading` "Loading icon button matrix…". `sui-icon-button` is also used
  eagerly (shape row, theme toggle), so the defer delays rendering only.
- Layout: reuses `.row` (wrapping flex, 1rem gap) and `.col`; no new rule in `app.component.scss`, so the
  `anyComponentStyle` budget is unaffected. A row holds 4 buttons (at most 4 × 48 + 3 × 16 = 240 px, plus the badge's
  12 px), well inside the 343 px content width at 375 px, so the page's overflow does not grow.
- The theme toggle and the button groups need no change (out of scope; they are not part of the checks).

## Decisions

- **D1. `accessibleName` returns `null` for a blank `label`.** `[aria-label]` with `null` removes the attribute, so the
  button sets no name of its own (FR-4); `label()` is kept untrimmed. Discarded: returning `''` (an empty `aria-label`,
  a name set to blank rather than none) and a runtime warning (the spec says nothing reports it).
- **D2. `--sui-focus-ring` becomes an opaque `0 0 0 3px var(--sui-accent-300)` in both themes (user's decision,
  2026-10-17, replacing the accent 500 applied first in T6).** Same 3 px shape as before, now opaque, so the painted
  colour is the token colour on any background. Computed WCAG contrast of #a6b2fc: light, over the canvas
  #f8f9fb 1.92:1 (before 1.49:1) and over white surfaces 2.02:1, both below 3:1; dark, over the canvas #10141b 9.14:1 (before
  2.27:1). Rationale: the user's choice of a softer ring in both themes, one
  shared token. Trade-off: the light-theme ring fails WCAG 2.2 SC 1.4.11 (AA) and the project's "WCAG AA
  non-negotiable" rule; the spec records it as an accepted known failure (NFR-4). In dark theme accent 300 is also the
  `primary` hover background, so on a hovered, focused `primary` button the ring merges with the button (its outer edge
  still contrasts 9.14:1 with the canvas). Discarded: accent 500 (3.63:1 light, 4.82:1 dark, passes in both; the user
  preferred accent 300); a per-theme ring (accent 500 light, 300 dark: passes, but the user chose one value); a
  translucent ring (the painted colour shifts on every surface); per-component rings (one shared ring for consistency).
- **D3. The demo matrix data is built in the component class, not in the template.** Labels need action, variant and
  size; building them once in TypeScript keeps the template to bindings. Discarded: string concatenation in the
  template (logic in markup) and repeating one label per state (not "its own" label).
- **D4. The matrix is generated with `@for` inside `@defer (on viewport)` with a stable-id container**, as in 002.
  Discarded: 36 hand-written lines and rendering it eagerly.
- **D5. Looks are tested through classes; colours, rings, sizes and motion in the browser.** jsdom does not apply
  component styles or `theme.scss` reliably. Discarded: `getComputedStyle` assertions in Vitest.

## Test strategy (Vitest and TestBed, jsdom)

Run with `pnpm nx run smooth-ui:test`. Inputs via `fixture.componentRef.setInput()`, then `await fixture.whenStable()`.
Existing tests "should create", "exposes the label as accessible name" and "disables the native button…" stay.

Updated test: "falls back to the icon name when no label is given" becomes "never uses the icon name as accessible name":
icon `check`, no `label` → the button has no `aria-label` attribute (and it is not `check`).

New tests in `sui-icon-button.component.spec.ts`:

- **FR-1**: a fresh fixture with no `icon` throws on `detectChanges()` (`NG0950`); `icon` `""` renders the `<svg>`.
- **FR-2**: one click emits one `trigger` with `undefined`; dispatched keydown/keyup Enter and Space emit nothing by
  themselves (no own key handling); the button's `type` is `button`. An in-spec host with a form, an input and the icon
  button: a click fires no submit event and leaves an edited input value unchanged (no reset).
- **FR-3**: with `disabled`, the native button is disabled, a click emits nothing, `sui-icon-button-disabled` is present
  (also with `selected`, both classes), and `focus()` does not make it `document.activeElement`.
- **FR-4**: `label` `" Close "` → `aria-label` `" Close "`; `label` `"   "` → no `aria-label`; the `<svg>` has
  `aria-hidden="true"`; the button's text content is empty (NFR-2).
- **FR-5**: default `sui-icon-button-ghost`; `outline` and `primary` classes.
- **FR-6**: defaults `sui-icon-button-md` and `sui-icon-button-rounded`; `sm`/`lg` and `flat`/`pill` classes; the
  `<svg>` width is 16/20/24 for `sm`/`md`/`lg`; `setInput('iconSize', 32)` throws (`NG0303`).
- **FR-7**: `selected` → `sui-icon-button-selected` and no `aria-pressed`.
- **FR-8**: `state` `focus` → `sui-icon-button-focus`, kept with `disabled`.
- **FR-9**: `badge` 5, -1 and 1.5 show "5", "-1" and "1.5" in `.badge`; 0, `NaN` and unset show no `.badge`.
- **FR-10**: with `badge` 3 and `label` "Show notifications", the `.badge` is not inside the `<button>`, `aria-label`
  stays "Show notifications", and a click on the `.badge` emits no `trigger`.

## Left for validation (browser, Chrome DevTools MCP)

- **FR-1 and FR-6 at build time**: a temporary `<sui-icon-button />` and one with `[iconSize]="20"` in the demo make
  `pnpm nx run smooth-ui-demo:build` fail; a temporary `SuiIconButton` literal with `iconSize` in `app.component.ts`
  fails `pnpm nx run smooth-ui-demo:typecheck`. All removed afterwards.
- **FR-2, FR-3**: real Enter and Space give one `trigger`; disabled look and not-allowed cursor at rest and on hover.
- **FR-4**: in the accessibility tree every demo icon button exposes its `label` and no icon name.
- **Deferred matrix**: scroll `#icon-button-matrix` into view and wait for the 36 matrix buttons (placeholder and
  loading texts gone) before any check.
- **FR-5 to FR-9**: looks on hover and press, sizes, radii, badge placement, keyboard ring and `state` `focus` ring.
  **FR-8, NFR-4 ring**: the computed `box-shadow` colour is rgb(166, 178, 252) in both themes; the measured contrast
  against the canvas is at least 3:1 in dark (9.14) and, in light, is recorded as the accepted known failure (1.92,
  not a pass). Also glance at the rings of `sui-button`, the
  split menu, `sui-link`, `sui-text-field` and `sui-textarea` (side effect, no FR). **NFR-3**: with reduced motion
  emulated, transitions are `0s`.
- **NFR-4**: confirm `getComputedStyle(document.body).backgroundColor` is the canvas colour, load axe from a CDN (no
  package added) and run it on the icon-button section (shape row and matrix) with `wcag2a`, `wcag2aa`, `wcag21a`,
  `wcag21aa`, `wcag22aa`: zero violations, then again in dark theme. Icon and badge contrast per state as in the spec,
  with its single exception; press states are checked manually by the owner.
- **375 px**: at a 375 px viewport, `document.documentElement.scrollWidth` stays 444 (not wider).
- **NFR-1, NFR-2**: no `package.json` changed; no new string in the library.
- Full checks: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck`; the demo build adds no new
  `anyComponentStyle` warning.

## FR coverage

FR-1 test + build check · FR-2 to FR-4 tests + browser · FR-5 to FR-7 class tests + browser · FR-6 also build and
typecheck checks · FR-8 D2 + class test + browser · FR-9, FR-10 tests + browser · NFR-1, NFR-2 checks · NFR-3 browser ·
NFR-4 D2 + demo + axe in both themes and contrast checks.

## Release note (for `MEMORY.md` and the release)

Breaking: `sui-icon-button` no longer uses the icon name as accessible name (pass a non-blank `label`); `iconSize` is
removed from `sui-icon-button` and from `SuiIconButton`; `--sui-focus-ring` is now opaque accent 300 in both themes,
which changes every focus ring (`sui-button`, split, link, text field, textarea, icon button), unlike spec 002, which
kept rings as they were. Known issue: the light-theme ring is 1.92:1 against the canvas, below the 3:1 of WCAG 2.2
SC 1.4.11 (AA). The danger ring is unchanged.

## Risks

- Consumers with icon-only buttons and no `label` (or groups with blank `label`/`name`) become unnamed, silently.
- If `[aria-label]` with `null` leaves an attribute in jsdom or the browser, the FR-4 tests fail; fallback is returning
  `null` through `[attr.aria-label]`, a deviation from the project's ARIA binding rule to be raised before applying.
- D2 is visible everywhere: the ring turns from a translucent halo into an opaque pale accent band; next to the accent
  border of a focused text field or textarea it reads as a thicker outline. Accepted by the spec; needs the release note.
- D2 leaves every light-theme ring below 3:1 (1.92:1 on the canvas): a WCAG AA failure that axe will not report, so V7
  can pass while the library does not conform. Accepted by the user; recorded in the spec and the release note.
- axe run before the deferred block loads checks only the placeholder and passes falsely (guarded above); axe skips
  disabled controls and does not check rings or hover/press, which are measured by hand.
- The badge sticks out 12 px right and 10 px up; the row gap (16 px) and container padding absorb it at 375 px.
