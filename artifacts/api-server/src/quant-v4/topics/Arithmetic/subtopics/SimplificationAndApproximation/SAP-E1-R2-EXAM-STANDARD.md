# SAP E1-R2 — Exam Realism Standard

**Status:** provisional review authority only. No QL allocation, freeze, activation or publication.

## Why R2 exists

E1 V1 was mathematically correct but rejected in manual review because 300 questions collapsed into roughly nine visible structures. It over-weighted one-skill drills, significant-figure exercises, atomic perfect roots, supplied-root one-step scaling and repeated telescoping.

## Current exam benchmark

The R2 learner surface follows recent SSC/Banking practice evidence:

- Bank simplification/approximation commonly uses question-mark expressions with several interacting operations: decimals, roots/powers, multiplication/division and BODMAS. The stem asks for the approximate value; it does not tell the learner which values to round.
- SSC simplification expects manipulation of roots/powers inside a wider expression, not only recognition of an isolated perfect root.
- Symbolic surd simplification/rationalisation remains owned by Surds & Indices even when SSC papers contain it; R2 does not steal that learner identity into SAP.

Reference benchmark pages used for this remodel:
- Testbook, Bank Exam Simplification Questions, updated July 2026.
- Testbook, SBI Clerk Simplification Questions, 2026.
- Oliveboard, Simplification Questions for Bank Exams, July 2026.
- SSC CGL 2025 solved-paper examples for root/surd simplification.

## Hard learner-surface rules

1. Every normal production question must require **at least two mathematical decisions**.
2. No stem may expose its useful rounded replacements or say which shortcut to use.
3. Atomic `sqrt(perfect square) = ?` drills are foundation-only and excluded from the R2 300-review.
4. Significant-figure rounding remains source-backed but is **diagnostic/foundation only** for SSC/Banking SAP production and is excluded from the R2 300-review.
5. Nested-additive radicals and finite telescoping remain low-frequency specialist coverage, not dominant families.
6. Options must be numeric, distinct and reasonably close; no generic `Alternative N` values.
7. LaTeX-scoped roots are mandatory.
8. Explanations use 2-3 short steps and reveal the approximation choices after the stem, not before it.

## Structural diversity gate

The R2 authority must expose **at least 24 distinct structure IDs** across the exam-facing corpus:

- 8 SSC exact root/power/BODMAS structures primarily owned by CP004;
- 4 SSC finite telescoping structures primarily owned by CP005;
- 6 Bank root/power approximation structures primarily owned by CP010;
- 6 Bank supplied-root scaling structures primarily owned by CP010.

Each structure must produce 100 unique visible stems under the machine sweep.

## Production weighting direction

The 300-question human-review corpus is not a production-weight prescription, but it must represent both profiles materially:

- SSC profile: exact root/power/BODMAS and small specialist telescoping coverage;
- Bank profile: unguided root/power approximation and supplied-root scaling embedded in multi-operation expressions.

CP007 significant figures is retained as a proven E1 capability but **not sampled in the normal R2 mock corpus**.

## Ownership boundary

R2 may combine subsidiary arithmetic around a primary learner inference, but it must not create a new multi-authority synthesis identity that belongs to CP012. If no single E1 checkpoint clearly owns the decisive inference, the pattern is deferred to E2/CP012.

## Lifecycle

```text
E1_R2_REVIEW_READY = false
PERMANENT_QL_ALLOCATION = none
ACTIVE = false
QUESTION_STUDIO_DISCOVERABLE = false
QUESTION_BANK_WRITABLE = false
TEST_ELIGIBLE = false
PUBLIC = false
```
