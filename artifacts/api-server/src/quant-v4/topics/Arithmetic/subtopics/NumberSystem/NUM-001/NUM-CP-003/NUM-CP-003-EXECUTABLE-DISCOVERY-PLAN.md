# NUM-CP-003 — Divisibility and Missing Digits
## Executable Discovery Plan

**Status:** Wave 1 architecture foundation  
**Package:** `NUM-001`  
**Permanent QLs:** 0  
**Frozen solve modes:** 0  
**Question Studio / Question Bank / tests / public:** disabled

This checkpoint proves the shared divisibility architecture without claiming source saturation or a final QL inventory.

## Wave 1 temporary prototypes

1. `DIRECT-COMPOSITE-DIVISIBILITY`
   - select the only displayed divisor of a generated integer;
   - proves composite-rule and exact-division option validation.

2. `SINGLE-MISSING-DIGIT-UNIQUE`
   - reconstruct one digit when exactly one value from 0–9 satisfies divisibility;
   - proves complete-domain uniqueness rather than trusting a constructed target.

3. `SINGLE-MISSING-DIGIT-COUNT`
   - count all digits that satisfy the rule;
   - separates count/set semantics from the first valid digit.

4. `TWO-MISSING-DIGITS-MULTI-RULE`
   - recover the ordered pair `(X, Y)` under a digit-sum condition and two divisibility rules;
   - proves bounded 100-pair uniqueness and ordered-position semantics.

5. `REPEATED-BLOCK-DIVISIBILITY`
   - test a complete concatenated numeral rather than its source block;
   - establishes repeated-block place-value representation.

6. `LEAST-N-DIGIT-MULTIPLE`
   - find the first multiple at or above the lower digit boundary;
   - establishes divisibility optimisation and boundary proof.

The six prototypes are an architecture-establishing wave, not an exhaustive checkpoint count.

## Exact-state contract

- all complete numerals use `bigint`;
- divisors are non-zero positive integers;
- ordinary remainder is the least non-negative residue;
- missing digits are exhaustively enumerated over 0–9;
- leading-zero states are rejected;
- two-digit states are exhaustively enumerated over 100 ordered pairs;
- an intended unique answer is accepted only when the independent search finds exactly one;
- least-number states prove the previous multiple is below the lower boundary.

## Independent verification

| Prototype | Canonical construction | Independent verifier |
|---|---|---|
| direct composite | construct a known multiple | test every displayed divisor by exact `%` |
| single digit unique/count | divisibility helper enumeration | separate direct substitution loop over 0–9 |
| two missing digits | filtered pair enumeration | separate nested 10×10 search from displayed constraints |
| repeated block | construct with place-value repetition | rebuild the full numeral from its visible block and divide |
| least n-digit multiple | complement-to-next-multiple formula | increment from the digit boundary until divisible |

## Wave 1 proof target

- 6 prototypes × 120 seeds = 720 deterministic mathematical packages;
- all four answer positions for every prototype;
- Easy, Medium and Hard reach;
- five answer semantics;
- exact solver/verifier agreement;
- four unique misconception-derived options;
- no permanent/public/discoverable output;
- three review states per prototype.

## Known gaps reserved for later waves

- direct primitive divisibility-rule families and rule selection;
- all-valid-digit set answers rather than counts;
- leading missing digit;
- two missing digits without an explicit sum relation;
- missing digit in an arithmetic result;
- repeated 1s, repeated digits and algebraic repeated blocks;
- divisibility of sums, products and power expressions;
- guaranteed divisors of power sums/differences;
- counting multiples and inclusion–exclusion ranges;
- one-but-not-another divisibility;
- greatest n-digit divisible number;
- reverse hidden-divisor deduction;
- statement, table and data-sufficiency representations;
- source-backed merge/split and ownership closure.

No permanent `NUM-QL-*` allocation is permitted until those gap waves and source audits close.
