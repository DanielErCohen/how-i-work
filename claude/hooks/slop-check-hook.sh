#!/bin/bash
# PostToolUse hook: run slop-check.sh on prose Claude just wrote (markdown, HTML, Gmail drafts).
# PostToolUse cannot undo a write. Exit 2 hands stderr to Claude, which fixes or justifies each hit; exit 0 stays silent.
# On Edit only the text this edit added is checked, so a hit Claude already justified in an untouched line is not reported again.
input=$(cat)
check="$HOME/.claude/scripts/slop-check.sh"
[ -x "$check" ] || exit 0
command -v jq >/dev/null 2>&1 || exit 0

tool=$(printf '%s' "$input" | jq -r '.tool_name // empty')
path=$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty')
tmp=""
case "$tool" in
  Write|Edit)
    case "$path" in
      */SOUL.md|*/*archive/*|*/*memory/*) exit 0 ;;   # SOUL lists the banned patterns on purpose; archive folders are history; memory files use the harness's index format
      *.md|*.html|*.htm) ;;
      *) exit 0 ;;
    esac
    if [ "$tool" = "Edit" ]; then
      text=$(printf '%s' "$input" | jq -r '.tool_input.new_string // empty')
      [ -z "$text" ] && exit 0
      tmp=$(mktemp -d)
      target="$tmp/edit.md"
      printf '%s\n' "$text" > "$target"
    else
      target="$path"
    fi
    ;;
  mcp__*)
    text=$(printf '%s' "$input" | jq -r '.tool_input.body // .tool_input.content // empty')
    [ -z "$text" ] && exit 0
    tmp=$(mktemp -d)
    target="$tmp/draft.md"
    printf '%s\n' "$text" > "$target"
    path="the email draft"
    ;;
  *) exit 0 ;;
esac

out=$("$check" "$target" 2>&1)
rc=$?
[ -n "$tmp" ] && rm -rf "$tmp"
[ "$rc" -eq 1 ] || exit 0
printf 'slop-check hits in %s. Fix each one, or justify it in one line:\n%s\n' "$path" "$out" >&2
exit 2
