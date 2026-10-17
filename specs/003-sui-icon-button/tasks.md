# Tasks 003 — sui-icon-button

Status: approved (2026-10-17, re-approved after the ring change to accent 300)

Plan: `specs/003-sui-icon-button/plan.md` (re-approved 2026-10-17, D2: opaque accent 300 ring in both themes, user's
decision, replacing accent 500). One task at a time: tests first (write the failing test, then the change; tests that record existing
behaviour may pass at once), then `pnpm nx run smooth-ui:test` green, mark the task and stop. Paths are relative to
`libs/smooth-ui/src/` unless they start with `apps/` or `libs/`. No new files, no new token, helper, string or
`public-api.ts` change. The user's working-tree changes (demo `(trigger)` on the reactive-form submit, split `name`
required, `sui-button.component.scss`) are kept. The implementer reports the exact output of every command it runs;
the coordinator checks each task's result against the real files before marking it.

- [x] **T1. Baseline, then drop `iconSize` from the component and `SuiIconButton`.** FR-6, edge case "No icon size"
  - First: run `pnpm nx format:check` on the untouched tree and report its exit code (expected 0).
  - Files: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`,
    `lib/interfaces/sui-icon-button.interface.ts`.
  - Test first (red): `fixture.componentRef.setInput('iconSize', 32)` throws (`NG0303`).
  - Code: delete the `iconSize` input (line 19) and `iconSize?: number` from `SuiIconButton`; nothing else changes.
  - Done when: the new test passes, `grep -rn iconSize` finds no match in
    `libs/smooth-ui/src/lib/components/sui-icon-button/`
    or the interface, `pnpm nx typecheck smooth-ui` and `pnpm nx run smooth-ui:test` are green.

- [x] **T2. FR-4 accessible name: non-blank `label` as given, else none (D1).** FR-4, NFR-2
  - Files: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`, `sui-icon-button.component.ts`.
  - Tests first (red where new): the test "falls back to the icon name when no label is given" becomes "never uses the
    icon name as accessible name": icon `check`, no `label` → `button.hasAttribute('aria-label') === false`; `label`
    `"   "` → `hasAttribute('aria-label') === false`; `label` `" Close "` → `aria-label` `" Close "`; the `<svg>` has
    `aria-hidden="true"` and `focusable="false"`; the button's `textContent.trim()` is `""` (NFR-2). "exposes the
    label
    as accessible name" stays.
  - Code: one line,
    `protected readonly accessibleName: Signal<string | null> = computed(() => (this.label().trim() ? this.label() : null));`.
    The template keeps `[aria-label]` (project rule).
  - If `hasAttribute('aria-label')` is still `true` with `null`: stop and report it to the coordinator; switching to
    `[attr.aria-label]` deviates from the project's ARIA binding rule and needs the user's approval first.
  - Done when: the updated and new tests pass, the `.ts` diff is that one line, no other existing test changed, and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T3. Tests for the required icon and activation.** FR-1, FR-2
  - Files: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: a fresh `TestBed.createComponent` with no `icon` throws on `fixture.detectChanges()` (`NG0950`); `icon`
    `""`
    renders the `<svg>`; one click emits one `trigger` with `undefined`; dispatched keydown/keyup Enter and Space emit
    nothing by themselves; `button.type` is `button`; an in-spec host component (form, text input, icon button): after
    editing the input, a click on the icon button fires no `submit` event and leaves the input value unchanged.
  - Done when: the tests pass with no library code change and `pnpm nx run smooth-ui:test` is green.

- [x] **T4. Tests for disabled, looks, sizes, shapes, selected and focus state.** FR-3, FR-5, FR-6, FR-7, FR-8
  - Files: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: `disabled` → native `disabled`, a click emits nothing, `sui-icon-button-disabled` present (also together
    with
    `selected`: both classes), `button.focus()` does not make it `document.activeElement`; default
    `sui-icon-button-ghost`, `outline` and `primary` classes; defaults `sui-icon-button-md` and
    `sui-icon-button-rounded`,
    `sm`/`lg` and `flat`/`pill` classes; `<svg>` `width` 16/20/24 for `sm`/`md`/`lg`; `selected` →
    `sui-icon-button-selected` and no `aria-pressed`; `state` `focus` → `sui-icon-button-focus`, kept with `disabled`.
  - Done when: the tests pass with no library code change and `pnpm nx run smooth-ui:test` is green.

