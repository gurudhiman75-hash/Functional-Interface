# MIS-CP-008 to MIS-CP-010 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## CP008 — inverse / missing-position reasoning

Provisional candidates MIS-CAND-057..062 cover inverse queries over controlled arithmetic and one triangle relation.

Key governance:

- complete structure is generated first;
- the blank is selected only after verification;
- input-missing questions are solved independently by bounded search;
- an inverse target is accepted only when exactly one value solves the missing position;
- missing position is metadata, not a permanent semantic QL identity;
- table and triangle renderers are both supported.

## CP009 — pair-product and cross relationships

Provisional candidates MIS-CAND-063..068 implement the blueprint examples:

- ab + cd
- ab − cd
- ac + bd
- ad + bc
- (a+b)(c+d)
- (a−b)(c+d)

Every question stores an explicit pairing authority: ROWS, COLUMNS, DIAGONALS or GROUPED_ROWS.

These remain provisional because source saturation may merge equivalent CP007/CP009 authorities.

## CP010 — digit-property relationships

Provisional candidates MIS-CAND-069..074 cover:

- digit sum;
- digit product;
- digit difference;
- number + reversed number as a provisional reverse-and-operate family;
- digit sum + another visible value;
- square of digit sum.

Governance:

- every family is explicitly DIGIT mode;
- numbers are short two-digit values;
- trailing-zero / leading-zero reversal artifacts are rejected;
- arbitrary concatenation is not implemented;
- whole-number and digit-mode reasoning are never silently mixed.

## Audit targets

- CP008: 6 × 60 = 360 deterministic questions.
- CP009: 6 × 60 = 360 deterministic questions.
- CP010: 6 × 60 = 360 deterministic questions.
- New-wave total: 1,080 questions.

Chapter Question Studio now covers CP001–CP010 with 74 provisional candidates and introduces Hard review filtering based on inference complexity.

Permanent QL allocation remains deferred until source saturation and merge/split audit.
