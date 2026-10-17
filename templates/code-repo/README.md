# Code repo template

The repo for code, plus the docs that go stale when the code changes. Prose that outlives a release (research, decisions, specs, analytics, legal) lives in the [knowledge-base repo](../knowledge-base-repo/README.md).

```
code-repo/
  CLAUDE.md                          the map Claude reads first
  README.md
  .github/pull_request_template.md   PR template with "fit with the product doc"
  docs/
    README.md                        what belongs here
    architecture/                    structure and data flow
    qa/                              QA plans per build, instrumentation QA
  src/                               application code
  tests/                             tests
  .claude/agents/                    project agents, if any
```

## Use

1. Copy the folder into a new git repo.
2. Fill in `CLAUDE.md` first. Everything else follows from the map.
3. Keep `CLAUDE.md` under 60 lines. Link to docs for detail.
