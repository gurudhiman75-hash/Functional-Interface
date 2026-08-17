# SYL-001 V5 Exam-Readiness Remediation

Authority: `SYL_001_EXAM_READINESS_REMEDIATION_V5`

## Scope

V5 remains an additive learner-facing projection over the V4 implementation. V3 remains the structured-proof and keyed-answer authority. V4 remains reproducible historical evidence.

V5 does not independently enable Question Studio, question-bank storage, mock-test eligibility or public release.

## Implemented corrections

### Answer and explanation binding

- QL-008 explanation and diagram modes are derived from the actual pair status.
- Exact-one prose and either-or treatment are permitted only for genuine complementary pairs.
- QL-009 and every conclusion-mask question explain each displayed conclusion.
- Counterexamples and possibility models are bound to the exact marked conclusion.
- Possible-but-not-definite explanations retain distinct true and false canonical models internally.
- Every narrated model is checked against the premises and claimed truth value.

### Learner-safe Venn policy

The rejected force-layout renderer has been retired. The restored learner convention uses one compact exam-style arrangement focused on the decisive member and marked answer.

Enabled diagrams must satisfy all of the following:

- no more than three terms;
- valid `ALL`, `NO`, `SOME`, `SOME NOT`, `ONLY`, identity and `ONLY A FEW` geometry;
- every required witness positioned consistently with the statements and selected model;
- at most two unnumbered decisive `×` witnesses;
- no floating separation `×`;
- no numbered witness sequence;
- no `textLength` compression;
- no relation maps, node maps, arrow maps or comparison panels;
- a 340 × 210 mobile viewBox with readable labels;
- counterexample captions that explicitly say the statements remain true while the selected proposition is false.

Four-term and visually unstable cases are omitted rather than forced into a crowded canvas.

Exhaustive generated-record result:

```text
records checked:                         4,320
enabled exact Venn diagrams:             1,479
intentionally omitted:                   2,841
  more than three terms:                 1,887
  no fully exact simple arrangement:       954
existential premise failures:                0
target-model failures:                       0
witness closure failures:                    0
witness-position failures:                   0
witness-set mismatches:                      0
unauthorised containment directions:         0
non-Venn enabled visuals:                    0
maximum witnesses per diagram:               2
```

The 324-record human-review pack contains:

```text
enabled exact Venn diagrams: 108
intentionally omitted:       216
  complex:                   135
  unstable or overstrong:     81
```

## Product-owner approval

The complete English, Hindi and Punjabi question, explanation and restored diagram pack was approved by the product owner.

```text
approvedAt: 2026-08-08
questionAndExplanationStatus: APPROVED_BY_PRODUCT_OWNER
diagramStatus: APPROVED_BY_PRODUCT_OWNER
humanViewportStatus: APPROVED
approvedWidths: 360, 412, 768
```

This approval applies to all diagrams retained in the 324-record review pack and to their localized geometry at the approved viewport widths.

### Option remediation

The premise authorities are always satisfiable. Therefore, `The statements are inconsistent` was a permanently dead option in modal-classification QLs.

Affected QLs now use the exhaustive three-status diagnostic:

1. Definitely true
2. Possible, but not definitely true
3. Impossible

Affected QLs:

- `SYL-QL-007`
- `SYL-QL-012`
- `SYL-QL-014`
- `SYL-QL-018`

```text
optionCount: 3
answerTemplateId: DIAGNOSTIC_THREE_OPTION_V1
```

All non-modal four- and five-option formats remain unchanged.

## Viewport evidence

A standalone responsive HTML pack covers:

```text
360 px
412 px
768 px
```

The automated viewport contract verifies width-constrained cards, wrapping, responsive SVGs, exact geometry, valid witness placement, no non-Venn enabled mode, and no script or `foreignObject` content.

Current status:

```text
humanViewportStatus: APPROVED
```

## Exhaustive gates

The workflow validates:

```text
18 provisional QLs × 80 seeds × 3 locales = 4,320 records
```

It rejects explanation-answer contradictions, diagram-answer contradictions, missing model evidence, option-status mismatches, dead inconsistent-premise options, unsafe diagrams, editorial-status regressions, viewport regressions and delivery-lifecycle activation.

## Remaining blockers

- Source-authentic task weighting and difficulty calibration.
- Final source-profile and QL merge/split sign-off.

```text
reviewStatus: REVISE
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```

Do not merge independently of V4/V3 and do not enable any delivery surface from approval evidence alone.
