# TMW-CP-002 English Editorial Review

**Checkpoint:** `TMW-CP-002 — Combined Work and Rate Reconstruction`  
**Review set:** 42 generated rows, three deterministic seeds per QL  
**QL range:** `TMW-QL-021`–`TMW-QL-034`  
**Review date:** 26 July 2026  
**Verdict:** English freeze candidate

## Review method

The generated Question Studio-style export was inspected for:

- SSC/Banking/Punjab exam-like wording;
- clear fixed-workload references;
- correct pair and team identities;
- natural handling of constructive and destructive work;
- option realism and answer-unit consistency;
- formula relevance;
- whether every worked step used visible or explicitly derived information;
- contextual conclusions;
- repetitive or generic explanation language.

## Editorial corrections made before repository CI

1. Replaced repeated full workload clauses with natural “can do so” phrasing for second and later agents.
2. Rendered pairwise statements with complete labels such as “Clerk A and Clerk B,” avoiding ambiguous “Clerk A and B.”
3. Replaced unnatural destructive-worker contexts with a continuous rework process while retaining the exact signed-rate mathematics.
4. Matched explicit-output verbs to context: machines print, crews repair, clerks verify, operators process and technicians repair.
5. Replaced implausibly large identical-agent distractors with close count and neighbouring-group alternatives.
6. Removed extreme product-of-rates output distractors and added realistic omitted-rate alternatives.
7. Restricted count answers to integers and completed-work fractions to values not exceeding the whole assignment.
8. Replaced a generic pairwise-individual formula with the exact target identity, for example:

   \[
   r_B=\frac{r_{AB}+r_{BC}-r_{CA}}{2}
   \]

9. Changed team-comparison states to produce exam-friendly time differences and rewrote the stem using explicit A1/A2 and B1/B2 completion facts.
10. Rephrased signed explicit-rate stems into productive output and rework language rather than exposing internal sign notation alone.

## Exact-head evidence

- head: `a4f6e1604ec2258a8b79398a6a104d5c4c20985f`;
- workflow: `Validate TMW-CP-002 runtime proof`;
- run: `30187600051`;
- artifact: `tmw-cp002-runtime-proof` (`8627510174`);
- result: PASS.

Evidence totals:

- 14 QLs;
- 14 solve contracts;
- 50 proof seeds per QL;
- 700 deterministic proof cases;
- 323 distinct rendered stems;
- all four correct-answer positions represented;
- 168 structural-audit cases;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed MathJax delimiter groups: 0;
- generic explanation hits: 0;
- option-contract failures: 0;
- exact cross-QL stem duplicate groups: 0;
- normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicate groups: 0;
- 42 review rows, all valid.

## Boundary confirmation

This checkpoint does not absorb:

- efficiency-ratio or percentage-efficiency systems (`TMW-CP-003`);
- joins, leaves or handoffs (`TMW-CP-004`);
- alternating schedules (`TMW-CP-005`);
- workforce–days–hours scaling (`TMW-CP-006`);
- heterogeneous worker categories (`TMW-CP-007`);
- wages (`TMW-CP-008`);
- pipes and tank flow (`TMW-CP-009/010`).

It also adds no Question Studio routing, Question Bank writes, test assembly or student delivery.

## Final verdict

`TMW-CP-002` is **SATURATED FOR CURRENT ENGLISH OWNERSHIP AT RUNTIME-PROOF MATURITY**.

All generated packages remain `publiclyPublishable: false`.
