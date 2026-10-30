# 2. Learn from users

What do real people do, and where does the task fail?

| Part | Practice |
|---|---|
| What AI changes here | I run a recipient panel (product preset) of AI-played users from my exact segment to rehearse questions and spot possible gaps before testing with real people. |
| What I check | Demand claims need evidence from real people. I keep interview notes separate from AI suggestions and label feedback from friends. |
| Useful output | Dated user evidence, a list of gaps and the next questions to test. |

I talk to real users first. A recipient panel (product preset) of AI-played users from the exact target segment rehearses flows before real users see them.

## What I do

- Run real interviews and write each one up in a dated file within a day.
- Build the panel from the segment definition: three personas plus one skeptic (four in total, one batch). Each has a job to do, a context (device, time of day, what they use today) and a reason to quit.
- Save each persona as a file with what it found last time, so the notes carry across builds. Add fresh readers each build who have never seen the product.
- Run every build through the recipient panel (product preset) with [`skills/recipient-panel`](../skills/recipient-panel/SKILL.md): one subagent per persona on a fast model, each walking the flow and reporting where it stalls.
- Turn customer feedback into issues one item at a time with [`skills/distill-to-gh-issue`](../skills/distill-to-gh-issue/SKILL.md).

## The artifact

`research/interviews/YYYY-MM-DD-name.md`, `research/personas/` with the panel notes, and the issues that come out of feedback.

## What AI changes here

The panel makes the first usability pass cheap, so I spend real interview time on questions the panel cannot answer. Each persona keeps its own notes file, so a finding from build 3 is still there at build 7.

## Where I still check

- Panel personas say what a model thinks a user would do. Demand evidence comes from real interviews, and every fact a persona states gets checked.
- Friends are biased evidence. I record who said what and mark friend feedback as such.

## Example

- Wellness Coach: the recipient panel walks each build. In Oct '26 its walks led to timer chips replacing the Start sheet's "not available yet" entries and to removing a Talk button for a voice feature that did not exist. As of Oct '26 the re-check on the simulator is pending. Friends will be the first testers, and their feedback will be labelled as such.
- Sparktale: customer feedback is filed one item at a time. Each one becomes an issue that says what happened and why it matters, and the partner developer can start on it without asking me anything.
