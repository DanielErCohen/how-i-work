# Second brain

A git-backed folder of markdown that Claude reads at every session start, files notes into and keeps in order.

<details>
<summary><b>Why I built it:</b> I kept re-explaining my context and pasting notes into AI chats, so I moved my notes into a folder Claude reads first.</summary>

- My second brain started in Notion, separate from the AI chats I worked in.
- Projects in ChatGPT and Claude let me share saved information between chats. I still copied context in by hand.
- After some months of coding, I moved it to markdown in git (Apr '26). Claude maps, stores and retrieves my notes with a single prompt.
- Git gives search, history and a diff for every change Claude makes.
- A weekly sweep archives what is done, because notes pile up and nothing removes them by default.

</details>

This is the empty template: the folder structure, the assistant layer, a memory format, a routine pattern and three worked examples.

## What you get

| Path | What it is |
|------|------------|
| [`SETUP.md`](SETUP.md) | The 10-minute setup path, then a first-week plan. |
| [`TIPS.md`](TIPS.md) | What holds up and what quietly rots, with the failure modes named. |
| [`REDACTION.md`](REDACTION.md) | What never gets committed, and the audit before sharing anything. |
| [`scaffold/`](scaffold) | The copyable skeleton. This is the part you take. |
| [`hooks/`](hooks/README.md) | The session-start pull and the memory setting. |
| [`examples/`](examples) | Log a workout, dictate a story, file the inbox. |

Inside `scaffold/`:

| Path | What it is |
|------|------------|
| `00-inbox/` to `04-archive/` | The five PARA folders. |
| `02-areas/areas.md`, `03-resources/resources.md` | The navigation indexes. |
| `03-resources/registry.md` | The spelling of names that dictation gets wrong. |
| `memory/` | Claude's one-fact memory notes, an index and the format. |
| `routines/` | The pattern for prompts that run on a schedule. |
| `.claude/CLAUDE.md` | Assistant instructions: structure and conventions only. |
| `.claude/commands/` | `/init`, `/capture`, `/weekly-review`, `/archive-sweep`. |
| `.claude/skills/log-entry/` | Append a row to a log, with units in the column names. |
| `note-templates/` | `project`, `area`, `decision`, `source`, `daily`. |
| `README.md.template`, `SOUL.md.template` | Your repo's front page and an optional voice file. |

## Quick start

```bash
(
  set -eu
  [ -d "$HOME/how-i-work" ] || git clone https://github.com/DanielErCohen/how-i-work.git "$HOME/how-i-work"
  mkdir "$HOME/my-second-brain"
  cp -R "$HOME/how-i-work/second-brain/scaffold/." "$HOME/my-second-brain/"
  cd "$HOME/my-second-brain"
  mv README.md.template README.md
  mv SOUL.md.template SOUL.md
  git init
  git add -A
  git commit -m "Initial second brain"
)
```

Set your git name and email if you have not. The command stops if `~/my-second-brain` already exists. Open that folder to resume an existing vault.

[`SETUP.md`](SETUP.md) walks the rest in 10 minutes. Make the repository private before the first
push, and read [`REDACTION.md`](REDACTION.md) before you consider anything else.

## Two rules

1. **One fact, one home.** A fact lives in one file and other files link to it. Nothing needs two
   edits to stay true.
2. **Files state the current conclusion. History is git.** A note reads as if it had always been
   true. The record of how it changed is `git log`.

## What decides whether it lasts

Notes accumulate by default and nothing removes them by default, so
a repo with no sweep gets slower to search every week. `/weekly-review` and `/archive-sweep` are the
load-bearing parts of the template.

## License

MIT, copyright Daniel Cohen 2026. See the repo [`LICENSE`](../LICENSE).
