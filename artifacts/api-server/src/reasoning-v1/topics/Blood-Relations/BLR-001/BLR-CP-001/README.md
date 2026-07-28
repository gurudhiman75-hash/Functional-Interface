# BLR-CP-001 — Direct Named-Person Relation Chains

Status: **English executable prototype proof; discovery open; no permanent QLs**.

## Implemented prototype coverage

- direct forward relation;
- reverse of a displayed direct relation;
- two-edge composition;
- three-edge cousin composition;
- relation labels from parent, child, sibling, spouse, grandparent, uncle/aunt, nephew/niece, cousin and common in-law families.

## Runtime contract

The generator selects a valid source-backed scenario, assigns deterministic culturally natural names, renders structured clues, and proposes an intended relation. The independent solver reconstructs the family graph from the displayed clues and must agree before the question is emitted.

Every emitted prototype question has:

- four unique relation options;
- one correct answer;
- misconception-labelled distractors;
- balanced deterministic answer placement;
- an actual clue-path explanation;
- review-only metadata;
- no permanent QL identity.

## Deferred CP-001 discovery

- identify-person queries;
- identify-pair queries;
- true/false relation claims;
- broad versus exact maternal/paternal answers;
- gender and generation queries;
- multi-clue branching where the query path is not visually linear.
