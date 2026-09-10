# LP-001 through LP-008 — Retrofit Audit V1

Status: **English stabilization in progress**  
Scope: `LP-001` through `LP-008`  
Purpose: close the quality/governance gap between the older Logic Puzzle packages and the frozen LP-009/LP-010 standard before multilingual activation.

## 1. Why this retrofit exists

LP-009 and LP-010 now have explicit English freezes, permanent QL ownership, reviewed Hindi/Punjabi localization and shared Question Studio integration. LP-001 through LP-008 still have older review-only lifecycle metadata even though several of their learner-facing revisions were previously reviewed.

This retrofit does **not** treat metadata promotion as a substitute for content review. The older packages are first being re-audited for topology, explanation quality, stem completeness and source-family coverage.

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

All existing LP-006 difficulty calibration, LP-007 generator proof and LP-008 generator proof remained green.

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

## 5. Earlier chapter-closure audit reconciliation

The old branch `audit/logic-puzzles-chapter-closure` correctly identified several debts that remain relevant:

- LP-001 through LP-008 needed a chapter-wide explanation-quality pass against the later LP-009 standard;
- checkpoint-level English approval records were not uniformly represented in repository governance;
- source/exam-year crosswalk was incomplete;
- permanent QL allocation and localization were therefore not uniformly promotable.

Its old conclusion that the chapter must stop at LP-009 is obsolete because LP-010 was subsequently redesigned, explicitly human-approved, frozen, localized and integrated.

## 6. Current learner-quality benchmark

Older packages are being measured against the following LP-009/LP-010 learner-facing contract:

1. every generated question must contain its complete setup/domain and all clues needed to solve it;
2. explanations must apply clues in a clear sequence rather than jump straight to the finished arrangement;
3. progressive tables/candidate states should show how information is filled or narrowed;
4. the final arrangement must be shown before answering the child question;
5. the explanation must explicitly reach the child answer;
6. generic filler, solver-count language, option-by-option analysis and machine-like wording are forbidden.

`lp-001-008-editorial-quality-audit.ts` measures the current Question Studio output against these properties. Its findings will determine exactly which packages receive an English editorial overlay before freeze review.

## 7. Lifecycle rule

No LP-001–LP-008 permanent-English freeze or Hindi/Punjabi localization freeze is authorized by this audit alone.

Next gates:

1. finish learner-output quality audit;
2. implement only the English retrofits that fail the benchmark;
3. generate a consolidated English review pack for unresolved/changed material;
4. obtain explicit human approval for the stabilized authority;
5. allocate/freeze QLs 001–032;
6. build Hindi/Punjabi semantic localizations;
7. obtain explicit localization approval;
8. connect all eight packages to the existing shared Question Studio.
