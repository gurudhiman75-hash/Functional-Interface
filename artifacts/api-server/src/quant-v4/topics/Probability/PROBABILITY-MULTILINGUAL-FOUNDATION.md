# Probability Multilingual Foundation

## Decision

Probability remains **English scored-mock ready**. Hindi and Punjabi have complete draft editorial coverage, complete ML-05 automated runtime parity, and now an **ML-06 Question Studio review-only surface** for human editorial inspection.

This review-only exposure is deliberately different from normal native generation:

- reviewers may preview Hindi/Punjabi Probability items and persist them to the Question Studio review queue;
- the multilingual release manifest still keeps native `questionStudioEnabled: false`;
- native Question Bank writing remains disabled;
- native scored mocks remain disabled;
- public/student publication remains disabled;
- committed human approval evidence is currently **0/432**.

ML-05 proves mathematical/runtime parity. ML-06 makes those exact rendered native surfaces reviewable without pretending that automated parity is human editorial approval.

## Authority model

The English Probability runtime remains the sole mathematical authority for:

- parameter generation;
- exact rational arithmetic;
- experiment and event construction;
- solver output and solver evidence;
- independent verification;
- options and correct-option index;
- mock-family policy;
- difficulty and exam-profile routing;
- parameter and mathematical fingerprints.

Hindi and Punjabi replace only student-facing presentation. Native review cannot recompute mathematics or alter the English answer key.

## Current inventory

| Package | English QLs | Hindi draft | Punjabi draft | ML-05 parity | ML-06 review surfaces |
|---|---:|---:|---:|---:|---:|
| PRB-001 | 120 | 120 | 120 | 240/240 pass | 240 |
| PRB-002 | 96 | 96 | 96 | 192/192 pass | 192 |
| **Total** | **216** | **216** | **216** | **432/432 pass** | **432** |

The release manifest still contains **648 language records**: 216 English, 216 Hindi and 216 Punjabi. Hindi/Punjabi remain `PENDING_NATIVE_EDITORIAL` until real human review evidence is complete and a separate multilingual freeze is explicitly granted.

## Foundation guarantees

1. English remains `APPROVED_EDITORIAL_ENGLISH` and normal Question Studio generation remains English-authoritative.
2. Every Hindi and Punjabi release-manifest QL remains `PENDING_NATIVE_EDITORIAL`.
3. The ordinary native generation guard remains closed.
4. ML-06 review-only preview/persistence cannot write to Question Bank or enable tests.
5. No language becomes publicly publishable through editorial review alone.
6. Every native review item retains its English source IDs, seed and fingerprints.
7. Public release remains a separate checkpoint after human review and explicit freeze.

## ML-02 shared native primitive authority

`native-language-primitives.ts` is the shared Hindi/Punjabi Probability vocabulary and validation authority. It provides:

- probability/event/outcome/sample-space terminology;
- coins, dice, cards, bag/urn, spinner and number vocabulary;
- colours, suits and card ranks;
- selection/arrangement/permutation/combination terminology;
- explanation labels;
- closed primitive and textual-option localisation;
- script validation;
- unresolved-placeholder detection;
- fail-closed English-prose leakage detection.

Probability mathematics remains language-neutral:

- ASCII digits `0-9` are preserved;
- integers, fractions, percentages and ratios are preserved;
- MathJax is preserved;
- unknown prose bindings throw rather than silently falling back to English.

## ML-03 PRB-001 draft editorial authority

`PRB-001/native-editorial.ts` contains draft Hindi/Punjabi editorial content for all **120 PRB-001 QLs**:

- 120 Hindi entries;
- 120 Punjabi entries;
- 240 native entries;
- 37 curated wording families.

The entries preserve English QL identity, stem-template contract and generated-value bindings. `PRB-QL-004` and `PRB-QL-010` remain learning-only.

**Status:** merged through PR #669.

## ML-04 PRB-002 draft editorial authority

`PRB-002/native-editorial.ts` contains draft Hindi/Punjabi editorial content for all **96 PRB-002 QLs**:

- 96 Hindi entries;
- 96 Punjabi entries;
- 192 native entries;
- 30 curated wording families covering successive draws, conditional probability, counting/arrangement and event algebra.

Every entry preserves English option/correct-index authority and remains non-publishable.

**Status:** merged through PR #675.

## ML-05 multilingual runtime and parity authority

`multilingual-runtime.ts` implements the English-first presentation overlay.

A native presentation is not a second mathematical question. The runtime:

1. generates/obtains the valid English Probability question;
2. resolves the exact native editorial entry;
3. binds the English-generated values through the closed native binding layer;
4. renders native stem, explanation and learner-facing visual text;
5. preserves options, correct index and answer exactly;
6. returns explicit parity evidence.

English remains authoritative for seed, parameters, experiment/event AST, solver, verification, options, answer, fingerprints and mock policy.

