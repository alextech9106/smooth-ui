# Tasks 001 — sui-icon

Spec: `specs/001-sui-icon/spec.md`. Plan: `specs/001-sui-icon/plan.md`. Every task edits only
`libs/smooth-ui/src/lib/components/sui-icon/sui-icon.component.spec.ts`; no production code changes.

- [x] **T1. Start every test from a page with no copy of the drawings, and test the copy in a browser.** FR-9
- Done when: copies left on the page are removed before each test; tests show that one icon adds exactly one copy, a
  second icon in the same application adds none, destroying an icon removes none, and a second application adds a
  second copy; `pnpm nx run smooth-ui:test` is green, including the two tests that already existed.

- [x] **T2. Test the page rendered outside a browser.** FR-10
- Done when: a test that provides `PLATFORM_ID` as `'server'` shows that creating the icon does not throw and that the
  page holds no copy of the drawings; `pnpm nx run smooth-ui:test` is green.

- [x] **T3. Test that a name of the built-in set points at its drawing.** FR-2, FR-6
- Done when: tests show that with name `check` the icon points at `#check`, that the page holds a drawing with that
  identifier, and that this drawing takes its colour from the surrounding text; `pnpm nx run smooth-ui:test` is green.

- [x] **T4. Test a name that is not in the built-in set.** FR-3
- Done when: tests show, for an unknown name and for `""`, `Check` and `" check"`, that creating the icon does not
  throw, that `console.error`, `console.warn` and `console.log` are not called, that the icon keeps the requested size
  and that the page holds no element with that identifier; `pnpm nx run smooth-ui:test` is green.

- [x] **T5. Test the size and the changes of name and size.** FR-4, FR-5, FR-8
- Done when: tests show that with no size the width and height are `20`, that with size `32` they are `32`, that
  changing the name changes the drawing the icon points at, and that changing the size changes the width and height;
  `pnpm nx run smooth-ui:test` is green.

- [x] **T6. Complete the test that icons are hidden and out of the focus order.** FR-7
- Done when: besides the existing checks, a test shows there is no `tabindex` on the icon or inside it;
  `pnpm nx run smooth-ui:test` is green.

- [x] **T7. Run the full set of checks.** FR-2 to FR-10
- Done when: `pnpm nx format:check && pnpm nx run-many -t lint test build typecheck` is green, every FR from FR-2 to
  FR-10 has at least one test in the file, and `MEMORY.md` records the result.

Not tasks: FR-1, the real look of the icon (FR-2, FR-5, FR-6), the three NFRs and the list of 79 names are checked in
`/sdd-validate`, as the plan says under "Left for validation".
