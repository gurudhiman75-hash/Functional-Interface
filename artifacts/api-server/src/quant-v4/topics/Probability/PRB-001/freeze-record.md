# PRB-001 Freeze Record

## Current decision

**ENGLISH MOCK FREEZE APPROVED.**

PRB-001 is approved for English SSC, banking-prelims and Punjab recruitment-style practice and scored mocks. This is an English mock-readiness freeze, not a multilingual or public-publication freeze.

## Human approval

- Reviewer/owner: Gurbaj Singh
- Approval date: 2026-08-08
- Approval basis: final human review of the regenerated 135-question Probability review, including the corrected self-contained mathematical rendering
- Approved branch commit: `4b8d65b5df44c74dcf6b85ac1dd011bca06ed8ba`
- Blocking workflow: Probability editorial remediation run `31251921954` — passed

## Approved controls

1. All generated questions retain exact mathematical verification and deterministic validation.
2. `PRB-QL-004` and `PRB-QL-010` are learning-only certainty diagnostics and must not enter scored mocks.
3. Every question carries a mock-family identifier and `maxPerMock: 1`, preventing same-template repetition in a single mock.
4. Routine questions retain their source labels for compatibility but carry an independently audited effective mock difficulty.
5. English questions are marked `APPROVED_EDITORIAL_ENGLISH` and mock eligible according to their per-question policy.

## Remaining outside this freeze

- Hindi and Punjabi localisation/parity review
- public publication
- unrestricted question-bank release without family-level selection controls

Any change to mathematics, stems, answer keys, option generation, explanation logic or mock-family policy requires the full Probability workflow to pass again before the English mock freeze can be retained.
