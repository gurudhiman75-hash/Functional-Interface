# RNK-CP-004 — Source and Ownership Audit

Status: **first English executable wave active; source saturation and manual review pending**.

## 1. Source findings

The uploaded competitive-reasoning references repeatedly use several named entities linked by comparisons and ask for:

- the highest or lowest entity;
- the middle entity;
- an exact relative order;
- the person at a requested position;
- a true comparison after combining several clues;
- whether the evidence determines a unique endpoint.

The same references also include ties, incomparable entities and answers such as cannot be determined. Those are important boundary evidence, but they are not forced into the exact-order runtime. They remain reserved for the partial-order and uncertainty checkpoint.

## 2. CP-004 ownership

CP-004 owns the structural reasoning burden of reconstructing one exact order from three or more named entities.

```text
exact unique order from comparison clues       -> RNK-CP-004
row/queue/merit/race presentation-led variants -> RNK-CP-005
height/age/marks/performance vocabulary         -> RNK-CP-006
possible/definite/impossible/non-unique orders  -> RNK-CP-007
shared multi-question ranking sets              -> RNK-CP-008
```

## 3. First executable prototypes

```text
HIGHEST_ENTITY
LOWEST_ENTITY
ENTITY_AT_EXACT_RANK
RANK_OF_NAMED_ENTITY
MIDDLE_ENTITY
COMPLETE_ORDER
RELATIVE_ORDER_OF_PAIR
IMMEDIATE_NEIGHBOUR
VALID_RANK_STATEMENT
MISSING_COMPARISON
```

The missing-comparison contract starts with two internally ordered blocks. Exactly one offered comparison must join the tail of the higher block to the head of the lower block and produce one unique total order.

## 4. Validity requirements

The independent solver rejects:

- cycles;
- duplicate entity identities;
- unknown names inside clues;
- self-comparisons;
- multiple zero-indegree choices when an exact order is required;
- a missing-comparison question with zero or multiple sufficient options;
- exact-rank or immediate-neighbour queries outside the reconstructed order.

## 5. Open dimensions

The first wave does not freeze CP-004. Later source and review audits must still assess:

- whether endpoint, exact-position and relative-order forms consolidate;
- reverse and inverse query forms;
- clue minimality versus redundant-clue exam patterns;
- valid-order and invalid-order statement contracts;
- alternative structured-text renderings;
- explanation repetition and clue density;
- ownership overlap with CP-005, CP-006 and CP-007;
- whether additional exact-order exam families are materially distinct.

No permanent QL count is allocated.
