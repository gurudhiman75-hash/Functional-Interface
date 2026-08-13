# RNK-CP-004 English Discovery Freeze V1

Status: **English discovery frozen after manual approval, source/inverse expansion, ownership audit, authority consolidation and pinned permanent-runtime proof.**

## Freeze identity

```text
checkpoint:             RNK-CP-004
freeze version:         RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
permanent runtime:      RNK_CP004_PERMANENT_RUNTIME_V1
permanent authorities:  9
questions per authority: 192
permanent questions:    1,728
permanent range:        RNK-QL-027..035
next available RNK ID:  RNK-QL-036
projection SHA-256:     39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

## Permanent authority map

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

## Consolidation decisions

Two pairs of provisional forms were consolidated because they share one answer semantic and one proof contract:

- `HIGHEST_ENTITY` and `LOWEST_ENTITY` become `ENDPOINT_ENTITY`, with endpoint direction as a parameter.
- `ENTITY_AT_EXACT_RANK` and `MIDDLE_ENTITY` become `ENTITY_AT_POSITION`, with explicit versus derived-middle position as a parameter.

The remaining seven authorities stay distinct because their answer output, proof requirement or uniqueness contract differs materially.

## Source and inverse coverage

Inverse presentation did not create new QLs. The permanent runtime includes:

```text
canonical records:                     1,488
person at rank from bottom:               48
rank of named entity from bottom:          96
complete order lowest to highest:          96
```

Highest/lowest, immediate above/below and pair-input orientation are represented through existing parameters or paired forms.

## Permanent runtime evidence

```text
Easy:       470
Medium:   1,106
Hard:       152

contexts:
selection test:          288
merit list:              288
competition standings:  288
performance review:     288
interview shortlist:    288
neutral ranking:        288

answer positions per QL: 48 / 48 / 48 / 48
normalised semantic duplicates: 0
```

The pinned digest covers permanent QL identity, authority, ordinal, source prototype, seed, inverse variant, context, difficulty, stem, options, option explanations, visible explanation, clue-role metadata and proof contract.

## Ownership boundary

```text
exact unique multi-entity comparison order        -> RNK-CP-004
row/queue/merit/race presentation-led questions   -> RNK-CP-005
height/age/marks/weight attribute-led questions   -> RNK-CP-006
possible/impossible/cannot-determine partial order -> RNK-CP-007
shared multi-question ranking sets                 -> RNK-CP-008
statement I/II sufficiency labels                  -> Data Sufficiency
```

`DEFINITELY_FALSE_RELATION` was not admitted without additional source proof. Cannot-determine, possible/impossible and minimum/maximum possible-rank forms remain excluded to RNK-CP-007.

## Lifecycle boundary

The freeze fixes English discovery identities and the permanent English runtime. It does not publish the chapter or enable downstream product surfaces.

```text
English manual approval:  approved
English discovery frozen: true
Hindi/Punjabi:            not started
Question Studio:          disabled
Question Bank:            NOT_STORED
test eligibility:         INELIGIBLE
public publication:       false
```

The next product phase is Question Studio renderer, disclosure, mobile and accessibility integration, followed later by localisation and multilingual parity proof.
