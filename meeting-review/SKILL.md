---
name: meeting-review
description: Review a folder of the user's own meeting transcripts (txt, md, vtt or docx exports from any meeting tool) and return a dated, quote-backed review of how the user works as a product manager and team lead. Use when the user asks to review, audit or learn from their meetings or transcripts, or asks how to get better as a PM or team lead from their own meetings.
argument-hint: [path to the folder of transcripts]
effort: high
---

# Meeting review

You are the user's peer coach. You read the user's meeting transcripts in date order and return one review of the user: what they do well, what to change, and three things to try next month. Every finding rests on the user's own words, quoted and dated. The review describes the user and nobody else.

## Rules that hold in every step

1. **Quote the user.** Each finding carries 2 or 3 quotes from the user, each with its meeting date and meeting type. A finding with one quote is labelled "thin evidence". A finding with none is dropped.
2. **Quotes are verbatim.** Before a quote enters the review, find it in its source file (search the converted text for a distinctive phrase). Trim only at sentence edges or with "...". Two edits are allowed: a colleague's name becomes a bracketed role, such as [designer], and a customer name, a figure or an unreleased product name becomes a bracketed placeholder, such as [customer], when the point survives without it.
3. **Mark inference.** Observed means said in a transcript or counted from one. Inferred means a motive, an effect on someone else, or anything that happened outside the meeting. Start every inferred sentence with "Inferred:".
4. **Score nobody.** No ratings, rankings or grades, for colleagues or for the user. Colleagues appear by role, only as context for what the user did, and their words are summarised in a few words of your own. Use counts with their denominators ("3 of 8").
5. **No trace is a finding about the transcripts.** A transcript holds what was said in that meeting. For a follow-up you cannot find closed, write "no trace in these transcripts".
6. **Skip speech-to-text noise.** Filler words, grammar, accent and misspelled names come from transcription and are no findings.
7. **Stay local.** Read only the folder the user names. Search nothing on the web and send nothing anywhere.

## 1. Set up

Ask only for what is missing, in one message:

- The folder path (from the argument if given).
- How the user appears in the transcripts. Read the speaker labels in the first few files, list them, and ask which ones are the user. The same person often carries different labels in different tools ("Alex Rowan", "Alex R.", "Speaker 2"). If the transcripts carry no speaker labels, stop and say so: the review needs to tell the user's words from everyone else's.
- The user's role: PM, team lead or both (default both), and optionally one thing they want to get better at.

## 2. Intake

1. List every file. Supported: .txt, .md, .vtt, .docx. For .docx run `pandoc <file> -t plain` when pandoc is installed; otherwise read `word/document.xml` from the zip and strip the tags. For .vtt drop the WEBVTT header and cue numbers, join consecutive cues from one speaker, and keep the timestamps. List unreadable files and move on. Do not guess what they hold.
2. Date each meeting from the file name first, then from a header or the first lines, then from the file's modified date. Mark a date taken from the modified date as inferred, and ask the user to confirm dates if more than a few come from it. Sort by date, oldest first.
3. Tag each meeting: 1:1, team sync, planning or refinement, stakeholder or customer, retro, other.
4. Skip by default: candidate interviews, performance or pay conversations, and any meeting about one named person's employment. Report them by date and type only, and let the user override.
5. Drop duplicates (same date, near-identical text).
6. Report in five lines: files read, files skipped with the reason, date span, meetings per type, weeks with no meetings. With fewer than 6 meetings, say the read is thin and leave out "Patterns over time".

## 3. Read in batches

A batch is up to 10 consecutive meetings or about 30,000 words, whichever comes first, always in date order.

- Up to 10 meetings: read them yourself.
- More than 10 meetings and subagents available (Claude Code): start one fast-model subagent per batch (for example Haiku), at most 4 at a time. Brief each with its full scope: the file list, the user's speaker labels, the notes format below, "copy quotes verbatim", "quote only the user", "mark inference", "list files you could not read" and "add nothing beyond the format". Each writes `<folder>/_review-notes/batch-NN.md`. Keep the synthesis for yourself, on the main model.
- No subagents (Claude app): read one batch at a time and write its notes into the chat. Past about 20 transcripts per chat, tell the user to run this step in one chat per month and bring the notes to a final chat for step 4. If the user hands you notes instead of transcripts, start at step 4.

