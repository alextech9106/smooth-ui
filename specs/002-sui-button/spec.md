# Spec 002 — sui-button

Status: implemented (2026-10-16)

## Context and goal

Applications need consistent, themed buttons that work with a keyboard and assistive technology. `sui-button` is a
native button with a text, an optional icon, six looks, three sizes and shapes, that can be disabled, busy or selected.
This revision (breaking) documents the accessible-name rule, stops using the icon as a name, keeps the split `name`
required and drops the icon size. It also darkens the light theme's `primary` and `danger` colours, because their text
fails WCAG AA contrast there (about 3.8:1 instead of 4.5:1).

## Users

- **Consumer developers** and **library maintainers** (groups, split buttons); **end users**, including keyboard and
  voice-control users and people who use assistive technology.

## User stories

- US-1. As a consumer developer, I want a button with a text and an optional icon so that I do not style buttons myself.
- US-2. As a consumer developer, I want activation events and form submit/reset so that it works like a native button.
- US-3. As a consumer developer, I want to mark a button as unavailable or busy so that it cannot be activated
  meanwhile.
- US-4. As a consumer developer, I want to choose the look, size and shape of a button so that it fits each place.
- US-5. As an assistive-technology or voice-control user, I want a name matching the visible text so that I can call it.

## Definitions

- **Activation**: a pointer click, or Enter or Space with keyboard focus. **At rest**: neither hovered nor pressed.
  **Unavailable**: activation ignored, out of the focus order and announced as unavailable.
- **Visible text**: the `name` as given, shown inside the button; `""` shows none. **Blank**: empty or only whitespace.
  **Contains**: after trimming, collapsing inner whitespace and ignoring case, the visible text is inside the `label`.
- **Variant looks** (theme roles): `primary` solid accent background, accent on-solid text; `secondary` surface
  background, primary text, default border; `tonal` soft accent background, accent text; `outline` transparent, accent
  text and border; `ghost` transparent, secondary text, no shadow; `danger` solid danger background, on-solid text.
- **Disabled look**: disabled background, text and border, no shadow, not-allowed cursor. **Loading indicator**: a
  spinning ring hidden from assistive technology, 20 px (16 px plus a 2 px border per side), in the current text colour.
- **Sizes** `sm`/`md`/`lg`: height 32/40/48 px, side padding 12/16/20 px, `md` text 14 px (theme tokens); `sm`/`lg` text
  13/15 px and icon 16/20/24 px are fixed. **Shapes**: `flat`, `rounded` (radius 6/10/14 px, tokens) and `pill`.

## Functional requirements

- FR-1: IF `sui-button` or the split button has no `name`, THEN THE SYSTEM fails at build time when used in markup (spec
  001), or reports a failure when created programmatically; `""` passes this check.
- FR-2: WHEN activated while neither disabled nor loading, THE SYSTEM emits one `trigger` with no data and, by `type`,
  does nothing (`button`, default), submits (`submit`) or resets (`reset`) the surrounding form.
- FR-3: WHILE `disabled` is set, with or without `loading`, THE SYSTEM is unavailable, emits nothing and, at rest, shows
  the disabled look instead of the variant, `selected` and `state` `focus` looks.
- FR-4: WHILE `loading` is set, THE SYSTEM shows the loading indicator instead of icon and text, is unavailable and
  announced busy, keeps the FR-5 name and the variant look and pointer cursor, and never moves focus to another element.
- FR-5: THE SYSTEM's accessible name is the `label` as given if not empty or whitespace-only, otherwise the visible
  text, never the icon. The documented rule, not checked at runtime, is a non-blank `label` that contains the visible text.
- FR-6: WHEN `expanded` is given, THE SYSTEM announces that it opens a menu and whether it is expanded; else neither.
- FR-7: THE SYSTEM shows its variant look (`primary` by default); WHILE `selected` is set, THE SYSTEM shows the selected
  background and accent text at rest, on hover and on pointer press (not on a Space press), without announcing it.
- FR-8: THE SYSTEM offers the defined sizes (`md` default) and shapes (`rounded` default) and, WHILE `fullWidth` is
  set, fills its container's width.
- FR-9: WHEN an icon is given, THE SYSTEM shows it hidden from assistive technology, before the visible text or after it
  WHILE `iconEnd` is set (spec 001 FR-3); WHEN `name` is `""`, THE SYSTEM narrows the side padding to 8 px.
- FR-10: WHEN focused by keyboard, THE SYSTEM draws the focus ring (danger ring in `danger`); WHILE `state` is `focus`
  and not disabled, it draws the normal ring except on `primary` hover and `primary`/`secondary` press.

## Non-functional requirements

- NFR-1: The button adds no dependency to any package of the project (constitution, principle 1).
- NFR-2: Every text and accessible name comes from the consumer (principle 6); the button adds no text of its own.
- NFR-3: WHILE the user asks for reduced motion, all transitions (colour, border, shadow, movement) are instant and the
  loading indicator turns once every 2 s instead of every 0.7 s.
