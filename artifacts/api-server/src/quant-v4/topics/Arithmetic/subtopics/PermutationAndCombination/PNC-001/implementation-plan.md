# PNC-001 Need-Based Implementation Plan

## Completed checkpoint 1 — Initial CP-001 runtime proof

The first admitted set contained 48 English QLs covering counting principles, case partition, simple complement and exact missing-factor recovery.

## Completed checkpoint 2 — Factorial coverage extension

A reference-led gap review admitted ten factorial QLs, `PNC-QL-049` through `PNC-QL-058`, and five solve contracts required by them.

## Completed checkpoint 3 — Unrestricted distinct permutations

A fresh reference/runtime review identified order-sensitive arrangements as the next material gap and approved:

```text
PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects
```

Eight materially distinct QLs were admitted as `PNC-QL-059` through `PNC-QL-066`. Three modes were introduced because the admitted content required them:

- arrange all distinct objects;
- arrange `r` from `n` distinct objects without repetition;
- recover a missing permutation parameter.

The package currently contains 66 English QLs and 13 active modes. These are checkpoint observations, not reusable quotas.

Delivered across the current scope:

- human-owned language, registry, constraint, range and explanation libraries;
- exact integer, factorial and `nPr` math;
- deterministic parameter generation;
- authoritative solver evidence;
- independent enumeration and bounded-search verification;
- semantic distractors;
- validation, coverage audits and bundled tests;
- no generation-engine edits.

## Next checkpoint selection

Do not automatically implement combinations or allocate another CP/QL range.

Before any next checkpoint:

1. inspect references/PYQs and the current runtime inventory;
2. produce a fresh coverage-gap matrix;
3. decide whether the highest-value gap needs a new QL, mode, CP or package;
4. admit only materially distinct content;
5. implement solver, evidence, explanation, distractor and validator behaviour together;
6. stop expansion when proposals become semantic near-clones rather than coverage gains.

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation and complete runtime support for all active QLs. A checkpoint may be merged with any justified QL count; incomplete admitted families are not mergeable.

Generation-engine integration, English freeze and localization occur only after coverage and maturity audits justify them, not after a predetermined number of CPs or QLs.