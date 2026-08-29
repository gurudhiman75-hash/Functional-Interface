# Algebra Permanent QL Allocation V1

**Status:** `PERMANENT_IDENTITY_ALLOCATED / INACTIVE`  
**Authority:** `ALG-PERMANENT-QL-ALLOCATION-V1`  
**Source freeze:** `ALG-FINAL-RETAINED-CONTRACT-MATRIX.md` + final fixture ledger + final source-gap audit  
**Allocated QLs:** 40  
**Range:** `ALG-QL-001..ALG-QL-040`  
**Date:** 18 August 2026

## Allocation decision

The final source/semantic contraction reduced 112 executable discovery candidates to 40 retained learner-facing contracts. The final gap audit found zero additional independent contracts and zero retained contracts without an evidence path.

Permanent identities are therefore allocated in retained-contract order:

- `F-C001 → ALG-QL-001`
- ...
- `F-C040 → ALG-QL-040`

`ALG-001` owns 19 permanent identities.  
`ALG-002` owns 21 permanent identities.  
`ALG-CP-015` owns 0 permanent identities and remains composition/presentation only.

## What is frozen now

Frozen:

- QL identity;
- retained semantic contract;
- package/CP ownership;
- stable ID ordering.

Not frozen / not authorized yet:

- permanent English runtime implementation;
- English editorial freeze;
- Hindi/Punjabi implementation;
- multilingual editorial freeze;
- Question Studio discovery;
- Question Bank storage;
- test eligibility;
- public release.

All allocated rows remain inactive and downstream-locked.

## Next gate

Build the permanent English runtime adapter from the frozen 40-contract authority, map provisional discovery generators/states into those contracts, and run English mathematical/editorial audits. Only after that should English implementation freeze be considered.
