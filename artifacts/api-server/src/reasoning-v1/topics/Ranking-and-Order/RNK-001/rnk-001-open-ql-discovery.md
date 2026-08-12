# RNK-001 — Open QL Discovery Register

Status: **CP-001 through CP-006 frozen at `RNK-QL-001..041`; post-CP006 audit found no new authority; `RNK-QL-042` remains available.**

Counts in this register are evidence, never chapter-size quotas.

## 1. Frozen RNK-CP-001

```text
13 prototypes / 3,120 discovery
54 approved English review questions
9 frozen authorities
RNK-QL-001..009
```

## 2. Frozen RNK-CP-002

```text
13 prototypes / 3,120 discovery
48 approved English review questions
8 frozen authorities
1,536 permanent questions
RNK-QL-010..017
projection: sha256:e1853b8864453ebcdbe88aa6f3ca5fedf9f7b7140c28a3b5ad5da8a0c4855430
```

## 3. Frozen RNK-CP-003

```text
13 prototypes / 3,120 discovery
78 approved English review questions
9 frozen authorities
1,728 permanent questions
RNK-QL-018..026
projection: sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

## 4. Frozen RNK-CP-004

```text
11 source forms
132 approved English review questions
9 frozen authorities
1,728 permanent questions
RNK-QL-027..035
projection: sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

Frozen authorities:

```text
RNK-QL-027  ENDPOINT_ENTITY
RNK-QL-028  ENTITY_AT_POSITION
RNK-QL-029  RANK_OF_NAMED_ENTITY
RNK-QL-030  COMPLETE_ORDER
RNK-QL-031  RELATIVE_ORDER_OF_PAIR
RNK-QL-032  EXACT_RANK_DIFFERENCE_OF_PAIR
RNK-QL-033  IMMEDIATE_NEIGHBOUR
RNK-QL-034  DEFINITELY_TRUE_RELATION
RNK-QL-035  MISSING_COMPARISON
```

CP-004 owns comparison evidence that forces one unique complete strict order.

## 5. Book-to-QL reset

`RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md` established these protected boundaries:

- ordinary rank arithmetic, two-position relations, interchange/movement and unique strict comparison ranking were already covered by CP-001..004;
- left/right placement, facing and neighbour geometry belong to Seating Arrangement;
- shared passages/caselets are delivery infrastructure;
- context words do not create QLs;
- arithmetic-heavy marks/age/speed/score questions belong to Quant;
- incomplete strict comparisons with multiple valid complete rankings remain Ranking ownership;
- explicit equality/tied comparison evidence remains Ranking ownership when the reasoning burden is order comparison rather than arithmetic.

## 6. Frozen RNK-CP-005 — Partial Order and Ranking Uncertainty

```text
raw prototypes:                 8
raw questions:                256
V3 release source forms:        7
V3 checked questions:         168
consolidated authorities:       3
final manual review pack:      36
permanent questions:          576
questions/authority:          192
```

Permanent authorities:

```text
RNK-QL-036  RELATION_TRUTH_STATUS
RNK-QL-037  POSSIBLE_RANK_BOUND
RNK-QL-038  EXACT_RANK_DETERMINACY
```

Candidate projection:

```text
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
```

Frozen permanent projection:

```text
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
```

`RNK-QL-036..038` are no longer open discovery identities.

## 7. Frozen RNK-CP-006 — Equality-Aware Ranking

### Source and discovery evidence

Primary ranking-source evidence supports explicit equality relations such as equal height, equal score and equal speed, while separately distinguishing incomparable pairs.

Raw source forms:

```text
EQUAL_PAIR_IDENTIFICATION
PAIR_RELATION_WITH_EQUALITY
ENDPOINT_ENTITY_WITH_INTERNAL_TIE
COMPLETE_WEAK_ORDER
```

Rejected:

```text
EQUAL_PAIR_IDENTIFICATION
```

