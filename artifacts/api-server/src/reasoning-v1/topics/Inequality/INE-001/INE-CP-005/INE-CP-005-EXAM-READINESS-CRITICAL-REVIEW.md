# INE-CP-005 English and Exam-Readiness Critical Review

**Review date:** 7 August 2026

**Fresh SSC/Banking/Punjab benchmark:** 7 August 2026

**Scope:** 48 deterministic English prototype questions across four provisional linguistic-inequality authorities

## Overall verdict

The revised pack is ready for manual English prototype review. Its formal reasoning, four-option construction, phrase normalization, and learner explanations are strong. It should be used as guided concept and exam-practice material, not presented as a Banking, SSC, Railways, PSSSB, or PPSC previous-year-question replica.

> **Decision: READY FOR MANUAL PROTOTYPE REVIEW. Keep permanent QLs, Question Studio visibility, and public release disabled.**

## Evidence boundary

| Evidence                                                             | What it supports                                                                                                                                    | What it does not support                                                                |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Aggarwal, PDF 438–443 (printed 27-1–27-6)                            | Five inequality relations, negative-language meanings, four-choice response contracts, chain-first solutions                                        | A claim that marks/salary/height stories are an official Banking or SSC question format |
| Disha, PDF 175–187 (printed 171–183)                                 | Formal relation semantics, no-relation cases, two-conclusion Banking masks, ordinary/coded chains                                                   | The product-wide four-option rule; Disha's dominant mask convention uses five choices   |
| Existing Testbook/Oliveboard benchmark recorded in CP-003 and CP-004 | Competitive platforms emphasize symbolic or coded chains, conclusion masks, and chain-first explanations; four- and five-choice variants both occur | A claim that fully verbal contextual chains are the dominant current platform format    |
| INE-001 end-to-end design                                            | CP-005 ownership of structured linguistic phrases, mixed linguistic/symbolic statements, and contexts                                               | Permission to parse arbitrary prose or move coded-symbol ownership out of CP-006        |

The seven quantity contexts are deliberate product renderings. They improve comprehension and variation but are not labelled as sourced PYQs.

## Fresh exam and platform benchmark

