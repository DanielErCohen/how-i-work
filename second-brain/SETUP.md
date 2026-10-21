# Setup

A working vault in 10 minutes, then a first week that gets the repo past the empty-scaffold stall.

Adapt the scaffold to you after the first setup: see [Make it yours](../README.md#make-it-yours).

## Prerequisites

- `git`
- A text editor that opens a folder of markdown files
- Claude Code, for the commands, the skill, the hook and the memory setting. The scaffold works
  without it. You lose `/init`, `/capture`, `/weekly-review`, `/archive-sweep` and `log-entry`, and
  keep every file.
- Optional: Obsidian or a similar viewer pointed at the folder, for reading

## The 10-minute path

**Minutes 0 to 2: copy the scaffold.**

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

**Minutes 2 to 4: fill in `.claude/CLAUDE.md`.** Replace the two language placeholders. Then read the
section "Do not enumerate active work in this file" and the section "Two rules for every file". Keep
the file under about 100 lines, because every line loads in every session.

**Minutes 4 to 6: register the memory folder and the session-start pull.** Both go in
`~/.claude/settings.json`. The exact entries are in [`hooks/README.md`](hooks/README.md). Set
`NOTES_REPO` to `~/my-second-brain`.

**Minutes 6 to 8: start Claude in the vault.**

```bash
cd ~/my-second-brain && claude
```

Run `/init`. An empty vault reports almost nothing, and that is the right answer. The brief gets
useful in week two.

**Minutes 8 to 10: capture and file three notes.** Drop three loose markdown files into
`00-inbox/`: a thing you want to remember, a task you owe someone, a link you saved. Run `/capture`.
Claude proposes a home for each one and leaves any ambiguous item in the inbox. Commit.

Make the remote private before the first push:

```bash
gh repo create my-second-brain --private --source=. --push
```

Private is the default to keep. A second brain collects addresses, figures, health notes and other
people's words faster than you will notice. Read [`REDACTION.md`](REDACTION.md) first.

## First week

The scaffold stays empty unless you fill it. Five days of small work fix that.

**Day 1, capture only.** Dump everything into `00-inbox/` as loose markdown files. Create no
folders. Decide nothing about where things belong. Twenty files in the inbox is a good first day.

**Day 2, name your areas.** List the things you are responsible for that have no end date, such as
your work and each ongoing personal responsibility. Create a directory per area under `02-areas/`
and fill in `02-areas/areas.md`. Most people land on 8 to 15 areas. A list of 40 is a list of topics.

Each area needs a **standard**: one line on what "kept up" means. Without one, the area cannot be
reviewed and becomes a junk drawer.

**Day 3, name your live projects.** List only what you work on now, each with an end state you would
recognise. Use `note-templates/project.md`. Five projects is a lot. If your list has twenty, most of
them are areas or wishes.

**Day 4, file the inbox.** Move the day-one captures into areas and projects. An item you cannot place
in ten seconds stays in the inbox. An item you no longer care about gets deleted instead of filed.

**Day 5, run the review.** Run `/weekly-review`. Fix whatever it flags, including anything in
`.claude/CLAUDE.md` that no longer matches the tree. This is the habit the whole system rests on.

## Optional pieces

- **`SOUL.md`** describes how you write, so an assistant can draft in your voice. It earns its keep
  if the assistant regularly writes prose that goes out under your name. If it never does, delete the
  file, because an unused voice file collects half-updates.
- **`03-resources/registry.md`** is worth filling the first time dictation gets a name wrong.
- **`routines/`** waits until you have run a command by hand for two weeks.

## Migrating from an existing tool

An export from Notion, Evernote or Apple Notes is a folder of markdown with export artifacts. Clean
it once, on the way in:

| Artifact | Fix |
|----------|-----|
| Hash suffixes (`Some Note 0a1b2c3d….md`, 32 hex characters) | Strip them with a one-line rename script. |
| Spaces and mixed case in paths | Rename to `lowercase-with-hyphens` before the first commit. |
| Kanban boards exported as CSV | Convert to markdown checklists, or drop them. |
| Embedded images | Keep them beside the note that owns them. |
| Wiki-links (`[[Note Name]]`) | Convert to relative markdown links, or accept that they will break. |

Two rules for the import:

1. **Rename before the first commit.** Renames after the fact bloat history and make every `git log`
   harder to read.
2. **Import a selection.** An export invites pruning, and whatever you skip is still in the export
   file.

## Media

Images, PDFs and video in a git repo are permanent and compress badly. Every version of every binary
stays in history, and clone time grows with it. Keep media small, set up [Git LFS](https://git-lfs.com)
on day one, or keep binaries outside the repo and link to them. Retrofitting LFS means rewriting
history. The `.gitignore` in the scaffold has a commented-out media block.

## Verify the install

```bash
git log --oneline          # one commit
ls -a                      # .claude/ .gitignore 00-inbox/ ... 04-archive/ memory/ routines/ README.md
git grep -c . -- .claude/CLAUDE.md   # exists and is non-empty
```

In Claude Code, `/init` should run and report the empty state without errors.
