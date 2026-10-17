# AI across product work

Nine steps I use to make product decisions I can explain, test and revisit. Start at your current question and return to earlier steps when the evidence changes. Keep the outputs in the documents your team already uses.

The [workflow on the site](https://danielercohen.github.io/ai-pm/principles/cycle.html) shows where AI helps and what I check. The repository setup is optional; the deeper examples show how I use it in side projects.

| Step | PM question | Useful output |
|---|---|---|
| [1. Frame the problem](01-discovery.md) | Whose problem are we trying to solve, and what do they do today? | A short problem statement, current alternatives and open questions. |
| [2. Learn from users](02-user-research.md) | What do real people do, and where does the task fail? | Dated user evidence, a list of gaps and the next questions to test. |
| [3. Define success](03-data.md) | What change would show that the work helped? | A success measure, its definition and checks on the data. |
| [4. Make a decision](04-decision.md) | What should we do with the evidence we have? | A decision, its rationale and a test that could change it. |
| [5. Scope the work](05-spec.md) | What needs to change, and how will we know it is done? | A scoped brief or issue with acceptance criteria and explicit open questions. |
| [6. Support delivery](06-build.md) | Does the work still solve the problem as details change? | Updated requirements, resolved questions and work ready to review. |
| [7. Check the work](07-review.md) | Does the result meet the intended behavior and quality bar? | Review findings, acceptance checks and remaining gaps. |
| [8. Prepare the release](08-ship.md) | Is this ready to reach users, and what still needs a decision? | A release decision, a record of checks and a release note. |
| [9. Measure and learn](09-measure.md) | Did the change help, and what should we do next? | A dated readout and the next decision or research question. |

## How I apply it in side projects

- Before something goes to other people (a decision record, a brief, a release note), a recipient panel reads it first: one subagent per reader role, each reporting where it stops reading and why. The method is in [`skills/recipient-panel`](../skills/recipient-panel/SKILL.md).
- Step 4 is the checkpoint. Nothing reaches a spec without a decision record that names the strongest counter and the kill test.
- Open questions carry a default. I use a stated default only where I have accepted the consequence of proceeding.
- Claude orchestrates from the map file in each repo. I confirm every change to what the product does and sign off before release. Agents open PRs and a separate review agent checks them. Anything that touches money, user data, outgoing messages or cannot be undone waits for me.

## Worked examples

The examples in the guides come from two products as of Oct '26:

- Wellness Coach: a work-in-progress iPhone app that aims to keep one log of activity. Sprints, role agents, beliefs with thresholds.
- Sparktale: a live app for personalised printed children's books. A knowledge-base repo for prose, a code repo for code-coupled docs, a partner developer leading engineering. I wrote a kill test before spending.

Project write-ups: https://danielercohen.github.io/ai-pm

## Templates used

- [`templates/knowledge-base-repo/`](../templates/knowledge-base-repo/README.md)
- [`templates/code-repo/`](../templates/code-repo/README.md)
