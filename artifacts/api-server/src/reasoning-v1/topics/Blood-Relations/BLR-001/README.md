# BLR-001 — Blood Relations

Status: **BLR-CP-001 English discovery frozen and permanently allocated; later checkpoints remain open**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records;
6. `BLR-001-MANIFEST-AMENDMENT-CP001.md` for permanent CP-001 identity.

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
- independent clue-only solvers;
- misconception-labelled four-option construction;
- four-tier learner-facing editorial layer.

## Frozen BLR-CP-001 range

```text
BLR-QL-001  resolve named-person relation
BLR-QL-002  identify person by relation
BLR-QL-003  identify person by gender
BLR-QL-004  identify ordered relation pair
BLR-QL-005  select relation claim
BLR-QL-006  compare generations
BLR-QL-007  resolve exact maternal/paternal relation
```

Freeze version: `BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

Eleven exploratory prototypes were compressed into seven permanent solve identities. Direction, depth, topology, claim polarity, target gender, lineage side, relation output, names and difficulty remain instance properties.

## Current executable gate

```text
mathematical prototype gates            1,140 questions
machine editorial gate                    440 questions
human-remediation gate                    440 questions
second source-gap gate                    512 questions
permanent runtime gate                  1,024 questions
-------------------------------------------------------
current deterministic workflow          3,556 questions
```

The workflow also enforces the final prototype/authority/ownership/identity freeze and exports exploratory, source-gap and permanent review packs.

## Checkpoint state

| Checkpoint | Ownership | State |
|---|---|---|
| `BLR-CP-001` | direct declarative named-person relations | frozen; `BLR-QL-001..007` |
| `BLR-CP-002` | pointer/photo/conversation/nested self-reference | open |
| `BLR-CP-003` | shared family passages | open |
| `BLR-CP-004` | counts and family composition | open |
| `BLR-CP-005` | possible/impossible/one-of-two/indeterminate semantics | open |
| `BLR-CP-006` | coded relation decoding | open |
| `BLR-CP-007` | coded construction and validation | open |

The next available chapter identity is `BLR-QL-008`. The final chapter total remains open.

## CP-001 authoritative records

- `BLR-CP-001/BLR-CP-001-SOURCE-SATURATION-AUDIT.md`;
- `BLR-CP-001/BLR-CP-001-MERGE-SPLIT-AUDIT-V1.md`;
- `BLR-CP-001/BLR-CP-001-HUMAN-AUDIT-REMEDIATION-V2.md`;
- `BLR-CP-001/BLR-CP-001-SECOND-SOURCE-GAP-AUDIT.md`;
- `BLR-CP-001/BLR-CP-001-FINAL-DISCOVERY-FREEZE.md`;
- `BLR-001-MANIFEST-AMENDMENT-CP001.md`.

## Release boundary

CP-001 permanent identity does not enable delivery:

- English review-only: true;
- Question Studio: disabled;
- Question Bank: disabled;
- mock-test eligibility: disabled;
- Hindi and Punjabi: not started;
- public publication: disabled.

The next implementation boundary is BLR-CP-002 on the stable shared family-graph foundation.
