# SEA-001 — Hindi/Punjabi Localization Readiness Evidence

Authority: **SEA Seating Arrangement Master End-to-End Family Design V3 (merged)**.

Status: **APPROVED-ENGLISH EXPLANATION-PARITY CANDIDATE READY; HUMAN HINDI/PUNJABI REVIEW PENDING; INACTIVE**.

## Governing localization rule

SEA-001 English is permanently frozen and manually approved. Hindi/Punjabi must therefore preserve not only solve/query/answer semantics but also the **approved English teaching path**.

The authoritative English explanation is the exact presentation produced by `compileSea001TeachingExplanationFromUnknown(...)` and exposed by `sea-001-review-export.ts`. Raw generator `sharedExplanation` is not the review authority.

For every localized caselet, Hindi/Punjabi must preserve:

- the same teaching-block order;
- the same case formation and intermediate arrangements;
- the same case accept/reject decisions;
- the same clue application order;
- the same `So:` teaching actions and cautions;
- the same final arrangement;
- the same correct-answer reasoning;
- the same wrong-option misconception rationale for every option.

Only learner language may change. Unsupported English explanation forms fail closed instead of being summarized or independently reconstructed.

## Why the earlier candidate was superseded

An earlier native Hindi/Punjabi candidate passed semantic and language-safety CI, but manual comparison showed that its explanations could solve the same question using a shorter/different narrative than the approved English explanation. That candidate is **superseded and must not be used for approval**.

The corrected architecture now treats the approved English explanation itself as the sole localization authority.

## Current implementation

The explanation-parity path is implemented through:

- `localization/explanation-parity.ts` — fail-closed translation of approved-English teaching blocks, correct-answer explanations and wrong-option rationales;
- `localization/explanation-parity-candidate.ts` — anchors localization to the same compiled English explanation used by the approved review exporter;
- `localization/explanation-parity-fidelity-polish.ts` — preserves exact details such as ordinals, post-reversal facing and source-driven `So:` teaching actions;
- `localization/explanation-parity-script-polish.ts` — localizes inherited case-direction and grouped-clue labels without deleting teaching content;
- `localization/explanation-parity-language-polish.ts` — keeps participant-name result wording gender-neutral without changing reasoning;
- `sea-001-localized-review-candidate-proof.test.ts` — enforces semantic parity plus approved-English explanation parity;
- `sea-001-localized-review-export.ts` — emits side-by-side approved English vs Hindi/Punjabi solutions and option rationales for human review.

The original native setup/clue/question renderer remains in use for learner-facing stems, while explanation fields are replaced from the approved English authority.

## Exact explanation-parity proof

Implementation head: `d019f736afc87a7afee86e74f247b7210f68b20e`

Wave-5 run: `31798416849`

The localized review proof passed with:

```text
PASS_SEA_001_EXPLANATION_PARITY_REVIEW
localized caselets                  200
localized child questions           800
semantic parity                     200/200
approved-English explanation parity 200/200
shared block parity                 200/200
case accept/reject parity           200/200
option-rationale parity             200/200
query contracts                     16
Latin learner residue               0
known mechanical translationese     0
ordinal grammar violations          0
gendered singular seating markers   0
generic wrong-option fallbacks      0
human language review               PENDING
Question Studio registered          false
publicly publishable                false
```

The same exact run passed the 1,600-caselet production saturation proof, CP001–CP005 regressions, TypeScript, source and authority audits, teaching explanations, review-readiness lock, permanent allocation/freeze and localization readiness.

## Final review artifact

Exact-head artifact:

- artifact: `sea-001-hi-pa-review-200`;
- artifact ID: `9218301753`;
- SHA-256 digest: `3918be759d9ccf56fcef1111c24cfca4e7d3dfb4112a7d3a549f45d0fa358169`;
- implementation head: `d019f736afc87a7afee86e74f247b7210f68b20e`;
- Hindi: 100 caselets;
- Punjabi: 100 caselets;
- total localized child questions: 800;
- renderer: `SEA001_NATIVE_REVIEW_V2_EXPLANATION_PARITY`;
- status: `EXECUTABLE_EXPLANATION_PARITY_HUMAN_REVIEW_REQUIRED`.

The review HTML shows the approved English solution beside the localized solution and shows the English vs localized rationale for every option.

## Manual artifact audit after CI

Representative artifact inspection confirms:

- CP001 preserves Case 1 / Case 2 formation, Case 1 rejection, Case 2 acceptance and the same subsequent clue sequence;
- CP002 preserves facing-arrow reminders used later for left/right reasoning;
- CP003/CP004 preserve circular direction and case/order teaching;
- CP005 preserves mixed-facing case branches;
- PBA020 preserves the complete if/otherwise facing branch and the same Case 1 ❌ / Case 2 ✅ decision;
- QC022 preserves original facing → reversed facing → new left direction → second-person result;
- wrong options preserve the corresponding approved-English misconception rather than replacing it with generic elimination text.

A subsequent language audit also removed gender-assuming participant-name result forms such as `एकता मिलता है` / `ਏਕਤਾ ਮਿਲਦਾ ਹੈ`. In the exact artifact, participant-result forms `मिलता है`, `आ जाता है`, `ਮਿਲਦਾ ਹੈ`, `ਆ ਜਾਂਦਾ ਹੈ` are zero, and learner-facing Latin residue is zero in both languages.

## Protected semantic layer

Localization continues to preserve:

- checkpoint/PBA/permanent QL identity;
- solution and clue semantic fingerprints;
- query-contract identity;
- answer type/value/index;
- answer-determining fact fingerprint;
- option semantic fingerprints and correctness;
- misconception identity and recomputation evidence.

## Lifecycle

```text
Permanent QLs:                   20 (SEA-QL-001..SEA-QL-020)
English:                         FROZEN / APPROVED
Solve inventory:                 FROZEN
Query mix:                       FROZEN
Hindi explanation-parity candidate:   READY FOR HUMAN REVIEW
Punjabi explanation-parity candidate: READY FOR HUMAN REVIEW
Hindi/Punjabi human approval:    PENDING
Multilingual freeze:             NOT APPLIED
Question Studio registration:    false
Question Bank writes:            false
Mock-test eligibility:           false
Public publication:              false
```

Automated explanation parity proves structural and instructional correspondence; it is **not** human Hindi/Punjabi language approval. Multilingual freeze and all product activation remain blocked until the language-review ledger is explicitly approved.
