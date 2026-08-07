# INE-CP-003 Book and Platform Critical Review

**Review date:** 7 August 2026

**Reviewed branch:** `design/ine-cp003-conclusion-discovery`

**Implementation commit:** `172054323371c3b35a6352214210b5b859405929`

**Review sample:** all 72 English records, 12 per provisional authority

**Book audit:** all relevant pages in the four supplied PDFs

## Overall verdict

**The logical engine is strong, but the pack is not yet ready to represent SSC or banking mock questions.**

The book audit confirms the earlier platform review. CP-003 correctly distinguishes conclusions that must be true, can be true, and cannot be true. It handles strict and inclusive relations formally and supplies supporting and rejecting arrangements for non-definite claims. These are valuable guided-learning features.

The mismatch is the learner-facing contract. The two primary book chapters mainly present two or three numbered conclusions and ask the learner to choose a response mask such as `Only I`, `Only II`, `Either I or II`, `Neither`, or `Both`. CP-003 instead asks learners to select one direct conclusion, classify one conclusion, or identify the complete relation set. Those are useful diagnostic tasks, but they are not the dominant source-shaped banking format.

> **Decision: CONDITIONAL HOLD — retain the CP-003 solver and prototype authorities, but do not allocate permanent QLs or release the current records as SSC/banking mocks.**

## Post-review implementation update

The required code changes from this review were completed on 7 August 2026. The user subsequently approved the revised 84-question English pack. It remains unreleased because permanent QL allocation and Question Studio exposure are separate lifecycle decisions.

| Review finding                                                    | Implemented response                                                                                                       |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Four choices were forced onto a three-outcome classification task | Classification now uses exactly three meaningful options                                                                   |
| Routine contradiction distractor                                  | Removed from every CP-003 learner-facing option set                                                                        |
| No source-shaped multi-conclusion contract                        | Added `EVALUATE_TWO_CONCLUSIONS` with Only I, Only II, Neither, and Both masks                                             |
| Either-or ownership risk                                          | Complementary/either-or proof remains explicitly reserved for CP-004                                                       |
| SSC/Banking labels overclaimed readiness                          | Replaced by `GUIDED_CONCEPT`, `DIAGNOSTIC_PRACTICE`, and `MOCK_FORMAT_PROTOTYPE`                                           |
| Robotic explanations                                              | Replaced by decisive-chain-first mock solutions and natural witness explanations                                           |
| Equality links hidden from explanations                           | Equality statements used in a proof are now shown in the learner-facing chain                                              |
| Six underlying structures                                         | Expanded to 12 normalized graph topologies, including long chains, branches, independent chains, and irrelevant statements |
| Missing record provenance                                         | Every authority now carries exact source-ledger IDs and a normalized structural fingerprint                                |

The original findings below are retained as the audit record. Items described as blockers should be read together with this remediation table.

## Book audit and source roles

| Supplied PDF                                                                                                   | Relevant pages inspected                          | Source role | Finding                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Premil Aggarwal and Tanuj Aggarwal, _A New Approach to Reasoning for Competitions_                             | PDF 438–443; printed 27-1–27-6                    | Primary     | Dedicated Inequalities chapter: ordinary and coded statements, two/three conclusions, four response masks, and chain-first solutions            |
| Gajendra Kumar and Abhishek Banerjee, _Verbal & Non-Verbal Reasoning for Competitive Exams with Practice Sets_ | PDF 175–187; printed 171–183                      | Primary     | Dedicated Inequality chapter with 87 questions across four difficulty bands; mainly two/three conclusions and five banking-style response masks |
| Jaikishan and Premkishan, _How to Crack Test of Reasoning in All Competitive Exams_                            | PDF 176–180; printed 170–174                      | Auxiliary   | Mathematical Operations chapter; only its coded relational conclusion examples are relevant to response-mask design                             |
| Meenakshi Upadhyay and Arun Sharma, _How to Prepare for Verbal Ability and Reading Comprehension for CAT_      | Whole-book metadata and inequality search checked | Excluded    | This is a verbal-ability/reading-comprehension book. Its uses of “inequality” concern passage content, not reasoning inequalities               |

