# BLR-001 — Reasoning V1 Final Audit Wave 01

Status: **P1 remediation candidate — current learner semantics and permanent QL ownership preserved; no downstream release gate opened.**

## Audit objective

Run the same final-audit standard already applied to Analogy, Classification, Series, Coding-Decoding and Alphabet Test:

- realistic SSC / Banking / Punjab exam surfaces;
- non-trivial but plausible distractors;
- generated-instance difficulty rather than label-only difficulty;
- simple beginner-first explanations;
- no mandatory shortcut/trap or option-by-option boilerplate;
- multilingual parity and natural-language review boundaries;
- deterministic Question Studio preview;
- explicit lifecycle locks.

## Current chapter authority

- checkpoints: `BLR-CP-001..007`;
- permanent QLs: `BLR-QL-001..035`;
- no `BLR-CP-008` is allocated by this wave;
- no QL identity or solve contract is changed by Wave 01.

## Wave 01 findings

### P1 — legacy explanation clutter survives in the learner-review path

Historical BLR editorial layers still carry fields such as:

- `examShortcut` / `shortcut`;
- `commonTraps` / `commonTrap`;
- `optionAnalysis` / `distractorAnalysis`.

The most explicit example is CP003, whose review exporters require a four-tier teaching surface with a speed shortcut, common traps and option-by-option checking on every item.

That is no longer the Examtree explanation standard. The final-audit standard is:

1. explain the relevant family relation clearly;
2. show the useful family tree / deduction steps when they help;
3. state the answer;
4. add trap or option analysis only when the individual question genuinely needs it.

### P1 — CP007 shared Studio metadata mixed current and future lifecycle states

The standard BLR Question Studio wrapper previously projected CP007 preview items as:

- `questionBankWritable = true`;
- `questionBankEligible = true`;
- `testEligible = true`;
- `mockTestEligible = true`;
- `publiclyPublishable = true`;

while the same item also carried:

- `reviewStatus = REVIEW_REQUIRED`;
- `manualApprovalRequired = true`;
- `publicReleaseStatus = LOCKED`;
- `automaticStudentPublication = false`.

This is ambiguous for downstream consumers. "Eligible after manual approval" must not be encoded as "currently writable/publishable".

## Wave 01 remediation

### Compact learner explanation projection

The shared standard Question Studio wrapper now strips legacy mandatory teaching extras from the projected learner explanation:

- shortcut;
- common trap;
- exam shortcut;
- common traps;
- option analysis;
- distractor analysis.

Useful explanation evidence remains available, including step-by-step reasoning, conclusion and other non-boilerplate structured evidence.

The frozen semantic source is not mutated.

### Lifecycle lock correction

All BLR Question Studio generated review items now remain currently locked:

- Question Bank status: `NOT_STORED`;
- Question Bank writable: `false`;
- test eligibility: `INELIGIBLE`;
- mock-test eligibility: `false`;
- publicly publishable: `false`;
- review-only: `true`.

For CP007, the separate capability `releaseEligibleAfterApproval = true` records the future manual-approval path without opening the current item.

Generation-run persistence to the normal editorial review queue remains allowed; this does not mean Question Bank or learner publication eligibility.

## Still open after Wave 01

Wave 01 does **not** declare BLR-001 final-audit complete. The remaining audit must still inspect:

1. CP001–CP007 generated question surfaces for stem naturalness and fatigue;
2. Easy / Medium / Hard separation from completed learner-visible state;
3. distractor quality and repeated distractor fingerprints;
4. CP001/CP002 multilingual coverage gap;
5. CP003–CP005 Hindi/Punjabi human-language status;
6. CP006 product-integration boundary;
7. chapter-wide source saturation and missing exam-family surfaces;
8. family-tree explanation usefulness and diagram scale/readability;
9. final Question Studio registry / README / authority reconciliation.

## Lifecycle

This wave authorizes **review remediation only**.

Still locked:

- Question Bank admission;
- test eligibility;
- mock-test eligibility;
- student delivery;
- public publication;
- automatic release.
