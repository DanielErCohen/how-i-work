Run the weekly hygiene pass on this second brain. This is the ritual that keeps the system honest -
without it a second brain becomes a write-only archive within a few months.

Work through all six checks and report findings as one compact report. Propose changes; apply only
what is confirmed.

## 1. Empty the inbox

List everything in `00-inbox/`. For each item, propose a destination using the `/capture` logic.
Report the count and the age of the oldest item.

An inbox that is always empty means capture is not flowing through it - check whether notes are being
written directly into `02-areas/` instead, which is fine, but then say so plainly rather than
reporting a clean inbox as a healthy signal.

## 2. Find stale projects

Use **git history** (any clone or sync resets every mtime):

```
for d in 01-projects/*/; do echo "$(git log -1 --format=%cr -- "$d")  $d"; done | sort
```

Flag every project with no commit in 30+ days. For each, ask the real question: is it finished (move
to `04-archive/`), abandoned (archive it and say so), or genuinely slow-moving (leave it)?

"Slow-moving" is the answer that gets over-used. If a project has not moved in 90 days, the default
is archive.

## 3. Check CLAUDE.md against reality

Read `.claude/CLAUDE.md`. Verify every concrete claim it makes against the actual tree: do the folders
it names exist, do the index files it points at exist, are the conventions it states actually followed?

Report each mismatch as a line item. This check exists because instruction drift is silent - nothing
breaks, sessions just quietly get worse.

## 4. Check the indexes

Confirm `02-areas/areas.md` and `03-resources/resources.md` list what is actually present. Report
directories missing from their index, and index entries pointing at directories that no longer exist.

## 5. Scan for leaked secrets and stray cruft

```
git ls-files --cached --ignored --exclude-standard
git ls-files | grep -iE '\.(env|pem|key|p12)$|\.DS_Store$'
git ls-files | grep -E ' [0-9]+(\.|$)'
git grep -nIE '(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)' -- . 2>/dev/null
```

The first command lists files tracked *despite* matching `.gitignore`. A rule added after the first
accidental commit does nothing, so this is the check that catches caches and `.DS_Store` still being
committed. Fix with `git rm -r --cached <path>`.

The third catches sync-tool duplicates such as `note 2.md`.

If a credential matches: **report the path and the kind of credential, and leave the value out of the report.** State clearly
that rotation comes first, because `git rm` does not remove the value from history. Check for false
positives before proposing rotation - OAuth client IDs, publishable payment keys, and analytics IDs are
public by design.

## 6. Nested archives and duplicates

```
find 01-projects 02-areas 03-resources -type d \( -name archive -o -name '0*-archive' \) 2>/dev/null
```

Nested `archive/` folders inside live areas defeat the single-archive rule - everything archived
should be findable in one place. Propose consolidating them into `04-archive/`.

Also flag near-duplicate directory names that differ only in case, spaces, or hyphens. On
case-insensitive filesystems these silently collide.

---

Close with a **three-line verdict**: what is healthy, the single highest-value fix, and what to ignore
for now. Do not pad the report with items that need no action.
