# PNL-001 Question Studio Canonical Review Runtime

Status: **REVIEW RUNTIME IMPLEMENTED — SHARED GENERATOR REGISTRATION PENDING**

## Purpose

Expose the frozen PNL-001 content through a deterministic Question Studio review runtime without implying that canonical reviewed fixtures are a complete dynamic generation engine.

## Runtime scope

- package: `PNL-001`;
- canonical problem groups: `PNL-CP-001` through `PNL-CP-006`;
- reviewed QLs: `PNL-QL-001` through `PNL-QL-186`;
- language in this first adapter: English;
- runtime mode: `CANONICAL_REVIEW`.

The adapter uses the final concise Editorial V2 stem and friendly explanation for every QL, together with the mathematically reviewed four-option fixture and keyed answer.

## Why canonical review mode comes first

PNL-001 currently has complete solver ownership and validated editorial libraries, but it does not yet have one uniform per-QL parameter generator that emits all 186 contracts through the shared Quant V4 `QuestionPackage` interface.

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

Question Studio may review/export these packages. They must not be written automatically to the Question Bank, selected for tests, or published.

## Validation

The dedicated proof requires:

- 186 contiguous QLs;
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

## Verified source corrections during integration

The canonical integration audit found two issues that were invisible to structural source checks:

1. `PNL-QL-092` must state that the required remaining-stock price is for an overall `10%` profit.
2. `PNL-QL-183` must retain the selling price and variable cost of both products in the product-mix caselet.

The canonical review fixture contains the complete corrected questions. The source Editorial V2 libraries should be amended in the same branch before shared generator registration.

## Next gate

After this runtime and source corrections pass:

1. register `PNL-001` in `quant-v4/generation-engine-core.ts`;
2. verify package discovery exposes one PNL package, not six raw nested CP folders;
3. run full-topic and CP-specific Question Studio smoke tests;
4. verify clean export payloads;
5. keep Question Bank/test/public eligibility disabled;
6. add Hindi and Punjabi runtime packages only after native canonical fixtures are independently reviewed in the integrated renderer.
