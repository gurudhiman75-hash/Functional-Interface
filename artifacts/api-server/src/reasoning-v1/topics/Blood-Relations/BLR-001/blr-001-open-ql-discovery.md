# BLR-001 — Open QL Discovery Policy

Status: **authoritative for unfinished BLR-001 checkpoints; CP-001 through CP-005 are frozen and allocated**.

No total chapter QL count is fixed. Each checkpoint discovers, audits and freezes its own solve identities before receiving the next contiguous range.

## Required sequence

```text
source and boundary audit
  -> non-permanent prototypes
  -> deterministic runtime proof
  -> independent-solver proof
  -> editorial saturation
  -> merge/split audit
  -> inverse and cross-checkpoint overlap audit
  -> human review and remediation
  -> post-review source-gap confirmation
  -> discovery freeze
  -> permanent sequential QL allocation
```

A technical source-gap pass does not replace post-review confirmation. Permanent identity does not enable delivery.

## Frozen checkpoint summary

```text
BLR-CP-001  11 exploratory prototypes -> 7 authorities -> BLR-QL-001..007
BLR-CP-002   6 exploratory prototypes -> 1 authority  -> BLR-QL-008
BLR-CP-003  29 source prototypes       -> 4 authorities -> BLR-QL-009..012
BLR-CP-004  13 source prototypes       -> 5 authorities -> BLR-QL-013..017
BLR-CP-005  23 source prototypes       -> 8 authorities -> BLR-QL-018..025
```

### CP-001

```text
RESOLVE_NAMED_PERSON_RELATION
IDENTIFY_PERSON_BY_RELATION
IDENTIFY_PERSON_BY_GENDER
IDENTIFY_ORDERED_RELATION_PAIR
SELECT_RELATION_CLAIM
COMPARE_GENERATIONS
RESOLVE_EXACT_LINEAGE_RELATION
```

### CP-002

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

### CP-003

```text
SELECT_UNORDERED_FAMILY_PAIR
IDENTIFY_ALL_MEMBERS_BY_RELATION
IDENTIFY_MEMBER_BY_MARITAL_STATUS
IDENTIFY_PERSON_BY_EXACT_LINEAGE
```

### CP-004

```text
COUNT_MEMBERS_BY_FILTER
COUNT_RELATIVES_OF_REFERENCE
COUNT_RELATION_PAIRS
COUNT_GENERATIONS
SELECT_FAMILY_COMPOSITION_PROFILE
```

### CP-005

```text
RESOLVE_INVARIANT_RELATION
RESOLVE_RELATION_UNCERTAINTY
SELECT_CLAIM_BY_MODEL_STATUS
IDENTIFY_PERSON_BY_MODEL_STATUS
RESOLVE_PERSON_IDENTITY_UNCERTAINTY
DETERMINE_COUNT_BOUND
SELECT_COUNT_BY_MODEL_STATUS
RESOLVE_COUNT_DETERMINACY
```

CP-005 answer semantics are not random “cannot be determined” distractors. Each item owns a complete finite model space. Definite means true in all models, possible means true in some but not all, and impossible means true in none. Minimum, maximum, one-of-two and indeterminate answers are derived from the same complete model set.

## Current ownership boundary

- CP-001: direct declarative named-person relations — frozen;
- CP-002: pointer, photograph, portrait, conversation and nested self-reference — frozen;
- CP-003: shared family passages — frozen;
- CP-004: definite counts and family composition — frozen;
- CP-005: possible, impossible, one-of-two, invariant and indeterminate semantics — frozen;
- CP-006: coded relation decoding — open;
- CP-007: coded expression construction and validation — open;
- family-plus-profession/height/colour puzzles and Data Sufficiency — outside checkpoint ownership.

## Identity sequencing rule

Later checkpoints must not reuse `BLR-QL-001..025`. The next checkpoint to complete exhaustive discovery begins at:

```text
BLR-QL-026
```

Only the exact number of authorities justified by the CP-006 final freeze may be allocated. The final BLR-001 chapter total remains open until CP-007 is complete.

## Release rule

All frozen BLR QLs remain English review-only with Question Studio, Question Bank, mock tests, localisation, production staging and public publication disabled until separate explicit release gates pass.
