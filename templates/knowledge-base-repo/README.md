# Knowledge-base repo template

The repo for everything written in prose. Claude reads `CLAUDE.md` at session start and finds the rest from the map.

```
knowledge-base-repo/
  CLAUDE.md              the map Claude reads first
  open-questions.md      every open question with a default
  beliefs.md             what we believe, with a "wrong if" threshold
  product/               problem, landscape, product doc
  research/              dated research files
  decisions/             one-page decision records
  sprints/               one folder per sprint
  specs/                 specs for features, anchored to a base commit
  analytics/             event catalog, north star, reads
  legal/                 policies, reviews, jurisdiction notes
  qa-findings/           findings from reviews and QA walks
```

## Use

1. Copy the folder into a new git repo.
2. Fill in `CLAUDE.md`: product, the code repo link, the conventions.
3. Delete a folder you will not use in the first month. Add it back when needed.

Binaries (images, PDFs, video) live in a shared drive and are linked from here. Prose stays in git, where history is the changelog.
