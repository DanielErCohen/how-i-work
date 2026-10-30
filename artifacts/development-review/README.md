# Development review starter

A local teaching starter for one personal review. No accounts, dependencies or installation. Compatible with modern desktop and mobile browsers that support local file selection. For routine editing, use a computer with a plain text editor. No skill is required.

1. Unzip the pack and open starter.html in your browser. It starts empty.
2. Open blank-data.json in a plain text editor. Copy the shape of a record from sample-data.json, replace every made-up value with permitted notes, and save as my-review.json. Every record has title, detail, evidence and limit; enter explicit unknowns where needed. Optional: give an assistant the starter files and adaptation-prompt.txt with your context filled in.
3. Select Import my JSON in starter.html and choose my-review.json. The page rejects malformed data and keeps the previous view.
4. Check all four tabs. Expand Evidence and limits. Use the checklist before treating anything as a conclusion.

The JSON file is your saved source. The HTML only displays it in memory. Reloading opens empty again. You must import your saved file again. The demo buttons replace the displayed view only. Editing the JSON is manual; no automatic synchronization, assessments, collection, selection or export is included.

## Manual first record

Copy this complete JSON into a new my-review.json file. Replace all bracketed placeholders, save, then import. Empty sections remain visibly empty.

```json
{
  "schema_version": 1,
  "mode": "personal",
  "period": "[Your review interval]",
  "last_week": [
    {
      "title": "[One observation]",
      "detail": "[What happened and what you might try]",
      "evidence": "[Permitted evidence, or unknown]",
      "limit": "[What this cannot establish]"
    }
  ],
  "assessment": [],
  "roadmap": [],
  "achievements": []
}
```

## The four sections

- last_week: reviewed observations and a useful practice proposal.
- assessment: current judgments, rationale, counterexamples and uncertainty. A new weekly event does not automatically change a rating.
- roadmap: proposed or accepted practices, where to try them and how to check progress. State acceptance explicitly in your text.
- achievements: candidates with personal contribution, team contribution, delivery stage, unknown outcomes and pending/selected status stated explicitly.

This intentionally small display schema is not a source registry or an assessment database. The states are narrative text in this first prototype. Keep canonical evidence and approvals in your existing private records. If you need structured updates, agreed ratings, identity, permissions or weekly history, extend the schema before adopting this for that workflow.

## Data and privacy

sample-data.json and the embedded example are made up from scratch for this starter. No real individuals, employers, quotes, source links or business metrics are represented. No automatic fetches, network calls, analytics, storage or uploads are included. File import stays in browser memory. The schema URL identifies a standard and does not initiate a request. Sharing a filled JSON file reveals its contents; review and redact separately.

The optional existing Meeting review skill is a separate analysis workflow. It is not included, connected or needed to open the starter. This pack is not a Claude skill ZIP.

## Files

starter.html; blank-data.json; sample-data.json; schema.json; adaptation-prompt.txt; validation-checklist.md; AGENTS.md; LICENSE; OFL.txt.

For agents creating or adapting a review, read [AGENTS.md](AGENTS.md). For other toolkit artifacts, read [ARTIFACTS.md](https://github.com/DanielErCohen/how-i-work/blob/main/ARTIFACTS.md).

MIT licensed. No measured time or token savings are claimed.

Source Serif 4 is bundled in the HTML under the SIL Open Font License; see OFL.txt.
