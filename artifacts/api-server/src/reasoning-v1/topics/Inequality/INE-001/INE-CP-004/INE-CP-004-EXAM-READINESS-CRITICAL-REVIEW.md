# INE-CP-004 Exam-Readiness Critical Review

**Review date:** 7 August 2026

**Reviewed branch:** `design/ine-cp004-complementary-discovery`

**Review sample:** all 48 English prototype records, 12 per provisional authority

**Book audit:** all relevant pages in the four supplied PDFs

## Overall verdict

**The revised logical engine and Banking-shaped records are ready for manual prototype review, but CP-004 is not a standalone SSC or Banking mock set.**

The formal either-or proof is strong. Every accepted pair is individually non-definite, mutually exclusive, and exhaustive over the relation domain permitted by the statements. Reversed conclusions, strict/equality pairs under an inclusive bound, and strict/inclusive pairs over a fully undetermined relation are all checked by the graph solver and independent model enumerator.

The learner-facing pack needed three corrections: more natural exam language, shorter mock solutions, and longer source-shaped structures. Those changes are now implemented. Four new topologies raise the total to twelve and add five-relation cases without increasing the solver beyond six entities.

The product-wide four-option rule is supportable from the Aggarwal source, whose two- and three-conclusion questions use four choices. Disha and many Testbook Banking sets use five choices, so this pack must be described as a **four-option product variant**, not as the only Banking convention.

> **Decision: READY FOR MANUAL PROTOTYPE REVIEW. Keep permanent QLs, Question Studio visibility, and public release disabled.**

## Evidence reviewed