The detailed record is in [INE-CP-003-SOURCE-LEDGER.md](./INE-CP-003-SOURCE-LEDGER.md).

### What the books establish

1. **The primary exam-shaped task is multi-conclusion evaluation.** Disha normally uses two conclusions with five response masks. Aggarwal uses two or three conclusions with four source-specific masks.
2. **A merely possible conclusion does not “follow.”** Unless possibility is explicitly asked, the source task is to identify conclusions guaranteed by the statements.
3. **Ordinary and coded forms both matter.** Coded symbols are a separate presentation layer over the same relation logic and should remain owned by the coded checkpoint.
4. **Solutions are chain-first.** They combine the decisive statements, derive the endpoint relation, and then mark each conclusion.
5. **Either-or is central but belongs to CP-004.** CP-003 may support non-complementary `Only I`, `Only II`, `Neither`, and `Both` masks; CP-004 should prove and own complementary pairs.
6. **Routine contradiction options are not source-shaped.** The books tell the learner to assume the statements are true. Contradiction detection belongs in validation, not as a repeated distractor.
7. **Difficulty is not just chain length.** Disha’s difficult section includes missing-symbol and expression-selection tasks that belong to later checkpoints. CP ownership must not be blurred merely to imitate its difficulty labels.

### Source-semantic caution

Aggarwal teaches learner shortcuts such as “priority of symbols.” These are useful summaries but must not replace formal entailment. In particular, the runtime must preserve the mathematical rule that a proven strict relation also satisfies its matching inclusive conclusion: `A > B` guarantees `A ≥ B`.

Where an individual source item or public platform conflicts with formal semantics, record the convention or editorial error in provenance; do not weaken the solver to reproduce it.

## Source-design alignment

| CP-003 requirement                                                          | Current implementation                                                         | Assessment               |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------ |
| Distinguish definite, possible, and impossible conclusions                  | All three classes are generated and independently checked                      | Pass                     |
| Determine all possible atomic relations                                     | 12 relation-set records cover one-, two-, and three-relation domains           | Pass as guided learning  |
| Test inclusive conclusions without promoting `≥` or `≤` to strict relations | Dedicated inclusive authority; balanced truth classes                          | Pass                     |
| Provide witnesses for non-definite claims                                   | Supporting and rejecting numeric arrangements are emitted                      | Pass                     |
| Use all five ordinary symbols                                               | `>`, `<`, `=`, `≥`, and `≤` all occur                                          | Pass                     |
| Preserve a formal solver rather than textbook priority guessing             | Graph solver and finite-model enumerator agree                                 | Strong pass              |
| Match book-shaped conclusion/option contracts                               | No numbered conclusion-mask authority exists                                   | Blocker for mock release |
| Attach exact source provenance                                              | Supplied-book ledger now exists; record-level mapping is still absent          | Partial                  |
| Demonstrate source saturation                                               | Four supplied books are classified; broader saturation is not yet demonstrated | Pending                  |

## Platform benchmark

The current platform evidence agrees with the two primary books:

