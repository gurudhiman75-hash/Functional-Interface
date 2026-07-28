# COD-CP-010 — Conditional Table and Mixed-Symbol Coding

Status: **English discovery frozen under `COD_CP010_ENGLISH_DISCOVERY_FREEZE_V1`; one executable solve contract; zero permanent QLs in this PR**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`;
2. `COD-CP-010-SOURCE-AND-BOUNDARY-AUDIT.md`;
3. `COD-CP-010-FINAL-DISCOVERY-FREEZE.md`;
4. `cp010-final-discovery-freeze.ts`;
5. `cp010-prototype-contracts.ts`;
6. `cp010-prototype-runtime.ts`;
7. `cp010-prototype-solver.ts`;
8. the executable audits.

## Frozen boundary

The checkpoint owns explicit conditional lookup-table questions in which the student:

1. codes every source token through a displayed table;
2. classifies the first and last source tokens;
3. selects the unique matching condition;
4. applies its override once;
5. chooses the complete mixed-code sequence.

Exactly one solve contract survives:

```text
APPLY_CONDITIONAL_TABLE_FORWARD
```

The executable prototype covers letter and digit tables, all eight vowel/consonant and odd/even endpoint signatures, constant endpoint replacement, endpoint-code interchange, left/right endpoint copying and a class-wide vowel override.

Input domain, endpoint signature, source length, table order, override action, stem wording, difficulty and answer position remain instance properties rather than separate QLs.

## Executable proof

The 800-question audit proves:

- deterministic generation;
- independent solver agreement;
- all eight endpoint signatures;
- all five admitted override actions;
- all four answer positions;
- Easy, Medium and Hard reach;
- four unique options with one correct answer;
- complete table, condition and explanation payloads;
- no public or Question Studio exposure.

## Guarded allocation

After this freeze merges, exactly one permanent identity may be assigned:

```text
COD-QL-199 — APPLY_CONDITIONAL_TABLE_FORWARD
```

Inverse decoding, missing-token recovery, hidden-condition inference and overlapping-condition precedence remain excluded for source gaps.

## Safety

```text
Permanent CP-010 QLs in this PR: 0
Next available chapter ID: COD-QL-199 (unallocated)
English: frozen executable prototype
Hindi/Punjabi: not started
Question Studio/publication: disabled
```
