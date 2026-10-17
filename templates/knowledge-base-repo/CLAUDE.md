# <Product name> knowledge base

<One sentence: what the product is, for whom, and its stage.>

Code lives in `<owner>/<code-repo>`. This repo holds prose only. A doc belongs in the code repo if it goes stale when the code changes.

## Map

- `product/`: problem, landscape, the product doc. The product doc wins any disagreement.
- `research/`: dated files, `YYYY-MM-DD-topic.md`, each with sources.
- `decisions/`: one-page records that stay as written. A new record supersedes an old one.
- `open-questions.md`: each question carries a default that applies if nobody answers.
- `beliefs.md`: each belief has a "wrong if" threshold.
- `sprints/YYYY-MM-DD-name/`: goal, done-when, one scope question, lane specs.
- `specs/`: feature specs, each anchored to a base commit of the code repo.
- `analytics/`: event catalogue, north star, dated reads.
- `legal/`: policies and reviews.
- `qa-findings/`: findings from reviews, one file per walk.

## Conventions

- Files state the current conclusion. History is git.
- Dates as `YYYY-MM-DD`. Every number carries a unit and a date range.
- One fact, one home: update the file that owns it and link to it from elsewhere.
- Keep binaries out of the repo. Link to the shared drive.

## Rules for Claude

- Read the map, then only the files the task needs.
- Research and recon go to the `researcher` agent. Challenge and red-team go to the `red-team` agent.
- A decision change needs a new record that names the strongest counter.
- Anything irreversible waits for <owner>.
