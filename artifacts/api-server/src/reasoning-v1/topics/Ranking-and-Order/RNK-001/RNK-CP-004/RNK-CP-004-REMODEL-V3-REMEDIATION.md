# RNK-CP-004 — English Remodel V3 Remediation

Status: **implemented; manual English review pending**.

Basis: `RNK-CP004-REMODEL-V2-CRITICAL-REVIEW-UPDATED(1).md`.

## Core decision

Remodel V3 preserves the validated exact-order solver but separates three different proof demands:

```text
directional comparison path
exact rank-position proof
complete-order uniqueness proof
```

A short path may prove that one entity ranks above another. It is not treated as proof of exact rank difference or immediate adjacency.

## Task ontology correction

The former pair authority had drifted from direction-only comparison into exact rank distance. V3 restores the original authority and creates a separate provisional authority:

```text
RNK-CP004-PROT-RELATIVE-ORDER-OF-PAIR
  -> infer which named entity ranks higher

RNK-CP004-PROT-EXACT-RANK-DIFFERENCE-OF-PAIR
  -> determine exact rank difference and direction
```

These remain provisional discovery authorities. No permanent QLs have been allocated.

## Explanation correction

The learner renderer now shows the few decisive construction steps rather than either:

- the long compulsory V1 proof shell; or
- the bare final-order output used too often in V2.

Eight visible modes are used:

```text
CHAIN_BUILD
POSITION_LINE
PAIR_DIRECTION
PAIR_DISTANCE
NEIGHBOUR_HIGHLIGHT
OPTION_CONTRADICTION
TRANSITIVE_PROOF
BLOCK_BRIDGE
```

Endpoint and rank questions show chain fragments before the completed order. Exact-distance questions show the full order, both ranks and subtraction. Immediate-neighbour questions explicitly begin from the completed order before identifying adjacency.

## Proof metadata

Each reviewed question now exposes separate administrator metadata:

```text
shortestDirectionalPathClues
shortestExactPositionProofClues
fullOrderProofClues
```

This replaces the ambiguous single `shortest proof` field.

## Distractor correction

- complete-order wrong options violate three different local comparisons;
- pair-direction and pair-distance options are owned separately;
- self-neighbour fillers remain forbidden;
- missing-comparison wrong options are consistent but insufficient rather than contradictory fillers;
- repeated missing-comparison failure prose is grouped in the learner explanation.

## Missing-comparison correction

The stem now asks which statement is sufficient to determine the order uniquely. It does not reveal the block-joining method.

The explanation uses neutral labels:

```text
Block 1
Block 2
```

Only after selecting the correct comparison does it state which block lies above the other.

## Structural diversity boundary

A uniquely determined total order built only from pairwise comparisons requires an adjacent-pair backbone. V3 therefore does not fake partial-order branching inside CP-004.

Within this boundary it adds controlled non-adjacent verification links and records topology as:

```text
CHAIN_BACKBONE
CHAIN_WITH_NON_ADJACENT_VERIFICATION
TWO_ORDERED_BLOCKS
```

Genuinely non-unique and partial-order topologies remain owned by CP-007.

## Executable proof

```text
provisional authorities:             11
runtime seeds per authority:        240
runtime questions:                2,640
English review questions:            66
average visible explanation words: 41.95
review adjacent-edge ratio:        0.8855
runtime questions with skip links:  1,602
normalized review duplicates:           0
repeated four-answer sequences:         0
answer positions:                16/17/17/16
```

All lifecycle locks remain active:

```text
permanent QLs:                 none
next available identity: RNK-QL-027
Question Studio:             disabled
Question Bank:             NOT_STORED
test eligibility:           INELIGIBLE
public publication:              false
Hindi/Punjabi:             NOT_STARTED
```

## Remaining gate

Remodel V3 requires manual English approval. CP-004 must then complete source/inverse expansion, ownership audit and merge/split consolidation before permanent QL allocation or English discovery freeze.
