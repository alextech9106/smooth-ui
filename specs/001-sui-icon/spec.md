# Spec 001 — sui-icon

Status: implemented

## Context and goal

Applications built with the library need small pictures (icons) inside buttons, fields, links and text. Drawing or
importing them one by one in every application is repetitive and makes them look different from each other.

`sui-icon` displays one icon from a set that ships with the library, chosen by its name, at the size the developer asks
for and in the colour of the text around it. This spec records how `sui-icon` behaves today. It proposes no change to
that behaviour; the only work it asks for is the tests that are missing.

## Users

- **Consumer developers**: build applications with the library and choose icons by name.
- **End users** of those applications, including people who use assistive technology.
- **Library maintainers**: add icons to the set and build components that show icons.

## User stories

- US-1. As a consumer developer, I want to show an icon by its name so that I do not have to draw or import icons
  myself.
- US-2. As a consumer developer, I want to choose the size of an icon so that it fits the text or control next to it.
- US-3. As a consumer developer, I want an icon to take the colour of the text around it so that it follows the theme
  without extra work.
- US-4. As an end user of assistive technology, I want icons to be skipped so that I only hear the text or accessible
  name of the control they belong to.
- US-5. As a library maintainer, I want the drawings of all icons to be loaded once per application so that showing many
  icons costs no more than showing one.

## Definitions

- **Built-in set**: the 79 icons whose drawing ships with the library. Their names are:
  `check`, `x`, `chevron-down`, `chevron-up`, `chevron-right`, `chevron-left`, `arrow-right`, `arrow-left`, `arrow-up`,
  `arrow-down`, `plus`, `minus`, `plus-circle`, `minus-circle`, `search`, `info`, `alert-triangle`, `alert-circle`,
  `check-circle`, `x-circle`, `star`, `heart`, `thumbs-up`, `thumbs-down`, `user`, `settings`, `bell`, `calendar`,
  `mail`, `message-circle`, `phone`, `lock`, `shield`, `key`, `eye`, `eye-off`, `trash`, `edit`, `save`, `download`,
  `upload`, `undo`, `redo`, `refresh`, `loader`, `more-horizontal`, `more-vertical`, `filter`, `external-link`, `link`,
  `share`, `copy`, `sun`, `moon`, `menu`, `list`, `home`, `image`, `camera`, `play`, `pause`, `file`, `folder`,
  `bookmark`, `tag`, `credit-card`, `shopping-cart`, `gift`, `map-pin`, `globe`, `grid`, `circle`, `square`, `maximize`,
  `minimize`, `clock`, `help`, `log-out`, `log-in`.
- **Build time**: the moment the consumer's application is checked and compiled, before it runs.
- **Application**: one running instance of a consumer's program that uses the library. One page can host several.
- **Decorative icon**: an icon that adds no information beyond the text or accessible name of what surrounds it.

## Functional requirements

- FR-1: IF a developer uses `sui-icon` without giving it a name, THEN THE SYSTEM reports an error at build time.
- FR-2: WHEN `sui-icon` receives the name of an icon of the built-in set, THE SYSTEM displays that icon.
- FR-3: IF `sui-icon` receives a name that is not in the built-in set, THEN THE SYSTEM raises no error, writes nothing
  to the browser console and displays an empty space of the requested size, unless the name is the identifier of another
  element of the page.
- FR-4: WHEN no size is given, THE SYSTEM uses a size of 20.
- FR-5: WHEN a size of N is given, N being a number greater than zero, THE SYSTEM draws the icon inside a square area N
  px wide and N px high, keeping the icon's proportions, and centres that area in the width given to the icon by the
  element that contains it.
- FR-6: THE SYSTEM draws the icon in the colour that text placed at the same point of the page would have, and WHEN that
  colour changes, the icon changes with it.
- FR-7: THE SYSTEM treats every icon as decorative: it hides the icon from assistive technology and keeps it out of the
  keyboard focus order.
- FR-8: WHEN the name or the size of a displayed icon changes, THE SYSTEM updates the displayed icon to match.
- FR-9: WHILE a page runs in a browser, THE SYSTEM adds to it exactly one copy of the built-in set's drawings for each
  application that displays an icon, however many icons that application displays, and never removes it.
- FR-10: WHILE a page is rendered outside a browser, THE SYSTEM adds no copy of the drawings and raises no error.

## Non-functional requirements

- NFR-1: Displaying icons adds no dependency to any package of the project (constitution, principle 1).
- NFR-2: An accessibility audit of a page that shows icons, run in a browser, reports no violation on an icon.
- NFR-3: Icon names are in English (constitution, principle 6).

## Edge cases

- **Name that is empty, has different letter case or has spaces around it** (`""`, `Check`, `" check"`): it is not in
  the built-in set, so FR-3 applies.
- **Size that is not a number greater than zero**: text instead of a number is rejected at build time; zero or less is
  accepted, the icon is not visible or is drawn incorrectly, and nothing is reported.
- **Copies of the drawings**: several applications on one page, or one that is destroyed and created again, each add
  their own copy (FR-9), so copies add up and the icons are still displayed. If other code removes the copies from the
  page, they are not added again and the icons stop being displayed.
- **Identifier shared between the page and the drawings**: the drawings are identified on the page by their bare names
  (`menu`, `search`, `user`…). A page element with one of those identifiers makes two elements share it, and a name
  outside the set that is the identifier of a page element makes the icon point at that element.
- **Icon that carries meaning on its own** (for example a status icon with no text beside it): it is never announced,
  because of FR-7. The consumer must give that meaning as text or as the accessible name of the element that contains
  the icon.

## Out of scope

- Checking icon names at build time, and reporting or replacing an unknown name while the application runs.
- Giving an icon an accessible name of its own.
- Letting consumers add their own icons, and listing the available names while the application runs.
- How other components of the library (buttons, fields, links) choose and place their icons.
- Right-to-left pages, forced-colour modes, parts of a page isolated from the rest of it, and strict content security
  policies.

## Completion criteria

- Every FR from FR-2 to FR-10 is covered by at least one automated test of what the icon declares (the drawing it points
  at, the size it asks for, that it is hidden from assistive technology, the copy of the drawings), and all of them
  pass.
- What only a real browser, a build or a reading can show is checked once, during validation: that the icon is seen with
  the right size, position and colour (FR-2, FR-5, FR-6), that a `sui-icon` without a name does not build (FR-1), the
  audit of NFR-2, that the names listed under "Built-in set" are exactly the icons that exist in the library, and that
  the demo application displays all of them.
- All the automatic checks the project runs on every change pass.

## Open questions

None.
