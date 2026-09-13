# Logic Puzzles LP-001 → LP-011 — Source Provenance Wave 02 Evidence Ledger

Status: **EVIDENCE LEDGER COMPLETE FOR CURRENT RETRIEVAL PASS — production gate remains closed.**

Date: 2026-09-13

## Purpose

Wave 02 converts the chapter-wide provenance policy from Wave 01 into a source-by-source evidence ledger. This is an evidence/governance checkpoint only. It does not change generators, permanent QL ownership, localization, Question Studio behavior, Question Bank eligibility, test/mock eligibility or public delivery.

Current permanent chapter registry remains `LP-QL-001..047`. `LP-QL-048` remains unallocated.

## Evidence classes

| Class | Meaning | Allowed use |
|---|---|---|
| A — official item-level paper | durable official paper/question content from examining body | strongest evidence for topology/query-frequency claims |
| B — official exam notice/handout/syllabus | official structure, syllabus or illustrative questions | proves scope/format; not historical frequency by itself |
| C — clearly labelled memory/recall corpus | candidate-recalled paper reconstructed by established prep platform | trend/frequency evidence only; never described as official |
| D — books/coaching references | pedagogical/reference material | wording, explanation and variety discovery only |

A source-saturation claim must not silently promote Class B/C/D evidence into Class A.

## SSC lane

### Official evidence recovered

1. **SSC CHSL 2024 final-answer-key notice** — SSC states that Final Answer Keys together with Question Paper(s) were uploaded on 16 October 2024 and that candidates could print them only during the specified login window.
   - source: https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Final%20Answer%20Key%20and%20marks%20CHSLE%202024%20Tier-I161024.pdf
   - class: B, with confirmation that A-class papers existed inside a time-limited candidate-access flow.

2. **SSC CHSL 2024 tentative-answer-key notice** — confirms candidate-login answer-key/question-paper workflow.
   - source: https://ssc.gov.in/api/attachment/uploads/masterData/AnswerKeys/Write-Up%20for%20Tentative%20Answer%20Keys%20CHSLE%202024.pdf
   - class: B.

3. **SSC current candidate portal** exposes a `Previous Year Question Paper` resource area, confirming that previous-paper retrieval is an official SSC concept even though the indexed CGL exam page currently exposes no durable item-level payload through this retrieval pass.
   - source: https://ssc.gov.in/
   - class: B for availability policy; no item-level mapping claimed from the page itself.

### Retrieval result

This pass did **not** recover a durable public SSC URL exposing a full historical CGL/CHSL/CPO reasoning paper item-by-item outside the candidate/login expiry flow. Therefore no fabricated item-level SSC mapping is recorded here.

### Coverage disposition

- SSC official evidence proves that genuine question papers exist and are issued with answer-key workflows.
- It does **not yet** justify an item-frequency matrix for Logic Puzzle subfamilies from the material recovered in this pass.
- Existing Logic Puzzle implementation should therefore continue using conservative SSC exam-profile weighting rather than Banking-style puzzle density.
- SSC lane remains `PARTIALLY_EVIDENCED`, not `SOURCE_SATURATED`.

## Banking / IBPS lane

### Official evidence recovered

1. **IBPS FAQ — historical papers unavailable by policy.** IBPS explicitly states that it does not provide answer-sheet copies, question papers or right/model answer keys.
   - source: https://www.ibps.in/index.php/faq/
   - class: B governance evidence.
   - consequence: absence of official historical IBPS papers is a source-policy limitation, not a missing-research excuse.

2. **IBPS CRP-RRB XIV notification** — Reasoning carries 40 questions in Officer Scale-I prelims and 40 questions in relevant mains structures; Punjab is one of the supported test-language states.
   - source: https://www.ibps.in/wp-content/uploads/CRP-RRBs-XIV_Final_AD-19.9.25.pdf
   - class: B.

3. **IBPS RRB XIV information handout** — contains illustrative Reasoning questions and explicitly warns that samples are illustrative, not exhaustive, and actual questions may include other types/higher difficulty.
   - source: https://www.ibps.in/wp-content/uploads/RRB-Officer-Assistant-PRE-XIV-IH-EN-2025.pdf
   - class: B.

### Recall corpus recovered

The following are deliberately retained as Class C only:

| Source | Exam/date | Observed puzzle families | Disposition |
|---|---|---|---|
| PracticeMock memory-based analysis | IBPS Clerk Prelims, 4 Oct 2025, multiple shifts | circular seating, floor puzzle, month puzzle, comparison puzzle, box puzzle, square arrangement, sequence/certain-number forms | supports high puzzle density and variety; not official |
| BankersAdda memory-based paper/analysis | IBPS RRB PO Prelims 2025 | memory-based full-paper lane | corroborative recall source |
| BankersAdda exam analysis | IBPS RRB Officer Scale II 2025 | day+book-launch puzzle, date/month+variable puzzle, circular+variable, uncertain seating; four 5-question puzzle sets reported | strong trend evidence for mixed-variable and multi-set Banking reasoning |
| Testbook previous-year page | IBPS PO 2024–2025 | multiple shift-labelled memory-based papers | corroborative recall inventory; not official |
| Testbook previous-year page | IBPS Clerk 2025 | multiple shift-labelled memory-based papers | corroborative recall inventory; not official |

Reference URLs:
- https://www.practicemock.com/blog/ibps-clerk-prelims-memory-based-questions/
- https://www.bankersadda.com/ibps-rrb-po-prelims-memory-based-paper-2025-attempt-and-download-pdfs/
- https://www.bankersadda.com/ibps-rrb-officer-scale-2-exam-analysis-2025/
- https://testbook.com/ibps-po/previous-year-papers
- https://testbook.com/ibps-clerk/previous-year-papers

