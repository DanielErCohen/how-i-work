# Areas index

Navigation hub for `02-areas/`. One line per area. Keep it current - `/weekly-review` checks this file
against the actual directories.

An area is an ongoing responsibility with a standard to maintain and no end date. If it has an end
date, it belongs in `01-projects/`.

| Area | What it covers | Standard |
|------|----------------|----------|
| `<area-slug>/` | <one line> | <what "kept up" means> |

---

## Adding an area

1. Create `02-areas/<area-slug>/` using `note-templates/area.md`.
2. Add a row above.
3. State the standard. An area without one cannot be reviewed, and will quietly become a junk drawer.

## Retiring an area

When something stops being a live responsibility, `git mv` it to `04-archive/` and delete its row.
Areas accumulate faster than they retire; the weekly review is where you push back on that.
