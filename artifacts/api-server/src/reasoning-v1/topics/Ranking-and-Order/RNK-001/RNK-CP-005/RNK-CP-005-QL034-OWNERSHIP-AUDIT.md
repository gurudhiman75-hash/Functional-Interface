# RNK-CP-005 — QL-034 Ownership Audit

Status: **OWNERSHIP DECIDED — permanent QL allocation still prohibited**

Audit version: `RNK_CP005_QL034_OWNERSHIP_AUDIT_V1`

## Question

Should CP-005 `RELATION_TRUTH_STATUS` be absorbed into frozen `RNK-QL-034 — DEFINITELY_TRUE_RELATION`, or remain a separate provisional authority?

## Decision

```text
KEEP_SEPARATE_PROVISIONAL_AUTHORITY
```

This decision does **not** allocate `RNK-QL-036` and does not freeze CP-005 English.

## Why the surface similarity is misleading

Both families may use a stem such as “Which of the following must be true?”, but they solve different state spaces.

### Frozen QL-034

```text
checkpoint:        RNK-CP-004
QL:                RNK-QL-034
authority:         DEFINITELY_TRUE_RELATION
state contract:    exactly one complete strict order
proof contract:    TRANSITIVE_RELATION_PROOF
answer scope:      one definitely true relation
```

The CP-004 solver calls `reconstructUniqueOrder()` before solving `VALID_RANK_STATEMENT`. That routine rejects the evidence unless exactly one topological order is available.

### CP-005 relation truth status

```text
checkpoint:        RNK-CP-005
candidate:         RELATION_TRUTH_STATUS
state contract:    two or more complete strict orders remain valid
query modes:       MUST / COULD / CANNOT / PAIR_STATUS
proof basis:       quantify the relation over the whole valid-order set
```

The same pair may therefore be:

- definite — true in every valid order;
- variable — true in some valid orders and false in others;
- impossible — true in no valid order.

The learner is reasoning about **uncertainty preserved by incomplete comparison information**, not reconstructing one hidden line.

## Source evidence

Primary ranking evidence: Preeti Aggarwal and Tanvy Aggarwal, *A New Approach to Reasoning for Competitions*, Radian Book Company, First Edition 2022, Ranking chapter.

The source explicitly solves ranking questions with multiple ranking tables and marks some people as `uncomparable`. Examples in the Ranking solutions include:

- Ujjwal and Naman remaining incomparable while both are known to be senior to Jagdish and Arun; the source concludes that the most senior person cannot be determined;
- Neeraj and Abhishek remaining incomparable while Pankaj can still be established as the eldest;
- other questions where an endpoint conclusion is established by combining partial comparison tables rather than forcing every pair into one complete line.

This is direct source evidence that incomplete comparison graphs and conclusions that survive unresolved comparisons belong to **Ranking**, not automatically to Seating Arrangement or Puzzles.

A second competitive-exam reference separates linear/matrix/circular arrangement as arrangement chapters. That supports retaining the no-seat/no-facing partial-order material inside Ranking rather than moving it to Seating.

## Executable anti-duplication evidence

`rnk-cp005-ql034-ownership-audit.test.ts` checks:

```text
frozen QL-034 questions:             192
QL-034 unique-order contract:        192 / 192
CP-005 relation-status questions:     96
CP-005 multiple-valid-order contract: 96 / 96

CP-005 MUST:                         24
CP-005 COULD:                        24
CP-005 CANNOT:                       24
CP-005 PAIR_STATUS:                  24

PAIR_STATUS FIRST_ABOVE:              8
PAIR_STATUS SECOND_ABOVE:             8
PAIR_STATUS INDETERMINATE:             8
```

A silent merge into QL-034 would therefore broaden a frozen authority in two material ways:

1. from a unique-order state contract to a multi-model state contract;
2. from one definite-positive query to four truth-status/query modes.

That is not a renderer parameter or wording inverse. It changes the solver and answer semantics.

## Ownership rule after this audit

```text
RNK-QL-034
  unique complete strict order
  + definitely-true relation query
  -> stays frozen in CP-004

CP-005 RELATION_TRUTH_STATUS
  multiple valid complete orders remain
  + MUST / COULD / CANNOT / PAIR_STATUS
  -> remains a separate provisional CP-005 authority
```

No CP-004 permanent identity, runtime question, projection digest or frozen QL assignment is modified by this audit.

## CP-005 consolidation consequence

The V3 consolidation remains:

```text
RELATION_TRUTH_STATUS
POSSIBLE_RANK_BOUND
EXACT_RANK_DETERMINACY
```

So CP-005 currently has **three provisional authorities**, not seven source-form QLs.

This audit does not authorize these IDs, but if the later English freeze approves all three authorities, the next available range would be `RNK-QL-036..038`.

## Remaining gate before permanent allocation

```text
ownership audit                 PASS
V3 editorial semantic gates    PASS
manual V3 review               PASS

still required:
  permanent-runtime construction
  -> full permanent corpus validation
  -> projection/dedup/difficulty evidence
  -> final manual English freeze approval
  -> only then allocate permanent CP-005 QL identities
```

## Lifecycle

```text
frozen permanent range: RNK-QL-001..035
next available QL:      RNK-QL-036
CP-005 permanent QLs:   0
English freeze:         false
Question Studio:        DISABLED
persistence:            DISABLED
Question Bank:          NOT_STORED
test eligibility:       INELIGIBLE
public publication:     false
Hindi/Punjabi:          NOT_STARTED
```
