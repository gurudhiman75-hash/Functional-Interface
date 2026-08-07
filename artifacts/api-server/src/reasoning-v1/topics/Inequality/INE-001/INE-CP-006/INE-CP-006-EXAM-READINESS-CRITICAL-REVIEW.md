# INE-CP-006 English and Exam-Readiness Critical Review

**Review date:** 7 August 2026

**Scope:** 48 deterministic English fixed-map coded-inequality prototypes

## Overall verdict

The logical and decoding layers are strong and the revised pack is ready for manual English prototype review. Its coded-chain and coded-conclusion authorities are substantially closer to Banking and regulatory exam practice than CP-005's fully verbal variants. It is still a four-option product prototype, not a universal Banking, SSC, Railways, PSSSB, or PPSC previous-year set.

> **Decision: READY FOR MANUAL PROTOTYPE REVIEW. Keep permanent QLs, Question Studio visibility, localization, and public release disabled.**

## Evidence reviewed

| Evidence                                                                                                                                               | Relevant finding                                                                                                                               | Runtime decision                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Aggarwal, PDF 439–443 (printed 27-2–27-6)                                                                                                              | Complete coded mappings, ordinary/coded chains, four response choices, and chain-first solutions                                               | Primary support for fixed-map coding and the product's four-option variant                           |
| Disha, PDF 177–187 (printed 173–183)                                                                                                                   | Complete coded mappings, two/three conclusions, five response masks, and worked chain solutions                                                | Primary Banking-shape support; five-choice convention recorded rather than silently copied           |
| [Testbook RBI Grade B coded inequalities](https://testbook.com/questions/rbi-grade-b-coded-inequalities-questions--66335a79f49b44d638944e63)           | Current practice uses a complete verbal code key, coded chains, coded conclusions, and five masks                                              | Strong surface-shape support for decode/solve/evaluate; confirms that four choices are not universal |
| [Oliveboard RBI Grade B 2024 PYQ](https://www.oliveboard.in/question-answer/pyq-choose-the-correct-option-which-contains-the-signs-of-inequality-that) | Requires choosing missing inequality signs that make conclusions true                                                                          | Explicitly excluded from CP-006 and reserved for CP-007                                              |
| [SSC CGL official syllabus](https://ssc.gov.in/api/attachment/uploads/masterData/Syllabus/CGL-syllabus-169635-.pdf)                                    | Includes symbolic operations, statement-conclusion, relationships, and drawing inferences, but does not name inequality separately             | Supports broad reasoning relevance only, not SSC mock or frequency claims                            |
| Punjab recruitment evidence                                                                                                                            | Some notified Punjab posts use mental ability or Bank PO-level reasoning, but no stable PSSSB/PPSC fixed-map inequality frequency was verified | Keep Punjab use supplementary and post-specific; Punjabi rendering remains required                  |

## Critical findings and safeguards

### 1. The code key is always complete

Each question supplies five distinct symbols mapped bijectively to `>`, `<`, `=`, `≥`, and `≤`. The validator reconstructs the visible key from the structured map. A missing or duplicated mapping invalidates the record.

### 2. Decoding is separate from inference

The generator never treats a decorative code symbol as logical authority. It first normalizes the symbol through the supplied key, then sends canonical relations to the graph and model-enumeration solvers.

### 3. Four options are a deliberate product variant

Every record has exactly four unique options, supported by the Aggarwal source and the user's product rule. Disha and current Banking/regulatory practice frequently use five governed masks. CP-006 must not claim to reproduce every IBPS/SBI/RBI interface.

### 4. Either-or leakage is blocked

The four conclusion masks are Only I, Only II, Both, and Neither. The scenario builder and validator require the two conclusions to concern different entity pairs, preventing a complementary pair from being incorrectly labelled Neither. Either-or reasoning remains owned by CP-004 and can be integrated later under an explicit response contract.

### 5. Explanations are learner-facing

Every solution identifies the relevant code symbol, states its ordinary meaning, decodes the chain, and only then evaluates the requested relation. Distractor feedback distinguishes wrong code selection, reversed direction, excessive certainty, equality not forced, weaker inclusive relations, and indeterminate cases.

## Pack audit

| Measure                                     |                       Result |
| ------------------------------------------- | ---------------------------: |
| Questions                                   |                           48 |
| Provisional authorities                     |                            4 |
| Questions per authority                     |                           12 |
| Code-key size                               |          5 in every question |
| Symbol-shape families                       |                            4 |
| Distinct deterministic maps                 |                           12 |
| Answer options                              |                    Exactly 4 |
| Correct-position distribution per authority |                3 / 3 / 3 / 3 |
| Topologies                                  |                           17 |
| Maximum statements                          |                            4 |
| Difficulty distribution                     | 26 easy / 15 medium / 7 hard |
| Permanent QLs                               |                            0 |

## Readiness scorecard

| Target                      | Concept/practice readiness | Mock/PYQ realism | Decision                                                                                              |
| --------------------------- | -------------------------: | ---------------: | ----------------------------------------------------------------------------------------------------- |
| Banking and regulatory      |                       9/10 |           6.5/10 | Strong coded practice; add five-mask profiles and longer source-calibrated sets before mock labelling |
| SSC and Railways            |                     5.5/10 |           2.5/10 | Broad symbolic-reasoning relevance only; no verified fixed-map frequency claim                        |
| Punjab state exams, English |                       5/10 |           2.5/10 | Supplementary practice only; keep PSSSB/PPSC labels off                                               |
| Punjab state exams, Punjabi |                     1.5/10 |             1/10 | Not release-ready without Punjabi rendering and bilingual QA                                          |
| Formal logical correctness  |                     9.5/10 |                — | Independent solvers and complete semantic/display validation agree                                    |
| Explanation quality         |                       9/10 |                — | Natural and explicit after the decoding-first rewrite                                                 |

## Remaining release gates

Before permanent QLs or public release:

1. manually review the downloadable 48-question English pack;
2. approve the four symbol families and key wording;
3. retain separate four- and five-option exam profiles where evidence requires them;
4. calibrate longer Banking/regulatory chains against verified PYQs;
5. complete Punjabi/Hindi rendering and native-language QA before regional release;
6. keep map recovery and missing operators in CP-007.

No permanent QL allocation or release activation is recommended at this stage.
