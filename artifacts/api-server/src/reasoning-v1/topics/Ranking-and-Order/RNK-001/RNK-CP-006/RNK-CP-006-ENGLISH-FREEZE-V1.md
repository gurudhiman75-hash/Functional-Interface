# RNK-CP-006 — English Freeze V1

Status: **ENGLISH FROZEN**

Freeze version: `RNK_CP006_ENGLISH_FREEZE_V1`  
Permanent runtime: `RNK_CP006_PERMANENT_RUNTIME_V1`

## Permanent authority assignments

```text
RNK-QL-039  EQUALITY_AWARE_PAIR_RELATION
RNK-QL-040  EQUALITY_AWARE_ENDPOINT
RNK-QL-041  COMPLETE_WEAK_ORDER
```

Each authority contains 192 permanent English questions, for 576 questions total.

## State contract

Every frozen CP-006 question has one uniquely determined total preorder with an explicit two-person equality class:

```text
A > B = C > D > E
```

The equality is semantic evidence, not missing information. This distinguishes CP-006 from CP-005 partial-order uncertainty.

The equality bridge is also necessary rather than decorative. In every frozen state the strict clues alone fail to connect the two sides of the tied level, while adding the equality relation completes the required inference.

## Manual freeze review

The 36-question production review pack was independently checked before allocation.

```text
questions reviewed:                 36 / 36
wrong answer keys:                       0
ambiguous correct options:               0
contradictory clue sets:                 0
decorative equality samples:             0
unstated numeric tie-rank rules:          0
Seating Arrangement leakage:             0
```

Review coverage:

```text
12 questions/authority
answer positions overall: 9 / 9 / 9 / 9
answer positions/authority: 3 / 3 / 3 / 3
pair local/full: 6 / 6
endpoint highest/lowest: 6 / 6
all five contexts in every authority
entity counts: 5, 6, 7
```

## Frozen runtime evidence

Full-runtime executable proof:

```text
questions checked:                    576
questions independently re-proved:    576
equality-essential checks:            576
complete-order distractors checked:   576
unique mathematical state keys:       576
unique learner fingerprints:          576
unique permanent fingerprints:        576
```

Questions per QL:

```text
RNK-QL-039: 192
RNK-QL-040: 192
RNK-QL-041: 192
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

All five approved contexts occur inside each QL, and each QL contains 5-, 6- and 7-entity states.

## Projection chain

Pinned reviewed production candidate:

```text
sha256:3b26204b7137910d3247af37c75934680ea34cd86b5f342b55de2012e057fd00
```

Frozen permanent runtime:

```text
sha256:7043ecd80798ed9b60529d6052f4bc6fd4e678a98d06cc3e0332a3d10028d819
```

Any future change to learner content, state, answer, explanation, authority assignment or permanent fingerprint must change the permanent projection and therefore fail the pinned freeze gate until explicitly reviewed.

## Authority boundaries

### RNK-QL-039 — EQUALITY_AWARE_PAIR_RELATION

A named pair lies on opposite sides of an explicit equality level. The learner must use equality as a bridge to establish the directional relation. It is not direct equality lookup.

CP-004 analogue: `RNK-QL-031 RELATIVE_ORDER_OF_PAIR`.

Boundary: QL031 uses a unique **strict** total order; QL039 uses a unique **weak** order containing explicit equality.

### RNK-QL-040 — EQUALITY_AWARE_ENDPOINT

The learner selects the unique highest/lowest entity only after the equality class connects what would otherwise be separate strict-comparison components.

CP-004 analogue: `RNK-QL-027 ENDPOINT_ENTITY`.

Boundary: QL027 requires a unique strict order; QL040 requires equality-aware endpoint reasoning.

### RNK-QL-041 — COMPLETE_WEAK_ORDER

The learner reconstructs the entire equality-aware order and must preserve the tied comparison class.

CP-004 analogue: `RNK-QL-030 COMPLETE_ORDER`.

Boundary: QL030 reconstructs a strict total order; QL041 reconstructs a total preorder with an explicit equality class.

## Rejected / excluded forms

`EQUAL_PAIR_IDENTIFICATION` remains rejected because it only repeats the explicit equality clue.

CP-006 does **not** define a numerical ranking convention after a tie. Questions such as “three candidates share 5th place; what rank comes next?” remain excluded unless a ranking rule is explicitly stated or a later source-backed checkpoint establishes the intended convention.

Multiple independent tie groups and larger equality classes are not silently included in this freeze. They require fresh source and editorial review if ever added.

## Lifecycle after freeze

```text
cumulative permanent RNK range: RNK-QL-001..041
next available RNK identity:     RNK-QL-042
CP-006 English frozen:           true
CP-006 permanent QLs:            3
CP-006 permanent questions:      576
Question Studio:                 DISABLED
persistence:                     DISABLED
Question Bank:                   NOT_STORED
test eligibility:                INELIGIBLE
public publication:              false
Hindi/Punjabi:                   NOT_STARTED
```

This English freeze does not authorize merge, deployment, publication, persistence, Question Studio generation, test eligibility or translation.
