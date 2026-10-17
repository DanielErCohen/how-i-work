# Redaction

Two jobs: keep credentials out of the repo entirely, and know what would have to come out if any part
of it were ever shared.

The default assumption is that a second brain is **private and stays private.** Sharing it is not a
matter of removing a few names. The categories below are load-bearing in ordinary notes, so a
publishable version is a rewrite. Plan for private, and treat any extract as a separate
artifact you build deliberately.

---

## Never in the repo, at all

Only one category is a true hard stop, because it is the only one where deletion does not fix it.

**Credentials.** API keys, tokens, passwords, private keys, connection strings, session cookies,
recovery codes.

A committed credential stays in git history after you delete the file. `git rm` changes nothing about
the exposure. So the order is fixed:

1. **Rotate the credential** at the provider. This is the step that ends the exposure.
2. Then remove it from the working tree and commit.
3. Only then, if the repo is public or was ever pushed anywhere you do not control, consider rewriting
   history with [`git-filter-repo`](https://github.com/newren/git-filter-repo), after the rotation and
   not instead of it.

Rewriting history rewrites every commit hash and breaks every clone. On a private solo repo with the
credential already rotated, it is usually not worth it. Rotation is the fix; history rewriting is
cosmetic.

### How credentials actually get in

Not through `.env` files, which `.gitignore` handles. They arrive pasted inside notes: an API
experiment saved for later, a setup transcript, a debugging log, a "here is the working curl command"
snippet. The value sits mid-paragraph in a project note and nothing flags it.

Before pasting any session log or setup transcript into a note, read it for values. That single habit
prevents almost every real case.

### Scan on a schedule

```bash
git grep -nIE '(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)'
```

Add `$(git rev-list --all)` after `git grep -nIE '<pattern>'` to search all history rather than just
the current tree.

Report and fix by **path and credential kind**. Echoing a secret into a terminal,
a log, or a chat transcript is a second exposure. The `/weekly-review` command in the scaffold follows
this rule.

**Watch for false positives.** Not every long opaque string is a secret, and treating public
identifiers as breaches wastes real effort. Public-by-design values include OAuth client IDs, Apple
team IDs, Firebase web-app config, Google Analytics measurement IDs, and publishable payment keys
(`pk_live_…`). Before rotating, check what the value actually is. Conversely, `sk_live_…`, anything
labelled "secret", and anything you had to log in to obtain is real.

---

## What would have to come out before sharing

None of these need to leave a private repo. All of them need to leave any extract you publish, and the
list is longer than people expect, which is the argument for keeping the repo private rather than
sanitising it later.

| Category | Examples | Where it hides |
|----------|----------|----------------|
| **Financial** | Salary and equity figures, account and card numbers, net-worth tracking, invoices, tax filings, spending logs | A `finances` area, negotiation notes, any budget spreadsheet |
| **Health** | Diagnoses, test results, medications, dosages, therapy or appointment notes, dates of procedures | A `health` area, daily notes, family notes |
| **Identity and household** | Full legal names, dates of birth, home and work addresses, phone numbers, government ID numbers, passport and licence details, insurance and policy numbers | Travel bookings, forms, contact lists, delivery notes |
| **Employer-confidential** | Unreleased roadmaps, revenue and pipeline figures, internal metrics, headcount plans, contract terms, anything under NDA | Work areas, meeting notes, strategy docs, decision logs |
| **Third-party personal data** | Anything about another person: their health, finances, performance reviews, private messages, verbatim quotes, gift plans, relationship detail | Meeting notes, family and friend notes, feedback drafts, transcripts |
| **Derived and inferred** | Daily routines and location patterns, travel dates and absences, relationship and family structure, religious or political leanings, purchase history | Calendars, daily notes, trip planning, grocery lists |

Two categories deserve emphasis because they are the ones people miss:

**Third-party data is not yours to publish.** Your notes about a conversation contain someone else's
words and someone else's situation. They never agreed to be in your repo. This is the category most
likely to cause actual harm, and no anonymisation script finds it, because it is prose.

**Derived information leaks without any single sensitive line.** No individual note says where you live
or when the house is empty. A year of travel plans, grocery notes, and daily entries says both.
Aggregation is the exposure, so file-by-file review will not catch it.

---

## Sharing something anyway

If you want to publish part of the repo, do not sanitise the repo. **Build a separate artifact.**

1. Start a new repository. Never remove content from the real one and push it, because history keeps
   everything you removed.
2. Copy in only the specific files you intend to share.
3. Rewrite them, rather than redacting them. Replace real examples with invented ones. A note with
   twelve `[REDACTED]` markers is unreadable and still leaks structure, since you can usually infer what
   was removed.
4. Have the assistant read the result cold and report anything identifying. Give it the category table
   above and ask for paths only.
5. Read it yourself before pushing. Automated passes miss prose, and prose is where the third-party
   and derived categories live.

The template you are reading was produced this way.

---

## Prepared in advance

Two things worth doing on day one, while the repo is small.

**Keep the `.gitignore` secrets block.** The scaffold's covers `.env*`, `*.pem`, `*.key`,
`credentials.json`, `service-account*.json`, and `.claude.json` (which can carry session history and
tokens). Do not trim it.

**Add a pre-commit hook.** Cheap, and catches the pasted-transcript case at the moment it happens:

```bash
cat > .git/hooks/pre-commit <<'EOF'
#!/bin/sh
if git diff --cached -U0 | grep -nIE '^\+.*(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)' >/dev/null; then
  echo "pre-commit: possible credential in staged changes. Review, then commit with --no-verify if it is a false positive."
  exit 1
fi
EOF
chmod +x .git/hooks/pre-commit
```

It prints no matched text, only that something matched. Note that hooks are local and not versioned.
If you work across machines, install it on each, or use a managed scanner such as
[gitleaks](https://github.com/gitleaks/gitleaks) instead.

---

## If a credential is already committed

In order, without skipping the first step:

1. **Rotate it now.** Before reading further.
2. Check the provider's access or audit log for use you did not make.
3. Remove the value from the working tree and commit.
4. Decide about history: private solo repo with the key rotated, leave it. Ever public, ever pushed to
   a shared remote, or ever cloned by anyone else: rewrite with `git-filter-repo`, force-push, and
   tell anyone with a clone to re-clone.

Step 4 is destructive and rewrites every commit hash after the affected commit. It also does nothing
about a key that has already leaked. **Step 1 is the fix. Step 4 is tidying.**
