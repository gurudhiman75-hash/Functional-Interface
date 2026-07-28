# BLR-001 — Open QL Discovery Policy

Status: **authoritative for unfinished BLR-001 checkpoints**.

No total chapter QL count and no checkpoint QL range is frozen by the end-to-end design. Permanent identities are allocated only after executable prototype discovery.

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
  -> second gap audit
  -> discovery freeze
  -> permanent sequential QL allocation
```

## Current BLR-CP-001 state

CP-001 currently has eleven executable exploratory prototype contracts and zero permanent QLs.

The prototype surface covers:

- broad named-person relation solving across direct, reverse, composed and branching paths;
- identify one person by a relation predicate;
- identify one person by a gender predicate;
- identify one ordered pair;
- select a true or false relation claim;
- compare generations;
- resolve exact paternal or maternal grandfather, grandmother, uncle and aunt relations.

The source and merge/split audits provisionally compress the eleven prototypes into seven solve authorities:

```text
RESOLVE_NAMED_PERSON_RELATION
IDENTIFY_PERSON_BY_RELATION
IDENTIFY_PERSON_BY_GENDER
IDENTIFY_ORDERED_RELATION_PAIR
SELECT_RELATION_CLAIM
COMPARE_GENERATIONS
RESOLVE_EXACT_LINEAGE_RELATION
```

This provisional inventory does **not** establish seven eventual QLs. It remains subject to the second source/gap pass.

## Current proof state

- mathematical and structural prototype gates: passed;
- machine English editorial gate across 440 questions: passed;
- external human review of the 88-record pack: completed;
- human-review result: logic fully correct, learner-facing remediation required;
- V2 stem, visual-tree, generation-arithmetic, shortcut and distractor remediation: implemented;
- 440-question human-audit remediation gate: passed;
- final synced dedicated run `30331197065` on head `b514d02b2d4684e966ba94eccc1763252167dcbc`: passed;
- remediated 88-record HTML/CSV/JSONL artifact: generated;
- second source/gap audit: pending;
- discovery freeze: not authorised.

Seven solve authorities use six answer shapes because both person-identification authorities return `PERSON_NAME` while retaining different predicates and explanation contracts.

## Current merge decisions

- direct versus reverse relation is query direction, not a separate authority;
- one-edge, two-edge, three-edge and branching paths are topology/depth properties;
- true versus false claim is requested polarity;
- male versus female is a target value;
- paternal versus maternal and grandparent versus aunt/uncle are outputs of one exact-lineage solver;
- family size, names, clue order, renderer and difficulty do not create QLs by themselves.

## Current ownership boundary

- direct declarative named-person clues remain in CP-001;
- pointer, photograph, conversation and nested self-reference forms belong to CP-002;
- shared passages belong to CP-003;
- counts and family composition belong to CP-004;
- possible, impossible and indeterminate questions belong to CP-005;
- coded relation decoding and construction belong to CP-006 and CP-007;
- family-plus-profession/height/colour puzzles and Data Sufficiency remain outside BLR-001 checkpoint ownership.

## Remaining CP-001 freeze blockers

- inspect and approve the remediated V2 review pack;
- execute the second source and gap audit;
- produce final freeze evidence showing no new materially distinct authority;
- allocate permanent sequential identities only in a guarded later change.

## Prohibited actions before freeze

- assigning `BLR-QL-*` IDs;
- declaring a final QL count;
- making the runtime Question Studio visible;
- localising unstable English contracts;
- marking any prototype publicly publishable;
- treating path length, topology, query direction, names, claim polarity or difficulty alone as separate QLs.
