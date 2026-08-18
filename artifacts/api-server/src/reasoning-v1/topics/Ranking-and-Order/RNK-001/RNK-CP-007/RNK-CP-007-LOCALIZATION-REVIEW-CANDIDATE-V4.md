# RNK-CP-007 — Hindi/Punjabi Native Editorial Review Candidate V4

Status: **EXECUTABLE REVIEW CANDIDATE — HUMAN LANGUAGE REVIEW REQUIRED — NOT MULTILINGUAL FROZEN**

## Why V4 exists

The retained V3 artifact was mathematically correct and had already fixed feminine count agreement, but direct learner reading exposed a repeated native compound-label defect in the morning/evening batch partition:

```text
Hindi (V3)    सुबह बैच / शाम बैच
Hindi (V4)    सुबह के बैच / शाम के बैच

Punjabi (V3)  ਸਵੇਰ ਬੈਚ / ਸ਼ਾਮ ਬੈਚ
Punjabi (V4)  ਸਵੇਰ ਦੇ ਬੈਚ / ਸ਼ਾਮ ਦੇ ਬੈਚ
```

The same mechanical construction appeared in both question stems and explanations, so V4 repairs both surfaces.

## Invariance boundary

V4 is deliberately narrow. It preserves V3 for:

- permanent `RNK-QL-042` ownership;
- state and displayed evidence;
- option values/order;
- answer index and answer;
- mathematical fingerprint;
- permanent runtime fingerprint;
- canonical item ID and canonical semantic fingerprint;
- V3 feminine girls-category agreement;
- all lifecycle locks.

Questions outside the morning/evening batch wording remain V3-identical in both stem and explanation.

## Validation

The V4 gate rejects every residual `सुबह बैच`, `शाम बैच`, `ਸਵੇਰ ਬੈਚ`, or `ਸ਼ਾਮ ਬੈਚ` occurrence across the full 192 Hindi + 192 Punjabi bank, re-proves V3/V2/V1 baselines, re-proves the frozen English CP007 runtime and chapter-wide English closure, runs Ranking object-pool regressions and the API build, and retains a balanced 64-question V4 learner-review artifact that preferentially surfaces the repaired batch partition.

## Lifecycle

- English: frozen / unchanged
- Hindi/Punjabi V4: review candidate
- human language approval: required
- multilingual freeze: false
- Question Studio: disabled
- persistence: disabled
- Question Bank: `NOT_STORED`
- test eligibility: `INELIGIBLE`
- public publication: false

No merge, activation or publication authority is granted by this candidate.
