# PRT-001 E7 chapter-wide stem-structure validation

Status: **PASS**

Validated runtime head: `43c03e02d745319f4a397e359194e9fd8a900cce`  
GitHub Actions run: `33350942858`  
Scope: no new solve contracts; chapter-wide authored stem depth and structural duplicate protection.

## Runtime surface preserved

- 7 canonical problems
- 99 solve modes
- 103 active QLs per locale
- EN / HI / PA
- CP distribution: 13 / 14 / 16 / 18 / 14 / 16 / 12

## Validation results

- package-scoped TypeScript: PASS
- seeded corpus: PASS — 3,090 deterministic questions
- chapter stem depth: PASS — 7,416 seed-selection cases
- QL/locale pairs: 309
- authored skeletons per QL/locale: 3
- seed-reachable skeletons per QL/locale: 3
- cross-QL structural comparisons: 141,831
- normalized exact duplicates: 0
- severe near-identical pairs at >= 0.985: 0
- lower editorial near-similarity pairs at >= 0.88: 6
- highest non-blocking similarity: 0.933
- multilingual parity: PASS — 1,236 cases
- option quality: PASS — 1,648 cases; answer positions 427 / 427 / 381 / 413
- Question Studio integration: PASS — 42 cases

## Structural-signature correction

Early E7 runs exposed a flaw in the first duplicate normalizer: replacing every placeholder with one generic slot falsely collapsed semantically different structures. The final signature preserves semantic slot classes and partner/cardinality roles. The blocking threshold remained unchanged at 0.985.

This correction removed false positives such as capital-ratio vs time-ratio inverse questions and two-partner vs three-partner inverse systems without weakening duplicate detection.

## Remaining non-blocking editorial pairs

The final audit reports six pairs above the editorial review threshold 0.88, all below the 0.985 blocking threshold. Highest observed score: 0.933. These remain explicit human-review signals rather than automated failures.

## Remaining chapter gates

E7 is not final chapter freeze. Still required:

1. English source/PYQ saturation and exam-realness review;
2. RAP-003 Partnership ownership/de-duplication cleanup;
3. human English editorial review, including the six near-similarity signals;
4. Hindi/Punjabi human editorial parity review;
5. final release/freeze rerun after source/editorial changes.
