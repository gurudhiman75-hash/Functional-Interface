# BLR-CP-001 — Implementation Report

Status: **human audit remediation V2 implemented and exact-head CI passed; second gap audit pending; no permanent QLs**.

## Implemented foundation

- typed family graph with parent, spouse and sibling edges;
- structural validation and ancestry-cycle rejection;
- graph reconstruction directly from displayed relation clues;
- sibling inference for children sharing a modelled parent;
- canonical relation closure through bounded kinship paths;
- supported-relation fact enumeration;
- generation-level propagation with consistency checking;
- exact maternal/paternal lineage resolution;
- brother-in-law and sister-in-law closure through both spouse/sibling path orders;
- shared deterministic culturally natural name registry;
- deterministic semantic fingerprints.

## Exploratory prototype inventory

### Initial relation-label slice

1. `BLR-CP001-PROT-DIRECT-FORWARD`;
2. `BLR-CP001-PROT-DIRECT-REVERSE`;
3. `BLR-CP001-PROT-COMPOSED-TWO-EDGE`;
4. `BLR-CP001-PROT-COMPOSED-THREE-EDGE`.

### Query-contract slice

5. `BLR-CP001-PROT-IDENTIFY-PERSON`;
6. `BLR-CP001-PROT-IDENTIFY-PAIR`;
7. `BLR-CP001-PROT-RELATION-CLAIM`;
8. `BLR-CP001-PROT-GENERATION-COMPARISON`;
9. `BLR-CP001-PROT-BRANCHING-RELATION`.

### Gender and exact-lineage slice

10. `BLR-CP001-PROT-IDENTIFY-PERSON-BY-GENDER`;
11. `BLR-CP001-PROT-EXACT-LINEAGE-RELATION`.

These remain discovery prototypes, not permanent QLs. The first merge/split audit compresses them provisionally into seven solve authorities.

## Mathematical executable proofs

### Original-slice regression

The original harness regenerates 400 questions with deterministic repeat equality, clue-only solver agreement, four unique options, one correct answer and answer positions `[100, 100, 100, 100]`.

### Query-contract proof

The advanced harness generates 500 questions with five answer contracts, graph validity, answer positions `[125, 125, 125, 125]`, Easy/Medium/Hard reach, both claim polarities, generation deltas `-2` through `2` and inferred-sibling branching.

### Gender and exact-lineage proof

The lineage harness generates 240 questions with answer positions `[60, 60, 60, 60]`, both target genders, both lineage sides, all eight exact lineage relations, ten source-natural scenarios and spouse-direction gender inference. A focused ontology proof covers brother-in-law and sister-in-law through both `spouse -> sibling` and `sibling -> spouse`.

## English editorial and human-audit remediation

The first machine editorial gate generates 440 reviewed questions across all eleven prototypes and seven provisional authorities.

The external human review scored the 88-record pack **8.7/10** and confirmed full logical correctness. It required:

- compact exam-authentic stems;
- removal of robotic filler and direct-question double phrasing;
- generation-level family-tree grids;
- explicit `ΔGen` arithmetic;
- ten-second shortcuts;
- option-specific student warnings derived from misconception labels.

The shared editorial V2 layer now upgrades every question emitted through the canonical CP-001 review/runtime registry without changing graph, answer or option identity.

A second 440-question remediation gate enforces the four teacher tiers:

1. core concept and generation mapping;
2. step-by-step ASCII family-tree solution;
3. ten-second exam shortcut;
4. common traps and distractor analysis.

## Exact-head repository CI

Final synced head:

```text
b514d02b2d4684e966ba94eccc1763252167dcbc
```

Dedicated run:

```text
30331197065 — PASS
```

Every stage passed:

```text
prototype.test.ts                         400 questions
advanced-prototype.test.ts                500 questions
lineage-prototype.test.ts                 240 questions
cp001-editorial-review.test.ts            440 questions
cp001-human-audit-remediation.test.ts     440 questions
export-cp001-review.ts                    passed
review artifact upload                    passed
-------------------------------------------------------
current deterministic workflow          2,020 questions
```

The final artifact `blr-001-cp001-english-review-remediated` contains 88 balanced records, HTML/CSV/JSONL/summary output and answer positions `[22, 22, 22, 22]`.

The unrelated integrated-admin workflow continues to stop at its existing truthful-frontend check before any BLR or Question Studio gate executes.

## Discovery decisions

The first source, merge/split and inverse audits provisionally retain seven solve authorities:

1. resolve a named-person relation;
2. identify a person by relation;
3. identify a person by gender;
4. identify an ordered relation pair;
5. select a relation claim;
6. compare generations;
7. resolve an exact paternal/maternal relation.

Direct versus reverse, path length, branching topology, true versus false wording, target gender and lineage side remain instance properties.

## Remaining work before freeze

- inspect and approve the remediated 88-record V2 pack;
- execute the second source and gap audit;
- freeze only if no new material solve authority appears;
- allocate guarded permanent sequential QLs in a later change.

## Not implemented in CP-001

- pointer, photograph, conversation or nested self-reference chains;
- shared family-set grouped runtime;
- cardinality and count semantics;
- model-space uncertainty;
- coded relations;
- Hindi or Punjabi;
- Question Studio integration;
- public publication.