- [x] **T5. Tests for the badge.** FR-9, FR-10, NFR-2
  - Files: `lib/components/sui-icon-button/sui-icon-button.component.spec.ts`.
  - Tests: `badge` 5, -1 and 1.5 show "5", "-1" and "1.5" in `.badge`; 0, `NaN` and unset show no `.badge`; with
    `badge` 3 and `label` "Show notifications": `.badge` is not inside the `<button>`, `aria-label` stays "Show
    notifications", and a click on `.badge` emits no `trigger`.
  - Done when: the tests pass with no library code change and `pnpm nx run smooth-ui:test` is green.

- [x] **T6. Shared focus ring: opaque accent 300 in both themes (D2).** FR-8, NFR-4
  - Files: `libs/smooth-ui/theme/theme.scss`.
  - Code: line 227 (light block) and line 296 (dark block) become
    `--sui-focus-ring: 0 0 0 3px var(--sui-accent-300);`. `--sui-focus-ring-danger` (lines 228, 297) and every other
    token stay. No unit test (D5: no spec asserts tokens or computed colours; the ring is checked in V5).
  - Done when: the diff of `theme.scss` is exactly those two lines, `pnpm nx run smooth-ui:build` passes,
    `pnpm nx format:check` is clean and `pnpm nx run smooth-ui:test` is green.

- [x] **T7. Demo: labelled shape row and deferred 36-button matrix (D3, D4).** NFR-4, completion criteria 3, 4
  - Files: `apps/smooth-ui-demo/src/app/app.component.ts`, `apps/smooth-ui-demo/src/app/app.component.html`.
  - Code (TS): add `SUI_ICON_BUTTON_VARIANT` to the import; local interfaces `DemoIconButtonState` (`id`, `action`,
    `icon`, `selected`, `disabled`, `state: SUI_STATE`, `badge`), `DemoIconButton` (the same plus unique `id` and
    `label`), a row (`id`, `size`, `buttons`) and a variant group (`variant`, `rows`); `protected readonly` fields
    `iconButtonVariants: SUI_ICON_BUTTON_VARIANT[]` (`ghost`, `outline`, `primary`),
    `iconButtonStates: DemoIconButtonState[]` (`selected` `star` "Add to favourites", `disabled` `trash` "Delete",
    `state` `focus` `settings` "Open settings", badge 3 `bell` "Show notifications") and
    `iconButtonMatrix: DemoIconButtonVariantGroup[]` built once by a module-level pure function from those lists and
    the existing `buttonSizes`; each `label` is action
    plus variant and size, e.g. "Delete (outline, lg)".
  - Code (HTML): replace lines 71-85 with an eager `.row` of three `outline` `md` `edit` buttons, `shape`
    `flat`/`rounded`/`pill`, labelled "Edit (flat)", "Edit (rounded)", "Edit (pill)"; then
    `<div id="icon-button-matrix">` around `@defer (on viewport)` with `@for` per group (`track group.variant`, an
    `<h2>`), per row (`track row.id`, one `.row`) and per button (`track button.id`) binding `badge`, `disabled`,
    `icon`,
    `label`, `selected`, `size`, `state`, `variant`; `@placeholder` `<p>Icon button matrix</p>`, `@loading`
    `<p>Loading icon button matrix…</p>`. No rule added to `app.component.scss`; theme toggle and groups untouched.
  - Done when: `pnpm nx run smooth-ui-demo:build` passes with no new `anyComponentStyle` warning (the
    `sui-button.component.scss` 4.35 kB warning predates 003), `pnpm nx run smooth-ui-demo:typecheck` passes, the
    template has 3 + 1 `sui-icon-button` tags in the section and none without a `label` binding, no `iconSize` in
    `apps/`, and `pnpm nx run smooth-ui:test` is green.

- [x] **T8. FR-1 and FR-6 build-time checks with temporary markup (V1).** FR-1, FR-6
  - Files (temporary, reverted in this task): `apps/smooth-ui-demo/src/app/app.component.html`,
    `apps/smooth-ui-demo/src/app/app.component.ts`.
  - Steps, one at a time, reverting each before the next: add `<sui-icon-button label="Tmp" />` →
    `pnpm nx run smooth-ui-demo:build` fails on the missing required `icon`; add
    `<sui-icon-button icon="sun" label="Tmp" [iconSize]="20" />` → the build fails (`NG8002`); add a
    `const tmp: SuiIconButton = { ..., iconSize: 20 }` literal
    in `app.component.ts` → `pnpm nx run smooth-ui-demo:typecheck` fails (excess property). Report each error code.
  - Done when: the three failures are reported with their output, the files are byte-identical to their T7 state (no
    `Tmp`, `iconSize` or `SuiIconButton` literal left), `pnpm nx run smooth-ui-demo:build` passes again and
    `pnpm nx run smooth-ui:test` is green.

