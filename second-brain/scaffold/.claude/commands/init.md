Orient yourself to the current state of this second brain and produce a session brief.

Do not rely on the folder lists in `.claude/CLAUDE.md` - that file describes structure only.
Derive current state from the repo itself.

Steps, in order:

1. Read the indexes: `02-areas/areas.md` and `03-resources/resources.md`.

2. List `01-projects/` and `02-areas/` to see what exists.

3. Determine what is actually recent. **Use git history for dates.** In a freshly cloned or
   synced repo every file's mtime is the clone time, so mtimes will tell you everything changed today,
   which is wrong. Use:

   ```
   git log --format='%ci' --name-only -20
   ```

   to see what has genuinely been touched, and `git log -1 --format=%ci -- <path>` for one path.

4. Check `00-inbox/` for unfiled items and count them.

5. Output a **Session brief**, scannable, short bullets only:
   - **Active** - projects with commits in the last 14 days
   - **Quiet** - projects with no commit in 30+ days, flagged as possible archive candidates
   - **Inbox** - count of unfiled items, and the oldest one's age
   - **Recent captures** - anything new worth noting
   - **Drift** - anything in `.claude/CLAUDE.md` that no longer matches the tree

6. End with: "What would you like to work on?"

Never display credentials, account numbers, or medical values encountered while reading. Skip them
silently.