- NFR-4: Every combination of the 6 variants × 3 sizes × 4 states (`selected`, `loading`, `disabled`, `state` `focus`),
  plus `loading` with `selected`, with `state` `focus` and with `disabled`, each with a non-blank accessible name, has
  zero AXE violations against WCAG 2.2 AA in both light and dark theme; the on-solid text of `primary` and `danger` has
  a contrast of at least 4.5:1 against their solid background at rest, on hover and on press, in both themes.

## Edge cases

- **Accessible name** (breaking): a whitespace-only `label` falls back to the visible text, so only a blank `label`
  with a blank `name` gives a blank name, even with an icon, and nothing reports it. `name` "Save" fits `label`
  `"save  DRAFT"`, not "Store" (also unreported).
- **Split button and groups**: a split with a blank `name`, and a group entry with a blank name and no label or a label
  not containing its name, break the documented FR-5 rule without any report; the split's menu part complies.
- **Activation API**: only the button's `trigger` event is a supported way to react to activation; listening to raw
  clicks on the component is unsupported. The button does not stop click propagation. A click event dispatched by
  script on a disabled or loading button still emits `trigger` (accepted; real clicks and Enter or Space do not).
- **No icon size** (breaking public API): a button description written directly with an icon size is rejected when the
  code is compiled; one passed through another type keeps the field, which is ignored.
- **Loading or disabled**: without `fullWidth` it narrows to the indicator plus padding; with both, disabled wins.
  Loading keeps, at rest, the `selected` look (indicator in accent text colour) and the `state` `focus` ring.

## Out of scope

- Navigating to another page (`sui-link`), projected rich content, toggle buttons announcing a pressed state, colours
  outside the theme, right-to-left pages and forced-colour modes.
- `sui-icon-button`, groups and split buttons (except FR-1 and FR-5) and the rest of the button description (unused
  fields, no `disabled`, `size`/`variant` ignored by groups), left for a button-group spec.
- Split's fixed texts "More options" and "Options" (not overridable, against principle 6): for a split or group spec.
- The rest of the theme: only light `--sui-color-accent-solid`/`-hover`/`-active` (to `--sui-accent-600`/`700`/`800`)
  and `--sui-color-danger-solid`/`-hover` (to `--sui-danger-600`/`700`) change; white text, dark theme and focus rings stay.
- A `danger` press token: press keeps the danger solid colour, now lighter than hover (accepted). Reviewing
  `sui-icon-button`, `sui-button-group`, `sui-text-field` and `sui-textarea`, which share these tokens and look darker.

## Completion criteria

- FR-1, FR-2: no build without `name` on `sui-button` or the split button used in markup, and a reported failure when
  created programmatically without it; one click, Enter or Space emits one `trigger`; `submit`/`reset` act on the form.
- FR-3, FR-4: disabled and loading emit nothing and leave the focus order; on entering `loading` focus is on the button
  or on no element, never on another one; the looks, indicator and cursor follow the FRs.
- FR-5 in every name edge case: the name is the `label` as given if not blank, else the visible text (also for a
  whitespace-only `label`), never the icon id, and nothing is reported; FR-6 (`true`/`false`/unset) and FR-9 hold; no icon size field.
- The demo shows all 6 variants × 3 sizes × 4 states and the three `loading` combinations of NFR-4, a `label`-only
  button, a `label` containing its text and `expanded` `true`/`false`, and reacts to activation only through `trigger`;
  there FR-7, FR-8, FR-10, NFR-3 and NFR-4 (WCAG 2.2 AA) hold in light and dark theme.
- NFR-4 contrast: `primary` and `danger` text reaches 4.5:1 at rest, on hover and on press in both themes; the demo page
  paints the theme's canvas background behind all its content in both themes, and NFR-4 holds against it.
- NFR-1 and NFR-2 hold; changed behaviour ships with tests (principle 4), the existing test that expects the icon id as
  the name is updated to the new FR-5 name, the other existing tests stay as they are; all project checks pass.

## Open questions

- [NEEDS CLARIFICATION] `selected` (FR-7): suggest announcing it as pressed (or leaving it to groups), kept on press.
- [NEEDS CLARIFICATION] `state="focus"` (FR-10) is demo-only and inconsistent: remove it or make it consistent?
- [NEEDS CLARIFICATION] Loading (FR-4): suggest an indicator sized with the button and a kept width; decide look,
  cursor, focus.
- [NEEDS CLARIFICATION] Disabled on hover (FR-3): `ghost` text, `secondary`/`outline` border and `selected` text leak.
- [NEEDS CLARIFICATION] Fixed values (FR-8): suggest theme tokens for the `sm`/`lg` text and icon sizes.
- [NEEDS CLARIFICATION] Whitespace-only `name` (FR-9): suggest showing no text and the 8 px padding, as for `""`.
