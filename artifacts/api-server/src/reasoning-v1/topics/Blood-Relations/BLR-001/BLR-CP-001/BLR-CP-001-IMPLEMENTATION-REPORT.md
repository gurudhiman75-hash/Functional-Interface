# BLR-CP-001 — Implementation Report

Status: **English discovery frozen; `BLR-QL-001..007` allocated; permanent runtime remains review-only**.

Freeze version: `BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

## Implemented foundation

- typed family graph with parent, spouse and sibling edges;
- structural validation and ancestry-cycle rejection;
- graph reconstruction from displayed clues;
- sibling inference for children sharing a modelled parent;
- bounded exact relation closure and supported-fact enumeration;
- generation-level propagation and consistency checking;
- exact maternal/paternal lineage resolution;
- common in-law closure through both spouse/sibling path orders;
- great-generation ancestor and descendant closure;
- deterministic Indian name registry and semantic fingerprints.

## Discovery inventory

Eleven exploratory prototypes were implemented and audited:

1. direct forward relation;
2. direct reverse relation;
3. two-edge composition;
4. three-edge composition;
5. identify person by relation;
6. identify ordered pair;
7. select relation claim;
8. compare generations;
9. branching relation;
10. identify person by gender;
11. exact lineage relation.

The final merge/split audit compresses them into seven solve authorities and permanent QLs:

```text
BLR-QL-001  RESOLVE_NAMED_PERSON_RELATION
BLR-QL-002  IDENTIFY_PERSON_BY_RELATION
BLR-QL-003  IDENTIFY_PERSON_BY_GENDER
BLR-QL-004  IDENTIFY_ORDERED_RELATION_PAIR
BLR-QL-005  SELECT_RELATION_CLAIM
BLR-QL-006  COMPARE_GENERATIONS
BLR-QL-007  RESOLVE_EXACT_LINEAGE_RELATION
```

## Source-gap closure

The second source pass added four recurring three-generation outputs:

- great-grandfather;
- great-grandmother;
- great-grandson;
- great-granddaughter.

They merge into `BLR-QL-001` because they preserve the named-relation task, relation-label answer domain and exact graph-solving method.

The focused 512-question gap gate proves all four relations, path length three, generation deltas `+3/-3`, balanced positions, independent-solver agreement and complete learner-facing explanations.

## Editorial implementation

An external review of the original 88-record pack scored it **8.7/10**, confirmed complete logical correctness and required learner-facing remediation.

The canonical editorial layer now supplies:

1. compact exam-authentic stems;
2. gender notation and generation rules;
3. ASCII family-tree grids;
4. explicit `ΔGen` analysis;
5. maternal/paternal branch explanation;
6. ten-second shortcuts;
7. option-specific misconception warnings.

The editorial layer changes no graph, answer key or option identity.

## Permanent runtime

`cp001-permanent-contracts.ts` allocates the seven sequential identities. `cp001-runtime.ts` wraps the reviewed generators and emits:

- `qlId` and `permanentQlId`;
- `prototypeOnly: false`;
- `reviewOnly: true`;
- `questionStudioVisible: false`;
- `mockTestEligible: false`;
- `publiclyPublishable: false`.

Prototype identity is removed from the top-level learner payload and retained only as metadata provenance.

## Executable proof surface

```text
prototype.test.ts                         400 questions
advanced-prototype.test.ts                500 questions
lineage-prototype.test.ts                 240 questions
cp001-editorial-review.test.ts            440 questions
cp001-human-audit-remediation.test.ts     440 questions
cp001-second-source-gap.test.ts           512 questions
cp001-runtime.test.ts                   1,024 questions
-------------------------------------------------------
current deterministic workflow          3,556 questions
```

The final freeze gate additionally enforces:

- exactly eleven source prototypes;
- exactly seven solve authorities;
- exactly seven sequential permanent QLs;
- complete ownership dispositions;
- all release locks;
- all four great-generation outputs;
- source-prototype reach across the permanent runtime.

## Review exports

The frozen workflow artifact contains:

- 88 remediated exploratory review records;
- 16 focused great-generation records;
- 56 permanent-Ql review records;
- balanced answer positions within each pack;
- HTML, CSV, JSONL and summary JSON outputs.

## Identity result

```text
Permanent checkpoint range:  BLR-QL-001..007
Permanent checkpoint count:  7
Next available chapter ID:    BLR-QL-008
Later checkpoint counts:      open
Final chapter total:          open
```

## Excluded from CP-001

- pointer, photograph, conversation and nested self-reference chains;
- shared family passages;
- member/gender/child/couple counts;
- possible, impossible, one-of-two and indeterminate semantics;
- coded relation decoding or construction;
- family-plus-attribute puzzles and Data Sufficiency wrappers;
- Hindi or Punjabi;
- Question Studio, Question Bank, mock-test and public release.
