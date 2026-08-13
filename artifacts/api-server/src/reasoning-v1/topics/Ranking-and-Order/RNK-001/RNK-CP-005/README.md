# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **ENGLISH FROZEN — `RNK-QL-036..038` allocated — 576-question permanent runtime projection pinned**

This checkpoint owns Ranking questions where the displayed comparisons intentionally permit more than one complete ranking. The solver reasons over the complete set of valid rankings rather than forcing one arrangement.

## Permanent authorities

```text
RNK-QL-036  RELATION_TRUTH_STATUS
  MUST
  COULD
  CANNOT
  PAIR_STATUS: first above / second above / indeterminate

RNK-QL-037  POSSIBLE_RANK_BOUND
  highest possible rank
  lowest possible rank

RNK-QL-038  EXACT_RANK_DETERMINACY
  definite exact rank
  indeterminate exact rank
```

The seven validated discovery source forms therefore consolidate into **three permanent QLs**, not seven.

Rejected source form: `ORDER_UNIQUENESS_STATUS`.

See:

- `RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`
- `RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`
- `RNK-CP-005-PERMANENT-RUNTIME-CANDIDATE-V1.md`
- `RNK-CP-005-ENGLISH-FREEZE-V1.md`

## Permanent runtime

```text
runtime version:       RNK_CP005_PERMANENT_RUNTIME_V1
freeze version:        RNK_CP005_ENGLISH_FREEZE_V1
permanent questions:   576
questions/QL:           192

RNK-QL-036:             192
RNK-QL-037:             192
RNK-QL-038:             192
```

Every permanent QL has exact answer-position balance:

```text
48 / 48 / 48 / 48
```

Mode quotas:

```text
MUST:                       48
COULD:                      48
CANNOT:                     48
PAIR_FIRST_ABOVE:           16
PAIR_SECOND_ABOVE:          16
PAIR_INDETERMINATE:         16
HIGHEST_POSSIBLE:           96
LOWEST_POSSIBLE:            96
EXACT_DEFINITE:             96
EXACT_INDETERMINATE:        96
```

All five approved presentation contexts occur in every authority. Context rendering remains separate from the mathematical state.

Quality-filtered topology coverage is preserved:

```text
RELATION_TRUTH_STATUS:    8 graph families
POSSIBLE_RANK_BOUND:      7 graph families
EXACT_RANK_DETERMINACY:   6 graph families
```

Candidate difficulty inherited by the frozen runtime:

```text
Easy:       0
Medium:   496
Hard:      80
```

## Freeze review

The final 36-question manual pack was independently re-solved before freeze:

```text
questions reviewed:          36 / 36
wrong answer keys:            0
ambiguous correct options:    0
invalid witness rankings:     0
contradictory clue sets:      0
```

The freeze gate then independently re-proved **all 576 answers** from the partial-order states rather than trusting stored truth metadata.

```text
questions independently re-proved: 576
rank-bound proofs rechecked:        192
compulsory proof chains checked:    736
full witness orders checked:        816
unique learner fingerprints:        576
unique permanent fingerprints:      576
```

Earlier editorial blockers remain excluded: anchor-assisted triviality, direct-reversal COULD shortcuts, ambiguous lower-rank wording, permutation-count explanations, and Seating Arrangement geometry.

## Projection pins

Reviewed candidate projection:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

Frozen permanent projection:

```text
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
```

## QL-034 ownership boundary

`RNK-QL-036` remains separate from frozen `RNK-QL-034`:

```text
RNK-QL-034 / CP-004
  state contract: exactly one complete strict order
  solver reconstructs that unique order

RNK-QL-036 / CP-005
  state contract: at least two complete strict orders remain valid
  solver classifies relation truth over the entire valid-order set
  modes: MUST / COULD / CANNOT / PAIR_STATUS
```

The executable QL-034 ownership/anti-duplication audit remains a freeze regression gate.

## Protected exclusions

- seating/facing/left-right adjacency/neighbour geometry;
- unique complete-order reconstruction already owned by CP-004;
- shared passage delivery as a standalone authority;
- arithmetic-heavy age/marks/speed/score questions;
- statement-wise sufficiency labels;
- context words such as merit, race or performance as separate QLs.

## Lifecycle

```text
cumulative permanent range: RNK-QL-001..038
CP-005 permanent range:     RNK-QL-036..038
next available QL:          RNK-QL-039
CP-005 English freeze:      true
ownership signoff:          PASSED_BY_AUDIT
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
Hindi/Punjabi:              NOT_STARTED
```

English freeze does not authorize merge, deployment, publication, generation/persistence enablement, or translation.
