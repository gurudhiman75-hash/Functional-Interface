# NUM-CP-014 Wave03 — Representation and Cross-Engine Saturation

Checkpoint: `NUM-CP-014 — Mixed Inverse, Optimisation and Number-Theory Synthesis`

Status: discovery only. `NUM-QL-248` remains unallocated.

## Purpose

Wave01 established the minimum two-engine necessity rule. Wave02 added inverse, optimisation, count, solution-class and three-engine answer-impact ablation. Wave03 closes remaining high-value cross-engine, representation and answer-semantic gaps without creating permanent authorities.

## New temporary prototypes

- `NUM-CP014-PROT-013` — missing digit from divisibility + perfect-square structure.
- `NUM-CP014-PROT-014` — hidden integer from divisor-count + exact HCF.
- `NUM-CP014-PROT-015` — hidden integer from divisor-count + remainder.
- `NUM-CP014-PROT-016` — hidden integer from exact HCF + perfect square/cube.
- `NUM-CP014-PROT-017` — hidden base from positional-base validity + HCF of numeral value.
- `NUM-CP014-PROT-018` — hidden exponent from terminal-digit cycle + exponent remainder.
- `NUM-CP014-PROT-019` — hidden divisor from divisor structure + exact HCF.
- `NUM-CP014-PROT-020` — complete valid set from perfect-square + remainder intersection.

This brings discovery to **20 positive temporary prototypes** across Wave01–Wave03.

## Answer-semantic closure

The discovery corpus now explicitly covers:

- hidden digit;
- hidden integer/number;
- hidden base;
- hidden exponent;
- hidden divisor;
- least value;
- greatest value;
- count of complete solutions;
- complete valid set;
- no-solution / one-solution class where answer-impact ablation is mathematically possible.

A bare `MULTIPLE_SOLUTIONS` classification remains intentionally rejected for ordinary conjunctive filters when removing a component still reports `MULTIPLE_SOLUTIONS`; internal set growth alone is not enough to prove that the component changes the learner-facing answer. Multiple-solution states remain representable through `COUNT` and `COMPLETE_VALID_SET` semantics instead.

## Representation saturation

Every Wave03 family is exercised under all four executable representations:

1. `CONSTRAINT_TABLE`
2. `ELIMINATION_GRID`
3. `MINI_CASELET`
4. `MULTI_STAGE_GRAPH`

The representation is not a label-only variant. Each generated package carries a four-row/four-step `representationPayload` showing the domain, component-A survivor state, component-B survivor state, and final intersection/result.

## Admission rule

For a hidden-value question:

- all component constraints together must give exactly one answer;
- removing any component must restore more than one candidate;
- the true answer must remain present in every ablated candidate set;
- therefore the learner-facing answer changes from a unique value to `MULTIPLE_SOLUTIONS` when either engine is removed.

For `COMPLETE_VALID_SET`:

- the full answer is the exact complete intersection;
- removing either component must produce a different complete answer set;
- partial-set distractors are retained as explicit misconception states.

Wave03 retains the Wave02 answer-impact interpretation rather than accepting a merely different hidden set.

## Negative controls

Wave03 explicitly rejects implication/equivalence pairs that look mixed but are not genuine synthesis:

- `HCF(n, 12) = 4` + `n divisible by 4`: the HCF condition already implies divisibility by 4.
- units digit of `2^n` is `2` + `n ≡ 1 (mod 4)`: the terminal-cycle statement is exactly the same exponent congruence.

Wave01 also permanently rejected divisor-count + perfect-square as a supposed two-engine family because `τ(n)` is odd iff `n` is a square.

## Explanation standard

All Wave03 packages use `FULL_DERIVATION_AND_EXAM_SHORTCUT_V1`:

- state the complete domain;
- derive the candidate set from engine A;
- derive the candidate set from engine B;
- intersect the independently obtained sets;
- explicitly verify the answer under both engines;
- then show a separate faster exam route.

## Ownership

- Data Sufficiency remains with DSF and does not create a CP014 authority.
- Algebra-primary systems remain with Algebra.
- P&C/set-counting-primary tasks remain outside CP014.
- a secondary condition that is implied by another condition is decorative and rejected.
- a condition equivalent to another representation of the same invariant is also rejected.

## Lifecycle

All downstream gates remain closed:

- Question Studio: OFF
- Question Bank: OFF
- test eligibility: OFF
- mock-test eligibility: OFF
- public publication: OFF
- automatic student publication: OFF
