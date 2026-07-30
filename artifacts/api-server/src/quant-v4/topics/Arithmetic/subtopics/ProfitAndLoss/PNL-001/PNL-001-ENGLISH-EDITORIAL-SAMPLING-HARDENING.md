# PNL-001 English Editorial Audit Sampling Hardening

## Result

The chapter audit now samples from 48 mixed deterministic candidates per QL. It first maximises semantic stem shape and displayed-answer diversity, then exact visible-value variation.

```text
QLs:                              186
Review rows:                      558
Candidate seeds per QL:           48
Fatal findings:                   0
Editorial findings:               46
Unresolved same-QL stem repeats:  0
Unresolved same-QL answer repeats:0
Contractually fixed stems:        0
Contractually fixed answers:      7
Audit status:                     REVIEW_REQUIRED
```

## Corrected false sampling signals

The earlier correlated candidate seed family repeatedly selected one exact preset for `PNL-QL-082`, `PNL-QL-144` and `PNL-QL-183`, even though their checkpoint runtimes expose multiple exact stems. The mixed-salt candidate pool now selects all available exact variation up to the three review rows while still preferring distinct normalized stem shapes.

## Fixed-task classification

A repeated stem or answer is classified as contractually fixed only when all 48 deterministic candidates agree.

Fixed-stem QLs:

```text
None
```

Fixed-answer QLs:

```text
PNL-QL-035, PNL-QL-067, PNL-QL-070, PNL-QL-090, PNL-QL-117, PNL-QL-147, PNL-QL-184
```

## Remaining editorial debt

```json
{
  "CONTRACTUALLY-FIXED-ANSWER": 7,
  "REPEATED-EXPLANATION-CLOSING": 2,
  "REPEATED-EXPLANATION-OPENING": 8,
  "REPEATED-EXPLANATION-PARAGRAPH": 29
}
```

The remaining repeated openings, closings and paragraphs come from shared frozen Editorial V2 prose and require targeted editorial decisions. They are no longer mixed with false same-stem or same-answer findings caused by review-sample selection.

## Safety boundary

No solver, stem template, option, Question Studio route, Question Bank write, test eligibility or publication metadata changed. Generated packages remain unreviewed dynamic candidates, not stored, test-ineligible and non-public.
