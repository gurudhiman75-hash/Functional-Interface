# POL-001 Indian Polity — Package Roadmap

This file is the chapter-level binding authority for Polity content status and package promotion.

| CP | Title | Content status | Package binding |
|---|---|---|---|
| POL-CP-001 | Constitutional History | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-002 | Constituent Assembly & Making of the Constitution | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-003 | Preamble, Union & Citizenship | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-004 | Fundamental Rights | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-005 | Directive Principles of State Policy & Fundamental Duties | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-006 | Amendments, Basic Structure & Schedules | APPROVED / CONTENT-FROZEN — V3 | `POL-001` REVIEW_ONLY bound |
| POL-CP-007 | President | APPROVED / CONTENT-FROZEN — V7 final-audit qualification overlay | `POL-001` REVIEW_ONLY bound |
| POL-CP-008 | Vice-President | APPROVED / CONTENT-FROZEN — V7 final-audit qualification overlay | `POL-001` REVIEW_ONLY bound |
| POL-CP-009 | Prime Minister & Union Council of Ministers | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-010 | Parliament Structure & Officers | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-011 | Parliament Procedure, Bills & Financial Business | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-012 | Supreme Court | APPROVED / CONTENT-FROZEN — V3 final-audit qualification overlay | `POL-001` REVIEW_ONLY bound |
| POL-CP-013 | High Courts, Subordinate Judiciary & Writs | APPROVED / CONTENT-FROZEN — V3 final-audit canonical | `POL-001` REVIEW_ONLY bound |
| POL-CP-014 | Governor | APPROVED / CONTENT-FROZEN — V3 final-audit canonical | `POL-001` REVIEW_ONLY bound |
| POL-CP-015 | Chief Minister & State Council of Ministers | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-016 | State Legislature | APPROVED / CONTENT-FROZEN — V2 final-audit qualification overlay | `POL-001` REVIEW_ONLY bound |
| POL-CP-017 | Centre–State Relations | APPROVED / CONTENT-FROZEN — V2 | `POL-001` REVIEW_ONLY bound |
| POL-CP-018 | Emergency Provisions | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-019 | Panchayati Raj | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-020 | Municipalities | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-021 | Elections, Representation & Anti-Defection | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-022 | Constitutional Bodies & Constitutional Authorities | APPROVED / CONTENT-FROZEN — V2 | `POL-001` REVIEW_ONLY bound |
| POL-CP-023 | Statutory & Executive Bodies | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-024 | Official Language, Scheduled Areas & Tribal Administration | APPROVED / CONTENT-FROZEN | `POL-001` REVIEW_ONLY bound |
| POL-CP-025 | Union Territories & Special Provisions for States | APPROVED / CONTENT-FROZEN — V3 | `POL-001` REVIEW_ONLY bound |
| POL-CP-026 | Public Services & Administrative Tribunals | APPROVED / CONTENT-FROZEN — V3 final-audit canonical | `POL-001` REVIEW_ONLY bound |
| POL-CP-027 | Trade, Commerce & Co-operative Societies | APPROVED / CONTENT-FROZEN — V2 | `POL-001` REVIEW_ONLY bound |

## Chapter state

English content implementation has reached POL-CP-027. All 27 CPs are approved/content-frozen, and the Final Audit V1 English surface was approved on 19 September 2026.

`POL-001` is bound to the shared `knowledge-v1` Question Studio engine in **REVIEW_ONLY** mode. All 27 CPs are discoverable through the English package, with deterministic selection and CP/QL/difficulty filters. Question Bank writes, test/mock eligibility, public publication and production release remain disabled. Hindi/Punjabi localization is now in progress: CP001–CP010 are approved/frozen multilingual V1 with strict semantic, QL, option-order, correct-index, source, numeric/legal-form and native-Punjabi parity gates. CP011–CP012 are the active review-candidate slice.

## Binding rule

A CP becomes eligible for the shared `POL-001` Question Studio package only after its English review batch is explicitly approved. Localization must preserve canonical fact IDs, QL identity, option semantics, correct-answer parity, and numeric/legal form parity. Constitutional identifiers and numeric forms such as `Article 21A`, `Article 19(2)`, `Article 39(b)/(c)`, `Article 300A`, `Part III/IVA`, amendment numbers, dates and age ranges must retain their numeric form where present in the English authority; translate only the surrounding language. Punjabi must be written as natural exam-grade Punjabi rather than word-for-word Hindi calques: prefer ordinary Punjabi sentence order and familiar exam terminology, keep standard legal names where that improves recognition, and avoid mechanical phrases such as `ਮੰਨੇ ਹੋਏ ਸੰਵਿਧਾਨਕ ਪਾਠ`, `ਬਾਧਕ`, `ਯੋਗਤਾ-ਸ਼ਰਤ`, or obscure translated writ names.

