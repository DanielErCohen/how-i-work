# 1. Frame the problem

Whose problem are we trying to solve, and what do they do today?

| Part | Practice |
|---|---|
| What AI changes here | I use AI to gather sources, compare alternatives and challenge the problem statement. |
| What I check | I check the sources behind claims that affect the decision. Desk research identifies questions to investigate; interviews and observed behavior test them. |
| Useful output | A short problem statement, current alternatives and open questions. |

The detail below shows how I apply this in my side projects. Use the question and output with your own team's documents.

Framing the problem ends with a problem doc I can defend in one page and a landscape that names what people use today.

## What I do

- Write the problem in one paragraph: who has it, when, and what they do about it now.
- List the alternatives people use today, including doing nothing.
- Put every piece of research in a dated file, `research/YYYY-MM-DD-topic.md`, with the source and the date at the top.

## The artifact

`product/problem.md`, `product/landscape.md` and one file per research question under `research/`. Template: [`templates/knowledge-base-repo/research/`](../templates/knowledge-base-repo/research/README.md).

## What AI changes here

A fast, cheap model does the reading. The `researcher` agent ([`claude/agents/researcher.md`](../claude/agents/researcher.md)) searches several sources and returns a sourced brief under 600 words. I check the source pages behind claims that affect the decision.

## Where I still check

- A single source is a lead until a second one confirms it.
- Every number carries a unit, a date and its source.
- I read the problem doc again after the research lands and cut what the evidence did not support.

## Example

- Wellness Coach: activity data sits in Apple Health, wearables, running apps, timer apps and meditation apps. Each session type needs its own tool, and reminders ignore the person. The problem doc says that in one paragraph, and the landscape file lists the apps people open for each job.
- Sparktale: a child can be the main character of a printed storybook. The landscape file compares what a parent can buy today, and the problem doc states the gap in one line.