### Banking coverage implications

The recovered recall evidence reinforces—not newly invents—the current chapter architecture:

- month/date/day scheduling → LP-008/009/010;
- box puzzle → LP-003 and box+attribute LP-011 where an independent attribute is present;
- floor puzzle → owned by Floor/Flat Arrangement, not duplicated into Logic Puzzles;
- circular/square/uncertain seating → owned by Seating Arrangement;
- comparison-only forms → Ranking/Order unless a genuine multi-attribute assignment state exists;
- mixed-variable/date/month forms → existing LP-005/006/007/008/009/010 depending hidden-state contract.

No recovered Banking recall family justifies `LP-QL-048` in this pass. The strongest observed patterns map to existing owners or adjacent chapters.

Banking lane status: `TREND_SATURATION_IMPROVING_WITH_CLASS_C`, but not `OFFICIAL_ITEM_LEVEL_SATURATED` because IBPS policy makes that impossible through official historical papers.

## Punjab lane

### Official evidence recovered

1. **PPSC Assistant District Attorney 2022 advertisement** — written paper has 120 questions, including a 20-question combined Part B covering Logical Reasoning, Mental Ability and General Knowledge. It states that the answer key will be uploaded after the examination and objections permitted.
   - source: https://punjab.gov.in/wp-content/uploads/2022/05/Advertisement-for-the-Post-of-Assistant-District-Attorney.pdf
   - class: B.

2. **PPSC Deputy District Attorney 2022 advertisement** — same 120-question structure with 20-question Logical Reasoning/Mental Ability/General Knowledge Part B and post-exam answer-key process.
   - source: https://punjab.gov.in/wp-content/uploads/2022/04/Recruitment-for-the-post-of-DDA.ashx_.pdf
   - class: B.

3. **Punjab Government recruitment archive** remains an official discovery lane for department-specific recruitment records.
   - source: https://punjab.gov.in/recruitments/
   - class: B discovery index.

### Retrieval result

This pass did **not** recover a durable official PPSC/PSSSB question-paper archive containing item-level logical-reasoning questions for the targeted Punjab recruitment examinations. Search against Punjab Government/PPSC/PSSSB official domains recovered exam-pattern/advertisement material but not a stable item-level question-paper corpus.

### Punjab disposition

- Official evidence now proves Logical Reasoning is a real assessed component in at least two year-tagged 2022 PPSC recruitment advertisements.
- It does **not** prove which Logic Puzzle families, if any, appeared in those papers.
- No Punjab-specific puzzle weighting, context profile or new QL may be justified from these notices alone.
- Punjab lane remains the principal blocker for a chapter-wide target-exam source-saturation declaration.

## Cross-source topology comparison

| Observed source-facing family | Current owner | Gap? |
|---|---|---|
| month/date/day schedule | LP-008/009/010 | no semantic gap observed |
| box-only vertical order | LP-003 | no semantic gap observed |
| box + independent attribute | LP-011 / QL-041..044 | covered |
| mixed person × attribute × place | LP-005 | covered |
| day × subject/study-area × city | LP-006 + QL-045/046 projections | covered |
| variable/preference assignment | LP-007 | covered |
| additional-condition / counterfactual child | LP-QL-047 | covered |
| floor/flat | Floor/Flat Arrangement | correct adjacent owner |
| circular/square/uncertain seating | Seating Arrangement | correct adjacent owner |
| comparison ordering | Ranking/Order | correct adjacent owner |

Wave 02 therefore finds **no evidence-backed reason to allocate `LP-QL-048`.**

## Convergence assessment

### What improved

- SSC access mechanics and official-paper existence are now documented accurately.
- IBPS official-paper absence is documented as an explicit examining-body policy.
- Banking puzzle density has multi-source, shift/year-labelled recall support.
- Punjab now has year-tagged official reasoning-scope evidence from 2022 PPSC advertisements.

### What remains missing

1. SSC: durable item-level official paper extraction sufficient to map actual LP families across more than one exam/year.
2. Banking: a normalized multi-year recall ledger at **caselet level**, not just topic-summary level, with duplicates across platforms collapsed.
3. Punjab: at least one durable year-tagged official question paper, official response-sheet archive, or equivalent first-party item-level source containing reasoning questions.
4. Convergence: demonstrate that another evidence wave adds no new hidden-state/query contract before considering `SOURCE_SATURATED_FOR_TARGET_EXAMS = true`.

Current convergence status: **NOT YET PROVEN**. Wave 02 is evidence accumulation, not a production-promotion checkpoint.

## Production decision

`SOURCE_SATURATED_FOR_TARGET_EXAMS = false`

`PRODUCTION_ELIGIBLE = false`

Question Bank writes, test/mock eligibility and public/automatic learner delivery remain closed.

## Wave 03 recommendation

Wave 03 should not add more generator code. It should:

1. retrieve/normalize SSC item-level papers from official previous-paper/answer-key archives where durable access is possible;
2. create a de-duplicated Banking recall caselet ledger from at least three independent platforms across multiple 2024–2025 exam dates;
3. continue the Punjab first-party paper hunt across PPSC/PSSSB/recruiting-department archives;
4. record every newly observed caselet as `existing owner`, `adjacent owner`, `variation only`, or `new semantic contract`;
5. allocate `LP-QL-048` only if a new semantic contract survives that ownership test.
