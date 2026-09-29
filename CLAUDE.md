# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects,
  targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e.
  `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using
  globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed
  without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST
  before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# CLAUDE.md — Angular v22 Project Guide

Operating rules for Claude Code in this repository. Read this before touching anything.

---

## 1. How you must behave (highest priority)

These three rules override any default habit you have. They apply to every single turn.

### 1.1 Answer short

- Default to **3 sentences or fewer** of prose. Code blocks don't count.
- No preamble ("Great question!", "Let me explain..."), no recap of what you just did, no summary of the summary.
- One idea per answer. If the answer needs sections and headers, it's too long — cut it or ask which part they want.
- Lead with the answer. Context only if they ask for it.
- Never re-explain code you just wrote. The code is the explanation.

### 1.2 Ask before you act

- **Never edit, create, delete, move, or run anything without explicit approval in this turn.** Not even "obvious"
  fixes, formatting, imports, or renames.
- The correct move is always: _propose → wait → act_. Show the diff or snippet, then ask one short question ("Apply this
  to `user-list.ts`?").
- Ask before: installing packages, running `ng generate`, changing config (`angular.json`, `tsconfig`,
  `../package.json`), touching more than one file, refactoring, upgrading anything, running git commands.
- One question at a time. If several decisions are open, ask the blocking one first.
- If a request is ambiguous, ask instead of assuming — but ask **one** concrete question with options, not an open-ended
  interview.
- Approval is per-action and per-turn. "Yes" to one edit is not "yes" to the next one.
- If they say "just do it" / "go ahead, don't ask", honor it for that task only, then return to asking.
- Exception: read-only actions (reading files, searching, `ng version`, type-checking) need no approval.

### 1.3 Suggest code, always

- Whenever the user is writing code, describing a feature, pasting a snippet, or thinking out loud about
  implementation — **offer concrete code immediately**, unprompted.
- The suggestion is a proposal, not an edit. Show it in a fenced block with the target file path as a comment on line 1.
- Always in idiomatic Angular v22 per the rules below. Never suggest a pattern this file marks as legacy.
- If you spot a bug, a missing `track`, an unsubscribed stream, an `any`, or a legacy API while reading their code — say
  it in one line and show the fixed version. Don't apply it.
- If there are two reasonable implementations, show the one you'd pick and name the alternative in one clause.
- Keep suggested snippets minimal: only the lines that change, plus enough context to place them.

**Response shape for a code suggestion:**

```ts
// src/app/users/user-list.ts
readonly;
users = httpResource<User[]>(() => '/api/users');
```

Then one line: what it does or what it replaces. Then: "Want me to apply it?"

---

## 2. Project baseline

Nx 23 + pnpm workspace, Angular 22.1, TypeScript 6.0 (`strict`), zoneless, Vitest 4. Styling is SCSS + CSS custom
properties — Tailwind, NgRx, Angular Material and Playwright are **not** installed; don't suggest them without asking.

- `libs/smooth-ui` — publishable library `@alextech9106/smooth-ui` (ng-packagr via `@nx/angular:package`, output
  `dist/libs/smooth-ui`, released with `nx release` using git tags). Everything consumers can use must be exported from
  `src/public-api.ts`.
- `apps/smooth-ui-demo` — showcase app. It imports the library through the `tsconfig.base.json` path alias, which points
  at the lib's **source**, so lib changes show up without a rebuild. It demos every component with both Signal Forms and
  Reactive Forms.
- Library layout: `src/lib/components/sui-<name>/` (`.component.ts/html/scss/spec.ts` + a `type/` folder for
  per-component union types), plus shared `types/`, `interfaces/`, `services/`, `constants/`.
- Theming: `libs/smooth-ui/theme/theme.scss` defines the `--sui-*` design tokens and is shipped as a package asset. Dark
  mode switches on `[data-theme]` on `<html>`, set by `ThemeService`. Icons are an inline SVG sprite
  (`constants/sui-icon.ts`) that `SuiIconService` injects into `<body>`.
- Form controls (`sui-text-field`, `sui-textarea`) implement Signal Forms' `FormValueControl<T>` (`value` model +
  `touched`/`errors`/`disabled` inputs, `touch` output). Don't add a `ControlValueAccessor`.

---

## 3. TypeScript rules

- `strict: true`, `noImplicitReturns`, `noUnusedLocals`, `noImplicitOverride` (see `tsconfig.base.json`). Never weaken
  compiler options to make code pass.
- **No `any`.** Use `unknown` and narrow, or write the real type.
- Library code annotates class fields explicitly, including signals (`public size: InputSignal<SUI_SIZE> = input<SUI_SIZE>('md');`),
  with explicit `public`/`protected`/`private` modifiers and a `_` prefix on private members. Follow that style.
- No non-null assertions (`!`) except after a guard you can point to.
- Model domain types as `interface` for object shapes, `type` for unions and mapped types.
- Prefer `readonly` on class fields that never get reassigned — signals almost always qualify.
- Use `satisfies` for config objects instead of a widening annotation.

---

## 4. Components

- Standalone only. **Do not write `standalone: true`** — it's the default since v20.
- **Do not write `changeDetection: ChangeDetectionStrategy.OnPush`** — it's the default since v22. Only set
  `ChangeDetectionStrategy.Eager` (the old `Default`) with a written justification.
- One responsibility per component. If a template passes ~80 lines or the class holds two unrelated concerns, propose a
  split.
- Inline templates for anything under ~20 lines; external `.html` beyond that, referenced by relative path.
- Naming (library): file `sui-button.component.ts`, class `SuiButtonComponent`, selector `sui-button`. Union types are
  `SUI_*` (e.g. `SUI_SIZE`) in `*.type.ts`. The demo app uses the `app-` prefix. The examples below use generic names.

**Signal-based API — always:**

```ts
// src/app/users/user-card.ts
import { Component, computed, input, model, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <article class="rounded-lg border p-4" [class.opacity-50]="!user().active">
      <h3>{{ fullName() }}</h3>
      <button type="button" (click)="select.emit(user().id)">Select</button>
    </article>
  `,
  host: { role: 'listitem' },
})
export class UserCard {
  readonly user = input.required<User>();
  readonly compact = input(false, { transform: booleanAttribute });
  readonly expanded = model(false);
  readonly select = output<string>();

  protected readonly fullName = computed(() => `${this.user().firstName} ${this.user().lastName}`);
}
```

- `input()` / `input.required()` / `output()` / `model()` — never `@Input()` / `@Output()`.
- `host: {}` in the decorator — never `@HostBinding` / `@HostListener`.
- `viewChild()` / `contentChild()` signal queries — never the decorator versions.
- `computed()` for anything derived. If a field is assigned inside a method from other signals, it should have been a
  `computed()`.
- `linkedSignal()` when local state must reset or recompute from an upstream source but stay independently writable.
- `effect()` is a last resort — only for non-Angular side effects (analytics, third-party libs, `localStorage`,
  imperative DOM). Never to sync one signal into another, and never to set state.
- No lifecycle hooks where a signal works. `ngOnInit` is a smell in new code; `takeUntilDestroyed()` or `DestroyRef`
  replaces `ngOnDestroy`.
- `protected` for members used only by the template, `private` for internals, `readonly` for signals.

---

## 5. Templates

- Built-in control flow only: `@if`, `@for`, `@switch`, `@let`, `@defer`, `@empty`. `*ngIf`, `*ngFor`, `*ngSwitch` are
  removed from new code.
- `@for` **requires** a meaningful `track` — a stable id, never `$index` unless the list is static and unkeyed.
- `@switch` in v22 supports multiple values per `@case` and exhaustiveness via `@default never` — use it for
  discriminated unions.
- `@defer` with `on viewport` / `on interaction` for below-the-fold or heavy blocks, always with `@placeholder` and
  `@loading`.
- `[class.x]` and `[style.x]` bindings — never `ngClass` / `ngStyle`.
- Keep logic out of templates. No function calls in bindings that do real work — move them to `computed()`.
- Never call globals in a template (`new Date()`, `Math.random()`) — SSR will diverge.
- `NgOptimizedImage` (`ngSrc`) for every static image, with `width`/`height` or `fill`, and `priority` on the LCP image.
  Never base64.
- `async` pipe only for streams you genuinely can't model as signals; otherwise `toSignal()`.
- Inline arrow functions in templates are allowed in v22 — keep them to one expression.

---

## 6. State

**Local component state → signals.**

```ts
readonly;
query = signal('');
readonly;
page = signal(1);
readonly;
results = computed(() => filter(this.all(), this.query()));
```

- `set()` or `update()`. Never mutate the value in place.
- Keep every derivation pure — no HTTP, no logging, no writes inside `computed()`.

**Shared / feature state → NgRx SignalStore.**

```ts
// src/app/users/user-store.ts
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState<UserState>({ filter: '', selectedId: null }),
  withEntities<User>(),
  withComputed(({ entities, filter }) => ({
    visible: computed(() => entities().filter((u) => u.name.includes(filter()))),
  })),
  withMethods((store, api = inject(UserApi)) => ({
    setFilter(filter: string) {
      patchState(store, { filter });
    },
    load: rxMethod<void>(
      pipe(
        switchMap(() =>
          api.list().pipe(
            tapResponse({
              next: (users) => patchState(store, setAllEntities(users)),
              error: console.error,
            }),
          ),
        ),
      ),
    ),
  })),
);
```

- `patchState()` only — never assign to store slices directly.
- Feature stores are `providedIn: 'root'` when global, or provided on the route when scoped to a feature (preferred — it
  dies with the route).
- Business rules live in `withMethods`, derived data in `withComputed`. Components read and call; they don't compute
  domain logic.
- Don't reach for a store when a `computed()` in one component does the job.

---

## 7. Async data

Default to the resource APIs, not manual subscriptions.

```ts
// src/app/users/user-detail.ts
readonly;
userId = input.required<string>();
readonly;
user = httpResource<User>(() => `/api/users/${this.userId()}`);
```

```html
@if (user.isLoading()) {
<app-spinner />
} @else if (user.error()) {
<app-error [error]="user.error()" (retry)="user.reload()" />
} @else if (user.hasValue()) {
<app-user-card [user]="user.value()" />
}
```

- `httpResource()` for GET-shaped reads; `resource()` when the loader isn't plain HTTP.
- Read `isLoading()`, `error()`, `hasValue()`, `value()`, `status()`; call `reload()` to refetch.
- Mutations (POST/PUT/DELETE) stay on `HttpClient` methods, called from a service or store method — resources are for
  reads.
- If you must subscribe manually, `takeUntilDestroyed()` is mandatory.
- `toSignal()` at the boundary when consuming a third-party observable; `toObservable()` only when handing a signal to
  RxJS-only code.
- Interceptors are functional (`HttpInterceptorFn`), registered via `withInterceptors()`.

---

## 8. Forms

Signal Forms for anything new. Reactive Forms only in files that already use them; never mix the two in one component.

```ts
// src/app/auth/login.ts
import { form, FormField, email, minLength, required } from '@angular/forms/signals';

readonly;
model = signal({ email: '', password: '' });
readonly;
loginForm = form(this.model, (path) => {
  required(path.email, { message: 'Email is required' });
  email(path.email, { message: 'Enter a valid email' });
  required(path.password);
  minLength(path.password, 8, { message: 'At least 8 characters' });
});
```

```html
<form (submit)="onSubmit($event)">
  <label for="email">Email</label>
  <input id="email" type="email" [formField]="loginForm.email" [attr.aria-invalid]="loginForm.email().invalid()" />

  @if (loginForm.email().touched() && loginForm.email().invalid()) { @for (err of loginForm.email().errors(); track err.kind) {
  <p class="text-sm text-red-600">{{ err.message }}</p>
  } }

  <button type="submit" [disabled]="loginForm().invalid()">Sign in</button>
</form>
```

- Model is a `signal<T>()`; the form is derived from it. Read submitted data from the model, not from the field tree.
- Field state signals: `value()`, `valid()`, `invalid()`, `errors()`, `touched()`, `dirty()`, `pending()`, `disabled()`,
  `readonly()`.
- Built-in validators: `required`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`, `debounce`. Custom ones
  are plain functions on a schema path.
- Show errors only when `touched()` — never on first paint.
- Never `ControlValueAccessor` in new code; `[formField]` binds to native inputs and Angular Aria components directly.

---

## 9. Services & DI

- `inject()` at field initialization. **No constructor injection** in new code.
- `@Service()` for app-wide singletons (v22) instead of `@Injectable({ providedIn: 'root' })`.
- `@Injectable()` without `providedIn` for services provided on a route or component.
- `injectAsync()` for heavy services that should code-split.
- One responsibility per service. HTTP-shaped services return typed data, not `HttpResponse`.
- `InjectionToken` for config; never a bare string token.

```ts
// src/app/users/user-api.ts
@Service()
export class UserApi {
  readonly #http = inject(HttpClient);

  list(): Observable<User[]> {
    return this.#http.get<User[]>('/api/users');
  }
}
```

---

## 10. Routing

- Standalone routes in `app.routes.ts`, feature routes lazy-loaded with `loadChildren: () => import('./users/routes')`.
- `loadComponent` for single lazy screens.
- Route-level `providers` for feature-scoped stores and services.
- `withComponentInputBinding()` so route params arrive as `input()` — never read `ActivatedRoute` snapshots for params.
- Guards and resolvers are plain functions (`CanActivateFn`, `ResolveFn`) using `inject()`.
- Every feature route lazy by default. Only the shell is eager.

---

## 11. Styling & UI

- One `.scss` file per component (`styleUrl`), using the `--sui-*` tokens from `theme/theme.scss` — never hard-coded hex
  values in components. New tokens go in `theme.scss` for both light and `[data-theme='dark']`.
- No `::ng-deep`.
- Conditional class lists are built in a `computed()` string (see `SuiTextFieldComponent.classes`).
- Respect the `anyComponentStyle` budget in the demo (warn 4kb / error 8kb).

---

## 12. Accessibility (non-negotiable)

- Semantic HTML first. A `<div>` with a click handler is a bug — use `<button type="button">`.
- Every interactive element is keyboard reachable, has a visible focus ring, and has an accessible name.
- Every form control has a real `<label for>`; errors are wired with `aria-describedby` and announced.
- Icon-only buttons require `aria-label`.
- Must pass AXE with zero violations and meet **WCAG AA** (contrast, focus management, ARIA correctness).
- Manage focus on route change, dialog open/close, and after destructive actions.
- Respect `prefers-reduced-motion`.

---

## 13. Testing

- `pnpm nx test smooth-ui` runs **Vitest**. Specs sit next to each component (`*.component.spec.ts`) and use `TestBed` +
  `ComponentFixture`; set required inputs with `fixture.componentRef.setInput()`.
- Test behavior through the DOM, not private methods. Query by role and accessible name.
- Mock at the HTTP boundary with `provideHttpClientTesting()` and `HttpTestingController` — don't stub your own services
  when the real one is cheap.
- Zoneless: no `fakeAsync`/`tick` for signal updates — `await fixture.whenStable()` after a change.
- New behavior ships with a test. Bug fixes ship with a regression test that fails before the fix.

---

## 14. Performance

- Lazy-load every feature route; `@defer` heavy in-page blocks.
- `NgOptimizedImage` everywhere, `priority` on the LCP image.
- No unbounded lists — paginate or virtualize past ~100 rows.
- Watch the bundle: flag anything that pushes the initial chunk past its budget in `angular.json`.
- Prefer `computed()` over recomputation in templates.
- SSR/hydration: use incremental hydration with `@defer (hydrate on ...)` where it applies; give resources an `id` so
  SSR state transfers.

---

## 15. Legacy — do not write these

| Don't                                 | Do                                             |
| ------------------------------------- | ---------------------------------------------- |
| `NgModule`                            | Standalone components                          |
| `standalone: true`                    | Omit it (default)                              |
| `changeDetection: OnPush`             | Omit it (default in v22)                       |
| `@Input()` / `@Output()`              | `input()` / `output()`                         |
| `@ViewChild` / `@ContentChild`        | `viewChild()` / `contentChild()`               |
| `@HostBinding` / `@HostListener`      | `host: {}`                                     |
| `*ngIf` / `*ngFor` / `*ngSwitch`      | `@if` / `@for` / `@switch`                     |
| `ngClass` / `ngStyle`                 | `[class.x]` / `[style.x]`                      |
| Constructor injection                 | `inject()`                                     |
| `@Injectable({ providedIn: 'root' })` | `@Service()`                                   |
| `ControlValueAccessor`                | Signal Forms `[formField]`                     |
| Manual `subscribe()` in components    | `httpResource()` / `resource()` / `toSignal()` |
| `zone.js`, `NgZone.run()`             | Zoneless + signals                             |
| `any`                                 | `unknown` + narrowing                          |
| Webpack builders                      | `@angular/build`                               |
| Karma                                 | Vitest                                         |

If you find these in existing code: **mention it, show the replacement, do not migrate it** unless asked.

---

## 16. Commands

```bash
pnpm nx serve smooth-ui-demo
pnpm nx build smooth-ui                               # ng-packagr build
pnpm nx test smooth-ui                                # Vitest (@nx/angular:unit-test)
pnpm nx test smooth-ui --include=**/sui-button/**     # single spec
pnpm nx test smooth-ui --filter="SuiButtonComponent"  # by test name
pnpm nx lint smooth-ui
pnpm nx typecheck smooth-ui
pnpm nx run-many -t lint test build typecheck         # what CI runs
pnpm nx release --dry-run                             # version from git tag, publish from dist
```

Never run `nx release`, `pnpm install`, `ng update` or any git command without approval.

---

## 17. Definition of done

Before you call a change complete:

- [ ] `pnpm nx typecheck smooth-ui` clean, no new `any`
- [ ] `pnpm nx lint smooth-ui` clean
- [ ] `pnpm nx test smooth-ui` green, new behavior covered
- [ ] New public API exported from `public-api.ts`
- [ ] Zero AXE violations on touched UI
- [ ] Nothing from §15 introduced
- [ ] Bundle budgets respected
- [ ] The user approved every file you changed

---

## 18. Commit messages

When the user asks to draft or write a commit:

- Inspect the staged changes first (`git diff --cached --stat`, `git diff --cached`) and base the message **only** on
  what is staged.
- Write the message in **English**.
- Use **Conventional Commits** style: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `build:`, `perf:`,
  `ci:`.
- Propose the message and wait for approval — never run `git commit` unprompted.
- Keep the session attribution trailers (`Co-Authored-By`, `Claude-Session`).

---

## 19. Turn checklist

Before you send any message, confirm:

1. Is it **short**? (≤3 sentences of prose)
2. Did I **ask** before changing anything?
3. Did I **offer code** if they were coding or describing code?

If any answer is no, rewrite the message.
