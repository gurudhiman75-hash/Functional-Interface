# Algebra Permanent QL Allocation V2

**Status:** `PERMANENT_IDENTITY_V2_ALLOCATED / INACTIVE`  
**Authority:** `ALG-PERMANENT-QL-ALLOCATION-V2`  
**Permanent range:** `ALG-QL-001..ALG-QL-043`  
**Date:** 18 August 2026

## 1. Migration rule

V2 preserves all V1 identities `ALG-QL-001..ALG-QL-040` exactly and appends only three source-justified contracts:

- `ALG-QL-041` — solve unique 3×3 linear system;
- `ALG-QL-042` — direct cubic Vieta invariant;
- `ALG-QL-043` — symmetric positive-variable fixed-sum extremum.

No V1 ID is renumbered, removed or repurposed.

## 2. Source authority

V2 allocation is controlled by:

- `ALG-FREEZE-REOPEN-AUDIT-V2.md`
- `ALG-FINAL-RETAINED-CONTRACT-MATRIX-V2.md`
- `ALG-FINAL-SOURCE-FIXTURE-LEDGER-V2.md`
- `ALG-FINAL-SOURCE-GAP-AUDIT-V2.md`
- `permanent/allocation.ts`

## 3. Package counts

```text
ALG-001 permanent identities   19
ALG-002 permanent identities   24
--------------------------------
Total permanent identities     43
CP-015 permanent identities     0
```

## 4. Current executable registry

```text
Permanent-mapped prototypes   109
Engine-only candidates           2
Composition-only CP-015          7
----------------------------------
Current executable candidates  118
```

The registry count is not a QL target.

## 5. Lifecycle safety

Frozen now:
- permanent QL identity;
- semantic contract;
- package/CP ownership;
- stable V1→V2 append-only ordering.

Not frozen / not authorized:
- English implementation freeze;
- Hindi/Punjabi implementation freeze;
- Question Studio discovery;
- Question Bank storage;
- test eligibility;
- public release.

Every allocation row remains inactive and downstream-locked.

## 6. Next gate

Repository CI must validate:

1. allocation V2 (`001..043`, V1 preserved);
2. CP-007 exact 3×3 runtime;
3. CP-010 cubic invariant states;
4. CP-012 fixed-sum symmetric extrema;
5. CP-015 bounded cubic composition;
6. permanent-English adapter coverage across all 43 QLs;
7. permanent-English editorial corpus.

Only after those guards are green should English implementation freeze be considered.