- [Testbook mathematical inequality quiz](https://testbook.com/blog/mathematical-inequality-quiz-1-for-banking-and-insurance/) — multiple conclusions, five response choices, combined-chain solutions.
- [Oliveboard inequality practice](https://www.oliveboard.in/blog/inequalities-questions-quiz/) — direct concept checks, inclusive-relation rules, blocked-path questions, and either-or instruction.
- [Guidely inequality question bank](https://cdn.guidely.in/pdf/170555530892.pdf) — long chains followed by two conclusions and the five-choice banking response scheme.
- [Adda247 SBI Clerk reasoning paper](https://blogmedia.testbook.com/blog/wp-content/uploads/2022/09/56.-sbi-clerk-prelims-2020-reasoning-ability--a2661f31.pdf) — memory-paper-style two-conclusion inequality questions.
- [SATHEE coded inequality theory](https://sathee.iitk.ac.in/sathee-bank-exam/bank-exams/ibps-po/study-materials/memory-based-questions/inequality/theory/) — distinction between definite and merely possible relations and treatment of complementary pairs.
- [SATHEE railway inequality practice](https://sathee.iitk.ac.in/sathee-railway-exams/student-corner/topic-wise-practice/reasoning/inequality/) — chain combination, equality substitution, inclusive conclusions, and conclusion-count tasks.

Platform material is evidence of question shape, not mathematical authority. Editorial inconsistencies must be rejected by the formal solver.

## Measured audit of the 72-record pack

| Measure                                          |                                 Result | Assessment                                   |
| ------------------------------------------------ | -------------------------------------: | -------------------------------------------- |
| Records                                          |                                     72 | Adequate first review sample                 |
| Provisional authorities                          |                                      6 | Matches implementation contract              |
| Correct answer positions                         |                      18 / 18 / 18 / 18 | Excellent                                    |
| Unique content hashes                            |                                     72 | Pass, but not structural proof               |
| Underlying topologies                            |                                      6 | Too narrow for production                    |
| Statement counts                                 |        12 with 2; 36 with 3; 24 with 4 | No long exam chains                          |
| Easy / Medium / Hard                             |                            4 / 50 / 18 | Poorly calibrated                            |
| SSC / Banking / Advanced labels                  |                            4 / 50 / 18 | Unsupported by response format               |
| Classification truth classes                     | 8 definite / 8 possible / 8 impossible | Excellent balance                            |
| Directly repeated classification conclusions     |                                0 of 24 | Strong                                       |
| Correct selection using a directly compared pair |                                2 of 36 | Acceptable for strictness teaching; not hard |
| Mock-solution length                             |              32–74 words; average 53.7 | Usually longer than needed                   |
| Learning-solution length                         |            73–173 words; average 119.6 | Useful but repetitive                        |

All five statement operators are present: 76 `>`, 44 `<`, 34 `≥`, 50 `≤`, and 24 `=` occurrences.

## What is genuinely strong

### 1. Answer correctness and option uniqueness

Every answer is re-derived from the displayed statements. Selection questions contain exactly one conclusion of the requested truth class. Reverse-equivalent conclusions are canonicalised, preventing duplicates such as `A > B` and `B < A`.

### 2. Inclusive reasoning is formally correct

The runtime understands that:

- `A > B` makes `A ≥ B` definitely true;
- `A ≥ B` does not make `A > B` definite;
- a strict edge anywhere in a same-direction path forces strictness at the endpoints.

This must remain solver authority even when a source uses an imprecise shortcut.

### 3. Possibility is proved, not asserted

For a possibly true conclusion, the learning solution provides one valid arrangement where it holds and another where it fails. This rigorous teaching feature should remain in guided-learning mode.

### 4. Answer-position leakage is absent

The 72-record pack places exactly 18 answers in each position. The position schedule is namespaced by task, avoiding one shared seed pattern across authorities.

## Original release blockers

### 1. No source-shaped conclusion-mask authority

None of the 72 records uses numbered conclusions followed by a governed response mask. This is the clearest book-and-platform mismatch.

It does not make CP-003 logically wrong. It means these records are guided concept questions, not representative banking mock questions.

### 2. The contradiction option is an artificial distractor

All 24 classification questions include:

> The statements are contradictory.

Because the generator deliberately constructs consistent statements and exam directions ask the learner to assume them true, a prepared learner can eliminate this option without evaluating the conclusion.

Keep contradiction detection inside validation. Do not use it as a routine exam-facing option.

### 3. Release-tier metadata overclaims readiness

The pack labels 50 records `BANKING_PRELIMS` and four `SSC_STANDARD_MOCK`. These labels describe intended difficulty, not verified exam shape.

Until source-shaped contracts exist, use profiles such as:

- `GUIDED_CONCEPT`;
- `DIAGNOSTIC_PRACTICE`;
- `ADVANCED_REASONING_LAB`.

Store exam tier and difficulty separately.

### 4. Structural diversity is too small

Seventy-two surface records reduce to six base graph topologies. Name changes, statement order, symbol reversal, and query reversal improve presentation variety but do not create new reasoning structures.

Production discovery should add:

- five- and six-statement chains;
- two independent chains feeding a conclusion mask;
- multiple valid paths with different strictness;
- equality at the start, middle, and end;
- one controlled irrelevant statement;
- connected branches with one, two, or all three endpoint relations possible;
- disconnected components paired with a definite conclusion elsewhere.

### 5. Explanations still sound generated

The repeated frame — “The statements allow… The conclusion is… Therefore…” — is accurate but robotic. It often states a relation domain without showing the decisive chain.

The book-shaped mock explanation should be short and path-first:

```text
S ≥ P > R, so S > R.
Therefore, S ≥ R must also be true.
```

For possibility, use natural contrast:

```text
S may be equal to P or greater than P.
If S = P, then P ≥ S is true. If S > P, it is false.
So the conclusion is possible, but it is not guaranteed.
```

Numeric witnesses are useful when they clarify an undetermined branch. Present them as examples, not raw solver output.

### 6. Difficulty is task-driven rather than reasoning-driven

Only four questions are easy, while 18 are marked hard despite the entire pack using two to four statements. Difficulty should consider decisive path length, conclusions to evaluate, plausible distractors, equality compression, alternate routes, irrelevant information, direct comparisons, and the size of the possible endpoint-relation set.

## Recommended delivery profiles

### Guided concept mode

Retain direct truth classification, complete possible-relation-set questions, witness arrangements, and detailed misconception feedback. Replace the contradiction distractor with a meaningful fourth alternative or use a three-choice component.

### Banking mock mode

Add source-shaped two- and three-conclusion questions with governed response masks. CP-003 can own non-complementary `Only I`, `Only II`, `Neither`, and `Both` cases. CP-004 should own complementary/either-or proof.

### SSC mock mode

Admit only exact four-option forms supported by the source ledger. Use short chains, one clear operation, and mutually exclusive options.

## Required remediation before permanent QLs

1. Separate guided-learning, diagnostic, SSC, and banking delivery profiles.
2. Remove the contradiction option from exam-facing classification questions.
3. Add source-shaped conclusion-mask authorities without moving CP-004 ownership into CP-003.
4. Reclassify the current release tiers honestly.
5. Replace generic domain narration with path-first explanations.
6. Expand beyond six graph topologies and include five- and six-statement structures.
7. Add normalized structural fingerprints and duplicate-cluster reporting.
8. Map every proposed permanent QL to exact source-ledger records.
9. Document source-specific semantic conflicts while keeping the formal solver authoritative.
10. Re-audit at least 12 records per proposed permanent QL before English freeze.

## Readiness scores

| Area                        |  Score |
| --------------------------- | -----: |
| Formal logical correctness  | 9.5/10 |
| Source-design coverage      | 8.5/10 |
| Supplied-book provenance    |   8/10 |
| Record-to-page provenance   |   4/10 |
| Option correctness          |   9/10 |
| Source-shaped option design | 4.5/10 |
| Guided-learning value       |   8/10 |
| Explanation naturalness     | 6.5/10 |
| Structural diversity        |   5/10 |
| SSC mock realism            | 4.5/10 |
| Banking mock realism        |   5/10 |
| Production readiness        | 4.5/10 |

## Final decision after remediation

Retain the revised CP-003 engine. The regenerated 84-question English pack passed its second manual review, and the implementation addresses the option-contract, explanation, profile, diversity, and authority-level provenance findings.

Permanent QL allocation, Question Studio exposure, and public mock-test eligibility remain disabled until separately authorized.
