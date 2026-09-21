# ENG-005-CP004 — Confusable & Usage-sensitive Idioms — Source Audit V1

Status: `IMPLEMENTED_180__HUMAN_REVIEW_PENDING__REVIEW_ONLY`

CP004 adds **180 unique expressions**, bringing ENG-005 to **840 unique idioms/fixed phrases**.

Coverage:
- 36 Easy
- 72 Medium
- 72 Hard
- zero exact phrase overlap against CP001-CP003
- direct and reverse question directions
- aggressive near-equivalent/confusable family blocking
- stricter semantic-similarity exclusion than earlier CPs
- 18,000-question soak
- 60-question review export
- 180 context templates retained as editorial source material

### Context gate

The stored context templates are **not yet exposed in generated questions**. A QA pass found that mechanically inserting canonical base forms such as `one's` can produce unnatural inflection. Rather than ship awkward English, runtime generation remains on clean direct/reverse exam forms. Context templates stay review-only source material for a later surface-realisation pass.

Review-only. No Question Studio registration or downstream release before explicit human approval.
