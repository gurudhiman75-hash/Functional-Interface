# TMW-CP-002 Implementation Status

**Branch:** `feat/tmw-cp002`  
**Base:** merged CP-001 chapter base `99d552aef1421540ea6d37284a55d1db5c2b96a0`  
**Maturity:** saturated for current English ownership at runtime-proof maturity  
**Publication:** disabled

## Implemented

- 14 current human-owned QLs (`TMW-QL-021`–`TMW-QL-034`);
- exact rational aggregation and component extraction;
- valid-state-first deterministic parameter generation;
- positive, signed, pairwise and identical-agent systems;
- canonical solver and independent equation verifier;
- solve-mode-specific formula-led English explanations;
- context-safe exam-style stems;
- misconception-labelled distractors with admissibility guards;
- mathematical fingerprints;
- structured 42-row review export;
- focused 700-case runtime proof;
- focused 168-case structural and editorial audit;
- dedicated GitHub Actions workflow.

## Current solve contracts

1. combined time from individual times;
2. combined work in a stated duration;
3. missing individual time from combined and known times;
4. all-together time from pairwise times;
5. individual time from pairwise times;
6. pair time from all-together and an excluded individual;
7. net time with continuous rework;
8. rework time from positive and net times;
9. missing constructive time in a signed-rate system;
10. identical-agent count;
11. identical-agent group completion time;
12. combined physical output from explicit rates;
13. missing rate from a signed net-rate equation;
14. completion-time difference between teams.

These are discovered task contracts, not a quota.

## Validation evidence

Exact runtime head before documentation:

- `a4f6e1604ec2258a8b79398a6a104d5c4c20985f`;
- workflow run `30187600051` — PASS;
- artifact `8627510174`.

Results:

- 14 QLs × 50 seeds = 700 deterministic cases;
- all four correct-answer positions represented;
- 323 distinct rendered stems;
- 14 QLs × 12 audit seeds = 168 cases;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed MathJax delimiter groups: 0;
- generic explanation hits: 0;
- option-contract failures: 0;
- exact and normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicates: 0;
- 42 review rows manually inspected and all valid after editorial correction.

A final documentation-head CI confirmation is required after this status record is committed.

## Workflow boundary

The runtime generates candidate questions only. It currently has:

- no generation-engine routing;
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

## Next chapter step

After integration into the TMW-001 chapter base, proceed to `TMW-CP-003 — Efficiency, Time Ratios and Comparative Productivity`.
