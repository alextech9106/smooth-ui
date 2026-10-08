# Smooth UI Constitution

Six non-negotiable principles. A change that breaks one is wrong, unless this file is amended first.

1. **Simple stack.** Angular, RxJS and tslib are the only runtime dependencies. Check: no `package.json` gains an entry
   without owner approval.
2. **Spec first.** `specs/NNN-<name>/spec.md` is the source of truth. Check: a public API or behaviour change updates
   its spec in the same commit.
3. **Logic apart from interface.** Templates bind and emit; state derives in `computed()`; browser side effects live in
   services. Check: no storage, network or DOM globals in components.
4. **Tests with what is installed.** Vitest and TestBed only. Check: every behaviour change ships a spec beside the
   component and `pnpm nx run smooth-ui:test` is green.
5. **User data stays with the user.** No network, telemetry or logging of field values; only the theme preference is
   persisted. Check: `localStorage` appears only in `theme.service.ts`.
6. **English everywhere.** Code, comments, commits, docs and default texts are in English. Check: every user-visible
   string is an input or can be overridden by one.

Amendments need the owner's explicit approval and a note in `MEMORY.md`.
