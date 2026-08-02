# BLR-001 — Blood Relations

Status: **BLR-CP-001 through BLR-CP-005 English discovery frozen; stable stacked permanent range `BLR-QL-001..025`; next available identity `BLR-QL-026`**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records;
6. manifest amendments for permanent sequential identity.

## Frozen permanent range

```text
BLR-QL-001  RESOLVE_NAMED_PERSON_RELATION
BLR-QL-002  IDENTIFY_PERSON_BY_RELATION
BLR-QL-003  IDENTIFY_PERSON_BY_GENDER
BLR-QL-004  IDENTIFY_ORDERED_RELATION_PAIR
BLR-QL-005  SELECT_RELATION_CLAIM
BLR-QL-006  COMPARE_GENERATIONS
BLR-QL-007  RESOLVE_EXACT_LINEAGE_RELATION
BLR-QL-008  RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
BLR-QL-009  SELECT_UNORDERED_FAMILY_PAIR
BLR-QL-010  IDENTIFY_ALL_MEMBERS_BY_RELATION
BLR-QL-011  IDENTIFY_MEMBER_BY_MARITAL_STATUS
BLR-QL-012  IDENTIFY_PERSON_BY_EXACT_LINEAGE
BLR-QL-013  COUNT_MEMBERS_BY_FILTER
BLR-QL-014  COUNT_RELATIVES_OF_REFERENCE
BLR-QL-015  COUNT_RELATION_PAIRS
BLR-QL-016  COUNT_GENERATIONS
BLR-QL-017  SELECT_FAMILY_COMPOSITION_PROFILE
BLR-QL-018  RESOLVE_INVARIANT_RELATION
BLR-QL-019  RESOLVE_RELATION_UNCERTAINTY
BLR-QL-020  SELECT_CLAIM_BY_MODEL_STATUS
BLR-QL-021  IDENTIFY_PERSON_BY_MODEL_STATUS
BLR-QL-022  RESOLVE_PERSON_IDENTITY_UNCERTAINTY
BLR-QL-023  DETERMINE_COUNT_BOUND
BLR-QL-024  SELECT_COUNT_BY_MODEL_STATUS
BLR-QL-025  RESOLVE_COUNT_DETERMINACY
```

Freeze versions:

```text
BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP003_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP004_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP005_ENGLISH_DISCOVERY_FREEZE_V1
```

## Checkpoint state

| Checkpoint | Ownership | State |
|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | frozen; `BLR-QL-001..007` |
| `BLR-CP-002` | pointer/photo/portrait/conversation/nested self-reference | frozen; `BLR-QL-008` |
| `BLR-CP-003` | shared family passages and set/pair/status identities | frozen; `BLR-QL-009..012` |
| `BLR-CP-004` | definite counts and family composition | frozen; `BLR-QL-013..017` |
| `BLR-CP-005` | definite/possible/impossible, one-of-two, indeterminate and count-bound semantics | frozen; `BLR-QL-018..025` |
| `BLR-CP-006` | coded relation decoding | open |
| `BLR-CP-007` | coded construction and validation | open |

## CP-003 frozen result

```text
approved English review records          298
shared-passage groups                    102
graph topologies                           9
source prototypes                         29
frozen solve authorities                   4
permanent QLs                              4
permanent range               BLR-QL-009..012
```

Shared-passage variants already owned by `BLR-QL-001..008` remain merged into their existing contracts. The unresolved-marital-status candidate is a target-status parameter inside `BLR-QL-011`, not a separate QL.

## CP-004 frozen result

```text
approved English review questions        612
shared-passage groups                    102
source graph topologies                    9
source prototypes                         13
frozen solve authorities                   5
permanent QLs                              5
permanent range               BLR-QL-013..017
```

CP-004 covers total/member-filter counts, direct and extended relative counts, shared children, canonical relation-pair counts, occupied generations and four-component family-composition profiles.

## CP-005 frozen result

```text
approved English review questions        184
shared model-space groups                 80
source scenarios                          10
model-space topologies                    10
source prototypes                         23
frozen solve authorities                   8
permanent QLs                              8
enumerated model instances               432
permanent range               BLR-QL-018..025
```

CP-005 covers:

- exact, broad and gender-neutral relations invariant across all valid models;
- one-of-two and materially indeterminate relation answers;
- definite, possible and impossible relation claims;
- definite, possible and impossible candidate people;
- one-of-two and indeterminate person identities;
- minimum and maximum possible counts;
- possible and impossible count options;
- exact versus indeterminate counts under incomplete family information.

Every retained variable domain is exhaustively enumerated. The independent verifier reconstructs and solves all 432 models from exported diagram data rather than calling the production CP-005 solver.

## Shared implemented foundation

- typed parent, spouse and sibling graph;
- family validity and ancestry-cycle rejection;
- independent clue-only and graph-closure solvers;
- deterministic seeded Indian names;
- broad, in-law, great-generation and exact-lineage closure;
- explicit marital status without closed-world unmarried inference;
- shared family passages with independently solved items;
- deterministic misconception-owned options;
- personalised learner explanations;
- native SVG family trees with ASCII fallback;
- lazy ExamTree family-tree rendering;
- explicit count universes and canonical unordered-pair counting;
- independent count recomputation from graph nodes and edges;
- complete bounded model enumeration with definite/possible/impossible classification;
- model-by-model family diagrams and independent reconstructed-graph verification.

## Authoritative freeze records

### CP-001

- `BLR-CP-001/BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP001.md`.

### CP-002

- `BLR-CP-002/BLR-CP-002-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP002.md`.

### CP-003

- `BLR-CP-003/BLR-CP-003-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-CP-003/cp003-final-discovery-freeze.ts`;
- `BLR-CP-003/cp003-permanent-contracts.ts`;
- `BLR-CP-003/cp003-permanent-runtime.ts`.

### CP-004

- `BLR-CP-004/BLR-CP-004-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP004.md`;
- `BLR-CP-004/cp004-final-freeze.ts`;
- `BLR-CP-004/cp004-model.ts`;
- `BLR-CP-004/cp004-runtime.ts`.

### CP-005

- `BLR-CP-005/BLR-CP-005-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP005.md`;
- `BLR-CP-005/cp005-final-freeze.ts`;
- `BLR-CP-005/cp005-model.ts`;
- `BLR-CP-005/cp005-independent-verifier.ts`;
- `BLR-CP-005/cp005-runtime.ts`.

## Next phase

```text
BLR-CP-006 source and boundary audit
  -> coded-relation key and chain prototypes
  -> independent decode and graph-closure proof
  -> editorial and human review
  -> merge/split and ownership audit
  -> final discovery freeze
  -> sequential allocation from BLR-QL-026
```

The final chapter QL total remains open until CP-006 and CP-007 complete exhaustive discovery.

## Release boundary

Permanent identity does not enable delivery:

- English review-only: true;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled;
- production staging: disabled;
- merge: not authorised.
