# Plan 001 — sui-icon

Spec: `specs/001-sui-icon/spec.md` (approved). The spec records today's behaviour and proposes no change to it, so this
plan changes no production code. The only work is the missing tests and the checks left for validation.

## Files and responsibilities

Modified:

- `libs/smooth-ui/src/lib/components/sui-icon/sui-icon.component.spec.ts` — gains the tests for FR-2 to FR-10. It is
  the only file this plan changes.

Read, not changed:

- `sui-icon.component.ts` — declares the two inputs and asks the service for the drawings when it is created. FR-1,
  FR-4, FR-9.
- `sui-icon.component.html` — the icon element: size, reference to the drawing, hidden from assistive technology.
  FR-2, FR-3, FR-5, FR-7, FR-8.
- `sui-icon.component.scss` — centres the drawing area. FR-5.
- `sui-icon.service.ts` — adds the copy of the drawings to the page, once per application and only in a browser. FR-9,
  FR-10.
- `constants/sui-icon.ts` — the 79 drawings; each one takes its colour from the surrounding text. FR-2, FR-6.

## Public API

Unchanged. `public-api.ts` exports `SuiIconComponent` only; the service and the drawings stay internal.

- Selector `sui-icon`.
- Input `name: string`, required. FR-1, FR-2, FR-3.
- Input `size: number`, default `20`. FR-4, FR-5.
- No outputs and no exported types.

## State and what derives from it

- The component holds no state of its own: the template reads `name()` and `size()` directly, so a change to either
  input reaches the page without any derived value. FR-8.
- The service holds one flag, "drawings already added". There is one service instance per application, which is what
  makes the copy "one per application". FR-9.

## Where browser side effects live

Only in `SuiIconService.ensureSpriteInjected()` (constitution, principle 3). It does nothing outside a browser (FR-10)
and nothing the second time it is called (FR-9); otherwise it puts the drawings at the start of the page body. The
component touches no browser global.

## Template and accessibility

- The drawing area is an `svg` whose `width` and `height` are the size (FR-4, FR-5), inside a wrapper that centres it
  (FR-5).
- The `svg` points at the drawing with a reference built from the name (FR-2). A name with no drawing leaves the area
  empty, and a name that is the identifier of another page element points at that element (FR-3).
- `aria-hidden="true"` and `focusable="false"` on the `svg`, and no `tabindex` anywhere (FR-7).

## Decisions

- **D1. No production code changes.** Discarded: fixing what the review found (free-text names, identifier clashes). The
  spec puts all of it out of scope.
- **D2. All new tests go in the existing component spec file.** Discarded: a separate spec file for the service. FR-9
  and FR-10 can be observed through the component, and `AGENTS.md` asks before adding files.
- **D3. Tests look at the page, not at the service.** The copy of the drawings is counted in `document.body`. Discarded:
  reading the service's private flag, which tests the implementation instead of the behaviour.
- **D4. Each test starts from a page with no copy of the drawings.** One `TestBed` is one application, and all tests in
  the file share one page, so copies left by earlier tests are removed before each test. Discarded: counting the
  difference before and after, which is harder to read.
- **D5. "Outside a browser" is simulated by providing `PLATFORM_ID` as `'server'`.** Discarded: a real server render,
  which needs tooling that is not installed (constitution, principles 1 and 4).
- **D6. "Writes nothing to the console" is checked with spies on `console.error`, `console.warn` and `console.log`.**
  Discarded: leaving FR-3's silence unverified.
- **D7. The 79 names are not copied into a test.** They are compared with the spec during validation. Discarded: a test
  holding a third copy of the list.

## Test strategy (Vitest and TestBed)

Run with `pnpm nx run smooth-ui:test`. Each test sets inputs with `fixture.componentRef.setInput()` and waits with
`await fixture.whenStable()`.

- **FR-2**: with name `check`, the `svg` points at `#check`, and the page holds a drawing with that identifier.
- **FR-3**: with a name outside the set, creating the icon does not throw, the three console spies are not called, the
  `svg` keeps the requested size, and the page holds no element with that identifier. Repeated for `""`, `Check` and
  `" check"` (edge case).
- **FR-4**: with no size, `width` and `height` are `20`.
- **FR-5**: with size `32`, `width` and `height` are `32`.
- **FR-6**: the drawing that `check` points at takes its colour from the surrounding text (`currentColor`).
- **FR-7**: `aria-hidden` and `focusable` (already tested), plus no `tabindex` on the icon or inside it.
- **FR-8**: changing the name changes the reference; changing the size changes `width` and `height`.
- **FR-9**: one icon adds exactly one copy; a second icon in the same application adds none; destroying an icon removes
  none. A second application adds a second copy (edge case "Copies of the drawings").
- **FR-10**: with `PLATFORM_ID` set to `'server'`, creating the icon does not throw and the page holds no copy.

## Left for validation

Checked once, in `/sdd-validate`, with the Chrome DevTools MCP on the demo application or by building:

- **FR-1**: a `sui-icon` without a name in a demo template makes `pnpm nx run smooth-ui-demo:build` fail. The line is
  removed afterwards.
- **FR-2, FR-5, FR-6**: an icon is seen; its measured box is N by N px and centred; its colour equals the colour of the
  text beside it, in the light and dark themes.
- **NFR-1**: no `package.json` has changed.
- **NFR-2**: the accessibility audit of the demo reports no violation on an icon.
- **NFR-3 and the built-in set**: the names in the spec are exactly the identifiers of the drawings, and the demo
  gallery displays all 79.

## Risks

- FR-1, FR-10 and "a size given as text does not build" come from reading the code and have not been run. If one proves
  false, the spec is corrected before validation closes.
- D4 assumes the test environment keeps one page for the whole file. If it does not, the clean-up is harmless.