Native-only fields are stem, event wording, explanation prose, learner-facing visual labels and language-specific presentation IDs.

The complete harness validates all **216 QLs × 2 native languages = 432 presentations**, including deterministic replay, option/answer/correct-index parity, fingerprint parity, native scripts, visual localization and source non-mutation.

**Status:** merged through PR #681, merge commit `7818281e9f8975f6012c5b34beb149a292f90e63`.

## ML-06 human-review readiness authority

ML-06 adds a dedicated review boundary around the ML-05 presentation layer.

### Review adapter

`native-review-adapter.ts` exposes a deterministic catalog of all 216 English QLs and their 432 Hindi/Punjabi review surfaces.

Review filters include:

- language;
- PRB-001 / PRB-002;
- QL;
- difficulty;
- deterministic seed;
- batch count.

Before a review item is returned, the adapter rechecks:

- valid English source;
- valid native ML-05 presentation;
- option-array parity;
- correct-index parity;
- answer parity.

### Question Studio review-only integration

ML-06 mounts dedicated admin endpoints under:

`/admin/question-studio/quant/probability/native-review`

The admin panel can preview native questions and create normal Question Studio **review runs**. Persisted payloads are intentionally stamped:

- `reviewOnly: true`;
- `questionBankStatus: NOT_STORED`;
- `questionBankWritable: false`;
- `testEligibility: INELIGIBLE`;
- `testEligible: false`;
- `mockTestEligible: false`;
- `publiclyPublishable: false`;
- `automaticStudentPublication: false`;
- `releaseFreezeStatus: PENDING_HUMAN_REVIEW`.

Review-queue approval therefore does not equal product release.

### Human-review freeze ledger

`native-review-freeze.ts` is the committed ML-06 freeze authority.

It deliberately starts with **zero fabricated decisions**. A real review decision must record:

- QL ID;
- language;
- reviewer;
- review timestamp;
- `APPROVED` or `CHANGES_REQUIRED`;
- notes.

A complete editorial review requires **432 unique approvals**:

- 216 Hindi;
- 216 Punjabi.

Current committed evidence:

- recorded decisions: **0/432**;
- Hindi approvals: **0/216**;
- Punjabi approvals: **0/216**;
- freeze status: `PENDING_HUMAN_REVIEW`.

Even when 432/432 approvals exist, the ledger only becomes `HUMAN_REVIEW_COMPLETE_AWAITING_EXPLICIT_FREEZE`. Student delivery still requires a separate explicit freeze/release change.

### ML-06 regression boundary

`native-review-adapter.test.ts` regenerates all **432 review surfaces** and proves:

- 216 Hindi and 216 Punjabi surfaces are reachable for review;
- source/native validity is preserved;
- option, correct-index and answer parity remains intact;
- review-only lifecycle flags remain locked;
- release manifest remains unchanged;
- human approval count remains truthful;
- freeze and student-delivery guards remain closed without evidence.

See `ML-06-NATIVE-REVIEW-READY.md` for the human editorial review checklist and evidence contract.

## Implementation checkpoints

### ML-01 — Foundation and inventory
**Status:** merged through PR #646.

### ML-02 — Shared native language primitives
**Status:** merged through PR #658.

### ML-03 — PRB-001 native editorial library
**Status:** merged through PR #669.

### ML-04 — PRB-002 native editorial library
**Status:** merged through PR #675.

### ML-05 — Multilingual runtime and full parity harness
**Status:** merged through PR #681.

### ML-06 — Human review and multilingual freeze

Implemented review-ready infrastructure:

- 432 parity-backed review surfaces;
- Question Studio review-only preview;
- review-queue persistence;
- review status metrics;
- explicit human-decision ledger;
- fail-closed freeze guard;
- no automatic Question Bank/test/public release.

**Current state:** `ML-06-REVIEW-READY`; human editorial approvals are still **0/432**.

ML-06 is not complete as a human-review checkpoint until real reviewers inspect the surfaces, necessary wording corrections are made, full parity is rerun, and explicit decision evidence is committed.

### ML-07 — Public release

Only after ML-06 human approval and explicit native scored-mock freeze:

- enable intended native generation/test routing;
- review public rendering/search/filter/test-series integration;
- grant final publication approval;
- only then may `publiclyPublishable` become true.

## Non-negotiable safety rules

- Automated parity is not human editorial approval.
- Missing native entries, bindings or visual strategies must throw.
- Native prose cannot change parameters, solver evidence, options, correct index or mock policy.
- Review-queue persistence cannot imply Question Bank eligibility.
- A database review approval alone cannot unlock scored native mocks.
- Native student delivery requires explicit committed human-review evidence plus a later release freeze.
- Public publication remains independently locked.
- The English mathematical/runtime authority remains unchanged throughout multilingual implementation.
