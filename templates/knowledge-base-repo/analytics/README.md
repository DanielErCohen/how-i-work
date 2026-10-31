# analytics

- `event-catalogue.md`: one row per event: name, trigger, properties, the question it answers, consent requirement.
- `north-star.md`: the metric, its definition, the log it is read from, the filter, the date range.
- `YYYY-MM-DD-read.md`: a dated read with the numbers, their basis and the conclusion.

Rules:

- A number carries its unit, its date range and the filter it was computed on.
- Two series sit side by side only when the basis matches.
- Analytics are consent-gated: the catalog marks which events need consent.
- The instrumentation QA doc lives in the code repo at `docs/qa/instrumentation.md`.
