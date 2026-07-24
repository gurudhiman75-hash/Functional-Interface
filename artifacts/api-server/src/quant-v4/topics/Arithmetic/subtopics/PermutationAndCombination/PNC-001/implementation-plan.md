# PNC-001 Need-Based Implementation Plan

The six CP ownership boundaries in PNC-001 are fixed by the family roadmap. QLs, solve modes and checkpoint sizes inside them remain need-based.

## Completed checkpoints

1. CP-001 counting foundations: 48 QLs.
2. CP-001 factorial foundation extension: QL-049 through QL-058.
3. CP-002 distinct permutations: QL-059 through QL-066.
4. CP-003 basic combinations: QL-067 through QL-074.
5. CP-005 repeated-object/multiset foundation: QL-075 through QL-082.
6. CP-004 digit, number and code formation: QL-083 through QL-094.
7. CP-006 selection then arrangement/roles: QL-095 through QL-104.
8. Package-wide saturation repair: CP-005 dictionary rank through QL-105 and QL-106.
9. Full 106-QL editorial, duplicate, ownership and runtime stress review.

## Dictionary-rank repair

Reference evidence justified one additional CP-005 contract:

- `findDictionaryRankOfWord`.

Two QLs were sufficient:

- `PNC-QL-105`: distinct-letter dictionary rank;
- `PNC-QL-106`: repeated-letter dictionary rank with multiset correction.

The production solver counts preceding lexicographic blocks. A recursive enumerator independently lists all distinct words in order and verifies the rank.

## Current reviewed checkpoint

- six active CPs;
- 106 English QLs;
- 35 active solve modes;
- 106 QL-specific natural explanations;
- 39 Easy / 45 Medium / 22 Hard;
- 1,272 runtime proof cases;
- 5,300 package stress cases;
- 1,060 repeatability checks;
- 106 completed human-review rows;
- review verdict: `ELIGIBLE FOR ENGLISH FREEZE REVIEW`.

These values describe the current checkpoint and are not future quotas.

## Completed audit decisions

- twelve semantic-similarity pairs: reviewed and accepted for material distinctions;
- twenty-two fixed-state QLs: reviewed and accepted as intentionally fixed;
- fourteen QLs: traceably repaired for stem or explanation quality;
- CP-005 partial-letter selection: deferred pending evidence of a distinct contract;
- Hindi/Punjabi authoring: deferred until English freeze;
- publication and production integration: not approved.

## Next gate

The next PNC-001 action is explicit product-owner English freeze approval. Until then:

- `publiclyPublishable` remains `false`;
- generation-engine and Question Studio routing remain disabled;
- no localization is authored;
- no additional PNC-001 QL is admitted without a fresh material-gap review.

After this audit PR is accepted, PNC-002 may begin with:

```text
PNC-CP-007 — Together, Apart & Block Restrictions
```

CP-007 implementation must remain independent of PNC-001 publication status and follow the same need-based admission rule.