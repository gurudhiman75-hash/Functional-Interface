# Logic Puzzles — Deep Audit Wave 02

Date: 2026-09-30

Status: `LIVE_V8_GENERATED_SURFACE_AUDIT__DIFFICULTY_FILTER_REMEDIATED__FINAL_REPETITION_AUDIT_PENDING`

## Reproduced live defect — difficulty request ignored

The shared Logic Puzzle Question Studio request already exposes a `difficulty` field and every package advertises supported difficulty bands.

However, the V2→V8 generation chain did not consume `request.difficulty`.

Therefore selecting Easy / Medium / Hard in Question Studio did not guarantee that the generated caselets matched the selected structural difficulty.

## Remediation

The live V8 facade now applies a deterministic structural-difficulty filter over whole caselets.

The filter:

- keeps the frozen package generators unchanged;
- preserves all child questions belonging to the selected caselet;
- deterministically scans candidate caselets using seed-derived attempts;
- returns only caselets whose generated difficulty matches the requested band;
- fails closed if the requested band cannot be produced within the deterministic candidate budget.

Authority:

`LP_V8_STRUCTURAL_DIFFICULTY_FILTER_V1`

No permanent QL, frozen learner content, solver semantics or lifecycle gate changes.

## Live V8 generated-surface gate

`lp-001-deep-audit-wave2.test.ts` audits the actual V8 Question Studio route.

It covers:

- all live Logic Puzzle packages;
- all advertised difficulty bands;
- all 47 permanent QLs;
- English/Hindi/Punjabi parity;
- four unique options;
- exact answer/index binding;
- explanation presence;
- banned internal/editorial wording;
- review-only lifecycle locks.

## Structural difficulty extension

The prior chapter-wide difficulty test ended at LP-009.

Wave 02 adds structural checks for the newer authority surface.

### LP-010

- Easy retains strong direct slot anchors;
- Medium mixes direct and relational clues;
- Hard limits direct slot anchors and requires layered relational constraints.

### LP-011

- Easy retains at least one strong anchor;
- Medium permits at most one direct box→attribute anchor;
- Hard forbids direct box→attribute anchors.

### LP-QL-045..046

Projection children must inherit the exact structural difficulty of the solved LP-006 parent caselet.

### LP-QL-047

- Easy/Medium use the LP-001 grouping counterfactual topology;
- Hard uses LP-004 partial committee states;
- Hard starts from at least five valid parent states;
- the additional condition reduces the state space to one to four states.

## Source gate

This wave does not alter the chapter's source-provenance decision.

Current source status remains:

- `SOURCE_SATURATED_FOR_TARGET_EXAMS = false`;
- `PRODUCTION_ELIGIBLE = false`.

Content deep-audit closure can be separate from production source saturation.

## Next gate

If Wave 02 is green:

1. run normalized structural-signature repetition analysis across LP-001..011;
2. recheck QL001..047 merge/split boundaries;
3. record final content deep-audit closure if no content defect remains.

Production promotion remains blocked until target-exam source saturation is separately satisfied.

## Result

`LP_DEEP_AUDIT_WAVE02_DIFFICULTY_FILTER_FIXED__LIVE_47_QL_AUDIT_READY`
