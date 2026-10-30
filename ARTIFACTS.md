# Create and adapt toolkit artifacts

Use this guide when an assistant turns a toolkit method into a review, document, dashboard or browser preview. Read the linked source first. Keep the method's evidence checks and human decisions visible in the output.

## Working rules

- Use only inputs the user permits for the task. Keep private working files in the user's private location. Public examples, previews and downloadable packs contain made-up content created from scratch.
- Never invent personal facts, quotes, dates, outcomes or metrics. Record a source and date for each factual claim when available; label assumptions, inferred findings, simulated readers and unknowns. Preserve coverage limits.
- Public exports contain no private links, identifiers, source extracts or business metrics. Changing names in private material does not make it a made-up example. Read [second-brain/REDACTION.md](second-brain/REDACTION.md) before sharing any derived material.
- Follow the tool's existing approval and privacy rules. Creating an artifact does not authorize sending it, publishing it, selecting achievements, accepting a practice or connecting services.
- Save the editable source alongside the output in the user's chosen location. Return a short change list and the checks performed. Ask the user to review conclusions and wording before reuse.

## Preview, download and copy

Use one pattern for toolkit artifact previews: a clearly labeled made-up example, an empty starting state, **Download starter** and **Copy adaptation prompt**. The download includes the editable source, blank data or template, made-up example, adaptation prompt, validation notes and licenses. The copied prompt names the tool, asks for permitted inputs and requests a saved source file with explicit unknowns.

Keep preview content separate from private working data. Show empty and invalid states clearly; failed imports retain the previous valid view. Test visible download and copy controls, keyboard operation, narrow screens and 200% zoom. Explain what is saved and where. Add no automatic collection, storage, uploads or exports when adapting a static example. The [development review starter](artifacts/development-review/README.md) provides this local import pattern; its [agent guide](artifacts/development-review/AGENTS.md) defines its schema and states.

Label a Claude setup preview as a configuration excerpt and a PM digest preview as a layout. Other previews show example outputs. A layout or settings excerpt alone does not establish that the workflow has run.

Build starter packs from the canonical source folders: `claude-setup` from `claude/`; `skills` from the four `skills/` folders; `second-brain` from `second-brain/`; `routines` from `routines/`; `meeting-review` from `meeting-review/`; `page-saving-extension` from `small-builds/page-saving-extension/`; and `decision-record` from the decision templates below. Include this guide as `AGENT-ARTIFACT-GUIDE.md`, an adaptation prompt and a README where needed. The separate `cv-tailor` artifact pack uses the cv-tailor repository's templates, examples, guides and `ARTIFACTS.md`. The development review pack uses `artifacts/development-review/` unchanged, including its own guide and licenses. Keep installable skill ZIPs available alongside artifact starters.

## Recipes and source paths

Paths below are relative to this repository. "None shipped" means create a blank or made-up example in the user's working copy; do not treat source instructions as a completed artifact. Keep a recipe's output in the editable format named here before adding a preview.

| Artifact | Method or source | Blank starting point | Example | Adaptation recipe |
|---|---|---|---|---|
| Development review | [`artifacts/development-review/AGENTS.md`](artifacts/development-review/AGENTS.md) | [`blank-data.json`](artifacts/development-review/blank-data.json) | [`sample-data.json`](artifacts/development-review/sample-data.json) | Save schema-valid JSON, import into [`starter.html`](artifacts/development-review/starter.html), check evidence and pending states. |
| Meeting review | [`meeting-review/SKILL.md`](meeting-review/SKILL.md) | None shipped | [`meeting-review/sample-output.md`](meeting-review/sample-output.md) | Save a Markdown review from permitted transcripts, verify the subject's quotes, show date coverage and inferred patterns. |
| PM digest | [`routines/pm-digest/routine-prompt.md`](routines/pm-digest/routine-prompt.md) | Copy the prompt and replace its placeholders | None shipped | Save a digest draft with source links and a defined reading window; keep delivery and scheduling permissions separate. |
| Metrics dashboard | [`routines/metrics-dashboard-refresh/README.md`](routines/metrics-dashboard-refresh/README.md), [`parse_example.py`](routines/metrics-dashboard-refresh/parse_example.py) | Replace the parser's schema and checks | [`sample-open-period.csv`](routines/metrics-dashboard-refresh/data/sample-open-period.csv) | Validate before writing data; state metric definitions, units, dates and filters. Use made-up data in a public preview. |
| Product challenge | [`skills/product-sparring/SKILL.md`](skills/product-sparring/SKILL.md) | None shipped | [`artifacts/examples/product-sparring.md`](artifacts/examples/product-sparring.md) | Save a position, supporting evidence and the counter or test that affects the decision. Label unchecked premises. |
| Reader review | [`skills/recipient-panel/SKILL.md`](skills/recipient-panel/SKILL.md) | The reader brief inside the skill | None shipped | Use agreed reader roles; save objections and changes beside the draft. Label every reader response as simulated. |
| Issue draft | [`skills/distill-to-gh-issue/SKILL.md`](skills/distill-to-gh-issue/SKILL.md) | The draft sections inside the skill | [`config.example.md`](skills/distill-to-gh-issue/config.example.md) is configuration only | Save the issue body with evidence and open questions. Follow the skill's target checks and approval step before filing. |
| Voice reference | [`skills/voice/README.md`](skills/voice/README.md), [`SKILL.md`](skills/voice/SKILL.md) | [`SOUL.template.md`](skills/voice/SOUL.template.md) | None shipped | Derive rules from permitted writing; identify evidenced rules and unchecked defaults. Keep the filled voice file private. |
| Second-brain note | [`second-brain/README.md`](second-brain/README.md), [`SETUP.md`](second-brain/SETUP.md) | [`scaffold/note-templates/`](second-brain/scaffold/note-templates/), [`memory/README.md`](second-brain/scaffold/memory/README.md) | [`second-brain/examples/`](second-brain/examples/README.md), [`artifacts/examples/memory-note.md`](artifacts/examples/memory-note.md) | Pick the matching note or memory format. Preserve one home per fact and link its source. |
| Decision record | [`templates/decision-record.md`](templates/decision-record.md) | The same blank document; [`problem-outline.md`](templates/problem-outline.md) for research framing | [`templates/decision-example.md`](templates/decision-example.md) | Fill owner, status, dated evidence, counterargument, test and review result. Keep the original decision rule visible when it changes. |
| Claude setup | [`claude/README.md`](claude/README.md) | [`CLAUDE.template.md`](claude/CLAUDE.template.md), [`settings.example.json`](claude/settings.example.json) | None shipped | Save a setup checklist with exact paths and tested settings. Keep machine-specific values in the private copy. |
| Page-saving extension | [`small-builds/page-saving-extension/readme.md`](small-builds/page-saving-extension/readme.md) | [`notion-db-template.csv`](small-builds/page-saving-extension/notion-db-template.csv) | [`artifacts/examples/saved-page.md`](artifacts/examples/saved-page.md) | Preview a made-up saved-page entry with a source URL and capture date. Keep credentials and private destination IDs out. |

CV artifacts live in the separate [cv-tailor repository's ARTIFACTS.md](https://github.com/DanielErCohen/cv-tailor/blob/main/ARTIFACTS.md). Start from its confirmed main CV and application templates.
