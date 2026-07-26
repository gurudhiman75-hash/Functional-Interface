# TMW-CP-001 Implementation Status

**Branch:** `feat/tmw-cp001`  
**Base:** TMW-001 design commit `962abc89cfc482f1ece079c0b45f39e76b40abb3`  
**Maturity:** English runtime-proof candidate  
**Publication:** disabled

## Implemented

- exact reduced rational arithmetic with safe-integer guards;
- typed `TMW-001` / `TMW-CP-001` contracts;
- deterministic seed-based parameter selection;
- 20 current human-owned QL contracts (`TMW-QL-001`–`TMW-QL-020`);
- direct, reciprocal, part–whole, conversion, comparison and rate-change solving;
- equation-based independent verification;
- solve-mode-specific formula-led English explanations;
- solve-mode-specific misconception distractors with option audit metadata;
- mathematical fingerprints;
- structured review export;
- exact and normalised stem collision audit;
- explanation duplication and generic-language audit;
- non-publishable generation packages.

## Local validation evidence

The implementation was reconstructed and executed in an isolated TypeScript environment with strict compilation:

- deterministic runtime proof: 20 QLs × 50 seeds = 1,000 cases — PASS;
- correct answer positions represented: 0, 1, 2 and 3;
- distinct rendered stems: 619;
- focused structural audit: 20 QLs × 12 seeds = 240 cases — PASS;
- invalid packages: 0;
- unresolved placeholders: 0;
- malformed inline-MathJax delimiter groups: 0;
- option-contract failures: 0;
- cross-QL stem collisions: 0;
- cross-QL explanation duplicates: 0;
- review export: 60 valid rows, three seeds per QL.

Repository CI remains the authoritative confirmation after these files are pushed.

## Ownership audit decisions

- two wording-only provisional modes were merged into their identical mathematical contracts;
- one under-specified whole-work mode was corrected to require a known part fraction;
- current distinct CP-001 inventory is 20 solve contracts, not a preset quota.

See `TMW-CP-001-DESIGN-AUDIT.md` for the full decision record.

## Remaining before CP-001 freeze

- obtain a green focused GitHub Actions run at the exact branch head;
- inspect the 60-row review export manually for SSC/Banking/Punjab exam realism;
- correct any editorial defects found during review;
- decide whether further source-backed CP-001 modes are materially distinct;
- record the English freeze decision.

## Workflow boundary

The runtime only generates candidate questions for future Question Studio use. It currently has:

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
