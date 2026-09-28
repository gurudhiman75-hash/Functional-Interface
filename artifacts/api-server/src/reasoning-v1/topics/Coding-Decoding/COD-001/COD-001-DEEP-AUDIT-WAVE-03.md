# COD-001 — Deep Audit Wave 03

Status: **IMPLEMENTED — DISTRACTOR PROVENANCE VALIDATION ACTIVE**

Date: 2026-09-28

## Focus

Wave 03 audits distractor provenance across the entire permanent Coding–Decoding chapter.

Novelty remains deferred.

## Principle

A wrong answer should represent a believable learner error or formally impossible/competing state. It should not exist merely because a fourth display value is needed.

The audit therefore treats explicit wrong-option provenance as a permanent quality contract.

## Existing implementation evidence

Static inspection confirms that the chapter's major runtime families already construct wrong options with explicit labels, including:

- CP001 direct/substitution mistakes;
- CP002 arithmetic/position mistakes;
- CP003 shift/direction mistakes;
- CP004 alternating/class/position mistakes;
- CP005 rearrangement mistakes;
- CP006 multi-stage pipeline mistakes;
- CP007 digit-wise transformation mistakes;
- CP008 renaming-direction/chain mistakes;
- CP009 atomic, set, missing-member, possible/impossible, composition and complete-candidate-set mistakes;
- CP010 conditional-table mistakes;
- source-gap QLs 200..203 with explicit misconception provenance and `arbitraryFallbackUsed: false`.

## Permanent generated proof

`cod-001-distractor-provenance.test.ts` generates:

```text
203 QLs × 3 locales × 4 seeds = 2,436 questions
3 wrong options per question = 7,308 wrong-option checks
```

Every displayed wrong option must:

- carry a non-empty `errorLabel`;
- avoid generic labels such as `wrong`, `incorrect`, `random`, `fallback` or `distractor`.

The test intentionally runs through the localized runtime as well as English so provenance must survive Hindi/Punjabi projection rather than exist only in English internals.

## Wave 02 generated-profile remediation carried forward

The previous profile exposed a fixed-stem defect in:

- `COD-QL-187` — missing token.

The mirror contract `COD-QL-188` had the same one-template design.

Both now use three concise direct-question variants while preserving their solve contracts and localization architecture.

## Current disposition

```text
learner explanation projection:       CLOSED
Question Studio QA-field leakage:     CLOSED
CP008 difficulty integrity:           CLOSED
chapter-wide visible profile:         GREEN after QL187/188 remediation
distractor provenance:                PERMANENT GATE ADDED
source-gap arbitrary fallback:        explicitly false
solver/option truth:                  strong prior closure
multilingual parity:                  strong prior closure + current gates
remaining work:                       final audit synthesis / closure check
novelty:                              DEFERRED
chapter deep-audit closure:           NOT YET
```

COD-001 should move to final deep-audit closure only after the exact-head workflow proves the distractor provenance gate and all existing chapter authorities remain green together.
