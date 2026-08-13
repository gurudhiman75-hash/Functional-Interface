# RNK-CP-005 — Editorial V3 Consolidation

Status: **THREE PROVISIONAL AUTHORITIES APPROVED FOR FINAL OWNERSHIP REVIEW — NO PERMANENT QL ALLOCATED**

This record consolidates the V3 Release editorial evidence for `RNK-CP-005 — Partial Order and Ranking Uncertainty`.

It does **not** allocate `RNK-QL-036`, freeze English, register Question Studio generation, enable persistence or make questions test-eligible.

## Release evidence

```text
editorial version:       RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE
source forms:            7
questions/source form:   24
questions checked:       168
answer positions:        42 / 42 / 42 / 42
unique release states:   168
permanent QLs:           0

Easy:                     0
Medium:                 156
Hard:                    12
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

Distinct topology coverage per source form is 6–8 families, and the 28-question human pack uses four different topologies within every source form.

Exact implementation proof before this documentation pass:

```text
workflow run: 31472607624
head:         bf268249e9daf24273da2ecf081f674ea4e42642
result:       PASS

evidence artifact: 9093964523
sha256:079dc2d8df6ecd2ae4f3941ee752395c55f2f4e9f96be0f1bb6f0987abbd3b63

review artifact:   9093964870
sha256:8293fc3810c9d8d111e2c9a4ce3eb2634927fdbdf331566881eea57989b0af6b
```

A later exact-head run must also remain green after documentation/cleanup changes.

## Source-form consolidation

The seven surviving discovery forms do **not** justify seven QLs.

### Authority candidate A — `RELATION_TRUTH_STATUS`

Query modes:

```text
MUST
  Which relation must hold in every valid ranking?

COULD
  Which relation holds in at least one valid ranking?

CANNOT
  Which relation holds in no valid ranking?

PAIR_STATUS
  For a named pair: first above / second above / indeterminate
```

Discovery IDs feeding this authority:

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED   # legacy discovery ID only
```

The learner-facing name for the fourth mode is `PAIR_RELATION_STATUS`; the legacy ID is retained only for discovery compatibility.

Pair-status evidence is deliberately balanced in the 24-question corpus:

```text
FIRST_ABOVE:      8
SECOND_ABOVE:     8
INDETERMINATE:    8
```

The fourth pair distractor also varies across consecutive / exactly one / exactly two / exactly three people between, preventing one repeated option shell.

### Authority candidate B — `POSSIBLE_RANK_BOUND`

Direction modes:

```text
HIGHEST_POSSIBLE_RANK
LOWEST_POSSIBLE_RANK
```

Discovery IDs:

```text
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
```

Highest versus lowest is a direction parameter, not a separate ownership identity.

Every retained release question requires:

- at least three compulsory predecessors/successors;
- branch integration rather than one simple chain count;
- at least one compulsory relation obtained transitively rather than from a direct displayed clue;
- proof that a better boundary is impossible;
- a valid witness ranking showing the stated boundary is attainable.

### Authority candidate C — `EXACT_RANK_DETERMINACY`

Answer modes:

```text
DEFINITE_EXACT_RANK
INDETERMINATE_EXACT_RANK
```

Discovery ID:

```text
DEFINITE_RANK_OR_INDETERMINATE
```

The release corpus is balanced:

```text
definite exact rank:       12
indeterminate exact rank:  12
```

A definite exact rank must use transitive structural evidence and account for all other people. An indeterminate exact rank must be proved with two valid rankings giving different ranks.

## Semantic option contract

Generic relation questions use:

```text
options:                        4
distinct ordered pairs:         4
distinct unordered pairs:       4
minimum distinct people:        4
maximum appearances/person:     2
```

Additional gates:

```text
MUST:
  correct relation is transitive, not a direct clue
  >=2 wrong options are possible-but-not-compulsory

COULD:
  correct relation is genuinely variable
  all three wrong options are impossible only through multi-step inference
  direct reversal of a displayed clue is prohibited

CANNOT:
  correct relation is transitively impossible
  all three wrong options are possible-but-not-compulsory
```

These rules prevent both one-person fixation and semantic shortcut patterns.

## CP-004 overlap decision

`RNK-QL-034 — DEFINITELY_TRUE_RELATION` and CP-005 `MUST` can look similar on the surface, but their proof contracts differ:

```text
RNK-QL-034 / CP-004
  evidence forces one unique complete strict order
  definitely-true relation is read/derived inside that unique order

CP-005 RELATION_TRUTH_STATUS / MUST
  evidence intentionally permits multiple valid complete rankings
  the relation must hold across every valid ranking
```

Therefore the V3 implementation treats partial-order truth status as a coherent candidate authority rather than collapsing it automatically into CP-004.

**Permanent ownership is still not frozen.** Final source-backed review must decide whether this becomes a new QL or a parameterised extension of an existing authority.

## Rejected form

```text
ORDER_UNIQUENESS_STATUS
```

It remains rejected because partial-order generation makes “multiple complete rankings are possible” a near-constant conclusion, and the form overlaps strict-order uniqueness ownership without enough answer diversity.

## Human editorial review

The final 28-question V3 Release pack was manually inspected after executable validation.

Result:

```text
wrong answer keys found:          0
contradictory questions found:    0
one-person option fixation:       0
COULD direct-reversal shortcuts:  0
pair-status outcome monotony:     0
rank-bound direct-count-only:     0
Seating Arrangement geometry:     0
```

The pack is considered **editorially ready for final ownership/source review**, not permanent freeze.

## Provisional permanent shape

If source evidence and final manual approval confirm the ownership split, CP-005 is expected to require **three** permanent authorities, not seven:

```text
RELATION_TRUTH_STATUS
POSSIBLE_RANK_BOUND
EXACT_RANK_DETERMINACY
```

Do not assign permanent QL numbers yet.

## Lifecycle

```text
frozen permanent range: RNK-QL-001..035
next available QL:      RNK-QL-036
CP-005 permanent QLs:   0
English freeze:         false
manual ownership signoff: pending
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
