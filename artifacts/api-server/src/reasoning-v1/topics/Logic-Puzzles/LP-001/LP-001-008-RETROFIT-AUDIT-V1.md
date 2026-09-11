# LP-001 through LP-008 — Retrofit Audit V1

Status: **English V3.1 human-review candidate**  
Scope: `LP-001` through `LP-008`  
Purpose: close the quality/governance gap between the older Logic Puzzle packages and the frozen LP-009/LP-010 standard before multilingual activation.

## 1. Why this retrofit exists

LP-009 and LP-010 now have explicit English freezes, permanent QL ownership, reviewed Hindi/Punjabi localization and shared Question Studio integration. LP-001 through LP-008 still have older review-only lifecycle metadata.

This retrofit does not treat metadata promotion as a substitute for content review. The older packages have been re-audited for topology, explanation quality, stem completeness, MCQ integrity and source-family coverage.

## 2. Deterministic topology proof

`lp-001-008-retrofit-topology-audit.ts` generated 100 caselets / 400 child questions for each package.

| Package | Difficulty distribution | Clue-count distribution | Profiles | QLs |
|---|---|---|---:|---|
| LP-001 | 75 Medium / 25 Hard | 75 × 5 clues; 25 × 6 | 8 | 001–004 |
| LP-002 | 50 Medium / 50 Hard | 56 × 6; 20 × 7; 24 × 8 | 6 | 005–008 |
| LP-003 | 50 Medium / 50 Hard | 51 × 5; 46 × 6; 3 × 7 | 6 | 009–012 |
| LP-004 | 50 Medium / 50 Hard | 41 × 4; 59 × 5 | 6 | 013–016 |
| LP-005 | 50 Medium / 50 Hard | 100 × 8 | 6 | 017–020 |
| LP-006 | 34 Easy / 33 Medium / 33 Hard | 100 × 9 | 6 | 021–024 |
| LP-007 | 34 Easy / 33 Medium / 33 Hard | 100 × 4 | 6 | 025–028 |
| LP-008 | 34 Easy / 33 Medium / 33 Hard | 6 × 5; 36 × 6; 56 × 7; 2 × 8 | 6 | 029–032 |

All existing LP-006 difficulty calibration, LP-007 generator proof and LP-008 generator proof remain green.

## 3. Difficulty decision

The absence of an Easy band in LP-001 through LP-005 is not, by itself, sufficient reason to relabel questions. Difficulty remains a reasoning-topology property, not a mandatory three-label checklist.

- preserve existing Medium/Hard classifications for LP-001–005;
- do not turn an existing Medium caselet into Easy merely to make metadata uniform;
- add a new Easy structure only if a recurring lower-inference exam/source family justifies it;
- retain LP-006/007/008 Easy/Medium/Hard because those packages already have structurally distinct tiers and passing calibration proofs.

## 4. Source-family evidence already recovered

The uploaded `reasoning_aggarwal.pdf` gives explicit puzzle-solving guidance to record definite information first and then use secondary/indefinite information to narrow possibilities. It also contains box/vertical-order, day scheduling, month/date scheduling and variable/preference puzzle families that structurally support LP-002/003/006/007/008.

This is structural family evidence. It is not automatically an official exam/year attribution. Direct target-exam/source-year crosswalk remains a separate governance item, especially for LP-001 grouping, LP-004 conditional selection and LP-005 person × attribute × place matching.

## 5. Learner-output audit findings

The original LP-001–008 Question Studio stems already contained all required clues and were free of the banned machine/filler wording checked by the audit. The main learner-facing weakness was explanation quality:

- LP-001/003/004 had no progressive explanation tables;
- LP-002/005 used short two-line explanations;
- LP-006/007/008 were stronger but still did not consistently walk through each displayed clue like LP-009/010.

The first explanation retrofit proved semantic parity but its all-candidate tables were too dense for beginners.

## 6. MCQ option-integrity defect and repair

The first generated retrofit review exposed old distractor defects: some semantic MCQs could contain more than one valid option, and complete-match questions in LP-005/006 could use options whose first field immediately revealed the answer.

`LP_001_008_STABILIZED_ENGLISH_V2` repairs only those distractors while preserving assignment, scenario, clues, QL, difficulty, answer and correct option index.

`lp-001-008-option-integrity-v2.test.ts` proves **800 caselets / 3,200 questions** across QLs 001–032:

- exactly four distinct options per MCQ;
- exactly one semantically correct option;
- unchanged answer/correctIndex;
- no target-name giveaway in LP-QL-020/024;
- exact `[25,25,25,25]` answer-position balance for every QL.

## 7. English V3.1 explanation contract

Human feedback on V2 required explanations to be simpler and to use cases. The current review authority is `LP_001_008_STABILIZED_ENGLISH_V3_1`.

V3.1 keeps all V2 puzzle and option semantics and changes only the teaching layer:

1. each displayed clue is taken one at a time;
2. language is short and beginner-friendly;
3. only newly fixed information is stated after a clue instead of dumping large candidate tables;
4. before the final uncertainty is resolved, a genuine `Case 1 / Case 2` split is shown;
5. the next clue is used to reject the wrong case explicitly;
6. one clean final arrangement table is shown;
7. the child-specific answer is read directly from that table;
8. solver counts, candidate-state jargon and option-by-option analysis remain forbidden.

Cases are generated from actual alternative assignments that still satisfy the earlier clues; they are not decorative or invented branches.

`lp-001-008-stabilized-english-v3.test.ts` proves V2→V3 non-explanation parity and case presence. `lp-001-008-stabilized-english-v3-1.test.ts` guards the simplified wording, explicit case rejection, final-table step and plural-safe LP-003 case presentation.

## 8. Current review gate

The authoritative review file is:

`LP-001-008-ENGLISH-RETROFIT-REVIEW-V3-1.md`

The V1, V2 and raw V3 review artifacts are superseded and are not approval authorities.

No LP-001–LP-008 permanent-English freeze or Hindi/Punjabi localization freeze is authorized yet.

Next gates:

1. human review/approval of English V3.1;
2. allocate/freeze QLs 001–032;
3. build Hindi/Punjabi semantic localizations from the frozen English authority;
4. obtain explicit localization approval;
5. connect all eight packages to the existing shared Question Studio.
