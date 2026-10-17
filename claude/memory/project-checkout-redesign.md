---
name: project-checkout-redesign
description: State of the checkout redesign: freeze date, owner of the payment piece, where decisions live
type: project
---

The checkout redesign freezes on 2026-11-01. After that date only bug fixes merge.

The payment-provider change has its own owner and its own PR train. Do not touch `src/payments/` in other lanes.

**Why:** the freeze date follows a promotion the team committed to, so a slip costs a launch window.

**How to apply:** when a task mentions checkout, check the date first. Past the freeze, ask before adding scope. Decisions: `decisions/2026-10-02-checkout-flow.md` in the knowledge-base repo.
