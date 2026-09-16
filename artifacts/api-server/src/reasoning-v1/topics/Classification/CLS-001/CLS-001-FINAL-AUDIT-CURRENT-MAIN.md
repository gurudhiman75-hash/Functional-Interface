# CLS-001 — Final Audit on Current Main

Status: `IN_PROGRESS_REVIEW_ONLY`

This audit resumes Reasoning V1 final closure for Classification / Odd One Out on current `New-main` after the ALP-001 final-audit merge.

## Current authoritative inventory

Permanent QLs remain `CLS-QL-001..013`. `CLS-CP-008` remains a zero-allocation ownership closure and no later `CLS-QL-*` identity is reserved by this audit.

## Locale/lifecycle truth at audit start

| Checkpoint | English | Hindi/Punjabi | Final-audit action |
|---|---|---|---|
| CP001 | frozen | frozen | regression only |
| CP002 | frozen | frozen | regression only |
| CP003 | frozen | merged review-ready localisation, not frozen | re-audit generated native pack; freeze only after explicit approval |
| CP004 | frozen | absent at audit start | implement parity-preserving review runtime and expose review pack |
| CP005 | frozen | multilingual freeze evidence already present | regression + status reconciliation |
| CP006 | frozen | multilingual freeze evidence already present | regression + status reconciliation |
| CP007 | frozen | absent | implement/review native phase after CP004 |
| CP008 | ownership closed | not applicable | regression only |

The chapter README is stale because it still reports CP003–CP007 as English-only even though CP003 review-ready localisation and CP005/CP006 multilingual freeze work are already present on current main. The README will be reconciled only after the final audit verifies those exact artifacts.

## CP004 audit action

CP004 is number-property classification. Its mathematical state is language-neutral, so the native phase must not regenerate or translate numbers, rules, answer positions, difficulty or ambiguity proof.

The current audit adds `cp004-localized-runtime.ts` with these invariants:

- canonical English runtime remains the sole state generator;
- Hindi/Punjabi preserve QL, prototype, intended rule/value, numbers, options, answer, answer index, difficulty and ambiguity audit exactly;
- learner text is native-language only;
- no forced exam-speed shortcut or common-trap boilerplate is emitted on the native learner surface;
- lifecycle remains review-only and Question Studio / Question Bank / test / publication locks remain closed.

`cp004-localized-runtime.test.ts` sweeps the canonical seed space, requires all admitted rules, Easy/Medium/Hard, four/five-option coverage, deterministic replay and native-script purity.

`export-cp004-localisation-review.ts` emits two Hindi and two Punjabi examples for every admitted CP004 rule for editorial review.

## Remaining final-audit sequence

1. Prove CP004 native parity and review the generated pack.
2. Re-audit CP003 merged native runtime against current language/explanation standards; do not freeze without explicit product-owner approval.
3. Reconcile CP005/CP006 existing multilingual freeze evidence against current main and learner-explanation policy.
4. Implement CP007 Hindi/Punjabi review runtime with strict state parity and exam-natural instructional language.
5. Run chapter-wide exam-realness, difficulty, distractor, ownership, fatigue and learner-explanation audit across QL001–013.
6. Only after all locale surfaces are explicitly approved, build one shared Question Studio review package. Question Bank, test/mock, student delivery and public publication remain separate gates.

## Lifecycle

This branch does not authorize:

- new permanent QL allocation;
- Question Bank writes;
- test or mock eligibility;
- student delivery;
- public publication;
- automatic publication.
