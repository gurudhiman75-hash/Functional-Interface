# PRT-001 E9 — RAP-003 Partnership Ownership and De-duplication

## Decision

Standalone `PRT-001` is the sole product owner of aptitude Partnership generation.

Legacy `RAP-003 / RAP-CP-013` is retired from active Question Studio discovery and generation, but its historical implementation is retained for regression/history rather than deleted.

## Legacy disposition

The 16 legacy QLs `RAP-QL-801..816` are fully accounted for in `rap003-ownership.e9.json`:

- **15** aptitude-Partnership QLs → `RETIRED_TO_PRT` and mapped to active PRT-001 authorities;
- **1** (`RAP-QL-812 / workContributionShare`) → `DELEGATED_TIME_AND_WORK` because work/efficiency contribution sharing belongs to Time & Work, not Partnership capital-time.

No legacy Partnership QL remains a product-generation owner under RAP-003.

## Product-routing change

`getRap003ActiveCanonicalProblemIds()` now returns only:

- RAP-CP-014
- RAP-CP-015
- RAP-CP-016
- RAP-CP-017
- RAP-CP-018
- RAP-CP-019
- RAP-CP-020
- RAP-CP-021
- RAP-CP-022

`RAP-CP-013` is deliberately absent.

Question Studio therefore continues to expose RAP-003 for its genuine advanced Ratio & Proportion applications while refusing explicit `RAP-CP-013` generation. Its current EN/HI/PA product surface is preserved. PRT-001 remains independently discoverable with its seven Partnership CPs.

## Historical runtime policy

E9 does not delete:

- CP013 task-registry entries;
- QL801..816 language libraries;
- CP013 solver/generator code;
- direct CP013 helper functions;
- legacy unit tests.

Those assets remain useful for regression evidence and history. The ownership boundary is enforced at **active product routing**, which avoids data loss while eliminating duplicate user-facing generation.

## Audit contract

`prt-001-rap003-ownership-audit.ts` enforces:

1. every QL801..816 appears exactly once in the ownership ledger;
2. exactly 15 retire to PRT-001;
3. QL812 alone delegates to Time & Work;
4. every representative PRT QL mapping is currently active;
5. RAP-CP-013 is absent from the RAP active-CP list;
6. Question Studio RAP discovery contains nine non-Partnership CPs and no CP013;
7. explicit `RAP-003 + RAP-CP-013` generation is rejected;
8. PRT-001 remains discoverable and successfully generates validated Partnership questions.

## Validation — PASS

Validated runtime head: `d8ac563c60238c2c4463aaf37fc10bd882cae6dc`  
GitHub Actions run: `33370753041`  
Job: `99421096301`

All five E9 gates passed:

1. **RAP-003 legacy regression tests** — PASS. Retained CP013 historical math still works.
2. **RAP-003 Question Studio smoke** — PASS. RAP exposes nine active non-Partnership CPs, preserves EN/HI/PA, and blocks `RAP-CP-013` product generation.
3. **E9 ownership audit** — PASS. All 16 legacy QLs are dispositioned exactly once; 15 retire to PRT and QL812 delegates to Time & Work.
4. **Full PRT seeded corpus** — PASS. **3,150** deterministic questions across 105 QLs / 99 solve modes / EN-HI-PA.
5. **Full PRT freeze audit** — PASS. E8 source-realness, E7/E6 diversity, E1-E5 math, multilingual parity, option quality and Question Studio integration all remain green.

E9 therefore closes the legacy ownership/de-duplication gate without deleting historical RAP assets or reducing RAP's unrelated product capability.

## Freeze impact

**Legacy ownership/de-duplication is CLOSED.**

Remaining PRT-001 publication gates are:

1. human English editorial review of all 105 QLs, including the six non-blocking E7 similarity signals;
2. Hindi/Punjabi human editorial parity against the frozen English surface;
3. a final full release rerun after any editorial changes.

Only after those gates pass should final chapter/publication freeze be restored.
