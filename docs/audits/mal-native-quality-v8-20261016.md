# MAL-001 native stem completion V8 — 2026-10-16

V8 addresses the 27-QL alternate-stem backlog recorded in V7, plus fraction-output replacement and commercial oil-mixture forms exposed by the wider sample. All 67 QLs are required to use authored native stems in the regression. This is stem coverage completion, not whole-chapter editorial approval.

## Changes

- CP003: remove nonessential English framing prefixes, normalize container aliases, and author fraction, unequal-removal and strict-threshold forms while preserving all quantities and operation order.
- CP004: render concentration and moisture stems from exact source state and the requested representation. Preserve complementary component questions, evaporation versus addition, final volume versus loss, and inverse mass tasks. Use current learner material names rather than stale state labels. Equivalent givens may be expressed as total plus concentration instead of two component amounts.
- CP005: cover pricing/inverse ratio, water percentage and total-profit forms.
- CP006: render initial compositions and ordered transfer events from the source ledger key; retain simultaneous exchange, empty vessels, three transfers, unequal returns and cross-vessel ratio direction. Expose the existing source object-context ID so native materials stay paired with the solver context. Share the unchanged context constants without importing generator code into the native renderer.
- Complete moisture/material names and residual Red/Nilgiri/oats/olive tokens in learner stems. Preserve V7 formula-command shielding.

## Validation

The V8 regression exercises 67 QLs × 60 seeds × EN/HI/PA = 12,060 source-language samples (8,040 native questions), plus 1,000-question batches in each language and deterministic replay. It requires authored stems and no untranslated words, numeric option/answer and parameter parity, unchanged TeX command streams, and unchanged delivery locks. Mutating hidden solution fields must not affect CP004 stems; mutating solved transfers must not affect QL066/067 stems. The preexisting full systematic chapter audit is also retained in CI. The new native renderer passes a scoped TypeScript check.

## Remaining editorial work

Native explanation prose and encoded diagram labels still require wording/visual review. Existing nativeStemTemplateMatched flags describe the older regex layer; nativeStemAuthored and nativeStemRuleId describe V8 coverage. Zero fallback in a tested sample is not a human language approval. Review-candidate status and Bank/test/publication locks remain unchanged.