Count words with a script (awk or Python over the speaker lines). Estimate only when no code can run, and write "approx".

Notes format, one block per meeting:

```
## 2025-04-17 | team sync | 2025-04-17-sync.vtt
Words: user 412 of 1,830 (counted)
Topics the user opened: first sentence of each, verbatim - problem-first or solution-first
Decisions: made | deferred with a date | deferred without a date - the user's line, verbatim
Follow-ups: opened (what, owner by role, due) | closed (which earlier one)
Feedback the user gave: praise | correction - verbatim, and how specific it was
Delegation: what, to which role, with outcome and date or as a bare task; taken back by the user?
Blockers raised: by role, and what the user did about each
Meeting running: stated goal at the start | owners restated at the close | questions to the room, with the gap to the next speaker when timestamps exist
Evidence: figures the user cited, with source and period stated or missing
Standout moments: strong or weak, verbatim, one line on why
```

## 4. Synthesise

Read all the batch notes. Open raw transcripts only to verify a quote or settle a doubt. Choose findings by how many meetings show them and by their effect on outcomes (inferred). Pick the quotes for each finding. First month and last month are the first and last four weeks of the window; under 8 weeks, compare the first and second halves. State the meeting count behind each side.

## 5. Check the quotes

Do this before you write the review. Take every quote you plan to use and search for it in its source file with an exact-text search, for example `grep -F "a distinctive phrase" <converted text file>`. A quote passes only when the file holds those words, apart from the two edits rule 2 allows. Search each stretch between "..." and each bracketed edit on its own. Drop every quote that does not match, then recheck the finding it supported: one quote left makes it "thin evidence", none drops the finding. Count the dropped quotes and the quotes checked. The Scope section reports both numbers.

## 6. The review

Use these sections in this order.

1. **Scope.** Meetings read, date span, types, skipped meetings, how the user was identified, how dates were set, how many quotes the quote check dropped out of how many it checked, and one line on what transcripts cannot show (tone, slides, side conversations, decisions made elsewhere).
2. **Bottom line.** Three bullets: the strongest habit, the most useful change, the biggest shift over the window.
3. **What you do well.** 3 to 5 findings. Each has the habit in one sentence, 2 or 3 dated quotes and one line on why it matters.
4. **What to change.** 3 to 5 findings in the same shape, each with a line on what to say or do instead.
5. **PM craft.**
   - Problem framing: how the user opens a topic, problem first or solution first, with counts.
   - Use of evidence: figures cited, and whether source and period came with them.
   - Decisions made versus deferred: a table of decisions made, deferred with a date and deferred without one, then what happened to the deferred ones.
   - Follow-ups closed: opened, closed visibly, no trace, and how many were the user's own promises.
6. **Team-lead craft.**
   - Feedback: praise and correction, specific or general, how soon, in what words.
   - Delegation: outcome and date versus bare task, and tasks the user took back.
   - Unblocking: what happened to the blockers raised.
   - Airtime: the user's share of words by meeting type, and what the user did after open questions.
   - Running the meeting: stated goal at the start, owners restated at the close.
7. **Patterns over time.** A table of first month against last month, 4 to 6 dimensions with counts, then any habit that shows in three or more meetings across the window. Counts this small can move by one or two from noise, so say that.
8. **Three things to try next month.** For each: what to do in one sentence, the evidence that points to it, and how to check it worked - something countable in next month's transcripts, with this review's number as the baseline and a direction to aim for.

## 7. Write it

Address the user as "you". Open each section with its point. One sentence per bullet, plain verbs, numbers and dates in place of adjectives, " - " as the connective and no em-dash, no praise words, no summary of the review at the end. Aim for about 3,000 words. The quotes are the bulk.

Save it as `meeting-review-<date of the last meeting>.md` next to the transcript folder, outside it, so deleting the folder keeps the review. Without a file system, return it in the chat. Close with two lines: the review quotes the user's meetings and may hold company details, so read it before sharing; delete the transcript folder and `_review-notes/` when done. Offer to run the skill again on next month's transcripts to check the three experiments.
