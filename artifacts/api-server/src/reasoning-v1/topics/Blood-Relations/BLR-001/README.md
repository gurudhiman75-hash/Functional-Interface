# BLR-001 — Blood Relations

Status: **BLR-CP-001 English open discovery active; three executable slices; permanent QL discovery remains open**.

Student-facing chapter: **Blood Relations**  
Reasoning V1 package: `BLR-001`  
Canonical root: `artifacts/api-server/src/reasoning-v1/topics/Blood-Relations/BLR-001/`

## Authority order

1. `../../../REASONING-V1-MASTER-BLUEPRINT.md`;
2. `../../../REASONING-V1-ARCHITECTURE.md`;
3. `BLR-001-END-TO-END-DESIGN.md`;
4. `blr-001-open-ql-discovery.md`;
5. checkpoint-specific source, merge/split, freeze, implementation and review records.

## Current implemented foundation

- typed family graph with parent, spouse and sibling edges;
- family validity and ancestry-cycle rejection;
- graph reconstruction from displayed relation clues;
- inferred sibling closure for children sharing a modelled parent;
- deterministic seeded names and generation;
- broad kinship closure including brother-in-law and sister-in-law;
- generation comparison;
- exact paternal/maternal lineage resolution;
- independent clue-only solvers;
- misconception-labelled four-option construction.

## BLR-CP-001 discovery surface

Eleven non-permanent exploratory prototypes currently prove:

- direct, reverse, composed and branching relation-label questions;
- identify-person and ordered-pair questions;
- true/false relation-claim questions;
- generation comparison;
- identify-person-by-gender questions;
- exact paternal/maternal grandfather, grandmother, uncle and aunt questions.

The first merge/split audit provisionally compresses these into seven solve authorities. This is not a freeze and does not establish a final QL count.

## Current executable gate

```text
initial relation-label slice       400 questions
advanced query-contract slice      500 questions
gender and exact-lineage slice     240 questions
------------------------------------------------
combined current audit           1,140 questions
```

The workflow validates deterministic reproduction, graph validity, independent-solver agreement, four unique options, one correct answer, balanced answer placement, explanation completeness, relation breadth, claim polarity, generation deltas, inferred-sibling branching, both genders, both lineage sides and all eight exact lineage relations.

## Discovery records

- `BLR-CP-001/BLR-CP-001-SOURCE-SATURATION-AUDIT.md`;
- `BLR-CP-001/BLR-CP-001-MERGE-SPLIT-AUDIT-V1.md`;
- `BLR-CP-001/BLR-CP-001-IMPLEMENTATION-REPORT.md`.

## Safety boundary

- permanent `BLR-QL-*` identities: **0**;
- English prototype only;
- no Question Studio visibility;
- no Question Bank write path;
- no mock-test eligibility;
- no public publication.

Pointer/photo/conversation relations, shared family passages, counts, uncertainty and coded-relation checkpoints remain unimplemented and retain their provisional CP-002 through CP-007 ownership.

## Next boundary

1. run exact-head combined CP-001 CI;
2. export and review English samples across the seven provisional solve authorities;
3. perform the second source and gap audit;
4. freeze CP-001 only if no materially distinct solve contract remains uncovered;
5. allocate permanent sequential QLs in a guarded later change;
6. begin CP-002 on the stable shared graph foundation.
