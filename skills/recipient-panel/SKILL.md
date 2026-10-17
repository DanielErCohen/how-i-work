---
name: recipient-panel
description: Before something goes to other people, spawn subagents that play its readers, collect their objections and tighten the draft. Use when the user says "before I send this", "challenge this as the readers", "run a panel", "how will X read this", "walk this flow as personas", "read this release note as users" or "run a recipient panel", or is drafting a doc, CV, application or page for others. For one adversarial review of a plan, use product-sparring or the red-team agent instead.
effort: high
---

# Recipient panel

You test a draft against the people who will receive it. Each reader is one subagent that sees the draft cold, as that role, and reports where it stalls. You merge the reports and tighten the draft. The result is a simulation. It shows where a draft is likely to lose a reader and cannot show what real people will do.

## 1. Name the recipients

Get the draft (a file path or pasted text) and what it must achieve: a decision, an interview, a signup, a first task finished. Propose three to five roles, including one skeptic where it helps. Spawn at most four at a time and run the rest in a second batch. Have the user confirm or edit the roles before you spawn anything. Name roles only. Never use a real person's name.

For each role write five lines: the role, what they must decide or do with the draft, what they already know, how much patience they have, and what would make them say no.

Presets to start from:

| Draft | Roles |
|---|---|
| Stakeholder doc | The sponsor who decides, the engineering lead, design, finance or legal, the team that will do the work |
| CV or application | Recruiter screen, HR, the PMs who will interview, the hiring manager. Run the ATS check as a separate formatting check |
| Product, feature or onboarding | Three personas from the exact target segment plus one skeptic (four in total, one batch), each with a job to do, a context and a reason to quit |
| Public page or post | The target reader, a skeptic, a copy editor, a voice check |

Build segment personas from the segment definition in the user's own notes, with real constraints such as device, time of day and what they use today. Pick roles whose answers differ. Two readers who would say the same thing waste a slot.

## 2. Spawn the panel

Start one subagent per role in a single message, at most four at a time, and run extra roles in a second batch. Keep the readers read-only: use a read-only agent type (in Claude Code, Explore) or a custom agent whose tools are Read, Grep and Glob. The brief also tells each reader not to edit. Use a fast model by default, for example Haiku. Use a stronger model when the read is high-stakes, such as a CV for a role the user wants or a doc that decides a budget.

Brief each subagent with this template, filled in per role:

```
You play one reader of a draft. Stay in role. You did not write it and owe it nothing.

Role: <role>
Your job with this draft: <what you must decide or do>
What you already know: <context, vocabulary, prior contact with the author>
Your patience: <for example 30 seconds, one page, until the first line you cannot parse>
What makes you say no: <the reasons this role refuses or ignores>

The draft is at <path>, or pasted below. Read it once, top to bottom, as this person.
Use only the draft and your role. Do not edit it, browse or ask questions.
Finish the whole report in one pass, in under 300 words:
1. Stop line: the exact line where you would stop reading, quoted, with the reason.
   Write "none" if you read to the end.
2. Objections: up to five, most serious first. Each has the line it rests on, quoted,
   and one concrete fix.
3. Yes: what would make you say yes.
4. Sound: one line on what already works.
5. Score: 1 to 10, where 10 means you act on it as the author hopes.
Quote verbatim. Mark any fact about the outside world "unchecked".
```

For a flow, hand over the steps or screens in order and ask the persona to walk them and say where it stalls and where it would quit.

## 3. Merge and tighten

1. Put every objection in one list and count how many roles raised it. Merge objections that differ only in wording.
2. Fix the objections raised by two or more roles first. Then fix single objections that are cheap and clearly right.
3. Write one line for each objection you leave out, with the reason.
4. Edit the draft in the main session, since the panel only reports. Show the changes as before and after lines.
5. Report the stop lines and scores per role. Scores compare one round with the next. Do not average them.

A second round is worth running when round one changed more than a few lines. Add at least one fresh subagent that has never seen the earlier version.

## Reuse across builds

For a product you test again and again, save each persona as a file, for example `research/personas/<persona>.md` in the user's notes: its five brief lines and what it found last time. Reuse the files each round and add fresh readers who have never seen the product.

## Limits

- The output is a simulation. Real users, real demand and real hiring outcomes need real people. Label panel findings as simulated wherever you quote them.
- Check every factual claim a panelist makes before you act on it. Subagents state wrong facts with confidence.
- Panelists share a model, so they share blind spots. Their agreement is a weaker signal than two real readers agreeing.
- Paste only what the user's employer allows. Remove names and customer details from the draft first.
- Never send the draft, or anything from it, to a real person on the user's behalf. Sending stays with the user.

Worked examples are at https://danielercohen.github.io/ai-pm/principles/.

## Without subagents (a chat in the Claude app)

Run each role in its own new chat, so the roles do not influence each other. Fill in this single-reader brief once per role and paste it with the draft:

```
You are <role: for example the finance lead who approves the budget>. You must <what they decide or do with this doc>. You already know <their context>. You have <their patience, for example two minutes>. You say no when <their reasons>.

Read the document below once, as this person. Then reply in under 300 words:
1. The line where you would stop reading, quoted.
2. Up to five objections, each with the line it rests on and one fix.
3. What would make you say yes.
4. One thing that works.

Document: <paste it>
```

Then open one more chat, paste all the answers into it and ask it to merge the objections two or more readers share. Run step 3 there.
