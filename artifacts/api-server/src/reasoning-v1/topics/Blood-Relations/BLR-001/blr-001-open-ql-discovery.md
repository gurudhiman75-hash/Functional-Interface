# BLR-001 — Open QL Discovery Policy

Status: **authoritative for unfinished BLR-001 checkpoints; CP-001 is frozen and allocated; CP-002 awaits human review**.

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

CP-001 completed the full sequence under:

`BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1`

```text
Exploratory prototypes:       11
Frozen solve authorities:      7
Permanent QL range:            BLR-QL-001..007
Next available chapter ID:     BLR-QL-008
Question Studio:               disabled
Question Bank/mock tests:      disabled
Public publication:            disabled
Localisation:                  not started
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

Great-grandfather, great-grandmother, great-grandson and great-granddaughter were added during the second source pass and merged into `BLR-QL-001`; they did not create a new solve authority.

## Frozen CP-001 merge decisions

- direct versus reverse relation is query direction;
- one-, two- and three-edge paths are depth/topology properties;
- linear versus branching relation is topology;
- true versus false claim is requested polarity;
- male versus female is a target value;
- maternal versus paternal and grandfather/grandmother/uncle/aunt are outputs of one exact-lineage authority;
- relation labels, family size, names, clue order, renderer and difficulty do not create identities by themselves.

Changing these decisions requires new direct source evidence, a new executable audit and a new freeze version. The existing seven identities must not be silently redefined.

## Current BLR-CP-002 state

The English technical pre-freeze pass currently records:

```text
positive canonical scenarios:       45
negative model families:              2
exploratory prototypes:               6
provisional authority recommendation: 1
CP-002 deterministic proof:       3,492
permanent CP-002 QLs:                 0
candidate next ID:            BLR-QL-008 (unclaimed)
```

The provisional authority is:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

Covered dimensions include one- to three-anchor prompts, one- through four-step chains, direct/reverse/both-derived endpoints, `ANY`/`ONLY`/`NONE` constraints, blood and affinal relations, pictured and derived self identity, and semantic or possessive photograph/portrait option rendering.

Remaining required sequence:

```text
human editorial review
  -> remediation if required
  -> affected deterministic reruns
  -> post-human source-gap confirmation
  -> formal discovery freeze
  -> allocation decision
```

`BLR-QL-008` must not be claimed before these gates pass.

## Current ownership boundary

- CP-001: direct declarative named-person relations — frozen;
- CP-002: pointer, photograph, portrait, conversation and nested self-reference — technical pre-freeze pass complete; human review pending;
- CP-003: shared passages — open;
- CP-004: counts and family composition — open;
- CP-005: possible, impossible, one-of-two and indeterminate semantics — open;
- CP-006: coded relation decoding — open;
- CP-007: coded expression construction and validation — open;
- family-plus-profession/height/colour puzzles and Data Sufficiency — outside checkpoint ownership.

## Identity sequencing rule

Later BLR-001 checkpoints must not use `BLR-QL-001..007`. The next checkpoint to complete exhaustive discovery starts from `BLR-QL-008` and reserves only the exact number of solve identities justified by its own final freeze.

The final BLR-001 chapter total remains open until every checkpoint completes this process.

## Release rule

Permanent identity is not production approval. A frozen QL may remain English review-only with all delivery surfaces disabled. Question Studio, Question Bank, mock tests, localisation and public publication require separate explicit gates.
