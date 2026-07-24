# PNC-CP-004 Content Audit

> Date: 2026-07-24  
> Scope: `PNC-QL-075` through `PNC-QL-082`  
> Policy: current checkpoint evidence, not a future quota

## Coverage

The admitted set covers four distinct contracts:

- complete multiset arrangement;
- fixed-position multiset reduction;
- identical-swap overcount factor;
- bounded inverse recovery of one multiplicity.

The direct family includes one, two and three repeated categories and both word and non-word contexts. Further stems in the same structures were rejected as semantic near-clones.

## Editorial audit

- exam-style English stems: PASS;
- fixed words are natural and mathematically transparent: PASS;
- generated flag and inverse contexts resolve all placeholders: PASS;
- no artificial sample labels: PASS;
- exact duplicate English templates: 0;
- unresolved rendered placeholders: 0;
- correct answer appears exactly once: PASS;
- four unique positive integer options: PASS.

## Mathematical audit

- every repeated multiplicity is at least two: PASS;
- multiplicities fit within the total object count: PASS;
- all-distinct numerator equals the relevant factorial: PASS;
- correction denominator equals the product of multiplicity factorials: PASS;
- fixed unique object leaves multiplicities unchanged: PASS;
- fixing a repeated object reduces its multiplicity exactly once: PASS;
- overcount answer equals the correction denominator: PASS;
- inverse answer lies in the stated bounded domain and recreates the target: PASS.

## Runtime audit

- deterministic parameter generation: PASS;
- authoritative solver / independent recursive enumeration agreement: PASS;
- reasoning evidence includes decisive multiset state: PASS;
- explanations consume solver evidence: PASS;
- registry/language parity across base and companion libraries: PASS;
- current 82-QL coverage audit: PASS;
- 984 seed cases, each generated twice: PASS.

Successful pre-report workflow run: `30075581021`.

## Deferred coverage

This checkpoint does not claim coverage of:

- together/apart or block restrictions;
- repeated-letter positional restrictions beyond fixing one position;
- partial multiset arrangements;
- digit and number formation;
- repetition-allowed strings;
- circular arrangements;
- grouping and distribution.

Those remain candidates for separate need-based review.
