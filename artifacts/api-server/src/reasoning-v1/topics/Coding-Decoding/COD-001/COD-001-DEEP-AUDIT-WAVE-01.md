# COD-001 — Deep Audit Wave 01

Status: **ACTIVE — LEARNER EXPLANATION REMEDIATION IMPLEMENTED**

Date: 2026-09-27

## Scope

This begins the current Reasoning V1 deep audit for the fully completed Coding–Decoding chapter.

Chapter frontier:

- `COD-QL-001..203`;
- `COD-CP-001..010`;
- English, Hindi and Punjabi runtime-proof;
- shared Reasoning V1 Question Studio review package enabled;
- downstream Question Bank/test/mock/publication surfaces still locked.

Novelty is deliberately excluded from this pass and remains deferred to the final Reasoning novelty audit.

## Existing strengths confirmed

COD-001 already has unusually strong evidence:

- 203 permanent QLs;
- full three-locale runtime frontier;
- 3,654-question multilingual chapter closure;
- exact solver and option-truth checks;
- deterministic parity;
- renderer coverage;
- zero exact displayed-question collisions in the multilingual closure;
- late source-gap QLs 200..203 with dedicated discovery/fatigue/localization/editorial proof;
- misconception-labelled distractors in the source-gap extension;
- one shared Question Studio review package.

These older proofs are inputs to the deep audit, not substitutes for it.

## Finding 1 — forced shortcut/trap sections on learner-review surface

### Problem

The shared multilingual review formatter still rendered four mandatory sections:

1. Core Rule;
2. Step-by-Step Solution;
3. Exam Speed Shortcut;
4. Common Trap Analysis.

This older pedagogy style conflicts with the current Examtree reasoning standard used in later deep-audited chapters:

- learner explanations should focus on the actual concept and worked solution;
- shortcut/trap diagnostics may remain internally available for QA;
- they should not be forced onto every learner/reviewer explanation.

The shared Question Studio preview also returned the raw generated explanation object, including QA-oriented shortcut/trap fields.

### Remediation

Reviewer/learner markdown now renders only:

- Core Rule;
- Step-by-Step Solution;
- useful visual alignment/evidence blocks.

The following remain available in the internal runtime pedagogy object for QA but are not projected to Question Studio:

- `quickMethod`;
- `commonTrapAlert`;
- `closestTrapRejection`;
- pedagogical `examShortcut`;
- pedagogical `commonTrap`.

Source-gap concise explanations remain unchanged because they already use the desired rule + worked-steps structure.

## Permanent proof

`cod-001-deep-audit-wave1.test.ts` sweeps:

```text
203 QLs × 3 locales = 609 Question Studio learner/reviewer surfaces
```

It requires:

- review-only lifecycle to remain locked;
- no shortcut/trap fields in the Question Studio projection;
- core rule and worked steps to remain present when the structured pedagogy object exists.

The existing all-QL pedagogy audit is also updated so multilingual review markdown:

- still requires Core Rule and Step-by-Step Solution;
- explicitly rejects the old shortcut/trap headings;
- still checks visual working and internal pedagogy quality.

## CI permanence

The active `reasoning-cod-001-pedagogy.yml` workflow now executes the new Question Studio learner-surface guard in addition to the existing all-QL pedagogy audit and multilingual review export.

While editing this workflow, its trigger was aligned with the current repository CI policy:

- explicit `New-main` PR base;
- chapter path scope;
- `cancel-in-progress: true`;
- no self-workflow path trigger.

## Current disposition

```text
source/exam coverage:               strong prior evidence; deep recheck pending
solver/answer integrity:            strong prior evidence
multilingual parity:                strong prior closure
learner explanation projection:     REMEDIATED
Question Studio explanation surface: REMEDIATED
difficulty integrity:               NEXT
stem realism:                       NEXT
distractor quality:                 NEXT
diversity/fatigue resistance:       NEXT
Question Studio lifecycle:          review-only lock preserved
novelty:                            DEFERRED
chapter deep-audit closure:         NOT YET
```

No permanent QL or semantic solve authority is changed by Wave 01.
