# RNK-CP-004 — Multi-Entity Comparison and Explicit Order Reconstruction

Status: **English discovery frozen at `RNK-QL-027..035`; Question Studio integration, localisation and publication remain disabled.**

This checkpoint owns strict multi-entity comparison questions in which one exact total order is reconstructed or made unique by one additional comparison.

## Frozen English authorities

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

The historical compatibility prototype `VALID_RANK_STATEMENT` maps to the permanent `DEFINITELY_TRUE_RELATION` authority.

## Freeze identity

```text
manual English approval:   USER_APPROVED_2026_08_07
freeze version:             RNK_CP004_ENGLISH_DISCOVERY_FREEZE_V1
permanent runtime version:  RNK_CP004_PERMANENT_RUNTIME_V1
permanent authorities:      9
questions per authority:    192
permanent questions:        1,728
permanent range:            RNK-QL-027..035
next available RNK ID:      RNK-QL-036
projection SHA-256:         39c35edb20d0452ccec4018a1166cefa5f8c445d92c968c601e59158aed4a97f
```

## Consolidation decisions

The 11 reviewed source forms consolidate to nine permanent authorities:

- highest and lowest merge into `ENDPOINT_ENTITY`; endpoint direction is a query parameter;
- exact-rank and middle-person forms merge into `ENTITY_AT_POSITION`; explicit versus derived-middle position is a parameter;
- named rank, complete order, pair direction, exact distance, immediate neighbour, definitely-true relation and missing comparison remain distinct because their answer or proof contracts differ.

## Source and inverse expansion

Inverse wording is represented inside existing authorities rather than creating duplicate QLs.

```text
canonical permanent records:                  1,488
person at a rank from bottom:                    48
rank of a named entity from bottom:              96
complete order from lowest to highest:            96
```

Highest/lowest, immediate above/below and pair-input orientation are covered by existing parameters or paired source forms.

## Boundary

```text
strict unique multi-entity order                  -> RNK-CP-004
row/queue/merit/race presentation-led forms       -> RNK-CP-005
height/age/marks/weight attribute-led forms       -> RNK-CP-006
possible/impossible/cannot-determine partial order -> RNK-CP-007
shared multi-question ranking sets                 -> RNK-CP-008
statement I/II sufficiency labels                  -> Data Sufficiency
```

Ties, genuine uncertainty and possible-order questions are not forced into CP-004.

## Approved English evidence

The approved V7 discovery wave validated:

```text
review questions:                             132
review evidence per provisional form:          12
mixed review batches:                          12
contexts:                    22 in each of 6 families
runtime difficulty:        838 Easy / 1,595 Medium / 207 Hard
answer positions:                     33 / 33 / 33 / 33
unique four-answer windows:                   129
repeated four-answer windows:                   0
normalised semantic duplicates:                 0
```

V7 corrected grammar, distractor counts, distance wording, pair-option semantics, learner-help alignment, difficulty inflation and explanation/stem repetition before manual approval.

## Permanent runtime evidence

```text
permanent questions: 1,728
Easy:                  470
Medium:              1,106
Hard:                  152

contexts:
SELECTION_TEST            288
MERIT_LIST                288
COMPETITION_STANDINGS     288
PERFORMANCE_REVIEW        288
INTERVIEW_SHORTLIST       288
NEUTRAL_RANKING           288

answer positions per QL: 48 / 48 / 48 / 48
normalised semantic duplicates: 0
```

The projection digest covers permanent identity, source prototype, seed, inverse variant, context, difficulty, complete learner surface, clue-role metadata and proof contract.

## Learner explanation model

```text
DIRECT
SEGMENT_BUILDING
FULL_POSITIONAL
```

The learner view uses the smallest sufficient proof. Optional distractor teaching remains behind a native collapsed component, while graph proof and clue-role metadata remain admin-only.

## Next product phase

```text
Question Studio renderer and native disclosure integration
  -> mobile and accessibility validation
  -> Hindi/Punjabi localisation
  -> multilingual parity proof and manual approval
  -> Question Bank and test eligibility decisions
```

## Safety boundary

```text
English manual approval:       approved
English discovery frozen:      true
permanent QL count:            9
Hindi/Punjabi:                 not started
Question Studio:               disabled
Question Bank:                 NOT_STORED
test eligibility:              INELIGIBLE
public publication:            false
```

`RNK-CP-004-ENGLISH-DISCOVERY-FREEZE-V1.md` records the full freeze contract.
