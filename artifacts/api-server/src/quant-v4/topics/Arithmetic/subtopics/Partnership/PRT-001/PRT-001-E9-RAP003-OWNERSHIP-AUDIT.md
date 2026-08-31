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

Question Studio therefore continues to expose RAP-003 for its genuine advanced Ratio & Proportion applications while refusing explicit `RAP-CP-013` generation. PRT-001 remains independently discoverable with its seven Partnership CPs.

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

## Freeze impact

Once the E9 ownership audit, RAP Question Studio smoke, RAP package regression tests and the full PRT-001 test/audit suite pass together, the legacy ownership/de-duplication gate can be considered closed.

Remaining PRT-001 publication gates after E9 are human English editorial review, Hindi/Punjabi editorial parity, and the final release rerun after any editorial changes.
