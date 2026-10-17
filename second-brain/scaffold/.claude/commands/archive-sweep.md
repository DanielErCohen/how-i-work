Find work that has finished or gone dormant and propose moving it to `04-archive/`.

Archiving is the maintenance task people skip, and skipping it is what makes a second brain slow to
search and heavy to read. The cost of a dead project sitting in `01-projects/` is paid on every future
search and every session brief.

## Gather the evidence

Use git history. A clone or sync resets every filesystem mtime and makes the whole repo look new:

```
for d in 01-projects/*/ 02-areas/*/; do
  printf '%s\t%s\t%s\n' "$(git log -1 --format=%cs -- "$d")" "$(git ls-files "$d" | wc -l | tr -d ' ')" "$d"
done | sort
```

That gives last-commit date, file count, and path per directory.

## Judge each candidate

| Signal | Reading |
|--------|---------|
| Project, no commit in 30–90 days | Ask whether it shipped. If yes, archive. |
| Project, no commit in 90+ days | Archive by default. The project needs a reason to stay. |
| Project with a goal that is now met | Archive regardless of recency. |
| Area, no commit in 180+ days, 5+ files | Dormant responsibility. Archive or admit it is not an area. |
| Directory holding only a stub README | Delete or fold into its parent. It is not carrying anything. |
| Empty directory | Delete. Placeholder folders for work that never started are noise. |

One caution: **recency of the last commit is not the same as activity.** A bulk move, a rename, or a
scripted sync touches many files at once and makes dead work look alive. Check whether the last commit
actually changed content:

```
git log -1 --stat -- <path>
```

A commit whose only change is a path rename does not count as activity.

## Propose, then move

Report a table: path, file count, last commit date, recommendation, one-line reason.

Wait for confirmation before moving anything. Then:

```
git mv <path> 04-archive/<path-basename>
```

Preserve the original folder name inside `04-archive/` so history stays searchable. Do not flatten or
rename on the way in - a renamed archive entry is an unfindable one.

After moving, update `02-areas/areas.md` or the relevant index to drop the entry.

Never archive `04-archive/` contents further, and never delete anything under it without an explicit
instruction.
