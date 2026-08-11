# RNK-CP-005 — Partial-Order Discovery Status

Status: **EDITORIAL V3 RELEASE REVIEW PASSED — NOT FROZEN**

## Purpose

This record tracks the executable discovery and editorial maturation of `PARTIAL_ORDER_AND_RANKING_UNCERTAINTY` after the ownership audit rejected presentation-led shared sets and Seating Arrangement overlap.

No permanent identity is allocated here.

## Current identity

```text
checkpoint:             RNK-CP-005
raw discovery version:  RNK_CP005_PARTIAL_ORDER_DISCOVERY_V1
release version:        RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE
next available QL:      RNK-QL-036
permanent QLs:          0
permanent runtime:      none
Question Studio:        disabled
```

## Raw executable wave

```text
provisional prototypes:        8
questions/prototype:          32
raw questions:               256
valid orders/question:       >=2
answer positions:     64 / 64 / 64 / 64
unique fingerprints:         256
```

## V3 Release editorial evidence

Seven source forms survive:

```text
DEFINITELY_TRUE_RELATION
POSSIBLE_RELATION
IMPOSSIBLE_RELATION
PAIR_RELATION_CANNOT_BE_DETERMINED   # legacy discovery ID; learner form PAIR_RELATION_STATUS
MINIMUM_POSSIBLE_RANK
MAXIMUM_POSSIBLE_RANK
DEFINITE_RANK_OR_INDETERMINATE
```

One remains rejected:

```text
ORDER_UNIQUENESS_STATUS
```

Release corpus:

```text
questions/source form:        24
questions checked:           168
answer positions:     42 / 42 / 42 / 42
unique release states:       168
provisional authorities:       3

Easy:                          0
Medium:                      156
Hard:                         12
```

Eight graph families are represented, with 6–8 distinct families per source form.

## Consolidation

The seven source forms collapse to three provisional authorities:

```text
RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST / LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE / INDETERMINATE
```

`PAIR_RELATION_CANNOT_BE_DETERMINED` is now only a legacy discovery ID. Its actual answer contract includes first-above, second-above and indeterminate outcomes, so it does not justify a standalone authority.

See `RNK-CP-005-EDITORIAL-V3-CONSOLIDATION.md`.

## Quality protections

V3 Release enforces:

- no person appears in more than two of four generic relation options;
- four distinct relation pairs per generic relation question;
- MUST distractors include at least two possible-but-not-compulsory relations;
- COULD distractors cannot merely reverse a displayed clue and require multi-step contradiction;
- CANNOT distractors are possible-but-not-compulsory;
- pair-status answers are balanced `8/8/8` across first-above, second-above and indeterminate;
- rank bounds require at least three compulsory people, branch integration and a transitively derived compulsory relation;
- bound explanations prove both the limit and attainability;
- definite exact ranks require transitive structural evidence;
- indeterminate exact ranks use two valid witness rankings;
- eight graph families prevent repeated diamond-only presentation;
- difficulty is based on proof burden;
- raw permutation counts, ambiguous rank wording and Seating Arrangement geometry are prohibited.

## Human review

Final 28-question release pack:

```text
questions:                        28
answer positions:          7 / 7 / 7 / 7
four graph topologies/source:    yes
wrong answer keys found:           0
contradictory questions found:     0
```

Manual editorial review passed. Final source-backed ownership approval remains pending.

## Evidence

Implementation proof before the final documentation pass:

```text
workflow run: 31472607624
head:         bf268249e9daf24273da2ecf081f674ea4e42642
result:       PASS

evidence artifact: 9093964523
review artifact:   9093964870
```

A final exact-head workflow after documentation/cleanup must also remain green.

## Remaining decision before `RNK-QL-036`

1. confirm exam-source frequency for the three proposed authorities;
2. resolve permanent ownership of `RELATION_TRUTH_STATUS-MUST` against CP-004 `RNK-QL-034`;
3. manually approve the final English ownership map;
4. only then assign permanent QL IDs and build permanent runtime.

## Lifecycle

```text
English freeze:          false
final ownership signoff: pending
permanent QL:            none
Question Studio:         DISABLED
persistence:             DISABLED
Question Bank:           NOT_STORED
test eligibility:        INELIGIBLE
public publication:      false
Hindi/Punjabi:           NOT_STARTED
```
