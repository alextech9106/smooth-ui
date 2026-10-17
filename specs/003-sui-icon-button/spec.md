# Spec 003 — sui-icon-button

Status: implemented (2026-10-17)

## Context and goal

Applications need compact, themed buttons that show only an icon (toolbars, theme switch, icon groups) and still work
with a keyboard and assistive technology. `sui-icon-button` is a native button with one icon, three looks, three sizes
and shapes, that can be disabled or selected and can show a number badge. This revision (breaking) makes the `label` the
only accessible name (no icon-name fallback), removes the ignored icon size, and requires zero AXE violations and a
focus ring of at least 3:1 against the canvas (before: about 1.5:1 light, 2.27:1 dark). Light theme colours are those
reassigned by spec 002 (accent solid 600/700/800, danger solid 600/700).

**Known conflict (owner's decision, 2026-10-17).** The ring uses accent 300 in both themes, so the light-theme ring
is 1.92:1 against the canvas and fails WCAG 2.2 SC 1.4.11 Non-text Contrast (AA), against the project rule "WCAG AA
non-negotiable" (CLAUDE.md §12) and the AA intent of NFR-4. axe does not measure focus-ring contrast, so a zero-violation
run does not show it; SC 2.4.13 Focus Appearance is AAA and not the criterion here.

## Users

- **Consumer developers** and **library maintainers** (theme toggle and icon groups use it); **end users**, including
  keyboard users and people who use assistive technology.

## User stories

- US-1. As a consumer developer, I want a button that shows only an icon so that toolbars stay compact.
- US-2. As a consumer developer, I want one activation event so that I react to the button like to a native one.
- US-3. As a consumer developer, I want to choose the look, size and shape, and mark it disabled or selected.
- US-4. As a consumer developer, I want to show a count on the button so that users see pending items.
- US-5. As an assistive-technology user, I want each icon button to name its action so that I know what it does.

## Definitions

- **Activation**: a pointer click, or Enter or Space with keyboard focus. **At rest**: neither hovered nor pressed.
  **Unavailable**: activation ignored, out of the focus order and announced as unavailable. **Blank**: empty or only
  whitespace. **Painted ring colour**: the focus ring's colour as painted over the theme canvas (it may be translucent).
- **Variant looks** (theme roles): `ghost` transparent background, secondary icon colour, hover subtle background and
  primary text colour, press muted background; `outline` surface background, default border, primary text colour, hover
  subtle, press muted; `primary` accent solid background, accent on-solid colour, hover solid-hover, press solid-active
  (light accent 600/700/800 with a white icon; dark accent 400/300/200 with a neutral 950 icon).
- **Sizes** `sm`/`md`/`lg`: a square of 32/40/48 px with an icon of 16/20/24 px; **shapes**: `flat` (square corners),
  `rounded` (radius 6/10/14 px by size) and `pill` (fully round).

## Functional requirements

- FR-1: IF `sui-icon-button` has no `icon`, THEN THE SYSTEM fails at build time when used in markup, or reports a failure
  when created programmatically; `""` passes and shows an empty space of the icon size (spec 001).
- FR-2: WHEN activated while not disabled, THE SYSTEM emits one `trigger` with no data and never submits or resets a
  surrounding form.
- FR-3: WHILE `disabled` is set, THE SYSTEM is unavailable, emits no `trigger` on a real click, Enter or Space and, at rest
  and on hover, shows the disabled icon colour, a transparent background and a not-allowed cursor over the variant and
  `selected` looks.
- FR-4: THE SYSTEM's accessible name is a non-blank `label` exactly as given (not trimmed), never the `icon` name, and
  the icon is hidden from assistive technology. IF `label` is blank or not given, THEN THE SYSTEM sets no accessible name
  of its own. A non-blank `label` is a documented rule only: it is not required and nothing reports its absence.
- FR-5: THE SYSTEM shows its variant look (`ghost` by default) at rest, on hover and on press.
- FR-6: THE SYSTEM offers the defined sizes (`md` default) and shapes (`rounded` default), and the icon size follows
  `size` only; there is no icon size option on the component or in the exported icon button description (breaking).
- FR-7: WHILE `selected` is set, THE SYSTEM shows the selected background and accent icon colour at rest, on hover and
  on pointer press (not on a Space press), without announcing it.
- FR-8: WHEN focused by keyboard, and WHILE `state` is `focus` (also on hover, on press and while disabled), THE SYSTEM
  draws in every variant the shared theme focus ring in accent 300, whose painted colour reaches 3:1 against the canvas
  in both themes, except the accepted light-theme failure recorded in NFR-4.
- FR-9: WHEN `badge` is a number other than 0 and `NaN`, THE SYSTEM shows it as given in a round danger-coloured mark,
  24 px high, text 10 px, overlapping the top-right corner (10 px above, 12 px beyond the edge); WHEN `badge` is 0, `NaN`
  or not given, it shows none.
- FR-10: WHILE a badge is shown, THE SYSTEM keeps it outside the button: it is not part of the accessible name, is
  exposed as separate text and a click on it does not emit `trigger`.

## Non-functional requirements

- NFR-1: The icon button adds no dependency to any package of the project (constitution, principle 1).
- NFR-2: Every text and accessible name comes from the consumer (principle 6): the badge number from `badge`, the name
  from `label`; the icon button adds no text of its own.
- NFR-3: WHILE the user asks for reduced motion, all transitions (colour, background, border, shadow) are instant.
- NFR-4: Zero AXE violations (WCAG 2.2 AA) in light and dark theme for 3 variants × 3 sizes × 4 single states
  (`selected`, `disabled`, `state` `focus`, a badge), each with a non-blank `label`. In both themes: painted ring 3:1
  against the canvas; icon 3:1 against its background at rest, hover, pointer and keyboard press in every variant and in
  `selected` (ghost against the canvas); badge text 4.5:1. Accepted exceptions (known failures): selected `primary` on
  a Space press (1.85:1 light, 1.34:1 dark) and the light-theme ring (1.92:1 on the canvas, 2.02:1 on white surfaces).

## Edge cases

- **Accessible name** (breaking): a blank or missing `label` gives no name (an unreported FR-4 violation), never the icon
  name; `" Close "` keeps its spaces. Icon groups pass the entry's `label` if given, else its `name`, so a blank `label`,
  or no `label` and a blank `name`, gives an unnamed button.
- **No icon size** (breaking): a bound icon size fails to compile, a plain attribute is silently ignored and setting it
  programmatically fails at runtime; a description literal with it fails to compile, one passed through another type
  keeps the ignored field.
- **Badge values and placement**: 0 and `NaN` show none; negative and decimal numbers show as given (`-1`, `1.5`); large
  numbers are not capped and widen the mark. It covers up to 12 × 14 px of the top-right corner (a large share of `sm`),
  where a click emits no `trigger`, may overlap neighbours and keeps its full danger colours while disabled.
- **Disabled with other states**: the disabled look wins over `selected`; `outline` keeps its border; `state` `focus`
  keeps its ring.
- **Activation API**: `trigger` is the activation event; click propagation is not stopped. A script-dispatched click on a
  disabled button still emits `trigger` (accepted, as in spec 002). The theme toggle listens to raw clicks instead, so a
  click on a badge would also reach it (it shows none today).

## Out of scope

- The theme toggle and icon groups as components (including the group's `label` else `name` fallback), and the rest of
  the exported icon button description: only its icon size field is removed; it still has no `label` or `disabled`.
- Loading, menu (`expanded`), submit/reset types, a `danger` look and full width, which `sui-button` offers (see the
  parity open question); combined states in the NFR-4 matrix (for example disabled with selected or with a badge).
- Tooltips showing the name, colours outside the theme, right-to-left pages (badge side), forced-colour modes and the
  demo's 375 px overflow (open question).
- Theme tokens other than the shared focus ring, whose new colour (both themes) also changes the rings of `sui-button`,
  the split button, `sui-link`, `sui-text-field` and `sui-textarea` (accepted, although spec 002 kept rings as they were;
  their light-theme rings stay below 3:1 as well).
- The danger focus ring, which only `sui-button` uses, stays as it is.

## Completion criteria

- FR-1: a consumer build fails when `sui-icon-button` is used in markup without `icon` or with a bound icon size, as
  checked in spec 002; a unit test covers the failure when it is created programmatically without `icon`.
- FR-2 to FR-10 are covered by tests (principle 4): FR-3 with its look and Enter or Space, FR-4 with the hidden icon and
  every name edge case (non-blank `label` as given, never the icon name, none for a blank `label`); the existing test
  that expects the icon name is updated, the others stay; what a unit test cannot observe is checked in a browser.
- The demo's icon-button section replaces its duplicated rows with the 36 NFR-4 buttons in a stable-id container, loaded
  when scrolled into view with a placeholder and a loading state, plus one button per shape; every demo icon button has
  its own non-blank `label` naming its action, and the page's 375 px overflow does not grow.
- FR-8, NFR-3 and NFR-4 (AXE and contrast, with its two accepted exceptions) hold on the 36 buttons and the shape
  buttons in both themes, ring and ghost measured against the canvas; the theme toggle and the 18 group icon buttons are
  not checked.
- NFR-1 and NFR-2 hold; all project checks pass; the release note lists the breaking changes: no icon-name accessible
  name, icon size removed from the component and the exported description, and the new shared focus ring colour (accent
  300; light theme below 3:1, a known WCAG AA failure), which changes every focus ring that spec 002 said would stay.

## Open questions

- [NEEDS CLARIFICATION] Badge (FR-9, FR-10): suggest announcing it as part of the button (text overridable, principle 6);
  decide a cap (for example `99+`), what 0, `NaN`, negative or decimal values show, whether clicks on the mark activate
  the button (it covers part of `sm`) and whether it dims while disabled.
- [NEEDS CLARIFICATION] `selected` (FR-7): suggest announcing it as pressed and keeping its look on a Space press, which
  also removes the NFR-4 exception.
- [NEEDS CLARIFICATION] `state` `focus` (FR-8): demo-only and drawn while disabled; remove it or make it consistent?
- [NEEDS CLARIFICATION] Parity with `sui-button`: `outline` here is neutral (accent there), default is `ghost` (`primary`
  there), no `danger` look, loading, menu (`expanded`), submit/reset or full width; align them, and should the theme
  toggle react through `trigger`?
- [NEEDS CLARIFICATION] Narrow screens: the theme toggle's icon button is one cause of the demo's 375 px overflow (page
  444 px wide); fix it here or in a demo or theme-toggle spec?
