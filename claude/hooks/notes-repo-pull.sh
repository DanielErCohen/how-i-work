#!/bin/bash
# SessionStart hook: fast-forward your notes repo so every session starts from the remote state.
# Claude Code runs SessionStart hooks in the background and holds Claude's first reply until they finish, so give
# the settings entry a timeout of 20 seconds (macOS ships no `timeout` binary).
# Nothing is printed on stdout: SessionStart stdout enters Claude's context. A failed pull exits 2, which shows
# stderr to you only, so you learn the repo is stale and Claude sees nothing.
#
# Set NOTES_REPO to the path of your notes repo, or edit the default below.
repo="${NOTES_REPO:-$HOME/notes}"
[ -d "$repo/.git" ] || exit 0
out=$(GIT_TERMINAL_PROMPT=0 git -C "$repo" pull --ff-only -q 2>&1 >/dev/null)
rc=$?
[ "$rc" -eq 0 ] && exit 0
last=$(printf '%s\n' "$out" | grep -m1 '^fatal:')
[ -n "$last" ] || last=$(printf '%s\n' "$out" | grep -v '^hint:' | grep . | tail -n 1)
printf 'notes-repo-pull: %s did not fast-forward (git exit %s): %s\n' "$repo" "$rc" "${last:-no output}" >&2
exit 2
