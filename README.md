# How I work

This repo holds the skills, templates and working files I use as a PM. You can copy them and adapt them to your own work.

AI widens what you look at and argues with your draft. You frame the problem, decide and sign off.

The repo holds tools for Claude Code and the Claude app, plus a nine-step workflow. Each tool has a page on the site: https://danielercohen.github.io/ai-pm/toolkit/. Every tool has a folder here except cv-tailor, which has its own repo.

## Catalogue

| Tool | What it gives you | Time to set up | Folder |
|---|---|---|---|
| [Claude Code setup](https://danielercohen.github.io/ai-pm/toolkit/claude.html) | Rules, settings, hooks, agents and a memory format. | 30 minutes | [`claude/`](claude/README.md) |
| [Skills](https://danielercohen.github.io/ai-pm/toolkit/skills.html) | Recipient panel, product sparring, issue filing and a voice skill. | 2 to 20 minutes each | [`skills/`](skills) |
| [Meeting review](https://danielercohen.github.io/ai-pm/toolkit/meeting-review.html) | A dated review of your own meeting transcripts. | 15 minutes | [`meeting-review/`](meeting-review/README.md) |
| [Routines](https://danielercohen.github.io/ai-pm/toolkit/routines.html) | A newsletter digest and a dashboard refresh example. | 30 to 45 minutes each | [`routines/`](routines) |
| [Second brain](https://danielercohen.github.io/ai-pm/toolkit/second-brain.html) | An empty git-backed markdown vault that Claude files into. | 10 minutes | [`second-brain/`](second-brain/README.md) |
| [Small builds](https://danielercohen.github.io/ai-pm/toolkit/small-builds.html) | A page-saving Chrome extension and a local voice transcriber. | 10 to 20 minutes each | [`small-builds/`](small-builds/README.md) |
| [cv-tailor](https://danielercohen.github.io/ai-pm/toolkit/cv-tailor.html) | CV skills that tailor a CV to a role and keep versions in git. | 15 minutes | [cv-tailor repo](https://github.com/DanielErCohen/cv-tailor) |
| [Decision record](https://danielercohen.github.io/ai-pm/toolkit/decision-record.html) | A blank record for the problem, evidence, decision and test. | Plain document | [`templates/decision-record.md`](templates/decision-record.md) |

## How I use AI across product work

The [nine-step workflow](https://danielercohen.github.io/ai-pm/principles/cycle.html) covers research, decisions, delivery and learning. Each step names a PM question, how AI helps, what I check and a useful output. Start at your current task and use your team's existing documents.

The guides are in [`cycle/`](cycle/README.md). The optional repository skeletons are in [`templates/`](templates/README.md).

## Start with your task

Choose a tool from the catalogue and follow its page's instructions for your assistant. Each page includes an example or a first task to try. You can use the decision record as a plain document without installing a skill.

To try product-sparring after installing it, copy the prompt from the [skills page](https://danielercohen.github.io/ai-pm/toolkit/skills.html#product-sparring). Check the evidence against your inputs before acting.

## The two repos behind every product

Each product runs on two repos. A knowledge-base repo holds prose: research, decisions, specs, analytics, legal. A code repo holds code and the docs that go stale when the code changes. Each has a map file, `CLAUDE.md`, that Claude reads at session start.

The rule for where a doc goes: it belongs in the code repo if it goes stale when the code changes.

## Install

**Claude Code.** Copy the folder you want into `~/.claude/skills/` for every project, or into a project's `.claude/skills/` for one. Agents go in `~/.claude/agents/`, hooks in `~/.claude/hooks/`. Repo templates are plain folders: copy them into a new repo. This block works from any folder and clones the repo first if you do not have it. On a fresh Mac the first `git` run may prompt you to install the Command Line Tools: accept, wait for the install, then run the block again.

```bash
[ -d ~/how-i-work ] || git clone https://github.com/DanielErCohen/how-i-work.git ~/how-i-work
mkdir -p ~/.claude/skills ~/.claude/agents
cp -Rn ~/how-i-work/skills/recipient-panel ~/how-i-work/skills/product-sparring ~/.claude/skills/
cp -n ~/how-i-work/claude/agents/*.md ~/.claude/agents/
```

**Claude app (desktop and web).** Download the skill as a zip from https://danielercohen.github.io/ai-pm/downloads/<name>.zip: [recipient-panel](https://danielercohen.github.io/ai-pm/downloads/recipient-panel.zip), [product-sparring](https://danielercohen.github.io/ai-pm/downloads/product-sparring.zip), [voice](https://danielercohen.github.io/ai-pm/downloads/voice.zip) or [meeting-review](https://danielercohen.github.io/ai-pm/downloads/meeting-review.zip). In the app open Customize, then Skills, select "+", then "Create skill", then "Upload a skill", and choose the zip. Code execution must be on (Settings, then Capabilities; it is on by default, and on Team and Enterprise plans an admin turns it on). Uploading a custom skill needs a paid Claude plan. The zip holds the skill folder at the top, with `SKILL.md` inside it. distill-to-gh-issue needs `gh` and a local repo, so it runs in Claude Code only.

The ready zips are on the site: https://danielercohen.github.io/ai-pm/toolkit/skills.html. To build them yourself, run `bash tools/build-skill-zips.sh` in the [ai-pm](https://github.com/DanielErCohen/ai-pm) repo. A plain `zip` of the folder does not work, because the Claude app rejects some frontmatter keys that the script removes.

Skills install both ways. Hooks, agents, `settings.json` and the scripts need Claude Code, because they run on your machine.

## Licence

MIT, copyright Daniel Cohen 2026, except the files listed in [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md). See [`LICENSE`](LICENSE).
