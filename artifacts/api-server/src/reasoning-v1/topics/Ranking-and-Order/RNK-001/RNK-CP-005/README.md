# RNK-CP-005 — Partial Order and Ranking Uncertainty

Status: **EDITORIAL V3 RELEASE PASSED — QL-034 OWNERSHIP AUDIT PASSED — no permanent QL allocated**

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

Rejected: `ORDER_UNIQUENESS_STATUS`.

## Three provisional authorities

The seven surviving source forms consolidate into **three**, not seven, authority candidates:

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

These remain provisional authorities, **not permanent QLs**.

See:

- `RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`
- `RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`

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

Eight graph families are represented:

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

Final V3 exact-head proof before the ownership-audit branch:

```text
workflow run: 31473422220
head:         c4fcb1a53b310aae9e4c24e55d3fa3b4f895a15a
result:       PASS
```

Artifacts:

```text
evidence: 9094288269
sha256:2a301854046a54a6053af34791034bcde79cfaad729e548f535fa60824f1cbc5

review:   9094288765
sha256:6fbee29941e0aa9753dbfeee0e1ec33064f947cacdbbf699cd5251b0af9742ab
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
- **PAIR_STATUS:** 24-question evidence is balanced `8 FIRST_ABOVE / 8 SECOND_ABOVE / 8 INDETERMINATE`; the fourth distractor varies across exact-gap claims.

## Rank-bound and exact-rank gates

Possible-rank bounds require:

- at least three compulsory predecessors/successors;
- branch integration;
- at least one compulsory relation obtained transitively;
- proof that a better boundary is impossible;
- a valid witness ranking showing the boundary is attainable.

Definite exact-rank questions require transitive structural evidence and accounting for all other entities. Indeterminate exact-rank questions require two valid rankings that place the target at different ranks.

## Difficulty calibration

```text
Medium: 156
Hard:    12
Easy:     0
```

Difficulty follows proof burden rather than entity count.

## Manual review result

```text
wrong answer keys:                  0
contradictions:                     0
one-person option fixation:         0
direct-reversal COULD shortcuts:    0
pair outcome monotony:              0
rank-bound direct-count-only cases: 0
Seating Arrangement geometry:       0
```

## QL-034 ownership decision

The ownership audit keeps `RELATION_TRUTH_STATUS` separate from frozen `RNK-QL-034`.

```text
RNK-QL-034 / DEFINITELY_TRUE_RELATION
  state contract: exactly one complete strict order
  solver reconstructs that unique order before answering

CP-005 / RELATION_TRUTH_STATUS
  state contract: at least two complete strict orders remain valid
  solver classifies a relation over the entire valid-order set
  modes: MUST / COULD / CANNOT / PAIR_STATUS
```

The overlap in wording is therefore superficial. Merging CP-005 into QL-034 would silently broaden both the frozen solver contract and answer space.

Primary Ranking-source evidence also includes incomplete comparison tables where named people remain incomparable while some conclusions are still determinable. That supports partial-order uncertainty as Ranking ownership rather than Seating Arrangement geometry.

Decision:

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

This decision **does not allocate `RNK-QL-036`**. It only resolves the merge/split question.

## Protected exclusions

- seating/facing/left-right adjacency/neighbour geometry;
- unique complete-order reconstruction already owned by CP-004;
- shared passage delivery as a standalone authority;
- arithmetic-heavy age/marks/speed/score questions;
- statement-wise sufficiency labels;
- context words such as merit, race or performance as separate QLs.

## Next gate

```text
ownership resolved
-> construct permanent English runtime for the three provisional authorities
-> validate projection, deduplication, difficulty and context balance
-> final manual English freeze approval
-> only then allocate permanent QL identities
```

## Lifecycle

```text
frozen permanent range: RNK-QL-001..035
next available QL:      RNK-QL-036
CP-005 permanent QLs:   0
English freeze:         false
ownership signoff:      PASSED_BY_AUDIT
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
