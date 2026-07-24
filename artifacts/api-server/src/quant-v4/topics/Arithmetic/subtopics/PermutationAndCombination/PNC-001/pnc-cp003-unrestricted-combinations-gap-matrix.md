# P&C Need-Based Gap Decision — Unrestricted Distinct Combinations

> **Review date:** 2026-07-24  
> **Base checkpoint:** `PNC-QL-001` through `PNC-QL-066`  
> **Decision:** Create `PNC-CP-003` for unrestricted unordered selection of distinct objects.  
> **Package decision:** Keep the CP inside `PNC-001`; no package split is justified.

## 1. Evidence and runtime gap

The previously reviewed SSC-oriented and Arun Sharma P&C material distinguishes combination from permutation by one decisive condition: in a combination, only the selected set matters and order does not.

The current runtime owns exact factorials and unrestricted `nPr`, but it cannot yet represent:

- choosing a committee or team without positions;
- choosing an unordered pair or triple;
- `nCr = n!/[r!(n-r)!]`;
- bounded inverse recovery from an `nCr` target;
- the symmetry identity `nCr = nC(n-r)`.

These are standard target-exam forms and require a mathematical state that is deliberately different from CP-002.

## 2. Ownership decision

A new CP is justified because unordered selection introduces:

- `orderMatters = false`;
- exact `nCr` authority;
- division by `r!` after ordered selection;
- symmetry between `r` and `n-r`;
- combination-versus-permutation distractors;
- inverse-search ambiguity that must be controlled by domain restrictions.

Approved CP:

```text
PNC-CP-003 — Unrestricted Unordered Selection of Distinct Objects
```

## 3. QL admission

Eight QLs are admitted because they cover materially distinct exam directions:

1. choose `r` students from `n` students;
2. form an unordered committee;
3. select an unordered sports team;
4. count unordered pairs/handshakes;
5. count triangles from points with no three collinear;
6. recover `n` from an exact `nCr` target and known `r`;
7. recover `r` from an exact `nCr` target under `r ≤ n/2`;
8. recover the complementary selection size using `nCr = nC(n-r)`.

Allocated IDs:

```text
PNC-QL-067 through PNC-QL-074
```

This is the approved checkpoint set, not a fixed CP size or terminal range.

## 4. Solve-mode decision

Only three new modes are required:

- `selectRFromNDistinctObjects`;
- `recoverCombinationParameter`;
- `recoverComplementaryCombinationIndex`.

Student, committee, team, pair and triangle contexts share the direct-selection mode because their mathematical and evidence contracts are identical after `r` is established.

The inverse mode owns both missing-`n` and missing-`r` searches. The latter is restricted to the lower half of the symmetry pair so that the answer is unique.

The complementary-index identity remains separate because its decisive reasoning is symmetry rather than general target search.

No conditional committee, repeated-object, digit, circular, grouping or restricted-selection mode is declared.

## 5. Runtime contract

Every direct CP-003 question must expose:

- `totalObjects = n`;
- `selectedObjects = r`;
- `orderMatters = false`;
- `repetitionAllowed = false`;
- exact numerator permutation factors;
- exact division by `r!`;
- exact answer;
- independent subset-enumeration agreement.

Inverse questions must document their search domain and prove exact target reconstruction.

## 6. Stop condition

The checkpoint stops after the eight admitted directions pass:

- registry/language parity;
- deterministic generation;
- exact `nCr` solving;
- independent subset enumeration/search verification;
- evidence-driven explanations;
- semantic distractor validation;
- duplicate and placeholder audits.

Any additional basic-combination proposal must demonstrate a new reasoning direction, not merely a new noun.