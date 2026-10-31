# Tips

What holds up over time and what quietly rots, with the failure modes named. Each item is a pattern
I saw in my own vault or expect in yours.

---

## The instruction file goes stale first

The assistant config is the fastest-rotting file in the repo, and its rot is invisible because
nothing errors. A project list in `.claude/CLAUDE.md` is true on the day you write it. Projects get
renamed and finished, new directories appear, and the file keeps describing last quarter. Every
session starts from it and starts wrong.

**The fix:** put nothing volatile in the instruction file. Structure, naming rules and the
sensitive-data policy change once a year, so they belong there. Project lists, priorities and folder
inventories belong nowhere, because the filesystem and git history answer those questions and cannot
go stale. The scaffold's `.claude/CLAUDE.md` has a section that states this rule, and `/weekly-review`
checks the file against the tree.

The general principle: anything you have to remember to update, you will stop updating. Prefer
generated over maintained.

---

## One fact, one home

A fact that lives in two files will diverge. The second copy starts as a convenient summary and ends
as a contradiction nobody notices.

- Link to the file that owns a fact. Leave the fact itself in that file.
- A summary file that restates other files needs a regular rewrite. Prefer an index that lists
  titles and links.
- A mirror (the same file in two repos, say) needs a guard: a check that fails when the copies
  differ. Without a guard, delete the mirror.
- Memory notes follow the same rule. If the vault holds the fact, the memory links to it.

---

## Files state the current conclusion. History is git.

A note that carries its own revision trail ("changed from X to Y after review") makes the reader
reconstruct the answer. State the answer as if it had always been true. `git log -p -- <file>` is the
history, and it is exact.

Two exceptions: logs and decision records. A log only grows, and a decision record is append-only,
so each supersession gets its own file.

---

## Use git history to judge activity

Filesystem mtimes tell you nothing about a note. Clone the repo, sync a folder, restore a backup or
run a bulk rename, and every mtime becomes today. An audit run against a fresh clone concludes that
everything was modified today, which is useless.

Commit dates are the real record:

```bash
git log -1 --format='%cr' -- 01-projects/some-project   # when did this last really change
git log --format='%ci' --name-only -20                  # what has moved recently
```

One caveat: a recent commit is not the same as activity. A bulk move, a rename sweep or a
find-and-replace touches many files without anyone thinking about them. Check `git log -1 --stat`. A
last commit that touched hundreds of files was maintenance.

Scheduled jobs that write state back into the repo add commits too. Filter bot authors out before you
draw conclusions:

```bash
git log --format='%an' | sort | uniq -c | sort -rn
```

---

## Areas outlive projects, so build around areas

Projects are supposed to end and areas are supposed to persist. A second brain accumulates value in
`02-areas/` and stages work in `01-projects/`.

- Invest structure in areas: each gets an index, a stated standard and a review cadence.
- Expect `01-projects/` to be mostly dormant at any moment, and sweep it regularly. A stale project
  directory is a finished project nobody archived.

---

## Nothing leaves unless something makes it leave

This is the whole game. Notes accumulate by default and nothing removes them by default.

| Symptom | What it means |
|---------|---------------|
| Finished projects stay in `01-projects/` | The sweep is not running |
| Archive folders inside live folders | "Is this live?" has no single answer |
| Superseded folders left in place | A newer copy exists, and search finds both |
| An inbox holding only a placeholder | Capture goes somewhere else, so the inbox is decorative |

A nested archive feels tidy and does damage. `01-projects/thing/archive/` looks like housekeeping,
but now no sweep can find the dead material. **A project never contains its own archive.** When a
project ends, the whole directory moves to `04-archive/`. If it does not belong there, delete it.

Areas are the exception. An area runs for years and accumulates superseded material, such as an old
strategy doc, that loses its meaning in `04-archive/` away from the area it belongs to. So
`02-areas/some-area/archive/` is fine. The test is whether the parent has an end date: with one, a
single archive at the root, and without one, a local archive keeps the context.

**The fix is a scheduled sweep.** `/weekly-review` and `/archive-sweep` exist because good intentions
do not survive a busy month. Put the review in your calendar.

---

## An index per directory

Without an index, finding anything means either knowing where it is or grepping. An index is three
lines of work: what the folder holds, one line per child, and what the folder is for. It also shows
when a folder has drifted from its purpose, because the line you write does not fit.

Add one to any directory with more than about five children. The scaffold seeds
`02-areas/areas.md` and `03-resources/resources.md` as examples.

---

## Pick one linking convention

- **Relative markdown links** (`[thing](../02-areas/thing/note.md)`) render on GitHub, work in any
  app and break loudly when you move a file.
- **Wiki-links** (`[[note-name]]`) are convenient inside Obsidian, invisible on GitHub and silently
  broken everywhere else.

