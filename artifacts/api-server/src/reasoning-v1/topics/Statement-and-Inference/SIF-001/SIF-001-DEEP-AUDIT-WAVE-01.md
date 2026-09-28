# SIF-001 — Deep Audit Wave 01

Status: **ACTIVE — NOVELTY SEMANTICS + LEARNER-SURFACE GUARD IMPLEMENTED**

Date: 2026-09-28

## Scope

This starts the modern Reasoning V1 deep audit for the fully completed Statement & Inference chapter.

Chapter frontier:

- 17 frozen content packs / checkpoints;
- English, Hindi and Punjabi;
- Question Studio registered in review-only mode;
- downstream Question Bank/test/mock/public delivery locked.

Novelty remains explicitly deferred to the final cross-chapter Reasoning novelty pass.

## Finding 1 — misleading NOVELTY validation state

The validator previously exposed a passed gate named `NOVELTY`.

Its detail text correctly said that the check only proved fingerprint readiness, but a passed gate literally named `NOVELTY` could be read as chapter novelty having been audited and approved.

That conflicts with the chapter freeze, which explicitly records:

```text
noveltyExpansion: DEFERRED_TO_CROSS_CHAPTER_FINAL_PASS
```

### Remediation

The gate is now named:

```text
NOVELTY_READINESS
```

It proves only that semantic identity is fingerprinted for later repetition/novelty analysis.

It does **not** grant `CONTROLLED_NOVEL` provenance and does not close the novelty audit.

No authority, answer, stem, inference or explanation content was changed.

## Question Studio provenance fields

The deep audit also reviewed the Question Studio payload fields:

- mechanisms;
- distractor types;
- source validation;
- solver identity;
- generation order.

These are intentional reviewer/admin provenance fields in the shared Question Studio architecture, not learner text. They are therefore retained rather than deleted.

The new learner-surface gate separately ensures these internals do not leak into the actual instruction, statement, inference or explanation prose.

## Permanent Wave 1 proof

`sif-001-deep-audit-wave1.test.ts` generates:

```text
17 CPs × 3 locales × 6 seeds = 306 learner surfaces
```

For every generated question it checks:

- review-only lifecycle remains locked;
- non-trivial statement and explanation;
- five unique answer-code options with a valid correct index;
- no internal audit vocabulary in learner text;
- no mechanical wording such as “associated with”, “most closely linked” or “broadly”;
- `NOVELTY_READINESS` exists while novelty itself remains deferred;
- at least three statement variants per CP/locale across six seeds;
- at least two answer positions per CP/locale across six seeds.

## Current disposition

```text
structured logic-first generation:      strong prior authority
multilingual chapter freeze:            strong prior authority
Question Studio review integration:     strong prior authority
novelty gate semantics:                 REMEDIATED
learner-surface audit:                  PERMANENT GATE ADDED
difficulty integrity:                   NEXT
distractor quality:                     NEXT
explanation quality/depth:              NEXT
diversity/fatigue resistance:           Wave 1 minimum gate added
novelty:                                DEFERRED
chapter deep-audit closure:             NOT YET
```
