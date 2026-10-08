---
description: SDD · Validate the spec FR by FR (tests + Chrome DevTools)
agent: accept edits
---

Go through specs/$0/spec.md requirement by requirement. For each FR state which test covers it and the result of running
it with pnpm nx run smooth-ui:test.

For FRs that the tests cannot verify (what is seen in a browser, or what only a build shows), verify them with the
Chrome DevTools MCP on the demo application (including the 375 px mobile view) or by building.

If any FR is not covered or fails, say so clearly. Do NOT fix anything yet. Then check the completion criteria and give
me a verdict: is the spec fulfilled?
