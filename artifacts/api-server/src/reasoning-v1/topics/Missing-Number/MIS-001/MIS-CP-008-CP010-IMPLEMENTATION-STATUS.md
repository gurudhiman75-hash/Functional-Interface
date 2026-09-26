# MIS-CP-008 to MIS-CP-010 Implementation Status

Status: **EXECUTABLE PROTOTYPE / ENGLISH REVIEW CANDIDATE**

## CP008 — inverse / missing-position reasoning

Runtime review variants MIS-CAND-057..062 cover inverse queries. Five reuse earlier semantic authorities: 057→001 (sum), 058→003 (product), 060→017 (a²+b), 061→012 ((a+b)×c), and 062→038 (left×right−top). Only MIS-CAND-059 (a×b−b) remains a new provisional semantic authority.

Key governance:

- complete structure is generated first;
- the blank is selected only after verification;
- input-missing questions are solved independently by bounded search;
- an inverse target is accepted only when exactly one value solves the missing position;
- missing position is metadata, not a permanent semantic QL identity;
- table and triangle renderers are both supported.

## CP009 — pair-product and cross relationships

Runtime patterns MIS-CAND-063..068 implement the blueprint examples. Three are canonical aliases of CP007: 063→051 (row products sum), 065→052 (column products sum), 066→055 (diagonal products sum). Only 064, 067 and 068 remain new provisional semantic authorities:

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

Chapter Question Studio now exposes 74 runtime review patterns across CP001–CP010 but only 66 distinct semantic authorities after deduplication. Eight CP008/CP009 patterns are explicitly reuse-only variants and cannot become separate permanent QLs.

Permanent QL allocation remains deferred until source saturation and merge/split audit.
