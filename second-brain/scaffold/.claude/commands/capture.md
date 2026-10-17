File unsorted items from `00-inbox/` into the right PARA location.

For each item in `00-inbox/` (or the specific item named in the invocation):

1. Read it. Determine what it actually is: a committed outcome, an ongoing responsibility, reference
   material, or something already dead on arrival.

2. Route it by the PARA question, in this order:
   - Is there a committed outcome with an end state? → `01-projects/<project-slug>/`
   - Is it a standard to maintain with no end date? → `02-areas/<area-slug>/`
   - Is it reference with no action attached? → `03-resources/<topic-slug>/`
   - Already finished or irrelevant? → `04-archive/`, or propose deleting it

3. Rename to the convention: `lowercase-with-hyphens`, and `YYYY-MM-DD-slug.md` if the note is
   inherently dated (a meeting, a log entry, a decision).

4. If the note is a decision, a project, an area, or a captured source, apply the matching file from
   `note-templates/` so it carries the same frontmatter as its siblings.

5. Update the relevant index (`02-areas/areas.md` or `03-resources/resources.md`) if you created a
   new directory.

6. Report what moved where, as a short table. Propose; do not delete anything without asking.

**When the routing is genuinely ambiguous, say so and leave the item in `00-inbox/`.** A wrong
permanent home costs more than one more week in the inbox. Do not invent a project to justify filing
something.

If an item contains credentials or third-party personal data, flag it and stop rather than filing it.
