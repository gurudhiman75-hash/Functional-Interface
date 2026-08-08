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

The rejected force-layout renderer has been retired. It could create accidental overlaps, separations and containment, and it overcrowded learner diagrams with numbered witnesses.

The replacement follows this rule:

> Render one compact, exact-topology Venn only when a clear learner-safe arrangement exists; otherwise omit the diagram.

Enabled diagrams now use finite verified templates and must satisfy all of the following:

- no more than three terms;
- actual `ALL`, `NO`, `SOME`, `SOME NOT`, `ONLY`, identity and `ONLY A FEW` geometry;
- every existential premise represented by a visible witness;
- every target-created witness completed through all forced universal and negative relations;
- at most two unnumbered decisive `×` witnesses;
- every witness plotted inside and outside exactly the classes declared by its complete proof role;
- every displayed containment direction authorised independently;
- coincident circles permitted only when both subset directions are forced;
- no stronger unstated containment or separation;
- no floating separation `×`;
- no numbered witness sequence;
- no `textLength` compression;
- no relation maps, node maps, arrow maps or comparison panels;
- a 340 × 210 mobile viewBox with readable labels;
- counterexample captions that explicitly say the statements remain true while the selected proposition is false.

`ONLY A FEW` requires both the overlap witness and the subject-outside-predicate witness. If both cannot be shown clearly, the diagram is omitted.

Four-term and more complex cases are not forced into a crowded canvas. One-way universal relations are never drawn as false equivalence; a diagram without a safe directional layout is omitted.

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

All 36 enabled English review diagrams were visually inspected. Hindi and Punjabi use the same verified geometry with localized labels.

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

Contract:

```text
optionCount: 3
answerTemplateId: DIAGNOSTIC_THREE_OPTION_V1
```

All non-modal four- and five-option formats remain unchanged.

## Product-owner question and explanation approval

The 324-record question-and-explanation review pack was approved on 2026-08-07.

```text
English:  APPROVED_BY_PRODUCT_OWNER
Hindi:    APPROVED_BY_PRODUCT_OWNER
Punjabi:  APPROVED_BY_PRODUCT_OWNER
```

This approval applies to the question and explanation content. The redesigned diagram layer requires a new viewport review.

## Viewport evidence

A standalone responsive HTML pack is generated for:

```text
360 px
412 px
768 px
```

It contains all 324 review records and provides width, language, QL and diagram-status filters. Omitted visuals are identified explicitly in the review pack.

The automated viewport contract verifies:

- width-constrained cards;
- zero-min-width grid children;
- wrapping for long learner text;
- flexible option columns;
- responsive SVG diagrams;
- a 340-unit maximum diagram width;
- exact circle geometry for every enabled diagram;
- valid and closure-complete witness placement;
- authorised containment direction for every nested pair;
- no relation-map terminology or non-Venn enabled mode;
- no script or `foreignObject` content inside learner diagrams.

Current status:

```text
humanViewportStatus: PENDING
```

No human viewport approval is carried over from the rejected diagram pack.

## Exhaustive gates

The exact-head workflow validates:

```text
18 provisional QLs × 80 seeds × 3 locales = 4,320 records
```

It rejects:

- explanation-answer contradictions;
- diagram-answer contradictions;
- unexplained displayed conclusions;
- missing or truth-invalid canonical models;
- duplicate true/false model pairs;
- option logical-status mismatches;
- dead inconsistent-premise options;
- modal status omissions or duplicates;
- changes to non-modal option counts;
- forced diagrams with more than three terms;
- missing existential-premise witnesses;
- incomplete witness membership or exclusion closure;
- witness-position violations;
- target-model geometry violations;
- unauthorised reverse containment;
- stronger unstated containment or separation;
- unclear `ONLY A FEW` topology;
- numbered witnesses or floating separation crosses;
- relation-map or node-map visuals;
- editorial-status regressions;
- viewport-contract regressions;
- any delivery-lifecycle activation.

## Remaining blockers

- Human viewport approval at 360, 412 and 768 px for the redesigned diagrams.
- Source-authentic task weighting and difficulty calibration.
- Final source-profile and QL merge/split sign-off.

```text
reviewStatus: REVISE
questionStudioEnabled: false
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
public: false
```

Do not merge independently of V4/V3 and do not enable any delivery surface from automated evidence alone.
