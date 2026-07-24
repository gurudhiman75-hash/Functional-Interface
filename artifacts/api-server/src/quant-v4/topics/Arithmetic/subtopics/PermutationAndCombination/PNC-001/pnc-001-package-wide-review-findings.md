# PNC-001 Package-Wide Review Findings

Date: 2026-07-24  
Scope: `PNC-QL-001` through `PNC-QL-106`  
Status: **REVIEW COMPLETE**

## Final finding register

| ID | Severity | Scope | Finding | Decision | Status |
|---|---|---|---|---|---|
| `PNC-RVW-001` | MEDIUM | English QL library | Twelve same-CP/same-mode similarity pairs required human review. | All twelve were retained for documented mathematical distinctions: factorial depth, fixed unique versus repeated letters, zero-sensitive parity, inverse unknown, repeated-category depth, or distinct versus repeated-letter rank. | ACCEPTED |
| `PNC-RVW-002` | OBSERVATION | 22 fixed-state QLs | Fewer than five distinct parameter states appeared over 50 seeds. | Fixed expressions, fixed words, exact multiplicity patterns and fixed contextual roles are intentional. Artificial variation would weaken naturalness or change the contract. | ACCEPTED |
| `PNC-RVW-003` | MEDIUM | `PNC-CP-005` | Partial selection and arrangement of letters is not represented. | Deferred. No current reference evidence proves a multiset-specific solver/evidence/validator contract distinct from CP-006 or later restriction/mixed-system CPs. | DEFERRED |
| `PNC-RVW-004` | HIGH | English corpus | Full rendered-corpus review was initially incomplete. | All 106 rendered QLs were reviewed. Fourteen QLs received traceable stem or explanation repairs. No REWRITE or REJECT row remains. | FIXED |
| `PNC-RVW-005` | MEDIUM | Localization | Hindi/Punjabi terminology and word-localization policy are not approved. | Deferred until English freeze approval. This does not block eligibility for English freeze review. | DEFERRED |

## Traceable editorial repairs

- Stem repairs: `PNC-QL-036`, `PNC-QL-078`, `PNC-QL-103`.
- Explanation repairs: `PNC-QL-052`, `054`, `056`, `064`, `083`, `084`, `087`, `089`, `091`, `092`, `102`.
- Two additional QLs were admitted to close the evidence-backed CP-005 dictionary-rank gap: `PNC-QL-105` and `PNC-QL-106`.

## Technical closure

- Runtime proof: 106 QLs × 12 seeds = 1,272 cases, generated twice.
- Package stress: 106 QLs × 50 seeds = 5,300 cases.
- Repeatability checks: 1,060.
- Validation failures: 0.
- Independent-verifier disagreements: 0.
- Option-contract failures: 0.
- Explanation-contract failures: 0.
- Exact template duplicate groups: 0.
- Rendered explanation duplicate groups: 0.

## Verdict

`ELIGIBLE FOR ENGLISH FREEZE REVIEW`

This is not publication approval and does not enable production or Question Studio routing.