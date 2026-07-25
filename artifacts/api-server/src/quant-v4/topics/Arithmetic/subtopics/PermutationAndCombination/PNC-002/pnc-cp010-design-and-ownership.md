# PNC-CP-010 Design and Ownership

## Canonical problem

`PNC-CP-010 — Circular Arrangements & Rotational Symmetry`

## Positive ownership

CP-010 owns arrangements whose primary state space is circular and whose count depends on one or more of:

- rotational equivalence around a round table;
- a fixed reference person used to remove rotational duplication;
- circular together/apart and multi-block restrictions;
- circular adjacency, opposite-seat, neighbour and directed clockwise conditions;
- exact, minimum or maximum clockwise separation;
- prescribed clockwise relative order;
- alternation or circular gap placement;
- bounded recovery from a circular count;
- ornament systems where rotation-only or rotation-plus-reflection equivalence is stated explicitly;
- choosing an unrestricted proper subset of distinct objects and then applying a circular equivalence rule;
- seatings identified by each person's unordered pair of neighbours, which merges reversed cycles.

## Negative boundaries

CP-010 does not own:

- unrestricted linear arrangements — CP-002;
- linear blocks — CP-007;
- linear positions, gaps or alternation — CP-008;
- conditional or category-restricted selection alone — CP-009;
- grouping and distribution — CP-011;
- named-member, category, quota or other conditional selection followed by circular arrangement — CP-012;
- repeated-colour Burnside/Pólya systems — CP-012 unless independently justified;
- repeated-object word or multiset authority — CP-005.

Round-table seating, rotation-only displays, reflection-equivalent rings and neighbour-set equivalence are separate semantic contracts. They may share factorial divisors, but they retain distinct ownership, evidence, explanations and distractor semantics.

## Need-based QL admission

The first runtime checkpoint admitted `PNC-QL-177` through `PNC-QL-203` after the initial circular ownership audit.

The second saturation audit admitted:

- `PNC-QL-204`: a specified circular group must not all occupy consecutive seats;
- `PNC-QL-205`: exactly one of two disjoint specified pairs must be adjacent.

The final source-backed audit admitted:

- `PNC-QL-206`: choose `r` of `n` distinct objects and arrange the chosen objects circularly, with rotations identical and reflections different;
- `PNC-QL-207`: choose `r` of `n` distinct objects for a reversible ring, with rotations and reflections identical;
- `PNC-QL-208`: count round-table arrangements by distinct unordered neighbour sets, identifying reversed cycles.

The active range is `PNC-QL-177` through `PNC-QL-208`, containing 32 QLs. These are discovered regression snapshots, not predetermined quotas. Noun substitutions, changed sizes and equivalent wording are rejected when they do not alter formula authority, evidence, independent verification, explanation or distractor semantics.

## Current solve contracts

The saturated checkpoint contains 25 contracts:

1. distinct round-table arrangements;
2. one specified circular block together;
3. circular block complement, including a larger specified group not entirely consecutive;
4. multiple circular blocks together;
5. one required block with a disjoint pair apart;
6. two formed circular blocks not adjacent;
7. at least one of two pairs together;
8. neither of two pairs together;
9. exactly one of two pairs together;
10. one person between two named neighbours;
11. a specified opposite pair;
12. directed immediate clockwise adjacency;
13. exact clockwise gap;
14. minimum clockwise gap;
15. maximum clockwise gap;
16. prescribed clockwise relative order;
17. equal-category circular alternation;
18. circular non-adjacency through gap placement;
19. bounded circular inverse recovery;
20. rotation-only ornament arrangements;
21. distinct ornaments under rotation and reflection;
22. a specified adjacent pair under rotation and reflection;
23. unrestricted subset selection followed by rotation-only circular arrangement;
24. unrestricted subset selection followed by rotation-plus-reflection ring arrangement;
25. round-table arrangements identified by unordered neighbour sets.

`PNC-QL-204` reuses the circular-block-complement solver because its answer demand and evidence contract are the same complement authority. QLs 205–208 each add a distinct solve contract because their event, equivalence, explanation and misconception models differ materially.

## Proof model

Production formulas use exact factorial, combination, product, division and complement arithmetic.

Independent verification uses:

- reference-fixed exhaustive circular permutations for seating restrictions;
- direct predicate evaluation for adjacency, separation, alternation and pair-event logic;
- bounded search over independently enumerated counts for inverse modes;
- exhaustive proper-subset enumeration followed by reference-fixed circular orders for choose-then-circle modes;
- canonical comparison with reversed cycles for reflection-equivalent rings and neighbour-set seatings.

For `PNC-QL-205`, the verifier accepts arrangements where the two disjoint adjacency-event truth values differ. For QLs 206–207, it selects actual subsets before enumerating circular orders. For `PNC-QL-208`, it canonicalizes a seating against its reverse rather than reusing the production division-by-two formula.

## Current maturity

`SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY`

The checkpoint is English only, unpublished and not registered in production discovery. Saturation does not authorize Hindi/Punjabi publication, Question Studio exposure, production routing or chapter freeze.
