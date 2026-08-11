# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **EDITORIAL V3 RELEASE REVIEW PASSED — FINAL OWNERSHIP REVIEW PENDING — no permanent QL allocated**

This checkpoint covers ranking questions in which the displayed comparisons intentionally permit more than one complete ranking. Answers are proved across all valid orders rather than by forcing one arrangement.

## Raw discovery

```text
raw prototypes:                 8
questions/prototype:           32
raw questions:                256
valid rankings/question:      >=2
answer positions:      64 / 64 / 64 / 64
unique fingerprints:          256
```

Raw discovery included optional fixed-rank anchors and four original graph shapes. Editorial V3 no longer depends on endpoint anchors and uses a broader graph pool.

## V3 Release source forms

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED   # legacy discovery ID; learner form = PAIR_RELATION_STATUS
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

Rejected:

```text
ORDER_UNIQUENESS_STATUS
```

The rejected form repeatedly projected the same multiple-order conclusion and overlapped existing uniqueness ownership.

## Three provisional authorities

V3 consolidates the seven surviving source forms into **three**, not seven, authority candidates:

```text
RELATION_TRUTH_STATUS
  MUST
  COULD
  CANNOT
  PAIR_STATUS: first above / second above / indeterminate

POSSIBLE_RANK_BOUND
  highest possible rank
  lowest possible rank

EXACT_RANK_DETERMINACY
  definite exact rank
  indeterminate exact rank
```

These are provisional authorities, **not permanent QLs**.

See `RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`.

## V3 Release evidence

```text
editorial version:             RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE
questions checked:            168
questions/source form:         24
provisional authorities:        3
answer positions:      42 / 42 / 42 / 42
unique release states:        168

Easy:                           0
Medium:                       156
Hard:                          12

permanent QLs:                  0
```

Eight V3 graph families are represented:

```text
DIAMOND_TAIL
TWO_CHAINS_BRIDGE
ASYMMETRIC_FORK
STAGGERED_MERGE
CHAIN_PLUS_BRANCH
DOUBLE_FORK
WIDE_MERGE
CROSS_LINKED
```

Each source form spans at least six graph families in the release corpus; the 28-question review pack uses four distinct topologies within every source form.

Implementation proof before this documentation pass:

```text
workflow run: 31472607624
head:         bf268249e9daf24273da2ecf081f674ea4e42642
result:       PASS
```

Artifacts:

```text
evidence: 9093964523
sha256:079dc2d8df6ecd2ae4f3941ee752395c55f2f4e9f96be0f1bb6f0987abbd3b63

review:   9093964870
sha256:8293fc3810c9d8d111e2c9a4ce3eb2634927fdbdf331566881eea57989b0af6b
```

## Semantic option gates

Generic relation questions enforce:

```text
four distinct ordered pairs
four distinct unordered pairs
at least four people represented
no person appears in more than two options
```

Query-specific rules:

- **MUST:** correct relation is transitively derived; at least two wrong options are possible but not compulsory.
- **COULD:** correct relation is variable; every wrong option is impossible only through multi-step inference; direct clue reversal is prohibited.
- **CANNOT:** correct relation is transitively impossible; every wrong option is possible but not compulsory.
- **PAIR_STATUS:** 24-question evidence is balanced `8 FIRST_ABOVE / 8 SECOND_ABOVE / 8 INDETERMINATE`; the fourth distractor varies across several exact-gap claims.

## Rank-bound and exact-rank gates

Possible-rank bounds require:

- at least three compulsory predecessors/successors;
- branch integration;
- at least one compulsory relation obtained transitively, not by a displayed direct comparison;
- a proof that a better boundary is impossible;
- a valid witness ranking showing the boundary is attainable.

Definite exact-rank questions require transitive structural evidence and accounting for all other entities. Indeterminate exact-rank questions require two valid rankings that place the target at different ranks.

## Difficulty calibration

V3 intentionally moved away from “more names = Hard”.

```text
Medium: 156
Hard:    12
Easy:     0
```

Hard is reserved for deeper proof burden; most partial-order questions remain Medium even with six or seven names.

## Manual review result

The final 28-question release pack was manually inspected after executable validation.

```text
wrong answer keys:                  0
contradictions:                     0
one-person option fixation:         0
direct-reversal COULD shortcuts:    0
pair outcome monotony:              0
rank-bound direct-count-only cases: 0
Seating Arrangement geometry:       0
```

Editorial review is therefore passed. Permanent ownership/source review is still pending.

## CP-004 boundary

CP-004 `RNK-QL-034` and CP-005 `MUST` may share surface language but not the same proof contract:

```text
CP-004 / RNK-QL-034
  one unique complete strict order is forced

CP-005 / RELATION_TRUTH_STATUS-MUST
  several complete rankings remain valid
  the conclusion must hold across all of them
```

Final source-backed ownership review must still decide whether partial-order truth status becomes a new permanent QL or a parameterised extension of existing ownership.

## Protected exclusions

- seating/facing/left-right adjacency/neighbour geometry;
- unique complete-order reconstruction already owned by CP-004;
- shared passage delivery as a standalone authority;
- arithmetic-heavy age/marks/speed/score questions;
- statement-wise sufficiency labels;
- context words such as merit, race or performance as separate QLs.

## Lifecycle

```text
frozen permanent range: RNK-QL-001..035
next available QL:      RNK-QL-036
CP-005 permanent QLs:   0
English freeze:         false
final ownership signoff: pending
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
