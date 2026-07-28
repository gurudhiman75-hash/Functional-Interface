# BLR-001 — Blood Relations

Status: **implementation started; BLR-CP-001 English prototype runtime active; permanent QL discovery remains open**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`
2. `../../../REASONING-V1-ARCHITECTURE.md`
3. `BLR-001-END-TO-END-DESIGN.md`
4. `blr-001-open-ql-discovery.md`
5. checkpoint-specific discovery, freeze, implementation and review records

## Current implemented slice

The first implementation slice establishes:

- a typed family graph;
- parent, spouse and sibling edges;
- family validity and ancestry-cycle rejection;
- a canonical English kinship ontology;
- exact path solving for direct, grandparent, uncle/aunt, nephew/niece, cousin and common in-law relations;
- four non-permanent BLR-CP-001 prototype contracts;
- deterministic English generation;
- misconception-derived four-option construction;
- an independent clue-only solver;
- a 400-question executable prototype audit.

## Prototype contracts

```text
BLR-CP001-PROT-DIRECT-FORWARD
BLR-CP001-PROT-DIRECT-REVERSE
BLR-CP001-PROT-COMPOSED-TWO-EDGE
BLR-CP001-PROT-COMPOSED-THREE-EDGE
```

These are discovery identities, not permanent `BLR-QL-*` identities.

## Safety boundary

- no permanent QLs;
- English only;
- no Question Studio visibility;
- no Question Bank write path;
- no mock-test eligibility;
- no public publication;
- pointer/photo, family-set, count, uncertainty and coded-relation checkpoints are not yet implemented.

## Next implementation boundary

1. saturate CP-001 source-backed task contracts;
2. add relation-claim, identity and pair-query prototypes;
3. audit merge/split and inverse ownership;
4. freeze CP-001 discovery only after no meaningful solve mode remains uncovered;
5. then allocate permanent QLs and continue with BLR-CP-002.
