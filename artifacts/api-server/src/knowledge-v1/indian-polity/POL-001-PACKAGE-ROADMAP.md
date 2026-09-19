# POL-001 Indian Polity — Package Roadmap

This file is the chapter-level binding authority for Polity content status and package promotion.

| CP | Title | Content status | Package binding |
|---|---|---|---|
| POL-CP-001 | Constitutional History | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-002 | Constituent Assembly & Making of the Constitution | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-003 | Preamble, Union & Citizenship | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-004 | Fundamental Rights | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-005 | Directive Principles of State Policy & Fundamental Duties | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-006 | Amendments, Basic Structure & Schedules | APPROVED / CONTENT-FROZEN — V3 | eligible |
| POL-CP-007 | President | APPROVED / CONTENT-FROZEN — V6 | eligible |
| POL-CP-008 | Vice-President | APPROVED / CONTENT-FROZEN — V6 | eligible |
| POL-CP-009 | Prime Minister & Union Council of Ministers | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-010 | Parliament Structure & Officers | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-011 | Parliament Procedure, Bills & Financial Business | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-012 | Supreme Court | APPROVED / CONTENT-FROZEN — exam-grade stems V2 | eligible |
| POL-CP-013 | High Courts, Subordinate Judiciary & Writs | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-014 | Governor | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-015 | Chief Minister & State Council of Ministers | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-016 | State Legislature | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-017 | Centre–State Relations | APPROVED / CONTENT-FROZEN — V2 | eligible |
| POL-CP-018 | Emergency Provisions | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-019 | Panchayati Raj | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-020 | Municipalities | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-021 | Elections, Representation & Anti-Defection | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-022 | Constitutional Bodies & Constitutional Authorities | APPROVED / CONTENT-FROZEN — V2 | eligible |
| POL-CP-023 | Statutory & Executive Bodies | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-024 | Official Language, Scheduled Areas & Tribal Administration | APPROVED / CONTENT-FROZEN | eligible |
| POL-CP-025 | Union Territories & Special Provisions for States | APPROVED / CONTENT-FROZEN — V3 | eligible |
| POL-CP-026 | Public Services & Administrative Tribunals | APPROVED / CONTENT-FROZEN — V2 | eligible |
| POL-CP-027 | Trade, Commerce & Co-operative Societies | APPROVED / CONTENT-FROZEN — V2 | eligible |

## Chapter state

English content implementation has reached POL-CP-027. All 27 CPs are approved/content-frozen.

Package eligibility does not mean live runtime exposure. Question Studio binding, production registration and localization remain separate chapter-level passes.

## Binding rule

A CP becomes eligible for the shared `POL-001` Question Studio package only after its English review batch is explicitly approved. Localization must preserve canonical fact IDs, QL identity, option semantics and correct-answer parity.

## Final audit gate

Before Question Studio exposure:

1. reconcile stale lifecycle/status metadata;
2. apply the chapter-wide explanation-value standard, including important-post qualification backfill;
3. run structural/provenance/duplicate and cross-CP ownership checks;
4. perform final stem/explanation quality audit without changing approved answer semantics;
5. bind the approved English CPs into the shared Polity package;
6. run Hindi/Punjabi localization only after the English audit is stable.
