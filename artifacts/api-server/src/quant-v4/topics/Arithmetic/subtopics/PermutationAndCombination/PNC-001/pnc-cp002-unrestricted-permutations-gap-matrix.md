# P&C Need-Based Gap Decision — Unrestricted Distinct Permutations

> **Review date:** 2026-07-24  
> **Base checkpoint:** `PNC-QL-001` through `PNC-QL-058`  
> **Decision:** Create `PNC-CP-002` for unrestricted ordered arrangements of distinct objects.  
> **Package decision:** Keep the CP inside `PNC-001`; a new package is not justified.

## 1. Why this family is next

The reviewed SSC-oriented material introduces permutation immediately after factorials and defines it through arrangements where order matters. Representative forms include:

- arranging all distinct objects;
- arranging some objects selected from a larger distinct set;
- awarding ranked positions such as gold, silver and bronze;
- assigning distinct offices or roles;
- using `nPr = n!/(n-r)!`.

The current runtime now owns counting principles and factorial arithmetic but has no ordered object/slot state. Unordered selection (`nCr`) is also missing, but permutation is the direct next dependency because it reuses the factorial authority already implemented and establishes the order-sensitive state needed to distinguish later combinations.

## 2. Ownership decision

This family needs a new CP because it introduces all of the following:

- an explicit pool of distinct objects;
- an ordered slot count;
- no-repetition selection;
- `nPr` as a new exact mathematical authority;
- permutation-specific evidence and validation;
- permutation-versus-combination misconception distractors;
- bounded inverse search over `n` or `r`.

These contracts do not belong inside the existing counting-principle/factorial CP without weakening traceability.

Approved CP:

```text
PNC-CP-002 — Unrestricted Ordered Arrangements of Distinct Objects
```

## 3. QL admission

Eight QLs are admitted because the review identified eight materially distinct exam directions:

1. arrange all students in a row;
2. arrange all distinct books on a shelf;
3. arrange all distinct symbols/flags;
4. form an ordered code by taking `r` from `n` distinct symbols without repetition;
5. award ranked medals from finalists;
6. fill distinct offices from eligible candidates;
7. recover the total object count from a known `nPr` target and `r`;
8. recover the ordered slot count from a known `nPr` target and `n`.

Allocated IDs:

```text
PNC-QL-059 through PNC-QL-066
```

This is the approved checkpoint set, not a fixed CP size or final range.

## 4. Solve-mode decision

Only three modes are required:

- `arrangeAllDistinctObjects`;
- `arrangeRFromNDistinctObjects`;
- `recoverPermutationParameter`.

Medal, role, code and ranked-position contexts reuse `arrangeRFromNDistinctObjects` because their mathematical state and evidence are identical. The two inverse directions share `recoverPermutationParameter` because both perform a bounded exact search over one missing `nPr` parameter while preserving the same validator and explanation structure.

No combination, repeated-object, digit-leading-zero, circular or restricted-arrangement mode is declared.

## 5. Runtime contract

Every generated CP-002 question must expose:

- `totalObjects = n`;
- `selectedObjects = r`;
- `orderMatters = true`;
- `repetitionAllowed = false`;
- exact consecutive factors used by `nPr`;
- exact answer;
- independent bounded enumeration agreement.

For arrange-all forms, `r = n` and the display may use `n!` while the solver remains exact.

## 6. Stop condition

The checkpoint stops after the eight admitted directions pass:

- registry/language parity;
- deterministic generation;
- exact `nPr` solving;
- independent enumeration/search verification;
- evidence-driven explanations;
- semantic distractor validation;
- duplicate and placeholder audits.

Any further unrestricted-permutation proposal must demonstrate a new solve direction or reasoning contract rather than a new noun.