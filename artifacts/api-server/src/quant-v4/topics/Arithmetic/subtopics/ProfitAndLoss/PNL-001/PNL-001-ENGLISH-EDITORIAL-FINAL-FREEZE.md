# PNL-001 English Editorial Final Freeze

## Result

The hardened chapter-wide English audit is fully green after removing the final ten repeated prose patterns and separating seven fixed-answer task contracts from editorial debt.

```text
CPs:                               6
QLs:                               186
Candidate seeds per QL:            48
Generated candidate packages:   8928
Selected review rows:               558
Fatal findings:                      0
Editorial findings:                  0
Unresolved same-QL stem repeats:     0
Unresolved same-QL answer repeats:   0
Contractually fixed stems:            0
Contractually fixed answers:          7
Repeated opening patterns:            0
Repeated closing patterns:            0
Repeated paragraph patterns:          0
Audit status:                          PASS
```

## Fixed-answer contracts

These tasks legitimately return one classification for every valid deterministic candidate and are recorded as chapter metrics rather than editorial findings:

```text
PNL-QL-035, PNL-QL-067, PNL-QL-070, PNL-QL-090, PNL-QL-117, PNL-QL-147, PNL-QL-184
```

## Final prose corrections

- CP-001 direct profit, loss and no-change rate openings are distinct.
- CP-001 forward and reverse commercial-factor steps explain their own direction.
- CP-001 value-bound working distinguishes profit, loss and no-change cases.
- CP-002 amount, successive-discount, comparison and markup clusters use QL-specific openings.
- CP-002 direct and algebraic discount-rate steps have distinct calculation labels.
- CP-002 three-discount working no longer repeats a generic final-selling-price closing.
- CP-003 partial, spoiled, caselet and break-even inventory modes use task-specific full-cost steps.
- CP-004 two-stage, three-stage and table chains have distinct final-price closings.
- CP-005 and CP-006 percentage-conversion steps describe their actual business quantities.

## Freeze boundary

English Editorial V2 authority, committed EN/HI/PA libraries, six dynamic runtimes, Question Studio routing, freeze-readiness checks and publication locks must remain green. Reopen the English manual only for a proven mathematical, source-parity, rendering or examination-pattern defect—not for cosmetic variation.

## Safety boundary

No solver equation, answer semantic, option lifecycle, Question Studio route, Question Bank write, test eligibility or public-publication metadata changed. Dynamic candidates remain unreviewed, not stored, test-ineligible and non-public.
