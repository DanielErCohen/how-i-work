# Meeting review

A Claude skill that reads a folder of your own meeting transcripts and returns one review of you as a product manager and team lead. Site page: https://danielercohen.github.io/ai-pm/toolkit/meeting-review.html

## What you get

The skill reads your transcripts in date order, in batches. It then writes a review of about 3,000 words. It names what you do well and what to change, each backed by 2 or 3 dated quotes of your own words. It covers PM craft (problem framing, use of evidence, decisions made versus deferred, follow-ups closed) and team-lead craft (how you give feedback, delegate, unblock, share airtime and run the meeting). It compares your first month with your last and ends with three things to try next month, each with a count to check it against. It marks anything it infers as inferred. It never scores anyone else.

A short sample of the output follows. Alex and every quote are invented. The full fictional review is in [`sample-output.md`](sample-output.md).

> **Fictional sample.**
>
> **What to change: you defer without a date.** 12 of 31 decision points were deferred. 7 of the 12 had no date.
>
> - 2025-05-01, team sync: "Let's pick this up next week."
> - 2025-05-22, planning: "I'd like to think about pricing a bit more before we decide."
> - 2025-06-03, team sync: "Park it, we'll circle back."
>
> Of the 7 undated deferrals, 3 came back in a later meeting and 4 left no trace in these transcripts.
>
> **Try next month:** replace "park it" with a date and a bringer. Check: count the deferrals and how many carry a date. Baseline 7 of 12 undated, aim for 0.

## Set up

Time: 15 minutes, most of it the export.

1. **Export your transcripts.** Most meeting tools export .vtt, .txt or .docx. A .md file works too. The speaker names must be in the file, because the skill has to tell your words from the others'. Three months gives a good read. Fewer than 6 meetings is too thin for patterns over time.
2. **Put them in one local folder,** for example `~/meeting-transcripts/`. A date in each file name, such as `2025-04-17-team-sync.vtt`, saves the skill from guessing.
3. **Copy the skill.** This works from any folder and clones the repo first if you do not have it. It copies the whole folder, as the site page does:
   ```bash
   [ -d ~/how-i-work ] || git clone https://github.com/DanielErCohen/how-i-work.git ~/how-i-work
   mkdir -p ~/.claude/skills
   cp -R ~/how-i-work/meeting-review ~/.claude/skills/
   ```
4. **Run it.** In Claude Code, say `Use the meeting-review skill on ~/meeting-transcripts`. It asks which speaker labels are you and whether you want the PM view, the team-lead view or both. With more than 10 meetings it starts fast-model subagents to read the batches. The main model writes the review. Before it writes, it checks every quote against its source file with an exact-text search, drops any that do not match and reports how many it dropped. It saves the review next to the folder as `meeting-review-<date>.md`.
5. **Clean up.** Delete the transcript folder, which also holds `_review-notes/`. The review stays.

## Where it works

- **Claude Code:** the full version. It reads the folder, runs subagents for the batches and saves the review as a file.
- **Claude app (desktop and web):** download [meeting-review.zip](https://danielercohen.github.io/ai-pm/downloads/meeting-review.zip). Open Customize, then Skills, select "+", then "Create skill", then "Upload a skill", and choose the zip. Code execution must be on (Settings, then Capabilities; it is on by default, and on Team and Enterprise plans an admin turns it on). Then attach your transcripts in a chat. There are no subagents, so Claude reads the batches itself. A chat holds a limited amount of text, so the number of transcripts that fit depends on their length. When Claude says the files do not fit, run one chat per month, ask each for its batch notes, and bring the notes to a last chat for the review.

The ready zip is on the site: https://danielercohen.github.io/ai-pm/toolkit/meeting-review.html. To build it yourself, run `bash tools/build-skill-zips.sh` in the [ai-pm](https://github.com/DanielErCohen/ai-pm) repo. A plain `zip` of the folder does not work, because the Claude app rejects some frontmatter keys that the script removes.

## Privacy

Transcripts hold your colleagues' words and personal data.

- Before you export anything, check your company's policy on recording, on storing transcripts and on using AI tools. Check the consent rules for the people in your meetings. Rules differ by country and by company.
- Keep the export local, in a folder that no shared drive or sync service picks up. The skill reads only the folder you name and searches nothing. The text still reaches the model provider you use with Claude, so the policy check covers that too.
- Delete the export and `_review-notes/` when you have the review.
- The review describes you only. It quotes only your words, names colleagues by role, and skips candidate interviews and pay or performance conversations unless you say otherwise.
- The review quotes your meetings and may carry company details. Read it before you share it.

## Why I use it

I built this method on my own meeting notes. I wanted to see how I work as a product team lead and as a PM in my own dated words, instead of from my memory of how the meetings went. A transcript holds every decision deferred, every follow-up promised and every question answered, with a date next to each. The review lines them up and counts them. It gives me habits I can count and three experiments, each with a number to check against the next month's transcripts.

## Where it came from

I built the method on my own transcripts first. This version is rewritten from scratch as a general skill. It carries no company material, no transcripts and none of my own findings. The licence is MIT, like the rest of this repo.
