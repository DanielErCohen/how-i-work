# 9. Measure and learn

Did the change help, and what should we do next?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to pull defined measures, check the inputs and draft a readout against the decision we made. |
| What I check | I check comparable populations and time windows, then decide what the result supports. An unrun test stays an open question. |
| Useful output | A dated readout and the next decision or research question. |

The detail below shows how I apply this in my side projects. Use the question and output with your own team's documents.

I read the north star and retention from the product's own logs, then go back to step 1 with what I learned.

## What I do

- Read the north star and retention on a fixed rhythm, with the date range and filter written next to each number.
- Check each belief against its "wrong if" threshold.
- Write what changed my mind as a new decision record.
- Return to Frame the problem with the next question.

## The artifact

`analytics/YYYY-MM-DD-read.md` with the numbers and the conclusion. Updated `beliefs.md`.

## What AI changes here

An agent pulls the figures, runs the validation checks and drafts the read. The [metrics dashboard pattern](../routines/metrics-dashboard-refresh/README.md) includes example checks. Adapt them to your schema and verify the results before publishing.

## Where I still check

- Two series sit side by side only when the basis matches.
- A claim like "nobody does X" needs a query built to detect X over a window where it would appear.
- I decide whether a belief survived. The agent reports the number.

## Example

- Wellness Coach: the 6- and 12-month checks will ask whether target users open it daily and whether a friend keeps using it. Friends are biased evidence, and the read will say so.
- Sparktale: the kill test reads the cost of each book created, the cost of each paid download and conversion compared with unpaid traffic at the end of the 8 weeks. As of Oct '26 the test has not started.
