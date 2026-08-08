# INE-CP-006 English and Exam-Readiness Critical Review

**Review date:** 8 August 2026

**Scope:** 48 deterministic English fixed-map coded-inequality prototypes

## Overall verdict

The logical and decoding layers are strong, and the v2 pack fixes the main readiness weaknesses found in the first self-review. Exam-shaped questions now dominate the pack, use ASCII symbols only, reach eight statements, and include selected three-conclusion cases. Unicode symbols are isolated in guided learning. The result is ready for manual English prototype review and credible Banking/regulatory practice, but it is still a four-option product prototype rather than a universal Banking, SSC, Railways, PSSSB, PPSC, or Punjab previous-year set.

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

### 4. Exam symbols and guided symbols are separated

All chain-solving and conclusion-evaluation records use `ASCII_EXAM_PROFILE`. Geometric and circled operators are confined to `UNICODE_GUIDED_PROFILE`. This prevents decorative glyphs from diluting exam realism or becoming an avoidable rendering dependency in the exam-practice pack.

### 5. The pack is weighted toward exam-shaped work

The review allocation is 20 solve, 20 evaluate, 4 decode, and 4 encode. This puts 40 of 48 records in exam practice and places them before the guided items. Exam questions contain three to eight statements; the full pack now has 8 easy, 7 medium, and 33 hard questions.

### 6. Two- and three-conclusion logic is formally controlled

Conclusion records use two conclusions by default and selected hard three-conclusion cases. Every conclusion is independently evaluated. The correct truth subset and all displayed alternatives are generated from the same formal result. Exactly four unique options are retained. Distinct entity pairs prevent unlabelled either-or leakage.

### 7. Explanations are learner-facing

Each question shows one compact explanation. It decodes the statements, states the conclusion result, and gives the answer. Separate mock/learning blocks, formal proof narration, and distractor-by-distractor commentary are deliberately hidden from the learner.

### 8. Unsupported exam labels are blocked

Exam-practice records are marked `BANKING_REGULATORY_PRACTICE_ONLY`, `ENGLISH_ONLY`, and `MANUAL_REVIEW_REQUIRED`. CP-006 does not claim SSC, Railways, PSSSB, PPSC, Punjabi, Hindi, mock, or PYQ readiness.

## Pack audit

| Measure                                    |                                       Result |
| ------------------------------------------ | -------------------------------------------: |
| Questions                                  |                                           48 |
| Provisional authorities                    |                                            4 |
| Authority allocation                       | 4 decode / 20 solve / 20 evaluate / 4 encode |
| Code-key size                              |                          5 in every question |
| Symbol-shape families                      |                                            4 |
| Distinct deterministic maps in review pack |                                           24 |
| Answer options                             |                                    Exactly 4 |
| Correct-position spread per authority      | 5/5/5/5 exam; 1/1/1/1 guided                |
| Topologies                                 |                                           14 |
| Maximum statements                         |                                            8 |
| Conclusion counts                          |   2, with selected hard 3-conclusion records |
| Minimum exam statements                    |                                            3 |
| Difficulty distribution                    |                  8 easy / 7 medium / 33 hard |
| Exam/guided distribution                   |                           40 exam / 8 guided |
| Permanent QLs                              |                                            0 |

## Readiness scorecard

| Target                      | Concept/practice readiness | Mock/PYQ realism | Decision                                                                                                                  |
| --------------------------- | -------------------------: | ---------------: | ------------------------------------------------------------------------------------------------------------------------- |
| Banking and regulatory      |                       9/10 |           6.5/10 | Strong four-option coded practice; a separate evidence-led five-choice profile is still needed for interfaces that use it |
| SSC and Railways            |                     4.5/10 |             2/10 | Broad symbolic-reasoning relevance only; no verified fixed-map frequency claim                                            |
| Punjab state exams, English |                     4.5/10 |             2/10 | Supplementary practice only; post-specific evidence is still required                                                     |
| Punjab state exams, Punjabi |                       1/10 |             1/10 | Not release-ready without Punjabi rendering and native bilingual QA                                                       |
| Formal logical correctness  |                     9.5/10 |                — | Independent solvers and complete semantic/display validation agree                                                        |
| Explanation quality         |                       9/10 |                — | One concise decoding-first explanation is shown                                                                           |

## Remaining release gates

Before permanent QLs or public release:

1. manually review the downloadable 48-question English pack;
2. calibrate the v2 Banking distribution against a verified, exam-year-labelled PYQ sample;
3. add a separate five-choice response profile only where the source interface requires it;
4. create post-specific SSC, Railways, PSSSB, PPSC, and Punjab evidence ledgers before enabling those labels;
5. complete Punjabi/Hindi rendering and native-language QA before regional release;
6. keep map recovery and missing operators in CP-007.

No permanent QL allocation or release activation is recommended at this stage.