- [x] **T9. Browser validation (V2-V8 below).** FR-2 to FR-10, NFR-3, NFR-4, completion criteria 3-5
  - Files: none (served demo, `pnpm nx run smooth-ui-demo:serve`, Chrome DevTools MCP).
  - Done when: V2-V8 are checked or reported as failing with the measured values, in light and dark theme where
    stated;
    press (`:active`) and any hover the MCP cannot force are listed for the owner's manual check.
  - Owner's manual check (press is not measurable with the MCP; hover was measured): in both themes, press and hold
    each md matrix button of each variant: `ghost`/`outline` muted background, `primary` solid-active, icon readable;
    selected (star) keeps its look on a pointer press, and on Space the selected `primary` one shows the accepted
    exception (1.85:1 light, 1.34:1 dark); a disabled (trash) press changes nothing.
    Result: done by the owner, 2026-10-17, OK.

- [x] **T10. Full verification, release note and memory.** NFR-1, NFR-2, all FRs
  - Files: `MEMORY.md` (no code).
  - Done when: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` passes (exact output reported),
    no `package.json` changed, no new string in the library, and `MEMORY.md` records the result and the release note:
    breaking, `sui-icon-button` no longer uses the icon name as accessible name (pass a non-blank `label`); `iconSize`
    removed from `sui-icon-button` and `SuiIconButton`; `--sui-focus-ring` is now opaque accent 300 in both themes,
    changing every focus ring (`sui-button`, split, link, text field, textarea, icon button), unlike spec 002, which
    kept rings; the danger ring is unchanged. Known issues: the light ring is 1.92:1 against the canvas, below WCAG 2.2
    SC 1.4.11 (AA, 3:1); in dark theme the ring merges (1:1) with the `primary` hover background.

## Validation checklist (V1 in T8, V2-V8 in T9)

- [x] V1. FR-1, FR-6: missing `icon` and bound `[iconSize]` fail the demo build; a `SuiIconButton` literal with
      `iconSize` fails the demo typecheck; all temporary code removed.
- [x] V2. Deferred matrix loaded: scroll `#icon-button-matrix` into view and wait until it holds 36 `sui-icon-button`
      and the placeholder and loading texts are gone. Required before V3-V7, and again after any reload or theme switch
      that reloads the page.
- [x] V3. FR-2, FR-3: on a matrix button, subscribe through `ng.getComponent(host).trigger` in the dev console (user's
      decision 2026-10-17: console check only, no spec or demo change); real Enter and Space give one `trigger` each;
      disabled buttons are skipped by Tab and show the disabled look and not-allowed cursor at rest (hover by the owner
      if the MCP cannot force it).
- [x] V4. FR-4, FR-10: in the accessibility tree, the 3 shape and 36 matrix buttons expose their own `label` and no icon
      name; the badge "3" is separate text outside the button's name.
- [x] V5. FR-5 to FR-9 and the ring (D2): looks, sizes (32/40/48 px), radii and badge placement per the spec. Focus by
      keyboard and read the computed `box-shadow`: an icon button with `:focus-visible` and one with `state` `focus`
      show rgb (166, 178, 252) in both themes. In dark, check its contrast against the canvas is at least 3:1 (9.14:1);
      in light, record the measured value (1.92:1) as the accepted known failure, not as a pass. Repeat the colour
      reading on `sui-button` (non-danger), `sui-link`, `sui-text-field` and `sui-textarea`; the `danger` button ring is
      unchanged; glance at the split menu items. Observe, as a known trade-off and not a failure to fix, that in dark
      theme the ring merges (1:1) with the `primary` hover background.
      Result (2026-10-17): every ring rgb (166, 178, 252); dark 9.14:1 on the canvas (pass); light 1.92:1 on the
      canvas, 2.02:1 on white (accepted known failure, not a pass); danger ring unchanged; dark merge 1:1 observed.
- [x] V6. NFR-3: with `prefers-reduced-motion: reduce` emulated, an icon button's computed `transition-duration` is
      `0s`.
- [x] V7. NFR-4: confirm `getComputedStyle(document.body).backgroundColor` is rgb (248, 249, 251) light and rgb (16, 20, 27) dark; inject `axe-core` 4.10.2 from cdnjs (no package added) and run it on the icon-button section (the `.col`
      holding the shape row and `#icon-button-matrix`) with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`:
      zero violations in light, then in dark theme (V2 first each time). Sample icon contrast (3:1, ghost against the
      canvas) and badge text (4.5:1) per variant; the selected `primary` Space-press exception and all press looks are
      checked manually by the owner. axe does not measure focus-ring contrast, so the light ring (1.92:1, V5) is not
      caught by it; list it as a known exception next to the selected `primary` Space-press one.
- [x] V8. 375 px: at a 375 px viewport, `document.documentElement.scrollWidth` is not above 444.
