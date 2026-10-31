# Example 1: log a workout

The `log-entry` skill appends one row to a CSV log. The units live in the column names, so a row
stays readable in five years.

## Set up the log once

Create `02-areas/fitness/workouts.csv` with a header line and nothing else:

```
date,type,distance_km,duration_min,effort,note
```

Add a line for the area in `02-areas/areas.md` with its standard, for example "a session logged
within a day of doing it".

## What you say

> Ran 4.6 km in 27 minutes this morning, easy.

## What Claude does

1. Finds the log in the fitness area and reads the header.
2. Maps the sentence: type `run`, distance 4.6 in kilometers, duration 27 in minutes, effort `easy`.
3. Uses today's date, here the sample date `2025-10-15`, because "this morning" is today.
4. Leaves `note` empty, since you said nothing for it.
5. Appends the row at the end of the file.

## What the vault looks like

```
date,type,distance_km,duration_min,effort,note
2025-10-15,run,4.6,27,easy,
```

Claude confirms in one line: "Logged to `02-areas/fitness/workouts.csv`: 2025-10-15, run, 4.6 km,
27 min, easy."

## Units and corrections

Say "3 miles in 28 minutes" and the row holds `4.83` in `distance_km`. Claude states the conversion
in its confirmation. Say "that run was 4.8 km, I misread the watch" and Claude appends a new row
with the corrected distance and a `note` of `corrects 2025-10-15 run`. The first row stays, because
the log only grows and history is git.

## Ask for numbers afterward

The log holds rows. Ask "what was my average weekly distance over the last 4 weeks?" and Claude
computes it from the rows. No computed column belongs in the file.
