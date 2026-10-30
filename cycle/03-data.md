# 3. Define success

What change would show that the work helped?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to draft event definitions and check whether the measurement plan covers the question. |
| What I check | I check the metric, population, date range and data source. I verify that the events are recorded before using the numbers. |
| Useful output | A success measure, its definition and checks on the data. |

Before the first user, I decide what I will measure and where the number comes from.

## What I do

- Write an event catalogue: each event, its trigger, its properties, and the question it answers.
- Pick a north star, the one number that shows the product is working, that I can read from the product's own logs. A number that needs a manual count does not qualify.
- Collect analytics only after the user consents.
- Write an instrumentation QA doc and walk it on every build, so a missing event is found before launch.

## The artifact

`analytics/event-catalogue.md`, `analytics/north-star.md` in the knowledge base. `docs/qa/instrumentation.md` in the code repo, because it goes stale when the code changes.

## What AI changes here

An agent drafts the catalogue from the spec and checks the code for events that fire without a catalogue entry, or the reverse. I review the north-star definition myself.

## Where I still check

- Every number states its date range and the filter it was computed on. Two series sit side by side only when the basis matches.
- "Never happens" needs a query built to detect the thing over a window where it would appear.
- A dashboard figure gets reconciled with the log once before I trust it.

## Example

- Wellness Coach: the north star is read from the app's own logs. Nudges are decided by rules and numbers are computed by code, so the AI writes words and never produces a figure.
