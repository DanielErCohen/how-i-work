# Second brain - Claude instructions

This repository is a personal second brain organized with the **PARA method**. Your job is to help
capture, find and work with knowledge across it.

Replace the two `<angle-bracket>` language placeholders below, delete the sections that do not apply,
and keep this file short. A long instruction file goes stale.

---

## PARA structure

| Folder | Purpose |
|--------|---------|
| `00-inbox/` | Unfiled capture. Everything lands here first. Emptied during the weekly review. |
| `01-projects/` | Outcomes actively committed to, with a goal and an end. Short-term and finite. |
| `02-areas/` | Ongoing responsibilities with a standard to maintain. No end date. |
| `03-resources/` | Reference material with no current action attached. |
| `04-archive/` | Completed or inactive. Read when asked. File no new work here. |

Projects end and areas do not. When a project ships, it moves to `04-archive/`. When an area stops
being a live responsibility, it moves to `04-archive/` too.

Two more folders hold the assistant's own material: `memory/` (one-fact notes, see `memory/README.md`)
and `routines/` (prompts that run on a schedule, see `routines/README.md`).

---

## Two rules for every file

1. **One fact, one home.** A fact lives in exactly one file. Other files link to it. No file
   summarizes another, and no copy exists unless a check fails when the copies differ.
2. **Files state the current conclusion. History is git.** A note reads as if it had always been
   true: no inline revision notes, no "changed from X to Y after review", no trail of superseded
   intermediate decisions. Use `git log` for the history. Notes whose purpose is the log (weekly
   reviews, append-only logs, dated journals) are the exception.

---

## Do not enumerate active work in this file

Do **not** list current projects, priorities or folder inventories here. Such a list goes stale
within weeks and sends every future session looking for work that has been archived, while it hides
work that started since.

Point at something that updates itself:

- `02-areas/areas.md` and `03-resources/resources.md` are the navigation indexes. Read those.
- For "what is active right now", list the directories and check recent commit dates. The filesystem
  and git history are always current.

Keep here only what is **structurally true**: the PARA rules, naming conventions, languages, the
sensitive-data rule and where the indexes live.

---

## Naming conventions

- Directories and files: `lowercase-with-hyphens`. No spaces, no mixed case.
- Dated notes: `YYYY-MM-DD-slug.md`. Sorts chronologically and reads the same in every locale.
- One topic per file. If a note passes roughly 25 KB, split it and link the parts.
- Attachments live in a folder beside the note that owns them, with the same slug.
- Binary files (PDFs, images, recordings) live outside git. Link them from the note that owns them.

Pick one convention and apply it everywhere. Two conventions make every future search guess.

---

## Languages

Primary language: `<primary-language>`. Also present: `<other-languages, or delete this line>`.
Match the language of the surrounding context when writing new notes.

---

## Sensitive data

This repo may contain personal material. Rules, in order of priority:

1. **Never display, log, copy or echo** credentials, API keys, tokens, account numbers, government
   ID numbers or medical results. If you meet one while reading, skip it silently and carry on.
2. **Never commit a secret.** If you notice one already committed, stop and say so. Rotating the
   credential comes before editing the file, because git history keeps the old value.
3. Treat anything about a **third party** (feedback, transcripts, someone else's medical or financial
   detail) as belonging to that person. Keep it out of summaries and shared output unless asked.

See `REDACTION.md` in the template for the full pre-publish checklist.

---

## How to help

**Finding things.** Start from the indexes, then search. Prefer `03-resources/` and `02-areas/` over
`04-archive/` unless asked for history.

**Filing new notes.** Route by the PARA question, in this order:
- Committed outcome with an end: `01-projects/`
- Standard to maintain indefinitely: `02-areas/`
- Reference with no action: `03-resources/`
- Unsure: `00-inbox/`, and let the weekly review decide

Filing into `00-inbox/` is a valid answer. A wrong guess into a permanent location costs more than
waiting.

**Logs.** To record a measurement or an event (a workout, a purchase, a reading), use the
`log-entry` skill. It appends one row with units and never edits an older row.

**Names.** Check people and place names in dictated text against `03-resources/registry.md`. Flag a
name that is not in the registry and leave it as dictated.

**Updating indexes.** When you add a directory under `02-areas/` or `03-resources/`, add a line to
that folder's index file. When you archive something, remove its line.

**Memory.** Save a new memory only for something the repo does not already show. One fact per file,
with a Why and a How to apply. Format in `memory/README.md`.

---

## Commands

| Command | What it does |
|---------|--------------|
| `/init` | Session-start brief: what is active, what changed, what is stale. |
| `/capture` | File unsorted items from `00-inbox/` into the right PARA folder. |
| `/weekly-review` | Empty the inbox, surface stale projects, check this file against reality. |
| `/archive-sweep` | Find finished projects and dormant areas, propose archive moves. |

---

## Maintenance

This file decays silently. `/weekly-review` checks it against the actual tree. When a convention here
stops matching what the repo does, fix the file the same day. An instruction file that contradicts the
repo teaches every future session to distrust it.
