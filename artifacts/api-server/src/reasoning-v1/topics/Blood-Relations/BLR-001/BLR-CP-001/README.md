# BLR-CP-001 — Direct Named-Person Relations

Status: **three English executable discovery slices; machine editorial gate passed; human review pending; no permanent QLs**.

## Implemented prototype coverage

### Slice 1 — relation-label solving

- direct forward relation;
- reverse of a displayed relation;
- two-edge and three-edge composition;
- parent, child, sibling, spouse, grandparent, grandchild, uncle/aunt, nephew/niece, cousin and common in-law relation labels.

### Slice 2 — query and answer-shape expansion

- identify the unique person having a requested relation;
- identify an ordered person pair having a requested relation;
- select a true or false relation claim;
- compare two people's generation positions;
- solve non-linear cousin branches using inferred sibling closure.

### Slice 3 — gender, lineage and ontology closure

- identify the unique male or female among offered people using displayed relation evidence;
- solve exact paternal and maternal grandfather, grandmother, uncle and aunt relations;
- distinguish lineage only when the connecting parent's gender is established;
- support brother-in-law and sister-in-law through both `spouse -> sibling` and `sibling -> spouse` paths.

The checkpoint currently contains eleven non-permanent exploratory prototype contracts. The merge/split audit provisionally compresses them into seven solve authorities; neither number is a permanent QL count.

## Provisional solve authorities

```text
RESOLVE_NAMED_PERSON_RELATION
IDENTIFY_PERSON_BY_RELATION
IDENTIFY_PERSON_BY_GENDER
IDENTIFY_ORDERED_RELATION_PAIR
SELECT_RELATION_CLAIM
COMPARE_GENERATIONS
RESOLVE_EXACT_LINEAGE_RELATION
```

Direct/reverse direction, path length, linear/branching topology, claim polarity, target gender and maternal/paternal value remain generated-instance properties.

## Runtime contract

The generator constructs or selects a valid structured family, assigns deterministic culturally natural names, derives a query and constructs four options. An independent solver reconstructs the family graph from the displayed clues and must agree before a question is emitted.

The shared runtime includes:

- graph construction from relation clues;
- ancestry-cycle and structural validation;
- inferred sibling closure for children sharing a modelled parent;
- supported-relation enumeration;
- generation-level propagation;
- exact maternal/paternal lineage resolution;
- typed answer keys for relation, person, pair, claim, generation and exact-lineage answers;
- misconception-labelled option construction;
- deterministic semantic fingerprints.

## Executable audit surface

Repository CI runs:

```text
prototype.test.ts                4 contracts × 100 seeds = 400 questions
advanced-prototype.test.ts       5 contracts × 100 seeds = 500 questions
lineage-prototype.test.ts        2 contracts × 120 seeds = 240 questions
cp001-editorial-review.test.ts  11 contracts ×  40 seeds = 440 questions
------------------------------------------------------------------------
current workflow generation                               1,580 questions
```

The mathematical gates check determinism, family validity, independent-solver agreement, four unique options, exactly one correct answer, answer-position balance, relation breadth, claim polarity, generation deltas from -2 through +2, inferred-sibling branching, both genders, both lineage sides and all eight exact lineage relations.

The editorial gate additionally checks all seven provisional authorities, six answer shapes, learner-text cleanliness, explanation completeness, wrong-option labels, balanced answer positions and stem diversity.

## English review pack

The workflow exports 88 balanced review records:

```text
11 prototypes × 8 seeds
answer positions: 22 / 22 / 22 / 22
```

It produces HTML, CSV, JSONL and summary JSON artifacts with full learner text, options, error labels, normalised clues, query trace and runtime metadata.

## Discovery records

Read next:

1. `BLR-CP-001-SOURCE-SATURATION-AUDIT.md`;
2. `BLR-CP-001-MERGE-SPLIT-AUDIT-V1.md`;
3. `BLR-CP-001-IMPLEMENTATION-REPORT.md`;
4. `BLR-CP-001-ENGLISH-EDITORIAL-READINESS.md`.

## Remaining freeze blockers

- human review of the 88-record English pack;
- any required wording or distractor remediation;
- a second source and gap pass after editorial review;
- final freeze record and guarded sequential QL allocation.

Great-grandparent labels remain excluded unless stronger recurring standalone source evidence appears. Pointer, photograph, conversation and nested self-reference forms belong to CP-002 rather than CP-001.

## Safety boundary

- permanent `BLR-QL-*` IDs: **0**;
- English prototype only;
- Question Studio disabled;
- Question Bank and mock-test eligibility disabled;
- public publication disabled.
