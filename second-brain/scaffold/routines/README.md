# Routines

A routine is a prompt that runs on a schedule and leaves something behind: a note, a log row, a
report. The pattern keeps the prompt in git, so you can read, review and roll it back.

## The pattern

Each routine is one markdown file in this folder with six parts:

1. **Goal.** One sentence on what exists after a run that did not exist before.
2. **Inputs.** The files, commands or inboxes it reads. Name the paths.
3. **Steps.** A short numbered list. Keep judgement calls out of it; say what to do when a step
   finds nothing.
4. **Output.** Where the result goes: a dated note, an appended log row, a message to you.
5. **State.** What the next run needs to know about this one, such as a last-run date written to a
   log. State lives in a file in git. A routine reads it at the start and updates it at the end.
6. **Stop rule.** When the routine stops by itself: it fails twice in a row, an input is missing,
   or the output would touch something outside its folder.

## Schedule it

Any scheduler works. Claude Code can run a prompt on a schedule, a cron entry can call
`claude -p "<contents of routines/weekly-review.md>"`, and a calendar reminder works for a routine
you run by hand. Start by hand for two weeks, then schedule what you kept running.

## Rules

- A routine writes only into its own output folder or log. It never edits a note you wrote.
- A routine that fails twice is paused, and a routine paused for a month is deleted.
- Review the prompt when the output drifts. The prompt is the thing to fix.

## Example: weekly review

Save as `routines/weekly-review.md`. It wraps the `/weekly-review` command.

```
Goal: one dated report of what to fix in this vault this week.
Inputs: 00-inbox/, 01-projects/, 02-areas/areas.md, routines/state.md
Steps:
1. Run the /weekly-review checks.
2. Compare the inbox count with the count in routines/state.md.
3. Write the report to 02-areas/reviews/YYYY-MM-DD-review.md.
4. Update routines/state.md with today's date and the inbox count.
Output: the report, plus one line in routines/state.md.
Stop rule: if 00-inbox/ is missing, stop and say so.
```
