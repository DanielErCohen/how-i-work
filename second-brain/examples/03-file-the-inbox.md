# Example 3: file the inbox

`/capture` moves loose notes out of `00-inbox/` into the right PARA folder and leaves the ones it
cannot place.

## Before

`00-inbox/` holds five files:

```
00-inbox/
  2025-10-13-bike-shop-quote.md
  2025-10-14-article-on-sleep.md
  2025-10-14-ideas-for-the-trip.md
  2025-10-15-call-the-bike-shop.md
  2025-10-15-wifi-notes.md
```

## What you say

> /capture

## What Claude does

It reads each file and asks the PARA question in order: committed outcome with an end, standard
with no end, reference with no action, or already dead.

| File | Proposed home | Why |
|------|---------------|-----|
| `2025-10-13-bike-shop-quote.md` | `01-projects/bike-repair/` | A committed outcome with a finish line. Creates the project from `note-templates/project.md`. |
| `2025-10-14-article-on-sleep.md` | `03-resources/sleep/` | Reference with no action. Its "Why I saved it" line is empty, so Claude asks for one line first. |
| `2025-10-14-ideas-for-the-trip.md` | stays in `00-inbox/` | A project if the trip is booked, a resource if it is a wish. Claude asks which. |
| `2025-10-15-call-the-bike-shop.md` | `01-projects/bike-repair/` | The same outcome as the quote. |
| `2025-10-15-wifi-notes.md` | stays in `00-inbox/` | Contains a network password. Claude flags it and stops, because a secret does not get filed. |

Claude moves the clear items with `git mv`, applies the matching note template, adds the new
directories to `02-areas/areas.md` or `03-resources/resources.md`, and reports the table above. It
deletes nothing without asking.

## After

```
00-inbox/
  2025-10-14-ideas-for-the-trip.md
  2025-10-15-wifi-notes.md
01-projects/bike-repair/
  2025-10-13-bike-shop-quote.md
  2025-10-15-call-the-bike-shop.md
03-resources/sleep/
  2025-10-14-article-on-sleep.md
```

You answer two questions and move the password to a password manager. The inbox is down to the files
that need a decision from you. `/weekly-review` repeats the same pass once a week.
