# Voice skill

A skill that writes in your voice, and the method for building the voice file from your own sent writing. Nothing here is mine: `SOUL.template.md` is a blank you fill with your own patterns.

## Files

- `SKILL.md`: the skill. It loads your voice file, picks the register and runs the self-check and the slop check. With no voice file, it asks you to paste yours into the chat or to paste 20 to 30 sent items so it builds one for the session.
- `SOUL.template.md`: the voice file with placeholders. Rename the filled copy to `SOUL.md`.

## Method

1. **Collect 20-30 sent items.** Emails you wrote, product docs you wrote, messages you sent. Choose items you are happy with and that cover the mediums you want help with. Remove anything private.
2. **Extract rules.** Paste the samples into Claude and ask for patterns: greetings, sign-offs, connectives, sentence length, how you open, how you ask, how you close, what you never write. Ask for a quote from the samples next to each rule, so you can check it.
3. **Write the rules in command voice.** "Direct. No hedging." works better than "I tend to prefer directness." A command survives a long session and a description fades.
4. **Add the bans.** List what you never write: stiff sign-offs, filler openers, constructions that read as machine-written. Explicit bans hold up.
5. **Write a self-check.** A short checklist at the end of the file. Claude runs it before returning a draft.
6. **Wire in the slop hook.** The [slop checker](../../claude/scripts/slop-check.sh) and its [hook](../../claude/hooks/slop-check-hook.sh) catch what the voice file misses. Where a flag hits wording that is yours, keep it.
7. **Test on real mail.** Ask for a reply to an old email you answered yourself. Compare. Fix the rule behind each difference.
8. **Mark evidence.** Note which rules come from real samples and which are defaults you have not checked. Review the file after a month of use.

## Keep it private

Your voice file is built from your private writing. Keep it in a private repo and out of anything you publish. Use writing you own. Check your employer's policy before you paste work email into an AI tool.

## Install

Adapt the skill to you after installing: see [Make it yours](../../README.md#make-it-yours).

**Claude Code.** Run `mkdir -p ~/.claude/skills`, copy this folder to `~/.claude/skills/voice/`, then copy `SOUL.template.md` to `~/.claude/skills/voice/SOUL.md` and fill it in.

**Claude app (desktop and web).** Download [voice.zip](https://danielercohen.github.io/ai-pm/downloads/voice.zip) and upload it as it is: open Customize, then Skills, select "+", then "Create skill", then "Upload a skill", and choose the zip. Code execution must be on (Settings, then Capabilities; it is on by default, and on Team and Enterprise plans an admin turns it on). The zip holds no voice file, so in your first chat the skill asks you to paste your voice file, or to paste 20 to 30 items you sent and it builds one for that session. Save the file as `SOUL.md` if you want to reuse it.
