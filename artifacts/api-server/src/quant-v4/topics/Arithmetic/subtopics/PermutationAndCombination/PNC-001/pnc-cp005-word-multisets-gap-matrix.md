# PNC-CP-005 Word, Letter & Multiset Coverage-Gap Matrix

> Date: 2026-07-24  
> Package: `PNC-001 — Counting Foundations, Basic Permutations & Basic Combinations`  
> Roadmap ownership: `PNC-CP-005 — Word, Letter & Multiset Arrangements`

## Evidence reviewed

- the agreed two-package, twelve-CP P&C roadmap;
- current runtime through distinct permutations and combinations;
- SSC-oriented word-arrangement material involving repeated letters;
- examples such as APPLE, BALLOON and MISSISSIPPI, where swapping identical letters does not create a new outcome.

## Material uncovered contract

For total object count `n` and repeated multiplicities `m1, m2, ...`, the distinct arrangement count is:

```text
n! / (m1! × m2! × ...)
```

This requires explicit multiplicity state, exact denominator correction, multiset-specific validation and an independent unique-arrangement enumerator.

## Admitted checkpoint directions

1. direct word arrangement with one repeated category;
2. direct word arrangement with two repeated categories;
3. direct word arrangement with three repeated categories;
4. non-word multiset arrangement;
5. fixed-position arrangement where a unique object is fixed;
6. fixed-position arrangement where one copy of a repeated object is fixed;
7. overcount factor from pretending identical objects are distinct;
8. bounded recovery of one missing multiplicity.

The eight admitted QLs are a current checkpoint, not the final CP-005 size.

## Current required solve contracts

- `arrangeAllMultisetObjects`
- `arrangeMultisetAfterFixingPosition`
- `findMultisetOvercountFactor`
- `recoverMultisetMultiplicity`

## Deferred CP-005 scope

The agreed CP-005 boundary may later receive additional need-based coverage for:

- distinct-letter word arrangements not already covered cleanly by CP-002;
- selecting and arranging letter subsets;
- simple vowels/consonants-together word forms where word identity is central;
- small, manually validated dictionary-rank profiles.

No count or solve mode is preallocated for those directions.
