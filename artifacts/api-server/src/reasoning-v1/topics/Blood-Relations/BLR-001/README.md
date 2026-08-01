# BLR-001 — Blood Relations

Status: **BLR-CP-001 through BLR-CP-004 English discovery frozen; stable permanent range `BLR-QL-001..017`; next available identity `BLR-QL-018`**.

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
```

Freeze versions:

```text
BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP003_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP004_ENGLISH_DISCOVERY_FREEZE_V1
```

## Checkpoint state

| Checkpoint | Ownership | State |
|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | frozen; `BLR-QL-001..007` |
| `BLR-CP-002` | pointer/photo/portrait/conversation/nested self-reference | frozen; `BLR-QL-008` |
| `BLR-CP-003` | shared family passages and set/pair/status identities | frozen; `BLR-QL-009..012` |
| `BLR-CP-004` | definite counts and family composition | frozen; `BLR-QL-013..017` |
| `BLR-CP-005` | possible/impossible/one-of-two/indeterminate semantics | open |
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

CP-004 covers:

- total, gender, marital-status and generation-row member counts;
- direct, extended, blood and affinal relative counts;
- children shared by a named couple;
- marriage, sibling, parent-child and cousin pair counts;
- occupied generation count;
- four-component family-composition profiles.

Minimum, maximum, possible and indeterminate count semantics are delegated to CP-005.

## Shared implemented foundation

- typed parent, spouse and sibling graph;
- family validity and ancestry-cycle rejection;
- independent clue-only and graph-closure solvers;
- deterministic seeded Indian names;
- broad, in-law, great-generation and exact-lineage closure;
- explicit marital status without closed-world unmarried inference;
- shared family passages with independently solved items;
- deterministic misconception-owned options;
- personalised four-tier learner explanations;
- native SVG family trees with ASCII fallback;
- lazy ExamTree family-tree rendering;
- explicit count universes and canonical unordered-pair counting;
- independent count recomputation from graph nodes and edges.

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

## Next phase

```text
BLR-CP-005 source and boundary audit
  -> bounded-model uncertainty prototypes
  -> deterministic and independent model proof
  -> editorial and human review
  -> merge/split and inverse audit
  -> final discovery freeze
  -> sequential allocation from BLR-QL-018
```

The final chapter QL total remains open until CP-005 through CP-007 complete exhaustive discovery.

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
