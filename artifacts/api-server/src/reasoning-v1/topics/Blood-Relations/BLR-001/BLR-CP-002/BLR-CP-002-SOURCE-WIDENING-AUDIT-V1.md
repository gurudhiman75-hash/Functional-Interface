# BLR-CP-002 — Source Widening Audit V1

Status: **affinal widening passed; no new solve authority; discovery remains open**.

## Purpose

The first 14 scenarios concentrated on blood relations, direction reversal, nested endpoints, conversation anchors and self identity. This widening pass tested whether common affinal pointer questions require a new solver or merely additional relation paths inside the existing authority.

## Added source-backed scenarios

Nine focused scenario families prove:

- mother-in-law from `this woman's daughter's brother is my husband`;
- daughter-in-law as the reverse endpoint query;
- father-in-law from the corresponding father branch;
- sister-in-law as the only daughter of the speaker's husband's father;
- brother-in-law as the speaker's husband's brother;
- aunt as the wife of the speaker's mother's brother;
- niece as the inverse of that affinal-aunt path;
- uncle as the husband of the speaker's father's sister;
- nephew as the inverse of that affinal-uncle path.

## Shared ontology extension

The existing relation closure already supported:

```text
CHILD>SPOUSE                 father/mother-in-law
SPOUSE>PARENT                son/daughter-in-law
SPOUSE>SIBLING               brother/sister-in-law
SIBLING>SPOUSE               brother/sister-in-law
```

The source pass exposed the missing broad affinal uncle/aunt pair:

```text
SPOUSE>SIBLING>CHILD         uncle/aunt
PARENT>SIBLING>SPOUSE        nephew/niece
```

These paths were added to the shared ontology. They do not create a new QL because the query, answer and solver contracts are unchanged.

## Deterministic proof

```text
9 scenarios × 64 seeds = 576 questions
```

Every case verifies:

- family graph validity;
- unique anchor and role-chain resolution;
- displayed assertion truth;
- formal only-daughter cardinality where present;
- expected affinal answer;
- direct/inverse path agreement;
- zero permanent QL allocation.

Covered outputs:

```text
MOTHER_IN_LAW
DAUGHTER_IN_LAW
FATHER_IN_LAW
SISTER_IN_LAW
BROTHER_IN_LAW
AUNT
NIECE
UNCLE
NEPHEW
```

## Regression result

The complete frozen BLR-CP-001 workflow passed unchanged after the ontology extension. Therefore the new paths widen relation output while preserving all seven permanent CP-001 authorities and their release contract.

## Merge/split conclusion

No new CP-002 authority appeared. The added scenarios continue to use:

```text
RESOLVE_ANCHORED_ROLE_CHAIN_RELATION
```

Affinal versus blood relation is an instance property.

## Remaining blocker: exact only child

The source material repeatedly uses `only child`, but the current CP-002 role-step vocabulary is gendered (`son` and `daughter`). Exact `ONLY_CHILD` requires union-cardinality semantics across male and female children.

This gap is explicitly open. It must be implemented as a broad role rather than simulated with `only son` or `only daughter`.

## Current state after widening

```text
source scenarios proved:       23
exploratory prototypes:         5
provisional solve authorities:  1
permanent CP-002 QLs:           0
next available ID:              BLR-QL-008 (unclaimed)
```
