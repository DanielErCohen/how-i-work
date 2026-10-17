# Memory

Claude's auto memory is a folder of small markdown files plus one index. Point `autoMemoryDirectory` at a folder inside a git repo, so every memory has history.

## Format

One fact per file. Each file starts with frontmatter:

```
---
name: short-kebab-name
description: one line that says when this memory applies
type: feedback | project | reference | user
---
```

- `feedback` notes record how you want Claude to work. They carry **Why** (the failure or preference behind the rule) and **How to apply** (when the rule kicks in).
- `project` notes record state that code and git history do not show: a decision, a deadline, who owns what.
- `reference` notes point to where something lives.
- `user` notes describe you: role, preferences, background.

## The index

`MEMORY.md` has one line per memory, under 150 characters, with a link. Keep it under 80 lines, since it loads in every session.

```
- [Tests before merge](feedback-tests-before-merge.md) - run the suite before opening a PR; skip nothing
- [Checkout redesign](project-checkout-redesign.md) - freeze on 2026-11-01; decisions in the knowledge base
```

## Rules

- Do not store what the repo already shows: code structure, commit history, file paths.
- Delete a memory that is wrong or unused for 90 days.
- A fact that belongs in the knowledge base lives there, and the memory links to it.

## Examples

- [`feedback-tests-before-merge.md`](feedback-tests-before-merge.md)
- [`project-checkout-redesign.md`](project-checkout-redesign.md)

The examples are invented.