## Final audit gate

Before Question Studio exposure:

1. reconcile stale lifecycle/status metadata;
2. apply the chapter-wide explanation-value standard, including important-post qualification backfill;
3. run structural/provenance/duplicate and cross-CP ownership checks;
4. perform final stem/explanation quality audit without changing approved answer semantics;
5. bind the approved English CPs into the shared Polity package — **implemented in REVIEW_ONLY mode**;
6. run runtime/package smoke tests — **implemented as the POL-001 integration gate**;
7. run Hindi/Punjabi localization after the English runtime contract is green.


## Localization progress

| Slice | English questions | Hindi | Punjabi | Runtime exposure |
|---|---:|---|---|---|
| POL-CP-001–002 | 92 | APPROVED / FROZEN V1 | APPROVED / FROZEN V1 | eligible for multilingual package promotion |
| POL-CP-003–004 | 133 | APPROVED / FROZEN V1 | APPROVED / FROZEN V1 | eligible for multilingual package promotion |
| POL-CP-005–006 | 170 | APPROVED / FROZEN V1 | APPROVED / FROZEN V1 | eligible for multilingual package promotion |
| POL-CP-007–008 | 140 | APPROVED / FROZEN V1 | APPROVED / FROZEN V1 | eligible for multilingual package promotion |
| POL-CP-009–010 | 152 | REVIEW CANDIDATE V1 | REVIEW CANDIDATE V1 | deferred until multilingual approval |
| POL-CP-011–027 | pending | pending | pending | English-only remains active |

The approved CP001–CP010 localization layers cover 687 English authority questions and 2,061 review surfaces across English, Hindi and Punjabi. CP011–CP012 add 504 review-candidate surfaces (168 per locale). Native-script leakage, native-Punjabi editorial quality, numeric/legal-form preservation, question-count parity, QL parity, source parity, option-order parity and correct-index parity are executable CI gates.


### CP001–CP002 localization approval

Project-owner approval received on 19 September 2026. Hindi and Punjabi V1 for POL-CP-001–002 are approved/frozen and may be promoted into the multilingual `POL-001` package in the chapter localization integration pass.


### CP003–CP004 localization approval

Project-owner approval received on 20 September 2026. Hindi and Punjabi V1 for POL-CP-003–004 are approved/frozen and may be promoted into the multilingual `POL-001` package in the chapter localization integration pass. The approval also establishes the native-Punjabi exam-language standard and numeric/legal-form preservation rule for all later Polity CPs.


### CP005–CP006 localization approval

Project-owner approval received on 20 September 2026. Hindi and Punjabi V1 for POL-CP-005–006 are approved/frozen. The approved slice preserves exam-grade stems, native Punjabi/Hindi grammar, numeric/legal forms, QL/source parity, option order and correct-answer parity. The Punjabi article-location form `ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ...` is prohibited; use natural exam wording such as `ਕਿਹੜੇ ਅਨੁਛੇਦ ਵਿੱਚ ਦਿੱਤਾ ਗਿਆ ਹੈ?` or a context-specific equivalent.


### CP007–CP008 localization approval

Project-owner approval received on 20 September 2026. Hindi and Punjabi V1 for POL-CP-007–008 are approved/frozen. The approved slice preserves exam-grade stems, native Punjabi/Hindi grammar, numeric/legal forms, QL/source parity, option order and correct-answer parity. Article-location stems must remain natural in Punjabi; mechanical forms such as `ਕਿਹੜੇ ਅਨੁਛੇਦ ਹੇਠ...` remain prohibited.
\n\n### CP009–CP010 localization approval\n\nProject-owner approval received on 22 September 2026. Hindi and Punjabi V1 for POL-CP-009–010 are approved/frozen. The final pass corrected the CP009 Q65 answer/explanation contradiction, made the integrated hard-question explanations question-specific, and polished remaining Hindi/Punjabi exam wording before merge.\n\n### CP011–CP012 localization review candidate\n\nPOL-CP-011 Parliament Procedure, Bills & Financial Business and POL-CP-012 Supreme Court are implemented as multilingual V1 review candidates. The slice preserves 168 frozen English authority questions exactly and adds native Hindi/Punjabi learner surfaces with CP/QL/difficulty/source/option-order/correct-index parity, numeric/legal-form preservation, CP012 Article 124(3) qualification-overlay guards and native-language editorial checks. Runtime promotion remains blocked until explicit project-owner approval.\n