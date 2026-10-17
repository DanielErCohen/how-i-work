# Hooks and settings

Two entries in `~/.claude/settings.json` connect Claude Code to the vault. Both need Claude Code,
because they run on your machine.

## Session-start pull

At the start of every session the vault is fast-forwarded from its remote, so a session on one
machine sees what you wrote on another. The script already exists in this repo:
[`claude/hooks/notes-repo-pull.sh`](../../claude/hooks/notes-repo-pull.sh). It prints nothing into
Claude's context. A failed pull shows one line to you.

```bash
mkdir -p ~/.claude/hooks
cp -n ~/how-i-work/claude/hooks/notes-repo-pull.sh ~/.claude/hooks/ && chmod +x ~/.claude/hooks/notes-repo-pull.sh
export NOTES_REPO=~/my-second-brain   # put this line in your shell profile
```

Register it under `hooks` in `settings.json`:

```json
"SessionStart": [
  {
    "matcher": "startup|resume|clear",
    "hooks": [
      { "type": "command", "command": "~/.claude/hooks/notes-repo-pull.sh", "timeout": 20 }
    ]
  }
]
```

The pull needs a remote. Without one it fails and shows its one line to you, so add a remote first.

## Memory folder

Point Claude's auto memory at the vault's `memory/` folder, so every memory has git history:

```json
"autoMemoryDirectory": "~/my-second-brain/memory"
```

The folder sits outside `.claude/`, because Claude Code asks before every write to a `.claude` path.
The format is in [`../scaffold/memory/README.md`](../scaffold/memory/README.md).

## Skill and commands

Inside the vault, Claude Code finds `.claude/commands/` and `.claude/skills/` by itself, so
`/init`, `/capture`, `/weekly-review`, `/archive-sweep` and `log-entry` need no registration. To use
`log-entry` in every project, copy it once:

```bash
mkdir -p ~/.claude/skills && cp -Rn ~/my-second-brain/.claude/skills/log-entry ~/.claude/skills/
```
