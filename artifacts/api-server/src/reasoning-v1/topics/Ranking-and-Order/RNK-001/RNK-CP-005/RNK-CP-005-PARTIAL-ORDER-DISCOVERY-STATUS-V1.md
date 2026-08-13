# RNK-CP-005 — Partial-Order Discovery Status

Status: **EDITORIAL V3 RELEASE PASSED — QL-034 OWNERSHIP AUDIT PASSED — NOT FROZEN**

## Purpose

This record tracks executable discovery and editorial maturation of `PARTIAL_ORDER_AND_RANKING_UNCERTAINTY` after the book-to-QL audit rejected presentation-led shared sets and Seating Arrangement overlap.

No permanent identity is allocated here.

## Current identity

```text
checkpoint:             RNK-CP-005
raw discovery version:  RNK_CP005_PARTIAL_ORDER_DISCOVERY_V1
release version:        RNK_CP005_PARTIAL_ORDER_EDITORIAL_V3_RELEASE
ownership audit:        RNK_CP005_QL034_OWNERSHIP_AUDIT_V1
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

Rejected: `ORDER_UNIQUENESS_STATUS`.

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

```text
RELATION_TRUTH_STATUS
  MUST / COULD / CANNOT / PAIR_STATUS

POSSIBLE_RANK_BOUND
  HIGHEST / LOWEST

EXACT_RANK_DETERMINACY
  DEFINITE / INDETERMINATE
```

The seven discovery forms therefore remain three provisional authorities.

## QL-034 ownership audit

Decision:

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

The executable distinction is:

```text
RNK-QL-034 / CP-004
  exactly one complete strict order
  192/192 frozen QL-034 records satisfy unique-order reconstruction

CP-005 RELATION_TRUTH_STATUS
  at least two valid complete strict orders
  96/96 V3 relation records preserve multiple valid orders
  modes: MUST / COULD / CANNOT / PAIR_STATUS
```

A merge would broaden a frozen QL's state contract and answer semantics, so CP-005 truth status remains separate provisionally.

Primary Ranking-source evidence contains incomplete comparison tables with explicitly incomparable people while other conclusions remain determinable. That is source support for partial-order uncertainty within Ranking.

See `RNK-CP-005-QL034-OWNERSHIP-AUDIT.md`.

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

```text
questions:                        28
answer positions:          7 / 7 / 7 / 7
four graph topologies/source:    yes
wrong answer keys found:           0
contradictory questions found:     0
```

Manual editorial review passed.

## V3 evidence

```text
workflow run: 31473422220
head:         c4fcb1a53b310aae9e4c24e55d3fa3b4f895a15a
result:       PASS

evidence artifact: 9094288269
review artifact:   9094288765
```

The ownership branch must also pass exact-head CI before this audit is considered executable evidence.

## Remaining work before permanent QLs

```text
ownership map: resolved
editorial review: passed

next:
  permanent English runtime construction
  -> full corpus / projection / dedup / difficulty / context validation
  -> final manual English freeze approval
  -> permanent identity allocation
```

If all three provisional authorities pass final freeze, `RNK-QL-036..038` is the contiguous available range. It is **not allocated yet**.

## Lifecycle

```text
English freeze:          false
ownership audit:         passed
permanent QL:            none
Question Studio:         DISABLED
persistence:             DISABLED
Question Bank:           NOT_STORED
test eligibility:        INELIGIBLE
public publication:      false
Hindi/Punjabi:           NOT_STARTED
```
