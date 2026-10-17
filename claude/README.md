# Claude Code setup

Four rules carry most of the value. The setup in this folder enforces them where a setting, a hook or a permission can.

## The four rules

1. **Split the models by job.** The strongest model plans and orchestrates. A mid model writes the code and reviews it. The fastest model does research, recon and intel gathering, because it is fast and cheap for reading. Independent red-teams run on the strongest model. Today that means Opus, Sonnet and Haiku.
2. **One agent per task.** Research, recon, planning, coding and review each get their own agent with a narrow brief. Keep each context small.
3. **Review before merge.** I confirm every change to what the product does and sign off before release. Agents open PRs and a separate review agent checks them. The red team, one adversarial reviewer with a fresh context, challenges the plan. Anything that touches money, user data, outgoing messages or cannot be undone waits for me.
4. **Add a map of the codebase.** A file in the repo covering structure, key files, conventions, and how to run and test. Claude reads it at the start of each session, so it does not rebuild the context every time.

Start with the map, then split the next task across agents.

## What is in this folder

| Path | What it is |
|---|---|
| [`CLAUDE.template.md`](CLAUDE.template.md) | Global `CLAUDE.md` with placeholders: who you are, how to talk to you, evidence rules, autonomy rules. |
| [`settings.example.json`](settings.example.json) | A `settings.json`. JSON has no comments, so [`settings.md`](settings.md) explains each key. |
| [`hooks/`](hooks/README.md) | Session-start pull and the slop check on every write. The optional token-compression hook is a link to rtk. |
| [`scripts/slop-check.sh`](scripts/slop-check.sh) | The banned-word, puffery and construction checker. |
| [`agents/`](agents) | `researcher` (fast model, sourced briefs), `red-team` (strongest model, no file writes) and `panelist` (fast model, read-only reader for the recipient panel). |
| [`memory/`](memory/README.md) | The memory format and two example notes. |

## Why each part exists

**Global `CLAUDE.md`.** It holds who I am, how to talk to me, the evidence rules and the autonomy rules. The rebuild in Sep '26 cut the instructions loaded at every session start from about 11,100 to about 1,800 tokens. A rule earns its place after a failure I saw twice that no setting, hook or permission can prevent. It is written as a positive description in at most two lines, and the commit names the failure.

**Subagent model default.** Subagents run on the mid model through `CLAUDE_CODE_SUBAGENT_MODEL`, so the strongest model stays in the main session. The built-in Explore agent ignores that variable, so the map says to pass `model: "haiku"` on every Explore call.

**Four concurrent subagents, spawn depth 1.** Four at a time and no agent that spawns another keeps the number of simultaneous requests low.

**Autocompact at 70%.** A long context costs every token on every turn and degrades the answers. Compacting at 70% of the window keeps sessions sharp.

**Allow list.** Prompts for routine reads and edits teach you to click through. Allow the routine, scope edits to the project folder, scope Bash to the commands you run every day, and leave web fetch and search to ask. The rules below stop what matters.

**Deny list and sandbox.** The deny list is a tripwire for catastrophic commands (`rm -rf` on root or home, force pushes, piping curl into a shell) and reads of credential files (`~/.ssh`, `~/.aws`, `~/.config/gh`, `.npmrc`, `.netrc`, `.pem` keys, `.env` files). The sandbox is the boundary. A read deny also blocks edits and covers `.env.example`.

**Ask rules.** Merges, repo deletes and anything that sends a message (email, chat, a reply, a forward) stop for approval. These actions reach other people or cannot be undone. `gh pr merge` stays under ask in the example file. If you use a command-rewriting hook, each ask rule needs a twin for the rewritten command, because Claude Code matches rules after the hook runs.

**Model as an alias.** `opus` rather than a dated ID, so the next model arrives without an edit.

**Auto memory directory in a git repo outside `.claude/`.** Memories live in git with history and review. Claude Code prompts before every write to a `.claude` path, so the folder sits elsewhere.

**Concise output style.** The built-in style keeps Claude Code's engineering instructions and cuts the chatter. A custom style that strips them costs more than it saves.

**Hooks.** `SessionStart` pulls the notes repo so each session starts from the remote state. `PostToolUse` runs the slop check on every markdown or HTML write and hands hits back to Claude to fix or justify. Optional: [rtk](https://github.com/rtk-ai/rtk), a Bash output compressor, adds its own `PreToolUse` hook. The example settings leave it out because rtk generates that script on your machine.

**`slop-check.sh`.** An executable ban list for puffery, inflated vocabulary, negation-antithesis and em-dashes. A hook enforces what a written rule can only request.

**Agents.** `researcher` runs on the fastest model and returns a sourced brief under 600 words. `red-team` runs on the strongest model, has no file-write tools (it can fetch the web) and gives an independent challenge. `panelist` runs on the fastest model with Read, Grep and Glob only, and plays one reader for the recipient panel.

**Recipient panel rule.** The template holds one line for `CLAUDE.md` that sends anything bound for other people through the [`recipient-panel`](../skills/recipient-panel/SKILL.md) skill first. Once you add it, Claude runs the panel before a doc, CV or page goes out, without being asked. Each reader role becomes a `panelist` subagent (Read, Grep and Glob only) on a fast model by default, and on a stronger one for high-stakes reads. The `red-team` agent stays the single adversarial reviewer. Install the skill into `~/.claude/skills/` too: the rule has no effect without it.

**Memory.** One fact per file with frontmatter, an index file with one line per memory. Feedback notes carry the reason and how to apply them.

**GitHub stop rule.** On any 403, 429 or secondary rate limit, stop all git and gh work and show the error. It is one line in `CLAUDE.md`.

## Install

Claude Code. Read the hook scripts before you install them: they run on your machine. This block works from any folder on a fresh Mac. It clones the repo if you do not have it, then copies the template, the three agents, the recipient-panel skill, the slop checker and the hooks. `cp -n` never overwrites a file you already have.

```bash
[ -d ~/how-i-work ] || git clone https://github.com/DanielErCohen/how-i-work.git ~/how-i-work
mkdir -p ~/.claude/agents ~/.claude/skills ~/.claude/hooks ~/.claude/scripts
cp -n ~/how-i-work/claude/CLAUDE.template.md ~/.claude/CLAUDE.md
cp -n ~/how-i-work/claude/agents/*.md ~/.claude/agents/
cp -Rn ~/how-i-work/skills/recipient-panel ~/.claude/skills/
cp -n ~/how-i-work/claude/scripts/slop-check.sh ~/.claude/scripts/
cp -n ~/how-i-work/claude/hooks/*.sh ~/.claude/hooks/
chmod +x ~/.claude/scripts/slop-check.sh ~/.claude/hooks/*.sh
```

Then replace each placeholder in angle brackets in `~/.claude/CLAUDE.md`. Back up your settings with `cp ~/.claude/settings.json ~/.claude/settings.json.bak-$(date +%F)` and merge the keys you want from `settings.example.json` into `~/.claude/settings.json`, which also registers the hooks.

Claude Desktop and web: agents, hooks and settings need Claude Code. The skills in [`../skills/`](../skills) install as zip uploads.

The slop-check hook needs `jq`.
