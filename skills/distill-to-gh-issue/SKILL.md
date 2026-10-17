---
name: distill-to-gh-issue
description: Turn one named item (QA finding, feature idea, bug report, Sentry or Supabase email, feedback row) into a GitHub issue in the current repo that an engineer can start on without further questions. Use when the user names something to file as an issue. Never files in an excluded org.
argument-hint: [the item to file]
---

# Distill to GH issue

This skill needs the `gh` CLI and a local repo, so it runs in Claude Code only.

## 1. Resolve the target first
- Repo: `gh repo view --json nameWithOwner -q .nameWithOwner` from the cwd; outside a repo, ask which one.
- Excluded estate is off limits. Read `config.local.md` next to this file (see `config.example.md`): it lists orgs and handles where you never file an issue, comment or assign. If the repo resolves to an excluded org, or an excluded handle would be the assignee, stop and say so. If `config.local.md` is missing, ask which orgs are off limits before filing.
- Repo, labels and assignee come only from this step: labels from `gh label list`, an assignee only when the user names one. A repo-local issue skill lends its sections and tone; its hardcoded repo, labels and assignee stay with that project.
- If `.github/ISSUE_TEMPLATE/` exists, use its sections without the front matter and comments.
- Duplicate check: `gh issue list --search "<3-5 distinctive words>" --state all --limit 10`.

## 2. Recon, only when the item needs it
- Read live code and data before trusting a doc: check the column, the endpoint and the displayed number before speccing on top of them.
- An unwired stub is a lead until you confirm it runs.
- When the code contradicts the report, the issue says so.

## 3. Draft the what; the how belongs to the implementer
Title: a short imperative phrase. Body sections, one line where one line is enough:
- Summary: 2-4 lines, leading with the most surprising recon finding.
- Problem / user need: who, when, how painful, and the signal that shows it.
- Desired behaviour: product-level rules the implementer works against.
- Out of scope: what this is not.
- Feasibility notes: `file:line` pointers to where things live, leaving implementation choices to the engineer; for a value that already exists, write "reconcile with it, do not recompute".
- Success metric: a concrete signal.
- Open questions: human decisions only.
- Features only: a four-row risk table (value, usability, feasibility, viability).

A non-code prerequisite (an account, infra, a legal sign-off) gets its own short linked issue, created after the main one.

## 4. Present, then create
- Show the destination `owner/name` on its own line (and whether the repo is public, since anchors and names in the body become world-readable), a 3-5 line summary, any near-duplicate, and one line of product challenge: the strongest counter or the thinnest assumption.
- Pass the repo as a literal `owner/name`: each Bash call is a fresh shell, so a variable set earlier is empty and `gh` falls back to another remote.
  `gh issue create --repo <owner/name> --title "<title>" --body-file <scratchpad>/issue-body.md`
- The create command raises a permission prompt; that prompt is the user's approval.
- One issue at a time, waiting for each URL.
- Report the URL and stop; implementation is a separate step.
