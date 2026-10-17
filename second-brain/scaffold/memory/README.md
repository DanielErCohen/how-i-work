# Memory

Claude's memory is a folder of small markdown files plus one index. This folder is that memory.
Point Claude Code at it with `autoMemoryDirectory` in `settings.json` (the setting is in the
[hooks guide](https://github.com/DanielErCohen/how-i-work/blob/main/second-brain/hooks/README.md)),
and every memory has git history.

Keep this folder outside `.claude/`. Claude Code asks before every write to a `.claude` path, which
would turn each saved memory into a prompt.

## Format

One fact per file. Each file starts with frontmatter:

```
---
name: short-kebab-name
description: one line that says when this memory applies
type: feedback | project | reference | user
---
```

- `feedback` notes record how you want Claude to work. They carry **Why** (the failure or preference
  behind the rule) and **How to apply** (when the rule applies).
- `project` notes record state that code and git history do not show: a decision, a deadline, who
  owns what.
- `reference` notes point to where something lives.
- `user` notes describe you: role, preferences, background.

## The index

`MEMORY.md` has one line per memory, under 150 characters, with a link. Keep it under 80 lines,
because it loads in every session.

## Rules

- **One fact, one home.** If the vault already holds the fact, the memory links to it and states
  nothing new.
- Do not store what the repo shows: structure, file paths, commit history.
- A memory that is wrong or unused for 90 days gets deleted. The index line goes with it.
- Write a new memory for a failure you saw twice. A one-off belongs in the conversation.

## Example

[`feedback-confirm-before-filing.md`](feedback-confirm-before-filing.md) is invented. Delete it when
you save your first real memory.
