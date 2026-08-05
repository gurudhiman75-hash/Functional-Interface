# BLR-001 — Chapter-Wide English Gap Audit

Status: **V1 executable ownership audit passed; manual English freeze readiness superseded by CP-007 editorial findings; V2 approval and chapter re-audit pending**.

## Purpose

The end-to-end design contains seven content checkpoints. `BLR-CP-007` is the final planned content checkpoint; no `BLR-CP-008` is currently justified.

The V1 audit treated the complete English chapter as one system:

```text
BLR-CP-001 through BLR-CP-007
BLR-QL-001 through BLR-QL-035
```

`BLR-QL-036` remains unallocated. The CP-007 editorial remediation does not create a new solve identity.

## V1 executable audit corpus

```text
CP-001 deterministic runtime sweep          448
CP-002 deterministic runtime sweep           96
CP-003 complete frozen bank                  298
CP-004 complete frozen bank                  612
CP-005 complete frozen bank                  184
CP-006 complete frozen bank                  152
CP-007 V1 complete frozen bank               168
-----------------------------------------------
chapter-wide audited questions             1,958
```

The V1 audit proved:

- every permanent QL and solve-authority mapping;
- contiguous QL sequencing;
- exact and normalized cross-QL learner-surface collision checks under its then-current rules;
- option uniqueness, correct-index and answer parity;
- explicit gender evidence and zero name-based gender assumptions;
- checkpoint ownership and included-source coverage;
- review-only lifecycle locks.

## V1 technical result retained

```text
planned content checkpoints                         7
permanent QLs                                      35
solve authorities                                  35
ownership failures                                  0
open included source families                       0
```

The result still proves that the planned V1 scope has no missing solve authority and does not justify `BLR-QL-036` or `BLR-CP-008`.

## Why manual-freeze readiness is revoked

The V1 audit did not test several learner-facing security and pedagogy properties later exposed in CP-007:

- prototype-local answer-sequence leakage;
- option-format correlation with correctness;
- option-specific diagnostic accuracy;
- statement-validity versus answer-selection polarity;
- distractor graph realism;
- candidate-label balance;
- adaptive explanation length and relevance;
- directional and direct-versus-inferred diagram semantics;
- visible immutable human-review proof.

Therefore the historical verdict `CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE` must not be interpreted as current manual-freeze readiness.

## CP-007 V2 remediation

`BLR_CP007_ENGLISH_EDITORIAL_REVIEW_V2` preserves the five CP-007 solve identities while remediating the learner-facing layer. Its executable review proves:

```text
English review questions                         168
option analyses                                  672
valid wrong-option graphs                        504
invalid option graphs                              0
correct invalid-statement selections              16
valid unselected statements correctly described   48
QL-034 labels                         P/Q/R/S = 8 each
legacy answer cycles                               0
human review required                            true
```

See `BLR-CP-007/BLR-CP-007-EDITORIAL-V2-REMEDIATION.md`.

## Included chapter scope

Covered solve ownership remains:

- direct, reverse, multi-edge and exact-lineage named-person relations;
- generation, person, pair and claim queries;
- pointer, photograph, portrait, conversation and nested role chains;
- shared family passages and marital-status questions;
- closed-universe counts and composition profiles;
- exact, broad, definite, possible, impossible and indeterminate semantics;
- coded relation decoding;
- coded expression construction, completion and validation.

Explicitly outside BLR-001 V1:

- Data Sufficiency answer contracts;
- profession, city, colour, floor, schedule or seating-led family puzzles;
- age arithmetic;
- inheritance law and genetic pedigree reasoning;
- step, half, adoptive and foster relations without later source justification;
- free-form runtime parsing.

## Required next sequence

```text
CP-007 V2 human review and remediation
  -> immutable CP-007 V2 approval
  -> rerun chapter-wide English audit using V2 CP-007 authority
  -> manual English chapter freeze
  -> Hindi and Punjabi localisation
  -> multilingual parity and freeze
  -> Question Studio integration
```

## Release boundary

Question Studio, Question Bank, mock-test eligibility, localisation, publication, production staging and merge remain disabled.
