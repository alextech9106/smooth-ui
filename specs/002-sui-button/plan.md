# Plan 002 — sui-button

Status: approved (2026-10-16, D6-D8; the owner accepts that `danger` press stays lighter than hover)

Spec: `specs/002-sui-button/spec.md` (approved 2026-10-16, FR-5 name `label().trim() ? label() : name()`; re-approved
2026-10-16 with the light-theme contrast change). The previous revision of this plan was approved 2026-10-16 with D1 and
is implemented (T1-T8); this revision adds D6-D8 for the NFR-4 contrast failure found in V7. The six open questions are
left for later, so this plan changes only what the FRs and NFRs already state: the FR-5 name (no icon as name,
whitespace-only `label` falls back), the removal of `SuiButton.iconSize` (breaking), the missing tests, the expanded
demo and, for NFR-4, five light-theme tokens plus a demo page background. Component looks and styles (`.scss`) are not
changed. The user's working-tree changes are the starting point and are kept:
the split's `name` is `input.required<string>()`, the demo's reactive-form submit button uses `(trigger)` (line 192),
and the current `sui-button.component.scss`.

## Files and responsibilities

No new files. `public-api.ts` is not changed.

Modified:

- `sui-button.component.ts` — one line: `accessibleName` becomes
  `protected readonly accessibleName: Signal<string> = computed(() => (this.label().trim() ? this.label() : this.name()));`
  (explicit type kept, as in the rest of the file). Nothing else changes. FR-4, FR-5.
- `interfaces/sui-button.interface.ts` — drops `iconSize?: number` (breaking). Edge case "No icon size".
- `sui-button.component.spec.ts` — the test expecting the icon id as the name is updated and the new tests added.
- `sui-button-split.component.spec.ts` — FR-1 (created programmatically without `name`) and FR-5 (blank `name`).
- `sui-button-group.component.spec.ts` — FR-5 for text entries.
- `apps/smooth-ui-demo/src/app/app.component.ts` — typed lists for the demo matrix. Completion criterion 4.
- `apps/smooth-ui-demo/src/app/app.component.html` — the deferred matrix and the new examples. Completion criterion 4.
- `libs/smooth-ui/theme/theme.scss` — five lines in the `:root, [data-theme='light']` block (D6). NFR-4.
- `apps/smooth-ui-demo/src/styles.scss` — gains `html, body { background-color: var(--sui-color-bg-canvas); }` after
  the existing `@use` of the theme (D7). NFR-4, completion criterion 5.
- `apps/smooth-ui-demo/project.json` — the build `styles` entry changes from `["./libs/smooth-ui/theme/theme.scss"]`
  to `["apps/smooth-ui-demo/src/styles.scss"]`, which already `@use`s the theme; today `styles.scss` is not in the
  build at all, so without this line D7 has no effect (D7, config change approved by the owner 2026-10-16).

Read, not changed:

- `sui-button.component.html` — the `[aria-label]` binding stays as today (see D1). FR-4, FR-5, FR-6.
- `sui-button.component.scss` — every look, size, shape, indicator and reduced-motion rule. FR-3, FR-4, FR-7 to FR-10,
  NFR-3. The disabled class depends on `disabled` only, so loading keeps the variant, `selected` and `focus` looks.
- `sui-button-split.component.ts/html` — `name` already required (FR-1); its entries feed the group, so FR-5 reaches
  the split with no code change (main entry: `name`; icon mode: `name` as `label`; menu part: `""` + "More options").
- `sui-button-group.component.ts/html` — passes `name` and `label ?? ''` to each `sui-button`; FR-5 reaches text
  entries with no code change. Icon entries render `sui-icon-button` and are unaffected.
- `interfaces/sui-icon-button.interface.ts` — keeps its own `iconSize` (`sui-icon-button` is out of scope).
- `sui-button.component.scss` (again, for D6) — `primary` uses `accent-solid`/`-hover`/`-active` at rest/hover/press;
  `danger` uses `danger-solid` at rest, `danger-solid-hover` on hover and `danger-solid` again on `:active` (line 129),
  confirming the spec's accepted consequence: light press (`danger-600`) is lighter than hover (`danger-700`). The
  `outline` hover border also uses `accent-solid`, so it becomes one step darker in light (non-text, no FR affected).
