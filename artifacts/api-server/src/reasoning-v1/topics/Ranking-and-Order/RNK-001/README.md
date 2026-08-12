# RNK-001 — Ranking and Order

Status: **CP-001 through CP-006 English frozen at `RNK-QL-001..041`; post-CP006 gap audit found no new QL justified; `RNK-QL-042` remains available.**

Student-facing chapter: **Ranking and Order**  
Reasoning V1 package: `RNK-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Ranking-and-Order/RNK-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `RNK-001-END-TO-END-DESIGN.md`;
4. `rnk-001-open-ql-discovery.md`;
5. `RNK-001-BOOK-TO-QL-AUDIT-2026-08-08.md`;
6. `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`;
7. checkpoint-specific consolidation/freeze records.

The original end-to-end checkpoint map was provisional. The post-CP006 audit is authoritative where implementation evidence supersedes that early roadmap.

## Checkpoint map

| Checkpoint | Ownership | State |
|---|---|---|
| `RNK-CP-001` | one-person rank arithmetic, side counts, totals, exact-middle inverses | frozen `RNK-QL-001..009` |
| `RNK-CP-002` | two-person positions, separation, comparison, mixed-end totals | frozen `RNK-QL-010..017` |
| `RNK-CP-003` | interchange, movement, overtaking, insertion/removal | frozen `RNK-QL-018..026` |
| `RNK-CP-004` | unique multi-entity strict-order reasoning | frozen `RNK-QL-027..035` |
| `RNK-CP-005` | partial order / ranking uncertainty | frozen `RNK-QL-036..038` |
| `RNK-CP-006` | equality-aware / tied comparison ranking | frozen `RNK-QL-039..041` |
| `RNK-CP-007` | no non-overlapping source-backed authority found | **closed/unallocated after fresh gap audit** |
| `RNK-CP-008` | reserved | shared-set assembly is infrastructure, not QL ownership |

## Frozen inventory

```text
RNK-QL-001..009   CP-001 one-person rank arithmetic
RNK-QL-010..017   CP-002 two-position/separation/mixed-end constraints
RNK-QL-018..026   CP-003 movement/interchange/membership transformations
RNK-QL-027..035   CP-004 unique strict multi-entity order reasoning
RNK-QL-036..038   CP-005 partial-order ranking uncertainty
RNK-QL-039..041   CP-006 equality-aware weak-order reasoning
```

### CP-004 frozen authorities

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

### CP-005 frozen authorities

```text
RNK-QL-036  RELATION_TRUTH_STATUS
RNK-QL-037  POSSIBLE_RANK_BOUND
RNK-QL-038  EXACT_RANK_DETERMINACY
```

### CP-006 frozen authorities

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

Next available RNK identity: **`RNK-QL-042`**. It is intentionally unallocated.

## Protected ownership boundaries

- rank arithmetic and side counts → CP-001;
- two-person rank/separation relations → CP-002;
- interchange, movement, insertion/removal → CP-003;
- comparison evidence forcing one unique complete **strict** order → CP-004;
- incomplete strict-comparison evidence with two or more valid complete rankings → CP-005;
- explicit equality producing one unique **weak** order / total preorder → CP-006;
- left/right placement, facing, adjacency and seat neighbours → Seating Arrangement;
- shared passages/caselets → delivery infrastructure, not a QL;
- arithmetic-heavy marks/age/speed/score → relevant Quant chapter;
- family/gender inference mixed into a ranking context → Blood Relations or a controlled mixed-puzzle layer.

## CP-004 freeze summary

```text
frozen authorities:     9
permanent runtime:  1,728
projection:
sha256:39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

CP-004 requires one unique complete strict order.

## CP-005 freeze summary

CP-005 retains two or more valid strict total rankings and reasons across the valid-order set.

```text
frozen authorities:     3
permanent runtime:    576
questions/authority:  192
answer positions/QL: 48 / 48 / 48 / 48
candidate projection:
sha256:c45517d1d8bf4283d38eb4b62d1c9e2f90c5ec58593e2c400a59b2a26fb6e71e
permanent projection:
sha256:f6759445937626e6777f322f9b8217bc7aaa12f6a96ee180a24ca3350bd42717
```

## CP-006 freeze summary

CP-006 owns explicit equality inside ranking comparisons. Every frozen state determines one unique total preorder such as:

```text
A > B = C > D > E
```

The equality is not decorative: removing it breaks the inference path needed by the question.

Discovery/editorial path:

