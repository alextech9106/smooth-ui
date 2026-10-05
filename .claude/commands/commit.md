---
description: Write a new commit accounting for new, modified, and deleted files
agent: plan
---

I want to make a commit with the new, modified, and deleted files.
Before writing the commit, prepare a plan with:

1. How you will write it, considering whether you should write more than one commit.
2. Which files you would include in each commit.
3. Edge cases and questions I need to decide before starting.
4. All commits must be written in English.
5. Show me the proposed commit message in the chat.
6. Use conventional commits format (feat:, fix:, chore:, docs:, refactor:).
7. Stage all relevant changes with git add before writing the commit message.
8. Ensure pnpm nx run-many -t lint test build typecheck passes before committing.
9. Always ask me before committing, and commit only once I give my approval.