- `sui-icon-button`, `sui-button-group`, `sui-text-field`, `sui-textarea` `.scss` — 9 uses of the reassigned tokens
  (icon-button 4, text-field 2, textarea 2, group 1); not changed, not reviewed (spec, out of scope).

## Public API

- Selector `sui-button`. Inputs unchanged: `name` (required, FR-1), `icon`, `label`, `expanded` (`boolean | undefined`,
  FR-6), `shape` (`rounded`), `size` (`md`), `state` (`default`), `type` (`button`), `variant` (`primary`), and the
  boolean-attribute inputs `disabled`, `fullWidth`, `iconEnd`, `loading`, `selected`.
- Output `trigger: void` (FR-2), the only supported way to react to activation; no `stopPropagation`.
- Exported type `SuiButton` loses `iconSize` (breaking; release note in `MEMORY.md` "Next steps").
- Behaviour change (breaking): an icon no longer names the button; a whitespace-only `label` no longer becomes the
  name. Nothing is checked or reported at runtime (FR-5).

## State and what derives from it

All derived with `computed()`; no `effect()`, no lifecycle hooks, no new writable state.

- `accessibleName: Signal<string>` — `label()` as given (untrimmed) if `label().trim()` is not empty, else `name()`;
  never `icon()`. FR-4 (kept while loading), FR-5.
- Unchanged: `showIconStart`, `showIconEnd`, `computedIconSize` (16/20/24), `classes` (FR-3, FR-7, FR-8, FR-10).

## Where browser side effects live

None added. The component touches no browser global; the icon sprite stays in `SuiIconService` (spec 001).

## Template and accessibility

- Native `<button>` with `[type]` (FR-2) and `[disabled]="disabled() || loading()"`: unavailable and out of the focus
  order (FR-3, FR-4); keyboard activation comes from the native button, with no key handler of its own (FR-2).
- `[aria-label]` unchanged: `accessibleName()` when `label` is not `""`, while loading, or when `name` is `""`; else
  `null`, so the visible text is the native name. With the new computed this gives, per case: non-blank `label` →
  the `label`; whitespace-only `label` → the `name` (same as the visible text, FR-5); loading → the FR-5 name (FR-4);
  blank `label` and `name` `""` → an empty `aria-label`, a blank name, unreported (edge case "Accessible name").
- `[aria-busy]` while loading (FR-4), `[aria-expanded]` and `[aria-haspopup]="'menu'"` only when `expanded` is given
  (FR-6). No `aria-pressed` for `selected` (FR-7).
- Spinner `aria-hidden="true"` replaces icon and text while loading (FR-4); icons hidden through `sui-icon` (FR-9).
- `sui-spacing-8` only when `name` is `""`; a whitespace-only `name` keeps the text span and the normal padding (FR-9).

## Demo

- `app.component.ts` gains `buttonVariants: SUI_BUTTON_VARIANT[]` (6), `buttonSizes: SUI_SIZE[]` (3) and
  `buttonStates: DemoButtonState[]` (8: default, `selected`, `loading`, `disabled`, `state` `focus`,
  `selected`+`loading`, `focus`+`loading`, `disabled`+`loading`). `DemoButtonState` is a local interface
  `{ id; text; selected; loading; disabled; state: SUI_STATE }`; each `text` is non-blank (NFR-4).
- `app.component.html`: nested `@for` (variant `track variant`, size `track size`, state `track state.id`) renders
  6 × 3 × 8 = 144 buttons, one `.row` per variant and size under an `<h2>` per variant. The existing single-variant,
  single-state and size buttons (lines 21-29 and 35-38) are replaced by it; the icon, `iconEnd`, shape and `fullWidth`
  examples stay. New examples: a `label`-only button (`name=""`, icon, `label`), a `label` containing its text
  (`name="Save"`, `label="Save draft"`) and `expanded` `false` and `true`.
