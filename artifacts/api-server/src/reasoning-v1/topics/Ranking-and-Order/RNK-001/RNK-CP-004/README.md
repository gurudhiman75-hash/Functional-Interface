# RNK-CP-004 — Multi-Entity Comparison and Explicit Order Reconstruction

Status: **exam-readiness English remodel implemented; manual approval and source expansion pending; permanent QL count open**.

This checkpoint owns questions in which several named entities must be placed in one exact order from displayed comparison clues.

Included in the first executable wave:

- highest-ranked entity;
- lowest-ranked entity;
- entity at an exact rank;
- exact rank of a named entity;
- middle entity in an odd-sized order;
- complete order from highest to lowest;
- relative order of a named pair;
- immediate higher or lower neighbour;
- validation of a transitive rank conclusion;
- the additional comparison sufficient to join ordered blocks uniquely.

## Boundary

```text
unique total order from multi-entity comparisons -> RNK-CP-004
row/queue/merit/race presentation ownership      -> RNK-CP-005
auto-generated height/age/marks vocabulary       -> RNK-CP-006
non-unique, possible, definite or impossible     -> RNK-CP-007
shared multi-question passages                   -> RNK-CP-008
```

Ties, incomparable entities and cannot-determine answers are not silently forced into CP-004. They remain reserved for later partial-order discovery unless a separate exact contract is proved.

## Executable discovery and remodel

```text
provisional prototypes:             10
runtime seeds per prototype:       240
raw runtime questions:           2,400
remodeled English review pack:      60
permanent QLs:                    none
next available RNK identity: RNK-QL-027
```

The original review pack was mathematically correct but failed exam-readiness review because of unsafe pair options, circular sufficiency explanations, repeated answer sequences, templated teaching and missing review metadata.

`RNK-CP-004-EXAM-READINESS-REMEDIATION.md` records the implemented corrections.

## Remodel guarantees

- all pair-relation options address the requested pair;
- pair and conclusion keys are not copied from displayed clues;
- conclusion keys require transitive inference;
- sufficient-comparison explanations show incomplete blocks before the added premise;
- wrong sufficiency options identify contradiction or the remaining number of valid orders;
- complete-order distractors cite a violated clue;
- clues render one per line;
- explanation rules and shortcuts vary by solve mode;
- review answer positions are balanced 15/15/15/15;
- no four-answer sequence repeats;
- stable IDs, competency, difficulty, version and lifecycle metadata are exported.

## Construction model

```text
construct a hidden strict total order
  -> derive a connected comparison chain
  -> independently topologically reconstruct the order
  -> reject cycles or non-unique exact-answer states
  -> derive the requested entity, rank, relation or order
  -> remodel options under query-homogeneity rules
  -> render solve-mode-specific teaching
  -> run pool-level answer-sequence and metadata gates
  -> expose a manual-review artifact
```

## Next gate

```text
manual review of remodeled 60-question pack
  -> source and inverse expansion
  -> ownership and boundary audit
  -> merge/split consolidation
  -> permanent runtime proof
  -> English discovery freeze
```

The current ten prototypes remain discovery evidence. They are not permanent QLs or a fixed final inventory.

## Safety boundary

```text
English manual approval:       pending
English discovery frozen:      false
permanent QL count:            open
Hindi/Punjabi:                 not started
Question Studio:               disabled
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
public publication:            false
```
