# PRT-001 E6 — Production Diversity Validation

**Scope:** deepen production diversity for the original advanced Partnership QLs `PRT-QL-013..032` without adding or changing solve contracts.

**Verdict:** PASS — E6 baseline advanced production-diversity gates are green. This is not final chapter freeze.

## Runtime surface preserved

- active QLs: 103 per locale
- active solve modes: 99
- CP distribution: 13 / 14 / 16 / 18 / 14 / 16 / 12
- locales: EN / HI / PA
- Question Studio routing: all 7 CPs × all 3 locales

## E6 production changes

- original advanced QLs `013..032` moved from fixed mathematical states to human-owned multi-scenario pools;
- shared context pool expanded to 10 partner pairs and 12 localized business contexts;
- each QL `013..032` now has 3 human-authored stem skeletons per locale: the original stem plus two E6 alternatives;
- stem selection is deterministic by seed;
- every variant is library-validated against the QL's exact required-placeholder contract.

## Validation evidence

### Package runtime

- package-scoped TypeScript: PASS
- seeded corpus: PASS
- generated questions: 3,090
- active QLs: 103
- active solve modes: 99

### E6 baseline advanced mathematical diversity

- QLs: `PRT-QL-013..032`
- cases: 720 (20 QLs × 36 seeds)
- minimum required effective-weight signatures: 6
- observed minimum effective-weight signatures: 35
- minimum required answer signatures: 3
- observed minimum answer signatures: 3
- minimum required normalized-ratio signatures: 3
- fixed-ratio semantic exception: `PRT-QL-020` because equal-profit timing necessarily fixes the ratio at 1:1

Per-QL observed `(weight signatures / ratio signatures / answer signatures)`:

- 013: 35 / 3 / 3
- 014: 36 / 3 / 17
- 015: 36 / 3 / 3
- 016: 36 / 4 / 4
- 017: 36 / 4 / 4
- 018: 36 / 4 / 24
- 019: 36 / 4 / 10
- 020: 35 / 1 / 4 — intentional 1:1 semantic exception
- 021: 36 / 4 / 4
- 022: 36 / 4 / 20
- 023: 36 / 4 / 9
- 024: 36 / 4 / 20
- 025: 36 / 3 / 11
- 026: 36 / 4 / 10
- 027: 36 / 4 / 11
- 028: 36 / 3 / 11
- 029: 36 / 4 / 20
- 030: 36 / 4 / 12
- 031: 36 / 4 / 21
- 032: 36 / 3 / 3

### E6 stem-skeleton diversity

- cases: 1,440 (20 QLs × 3 locales × 24 seeds)
- required skeletons per QL per locale: 3
- every EN/HI/PA QL `013..032`: 3 authored / 3 seed-reachable
- duplicate authored skeletons: 0
- placeholder-contract drift: 0

### Object-pool depth

- partner pairs: 10
- business contexts: 12
- duplicate pool entries: 0

### Existing gates retained

- context realism: 824 cases / 103 context families — PASS
- E1 math diversity: 240 cases — PASS
- E2 math diversity: 336 cases — PASS
- E3 math diversity: 336 cases — PASS
- E4 math diversity: 336 cases — PASS
- E5 math diversity: 456 cases — PASS
- multilingual parity: 1,236 cases — PASS
- option quality: 1,648 cases — PASS; answer positions 427 / 427 / 381 / 413
- Question Studio integration: 42 cases — PASS

## CI note

The first E6 validation attempt accidentally included the freeze-audit entrypoint in the package-scoped TypeScript project. That imported `generation-engine-core` and surfaced unrelated pre-existing Percentage/Ratio TypeScript errors. The TypeScript scope was restored to the established PRT-001 package-only boundary; `audit:prt-001` still bundles and executes the freeze audit separately. No PRT-001 runtime logic or validation threshold was weakened.

## Still open before final freeze

- same-QL multi-skeleton/context-depth audit for later E1-E5 QLs;
- cross-QL structural stem similarity / duplicate gate;
- English source/PYQ saturation and exam-realness review;
- RAP-003 Partnership ownership/de-duplication cleanup;
- human English editorial review;
- Hindi/Punjabi editorial parity review;
- final release/freeze gates.
