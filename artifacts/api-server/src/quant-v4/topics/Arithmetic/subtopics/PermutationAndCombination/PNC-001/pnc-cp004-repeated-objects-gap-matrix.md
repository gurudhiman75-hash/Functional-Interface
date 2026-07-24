# PNC-CP-004 Repeated Objects Coverage-Gap Matrix

> Date: 2026-07-24  
> Package: `PNC-001 — Permutation & Combination Core`  
> Decision: admit a new canonical problem only for repeated-object arrangements

## Evidence reviewed

- current runtime through `PNC-CP-003`, which assumes distinct objects in all permutation and combination contracts;
- SSC-oriented material that introduces word formation and arrangements with repeated letters after the basic permutation formula;
- the ExamTree P&C design model, which treats object identity as a first-class counting-state decision;
- examples such as `ALLAHABAD` and `BALLOON`, where exchanging identical letters does not create a new outcome.

## Material uncovered contract

For total object count `n` and identical multiplicities `m1, m2, ...`, the distinct arrangement count is:

```text
n! / (m1! × m2! × ...)
```

This is not equivalent to the existing distinct-object permutation modes. It requires:

- explicit identical-multiplicity state;
- exact denominator correction;
- validation that multiplicities sum to the object count;
- an independent multiset enumerator;
- distractors for treating all objects as distinct or correcting only one repeated category.

## Ownership decision

Create:

```text
PNC-CP-004 — Repeated Objects, Word Arrangements & Multisets
```

Keep it inside `PNC-001`. The package remains coherent; no new package boundary is justified.

## Admitted directions

The initial checkpoint admits only materially distinct directions:

1. direct word arrangement with one repeated category;
2. direct word arrangement with two repeated categories;
3. direct word arrangement with three repeated categories;
4. non-word multiset arrangement using repeated colours/items;
5. fixed-position arrangement where a unique object is fixed;
6. fixed-position arrangement where one copy of a repeated object is fixed;
7. find the overcount factor caused by pretending identical objects are distinct;
8. recover one bounded missing multiplicity from an exact multiset-arrangement target.

The resulting QL count is an observed checkpoint size, not a target or ceiling.

## Required solve contracts

Only four new modes are justified:

- `arrangeAllMultisetObjects`
- `arrangeMultisetAfterFixingPosition`
- `findMultisetOvercountFactor`
- `recoverMultisetMultiplicity`

## Explicitly deferred

- letters together/apart;
- identical groups treated as blocks;
- partial multiset arrangements;
- digit and number formation;
- repetition-allowed strings;
- circular arrangements;
- category-constrained selection;
- grouping and distribution.

Those families require separate restriction, slot, or symmetry contracts and are not predeclared here.
