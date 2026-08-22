# DSF-001 Manifest Amendment — CP-002 Question Studio Integration

Status: `IMPLEMENTED / CI_PENDING`

## Authority

- Integration checkpoint: `DSF-CP-002`
- Integration authority: `DSF_CP002_QUESTION_STUDIO_INTEGRATION_V1`
- Frozen source checkpoint: `DSF-CP-001`
- Frozen source authority: `DSF_CP001_PRODUCTION_GENERATION_FREEZE_V1`
- Permanent QL exposed: `DSF-QL-001`
- Next available permanent QL: `DSF-QL-002`
- New QL allocation: **none**

## Question Studio surface

CP-002 exposes the frozen CP-001 generators through the admin Question Studio review surface with:

- Number System;
- Ratio & Proportion;
- Percentage;
- Algebra;
- all 8 frozen production solve modes;
- all 5 canonical two-statement sufficiency classes;
- Easy / Medium / Hard filters where the frozen source can satisfy the requested combination;
- deterministic seed and batch generation;
- preview and review-run persistence.

## Answer-profile boundary

The initial integration intentionally exposes only:

`GENERIC_DS_STANDARD_5_EN`

Language: English (`en-IN`).

SSC-, Banking-, and Punjab-specific answer-profile rendering is **not** claimed by this checkpoint. Those display contracts remain a later evidence-backed delivery layer. Canonical DS semantics remain independent of option position/profile.

## Lifecycle

CP-001 remains frozen and delivery-locked. CP-002 is the only layer that changes Question Studio exposure.

```text
Question Studio discoverable: true
review-run persistence:       true
Question Bank writable:       false
mock-test eligible:           false
test eligible:                false
publicly publishable:         false
manual approval required:     true
automatic student publish:    false
```

No route for Question Bank writes, scored tests, mock-test publication, or public/student publication is introduced by CP-002.

## Proof gate

Dedicated CI must pass all of the following on the exact PR head:

1. API server build;
2. Admin app build;
3. DSF CP-002 runtime matrix proof across 4 domains × 5 semantic classes;
4. all 8 solve-mode filters;
5. deterministic batch proof;
6. route/client/admin-panel/Operations-page integration contract;
7. CP-001 freeze-authority regression;
8. full 600-question CP-001 cross-wave production regression.

Only after this gate is green may the CP-002 integration be treated as merged Question Studio authority.
