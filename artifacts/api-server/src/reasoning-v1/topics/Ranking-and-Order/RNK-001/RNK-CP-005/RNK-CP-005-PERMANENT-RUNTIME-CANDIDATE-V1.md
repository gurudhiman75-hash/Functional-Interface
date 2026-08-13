# RNK-CP-005 Permanent Runtime Candidate V1

Status: **PRODUCTION-SCALE ENGLISH CANDIDATE BUILT — PROJECTION PINNED — FINAL MANUAL FREEZE APPROVAL PENDING**

This checkpoint converts the Editorial V3 release into a production-scale English runtime candidate while preserving discovery-only lifecycle controls. It does **not** allocate a permanent QL and does **not** approve English freeze.

## Ownership result

The QL-034 overlap audit is resolved:

```text
RNK-QL-034 / CP-004
  state contract: ONE unique complete order
  authority: DEFINITELY_TRUE_RELATION

RNK-CP-005
  state contract: TWO OR MORE valid complete orders
  authority: RELATION_TRUTH_STATUS
```

Therefore CP-005 retains three separate provisional permanent-authority candidates:

```text
RELATION_TRUTH_STATUS
POSSIBLE_RANK_BOUND
EXACT_RANK_DETERMINACY
```

No authority has a permanent QL ID yet.

## Candidate runtime

```text
runtime version: RNK_CP005_PERMANENT_RUNTIME_CANDIDATE_V1
candidate questions: 576
authorities: 3
questions/authority: 192

RELATION_TRUTH_STATUS:    192
POSSIBLE_RANK_BOUND:      192
EXACT_RANK_DETERMINACY:   192
```

Mode distribution:

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

## Answer-position balance

Each authority is independently balanced:

```text
RELATION_TRUTH_STATUS:    48 / 48 / 48 / 48
POSSIBLE_RANK_BOUND:      48 / 48 / 48 / 48
EXACT_RANK_DETERMINACY:   48 / 48 / 48 / 48
```

The exact-rank source has a structural parity contract:

```text
EXACT_DEFINITE:       48 / 0 / 48 / 0
EXACT_INDETERMINATE:   0 / 48 / 0 / 48
```

Their combined authority remains perfectly balanced. This is intentional and is protected by executable tests.

## Context coverage

Context rendering is decoupled from mathematical-state selection so presentation diversity does not alter solver logic.

Every authority spans all five contexts:

```text
MERIT_LIST
INTERVIEW_SHORTLIST
PERFORMANCE_REVIEW
RACE_RESULT
EXAM_SCORE_ORDER
```

Ambiguous wording such as `lower merit rank` and `lower score rank` remains prohibited.

## Topology coverage

The production candidate preserves the quality-filtered V3 topology baselines rather than forcing graph families that do not safely support a given proof contract:

```text
RELATION_TRUTH_STATUS:    8 topology families
POSSIBLE_RANK_BOUND:      7 topology families
EXACT_RANK_DETERMINACY:   6 topology families
```

These match the validated Editorial V3 source baselines after authority-specific quality filtering.

## Difficulty and uniqueness

```text
Easy:       0
Medium:   496
Hard:      80

distinct normalized learner surfaces: 576
distinct selected mathematical states: 576
distinct runtime fingerprints:         576
```

Every selected question still represents a genuine partial order with at least two valid complete rankings.

## Pinned projection

The candidate projection is pinned at:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

Any learner-visible, mode, source, context, topology, answer, explanation or selected-state drift covered by the projection now fails the freeze-review gate.

## Final manual review pack

A deterministic 36-question freeze-review exporter samples the pinned 576-question runtime:

```text
questions:                36
questions/authority:      12
answer positions:    9 / 9 / 9 / 9
```

Composition:

```text
RELATION_TRUTH_STATUS
  2 MUST
  2 COULD
  2 CANNOT
  2 PAIR_FIRST_ABOVE
  2 PAIR_SECOND_ABOVE
  2 PAIR_INDETERMINATE

POSSIBLE_RANK_BOUND
  6 HIGHEST_POSSIBLE
  6 LOWEST_POSSIBLE

EXACT_RANK_DETERMINACY
  6 EXACT_DEFINITE
  6 EXACT_INDETERMINATE
```

The pack is a **manual freeze gate**, not freeze approval.

## Lifecycle

```text
frozen permanent range: RNK-QL-001..035
next available QL:      RNK-QL-036
CP-005 permanent QLs:   0
expected future range:  not allocated
final ownership map:    resolved at authority level
English freeze:         false
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```

`RNK-QL-036..038` must not be assigned until the final manual English freeze review is explicitly approved.
