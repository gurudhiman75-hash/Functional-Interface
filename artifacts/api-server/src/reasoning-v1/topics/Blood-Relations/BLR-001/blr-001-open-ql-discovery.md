# BLR-001 — Open QL Discovery Policy

Status: **authoritative for unfinished BLR-001 checkpoints; CP-001 and CP-002 are frozen and allocated**.

No total chapter QL count is fixed by the end-to-end design. Each checkpoint discovers, audits and freezes its own solve identities before receiving the next continuous chapter range.

## Required sequence

```text
source and boundary audit
  -> non-permanent prototype contracts
  -> deterministic runtime proof
  -> independent-solver proof
  -> editorial saturation
  -> merge/split audit
  -> inverse-contract audit
  -> human review and remediation
  -> second source and gap confirmation
  -> discovery freeze
  -> permanent sequential QL allocation
```

A technical source-gap pass may be run before human review to expose missing runtime modes. It does not replace the required post-human confirmation. If human remediation changes stems, renderers, constraints, options, explanations or solve contracts, the affected deterministic gates and source-gap decision must be rerun before freeze.

## Frozen BLR-CP-001 state

Freeze version: `BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

```text
Exploratory prototypes:       11
Frozen solve authorities:      7
Permanent QL range:            BLR-QL-001..007
```

The seven permanent authorities are:

```text
RESOLVE_NAMED_PERSON_RELATION
IDENTIFY_PERSON_BY_RELATION
IDENTIFY_PERSON_BY_GENDER
IDENTIFY_ORDERED_RELATION_PAIR
SELECT_RELATION_CLAIM
COMPARE_GENERATIONS
RESOLVE_EXACT_LINEAGE_RELATION
```

Great-grandfather, great-grandmother, great-grandson and great-granddaughter remain outputs inside `BLR-QL-001`.

## Frozen BLR-CP-002 state

Freeze version: `BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1`

```text
Positive canonical scenarios: 45
Exploratory prototypes:         6
Frozen solve authorities:       1
Permanent QL range:             BLR-QL-008
```

The permanent authority is:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

The following are frozen instance properties, not separate identities:

- presentation and question renderer;
- one-, two- or three-anchor structure;
- direct, reverse, one-derived or both-derived endpoints;
- one- through four-step role depth;
- broad or gendered roles;
- `ONLY` and zero-cardinality constraints;
- blood or affinal output;
- relation value or `SELF`;
- names, clue wording and difficulty.

## Current ownership boundary

- CP-001: direct declarative named-person relations — frozen;
- CP-002: pointer, photograph, portrait, conversation and nested self-reference — frozen;
- CP-003: shared passages — open;
- CP-004: counts and family composition — open;
- CP-005: possible, impossible, one-of-two and indeterminate semantics — open;
- CP-006: coded relation decoding — open;
- CP-007: coded expression construction and validation — open;
- family-plus-profession/height/colour puzzles and Data Sufficiency — outside checkpoint ownership.

## Identity sequencing rule

Later BLR-001 checkpoints must not use `BLR-QL-001..008`. The next checkpoint to complete exhaustive discovery starts from `BLR-QL-009` and reserves only the exact number of solve identities justified by its own final freeze.

The final BLR-001 chapter total remains open until every checkpoint completes this process.

## Release rule

Permanent identity is not production approval. All currently frozen BLR QLs remain English review-only with Question Studio, Question Bank, mock tests, localisation and public publication disabled until separate explicit release gates pass.
