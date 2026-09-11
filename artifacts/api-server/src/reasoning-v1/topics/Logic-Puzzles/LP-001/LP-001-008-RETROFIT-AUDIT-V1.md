# LP-001 through LP-008 — Retrofit Audit V1

Status: **English V2 human-review candidate**  
Scope: `LP-001` through `LP-008`  
Purpose: close the quality/governance gap between the older Logic Puzzle packages and the frozen LP-009/LP-010 standard before multilingual activation.

## 1. Why this retrofit exists

LP-009 and LP-010 now have explicit English freezes, permanent QL ownership, reviewed Hindi/Punjabi localization and shared Question Studio integration. LP-001 through LP-008 still have older review-only lifecycle metadata even though several of their learner-facing revisions were previously reviewed.

This retrofit does **not** treat metadata promotion as a substitute for content review. The older packages are being re-audited for topology, explanation quality, stem completeness, option integrity and source-family coverage.

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

The existing LP-006 difficulty calibration, LP-007 generator proof and LP-008 generator proof remain green.

## 3. Difficulty decision

The absence of an Easy band in LP-001 through LP-005 is not, by itself, sufficient reason to relabel questions.

Current rule:

- preserve existing Medium/Hard classifications while the source and editorial audit is open;
- do not turn an existing Medium caselet into Easy merely to make package metadata look uniform;
- add a new Easy structure only if it is demonstrably lower in inference depth and is supported by recurring exam/source patterns;
- retain LP-006/007/008 Easy/Medium/Hard because those packages already have structurally distinct tiers and passing calibration proofs.

Difficulty is therefore a **reasoning-topology property**, not a mandatory three-label checklist.

## 4. Source-family evidence already recovered

The uploaded `reasoning_aggarwal.pdf` gives explicit puzzle-solving guidance to record definite information first and then use secondary/indefinite information to narrow possibilities. It also contains:

- box/vertical-order puzzle examples matching the core LP-003 state model;
- day-based scheduling, supporting the scheduling family used by LP-002/LP-006;
- month/year/month+date scheduling families, including an eight-person four-month × two-date example matching the LP-008 family;
- a variable-puzzle section in which people are assigned unique likes/preferences, matching the core LP-007 state model.

This is structural family evidence. It is **not automatically an official exam/year attribution**.

Direct target-exam/source-year crosswalk remains to be reconciled separately, especially for LP-001 grouping, LP-004 conditional selection and LP-005 person × attribute × place matching.

## 5. Learner-output audit findings

The raw pre-retrofit Question Studio outputs were checked in `lp-001-008-editorial-quality-audit.ts`.

All eight packages already passed the important stem-sufficiency check: every sampled standalone child contained all of its puzzle clues, and the banned machine/filler wording check was clean.

The explanation gap was substantial:

- LP-001, LP-003 and LP-004 had no progressive explanation tables;
- LP-002 and LP-005 had a final table but explanations were effectively two-line summaries;
- LP-006, LP-007 and LP-008 were stronger but still did not consistently walk the learner through every displayed clue in order;
- several older child explanations did not explicitly restate the final child answer.

`LP_001_008_EXPLANATION_RETROFIT_V1` therefore adds clue-by-clue progressive candidate tables, a completed arrangement, and a child-specific final-answer step without changing assignments, stems, clues, options, answers or difficulty.

The parity test reproves this on 24 caselets / 96 questions per package.

## 6. Option-integrity defect and repair

Review of the first regenerated pack exposed an additional defect that the older tests did not cover: a puzzle can have one unique solved arrangement while a generated MCQ still has multiple semantically correct options or giveaway distractors.

Examples of the affected construction patterns:

- `LP-QL-002`: a generic “same group” question could include another true same-group pair as a distractor;
- `LP-QL-004`: a generic “different groups” question could include another true different-group pair as a distractor;
- `LP-QL-008`: the old generic person-day-location matcher selected other **true** solved rows as distractors, so several options could be correct;
- `LP-QL-020` and `LP-QL-024`: the question named one target person while the distractors changed the person, making the correct option visually obvious before solving the puzzle.

`LP_001_008_STABILIZED_ENGLISH_V2` repairs those five QLs while preserving the hidden assignment, scenario, clues, QL, difficulty, answer and correct-option position.

The new `lp-001-008-option-integrity-v2.test.ts` runs 100 caselets per package: **800 caselets / 3,200 child questions**. It proves:

- exactly four distinct options per MCQ;
- exactly one semantically correct option per MCQ;
- `correctIndex` still points to the unchanged answer;
- no target-name giveaway remains in QL-020 or QL-024;
- all 32 QLs are exercised;
- every QL has exact answer-position balance `[25, 25, 25, 25]`.

The full option-integrity V2 proof is green.

## 7. Current English V2 review authority

The consolidated human-review file is generated from `LP_001_008_STABILIZED_ENGLISH_V2`:

`LP-001-008-ENGLISH-RETROFIT-REVIEW-V2.md`

It samples two caselets per package where possible across different difficulty bands and shows:

- setup and all clues;
- all four QLs/options/answers;
- shared clue-by-clue progressive solution tables;
- child-specific final-answer steps.

The rejected V1 review artifact is not an approval authority because it exposed the option-integrity defect above.

## 8. Earlier chapter-closure audit reconciliation

The old branch `audit/logic-puzzles-chapter-closure` correctly identified several debts that remain relevant:

- LP-001 through LP-008 needed a chapter-wide explanation-quality pass against the later LP-009 standard;
- checkpoint-level English approval records were not uniformly represented in repository governance;
- source/exam-year crosswalk was incomplete;
- permanent QL allocation and localization were therefore not uniformly promotable.

Its old conclusion that the chapter must stop at LP-009 is obsolete because LP-010 was subsequently redesigned, explicitly human-approved, frozen, localized and integrated.

## 9. Lifecycle rule

No LP-001–LP-008 permanent-English freeze or Hindi/Punjabi localization freeze is authorized by this audit alone.

Current gates:

1. **human review of English V2** — current gate;
2. fix any editorial issue found in that review;
3. obtain explicit human approval for the stabilized English authority;
4. allocate/freeze QLs 001–032;
5. build Hindi/Punjabi semantic localizations from the frozen English structures;
6. obtain explicit localization approval;
7. connect all eight multilingual packages to the existing shared Question Studio.
