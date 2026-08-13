# RNK-CP-003 — Final English Discovery Freeze

Status: **frozen**.  
Freeze version: `RNK_CP003_ENGLISH_DISCOVERY_FREEZE_V1`.

## Frozen inventory

```text
discovery prototypes:             13
discovery runtime questions:   3,120
approved English questions:       78
permanent authorities:              9
permanent runtime questions:    1,728
open source dimensions:             0
permanent range:          RNK-QL-018..026
cumulative range:         RNK-QL-001..026
next available ID:        RNK-QL-027
```

## Permanent authorities

```text
RNK-QL-018  INTERCHANGE_RANKS_DIRECT_OR_INVERSE
RNK-QL-019  TOTAL_FROM_INTERCHANGE_RANK_CHANGE
RNK-QL-020  OWN_RANK_BEFORE_OR_AFTER_SINGLE_MOVEMENT
RNK-QL-021  PEOPLE_PASSED_FROM_RANK_CHANGE
RNK-QL-022  TARGET_RANK_AFTER_INSERTION
RNK-QL-023  TARGET_RANK_AFTER_REMOVAL
RNK-QL-024  OWN_RANK_AFTER_SEQUENTIAL_MOVES
RNK-QL-025  TARGET_RANK_EFFECT_OF_ANOTHER_PERSON_MOVE
RNK-QL-026  OWN_RANK_WITH_MOVEMENT_AND_MEMBERSHIP_CHANGE
```

## Merge and split decisions

- direct and inverse interchange merge;
- direct and inverse single movement merge;
- insertion and removal remain separate;
- direct and inverse target effects from another person’s movement merge;
- direct and inverse movement-plus-membership questions merge;
- context, requested end, operation order, movement direction and membership side remain generated parameters.

## Frozen projection

```text
sha256:6457a50fdde7673f9e66fe607a47a5c38a4c921489ed387b72c87ef8a22947d5
```

The freeze gate reconstructs all 78 approved records and fails if any stem, option, misconception explanation, answer, difficulty, teaching field or mathematical fingerprint changes.

## Permanent runtime proof

Nine authorities generate 192 deterministic seeds each:

```text
9 x 192 = 1,728 permanent English review questions
```

The runtime proves every authority, every merged prototype variant, all four answer positions, all four contexts, all three difficulty levels and all release locks.

## Release boundary

```text
English discovery frozen:       true
English review-only:             true
Hindi/Punjabi:                  not started
Question Studio:                disabled
Question Bank:                  NOT_STORED
test eligibility:               INELIGIBLE
public publication:             false
```

This freeze allocates stable identities only. It does not merge the PR or activate learner delivery.
