# PNC-001 Need-Based Implementation Plan

## Completed checkpoint 1 — Initial CP-001 runtime proof

The first admitted set contained 48 English QLs covering counting principles, case partition, simple complement and exact missing-factor recovery.

## Completed checkpoint 2 — Factorial coverage extension

A reference-led coverage-gap review identified factorial reasoning as the highest-value missing family that still belongs inside CP-001.

The extension admitted ten materially distinct QLs, `PNC-QL-049` through `PNC-QL-058`, and five required solve modes:

- direct factorial value;
- unit-factorial expressions using `0! = 1! = 1`;
- exact factorial quotient cancellation;
- bounded recovery from a factorial target;
- bounded recovery from a two-factor factorial quotient.

The current implementation therefore contains 58 English QLs and ten active modes. These are checkpoint observations, not reusable quotas.

Delivered across the current scope:

- task registry and human-owned language library;
- exact integer and factorial math;
- deterministic parameter generation;
- solver evidence;
- independent verification;
- evidence-driven explanations;
- semantic distractors;
- validation, coverage audits and bundled tests;
- no generation-engine edits.

## Next checkpoint selection

Do not automatically implement a pre-numbered CP or a predetermined QL range.

Before the next checkpoint:

1. inspect uploaded/reference P&C books, PYQs and the existing motif/scenario inventory;
2. produce a fresh coverage-gap matrix;
3. identify the highest-value uncovered reasoning family;
4. decide whether the gap belongs in CP-001 or requires a new CP;
5. admit only materially distinct QLs;
6. introduce only the solve modes required by those admitted QLs;
7. implement solver, evidence, explanation, distractor and validator behaviour together;
8. stop expansion when new proposals become semantic near-clones rather than coverage gains.

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation and complete runtime support for all active QLs. A checkpoint may be merged with any justified QL count; incomplete admitted families are not mergeable.

Generation-engine integration, English freeze and localization occur only after coverage and maturity audits justify them, not after a predetermined number of CPs or QLs.