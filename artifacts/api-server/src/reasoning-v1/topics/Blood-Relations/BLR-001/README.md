# BLR-001 — Blood Relations

Status: **BLR-CP-001 and BLR-CP-002 English discovery frozen; stable range `BLR-QL-001..008`**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records;
6. `BLR-001-MANIFEST-AMENDMENT-CP001.md` and `BLR-001-MANIFEST-AMENDMENT-CP002.md` for permanent identity.

## Shared implemented foundation

- typed family graph with parent, spouse and sibling edges;
- family validity and ancestry-cycle rejection;
- graph reconstruction from displayed relation clues;
- inferred sibling closure for children sharing a modelled parent;
- deterministic seeded Indian names;
- broad kinship and in-law closure;
- generation propagation and comparison;
- exact paternal/maternal lineage resolution;
- great-generation relation closure;
- blood and affinal uncle/aunt with inverse nephew/niece closure;
- broad role vocabulary for parent, child, sibling and spouse;
- union-cardinality semantics for exact `ONLY_CHILD`;
- zero-cardinality validation for negative relation facts;
- independent clue-only solvers;
- misconception-labelled four-option construction;
- four-tier learner-facing editorial layer;
- structured speaker/listener/pointed-person anchors;
- one-, two- and three-anchor dialogue contexts;
- nested role-chain reduction with formal `ONLY` checks;
- direct, reverse and both-derived query endpoints;
- pictured and derived self-identity resolution;
- semantic and possessive photograph/portrait option rendering.

## Frozen permanent range

```text
BLR-QL-001  resolve named-person relation
BLR-QL-002  identify person by relation
BLR-QL-003  identify person by gender
BLR-QL-004  identify ordered relation pair
BLR-QL-005  select relation claim
BLR-QL-006  compare generations
BLR-QL-007  resolve exact maternal/paternal relation
BLR-QL-008  resolve anchored pointer/photo/conversation role-chain relation
```

Freeze versions:

```text
BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1
BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1
```

## CP-002 freeze result

Six exploratory prototypes and forty-five canonical source scenarios were compressed into:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

Presentation context, question renderer, anchor count, direct/reverse direction, one or both derived endpoints, one- through four-step depth, broad roles, `ONLY` and `NONE` constraints, blood/affinal output, relation value, `SELF`, names and difficulty remain instance properties of `BLR-QL-008`.

## Current executable proof

```text
BLR-CP-001 frozen workflow                    3,556 questions
BLR-CP-002 technical pre-freeze proof          3,492 questions
BLR-CP-002 permanent runtime audit                900 questions
-----------------------------------------------------------
current deterministic chapter proof            7,948 questions
```

CP-002 proves five presentation contexts, three question forms, up to three anchors, one- through four-step role chains, both-derived endpoints, broad only-child cardinality, negative sibling facts, blood and affinal outputs, pictured and derived self identity, possessive photograph/portrait options and complete release locks.

## Checkpoint state

| Checkpoint | Ownership | State |
|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | frozen; `BLR-QL-001..007` |
| `BLR-CP-002` | pointer/photo/portrait/conversation/nested self-reference | frozen; `BLR-QL-008` |
| `BLR-CP-003` | shared family passages | open |
| `BLR-CP-004` | counts and family composition | open |
| `BLR-CP-005` | possible/impossible/one-of-two/indeterminate semantics | open |
| `BLR-CP-006` | coded relation decoding | open |
| `BLR-CP-007` | coded construction and validation | open |

The next available chapter identity is `BLR-QL-009`. The final chapter total remains open.

## Authoritative freeze records

### CP-001

- `BLR-CP-001/BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP001.md`;
- `BLR-CP-001/cp001-final-discovery-freeze.ts`;
- `BLR-CP-001/cp001-runtime.ts`.

### CP-002

- `BLR-CP-002/BLR-CP-002-SECOND-SOURCE-GAP-AUDIT.md`;
- `BLR-CP-002/BLR-CP-002-HUMAN-REVIEW-APPROVAL.md`;
- `BLR-CP-002/BLR-CP-002-POST-HUMAN-GAP-CONFIRMATION.md`;
- `BLR-CP-002/BLR-CP-002-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP002.md`;
- `BLR-CP-002/cp002-final-discovery-freeze.ts`;
- `BLR-CP-002/cp002-runtime.ts`.

## Release boundary

Permanent identity does not enable delivery:

- English review-only: true;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled.
