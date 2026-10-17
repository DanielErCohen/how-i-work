# settings.example.json, key by key

Back up your current file first: `cp ~/.claude/settings.json ~/.claude/settings.json.bak-$(date +%F)`. Then merge the keys you want into `~/.claude/settings.json`. Paths use `~`: replace them with your own.

## env

| Key | Value | Why |
|---|---|---|
| `CLAUDE_CODE_SUBAGENT_MODEL` | `sonnet` | Subagents and custom agents without their own `model` run on the mid model. The strongest model stays in the main session. |
| `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` | `4` | Caps parallel agents and keeps the number of simultaneous requests low. |
| `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` | `1` | An agent cannot spawn another. Delegation stays one level deep and readable. |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | `70` | Compacts at 70% of the context window. Long contexts cost every token and degrade. |

## permissions

| Key | Why |
|---|---|
| `allow` | A list for routine tools. Prompts for reads and edits teach you to click through. The example scopes Bash to a few read-only and local git commands such as `Bash(git status)`, `Bash(git diff *)` and `Bash(npm test)`. Edit and Write cover the project folder only (`./**`). Web fetch and web search are left out, so Claude Code asks each time. Add commands as you approve them, and avoid a bare `Bash` entry because it allows every command. |
| `deny` | A tripwire for catastrophic commands, force pushes in their common spellings, and reads of credential files: `~/.ssh`, `~/.aws`, `~/.config/gh`, `~/.npmrc`, `~/.netrc`, `.pem` keys and `.env` files at any path. It matches command text, so a rephrased command can slip past it. A read deny also blocks edits. `.env.example` is blocked too: keep a copy under another name when Claude needs the shape. |
| `ask` | Merges, repo deletes, and anything that sends a message. I confirm every change to what the product does and sign off before release. Agents open PRs and a separate review agent checks them. Anything that touches money, user data, outgoing messages or cannot be undone waits for me. `gh pr merge` stays under `ask` in the example file. The `rtk` twins exist because Claude Code matches rules after the rewrite hook has changed the command. Drop them if you do not use rtk. |
| `additionalDirectories` | Folders Claude may read and write outside the project root. |

## sandbox

| Key | Why |
|---|---|
| `sandbox.enabled` | Runs Bash commands in an OS-level sandbox that limits file writes and network access. The deny list is a tripwire and the sandbox is the boundary: keep both on. Key per the [Claude Code sandboxing docs](https://code.claude.com/docs/en/sandboxing). |

## Top-level keys

| Key | Why |
|---|---|
| `model` | An alias, so the next model arrives without an edit. |
| `outputStyle` | The built-in Concise style keeps Claude Code's engineering instructions. |
| `autoMemoryDirectory` | Memory lives in a git repo, outside `.claude/`, which Claude Code prompts on for every write. |

## hooks

| Event | Script | Why |
|---|---|---|
| `SessionStart` | `notes-repo-pull.sh`, 20 s timeout | Fast-forwards the notes repo so a session starts from the remote state. The hook blocks Claude's first reply until it ends, so keep the timeout short. |
| `PreToolUse` on Bash (optional, left out of the example file) | `rtk-rewrite.sh` | Rewrites commands to compress output. rtk generates the script, see [`hooks/README.md`](hooks/README.md). |
| `PostToolUse` on Write and Edit | `slop-check-hook.sh` | Runs the slop check on markdown and HTML that Claude wrote. Hits go back to Claude to fix or justify. |

## Not included

Plugin entries, notification toggles and auto-mode rules are personal preferences. Add your own.
