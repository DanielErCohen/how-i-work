# 7. Check the work

Does the result meet the intended behavior and quality bar?

| Part | Practice |
|---|---|
| What AI changes here | I ask the `red-team` agent, one adversarial reviewer with a fresh context, to challenge it and identify gaps in the test plan. |
| What I check | I verify findings and walk the actual experience. AI review can find issues; usability evidence still needs people using the product. |
| Useful output | Review findings, acceptance checks and remaining gaps. |

Nothing merges on the author's word. The red team, one adversarial reviewer with a fresh context, reviews every plan, and review agents check every pull request.

## What I do

- Run a red team on every plan before the build.
- Run review agents on every PR: code, security and accessibility.
- Write a QA plan per build and walk it, including simulator walks for app flows.

## The artifact

Red-team notes next to the plan, review comments on the PR, and `docs/qa/<build>.md` from the [QA plan template](../templates/code-repo/docs/qa/qa-plan.template.md).

## What AI changes here

The `red-team` agent ([`claude/agents/red-team.md`](../claude/agents/red-team.md)) is read-only and independent. It reports every finding it would act on, ranked by impact, and says what is sound.

## Where I still check

- A red-team finding that I reject gets one line saying why.
- The PR has a "fit with the product doc" section. A change that works but drifts from the product doc goes back.
- I read the QA plan result myself before a release.

## Example

- Sparktale: a multi-jurisdiction compliance review built from repo audits and jurisdiction research, red-teamed by separate agents.
- Wellness Coach: a red team runs on every plan, review agents run on every PR, and the recipient panel walks each build (see [step 2](02-user-research.md)).
