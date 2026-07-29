# MAL-CP-001 Editorial, Source-Recovery and Allocation-Recommendation Checkpoint 04

Status: **editorial v2 complete; non-allocating recommendation prepared**  
Permanent QLs: **0**  
Human approvals recorded: **0**  
Question Studio/public eligibility: **disabled**

## 1. Scope

This checkpoint follows the 15-prototype to 8-candidate freeze-preparation review. It closes the manual English defects found in the 60-question matrix, records the focused source-recovery result, and produces a recommendation for later human allocation review without creating any permanent identity.

## 2. Editorial v2 closure

The unified discovery pipeline and core runtime now protect all reviewed presentation paths.

Corrections include:

- every ordered quantity-pair stem names both components and states the order with `respectively`;
- every ordered pair option labels both component quantities;
- pair conclusions name both component labels;
- plural-material prompts such as `How much estate beans ...` and `How much premium tea leaves priced at ...` are rewritten as quantity questions;
- vague references such as `the latter`, `higher component` and `highest-priced component` are replaced by the actual component label;
- two-stage portion grammar uses an explicit portion rather than constructions such as `32 litres is mixed`;
- component-share prompts ask for a quantity rather than an undefined `share`;
- final-mean prompts refer naturally to the resulting blend;
- two-stage inverse and three-way conclusions name the requested final component;
- clause capitalisation is corrected when an interrogative follows a comma.

The executable editorial gate covers:

```text
15 prototypes × 80 seeds = 1,200 generated questions
60 product-review rows
160 ordered-pair generated questions
known forbidden-pattern matches = 0
```

All eight candidate-group statuses and all sixty question-row statuses remain `PENDING`. No human decision is inferred from machine validation.

## 3. Focused source-recovery verdict

A competitive-exam reference was recovered for a three-variety tea problem with:

```text
three component quantities
+ an initial three-way ratio
+ stated additions
+ a changed three-way ratio
→ final amount of the third component
```

This is useful evidence that coupled three-component quantity relations occur in target-style material. It does **not** clear the blocked CP-001 candidate because the decisive invariant is addition-driven ratio adjustment, not three source values balanced around a target weighted mean.

```text
recovered boundary owner: MAL-CP-002
clears CP-001 source blocker: false
```

The executable CP-001 three-way prototype remains valid engineering evidence but should not enter the first permanent CP-001 allocation proposal.

## 4. Non-allocating recommendation

The eight consolidated candidates are classified for later human review as follows:

```text
READY_AFTER_HUMAN_REVIEW: 5
READY_AFTER_HUMAN_REVIEW_WITH_VARIANT_DEFERRED: 1
HOLD_FOR_DIRECT_SOURCE_OR_EXPLICIT_PRODUCT_ACCEPTANCE: 1
DEFER_FROM_CP001_REFER_CP002: 1
```

### Ready after human review

- target ratio;
- final mean;
- unknown source value;
- unknown component quantity;
- two-stage final mean.

### Ready after human review with a variant deferred

`MAL-CP001-FREEZE-QUANTITIES-FROM-RATIO-SCALE`

The total-scale and known-counterpart forms may proceed after product approval. The difference-as-scale wording remains merged executable evidence but should be excluded from the first permanent allocation until directly sourced or explicitly approved.

### Hold for source or explicit product acceptance

`MAL-CP001-FREEZE-TWO-STAGE-UNKNOWN-QUANTITY`

The inverse topology is mathematically and executablely sound, but direct external evidence currently supports only analogous pre-blended-source forms. It must not be silently promoted from analogy.

### Defer from CP-001 and refer to CP-002

`MAL-CP001-FREEZE-THREE-WAY-RELATION-QUANTITY`

The recovered source strengthens the CP-002 ownership boundary rather than CP-001 authority.

## 5. Safety verdict

```text
permanentQlId: null for every recommendation row
currentlyAllocationEligible: false
humanReviewStatus: PENDING
publiclyPublishable: false
questionStudioDiscoverable: false
```

This checkpoint is a recommendation package only. It does not freeze permanent QL counts, create learner identities, approve English content, or start Hindi/Punjabi implementation.

## 6. Next gate

1. conduct actual human product review of the eight candidate groups and sixty English rows;
2. record an explicit accept, revise, hold or reject decision per candidate;
3. decide whether analogous evidence is sufficient for the two-stage inverse candidate;
4. retain the difference-scale variant as deferred unless source or product approval changes its status;
5. keep the three-way relation candidate outside the first CP-001 allocation proposal;
6. only then prepare a permanent allocation proposal for the approved subset.
