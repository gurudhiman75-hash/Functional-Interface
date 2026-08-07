# RNK-CP-004 — Multi-Entity Comparison and Explicit Order Reconstruction

Status: **targeted SSC/banking English Remodel V7 implemented; manual approval, renderer integration and consolidation pending; permanent QL count open**.

This checkpoint owns strict multi-entity comparison questions in which one exact total order is reconstructed or made unique by one additional comparison.

## Provisional authorities

```text
HIGHEST_ENTITY
LOWEST_ENTITY
ENTITY_AT_EXACT_RANK
RANK_OF_NAMED_ENTITY
MIDDLE_ENTITY
COMPLETE_ORDER
RELATIVE_ORDER_OF_PAIR
EXACT_RANK_DIFFERENCE_OF_PAIR
IMMEDIATE_NEIGHBOUR
DEFINITELY_TRUE_RELATION
MISSING_COMPARISON
```

The compatibility prototype for `DEFINITELY_TRUE_RELATION` remains `VALID_RANK_STATEMENT` until consolidation.

## Boundary

```text
strict unique multi-entity order              -> RNK-CP-004
row/queue/merit/race presentation ownership   -> RNK-CP-005
height/age/marks attribute ownership          -> RNK-CP-006
partial order, possible or cannot determine   -> RNK-CP-007
shared multi-question passages                -> RNK-CP-008
```

Ties and genuine uncertainty are not forced into CP-004.

## Remodel V7 executable wave

```text
provisional authorities:             11
runtime seeds per authority:        240
runtime questions:                2,640
English review pack:                132
review evidence per authority:       12
mixed review batches:                12
permanent QLs:                     none
next available RNK identity:  RNK-QL-027
```

## Surface and option corrections

V7 guarantees:

- correct singular/plural rendering;
- exactly three distractors in every four-option question;
- natural `place/places above` distance wording;
- option-specific highest/lowest feedback;
- compact mock-mode missing-comparison help;
- learner-help alignment with every remapped pair option;
- at least three stem variants and three explanation-shell variants per authority.

`RELATIVE_ORDER_OF_PAIR` is direction-only and uses:

```text
correct direction
reverse direction
same-rank contradiction
cannot-determine contradiction
```

`EXACT_RANK_DIFFERENCE_OF_PAIR` remains separate and tests correct distance/direction, reversed direction, people-between and inclusive-count errors.

## Difficulty contract

V7 uses:

```text
RNK_CP004_DIFFICULTY_V3
```

The shortest answer proof and actual task burden dominate. Entity count contributes only a small scanning load.

```text
runtime: 838 Easy / 1,595 Medium / 207 Hard
review:   17 Easy /   100 Medium /  15 Hard
```

Five-person middle questions are Easy. Named-rank and ordinary immediate-neighbour chains are capped at Medium. Exact distance is Hard only when size, reversed wording and confirmatory evidence combine.

## Expanded structural evidence

The 132-question review pack contains:

```text
12 distinct structural fingerprints per authority
22 records in each of 6 context families
confirmatory counts 0, 1 and 2
12 mixed-authority batches
```

Fingerprints normalise names to solved-order positions and include clue shape, query shape, confirmatory count and option roles.

Answer-position authority:

```text
A/B/C/D: 33/33/33/33
unique four-answer windows: 129
repeated four-answer windows: 0
semantic duplicates: 0
```

## Learner explanation model

```text
DIRECT
SEGMENT_BUILDING
FULL_POSITIONAL
```

The learner view shows the smallest sufficient proof. Optional distractor teaching remains behind a native collapsed component. Admin proof metadata remains separate.

## Current executable evidence

```text
runtime questions:                          2,640
review questions:                             132
average visible explanation words:          45.28
average words including optional help:       87.73
answer positions:                       33/33/33/33
```

`RNK-CP-004-REMODEL-V7-REMEDIATION.md` records the complete correction set.

## Next gate

```text
manual review of Remodel V7 English pack
  -> source and inverse expansion
  -> ownership and boundary audit
  -> merge/split consolidation
  -> permanent runtime proof
  -> English discovery freeze
  -> Question Studio renderer/mobile/accessibility validation
```

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
