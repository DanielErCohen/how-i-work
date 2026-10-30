# 5. Scope the work

What needs to change, and how will we know it is done?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to turn a decision or feedback into a brief with the user problem, desired behavior and open questions, then a recipient panel (stakeholder preset) of an engineering lead, design and the team that will build it reads the brief. |
| What I check | I check that the scope serves the goal and that the completion criteria describe something a person can observe. |
| Useful output | A scoped brief or issue with acceptance criteria and explicit open questions. |

A sprint is a folder with a goal, a done-when and one scope question. Specs split the work into lanes that do not touch the same files.

## What I do

- Create `sprints/YYYY-MM-DD-name/` with `README.md`: goal, done-when, scope, defaults for open questions.
- Write one lane spec per agent, anchored to a base commit, so an agent starts from known code.
- Ask exactly one scope question per sprint. The rest are defaults.
- Before a lane starts, run a recipient panel (stakeholder preset) on the brief with [`skills/recipient-panel`](../skills/recipient-panel/SKILL.md): an engineering lead, design and the team that will build it.

## The artifact

The sprint folder. Template: [`templates/knowledge-base-repo/sprints/`](../templates/knowledge-base-repo/sprints/_template/README.md).

## What AI changes here

Claude drafts the sprint and the lane specs from the decision records and the code map. The panel reads the brief cold and reports what it cannot build or decide from the text alone. A red-team pass runs on the plan before any lane starts.

## Where I still check

- Done-when is something a person can observe.
- Lanes are file-disjoint. Two lanes that edit one file become one lane.
- The base commit in each lane spec still exists on the branch.
- Panel claims about the code are checked against the code before I change a spec.

## Example

- Wellness Coach: each sprint folder carries a one-sentence goal, a done-when a person can observe, and explicit defaults for its open questions.