```text
raw discovery forms:        4
rejected direct-lookup form: EQUAL_PAIR_IDENTIFICATION
surviving authorities:      3
manual freeze pack:        36
permanent runtime:        576
questions/authority:      192
```

Permanent assignments and modes:

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
  PAIR_LOCAL_BRIDGE / PAIR_FULL_CHAIN

RNK-QL-040  EQUALITY_AWARE_ENDPOINT
  ENDPOINT_HIGHEST / ENDPOINT_LOWEST

RNK-QL-041  COMPLETE_WEAK_ORDER
  COMPLETE_WEAK_ORDER
```

Runtime evidence:

```text
answer positions/QL:                       48 / 48 / 48 / 48
questions independently re-proved:                      576
equality-essential checks:                              576
complete-order distractors checked:                     576
unique mathematical state keys:                         576
unique learner fingerprints:                            576
unique permanent fingerprints:                          576
contexts/QL:                                               5
entity counts/QL:                                       5,6,7
```

Difficulty:

```text
Easy:       0
Medium:   416
Hard:     160
```

Projection chain:

```text
reviewed candidate:
sha256:3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00

frozen permanent:
sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

See `RNK-CP-006/RNK-CP-006-ENGLISH-FREEZE-V1.md`.

### CP-004 versus CP-006

```text
CP-004
  one unique strict total order
  no equality class

CP-006
  one unique total preorder / weak order
  explicit equality class is required evidence
```

The similar endpoint/pair/complete-order stem shapes therefore remain separate QLs because their state contracts differ.

### Numeric rank after a tie remains excluded

CP-006 does not silently assume competition, dense or fractional ranking. Numerical post-tie questions remain excluded unless their convention is explicitly stated or a future source-backed checkpoint establishes the rule.

## Post-CP006 gap audit

The fresh source/ownership audit found no remaining Ranking family that currently meets the threshold for a new permanent authority.

Held or redirected candidates:

```text
numeric post-tie ranking convention   HOLD — source does not define one universal rule
multiple independent equality groups  HOLD — no distinct source-backed exam contract yet
tie class size >= 3                    HOLD — later CP006 expansion only if evidenced
shared ranking caselets                INFRASTRUCTURE
ranking + family/gender inference      BLOOD RELATIONS / MIXED PUZZLE
advanced mixed transformations         HOLD — no non-overlapping authority evidenced
```

Therefore `RNK-QL-042` remains unused and CP007 question generation is not authorized by this audit.

See `RNK-001-POST-CP006-CHAPTER-GAP-AUDIT-2026-08-12.md`.

## Object-pool V2

The audit found a separate infrastructure weakness: frozen question mathematics is strong, but several historical checkpoints use small local name pools. CP006 was frozen from a 14-name English pool.

A future-facing shared object registry now exists at:

```text
foundation/rnk-object-pool-v2.ts
```

It deliberately does **not** feed CP004/005/006 frozen projection paths.

Current V2 targets:

```text
people:           >= 96, gender-balanced, EN/HI/PA
neutral groups:   >= 20
settings:         >= 18
semantic domains: 6
selection:        deterministic seeded API
```

Frozen compatibility remains mandatory: introducing or expanding the shared pool must not change the CP004, CP005 or CP006 pinned hashes.

## Proof summary

```text
CP-001: 9 frozen authorities  / RNK-QL-001..009
CP-002: 8 frozen authorities  / RNK-QL-010..017
CP-003: 9 frozen authorities  / RNK-QL-018..026
CP-004: 9 frozen authorities  / RNK-QL-027..035 / 1,728 permanent
CP-005: 3 frozen authorities  / RNK-QL-036..038 /   576 permanent
CP-006: 3 frozen authorities  / RNK-QL-039..041 /   576 permanent
```

Cumulative frozen authority count: **41**.

## Current lifecycle

```text
cumulative permanent range: RNK-QL-001..041
next available ID:          RNK-QL-042
CP-001 frozen:              true
CP-002 frozen:              true
CP-003 frozen:              true
CP-004 frozen:              true
CP-005 English frozen:      true
CP-006 English frozen:      true
post-CP006 gap audit:       NO_NEW_QL_JUSTIFIED_YET
CP-007 generation:          CLOSED / UNALLOCATED
chapter-wide final freeze:  false
Hindi/Punjabi:              NOT_STARTED
Question Studio:            DISABLED
persistence:                DISABLED
Question Bank:              NOT_STORED
test eligibility:           INELIGIBLE
public publication:         false
```

This audit and object-pool expansion do not authorize merge, deployment, publication, Question Studio generation, persistence or translation.
