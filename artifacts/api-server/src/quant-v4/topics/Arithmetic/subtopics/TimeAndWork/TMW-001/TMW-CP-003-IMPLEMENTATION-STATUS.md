# TMW-CP-003 Implementation Status

**Branch:** `feat/tmw-cp003`  
**Base:** merged CP-002 chapter base `c91cb9494a55f6477a16a468c1806139f8b4175f`  
**Maturity:** English runtime-proof candidate pending exact-head CI and user review  
**Publication:** disabled

## Implemented

- 23 current human-owned QLs (`TMW-QL-035`–`TMW-QL-057`);
- equal-work efficiency/time inversion;
- percentage efficiency and time comparisons with explicit comparison bases;
- unequal-work, unequal-time and output productivity systems;
- efficiency-ratio plus combined-time, sum and difference reconstruction;
- successive three-agent ratio and percentage comparison;
- exact rational arithmetic and valid-state-first deterministic generation;
- canonical solver plus independent equation verification;
- solve-mode-specific formula-led English explanations;
- context-safe exam-style English stems;
- misconception-labelled distractors with whole-output admissibility guards;
- mathematical fingerprints;
- structured 69-row review export;
- focused 1,150-case runtime proof;
- focused 276-case structural and editorial audit;
- dedicated GitHub Actions workflow.

## Current solve contracts

1. efficiency ratio from equal-work completion times;
2. completion-time ratio from efficiency ratio;
3. percent more efficient from times;
4. percent less efficient from times;
5. faster time from a percent efficiency advantage;
6. slower time from the faster worker's time;
7. percent less time from percent more efficiency;
8. percent more time from percent less efficiency;
9. work ratio for equal time;
10. work ratio for unequal times;
11. time ratio for unequal work and efficiency;
12. efficiency ratio for unequal work and times;
13. output from equal-time efficiency ratio;
14. reference output from equal-time efficiency ratio;
15. individual time from efficiency ratio and combined time;
16. individual time from efficiency ratio and time difference;
17. individual time from efficiency ratio and time sum;
18. efficiency ratio from explicit output and duration;
19. comparative output from different efficiencies and durations;
20. comparative duration from different work and efficiencies;
21. successive three-agent efficiency ratio;
22. successive efficiency-percentage comparison;
23. efficiency change from completion-time change.

These are discovered task contracts, not a quota.

## Local validation

- strict TypeScript compilation: PASS;
- 23 QLs × 50 seeds = 1,150 deterministic cases;
- all four correct-answer positions represented;
- 548 distinct rendered stems;
- 23 QLs × 12 audit seeds = 276 cases;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed MathJax groups: 0;
- control-character hits: 0;
- generic explanation hits: 0;
- option-contract failures: 0;
- exact/normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicates: 0;
- 69 generated review rows inspected locally.

## Workflow boundary

The runtime generates candidate questions only. It currently has:

- no Question Studio exposure;
- no Question Bank write path;
- no test assembly integration;
- no student delivery path;
- Hindi and Punjabi intentionally rejected at runtime;
- `publiclyPublishable: false` for every generated candidate.

The product flow remains:

```text
runtime → Question Studio candidate → automated and human approval
→ Question Bank → test assembly → student test
```
