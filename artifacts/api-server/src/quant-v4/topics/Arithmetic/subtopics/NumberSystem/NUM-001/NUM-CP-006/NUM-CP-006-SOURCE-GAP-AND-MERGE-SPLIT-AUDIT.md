# NUM-CP-006 Source-Gap and Merge/Split Audit

## Decision

`NUM-CP-006 — HCF, LCM and Common-Alignment Applications` is source-saturated at **28 permanent Question Languages** (`NUM-QL-070` through `NUM-QL-097`) backed by **29 executable source prototypes**.

The final authority set retains 27 families independently and merges the two mini-caselet source variants as parameters under `NUM-QL-097` because they share one learner task: identify whether the situation is governed by HCF or LCM, then solve the translated invariant.

## Permanent coverage

| Range | Coverage |
|---|---|
| `NUM-QL-070..076` | direct HCF/LCM, three-number forms, Euclidean ladder, divisibility and co-prime edge cases |
| `NUM-QL-077..079` | missing number, valid pair and pair count from HCF/LCM |
| `NUM-QL-080..083` | greatest equal grouping, common alignment and bounded common multiples |
| `NUM-QL-084..090` | same/specified remainder, least addition/subtraction/deficiency and interval counts |
| `NUM-QL-091..092` | exact fraction/decimal HCF and LCM after rational-unit normalisation |
| `NUM-QL-093..097` | claim verification, comparison, statements, data sufficiency and mini-caselets |

## Merge/split rules

- Direct HCF and direct LCM remain separate because their governing exponent rules and misconceptions are opposite.
- Two-number and three-number forms remain separate because the third input must be mathematically active and the product identity is unavailable for three numbers.
- One-number-divides-another and co-prime cases remain separate edge authorities because they support different instant-result rules.
- Missing-number, valid-pair and pair-count tasks remain separate because they return different semantic answer types.
- Least/greatest bounded common multiples remain separate because ceiling and floor boundaries create different errors.
- Equal-remainder and specified-remainder divisor questions remain separate because their canonical transformations differ.
- Least addition, least subtraction and common deficiency remain separate due to direction-sensitive modular transformations.
- Fraction/decimal HCF and LCM remain separate because numerator/denominator rules reverse.
- Claim, comparison, statement-combination and data-sufficiency forms remain separate reasoning authorities.
- The two mini-caselet forms merge only as parameters under a single caselet authority.

## Ownership boundary

- Prime factorisation as the requested output remains `NUM-CP-004`.
- Divisor count, divisor sum, divisor product and divisor-set functions remain `NUM-CP-005`.
- HCF/LCM targets, inverse pair structure, remainder adjustment and common alignment belong to `NUM-CP-006`.
- Geometry and shape construction remain Mensuration-owned; CP-006 owns only exact common-measure arithmetic.
- Time and Work / Time–Speed–Distance retain domain modelling; CP-006 only evaluates a supplied common-cycle invariant.
- General set-union/intersection counting is not promoted into CP-006.
- The identity `ab = HCF × LCM` is restricted to exactly two positive integers.
- Event problems ask for the first positive or next alignment, excluding time zero.

## Saturation conclusion

Every gap listed after Wave 01 has an executable permanent authority. No uncovered HCF/LCM exam task remains that requires a new governing invariant inside this checkpoint. Future wording or representation additions must map to an existing QL unless they introduce a genuinely different learner decision and verifier route.
