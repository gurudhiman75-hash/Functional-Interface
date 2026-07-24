# PNC-CP-004 Digit, Number, Code & Password Formation — Gap Matrix

> Date: 2026-07-24  
> Package: `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> Roadmap owner: `PNC-CP-004`

## Existing adjacent coverage

`PNC-CP-002` already owns unrestricted ordered selection of distinct symbols, including one generic no-repetition code QL. It does not own number semantics, leading-zero restrictions, repetition-allowed strings, last-digit restrictions, threshold casework or mixed letter/digit stages.

## Material CP-004 gaps

The initial checkpoint admits the following distinct constructions:

1. fixed-length numbers from non-zero digits without repetition;
2. fixed-length numbers from a digit set containing zero without repetition;
3. codes/passwords with repetition allowed and leading zero permitted;
4. fixed-length numbers with repetition allowed but leading zero forbidden;
5. even numbers without repetition when zero is absent;
6. even numbers without repetition when zero is present, requiring separate last-zero and last-nonzero cases;
7. odd numbers without repetition from a set containing zero;
8. numbers divisible by 5 without repetition, using final digit 0 or 5 cases;
9. numbers above a controlled thousand-threshold using first-digit cases;
10. fixed-pattern alphanumeric codes with independent letter and digit stages;
11. bounded recovery of available symbol count from a repetition-allowed code total;
12. codes of length four containing exactly one repeated pair and two other distinct symbols.

The resulting 12 QLs are a checkpoint observation, not a quota or terminal CP size.

## Required runtime contracts

Ten solve modes are required by the admitted QLs:

- `formNumbersWithoutRepetitionNoZero`
- `formNumbersWithoutRepetitionWithZero`
- `formCodesWithRepetition`
- `formNumbersWithRepetitionAndZero`
- `formParityNumbersWithoutRepetition`
- `formDivisibleByFiveNumbersWithoutRepetition`
- `formNumbersAboveLeadingThreshold`
- `formAlphanumericCodes`
- `recoverSymbolCountForCode`
- `formCodesWithExactlyOnePair`

## Explicitly deferred within CP-004

- divisibility by 4 through last-two-digit enumeration;
- exact repetition patterns beyond one pair;
- codes requiring at least one letter/digit through complement;
- thresholds with multiple prefix positions;
- passwords with compulsory symbol categories;
- reverse recovery where more than one parameter is unknown.

These remain inside the agreed CP-004 ownership boundary but receive QLs and modes only if later review establishes a material gap.

## Independent verification

All admitted ranges are intentionally small enough for bounded enumeration of digit/symbol strings. The independent verifier will enumerate candidate sequences and apply number/code semantics directly rather than reusing closed-form solver equations.
