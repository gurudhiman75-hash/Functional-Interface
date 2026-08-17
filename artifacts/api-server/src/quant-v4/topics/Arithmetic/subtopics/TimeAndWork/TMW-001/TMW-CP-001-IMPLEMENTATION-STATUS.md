# TMW-CP-001 Implementation Status

**Branch:** `feat/tmw-cp001`  
**Base:** TMW-001 design commit `962abc89cfc482f1ece079c0b45f39e76b40abb3`  
**Maturity:** saturated for current English ownership at runtime-proof maturity  
**Publication:** disabled

## Implemented

- exact reduced rational arithmetic with safe-integer guards;
- typed `TMW-001` / `TMW-CP-001` contracts;
- deterministic valid-state generation;
- 20 current human-owned QL contracts (`TMW-QL-001`–`TMW-QL-020`);
- direct, reciprocal, part–whole, conversion, comparison and uniform-rate-change solving;
- equation-based independent verification;
- solve-mode-specific formula-led English explanations;
- context-safe workload and peer-actor libraries;
- solve-mode-specific misconception distractors with admissibility rules;
- mathematical fingerprints;
- structured review export;
- exact and normalised stem collision audit;
- explanation duplication and generic-language audit;
- non-publishable candidate packages.

## Ownership decisions

- two wording-only provisional modes were merged into mathematically identical contracts;
- one under-specified whole-work mode was corrected to require a known part fraction;
- the time-block conversion contract returns output in the requested period rather than an awkward “per N hours” rate label;
- the current 20 QLs are discovered ownership, not a preset quota.

See:

- `TMW-CP-001-DESIGN-AUDIT.md`;
- `TMW-CP-001-EDITORIAL-REVIEW.md`.

## Validation evidence

Final local validation:

- strict TypeScript compilation: PASS;
- deterministic proof: 20 QLs × 50 seeds = 1,000 cases — PASS;
- all four correct-answer positions represented;
- distinct rendered stems: 619;
- structural audit: 20 QLs × 12 seeds = 240 cases — PASS;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed inline-MathJax delimiter groups: 0;
- option-contract failures: 0;
- exact/normalised cross-QL stem collisions: 0;
- exact cross-QL explanation duplicates: 0;
- review export: 60 rows inspected manually.

Exact-head GitHub Actions after editorial correction:

- head: `f1512a995cd7bc71d5f8d5592443fc7dcb17acec`;
- workflow run: `30186644576`;
- runtime proof, structural audit and review export: PASS;
- evidence artifact: `8627235868`.

A final documentation-only head check remains required after this status record is committed.

## Workflow boundary

The runtime creates candidate questions only. It currently has:

- no generation-engine routing;
- no Question Studio exposure;
- no Question Bank write path;
- no test assembly integration;
- no student delivery path;
- Hindi and Punjabi intentionally rejected at runtime;
- `publiclyPublishable: false` for every generated candidate.

The intended product flow remains:

```text
runtime → Question Studio candidate → automated and human approval
→ Question Bank → test assembly → student test
```

## Next chapter step

After CP-001 is integrated into the TMW-001 chapter base, implementation can proceed to `TMW-CP-002 — Combined Work and Rate Reconstruction`.
