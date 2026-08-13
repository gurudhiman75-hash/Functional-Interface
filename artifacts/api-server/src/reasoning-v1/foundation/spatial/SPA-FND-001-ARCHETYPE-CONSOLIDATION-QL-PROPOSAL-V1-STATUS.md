# SPA-FND-001 — Archetype Consolidation and Permanent QL Proposal V1

## Status

`PROPOSAL_COMPLETE_VALIDATOR_WIRING_PENDING`

This checkpoint converts the 35 normalized discovery archetypes (34 active + one normalized hold) into a **proposal-only learner curriculum**. It does not allocate permanent QL IDs and does not activate Question Studio.

Proposal base head:

`ffbe0f8a06da2f99ca008758d613f27609973459`

## Consolidation result

```text
Normalized learner archetypes incl. hold: 35
Normalized active archetypes:              34
Proposed active learner QL candidates:     30
Proposal holds:                             2
Permanent QLs allocated:                    0
```

Chapter proposal counts:

```text
MIR-001: 3
WAT-001: 2
FAN-001: 8
FCL-001: 9
FSR-001: 8
Total:   30
```

The proposal deliberately keeps curriculum identity separate from implementation IDs. A technical rule becomes a separate learner QL only when the exam ask, learner invariant or rule schedule is meaningfully different.

## Intentional merges

Exactly four normalized-archetype merges are proposed:

1. `FAN-LA-01 + FAN-LA-02 → FAN-PQL-01` — whole-figure rotation and reflection are one global rigid-transform analogy method; angle/direction/axis are parameters.
2. `FCL-LA-03 + FCL-LA-07 → FCL-PQL-03` — primitive geometry and closure are both unary intrinsic-form classification checks rather than inter-component relations.
3. `FSR-LA-01 + FSR-LA-02 → FSR-PQL-01` — whole-figure rotation and reflection/inversion are one repeated global-transform series method.
4. `FSR-LA-04 + FSR-LA-08 → FSR-PQL-03` — marker/dot movement and multi-element permutation both use positional identity tracking through a cycle.

All other active normalized archetypes remain distinct because they require a different invariant or solving procedure: independent component orientation, count, substitution, containment, shading, topology, alternation or compound-rule tracking.

## Proposed learner QLs

### MIR-001 — 3
- `MIR-PQL-01` General figure or symbol mirror image
- `MIR-PQL-02` Alphanumeric vector-string mirror image
- `MIR-PQL-03` Analog clock mirror diagram

All three remain production-scale pending. Numeric mirror-time arithmetic remains owned by `CLK-001`.

### WAT-001 — 2 active + hold
- `WAT-PQL-01` General figure or symbol water image
- `WAT-PQL-02` Alphanumeric vector-string water image

`WAT-LA-03` analog-clock water diagram remains held under the existing DIAGRAM_ONLY boundary.

### FAN-001 — 8
- `FAN-PQL-01` Whole-figure rigid transformation analogy
- `FAN-PQL-02` Independent component transformation analogy
- `FAN-PQL-03` Component movement or cyclic permutation analogy
- `FAN-PQL-04` Element count change analogy
- `FAN-PQL-05` Shape or symbol substitution analogy
- `FAN-PQL-06` Nesting, size and containment-state analogy
- `FAN-PQL-07` Shading or visual-state analogy
- `FAN-PQL-08` Compound multi-operation analogy

45°/135° source-backed whole-figure rotation expansion remains a parameter-coverage task inside `FAN-PQL-01`, not a reason to create extra QLs.

### FCL-001 — 9
- `FCL-PQL-01` Transform-equivalence classification
- `FCL-PQL-02` Symmetry-property classification
- `FCL-PQL-03` Geometric form and closure classification
- `FCL-PQL-04` Count-relation classification
- `FCL-PQL-05` Nested, replica and relative-size relation classification
- `FCL-PQL-06` Relative-position and orientation relation classification
- `FCL-PQL-07` Topology and connectivity classification
- `FCL-PQL-08` Shading, fill and partition-state classification
- `FCL-PQL-09` Intra-option mirror, water or rotation relation classification

`FCL-PQL-09` retains an explicit capacity caution: its production proof needed 351 attempts for 200 accepted questions with 151 canonical duplicates. It remains one QL candidate, not separate mirror/water/rotation QLs.

The held letter/symbol identity-set oddity remains outside active FCL proposals until explicit glyph/symbol authority and exam-priority review exist.

### FSR-001 — 8
- `FSR-PQL-01` Whole-figure transformation series
- `FSR-PQL-02` Independent component transformation series
- `FSR-PQL-03` Positional movement and cyclic permutation series
- `FSR-PQL-04` Count, addition and removal progression
- `FSR-PQL-05` Shading and fill progression
- `FSR-PQL-06` Substitution and replacement progression
- `FSR-PQL-07` Alternating-operation series
- `FSR-PQL-08` Compound multi-rule series

Alternating and compound series remain separate: alternating rules are scheduled across successive transitions, while compound rules require multiple changes in the same transition.

## Evidence maturity

```text
PRODUCTION_SCALE_BACKED:                         15
MIXED_SCALE_AND_PROOF:                            6
PROOF_VALIDATED_SCALE_PENDING:                    8
PRODUCTION_SCALE_BACKED_WITH_CAPACITY_CAUTION:    1
```

Thus 16/30 candidates are production-scale backed if the capacity-caution candidate is included. Six have mixed new-scale and proof-only coverage, while eight still require full production-scale completion.

## Proposal IDs are not permanent QL IDs

Identifiers such as `FAN-PQL-04` and `FSR-PQL-07` are temporary proposal handles only.

```text
permanentQlId: null
allocationStatus: PROPOSAL_ONLY
Permanent QL count: 0
```

No permanent `*-QL-*` records are created by this checkpoint.

## Exam-scope lock

```text
SSC:                controlled taxonomy evidence established
RRB/Police/DSSSB:   supporting evidence present
Banking:            NOT ESTABLISHED
Punjab state:       NOT ESTABLISHED
```

## Lifecycle lock

```text
Permanent QL allocation:       false
Question Studio discovery:     false
Question Bank writes:          false
Mock-test eligibility:         false
Public publication:            false
English human freeze:          false
Hindi/Punjabi generation:      false
API/database schema changes:   none
```

## Validator wiring note

The machine-readable proposal manifest has been committed. An executable validator payload was prepared with exact checks for 30 candidates, 34 active-archetype coverage, four intentional merges, two holds, evidence counts and zero permanent QLs, but the GitHub connector rejected the executable write before it reached the repository. The proposal is therefore recorded as complete governance data while dedicated CI wiring remains pending rather than being falsely marked green.

## Next gate

`SPATIAL_PROPOSED_QL_COVERAGE_COMPLETION_AND_HUMAN_REVIEW_V1`

That gate should close the eight proof-only scale gaps and six mixed-coverage gaps, expand the 45°/135° FAN parameter domain, conduct human review of representative English stems, distractors, explanations and mobile SVG presentation against the proposed 30-Ql structure, and retry dedicated proposal validation wiring.

Only after that gate should a permanent QL allocation package be prepared for explicit approval.