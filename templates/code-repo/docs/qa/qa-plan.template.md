# QA plan: <build>

Build: <version or commit>
Date: YYYY-MM-DD
Tester: <person or agent>
Product doc: `<knowledge-base-repo>/product/product-doc.md`

## What changed
- <change, linked to its PR>

## Risk areas
Ranked by impact if wrong.
1. <area>
2. <area>

## Walks
| # | Flow | Device or browser | Steps | Expected | Result |
|---|---|---|---|---|---|
| 1 | <flow> | <device> | <numbered steps> | <what a person sees> | pass, fail, blocked |

## Accessibility
- [ ] Every control has a label.
- [ ] Text scales.
- [ ] Contrast and focus order checked on the changed screens.

## Instrumentation
- [ ] Each new event fires once, with the properties in the catalog.
- [ ] No analytics event fires before consent.

## Regression
- [ ] <existing flow that shares code with the change>

## Exit
Ship when no blocker is open and every walk is pass or has a filed issue. Findings go to `qa-findings/YYYY-MM-DD-<build>.md` in the knowledge-base repo.