Reason: direct equality-clue lookup rather than a meaningful solve contract.

The surviving forms were remodeled so the equality statement is a required bridge rather than decorative evidence.

### Permanent authorities

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

State contract:

```text
ONE_UNIQUE_TOTAL_PREORDER_WITH_EXPLICIT_EQUALITY
```

This is distinct from CP-004's unique strict total order and CP-005's multiple-valid-order uncertainty state.

### Permanent runtime evidence

```text
RNK-QL-039: 192
RNK-QL-040: 192
RNK-QL-041: 192
Total:      576
```

Answer-position balance per QL:

```text
48 / 48 / 48 / 48
```

Mode counts:

```text
PAIR_LOCAL_BRIDGE:    96
PAIR_FULL_CHAIN:      96
ENDPOINT_HIGHEST:     96
ENDPOINT_LOWEST:      96
COMPLETE_WEAK_ORDER: 192
```

Difficulty:

```text
Easy:       0
Medium:   416
Hard:     160
```

Every QL contains all five approved contexts and 5-, 6- and 7-entity states.

### Freeze proof

Manual final review:

```text
questions independently reviewed: 36 / 36
wrong answer keys:                  0
ambiguous correct options:          0
decorative equality samples:        0
unstated numeric tie-rank rules:     0
```

Full-runtime executable proof:

```text
questions independently re-proved: 576
equality-essential checks:         576
complete-order distractors checked:576
unique mathematical state keys:    576
unique learner fingerprints:       576
unique permanent fingerprints:     576
```

Pinned production candidate projection:

```text
sha256:3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00
```

Frozen permanent projection:

```text
sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

See `RNK-CP-006/RNK-CP-006-ENGLISH-FREEZE-V1.md`.

`RNK-QL-039..041` are therefore no longer open discovery identities.

### Still excluded from CP-006 freeze

A numerical rank after a tie is not defined. Competition/dense/fractional ranking conventions are not inferred from equality alone.

Multiple independent tie groups and equality classes larger than two people remain future source-backed discovery only.

## 8. Post-CP006 gap audit

Fresh audit record:

`RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`

Decision:

```text
NO_NEW_QL_JUSTIFIED_YET
```

### RNK-CP-007

**Closed / unallocated.** Do not start question generation simply because `RNK-QL-042` is available.

Held/redirected candidates:

```text
numeric post-tie rank convention      HOLD
multiple independent tie groups       HOLD
tie class size >= 3                    HOLD
advanced mixed transformations        HOLD
shared ranking caselets                INFRASTRUCTURE
ranking + blood/family inference       OTHER CHAPTER / MIXED PUZZLE
```

### RNK-CP-008

Reserved. Shared passages/linked-question assembly remain infrastructure rather than authority identities.

### Object-pool remediation

The audit found a presentation-diversity weakness rather than a mathematical-coverage weakness. A future-facing shared object pool now provides at least 96 EN/HI/PA people, 20 neutral groups, 18 settings, 6 ranking domains and multilingual relation templates with deterministic seeded selection.

It is not imported into frozen projection paths.

## 9. Protected exclusions

```text
lexicographic/dictionary position              -> Word and Dictionary Order
seating adjacency/facing/geometry              -> Seating Arrangement
multi-attribute assignment                     -> Logic Puzzles
league/tournament scoring                      -> Games and Tournament
statement I/II sufficiency                     -> Data Sufficiency
alphabet position without ranked group         -> Alphabet Test
age/speed/marks arithmetic as main burden      -> Quant
family/gender inference as main burden         -> Blood Relations / Mixed Puzzle
```

## 10. Lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available RNK ID:      RNK-QL-042
post-CP006 gap decision:    NO_NEW_QL_JUSTIFIED_YET
CP-007:                     CLOSED / UNALLOCATED
CP-005 English freeze:      true
CP-006 English freeze:      true
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

No merge, deployment, publication, persistence or Question Studio enablement is authorized by this audit.
