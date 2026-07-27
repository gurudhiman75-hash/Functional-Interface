# PNL-001 Question Studio Canonical Review Runtime

Status: **REGISTERED IN QUESTION STUDIO — QUESTION BANK, TEST AND PUBLIC ROUTING DISABLED**

## Purpose

Expose the frozen PNL-001 content through a deterministic Question Studio review runtime without implying that canonical reviewed fixtures are a complete dynamic generation engine.

## Runtime scope

- package: `PNL-001`;
- topic: `Arithmetic`;
- subtopic: `Profit & Loss`;
- canonical problem groups: `PNL-CP-001` through `PNL-CP-006`;
- reviewed QLs: `PNL-QL-001` through `PNL-QL-186`;
- language in this first adapter: English;
- runtime mode: `CANONICAL_REVIEW`.

The adapter uses the final concise Editorial V2 stem and friendly explanation for every QL, together with the mathematically reviewed four-option fixture and keyed answer.

## Shared Quant V4 registration

`quant-v4/generation-engine.ts` now exposes one Question Studio package:

```text
PNL-001 — Profit & Loss — Canonical Review
```

Package discovery deliberately hides the six raw nested `CP-001..006` folders and exposes them as six canonical-problem selectors inside the single PNL package.

Generation requests may resolve PNL through:

- `packageId: PNL-001`;
- `archetypeId: PNL-001`;
- a PNL package/pattern selector;
- `topic: Arithmetic` with `subtopic: Profit & Loss`.

A mixed batch rotates deterministically through all six CP groups. An explicit `canonicalProblemId` limits generation to one CP, while an explicit `questionLanguageId` selects one exact reviewed QL.

## Why canonical review mode comes first

PNL-001 has complete solver ownership and validated editorial libraries, but it does not yet have one uniform per-QL parameter generator that emits all 186 contracts through the shared Quant V4 `QuestionPackage` interface.

The adapter therefore does not pretend that changing a seed creates a new numeric variant of the same QL. A seed deterministically selects a reviewed QL within a requested CP and difficulty. An explicit `questionLanguageId` selects that exact QL.

A later dynamic runtime must provide and validate a real parameter generator for every QL before it may replace canonical review mode.

## Safety contract

Every package carries:

```text
reviewStatus: APPROVED_EDITORIAL_CANONICAL
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
publiclyPublishable: false
runtimeMode: CANONICAL_REVIEW
```

Question Studio may review and export these packages. They must not be written automatically to the Question Bank, selected for tests, or published.

Hindi and Punjabi requests are rejected by this first adapter rather than falling back silently to English. Native runtime exposure remains a separate review gate.

## Validation

The standalone 186-QL proof verifies:

- contiguous QLs `001..186`;
- exact CP counts `36 / 34 / 24 / 26 / 29 / 37`;
- 186 unique stems;
- four unique options per QL;
- exactly one reviewed keyed answer;
- no unresolved prose placeholders;
- no synthetic generated-style question openings;
- friendly explanations;
- deterministic seed selection;
- explicit QL selection;
- difficulty filtering;
- safety flags on every entry and emitted package.

The shared registration proof verifies:

- exactly one discoverable `PNL-001` package;
- zero raw nested PNL CP packages in Question Studio discovery;
- all six CP selectors;
- a mixed 12-question batch covering all six CPs;
- subtopic-based resolution;
- exact QL selection;
- answer and option integrity;
- English-only language enforcement;
- Question Bank, test and public-routing safety.

## Source corrections found during integration

The integrated runtime audit found two issues that static structure checks did not expose clearly:

1. `PNL-QL-092` must state that the required remaining-stock price is for an overall `10%` profit.
2. `PNL-QL-183` must retain the selling price and variable cost of both products in the product-mix caselet.

For `PNL-QL-092`, both the normalized source generator and the committed `CP-003/editorial-content.en.json` now contain the complete target wording.

For `PNL-QL-183`, the canonical review fixture retains all Product A and Product B selling-price and variable-cost data, and the shared integration proof checks those values explicitly.

## Remaining post-registration work

The following are deliberately outside this integration:

1. a genuine per-QL dynamic parameter generator for all 186 contracts;
2. integrated Hindi and Punjabi canonical runtime fixtures;
3. Question Bank approval/write workflows;
4. test-assembly eligibility;
5. public publication routing.

None of these may be enabled merely because Question Studio review generation is available.
