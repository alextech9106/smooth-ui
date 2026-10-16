# Tasks 002 — sui-button

Status: approved (T1-T10 done 2026-10-16; V6 press checked manually by the owner)

Plan: `specs/002-sui-button/plan.md` (approved 2026-10-16, D1: `[aria-label]` binding kept; re-approved 2026-10-16
with D6-D8 for NFR-4 contrast). One task at a time: tests first (red where the behaviour is new; tests that record
existing behaviour may pass at once), then the code, `pnpm nx run smooth-ui:test` green, mark the task and stop. Paths
are relative to `libs/smooth-ui/src/` unless they start with `apps/` or `libs/`. No new files; no new token, helper,
error or `public-api.ts` change (T9 only reassigns five existing light-theme tokens).

- [x] **T1. Drop `iconSize` from the `SuiButton` interface (breaking).** Edge case "No icon size"
  - Files: `lib/interfaces/sui-button.interface.ts` (and any library use of `SuiButton.iconSize` found by typecheck).
  - Done when: `SuiButton` has no `iconSize`; `SuiIconButton` keeps its own; `pnpm nx typecheck smooth-ui` and
    `pnpm nx run smooth-ui:test` are green.

- [x] **T2. FR-5 accessible name: no icon, whitespace `label` falls back.** FR-5, NFR-2
  - Files: `lib/components/sui-button/sui-button.component.spec.ts`, `sui-button.component.ts`.
  - Tests first: `label` `" Save draft "` → `aria-label` `" Save draft "` (as written); `name` "Save" + `label` `"  "`
    → `aria-label` "Save"; `name` `""` + icon `check` + `label` `"  "` → `aria-label` `""` (no icon fallback); `name`
    `""` + icon + `label` "Save" → `aria-label` "Save"; `name` "Save" + `label` "Store" renders with `aria-label`
    "Store" and no error; the test at ~line 70 becomes "never uses the icon as accessible name" expecting
    `aria-label=""`.
  - Code: one line, `protected readonly accessibleName: Signal<string> = computed(() => (this.label().trim() ? this.label() : this.name()));`.
    The template is not changed (D1).
  - Done when: the new and updated tests pass, the diff of `sui-button.component.ts` is that one line, no other existing
    test changed, and `pnpm nx run smooth-ui:test` is green.

- [x] **T3. Tests for name, activation and menu state.** FR-1, FR-2, FR-6
  - Files: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: no `name` fails on `detectChanges()` (`NG0950`); one click gives one `trigger` with `undefined`; keydown/keyup
    Enter and Space emit nothing by themselves; in-spec host form: `submit` fires one submit (default prevented) and one
    `trigger`, `reset` restores the input, default type fires no submit; `expanded` unset → no `aria-expanded`/
    `aria-haspopup`, `false`/`true` → the value and `menu`.
  - Done when: the tests pass (if jsdom lacks submit/reset, those two move to V2 with a note) and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T4. Tests for disabled and loading.** FR-3, FR-4
  - Files: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: `disabled` alone and with `loading`: native `disabled`, no emission, `sui-button-disabled`, `focus()` does not
    focus it; `loading`: spinner `aria-hidden`, no `sui-icon` or text, `aria-busy="true"`, `aria-label` "Test" (and
    "Save draft" with that `label`), variant/`selected`/`focus` classes kept, no `sui-button-disabled`; focus the
    button, enter `loading`, `document.activeElement` is the button or `body`.
  - Done when: the tests pass and `pnpm nx run smooth-ui:test` is green.

- [x] **T5. Tests for looks, sizes, icons and focus state.** FR-7, FR-8, FR-9, FR-10
  - Files: `lib/components/sui-button/sui-button.component.spec.ts`.
  - Tests: default `sui-button-primary`, `danger` class, `selected` class with no `aria-pressed`; defaults
    `sui-button-md`/`sui-button-rounded`, `lg`/`pill`, `sui-button-full-width`; icon before text, after with `iconEnd`,
    width 16/20/24 per size; `name` `""` → `sui-spacing-8` and no text, whitespace `name` keeps the text span and no
    `sui-spacing-8`; `state` `focus` → `sui-button-focus`.
  - Done when: the tests pass and `pnpm nx run smooth-ui:test` is green.

- [x] **T6. Split and group tests: renders, nothing reported.** FR-1, FR-5
  - Files: `lib/components/sui-button-split/sui-button-split.component.spec.ts`,
    `lib/components/sui-button-group/sui-button-group.component.spec.ts`.
  - Tests: split without `name` fails on `detectChanges()`; split `name` `"  "` renders with no error in default and
    icon mode; group entry `{ name: 'Bold', label: 'Italic' }` renders with `aria-label` "Italic" and no error;
    `{ name: '', icon: 'check', label: 'Bold' }` gets `aria-label` "Bold"; existing tests keep passing.
  - Done when: the tests pass with no change to split or group code, and `pnpm nx run smooth-ui:test` is green.

- [x] **T7. Demo: deferred button matrix.** NFR-4, completion criterion 4
  - Files: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Code: typed `buttonVariants: SUI_BUTTON_VARIANT[]` (6), `buttonSizes: SUI_SIZE[]` (3),
    `buttonStates: DemoButtonState[]` (8, local interface, non-blank texts); nested `@for` with `track variant`, `track size`,
    `track state.id`, inside `@defer (on viewport)` with an `@placeholder` (one element) and an `@loading` block, the
    `@defer` wrapped in a container with a stable `id` (`button-matrix`); replaces lines 21-29 and 35-38; no new rule in
    `app.component.scss`.
  - Done when: `pnpm nx run smooth-ui-demo:build` passes with no new `anyComponentStyle` warning (the existing
    `sui-button.component.scss` 4.35 kB > 4 kB warning predates 002 and stays pending), the matrix yields 144 buttons
    once loaded, no `(click)` on any `sui-button`, and `pnpm nx run smooth-ui:test` is green.

