# <Product name> code

<One sentence: what this repo builds.> Product doc and decisions live in `<owner>/<knowledge-base-repo>`. The product doc wins any disagreement with this repo.

## Structure

- `src/<area>/`: <what it holds>
- `src/<area>/`: <what it holds>
- `tests/`: <test layout, framework>
- `docs/`: engineering docs that go stale when code changes
- `.github/`: PR template, CI

## Key files

- `<path>`: <why it matters>
- `<path>`: <why it matters>

## Conventions

- Language and style: <rules in one line each>
- Naming: <rule>
- Errors: <rule>
- Branches: short-lived, one issue each. Squash merge. `Closes #N` in the PR description.
- Generated files: <list>. Do not edit by hand.

## Run and test

```bash
<install command>
<dev command>
<test command>
<lint command>
```

Run lint and tests before opening a PR.

## Working rules for Claude

- Work in your own git worktree, one lane per agent.
- Open a pull request. A separate review agent reviews it. Agents merge a PR when CI is green and that review agent has signed it off.
- Fill in the PR template, including "Fit with the product doc".
- Do not read or print `.env` files or secrets.
- On any GitHub 403, 429 or secondary rate limit, stop all git and gh work and show the exact error to <owner>.
- Anything that touches money, user data, outgoing messages or cannot be undone waits for <owner>.
