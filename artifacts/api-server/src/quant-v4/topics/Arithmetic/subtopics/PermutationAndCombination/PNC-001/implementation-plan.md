# PNC-001 Need-Based Implementation Plan

## Completed checkpoint — CP-001 runtime proof

The current implementation contains 48 English QLs because those were the distinct reviewed QLs admitted for the first runtime proof. The number is a checkpoint snapshot, not a reusable quota.

Delivered:

- task registry and human-owned language library;
- exact integer math;
- deterministic parameter generation;
- solver evidence;
- explanation rendering for the five solve modes currently required;
- semantic distractors;
- validation and bundled tests;
- no generation-engine edits.

## Next checkpoint selection

Do not automatically implement a pre-numbered CP or a predetermined QL range.

Before the next checkpoint:

1. inspect uploaded/reference P&C books, PYQs and the existing motif/scenario inventory;
2. produce a coverage-gap matrix;
3. identify the highest-value uncovered reasoning family;
4. decide whether the gap belongs in CP-001 or requires a new CP;
5. admit only materially distinct QLs;
6. introduce only the solve modes required by those admitted QLs;
7. implement solver, evidence, explanation, distractor and validator behavior together;
8. stop expansion when new proposals become semantic near-clones rather than coverage gains.

## Merge rule

Every checkpoint must preserve registry/language parity, deterministic generation and complete runtime support for all active QLs. A checkpoint may be merged with any justified QL count; incomplete admitted families are not mergeable.

Generation-engine integration, English freeze and localization occur only after coverage and maturity audits justify them, not after a predetermined number of CPs or QLs.
