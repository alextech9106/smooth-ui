# Spec 004 — sui-button-group

Status: implemented (2026-10-17; approved as today's behaviour, re-approved with the naming, group role/name and
pressed-state change, then implemented)

## Context and goal

Applications need related actions joined into one control (toolbars, segmented choices) that works with a keyboard and
assistive technology. `sui-button-group` shows button descriptions as adjacent text or icon segments with one size, look
and shape, and runs each entry's action. This revision gives both types one naming rule, exposes the set as an
optionally named group and announces `selected` as pressed through a new pressed state of specs 002 and 003 (FR-7); it
reaches the split button ("Edge cases"). Segment looks and focus rings follow specs 002 and 003.

**Known issues (owner's decision, 2026-10-17).** The group leaves each segment's focus ring as it is: the group clips it
at its outer edges and a following segment with a background covers it, so the first `primary` segment and a one-entry
group show no visible ring (a WCAG 2.2 SC 2.4.7 Focus Visible gap). In the dark theme the ring (accent 300) is the
`primary` hover colour (about 1:1) and about 1.4:1 against `primary` at rest (accent 400). Both are accepted, like the
light-theme ring contrast of spec 003 (1.92:1 on the canvas); axe does not detect them.

## Users

- **Consumer developers** and **library maintainers** (the split button uses it); **end users**, including keyboard
  users and people who use assistive technology.

## User stories

- US-1. As a consumer developer, I want related actions joined into one control so that they read as one set.
- US-2. As a consumer developer, I want text or icon segments with one size, look and shape so that the set stays even.
- US-3. As a consumer developer, I want each segment to run its own action and show whether it is selected.
- US-4. As a library maintainer, I want to build the split button on the group so that both look the same.
- US-5. As a keyboard or assistive-technology user, I want to reach, identify and operate every segment and know which
  one is selected.

## Definitions

- **Entry**: one item of the `buttons` list (the exported button description). **Segment**: the button drawn for one
  entry. The value sets of the group's `type` (`button` | `icon`) and `variant` (`ghost` | `primary`) are exported.
- **Activation**, **blank**, **at rest** and the `ghost`/`primary` looks: as in specs 002 (text) and 003 (icon).
- **Given**: present in the entry with a value, `true` or `false` for `selected` and `expanded`; an explicit
  `undefined` counts as not given.

## Functional requirements

- FR-1: IF `sui-button-group` has no `buttons`, THEN THE SYSTEM fails at build time when used in markup, or reports a
  failure when created programmatically; an empty list passes and shows no segment.
- FR-2: THE SYSTEM shows one segment per entry, in list order, in one row: WHILE `type` is `button` (default), the
  entry's `name` as text after its `icon`, if any; WHILE `icon`, the `icon` (a blank icon-sized space without one).
- FR-3: WHEN a segment is activated, THE SYSTEM calls its entry's `callback` once, as a method of the entry and with no
  data, or does nothing without one; the group emits no event, never changes any `selected` and never submits a form.
- FR-4: THE SYSTEM gives every segment the group's `size` (`md` default), `variant` (`ghost` default, or `primary`) and
  square corners, and applies from each entry its `name`, `label`, `icon`, `selected` (FR-7), `expanded` (`button`
  type, FR-7) and `callback`; the entry description stays as it is.
- FR-5: THE SYSTEM names every segment, in both types, with its `label` as given if not blank, else its `name`, as
  given except in `button` type with an empty `label`, where its visible text (trimmed) names it. IF both are blank,
  THEN the segment has no accessible name: in `button` type an empty `name` gives an empty `aria-label`, and a
  whitespace `name` gives whitespace-only content, and no `aria-label` if `label` is empty, else a whitespace-only
  `aria-label`; in `icon` type no `aria-label`. Nothing reports a blank name (as in specs 002 and 003).
- FR-6: THE SYSTEM exposes the group with the `group` role, named by its optional `label` as given if not blank; IF
  `label` is blank or not given, THEN the group has no accessible name. Every segment stays its own Tab stop, in list
  order, and the group adds no key handling of its own.
- FR-7: WHILE an entry's `selected` is true, THE SYSTEM shows the selected look of specs 002 and 003 (FR-7); WHEN
  `selected` is given, the segment announces it as pressed (`true`) or not pressed (`false`), else no pressed state;
  WHILE `type` is `button` and `expanded` is given, it also announces a menu and its state (spec 002 FR-6).
- FR-8: THE SYSTEM keeps the segments inside the group's outline: square corners for `flat` (default), a 10 px radius
  at every size for `rounded`, fully round ends for `pill`.
- FR-9: WHILE `variant` is `ghost`, THE SYSTEM draws a 1 px outline around the group and a 1 px line between adjacent
  segments, both in the default border colour; WHILE `primary`, no outline and the line in the accent solid colour.
- FR-10: WHEN a segment is focused by keyboard, THE SYSTEM draws that segment's own ring (spec 002 FR-10, spec 003
  FR-8), unchanged by the group: clipped at the group's outer edges and covered by a following segment with a
  background (the known issues in "Context and goal").

