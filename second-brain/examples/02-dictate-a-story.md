# Example 2: dictate a story

A voice note arrives as a transcript, and transcripts get names wrong. Claude checks every name
against `03-resources/registry.md` before it files the entry.

## The registry

`03-resources/registry.md` holds one row per name that dictation misspells:

| Name | Kind | Notes | Heard as |
|------|------|-------|----------|
| Sam Raven | person | friend | Sam Raiven, Sam Rayven |
| Robin Hale | person | friend | Robyn, Robin Hail |
| Lakeside Park | place | the park by the river | Lake Side Park, Lakesight Park |

## What you say

You dictate this into your phone and paste the transcript:

> Yesterday we went to Lake Side Park with our friends Sam Raiven and Robyn. Robyn brought the big
> kite and it got stuck in a tree for twenty minutes. Sam climbed up and got it down. Dinner at
> Mill Street Bakery, the 50th time this year.

## What Claude does

1. Reads the transcript and lists every name: Lake Side Park, Sam Raiven, Robyn, Mill Street Bakery.
2. Looks each one up. "Lake Side Park" is a known misspelling of Lakeside Park. "Sam Raiven" is Sam
   Raven. "Robyn" is Robin Hale. "Mill Street Bakery" matches as written.
3. Checks the number. "The 50th time this year" does not fit a bakery you visit weekly, and
   dictation hears "15th" as "50th". Claude flags it and asks.
4. Resolves "yesterday" against today's date, `2025-10-15`, so the entry is dated `2025-10-14`.
5. Appends the corrected entry to `02-areas/stories/stories.md` and lists the three changes it made.
   A name that is not in the registry would stay as dictated, with a flag that asks whether it earns a
   row.

## What the vault looks like

```
## 2025-10-14

We went to Lakeside Park with our friends Sam Raven and Robin Hale. Robin brought the big kite and it
got stuck in a tree for twenty minutes. Sam climbed up and got it down. Dinner at Mill Street Bakery,
the 15th time this year.
```

Claude's reply: "Filed to `02-areas/stories/stories.md` under 2025-10-14. Fixed Lake Side Park to
Lakeside Park, Sam Raiven to Sam Raven and Robyn to Robin. Changed '50th' to '15th' after your
answer."

## Why a registry

A fix you make once becomes a row, and every later transcript gets it for free. The registry also
keeps spellings in one place, which is the rule of one fact, one home.
