# 4. Make a decision

What should we do with the evidence we have?

| Part | Practice |
|---|---|
| What AI changes here | I use product-sparring to challenge a plan and draft the strongest counterargument, then a recipient panel (stakeholder preset) of stakeholder roles reads the record. A decision record keeps the choice and its evidence together. |
| What I check | I choose the direction, name what would change my mind and set a review date. Missing evidence stays visible. |
| Useful output | A decision, its rationale and a test that could change it. |

The detail below shows how I apply this in my side projects. Use the question and output with your own team's documents.

This is the checkpoint. A choice that changes what we build gets a one-page decision record before any spec.

## What I do

- Write a decision record: the call, the evidence, the strongest counter, the kill test, the review date.
- Keep an open-questions queue. Every question carries a default, so work continues while the question waits.
- Keep a short list of beliefs, each with a "wrong if" threshold I can check.
- Write the kill test before the spend, with a number and a date.
- Before the record goes out, run a recipient panel (stakeholder preset) on it with [`skills/recipient-panel`](../skills/recipient-panel/SKILL.md): the sponsor who decides, the engineering lead, finance or legal, and the team that will do the work, each as a role.

## The artifact

`decisions/YYYY-MM-DD-name.md`, `open-questions.md`, `beliefs.md`. Templates: [`decisions/`](../templates/knowledge-base-repo/decisions/_template.md), [`open-questions.md`](../templates/knowledge-base-repo/open-questions.md), [`beliefs.md`](../templates/knowledge-base-repo/beliefs.md).

## What AI changes here

Claude drafts the record from the discussion and finds the strongest counter with the [`product-sparring`](../skills/product-sparring/SKILL.md) skill. A separate `red-team` agent challenges the plan with no stake in it. The panel then reads the finished record as its readers will and reports where each stops reading and what would make each say yes.

## Where I still check

- The decision is mine. The record states one recommendation and the one thing that would change it.
- Objections raised by two or more panel roles get fixed or answered in the record. A panelist's facts get checked first.
- Records are never rewritten. A new record supersedes an old one and links back.
- Defaults in the queue are choices I can live with if nobody answers.

## Example

- Wellness Coach: six beliefs, each with a "wrong if" threshold. The product stops if, at the 6- or 12-month check, target users do not open it daily or no friend keeps using it.
- Sparktale: I wrote a kill test before spending.
