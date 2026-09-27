# RNK-001 — Final Audit Wave 05

Date: 2026-09-26  
Status: **GENERATED-INSTANCE DIFFICULTY AUDIT CANDIDATE**

## Audit question

Does Question Studio classify the generated RNK instance, or merely inherit a static label attached to the QL/family?

## Findings

The chapter is stronger than the historical closeout implied:

- CP001 difficulty is derived from generated total size, context, rank depth and operation type.
- CP002 difficulty is derived from total size, position gap, context and mixed-end/extreme-total structure.
- CP003 difficulty is derived from actual movement distance, side conversion, interchange configuration and sequential operations.
- CP004 has a dedicated feature-based difficulty model using proof length, reversed clues, entity count, reconstruction burden and distractor competition.
- CP005 derives Medium/Hard from path length, compulsory relations, partial-order structure and witness complexity.
- CP006 derives Medium/Hard from entity count and whether a full equality chain must be reconstructed.

The remaining weak point was QL042.

### QL042 before Wave 05

The frozen CP007 production authority used a coarse mode-only label:

```text
OTHER_CATEGORY_AHEAD_FROM_TARGET_AFTER -> HARD
all other modes -> MEDIUM
```

This preserves a sensible minimum difficulty split, but does not distinguish two generated instances of the same mode when one has a harder ratio, larger population, deeper target rank or an extra after-to-ahead conversion.

## QL042 Question Studio difficulty V2

Wave 05 adds a presentation/runtime difficulty model without changing the frozen CP007 authority.

The model considers:

- historical hard source lane;
- requested-ahead-from-after reconstruction;
- whether evidence itself is given after the target;
- four-step versus five-step derivation;
- ranked population size;
- target depth;
- ratio complexity.

QL042 remains a composite form and is intentionally **not labelled Easy**.

The frozen source difficulty is retained as metadata; Question Studio exposes the generated-instance result.

## Question Studio review metadata

Current RNK payloads now expose:

```text
difficultyCalibrationStatus: GENERATED_INSTANCE_DERIVED_V2
difficultyScore
difficultyFactors
sourceDifficultyLabel
```

This makes the label auditable instead of opaque.

## Executable proof

`rnk-001-final-audit-wave-05.test.ts`:

- evaluates all 192 frozen QL042 candidate instances;
- requires meaningful Medium and Hard populations;
- proves historically Hard QL042 cases are never downgraded;
- proves direct QL042 Medium and Hard filtering;
- explicitly rejects relabelling QL042 as Easy;
- proves Easy/Medium/Hard exam-profile filtering across English, Hindi and Punjabi;
- reasserts all review-only release locks.

## Safety boundary

Unchanged:

- permanent QL allocation;
- RNK-QL-043 status;
- CP007 mathematical state;
- options and answer authority;
- permanent runtime fingerprints;
- multilingual content authority;
- Question Bank/test/mock/public release state.
