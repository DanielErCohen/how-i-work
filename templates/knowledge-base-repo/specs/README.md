# specs

One file per feature. Anchor each to a base commit of the code repo, so a reader knows which code it describes.

```
# <Feature>

Base commit: `<code-repo>@<sha>`
Decision record: `decisions/YYYY-MM-DD-name.md`

## Problem and user need
## Desired behaviour
Product-level rules the implementer works against.
## Out of scope
## Success metric
The event or number that shows it works, from the event catalogue.
## Open questions
Each with a default.
```

The how belongs to the implementer. Name file and line pointers only where a value already exists, and say "reconcile with it, do not recompute".
