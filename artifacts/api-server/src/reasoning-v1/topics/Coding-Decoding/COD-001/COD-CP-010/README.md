# COD-CP-010 — Conditional Table and Mixed-Symbol Coding

Status: **`COD-QL-199` implemented at English runtime-proof maturity under `COD_CP010_ENGLISH_DISCOVERY_FREEZE_V1`; review-only**.

## Read in this order

1. `../cod-001-open-ql-discovery-amendment.md`;
2. `../COD-001-MANIFEST-AMENDMENT-CP010.md`;
3. `COD-CP-010-SOURCE-AND-BOUNDARY-AUDIT.md`;
4. `COD-CP-010-FINAL-DISCOVERY-FREEZE.md`;
5. `COD-CP-010-IMPLEMENTATION-REPORT.md`;
6. the permanent contract, runtime and executable audits.

## Permanent contract

```text
COD-QL-199 — APPLY_CONDITIONAL_TABLE_FORWARD
```

The student:

1. codes every source token through a displayed table;
2. classifies the first and last source tokens;
3. selects the unique matching condition;
4. applies its override once;
5. chooses the complete mixed-code sequence.

Input domain, endpoint signature, source length, table order, override action, stem wording, difficulty and answer position remain instance properties rather than separate QLs.

## Runtime coverage

The permanent runtime covers:

- letter and digit tables;
- all eight vowel/consonant and odd/even endpoint signatures;
- constant endpoint replacement;
- endpoint-code interchange;
- copying the left endpoint code to both endpoints;
- copying the right endpoint code to both endpoints;
- class-wide vowel replacement by a designated table code;
- Easy, Medium and Hard instances;
- all four answer positions.

## Executable proof

The permanent gate runs:

- the final discovery-freeze audit;
- 800 permanent English runtime questions;
- the 800-question prototype regression;
- a 40-question English review export.

The runtime preserves the frozen prototype solver and payload while replacing prototype identity with permanent `COD-QL-199` identity and provenance metadata.

## Exclusions retained

Inverse decoding, missing-token recovery, hidden-condition inference, overlapping-condition precedence and separate domain/action QLs remain excluded for source gaps. Arithmetic and relation-symbol substitution remain owned by `OPS-001`.

## Safety

```text
Permanent CP-010 range: COD-QL-199
English: runtime-proof complete
Hindi/Punjabi: not started
Question Studio: disabled
Question Bank/mock-test/publication: disabled
```
