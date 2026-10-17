# 8. Prepare the release

Is this ready to reach users, and what still needs a decision?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to collect check results and draft a release summary linked to the work, then a recipient panel (product preset) of users reads the release note. |
| What I check | I read the results and resolve remaining product decisions. Changes involving money, user data or outgoing messages need an explicit approval. |
| Useful output | A release decision, a record of checks and a release note. |

The detail below shows how I apply this in my side projects. Use the question and output with your own team's documents.

Short branches, squash merges, and a link from every PR to its issue.

## What I do

- Keep branches short-lived, one issue each.
- Squash-merge with `Closes #N` in the PR description.
- Run the release note past a recipient panel (product preset) with [`skills/recipient-panel`](../skills/recipient-panel/SKILL.md): simulated users from the target segment read it cold and say what they think changed, what they would do next, and the line where they stop reading.
- Agents merge a PR when CI is green and a separate review agent has signed it off. Anything that touches money, user data, outgoing messages or cannot be undone waits for me.

## The artifact

The merged PR, the closed issue, and a release note.

## What AI changes here

The orchestrator checks CI, the review result and the PR template, then merges a PR that meets the rule. It reports what merged in a few lines. The recipient panel (product preset) flags a release note line that a simulated user would misread, before the note goes out.

## Where I still check

- On any GitHub 403, 429 or secondary rate limit, all git and gh work stops and the exact error comes to me.
- Settings cap concurrent subagents at 4 and spawn depth at 1.
- The panel is a simulation. Whether users understand the note shows in support questions and usage after release.

## Example

- Wellness Coach: the rule above applies as written. A PR that touches user data waits for me.
