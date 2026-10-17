---
type: decision
date: YYYY-MM-DD
status: active        # active | superseded | reversed
confidence: medium    # low | medium | high
review: YYYY-MM-DD    # when to revisit
superseded-by:        # filename, if status is superseded
---

# <the decision, stated as a claim>

Title this as the position taken. "Use one repo" beats "repo structure".

## Decision

What was decided, in one or two sentences.

## Context

What was true at the time that made this the right call. Written for a future reader who has forgotten
the situation - including you.

## Strongest counterargument

The best case against this decision, stated fairly. If you cannot write this section, the decision was
not examined and the confidence rating above is inflated.

## What would change my mind

The specific evidence or outcome that should trigger reversing this. Name it now, while you are honest,
rather than later when you are attached to having been right.

## Evidence

- <what this rests on: a measurement, a source, an observation, or "judgment only" - say which>

---

**This ledger is append-only.** To change a decision, write a new file, set this one's `status` to
`superseded`, and fill in `superseded-by`. Never edit a past decision into agreement with the present;
the record of having changed your mind is the most useful thing in the file.