## Non-functional requirements

- NFR-1: The group adds no dependency to any package of the project (constitution, principle 1).
- NFR-2: Every text and accessible name comes from the consumer (principle 6): segment names from the entries, the
  group name from its `label`; the group adds no text of its own.
- NFR-3: The group adds no motion of its own; its segments keep the reduced-motion behaviour of specs 002 and 003.
- NFR-4: Zero AXE violations (WCAG 2.2 AA) in both themes for each type, variant and shape at least once, in named
  groups with named entries, one of them `selected`; the known issues in "Context and goal" are the accepted exceptions.

## Edge cases

- **Names** (breaking in `icon` type): a blank `label` now falls back to a non-blank `name`. A `label` `" Bold "` keeps
  its spaces in the `aria-label` attribute in both types; a `name` `" Bold "` keeps its spaces in the `aria-label`
  in `icon` type, and in `button` type when `label` is whitespace-only; with an empty `label` it names the segment
  through its visible text, which is trimmed.
- **Group name**: a group `label` `" Tools "` names the group with its spaces; `""` or `"  "` gives no group name.
- **Pressed**: `selected: false` announces not pressed and an entry without `selected` announces no pressed state, so
  one group may mix both. In `button` type an entry with `selected` and `expanded` announces both, with no extra rule;
  in `icon` type `expanded` is not announced (as today).
- **Split button**: its icon mode is a `button`-type group of blank-`name` segments named by `label` (no `icon`-type
  change reaches it); its menu is named `name() || 'Options'`. It rebuilds its entries on every menu toggle; a blank
  split `name` leaves its main segment unnamed (FR-5); it passes no group `label` (unnamed group) and no `selected` (no
  pressed state), keeps `expanded` on the chevron and its Tab order; the FR-6 role and FR-10 apply to it.
- **Empty or one-entry group**: an empty group has nothing to focus; a one-entry group shows no visible ring (FR-10).

## Out of scope

- The split button's own behaviour (menu, keys, fixed texts "More options" and "Options") beyond what the group changes.
- `sui-button` and `sui-icon-button` looks and names (specs 002 and 003), except their FR-7 pressed-state amendment;
  the shared ring colour, how rings are drawn, clipped or covered, the dark ring on `primary` and theme tokens.
- Arrow-key navigation, a single Tab stop for the group and selection handled by the group (owner: `group` role only).
- Disabled segments or groups, entry identity, an activation output, the `primary` line, `rounded` radius by size, and
  a report of blank names.
- Vertical or wrapping layouts, right-to-left pages, forced-colour modes and colours outside the theme.

## Completion criteria

- Approved 2026-10-17 as today's behaviour; this revision and the FR-7 amendments of specs 002 and 003 (pressed state)
  are approved before its plan; spec 003's "Accessible name" note on icon groups follows FR-5 (principle 2).
- Unit tests (principle 4) cover every FR: FR-1 programmatic part (build-time part by a consumer build, as in 002/003),
  FR-2 both types, FR-3, FR-4, FR-5 every name edge case and the three no-name results, FR-6 role, name (given, blank,
  absent) and Tab order, FR-7 look and pressed state (`true`, `false`, absent) in both types and `expanded` with and
  without `selected`; FR-8 and FR-9 through the classes they set; the pressed state in the 002 and 003 tests; the
  split's tests are updated where needed and stay green.
- In a browser, both themes: FR-8 corners, FR-9 lines and colours, FR-10 rings as recorded (known issues confirmed,
  not fixed) and the pressed state in the accessibility tree.
- The demo shows a named group, a `primary` group, a one-entry group, an entry with `selected` beside one without, and
  groups covering the NFR-4 set; NFR-1 to NFR-4 hold on the demo groups and split buttons; all project checks pass.
- The release note lists the breaking `icon`-type name fallback, the `group` role and its optional `label`, the new
  pressed input of `sui-button` and `sui-icon-button` that group segments use for `selected`, and the known issues.

## Open questions

- Deferred (non-blocking): disabled entries and groups; entry identity (`id`, tracking by it) and an activation output
  instead of `callback`; a visible line between `primary` segments at rest and a `rounded` radius that follows `size`.
