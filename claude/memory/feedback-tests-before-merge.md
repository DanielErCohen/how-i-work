---
name: feedback-tests-before-merge
description: Run the test suite and lint before opening any pull request, in every repo
type: feedback
---

Run the full test suite and the linter before opening a pull request. Do not open the PR with a "tests not run" note.

**Why:** two PRs reached review with failing tests, and the review agents spent their pass on failures CI would have caught.

**How to apply:** after the last code change and before `gh pr create`, run the repo's test and lint commands from its `CLAUDE.md`. Paste the result into the PR's "How I tested" section. If a command cannot run here, say which one and why in the PR.
