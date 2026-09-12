# Logic Puzzles LP-001 → LP-010 — Chapter Closure and Gap Audit V2

Status: **post-freeze closure audit; `LP-QL-001..040` remain permanent and unchanged; `LP-QL-041` remains unallocated pending review of the gaps below.**

This V2 audit supersedes the earlier narrow closure pass. The earlier pass correctly identified pure day-only scheduling as a missing learner-facing mode, but it treated QL discovery too narrowly as only a question of new solver families. In ExamTree, a permanent QL is also an answer/query contract. A source-backed question projection can therefore justify a new QL even when it reuses an existing hidden-state solver.

## 1. Current permanent surface

| Package | Permanent QLs | Primary ownership |
|---|---:|---|
| `LP-001` | `LP-QL-001..004` | assignment and grouping |
| `LP-002` | `LP-QL-005..008` | day + location multi-attribute assignment |
| `LP-003` | `LP-QL-009..012` | box / stack ordered arrangement |
| `LP-004` | `LP-QL-013..016` | selection and conditional committees |
| `LP-005` | `LP-QL-017..020` | person + duty + location matching |
| `LP-006` | `LP-QL-021..024` | day + study-area + city synthesis |
| `LP-007` | `LP-QL-025..028` | variable / preference assignment |
| `LP-008` | `LP-QL-029..032` | month + date scheduling |
| `LP-009` | `LP-QL-033..036` | one-axis ordered month/year scheduling |
| `LP-010` | `LP-QL-037..040` | day + time scheduling |

Registry state: `LP-QL-001..040` allocated; next free identity is `LP-QL-041`.

## 2. Taxonomy boundaries that remain outside Logic Puzzles

Reasoning V1 keeps adjacent skills separate even when a reference book prints them in a common puzzle chapter:

- floor / flat arrangements → `REAS-FLR`;
- seating arrangements → seating chapters;
- blood relations → `REAS-BLR`;
- ranking / order → ranking chapter;
- overlapping set-membership / Venn-style classification → set/Venn reasoning where the primary task is membership rather than one-to-one assignment;
- input-output and games/tournament → their own chapters.

Therefore source presence alone is not enough; ownership follows the primary tested inference.

## 3. Uploaded-source crosswalk

The uploaded `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` puzzle chapter supplies the following relevant families.

| Source evidence | Current owner | V2 disposition |
|---|---|---|
| floor-only and floor + colour/city/fruit caselets | Floor / Flat chapter | out of LP scope |
| box-stack ordering and relative-position questions | `LP-003` | covered |
| pure one-person-per-day scheduling | same ordered-axis solver as `LP-009` | **mode gap, no new QL needed** |
| day + two positions/times per day | `LP-010` | covered |
| month-only and year-only scheduling | `LP-009` | covered |
| month + date scheduling | `LP-008` | covered |
| one-to-one variable/preference matching | `LP-007` | covered |
| person + two/three linked attributes | `LP-005` / `LP-006` | hidden-state family covered |
| blood-relation puzzle combined with height/order | Blood Relations chapter | out of LP scope |
| overlapping memberships such as teachers/subjects, sports/employment | set/Venn/membership reasoning | ownership hold outside LP |

Two genuine gaps remain inside the LP product surface: one **presentation/mode gap** and one **query-contract gap**.

## 4. Gap A — pure day-only ordered scheduling

The source contains ordinary schedules in which six entities occupy six ordered days with before/between/adjacent/exclusion clues. It also contains a six-lecture / seven-day form with one unused day.

### Ownership decision

The six-entity × six-day form is the same permutation/inference contract already owned by `LP-009` QLs 033–036. Changing the ordered values from months/years to weekdays does not justify a new QL.

Decision: **extend LP-009 through a versioned DAY mode; do not spend `LP-QL-041` on this.**

The one-unused-day variant is not automatically admitted by the same extension because it changes the state cardinality. It should remain a discovery candidate until a separate uniqueness and merge/split proof shows whether it belongs inside LP-009 V2 or needs a distinct solve contract.

## 5. Gap B — multi-attribute cross-projection questions

The existing LP-006 state is rich enough to solve a four-row table containing Person, Day, Study area and City. Its permanent QLs currently ask only:

- person → day (`LP-QL-021`);
- person → study area (`LP-QL-022`);
- person → city (`LP-QL-023`);
- complete person/day/study-area/city row match (`LP-QL-024`).

The uploaded source contains additional exam-real projections over the same kind of multi-attribute table, including:

- **attribute → different attribute**: e.g. a college/subject value asks for its city/state;
- **attribute → person**: e.g. which person is associated with a named college/subject;
- **statement truth selection**: choose the one correct or one incorrect statement, including cross-attribute statements.

These are not wording variants of QLs 021–024. The answer semantic and distractor construction are different even though the hidden assignment can be reused.

### Provisional candidate contracts

| Candidate | Provisional authority | Scope | Status |
|---|---|---|---|
| `LP-QL-041` | `CROSS_ATTRIBUTE_PROJECTION_LOOKUP` | given a non-person value from one column, identify the linked person or value in another column | **prototype required** |
| `LP-QL-042` | `STATEMENT_TRUTH_SELECTION` | choose the uniquely correct or uniquely incorrect statement about the solved multi-attribute table | **prototype required** |

No permanent allocation is made by this audit. These IDs remain reserved candidates until executable proof + human review.

## 6. Why these candidates belong with LP-006 rather than a new LP-011 generator

The source gap is not a new hidden-state family. LP-006 already produces the required solved relation: one person row links day, study area and city one-to-one. Building a second generator would duplicate solver logic and increase collision risk.

The correct implementation is a **versioned LP-006 projection extension** that wraps the frozen LP-006 solved caselet and adds new child-question contracts while preserving:

- the approved setup and clues;
- the solved assignment;
- difficulty;
- existing QLs 021–024 and their outputs;
- existing English/Hindi/Punjabi frozen authorities.

The extension must remain review-only until its own English review is approved.

## 7. Determinability / `Cannot be determined` source forms

The source also contains puzzle questions whose correct option is `Cannot be determined` / `Data inadequate`. These are real exam forms, but the current Reasoning V1 arrangement doctrine requires a uniquely solved hidden state before child questions are emitted.

Decision: **quarantine this as a separate discovery question.** Do not weaken the uniqueness invariant merely to reproduce these options. If later admitted, it needs an explicit governed partial-state contract and independent proof that ambiguity is intentional rather than a generator defect.

## 8. Required implementation order

1. Build LP-006 projection V1 as a review candidate for provisional `LP-QL-041` and `LP-QL-042`.
2. Prove zero state/clue/answer drift for existing LP-006 QLs 021–024.
3. Prove four distinct options and exactly one semantically correct answer for both new candidates.
4. Stress cross-column directionality and statement truth/falsehood generation.
5. Export English review questions and obtain explicit human approval before permanent allocation.
6. Separately build LP-009 DAY-mode V2 under existing QLs 033–036.
7. Re-run the chapter closure audit after both gaps are resolved; only then decide whether `LP-QL-043+` are needed.

## 9. Closure verdict

Logic Puzzles are **not yet source-saturated** after LP-010.

The next work is not a speculative LP-011. It is:

- a **new QL projection layer on LP-006** (`LP-QL-041` / `LP-QL-042` provisional), and
- a **DAY profile extension on LP-009** using existing QLs 033–036.

Until those are reviewed, `LP-QL-041` remains provisional/unallocated and the chapter should not be declared closed.
