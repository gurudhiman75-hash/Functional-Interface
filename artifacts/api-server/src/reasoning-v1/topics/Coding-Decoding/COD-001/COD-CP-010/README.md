# COD-CP-010 — Conditional Table and Mixed-Symbol Coding

Status: **open English discovery with one executable source-backed prototype; zero permanent QLs**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`;
2. `COD-CP-010-SOURCE-AND-BOUNDARY-AUDIT.md`;
3. `cp010-prototype-contracts.ts`;
4. `cp010-prototype-runtime.ts`;
5. `cp010-prototype-solver.ts`;
6. `cp010-prototype.test.ts`.

## Current boundary

The checkpoint owns explicit conditional lookup-table questions in which the student:

1. codes every source token through a displayed table;
2. classifies the first and last source tokens;
3. selects the unique matching condition;
4. applies its override once;
5. chooses the complete mixed-code sequence.

The executable prototype covers letter and digit tables, vowel/consonant and odd/even endpoint classes, constant endpoint replacement, endpoint-code interchange, left/right endpoint copying and a class-wide vowel override.

Exactly one provisional solve contract currently survives:

```text
APPLY_CONDITIONAL_TABLE_FORWARD
```

Input domain, endpoint signature, source length and override action remain instance properties.

## Open gate

The prototype must pass the 800-question audit before discovery can freeze. Freeze requires:

- independent solver agreement;
- all eight domain/endpoint signatures;
- every admitted override action;
- all answer positions;
- Easy, Medium and Hard reach;
- unique options and complete explanations;
- no collision with CP-001, CP-007, CP-009 or OPS-001;
- no unsupported inverse, missing-token or precedence contract.

## Safety

```text
Permanent CP-010 QLs: 0
Next available chapter ID: COD-QL-199 (unallocated)
English: prototype only
Hindi/Punjabi: not started
Question Studio/publication: disabled
```
