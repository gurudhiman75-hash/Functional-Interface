# BLR-CP-006 — Coded Relation Decoding

Status: **English discovery frozen at `BLR-QL-026..BLR-QL-030`; review-only runtime available; release and merge locked**.

## Permanent QLs

```text
BLR-QL-026  RESOLVE_CODED_RELATION
BLR-QL-027  IDENTIFY_PERSON_FROM_CODED_GRAPH
BLR-QL-028  DETERMINE_GENDER_FROM_CODED_GRAPH
BLR-QL-029  SELECT_CODED_RELATION_PAIR
BLR-QL-030  RESOLVE_CODED_FAMILY_SET_RELATION
```

Next available Blood Relations identity: `BLR-QL-031`.

## Frozen inventory

```text
152 English review questions
19 source prototypes
17 source topologies
5 permanent solve authorities
5 permanent QLs
440 decoded statement instances
152 / 152 unique learner-item signatures
```

## Runtime contract

Every question supplies an explicit code key. The runtime:

1. replaces each token with its directed relation meaning;
2. treats every adjacent coded pair as a separate assertion;
3. constructs one connected family graph;
4. propagates full-sibling parent constraints;
5. solves the requested relation, person, gender or pair;
6. independently re-solves the exported graph;
7. renders a family-tree diagram and ASCII fallback.

Symbols are never evaluated with arithmetic precedence.

## Gender-evidence rule

A person's letter label or name is never gender evidence. Fixed gender enters the graph only through a decoded gender-bearing relation:

```text
father, mother, son, daughter,
brother, sister, husband or wife
```

All other people remain `UNKNOWN` unless another decoded statement establishes their gender.

## Files

- `cp006-model.ts` — permanent contracts, code-key domain, question and diagram types;
- `cp006-prototypes.ts` — token palettes and 19 discovered source prototypes;
- `cp006-graph.ts` — token decoder, graph closure and relation solver;
- `cp006-presentation.ts` — options, explanations and family-tree diagrams;
- `cp006-runtime.ts` — permanent generator and telemetry;
- `cp006-independent-verifier.ts` — independent graph reconstruction and answer proof;
- `cp006-runtime.test.ts` — complete 152-question runtime, evidence and replay regression;
- `cp006-final-freeze.test.ts` — source, boundary, inverse, merge/split and CP-007 ownership audit;
- `export-cp006-final-freeze.ts` — JSONL, CSV, HTML, contracts, summary and freeze exporter;
- `BLR-CP-006-FINAL-DISCOVERY-FREEZE.md` — authoritative checkpoint record.

## Boundary

CP-006 owns decoding and solving a supplied relation key.

CP-007 owns inverse coded tasks:

- choose an expression for a target relation;
- fill a missing token;
- choose a token that makes a relation true;
- identify a correct or incorrect coded statement;
- compare coded expressions;
- infer a token where kinship composition remains the tested skill.

## Release lock

Question Studio, Question Bank, mock tests, Hindi/Punjabi localisation, public publication, production staging and merge remain disabled.
