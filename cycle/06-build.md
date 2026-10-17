# 6. Support delivery

Does the work still solve the problem as details change?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to clarify requirements, compare proposed changes with the brief and keep decisions available to the people doing the work. |
| What I check | I review changes to product behavior and resolve product questions. In Sparktale, a partner developer leads engineering; in solo projects, I also use coding agents. |
| Useful output | Updated requirements, resolved questions and work ready to review. |

The detail below shows how I apply this in my side projects. Use the question and output with your own team's documents.

Coding agents work in their own git worktrees, one lane each. Work flows from an issue to a pull request.

## What I do

- Write the issue: what and why, the user need, out of scope, a success signal. The how belongs to the implementer.
- Start one agent per lane, each in its own worktree and with a narrow brief.
- Keep each agent's context small: the lane spec, the map file, the files it touches.

## The artifact

An issue per piece of work and a pull request per issue, using the [PR template](../templates/code-repo/.github/pull_request_template.md).

## What AI changes here

A mid-tier model writes the code. The orchestrator, on the strongest model, plans, splits the lanes and reads the results. Recon runs on the fastest model.

## Where I still check

- I confirm every change to what the product does and sign off before release. Agents open PRs and a separate review agent checks them.
- The map file in the code repo ([`CLAUDE.md`](../templates/code-repo/CLAUDE.md)) matches the repo. A stale map costs every session.
- Anything irreversible waits for me: money, data deletion, messages to other people.

## Example

- Wellness Coach: Claude orchestrates a standing team of role agents: legal, architect, UX designer, UX researcher, analytics, brand, QA and release. The white paper wins any disagreement between them.
- Sparktale: I own product, marketing and legal coordination, and a partner developer leads engineering. My output in the code repo is issues that say what and why.