- The matrix sits inside `@defer (on viewport)` with an `@placeholder` (one element, a short text such as "Button
  matrix") and an `@loading` block (short text). The `@defer` block is wrapped in a container with a stable `id`
  (`button-matrix`) to scroll to: the container stays once the block loads, while the placeholder is replaced. The new
  examples stay outside the defer.
  `sui-button` is also used eagerly in the page, so the defer delays rendering only; no separate chunk is expected.
- Line 192 keeps `(trigger)`; no `(click)` on any `sui-button`.
- Budget: no new rule in `app.component.scss` (reuses `.row` and `.col`), so `anyComponentStyle` (4 kb warning) is not
  affected; template size does not count towards it.

## Decisions

- **D1. Keep today's `[aria-label]` binding.** The spec fixes the name, not how it is exposed, and the binding already
  yields the FR-5 name in every case; a whitespace-only `label` gives an `aria-label` equal to the visible text, which
  is redundant but correct. Discarded: always setting `aria-label` (redundant everywhere, a larger output change) and
  switching the condition to `label().trim()` (not required by the spec; a change for no FR).
- **D2. FR-5 is one computed, with no runtime check.** User's choice: no token, helpers, errors or `public-api.ts`
  change. Discarded: a development-mode failure (more code than the spec asks for).
- **D3. No code change in the split button or the group.** FR-5 reaches them through `sui-button`. Discarded: guarding
  names in the group (groups are out of scope except FR-1 and FR-5).
- **D4. The demo matrix is generated with `@for` from typed lists, inside `@defer (on viewport)`.** Keeps the first
  render light. Discarded: 144 hand-written lines and rendering the matrix eagerly.
- **D5. Looks are tested through classes; colours, sizes, rings and motion in the browser.** jsdom does not apply the
  component styles reliably. Discarded: `getComputedStyle` assertions in Vitest.
- **D6. Reassign the shared light-theme semantic tokens one step darker.** Owner's choice, light block only; on-solid
  text stays `--sui-neutral-0` (#ffffff); the dark block and both hand-written focus rings are untouched. Estimated
  WCAG contrast of white text (to be measured, D8):

  | Token (light)                     | Before                     | After                      | White text  |
  | --------------------------------- | -------------------------- | -------------------------- | ----------- |
  | `--sui-color-accent-solid`        | `--sui-accent-500` #6e76ee | `--sui-accent-600` #5a5fd8 | 3.82 → ~5.2 |
  | `--sui-color-accent-solid-hover`  | `--sui-accent-600` #5a5fd8 | `--sui-accent-700` #494cb0 | ~5.2 → ~7.1 |
  | `--sui-color-accent-solid-active` | `--sui-accent-700` #494cb0 | `--sui-accent-800` #3a3c8a | ~7.1 → ~9.6 |
  | `--sui-color-danger-solid`        | `--sui-danger-500` #de5265 | `--sui-danger-600` #c03c50 | 3.81 → ~5.2 |
  | `--sui-color-danger-solid-hover`  | `--sui-danger-600` #c03c50 | `--sui-danger-700` #9a2f3f | ~5.2 → ~7.4 |

  `danger` press reuses `--sui-color-danger-solid` (~5.2:1). Discarded: new button-only tokens (new public token names
  in a shipped asset, and AGENTS.md forbids renaming theme variables) and a `danger-solid-active` token (owner: no new
  token). Rationale for one step: it is the smallest change that clears 4.5:1 with margin.

- **D7. The demo paints the theme canvas on `html` and `body`.** `ThemeService` sets `data-theme` on `<html>`, and the
  light block also matches `:root`, so `--sui-color-bg-canvas` resolves on `html` and is inherited by `body` in both
  themes. The rule goes in the demo's global `styles.scss`, wired into the build by setting the `build.options.styles`
  of `apps/smooth-ui-demo/project.json` to `["apps/smooth-ui-demo/src/styles.scss"]` (workspace-relative with no
  leading `./`, like `browser` and `tsConfig`); the theme then reaches the build only through that file's `@use`, so it
  is not loaded twice. Gives axe the real page colour behind transparent buttons. Discarded: a page background in `theme.scss` (changes every
  consumer's page, not asked for), `app.component.scss` (`:host` cannot reach `html`/`body` without `::ng-deep` or
  disabling encapsulation) and an inline `<style>` in `index.html` (theme-aware styles outside the SCSS pipeline).
- **D8. Contrast is measured in the browser, not asserted in tests.** jsdom does not load `theme.scss` (D5). V7 runs
  axe in both themes and a per-state contrast check (rest, hover, press of `primary` and `danger`) against the values
  in D6. Discarded: unit tests that read token values (would test the stylesheet text, not rendered colours).

## Test strategy (Vitest and TestBed, jsdom)

Run with `pnpm nx run smooth-ui:test`. Inputs via `fixture.componentRef.setInput()`, then `await fixture.whenStable()`.
The other existing tests stay as they are (the `name` "Test" + `label` "More options" test is not affected).
D6-D7 add no unit test: no spec in `libs/smooth-ui/src` asserts token names, hex values or computed colours (searched
for `accent-solid`, `danger-solid`, hex values and `getComputedStyle`: no match), so none breaks; they are verified in
the browser (D8).

Updated test (`sui-button.component.spec.ts`, ~line 70):

- "uses the icon as accessible name when there is no text" becomes "never uses the icon as accessible name": `name`
  `""`, icon `check`, no label → `aria-label` is `""`, not `check`.

New tests in `sui-button.component.spec.ts`:

- **FR-1**: a fresh fixture with no `name` fails on `detectChanges()` (required input, `NG0950`).
- **FR-2**: one click emits one `trigger` with `undefined`; keydown/keyup Enter and Space emit nothing by themselves
  (no own key handling, so a real key press gives one emission). An in-spec host component with a form, an input and
  `type` `submit`/`reset`/default buttons: `submit` fires one form submit event (host prevents default) and one
  `trigger`; `reset` restores the input's initial value; the default type fires no submit event.
- **FR-3**: `disabled` alone and with `loading`: native `disabled`, no emission, `sui-button-disabled` present,
  `focus()` does not focus it.
- **FR-4**: spinner present and `aria-hidden`, no `sui-icon` and no text; `aria-busy="true"`; `aria-label` "Test";
  with `label` "Save draft" the `aria-label` stays "Save draft"; variant class kept, no `sui-button-disabled`; with
  `selected` or `state` `focus` their classes stay. Focus: focus the button, enter `loading`, `document.activeElement`
  is the button or `body`.
- **FR-5**: `label` used as written: `label` `" Save draft "` → `aria-label` `" Save draft "` (untrimmed); whitespace
  fallback: `name` "Save", `label` `"  "` → `aria-label` "Save"; no icon fallback: `name` `""`, icon `check`, `label`
  `"  "` → `aria-label` `""`; `name` `""` + icon + `label` "Save" → `aria-label` "Save"; a non-containing `label`
  ("Save"/"Store") renders with `aria-label` "Store" and no error (nothing reported).
- **FR-6**: unset → no `aria-expanded`/`aria-haspopup`; `false` and `true` → the value and `menu`.
- **FR-7**: default `sui-button-primary`; `variant` `danger` → `sui-button-danger`; `selected` → `sui-button-selected`
  and no `aria-pressed`.
- **FR-8**: defaults `sui-button-md` and `sui-button-rounded`; `lg`/`pill` classes; `fullWidth` →
  `sui-button-full-width`.
- **FR-9**: icon before the text, after it with `iconEnd`; icon width 16/20/24 for `sm`/`md`/`lg`; `name` `""` →
  `sui-spacing-8` and no text; whitespace `name` with `label` "Save" → text span kept, no `sui-spacing-8`.
- **FR-10**: `state` `focus` → `sui-button-focus`.

New tests elsewhere:

- `sui-button-split.component.spec.ts`: no `name` fails on `detectChanges()` (FR-1); `name` `"  "` renders with no
  error in default and icon mode (FR-5, unreported); existing tests keep passing with `name` "Save".
- `sui-button-group.component.spec.ts`: text entry `{ name: 'Bold', label: 'Italic' }` renders with `aria-label`
  "Italic" and no error; `{ name: '', icon: 'check', label: 'Bold' }` gets `aria-label` "Bold" (FR-5).

## Left for validation (browser, Chrome DevTools MCP)

- **FR-1 in markup**: a temporary `<sui-button />` and `<sui-button-split />` in the demo make
  `pnpm nx run smooth-ui-demo:build` fail; removed afterwards. **No icon size**: a temporary `SuiButton` literal with
  `iconSize` fails `pnpm nx typecheck smooth-ui`; removed afterwards.
- **FR-2**: real Enter and Space give one `trigger`; the reactive-form submit works through `(trigger)`.
- **FR-3, FR-4**: disabled look and cursor, loading look, pointer cursor, narrowing and focus after entering loading.
  Also observe (not a requirement) whether a raw click listener fires while unavailable (`MEMORY.md` pitfall).
- **FR-5**: in the accessibility tree, the `label`-only and `label`-containing demo buttons expose their `label`.
- **Deferred matrix**: before any matrix check, scroll the `#button-matrix` container into view and wait until the
  page holds the 144 matrix buttons (the placeholder and loading texts are gone). Repeat after a theme switch only if the page
  reloads.
- **FR-7, FR-8, FR-10**: hover/press looks, measured heights, padding and radii, keyboard focus ring and `state`
  `focus` ring, in light and dark theme. **NFR-3**: with reduced motion emulated, transitions are `0s` and the
  indicator turns every 2 s.
- **NFR-4**: in the served demo, with the deferred matrix loaded, load `axe-core` into the page session from a CDN
  (DevTools console or the MCP's script evaluation; no package added) and run it on the button section with the tags
  `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`; expect zero violations, then switch to dark theme and run
  again. Hover and press states are outside what axe checks; axe also skips contrast on disabled buttons (WCAG exempts
  inactive controls). Before running it, confirm `getComputedStyle(document.body).backgroundColor` is the canvas
  colour (#f8f9fb light, #10141b dark), else axe measures against an assumed white page (D7).
- **NFR-4 contrast per state (V7)**: in light theme, read the computed `background-color` and `color` of a `primary`
  and a `danger` button at rest and with `:hover` forced (DevTools "Force element state"); press (`:active`) is checked
  manually by the owner, as in V6. Expect #5a5fd8/#494cb0/#3a3c8a and #c03c50/#9a2f3f/#c03c50 with white text, each
  measured at 4.5:1 or more (D6 estimates about 5.2:1 minimum). In dark theme, check the same states reach 4.5:1 with
  the unchanged tokens. Also glance at icon-button, group, text-field and textarea in the demo (side effect, no FR).
- **NFR-1, NFR-2**: no `package.json` changed; no new string in the library.
- Full checks: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck`; the demo build shows no new
  `anyComponentStyle` warning (the existing `sui-button.component.scss` one stays pending).

## FR coverage

FR-1 tests + build check · FR-2 tests + browser · FR-3, FR-4 tests + browser · FR-5 tests + accessibility tree ·
FR-6 tests · FR-7 to FR-10 class tests + browser · NFR-1, NFR-2 checks · NFR-3 browser · NFR-4 D6 + D7 + browser
(axe in both themes and the per-state contrast check).

## Risks

- jsdom form submission and reset support is assumed; if missing, submit/reset move to browser validation.
- Breaking for consumers: icon-only names (in buttons and group entries) become blank, silently; release note needed.
- An empty `aria-label` on a button with blank `label` and `name` is allowed by the spec; axe would flag it, so the
  demo must not contain one (NFR-4 requires a non-blank name).
- axe run before the deferred block loads would check only the placeholder and pass falsely; the validation step above
  guards against it.
- D6 changes shared tokens in a shipped asset: `sui-icon-button` (solid/hover/press backgrounds, danger background),
  `sui-button-group` (divider) and the focus/error borders of `sui-text-field` and `sui-textarea` turn one step darker
  in light theme, for the demo and every consumer. Accepted by the spec, not reviewed; needs a release note.
- `anyComponentStyle` is not affected: it measures component `styleUrl` files only, and `theme.scss` and
  `styles.scss` are global styles (they count towards the `initial` budget, 500 kB warning, by a few bytes).
- `sui-button.component.scss` stays at 4.35 kB, over the 4 kB warning; it predates 002, D6 does not touch it, and it
  remains a pending item (the demo build keeps that one existing warning, and no new one).
- D7 depends on the `project.json` `styles` change; if the owner rejects it, the canvas rule has no effect and dark
  axe results stay invalid.
