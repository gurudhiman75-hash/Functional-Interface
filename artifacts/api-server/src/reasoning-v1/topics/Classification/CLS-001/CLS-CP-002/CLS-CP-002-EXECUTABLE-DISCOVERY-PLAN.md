# CLS-CP-002 — Semantic Pair and Relationship Classification

Status: `SUPERSEDED_BY_FROZEN_MULTILINGUAL_RUNTIME_PROOF`

This document records the historical executable-discovery plan used before `CLS-CP-002` was frozen. The final authority is:

- `CLS-CP-002-SOURCE-SATURATION-AND-MERGE-SPLIT-AUDIT.md`
- `CLS-CP-002-FINAL-MULTILINGUAL-FREEZE.md`

Final permanent identity:

```text
QL:             CLS-QL-004
Solve contract: CP002-FIND-ODD-SEMANTIC-RELATION-PAIR
Status:         FROZEN_MULTILINGUAL_RUNTIME_PROOF
```

## 1. Source-backed task

```text
Three or four displayed pairs instantiate one relation signature R.
Exactly one displayed pair does not instantiate R.
Choose that complete pair.
```

Pair direction is part of the signature whenever the relation is directional. For example:

```text
quantity -> unit
```

is not equivalent to:

```text
unit -> quantity
```

## 2. Source evidence

The uploaded Classification references repeatedly contain:

- synonym pairs with one antonym pair;
- product/raw-material pairs with one false or reversed pair;
- quantity/unit pairs with one quantity/instrument pair;
- worker/workplace, tool/function, object/sound and part/whole relations;
- option pairs whose two members belong to one semantic class, with one pair from another class.

The approved Analogy semantic libraries provide curated facts, but CP-002 reuses only the facts. It does not inherit Analogy completion or source-to-target transfer tasks.

Volatile country/capital/state-capital/currency relations are excluded.

## 3. Temporary source controls

| Prototype | Discovery purpose |
|---|---|
| `CLS-CP002-PROT-001` | Three/four directional semantic pairs share one relation; one valid pair uses a contrasting relation |
| `CLS-CP002-PROT-002` | Three/four synonym pairs versus one antonym pair, or the inverse |
| `CLS-CP002-PROT-003` | Three/four pairs preserve direction; one pair reverses the same relation |
| `CLS-CP002-PROT-004` | Three/four registered facts share one relation; one option preserves categories but is a false pairing |
| `CLS-CP002-PROT-005` | Three/four pairs contain members of one semantic class; one pair belongs to another class |

The controls were retained as source provenance but merged into one permanent QL because they share one answer object and one solver proof.

## 4. Bounded rule universe

The final registry contains:

- stable directional semantic relations from `ANA-CP-001`;
- curated lexical relations from `ANA-CP-002`;
- supplemental recurring Classification relations;
- direct/narrow semantic class-pair relations derived from the frozen CP-001 dataset.

The independent solver enumerates this declared registry only. It does not invent free-form relations after seeing the options.

## 5. Acceptance invariant

For an accepted item:

```text
exactly one admitted relation has support on optionCount - 1 pairs
and exactly one displayed pair falls outside that relation
and no comparable admitted relation identifies a different odd pair
```

Outcomes:

```text
UNIQUE
AMBIGUOUS
NO_VALID_RULE
```

Only `UNIQUE` states are emitted.

## 6. Boundary

CP-002 owns:

- choosing the differently related pair among independent options;
- choosing a pair that breaks a shared internal semantic relation;
- direction-sensitive relation comparison.

It excludes:

- `A : B :: C : ?` completion — Analogy;
- selecting a pair having the same relation as one supplied source pair — Analogy;
- number-pair arithmetic — `CLS-CP-005`;
- letter-pair structure — `CLS-CP-006`;
- blood-relation graph inference — Blood Relations;
- unstable or obscure trivia without a governed fact library.

## 7. Final lifecycle locks

```text
Permanent QLs:                1
Frozen solve contracts:       1
Question Studio exposure:     disabled
Question Bank storage:        disabled
Test eligibility:             disabled
Public publication:           disabled
```