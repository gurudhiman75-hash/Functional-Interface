# INT-CP-003 — Final English Freeze

## Status

**APPROVED ENGLISH IMPLEMENTATION FROZEN**

The product owner explicitly approved the INT-CP-003 English question-and-explanation review candidate on **2026-08-07**. This file records the immutable English freeze boundary.

## Approved source

| Field | Approved value |
| --- | --- |
| Freeze ID | `INT-CP-003-EN-v1-frozen` |
| QL range | `INT-QL-053..INT-QL-066` |
| QL count | `14` |
| Language | `en` |
| Locale | `en-IN` |
| Source branch | `fix/int-cp003-authority-consolidation` |
| Source head | `f9b48eb776b644c81f1e7ad0ff5a3707511658f1` |
| Approval comment | `5211491612` |
| Generator | `INT-CP-003-EXAM-GENERATOR-v13` |
| Workflow run | `31109279518` |
| Artifact ID | `8970950939` |
| Artifact digest | `sha256:05bcc218170863b65383f6278426228d88d84b540b12275f73d83d79289caf4a` |
| Review Markdown SHA-256 | `281cc8df2b9cb3b2c57bc33e66107d806efc4c0805cc6bef203cfe305214825d` |
| Review data SHA-256 | `b9630a95c2e67a650d2e631bcc3ae2f961734da4aa0b06cc08c30b55c184490b` |
| Registry SHA-256 | `b5119c5db5e6252c3e340c20d9e01022147bc9ad9d17c83b55a23db2093fda01` |

## Frozen scope

The freeze covers:

- the permanent identities `INT-QL-053` through `INT-QL-066`;
- the annual-compounding solve contracts owned by INT-CP-003;
- English learner-facing question stems and structured presentations;
- answer options, correct-answer ownership and distractor logic;
- student explanations, quick methods, checks and common-mistake guidance;
- the mathematical authority, canonical solver, relation verifier and solution-trace semantics used by the approved candidate.

## Editorial acceptance

The approved candidate has:

- exam-style stems that do not reveal the solving method;
- no leakage from half-yearly, quarterly, variable-rate, CI–SI difference, depreciation, population, instalment or cash-flow CPs;
- neutral contexts for high rates and realistic banking wording only for the approved banking-rate set;
- structured questions that show givens rather than pre-calculated multipliers or shortcuts;
- simple student-facing explanations with question-specific values and intermediate calculations;
- balanced correct-option positions and all 16 approved annual rates;
- 56 review questions covering all 14 QLs, six presentation types and distinct mathematical states.

## Inactive delivery boundary

Approval and freezing do **not** activate delivery.

```text
enabled:                     false
stagingStatus:               NOT_STAGED
registrationStatus:          NOT_REGISTERED
questionStudioDiscoverable:  false
questionBankStatus:          NOT_STORED
testEligibility:             INELIGIBLE
publiclyPublishable:         false
```

No staging, registration, Question Studio discovery, question-bank storage, test use, public publication or merge is authorized by this freeze.

## Validation contract

The freeze audit must prove that:

1. the approval comment, source head, artifact and approved hashes remain unchanged;
2. the final registry still contains exactly 14 QLs in the approved range;
3. the clean 56-question Markdown and JSON review projection retain their approved SHA-256 digests;
4. all 1,400 replayed questions remain deterministic;
5. the frozen wrapper changes only approval and lifecycle metadata;
6. all nested learner content is deeply immutable;
7. every delivery lifecycle state remains closed.
