---
type: project
status: active        # active | paused | shipped | abandoned
started: YYYY-MM-DD
target: YYYY-MM-DD    # the date this is meant to end. A project without one is an area.
---

# <project name>

## Outcome

What is true when this is done. One or two sentences, written so someone else could tell whether it
happened. "Improve onboarding" is not an outcome; "new users reach first value without a support
ticket" is.

## Why now

What makes this worth doing at this point rather than later.

## Next action

The single next physical step. If this line is empty, the project is paused - set `status: paused` and
be honest about it.

## Open questions

- <question, and who or what would answer it>

## Log

Newest first. Append; do not rewrite history.

- **YYYY-MM-DD** - <what happened, what it changed>

## Outcome at close

Fill this in when status becomes `shipped` or `abandoned`, before archiving. What actually happened,
and what you would do differently. This paragraph is the reason to keep the file at all - a project
archived without it leaves no reusable knowledge behind.