Half-adopting the second gives you the costs of both. Unless you work in Obsidian every day, use
markdown links.

Dense linking matters less for solo use than people expect. Search is fast, directory structure is
free, and a link pays for itself only when it captures a connection you would not have searched for.

---

## A `.gitignore` rule does not untrack a tracked file

`.gitignore` only affects files git is not already tracking. Add a rule for a file you already
committed and git keeps tracking it, silently, forever. The rule is usually added after the first
accidental commit, and adding it feels like the fix.

```bash
# what is tracked despite being ignored
git ls-files --cached --ignored --exclude-standard

# stop tracking without deleting from disk
git rm -r --cached .DS_Store
git commit -m "Untrack files already covered by .gitignore"
```

Two follow-on traps:

**Case variants slip past the rule.** A bulk lowercasing pass can rename `.DS_Store` to `.ds_store`
and the pattern stops matching. Sweep case-insensitively:

```bash
git ls-files | grep -i '\.ds_store$'
```

**A broad pattern costs more than the mess it cleans.** The obvious fix for Finder's `file 2.md`
duplicates is a `* 2.*` glob, and it also swallows `Sprint 2.md`. A note that never gets committed
because an ignore rule ate it is the hardest loss to notice. Ignore the unambiguous patterns and
catch the rest with a periodic sweep. Test a wildcard before you add it:

```bash
git check-ignore -v --no-index 'path/that/should/be/safe.md'
git ls-files | grep -E ' [0-9]+(\.|$)'
```

---

## Filesystem gotchas that bite once

**Case consistency.** Pick lowercase and hold it. One capitalized folder among lowercase siblings
means every path written from memory, every glob and every instruction-file reference has to get the
exception right, and renaming it later is a large commit. Do it in week one. macOS is case-insensitive
and git is not, so a rename that changes only case takes two steps:

```bash
git mv 02-Areas 02-areas-tmp && git mv 02-areas-tmp 02-areas
```

**Separators.** One folder with an underscore among hyphenated siblings costs the same way.

**Sync-tool duplicates.** Finder and cloud sync clients produce `file 2.md` artifacts, and they get
committed. The scaffold's `.gitignore` catches the common patterns, and the sweep above catches the rest.

**Non-ASCII filenames.** They work, but git escapes them in output, which looks like corruption the
first time. `git config core.quotePath false` turns the escaping off.

**Tool-migration debt.** When you stop using an editor or tool, delete its config in the same commit.
A leftover config file implies support that does not exist.

---

## Keep media out, or set up LFS on day one

Git stores every version of every binary forever. A second brain full of screenshots gets slow to
clone and never gets faster, and the repair is a history rewrite. Decide at the start: keep images
small and few, use [Git LFS](https://git-lfs.com) from the first commit, or keep media outside the
repo and link to it. Binary files that matter live in a cloud drive, with one note in the vault that
maps what is where.

---

## Secrets have no undo

Everything else in this document recovers with a `git mv`. A committed credential does not: deleting
the file leaves the value in history, so **rotation comes first and editing second.** See
[REDACTION.md](REDACTION.md).

The realistic way in is a pasted session: an API experiment, a setup transcript or a debugging log
that seemed worth keeping. Read anything you paste for values first. Scan on a schedule instead of
trusting recall, with `git grep -lIE` so only paths print. `/weekly-review` does this and reports the path and the kind of credential only.

---

## Practices worth keeping

**Write the "why I saved it" line.** One line on why a saved article matters. It takes five seconds
and separates a resource folder from a pile. If you cannot write the line, skip the file.

**Keep a decision log per area.** Append-only and dated, with the counterargument you rejected and
what would change your mind. After six months it is the only part of the repo that recovers
reasoning. The format is `note-templates/decision.md`.

**Keep notes short and many.** One topic per file beats a 3,000-line running document.

**Delete things.** Deleting is reversible, because it is in git. A kept note costs a little every time
you search.

**Kill rituals that produce nothing.** If three weeks of daily notes say "nothing much", stop writing
daily notes.

---

## What to check when it feels broken

```bash
# where the mass actually is
git ls-files | awk -F/ '{print $1"/"$2}' | sort | uniq -c | sort -rn | head -20

# what has genuinely moved lately, bots excluded
git log --format='%ci %an' --name-only --no-merges -40 | grep -v 'bot'

# dormant project directories
for d in 01-projects/*/; do echo "$(git log -1 --format='%cr' -- "$d")  $d"; done | sort

# nested archives that should not exist
find . -type d -name 'archive*' -not -path './04-archive*' -not -path './.git/*'

# empty directories left behind by moves
find . -type d -empty -not -path './.git/*'
```

Run these quarterly. Each takes a minute.
