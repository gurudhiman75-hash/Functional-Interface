# PNC-001 Need-Based Implementation Plan

## Completed checkpoint 1 — Initial CP-001 runtime proof

The first admitted set contained 48 English QLs covering counting principles, case partition, simple complement and exact missing-factor recovery.

## Completed checkpoint 2 — Factorial coverage extension

A reference-led gap review admitted ten factorial QLs, `PNC-QL-049` through `PNC-QL-058`, and five solve contracts required by them.

## Completed checkpoint 3 — Unrestricted distinct permutations

The next review approved `PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects`, with eight QLs (`059`–`066`) and three required modes.

## Completed checkpoint 4 — Unrestricted distinct combinations

The next review approved `PNC-CP-003 — Unrestricted Unordered Selection of Distinct Objects`, with eight QLs (`067`–`074`) and three required modes for direct selection, bounded inverse search and complementary-index symmetry.

## Completed checkpoint 5 — Repeated objects and multisets

Reference and runtime comparison showed that every existing arrangement contract still assumed distinct objects. This justified:

```text
PNC-CP-004 — Repeated Objects, Word Arrangements & Multisets
```

Eight materially distinct QLs were admitted as `PNC-QL-075` through `PNC-QL-082`. Four modes were introduced because the admitted content required them:

- arrange all multiset objects;
- arrange the remaining multiset after fixing one position;
- identify the identical-swap overcount factor;
- recover one bounded repeated multiplicity.

The package currently contains 82 English QLs and 20 active modes. These are checkpoint observations, not reusable quotas.

Delivered across the current scope:

- human-owned base and CP-specific companion libraries;
- exact integer, factorial, `nPr`, `nCr` and multiset math;
- deterministic parameter generation;
- authoritative solver evidence;
- independent ordered, subset and multiset enumeration;
- bounded inverse verification;
- evidence-driven explanations and semantic distractors;
- validation, coverage audits and bundled tests;
- no generation-engine edits.

## Next checkpoint selection

Do not automatically implement a numbered CP or allocate another QL range.

Before any next checkpoint:

1. inspect references/PYQs and the current runtime inventory;
2. produce a fresh coverage-gap matrix;
3. decide whether the highest-value gap needs a new QL, mode, CP or package;
4. admit only materially distinct content;
5. implement solver, evidence, explanation, distractor and validator behaviour together;
6. stop expansion when proposals become semantic near-clones rather than coverage gains.

Potential candidates such as digit formation, together/apart restrictions, circular arrangements and category-constrained selection remain unowned until that review.

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation and complete runtime support for all active QLs. A checkpoint may be merged with any justified QL count; incomplete admitted families are not mergeable.

Generation-engine integration, English freeze and localization occur only after coverage and maturity audits justify them, not after a predetermined number of CPs or QLs.
