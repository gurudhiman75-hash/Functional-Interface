# Logic Puzzles LP-001 → LP-010 — Chapter Closure and Gap Audit V1

Status: post-freeze source/ownership audit after permanent allocation of `LP-QL-001..LP-QL-040` and multilingual Question Studio integration for LP-001→010.

This audit decides whether the next source-backed pattern requires a new permanent QL (`LP-QL-041`) or should be absorbed by an existing permanent solve authority.

## 1. Current permanent surface

| Package | Permanent QLs | Primary ownership |
|---|---:|---|
| `LP-001` | `LP-QL-001..004` | assignment and grouping |
| `LP-002` | `LP-QL-005..008` | day + location multi-attribute assignment |
| `LP-003` | `LP-QL-009..012` | box / stack ordered arrangement |
| `LP-004` | `LP-QL-013..016` | selection and conditional committees |
| `LP-005` | `LP-QL-017..020` | person + duty + location matching |
| `LP-006` | `LP-QL-021..024` | advanced day + study-area + city synthesis |
| `LP-007` | `LP-QL-025..028` | variable / preference assignment |
| `LP-008` | `LP-QL-029..032` | month + date scheduling |
| `LP-009` | `LP-QL-033..036` | one-axis ordered scheduling: month and year |
| `LP-010` | `LP-QL-037..040` | day + time scheduling |

Registry state: `LP-QL-001..040` allocated; `LP-QL-041` remains unallocated.

## 2. Product-taxonomy boundaries

The Reasoning V1 master blueprint keeps these adjacent families outside general Logic Puzzles even if they use the same constraint-solving ideas:

- Floor / Flat Arrangement — separate chapter;
- Seating Arrangement — separate chapter family;
- Blood Relations — separate chapter;
- Ranking / Order — separate chapter;
- Input–Output — separate chapter;
- Games / Tournament — separate chapter.

Therefore a source example must not be copied into Logic Puzzles merely because it appears in a book's puzzle chapter. Ownership follows the ExamTree product taxonomy and the primary tested skill.

## 3. Uploaded-source crosswalk

The uploaded `reasoning_aggarwal.pdf` puzzle chapter gives the following broad source families:

| Source family | ExamTree owner | Closure disposition |
|---|---|---|
| Type 1 — Floor Puzzle | Floor / Flat chapter | out of LP scope |
| Type 2 — Box Based Puzzle | `LP-003` | covered |
| Type 3 — Day Based scheduling, one person per day | ordered scheduling | **presentation gap found** |
| Type 3 — Day + two time positions per day | `LP-010` | covered |
| Type 3 — Month Based | `LP-009` | covered |
| Type 3 — Year Based | `LP-009` | covered |
| Type 3 — Month & Date | `LP-008` | covered |
| Type 4 — Variable Puzzle | `LP-007` | covered |
| Type 5 — Blood Relations puzzle | Blood Relations chapter | out of LP scope |

The remaining source-backed gap is therefore not a new logical family. It is the **pure day-only ordered schedule**: for example, six named people assigned one-to-one to six explicitly listed ordered days, with before/between/adjacent/exclusion clues.

## 4. Why the day-only gap does not justify `LP-QL-041`

`LP-009` already owns the permanent solve contracts for a six-entity × six-ordered-value schedule:

- `LP-QL-033` — value → entity lookup;
- `LP-QL-034` — entity → value lookup;
- `LP-QL-035` — ordered pair matching;
- `LP-QL-036` — ordered-position / next-value entity lookup.

A weekday axis changes the learner-facing domain from months/years to ordered days, but it does not change the underlying inference contract. The same permutation state, before/between/adjacent/exclusion relations, option semantics and child-query projections remain valid.

Decision: **do not allocate `LP-QL-041` for pure day-only scheduling.** Add it as a governed LP-009 profile/mode extension under QLs 033–036.

## 5. Required implementation shape

The safe implementation must be versioned rather than mutating the frozen LP-009 V1 authority in place.

### LP-009 V2 candidate

Add a new review authority that:

1. inherits the frozen LP-009 month/year solve contracts unchanged;
2. introduces `DAY` as a third ordered-axis mode;
3. provides exam-natural day-only profiles, such as lectures, interviews or review meetings;
4. explicitly lists all six people and all six ordered days in every standalone stem;
5. uses only logically valid day clues: direct day, before, between, adjacent/consecutive and exclusion;
6. keeps explanations dependency-driven with progressive tables;
7. does not add city/centre/local-place fields;
8. keeps four unique options and exactly one answer;
9. preserves the permanent QL identities and correct-index semantics;
10. remains `REVIEW_ONLY` until English human approval.

### Compatibility requirement

The existing frozen LP-009 V1 month/year generator and multilingual freeze must remain reproducible. V2 must be a new authority/generator surface, not a silent rewrite of V1.

## 6. Review and lifecycle gates

Before any LP-009 V2 freeze:

- deterministic generation proof across day/month/year modes;
- one unique solved assignment per ordinary caselet;
- every displayed clue necessary;
- complete-domain standalone stems;
- difficulty based on deduction structure, not vocabulary;
- answer-slot balance per permanent QL;
- no regression in frozen V1 month/year outputs;
- English review artifact and explicit human approval.

Only after English approval should Hindi/Punjabi day-mode localization be built semantically and reviewed. Existing LP-009 localization V3 must not be silently modified.

## 7. Chapter-closure decision

At this audit point:

- there is **no evidence for a genuinely new Logic Puzzle solve contract requiring `LP-QL-041`**;
- the only identified source-backed learner-surface gap is day-only scheduling;
- that gap belongs to LP-009 QLs 033–036 as a new ordered-axis profile;
- `LP-QL-041` stays reserved for a future source-backed pattern that introduces a genuinely different inference contract.

Next implementation action: build **LP-009 Day-Based Scheduling V2 English review candidate** from the frozen LP-009 authority, without changing permanent QL allocation.