| Benchmark                                                                                                                                                           | Finding                                                                                                                                                                                                                                                              | Effect on CP-005                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| [SSC CGL official syllabus](https://ssc.gov.in/api/attachment/uploads/masterData/Syllabus/CGL-syllabus-169635-.pdf)                                                 | Tier I has 25 General Intelligence and Reasoning questions; the indicative syllabus includes verbal/non-verbal reasoning, relationship concepts, statement-conclusion, symbolic operations, and drawing inferences. It does not name inequality as a separate topic. | Supports broad reasoning relevance only. It does not prove SSC inequality frequency or this exact format.                           |
| [IBPS PO Prelims 24 August 2025 memory-based item](https://testbook.com/question-answer/directionsin-each-of-the-following-question--69f0ce3b1f9ba61fa2baa64a)      | Uses a long symbolic chain, two conclusions, and five response masks.                                                                                                                                                                                                | Confirms that CP-005's four-option, fully verbal records are not direct Banking mock replicas.                                      |
| [Testbook RBI Assistant inequality set](https://testbook.com/questions/rbi-assistant-inequality-questions--64f9e5a525461cb76a6e8cf0)                                | Uses ordinary symbolic statements, two conclusions, and five masks.                                                                                                                                                                                                  | Supports the chain engine, but the source-shaped mock surface belongs mainly to CP-003/CP-004/CP-006.                               |
| [Oliveboard inequality practice, April 2026](https://www.oliveboard.in/blog/inequalities-questions-quiz/)                                                           | Includes four-choice concept checks for negative linguistic phrases, strongest relations, and no-definite-relation cases.                                                                                                                                            | Directly supports CP-005 as four-option concept practice, not as a full exam section replica.                                       |
| [Punjab Government IT-cadre recruitment](https://dit.punjab.gov.in/wp-content/uploads/2021/09/Detailed-Advertisement-for-the-recruitment-of-293-IT-Cadre-Posts.pdf) | Its general section includes mental ability and reasoning at Bank PO level.                                                                                                                                                                                          | Shows that Banking-level reasoning can be relevant to some Punjab recruitments, but cannot be generalized to every PSSSB/PPSC post. |
| Current PSSSB/PPSC syllabus evidence                                                                                                                                | Public syllabi use broad labels such as logical reasoning, analytical ability, mental ability, and problem solving; an official inequality subtopic or stable question frequency was not verified.                                                                   | Punjab labelling must remain broad and post-specific. Punjabi rendering and a verified Punjab-paper corpus are still required.      |

## Critical findings and changes made

### 1. A displayed-answer orientation defect was found and fixed

The first generated pack could reverse the query independently from a single interpretation statement. For example, an internal statement equivalent to `B < D` could display `D < B` as the marked answer. The solver state was sound, but the learner-facing option was wrong.

The query now inherits the exact orientation of the interpreted statement. Validation also re-renders every option from its stored semantic relation and rejects any label/meaning mismatch. This is now a permanent automated safeguard.

### 2. Contextual grammar and entity realism were corrected

- `marks is` was changed to `marks are`;
- price comparisons now use `the price of Product A` rather than assigning a price to a person's name;
- production comparisons use plant labels;
- contextual question stems name the property being compared, such as a person's marks or salary.

### 3. Explanations were rewritten for learners

The solutions now quote each verbal comparison, state its symbolic meaning, connect only the relevant chain, and explain why each wrong option fails. Feedback distinguishes reversed direction, excessive certainty, equality that is not forced, weak versus strongest relations, and indeterminate cases. It no longer repeats one generic warning for all distractors.

### 4. The Banking label was downgraded

The contextual two-conclusion authority previously used `BANKING_MOCK_PROTOTYPE`. The response-mask logic is Banking-shaped, but the fully linguistic contexts are product adaptations rather than directly evidenced official mock forms. Its delivery profile is now `EXAM_PRACTICE_PROTOTYPE`.

### 5. Difficulty labels were recalibrated

The first revision marked every two-conclusion question as hard, including short two-statement items. Difficulty now reflects the actual reasoning burden:

- one-statement interpretation and direct linguistic relation questions are easy;
- short chains and two-statement conclusion questions are medium;
- mixed or conclusion questions with three or more statements, and any four-statement chain, are hard.

## Pack audit

| Measure                                     |        Result |
| ------------------------------------------- | ------------: |
| Questions                                   |            48 |
| Provisional authorities                     |             4 |
| Questions per authority                     |            12 |
| Answer options per question                 |     Exactly 4 |
| Correct-position distribution per authority | 3 / 3 / 3 / 3 |
| Structured phrase keys covered              |             8 |
| Canonical relations covered                 |             5 |
| Contexts covered                            |             8 |
| Topologies covered                          |            19 |
| Maximum statements                          |             4 |
| Permanent QLs                               |             0 |

Final difficulty distribution after recalibration: 14 easy, 22 medium, and 12 hard.

## Readiness scorecard

| Target                      | Concept/practice readiness | Mock/PYQ realism | Decision                                                                             |
| --------------------------- | -------------------------: | ---------------: | ------------------------------------------------------------------------------------ |
| Banking prelims             |                     8.5/10 |           5.5/10 | Use for phrase mastery and chain practice; do not market as a full Banking mock pack |
| SSC and Railways            |                     6.5/10 |           3.5/10 | Broad reasoning fit only; no verified exam-frequency or exact-format claim           |
| Punjab state exams, English |                       6/10 |           3.5/10 | Useful supplementary reasoning practice; keep PSSSB/PPSC labels off                  |
| Punjab state exams, Punjabi |                     2.5/10 |           1.5/10 | Not release-ready until Punjabi rendering and bilingual QA are complete              |
| Formal logical correctness  |                     9.5/10 |                — | Solver agreement and display-semantic validation are strong                          |
| Explanation quality         |                       9/10 |                — | Natural, explicit, and option-specific after revision                                |

## Exam-readiness judgement

### Banking

The chain reasoning and two-conclusion evaluation are relevant to Banking preparation. However, current memory-based and platform items are commonly longer symbolic chains with five governed masks, including either-or. CP-005 is therefore a language-comprehension bridge into Banking inequality, not a complete Banking mock checkpoint.

### SSC, Railways, and state exams

The direct phrase interpretation and short relation chains are suitable concept practice wherever inequality reasoning appears. SSC's official syllabus supports broad statement-conclusion, symbolic-operation, relationship, and inference skills, but does not separately name inequality. The available evidence therefore does not justify labelling these records SSC/Railways PYQs or claiming a verified frequency and difficulty distribution.

### Punjab state exams

The English pack can be used as supplementary logical-reasoning practice for Punjab recruitments whose notified syllabus includes mental ability or Banking-level reasoning. That scope must remain post-specific. Public Punjab readiness additionally requires:

- a verified corpus of PSSSB/PPSC/Punjab Police/Patwari questions;
- Punjabi stems, statements, options, and explanations;
- bilingual terminology QA by a native reviewer;
- post-specific difficulty and time calibration.

### Four-option rule

Every record has exactly four unique options, following the product requirement and the four-choice Aggarwal convention. Because Disha and some Banking platform sets use five masks, the pack must be described as a four-option product variant rather than a universal exam interface.

## Remaining release gates

Before any permanent QL or public release decision:

1. manually review the downloadable English pack;
2. approve or revise the eight phrase contracts and contextual tone;
3. retain the distinction between concept/exam-practice content and verified PYQ/mock content;
4. begin Hindi and Punjabi rendering only after English approval;
5. leave coded-symbol mapping to CP-006.

For full mock readiness, later checkpoints must also supply longer ordinary/coded chains, five-mask Banking variants where required, either-or integration, and verified exam-specific scheduling.

No permanent QL allocation or release activation is recommended at this stage.
