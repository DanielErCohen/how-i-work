# Hooks

Hooks run on your machine, so they need Claude Code. Read the scripts before you install them. Copy them to `~/.claude/hooks/`, run `chmod +x`, and register them in `settings.json` (see [`../settings.md`](../settings.md)).

## notes-repo-pull.sh (SessionStart)

Fast-forward your notes repo at session start. Set `NOTES_REPO` or edit the default path. A failed pull prints one line to you and stays out of Claude's context.

## slop-check-hook.sh (PostToolUse)

Runs [`../scripts/slop-check.sh`](../scripts/slop-check.sh) on markdown and HTML files Claude writes or edits, and on the body of an email draft created through a connector (`mcp__<server>__create_draft`). The matcher in `settings.example.json` is `^(Write|Edit|mcp__.*__create_draft)$`; a matcher with only letters, digits and `|` is an exact list of tool names, and this one has more characters, so Claude Code reads it as a regular expression. On an edit it checks only the added text. Any em-dash is a hit, matching the "No em-dashes" line in `CLAUDE.template.md`. Exit 2 hands the hits to Claude, which fixes each or justifies it in one line. It needs `jq`. It skips `SOUL.md`, folders whose name ends in `archive` (such as `04-archive`) and folders whose name ends in `memory`. Edit the `case` list to skip other folders where the banned patterns are the point.

## rtk-rewrite.sh (PreToolUse, optional)

I use [rtk](https://github.com/rtk-ai/rtk) to compress command output before it reaches the context. Its hook is a thin script that delegates to `rtk rewrite`, and rtk generates it together with a checksum file for its own integrity check. I link to it and do not copy it, so you get the version that matches your rtk binary. Install rtk, follow its README to add the hook, then register `~/.claude/hooks/rtk-rewrite.sh` in `settings.json` as a `PreToolUse` hook with the matcher `Bash`. `settings.example.json` leaves it out because this repo does not ship the script.
