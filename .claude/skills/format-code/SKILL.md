---
name: format-code
description: Format source code in this workspace with Prettier through Nx. Use when the user asks to format, prettify or fix the style of files, or before drafting a commit.
---

# Format code

Prettier 3 is the only formatter. Its config is `.prettierrc` (`singleQuote: true`, `printWidth: 150`) and
`.prettierignore`; never restate or override those options inline, and never hand-format code Prettier owns.

## Steps

1. Pick the scope: files named by the user, otherwise the uncommitted changes.
2. Check first (read-only): `pnpm nx format:check --files=<a,b>` or `pnpm nx format:check --uncommitted`.
3. List the files that would change and ask for approval.
4. Once approved, write: `pnpm nx format:write --files=<a,b>` or `pnpm nx format:write --uncommitted`.
5. Report the files that were reformatted, nothing else.

## Class member order

Prettier doesn't reorder members, so apply this order by hand when writing or formatting a class. ESLint enforces it
through `@typescript-eslint/member-ordering` in `eslint.config.mjs`:

1. Private declarations
2. Public declarations
3. Protected declarations
4. Constructor, if there is one
5. Private methods and functions
6. Public methods and functions
7. Protected methods and functions

## Private member naming

Every `private` member (fields, methods and functions, static or not) must start with `_`, e.g. `private readonly _injector`
and `private _resolvePlacement()`. Public and protected members never take the prefix. When a private member lacks it,
rename it and update every reference in the class.

## Rules

- Never format the whole workspace (`--all`) unless the user asks for it.
- Formatting only: apart from the class member order and the private `_` prefix above, no lint fixes, import
  reordering, renames or refactors in the same pass.
- Don't touch `dist/`, `node_modules/`, `pnpm-lock.yaml` or anything in `.prettierignore`.
- If a file fails to parse, stop and show the error instead of editing around it.
- Changing `.prettierrc` or `.prettierignore` is a config change: propose the diff and wait.
