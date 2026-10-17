# Project agents

Put agents here that only make sense for this repo: for example a code reviewer that knows this repo's conventions, or an accessibility reviewer. General agents (`researcher`, `red-team`) live in `~/.claude/agents/`. See [`claude/agents/researcher.md`](../../../../claude/agents/researcher.md).

Each agent is one markdown file with frontmatter (`name`, `description`, `model`, `tools`) and a brief of a few lines. Keep the brief narrow: one job per agent.
