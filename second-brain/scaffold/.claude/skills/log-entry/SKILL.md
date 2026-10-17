---
name: log-entry
description: Append one row to a log (a CSV file) from a sentence you say, with units in the column names. Use when I report something to record, such as a workout, a purchase, a reading or a measurement, or say "log this".
---

# Log entry

Append one row to a log. A log is a CSV file with a header line, kept in the area that owns it, for
example `02-areas/<area>/<name>.csv`.

## Steps

1. **Find the log.** Use the file I name. If I name none, pick the log in the area that matches the
   topic. If two logs match or none does, ask which one. Never create a log without asking.
2. **Read the header.** Each column name states its unit, such as `distance_km`, `duration_min` or
   `weight_kg`. Map what I said to the columns.
3. **Convert units to the header's units.** "5 miles" becomes `8.05` in a `distance_km` column.
   Say the conversion in your confirmation.
4. **Date.** Use today's date as `YYYY-MM-DD` unless I give another. Resolve "yesterday" and
   weekdays against today's date.
5. **Leave unknown columns empty.** Never fill a column with a guess.
6. **Append the row at the end of the file.** Never edit, sort or delete an older row. A correction
   is a new row that says what it corrects in the `note` column.
7. **Confirm in one line.** Show the row exactly as written, with the units named, and the file path.

## Example

Header: `date,type,distance_km,duration_min,effort,note`

I say: "Ran 4.6 km in 27 minutes, easy."

Row appended: `2025-10-15,run,4.6,27,easy,`

Confirmation: "Logged to `02-areas/fitness/workouts.csv`: 2025-10-15, run, 4.6 km, 27 min, easy."

## Rules

- A log only grows. History is git.
- Keep the value of every column in the unit its header names.
- Do not add a computed column. Compute pace, totals and trends when I ask, from the rows.
