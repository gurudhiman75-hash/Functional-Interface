# BLR-001 — Open QL Discovery Policy

Status: **all seven planned content checkpoints are discovery-frozen at `BLR-QL-001..035`; chapter-wide English gap audit passed; future QL discovery remains evidence-triggered only**.

No total chapter QL count was fixed in advance. Each checkpoint discovered, audited and froze its solve identities before receiving the next contiguous range.

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

A technical source-gap pass does not replace manual review. Permanent identity does not enable delivery.

## Frozen checkpoint summary

```text
BLR-CP-001  11 exploratory prototypes -> 7 authorities -> BLR-QL-001..007
BLR-CP-002   6 exploratory prototypes -> 1 authority  -> BLR-QL-008
BLR-CP-003  29 source prototypes       -> 4 authorities -> BLR-QL-009..012
BLR-CP-004  13 source prototypes       -> 5 authorities -> BLR-QL-013..017
BLR-CP-005  23 source prototypes       -> 8 authorities -> BLR-QL-018..025
BLR-CP-006  19 source prototypes       -> 5 authorities -> BLR-QL-026..030
BLR-CP-007  21 source prototypes       -> 5 authorities -> BLR-QL-031..035
```

Total planned content checkpoints: `7`.  
Total permanent English solve authorities: `35`.

## Permanent authority inventory

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

### CP-006

```text
RESOLVE_CODED_RELATION
IDENTIFY_PERSON_FROM_CODED_GRAPH
DETERMINE_GENDER_FROM_CODED_GRAPH
SELECT_CODED_RELATION_PAIR
RESOLVE_CODED_FAMILY_SET_RELATION
```

### CP-007

```text
SELECT_CODED_EXPRESSION
COMPLETE_MISSING_CODE_TOKEN
COMPLETE_ORDERED_CODE_TOKEN_PAIR
COMPLETE_MISSING_PERSON
SELECT_CODED_STATEMENT_BY_VALIDITY
```

## Chapter-wide audit result

The executable English gap audit covers `1,958` questions and proves:

```text
permanent QL range                         BLR-QL-001..035
solve authorities                                      35
exact cross-QL learner-surface collisions               0
normalized cross-QL template collisions                 0
learner-text failures                                   0
gender-evidence failures                                0
option-contract failures                                0
lifecycle-lock failures                                 0
ownership failures                                      0
open included source families                           0
```

Verdict: `CHAPTER_ENGLISH_GAP_FREEZE_CANDIDATE`.

## Current ownership boundary

- CP-001: direct declarative named-person relations;
- CP-002: pointer, photograph, portrait, conversation and nested self-reference;
- CP-003: shared family passages;
- CP-004: definite counts and family composition;
- CP-005: invariant, possible, impossible, one-of-two and indeterminate semantics;
- CP-006: coded relation decoding;
- CP-007: coded expression construction, completion and validation;
- family-plus-profession/height/colour puzzles and Data Sufficiency: outside BLR-001 V1 ownership.

## Future identity rule

The next technically available identity is:

```text
BLR-QL-036
```

It remains **unallocated**. There is no planned `BLR-CP-008`.

A later QL may be added only after new source evidence completes the full discovery sequence and proves a materially different generator, solver, answer, ambiguity, explanation, localisation or renderer contract. Mere changes in names, path length, relation vocabulary, symbols, difficulty or presentation do not justify a new QL.

## Next phase

```text
manual English chapter review and freeze
  -> Hindi and Punjabi localisation
  -> multilingual parity proof
  -> multilingual manual freeze
  -> Question Studio integration
```

## Release rule

All BLR QLs remain English review-only. Question Studio, Question Bank, mock tests, localisation, production staging, public publication and merge remain disabled until separate explicit gates pass.