- [x] **T8. Demo: name and menu examples.** FR-5, FR-6, completion criterion 4
  - Files: `apps/smooth-ui-demo/src/app/app.component.html`.
  - Code, outside the defer: a `label`-only button (`name=""`, icon, `label`), `name="Save"` with `label="Save draft"`,
    and `expanded` `false` and `true`; line 192 keeps `(trigger)`.
  - Done when: `pnpm nx run smooth-ui-demo:build` passes, no `sui-button` in the demo has both a blank `label` and a
    blank `name`, and `pnpm nx run smooth-ui:test` is green.

- [x] **T9. Light-theme solid tokens and demo canvas background.** NFR-4, completion criterion 5 (NFR-4 contrast)
  - Files: `libs/smooth-ui/theme/theme.scss`, `apps/smooth-ui-demo/src/styles.scss`,
    `apps/smooth-ui-demo/project.json`.
  - Code (D6), in the `:root, [data-theme='light']` block only: `--sui-color-accent-solid: var(--sui-accent-600);`,
    `--sui-color-accent-solid-hover: var(--sui-accent-700);`, `--sui-color-accent-solid-active: var(--sui-accent-800);`,
    `--sui-color-danger-solid: var(--sui-danger-600);`, `--sui-color-danger-solid-hover: var(--sui-danger-700);`. The
    `[data-theme='dark']` block, every `*-on-solid` token and both hand-written focus rings stay unchanged.
  - Code (D7): `html, body { background-color: var(--sui-color-bg-canvas); }` in `styles.scss`, after its existing
    `@use`; in `project.json`, `build.options.styles` goes from `["./libs/smooth-ui/theme/theme.scss"]` to
    `["apps/smooth-ui-demo/src/styles.scss"]`. No unit test (D8): no spec asserts tokens or computed colours.
  - Done when: the diff touches only those five token lines, that one rule and that one `styles` entry;
    `pnpm nx run smooth-ui:test` is green; `pnpm nx run smooth-ui-demo:build` passes with no new warning (the existing
    `sui-button.component.scss` `anyComponentStyle` warning stays); `pnpm nx format:check` is clean; and in the served
    demo `getComputedStyle(document.body).backgroundColor` is `rgb(248, 249, 251)` (#f8f9fb) in light and
    `rgb(16, 20, 27)` (#10141b) in dark theme.

- [x] **T10. Full verification and memory (re-run after T9).** NFR-1, NFR-2, NFR-3, NFR-4, all FRs
  - Files: `MEMORY.md` (no code).
  - Done when: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` passes, no `package.json`
    changed, no new string in the library, V6 and V7 below are checked (or reported as failing; V1-V5 stay as checked),
    and `MEMORY.md` records the result, the breaking changes and the darker light `primary`/`danger` colours (also in
    icon-button, button-group, text-field and textarea) for the release notes.

## Validation checklist (browser, Chrome DevTools MCP, run in T10)

- [x] V1. FR-1 and no icon size: a temporary `<sui-button />` and `<sui-button-split />` make
      `pnpm nx run smooth-ui-demo:build` fail; a temporary `SuiButton` literal with `iconSize` fails
      `pnpm nx typecheck smooth-ui`; both removed afterwards.
- [x] V2. FR-2: real Enter and Space give one `trigger`; the reactive-form submit works through `(trigger)`.
- [x] V3. FR-3, FR-4: disabled look and not-allowed cursor; loading look, pointer cursor, narrowing and focus after
      entering loading; note whether a raw click listener fires while unavailable.
- [x] V4. FR-5: in the accessibility tree, the `label`-only and `label`-containing demo buttons expose their `label`.
- [x] V5. Deferred matrix loaded: scroll the `#button-matrix` container into view and wait until 144 matrix buttons
      are present and the placeholder and loading texts are gone. Required before V6 and V7.
- [x] V6. FR-7, FR-8, FR-10 and NFR-3: hover looks, heights, padding, radii, keyboard and `state` `focus` rings in
      light and dark theme; with reduced motion emulated, transitions are `0s` and the indicator turns every 2 s. Press
      (`:active`) looks are checked manually by the owner (the MCP cannot hold `:active`).
- [x] V7. NFR-4: with the matrix loaded (V5), first confirm `getComputedStyle(document.body).backgroundColor` is the
      canvas colour (#f8f9fb light, #10141b dark); inject `axe-core` from a CDN (no package added) and run it on the
      button section with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`: zero violations; switch to dark theme
      (repeat V5 if the page reloaded) and run again: zero violations. Then, per theme, read the computed
      `background-color` and `color` of one `primary` and one `danger` button at rest and with `:hover` forced:
  - light: `primary` #5a5fd8 / #494cb0, `danger` #c03c50 / #9a2f3f, white text, each 4.5:1 or more;
  - dark: the unchanged tokens with their `*-on-solid` text, each 4.5:1 or more;
  - press (`:active`, light expected #3a3c8a and #c03c50) is checked manually by the owner, as in V6;
  - glance at icon-button, button-group, text-field and textarea (side effect, no FR).
