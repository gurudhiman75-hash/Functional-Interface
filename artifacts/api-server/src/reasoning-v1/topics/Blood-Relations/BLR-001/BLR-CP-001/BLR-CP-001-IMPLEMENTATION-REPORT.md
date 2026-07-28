# BLR-CP-001 — Implementation Report

Status: **second executable English discovery slice implemented; no permanent QLs**.

## Implemented foundation

- typed family graph with parent, spouse and sibling edges;
- structural validation and ancestry-cycle rejection;
- graph reconstruction directly from displayed relation clues;
- sibling inference for children sharing a modelled parent;
- canonical exact relation closure through three meaningful kinship steps;
- supported-relation fact enumeration;
- generation-level propagation with consistency checking;
- shared deterministic culturally natural name registry;
- deterministic semantic fingerprints.

## Prototype inventory

### Initial relation-label slice

1. `BLR-CP001-PROT-DIRECT-FORWARD`;
2. `BLR-CP001-PROT-DIRECT-REVERSE`;
3. `BLR-CP001-PROT-COMPOSED-TWO-EDGE`;
4. `BLR-CP001-PROT-COMPOSED-THREE-EDGE`.

### Second query-contract slice

5. `BLR-CP001-PROT-IDENTIFY-PERSON`;
6. `BLR-CP001-PROT-IDENTIFY-PAIR`;
7. `BLR-CP001-PROT-RELATION-CLAIM`;
8. `BLR-CP001-PROT-GENERATION-COMPARISON`;
9. `BLR-CP001-PROT-BRANCHING-RELATION`.

These are discovery prototypes, not permanent QLs. Path length, names, difficulty and claim polarity remain instance properties.

## Executed before repository write

A strict standalone TypeScript compile was executed for the modified foundation, the original slice and the new slice.

### Original-slice regression

A compiled local harness regenerated 400 questions:

- four contracts × 100 seeds;
- deterministic repeat equality;
- clue-only solver agreement;
- four unique options and one correct answer;
- answer positions `[100, 100, 100, 100]`;
- all 19 previously observed relation labels retained.

### Second-slice proof

A separate compiled local harness generated 500 questions:

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

## Repository CI

The dedicated workflow now executes both:

```text
prototype.test.ts
advanced-prototype.test.ts
```

The updated workflow result remains pending until GitHub Actions completes on the latest head. The previously published initial-slice run passed, but that older result is not treated as proof of the newly modified branch.

## Discovery decisions not yet frozen

- identity and ordered-pair contracts remain separate prototypes because their answer types differ;
- true and false claim polarity remains one prototype until source and merge/split review says otherwise;
- generation comparison is separate because it uses level propagation rather than a kinship label;
- branching relation remains a provisional contract so the audit can decide whether it is a distinct QL or merely a topology of composed relation solving;
- no total CP-001 QL count is asserted.

## Not yet implemented

- permanent QL allocation or discovery freeze;
- gender-only task contracts;
- exact maternal/paternal relation ontology;
- pointer and photograph chains;
- family-set grouped runtime;
- cardinality and count semantics;
- model-space uncertainty;
- coded relations;
- Hindi or Punjabi;
- Question Studio integration;
- public publication.