| Source                                                                                                                                | Relevant material                         | Finding                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Premil Aggarwal and Tanuj Aggarwal, _A New Approach to Reasoning for Competitions_                                                    | PDF 438-443; printed 27-1 to 27-6         | Four-choice ordinary and coded inequalities; explicit complementary-pair rules; two- and three-conclusion Banking examples; short chain-first solutions |
| Gajendra Kumar and Abhishek Banerjee, _Verbal & Non-Verbal Reasoning for Competitive Exams with Practice Sets_                        | PDF 175-187; printed 171-183              | Five-choice Banking convention; two/three conclusions; ordinary and coded forms; longer chains and source difficulty bands                              |
| Jaikishan and Premkishan, _How to Crack Test of Reasoning in All Competitive Exams_                                                   | PDF 176-180; printed 170-174              | Auxiliary coded-relation and conclusion-mask evidence, not a primary standalone Inequality chapter                                                      |
| Meenakshi Upadhyay and Arun Sharma, _How to Prepare for Verbal Ability and Reading Comprehension for CAT_                             | Whole-book metadata and inequality search | Excluded: occurrences concern passage subject matter, not reasoning inequalities                                                                        |
| [Testbook SBI Clerk inequality questions](https://testbook.com/questions/hn/sbi-clerk-inequality-questions--64f1d966af6e40dc250c1999) | Current public practice page              | Long chained statements, two conclusions, five response masks, and either-or examples                                                                   |
| [Testbook inequality reasoning guide](https://testbook.com/reasoning/inequality-reasoning)                                            | Current public concept and sample page    | Two/three-conclusion forms, five-mask examples, chain-first solutions, and either-or results                                                            |
| [Oliveboard IBPS PO inequality practice](https://www.oliveboard.in/blog/inequality-for-ibps-po/)                                      | Current four-choice practice set          | Confirms a current four-choice Banking variant, though its displayed sets commonly omit the either-or mask                                              |
| [Oliveboard inequality concepts](https://www.oliveboard.in/blog/inequality-questions/)                                                | Current concept guide                     | Reinforces chain combination, ordinary/coded relations, and broad Banking/SSC/RRB/state-exam teaching use                                               |

## Measured pack audit after remediation

| Measure                           |                                                 Result | Assessment                                                            |
| --------------------------------- | -----------------------------------------------------: | --------------------------------------------------------------------- |
| Records                           |                                                     48 | Adequate checkpoint review sample                                     |
| Provisional authorities           |                                                      4 | Two guided and two Banking mock prototypes                            |
| Options per record                |                                                      4 | Product rule satisfied without duplicate text                         |
| Correct answer positions          | 12 / 12 / 12 / 12 overall; 3 / 3 / 3 / 3 per authority | No positional leakage                                                 |
| Graph topologies                  |                                                     12 | Improved structural coverage                                          |
| Statement counts                  |       4 records with 2; 20 with 3; 8 with 4; 16 with 5 | Includes longer source-shaped cases                                   |
| Difficulty                        |                                     22 medium; 26 hard | Hardness now depends on structure and task, not only conclusion count |
| Pair classifications              |           Valid either-or, incomplete, and overlapping | All three guided classes covered                                      |
| Reversed conclusion pairs         |                                                     41 | Strong reversal coverage                                              |
| Conditional strict/equality cases |                                                     22 | Required inclusive-domain coverage                                    |
| Universal strict/inclusive cases  |                                                     18 | Required fully undetermined-domain coverage                           |
| Banking mock-solution length      |                                     247-421 characters | Concise enough for exam review                                        |
| Permanent QLs                     |                                                      0 | Release gate preserved                                                |

## What is ready

### Formal correctness

The solver does not accept a pair merely because symbols look complementary. It enumerates the valid atomic relations and proves that exactly one conclusion must hold. This correctly rejects overlapping pairs and pairs that omit a possible equality case.

### Four-option construction

Every question now has exactly four unique choices. Classification uses a meaningful fourth misconception, while two-conclusion mock records select three governed distractors around the either-or answer. Across the review sample, all five response masks still receive distractor coverage.

### Natural explanations

Mock solutions now lead with the useful chain, state the remaining possibilities in ordinary language, and finish with the answer. Pair-selection mock solutions prove the correct option only; the learning explanation retains the full distractor audit.

### Structural realism

The pack now includes direct inclusive relations, equality bridges, free-endpoint branches, shared bounds, three-edge weak chains, five displayed relations, controlled irrelevant evidence, and a separately definite conclusion combined with an either-or pair.

## Boundaries that must remain visible

### CP-004 cannot be assembled alone

Every exam-facing CP-004 record contains an either-or result by checkpoint ownership. Serving a CP-004-only mock would leak the semantic answer even though option positions are balanced. Runtime metadata therefore requires these records to be mixed with CP-003 records whose correct outcomes are Only I, Only II, Both, or Neither.

### SSC readiness is limited

The four-choice rule and ordinary-symbol reasoning are compatible with SSC practice, but the supplied primary evidence is predominantly Banking-shaped. The guided classification authorities may support SSC concept practice; they must not be marketed as SSC previous-year or SSC-standard mock questions. Direct SSC relation-selection formats should remain with the checkpoint that owns direct conclusion evaluation.

### Banking conventions vary

Aggarwal supports four choices, while Disha and current Testbook Banking banks commonly show five. The present four-choice implementation follows the product requirement and a valid source convention. It should not claim universal replication of IBPS/SBI interfaces.

### Coded inequalities are out of scope

The sources contain extensive coded-symbol questions. CP-004 proves the underlying relation logic only. Coded presentation must remain in the later coded-inequality checkpoint so decoding errors do not contaminate complementary reasoning.

## Readiness scores

| Area                           |  Score |
| ------------------------------ | -----: |
| Formal logical correctness     | 9.7/10 |
| Option correctness             | 9.5/10 |
| Four-option product compliance |  10/10 |
| Explanation naturalness        | 8.8/10 |
| Structural diversity           | 8.5/10 |
| Banking prototype realism      | 8.6/10 |
| SSC concept readiness          | 7.5/10 |
| SSC mock realism               | 5.5/10 |
| Standalone mock safety         |   4/10 |
| Mixed-pack mock safety         |   9/10 |
| Production release readiness   |   7/10 |

## Release recommendation

Approve or reject the regenerated English pack manually. If approved, allocate permanent QLs only with an assembly rule that mixes CP-004 either-or records with CP-003 non-complementary outcomes. Do not enable Question Studio or public release as part of this review decision alone.
