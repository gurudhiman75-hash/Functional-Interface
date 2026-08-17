# SAP Hindi / Punjabi Localization — Content Approved / Standard Question Studio Lifecycle

Status: `LOCALIZATION_CONTENT_APPROVED_REVIEW_READY`

The frozen English Simplification & Approximation Question Studio package has completed Hindi (`hi-IN`) and Punjabi (`pa-IN`) editorial localization review. English remains the canonical mathematical authority; localization changes learner-facing presentation only.

## Preserved exactly

- SAP-QL-001..SAP-QL-211 identity
- SAP-CP-001..SAP-CP-012 ownership
- canonical English source seed / mathematical state
- difficulty band
- option position ancestry
- correct index
- canonical English option/answer traceability
- standard shared Question Studio generation, review, approval and Question Bank promotion workflow

## Content validation completed

- chapter-wide English acceptance: 211 QLs, 3 distinct states per QL, 833 generated questions total
- Hindi/Punjabi authored diagnostic: 422 localized QL/language cases
- Hindi/Punjabi authored release audit: 422 localized QL/language cases
- Hindi/Punjabi two-seed human-language quality audit: 844 localized states
- Easy / Medium / Hard shared Question Studio batches in Hindi and Punjabi
- no duplicate full English learner questions in the acceptance corpus
- no residual English learner prose outside protected mathematics in approved localized states
- canonical answer/index/source-state parity preserved
- legacy localization dictionary duplicate-key warnings removed without changing behavior

## Standard Question Studio lifecycle

SAP now follows the same normal lifecycle as a Question Studio package with approved content:

1. generate questions in the shared Question Studio;
2. review, revise, reject or approve them with the existing production quality gate;
3. when an administrator approves an eligible item, the existing Question Studio approval endpoint converts it to Question Bank through the shared conversion service;
4. after conversion, the normal Question Bank, test-builder, student-delivery and publication rules apply exactly as they do to other questions.

There is no SAP-specific downstream activation step, Question Bank route, persistence path, publication route, or test-builder integration.

`questionBankStatus: WRITABLE`, `testEligibility: ELIGIBLE`, and `publiclyPublishable: true` mean the item may use the normal platform lifecycle after explicit administrator review/approval. They do **not** auto-approve, auto-publish, or automatically place a generated question into a mock test.

## Enabled

- English
- Hindi
- Punjabi
- shared Question Studio package discovery
- shared Question Studio generation runs / normal review queue
- standard admin approval → Question Bank conversion
- normal downstream platform use after Question Bank conversion

No additional SAP-specific lifecycle switch is required.
