# BLR-CP-001 — Implementation Report

Status: **third executable English discovery slice implemented; no permanent QLs**.

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

These are discovery prototypes, not permanent QLs. The first merge/split audit compresses them provisionally into seven solve authorities.

## Local executable proofs

### Original-slice regression

A compiled local harness regenerated 400 questions:

- four contracts × 100 seeds;
- deterministic repeat equality;
- clue-only solver agreement;
- four unique options and one correct answer;
- answer positions `[100, 100, 100, 100]`;
- existing broad relation coverage retained.

### Query-contract proof

A separate compiled harness generated 500 questions:

- five contracts × 100 seeds;
- deterministic repeat equality;
- independent answer-key agreement;
- graph validity for every instance;
- five distinct answer shapes;
- answer positions `[125, 125, 125, 125]`;
- Easy, Medium and Hard reach;
- both `TRUE` and `FALSE` claim modes;
- generation deltas `-2`, `-1`, `0`, `1` and `2`;
- 100 branching questions proven through inferred sibling closure.

### Gender and exact-lineage proof

A third compiled harness generated 240 questions:

- two contracts × 120 seeds;
- deterministic repeat equality;
- independent solver agreement;
- answer positions `[60, 60, 60, 60]`;
- male and female target coverage;
- paternal and maternal side coverage;
- all eight exact lineage relations;
- broad grandfather, grandmother, uncle and aunt coverage;
- ten source-natural scenarios;
- 60 cases where gender was inferred from spouse direction rather than the queried person's own relation word.

A focused ontology harness also proved brother-in-law and sister-in-law through:

```text
spouse -> sibling
sibling -> spouse
```

## Repository CI

The dedicated workflow now executes:

```text
prototype.test.ts
advanced-prototype.test.ts
lineage-prototype.test.ts
```

The exact-head result must be recorded only after GitHub Actions completes on the final synced branch.

## Discovery decisions

The first source, merge/split and inverse audits provisionally retain seven solve authorities:

1. resolve a named-person relation;
2. identify a person by relation;
3. identify a person by gender;
4. identify an ordered relation pair;
5. select a relation claim;
6. compare generations;
7. resolve an exact paternal/maternal relation.

Direct versus reverse, path length, branching topology, true versus false claim wording, target gender and lineage side are instance properties. No additional inverse authority was justified by the current evidence.

## Remaining work before freeze

- exact-head combined CI;
- generated English editorial review across all provisional authorities;
- second source and gap audit;
- final discovery freeze if no new material contract appears;
- guarded permanent sequential QL allocation in a later change.

## Not implemented in CP-001

- pointer, photograph, conversation or nested self-reference chains;
- shared family-set grouped runtime;
- cardinality and count semantics;
- model-space uncertainty;
- coded relations;
- Hindi or Punjabi;
- Question Studio integration;
- public publication.
