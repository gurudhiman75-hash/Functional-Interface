# LP-001 — Assignment and Grouping Logic Puzzles

Status: **review-only implementation; source saturation, human English approval, permanent QL allocation, localization and publication remain locked.**

This is the first general-puzzle checkpoint restored on the current `New-main` checkout. It models realistic six-person assignments in public-health fieldwork, teacher training, bank audits, district administration, scholarship verification, civic surveys, campus research and municipal planning. Each caselet has three named two-person groups, explicit same-group/different-group/exclusion clues, a unique hidden assignment, and four correlated child questions. The same Question Studio route now also carries LP-002, a separate four-person day-and-ordered-location assignment authority, and LP-003, a seven-box vertical stack authority.

The saturation pass varies scenario profile, group labels, clue phrasing, clue topology, child stem style, target group and difficulty. `Medium` caselets use a shorter deduction chain; `Hard` caselets require a longer mixed chain of pairing, separation and exclusion clues. Abstract letter-only entities and artificial “slot” settings are not used.

LP-007 adds the source-backed variable/preference family: five named people are assigned five different choices, with direct, either/or and exclusion clues. Its children ask both directions of the mapping and two correctly matched subsets. Every child repeats the complete people and choice lists and all clues in a natural standalone stem. Explanations use direct-entry, candidate-narrowing and completed one-to-one tables.

LP-008 adds the source-backed month-and-date scheduling family: eight named people are assigned the eight dates formed by four months and two dates in each month. Its children ask date-to-person, person-to-date, pair-match and three-person-match projections. Clues use direct date/month entries, same-month and same-date links, before/between relations and month exclusions. Easy uses direct completion, Medium mixes direct and narrowing clues, and Hard keeps only a small number of direct anchors while layering calendar relations and exclusions. Every child repeats the full calendar and all clues; explanations fill the date-and-month table progressively.

LP-009 adds the two remaining source-backed Type 3 scheduling forms: six named entities assigned to six ordered months, and six named persons assigned to six ordered birth years. Month profiles cover birth, interview, course-start and review-meeting schedules; year profiles use same-date/month birth records with oldest-to-youngest interpretation and no age arithmetic. Children ask value-to-person, person-to-value, correctly matched pairs and an ordered-position lookup. Easy uses five direct entries, Medium mixes a direct anchor with before/between/adjacency and exclusion clues, and Hard limits direct anchors while layering order, adjacency, exclusion and second-oldest deductions. Every child repeats all people, all months or years and every clue; explanations build the single-axis table step by step.

Permanent QLs are intentionally unallocated. The current review authorities are provisional:

| Candidate | Task |
|---|---|
| LP-QL-001 | identify a person's unit |
| LP-QL-002 | identify a same-unit pair |
| LP-QL-003 | identify the members of a named unit |
| LP-QL-004 | identify a pair placed in different units |

The generator enumerates all capacity-valid assignments independently of the hidden state. A caselet is emitted only when exactly one assignment satisfies every displayed clue, and every displayed clue must be necessary. LP-006 repeats the complete people, day, study-area and city lists in every rendered question. Its explanations record direct entries, apply ordering or linkage clues, fill the remaining values by the one-to-one rule, and show each stage in a progressively filled table before answering the specific child query. Distractors are tagged to a misconception family such as broken pairing, row-member substitution or confusing a same-row pair with a cross-row pair.

City-based profiles use the shared standard exam-city pool in `standard-pools.ts` (full, widely recognised names only; no localities or abbreviations). Facility labels such as rooms, wards, villages and sections remain generic objects rather than city objects.

Difficulty is structural across the chapter: LP-001 through LP-004 use larger Hard clue sets and different quota families; LP-005 uses more direct anchors for Medium and mixed exclusions for Hard; LP-006 supports Easy direct placements, Medium one-link synthesis and Hard mixed-link synthesis. The calibration is locked by `difficulty-calibration.test.ts`.

The executable saturation proof covers 500 deterministic caselets and 2,000 child questions: all eight scenario profiles occur, all three clue families occur, both difficulty bands occur, at least eight distinct child-stem forms occur, and every QL receives exactly 125 questions in each correct-answer position.

Question Studio uses the existing shared generation engine. The package is visible for review generation only; it does not write the Question Bank, enable test eligibility or publish student content.

## Checkpoint ledger

| Checkpoint | Authority | Status |
|---|---|---|
| LP-CP-001 | Six-person grouping and assignment | Review-only; source audit and editorial approval open |
| LP-CP-002 | Four-person multi-attribute day/location assignment | Review-only; source audit and editorial approval open |
| LP-CP-003 | Seven-box vertical stack arrangement | Review-only; source audit and editorial approval open |
| LP-CP-004 | Four-of-seven selection and conditional committee | Review-only; source audit and editorial approval open |
| LP-CP-005 | Five-person, two-attribute matching grid | Review-only; source audit and editorial approval open |
| LP-CP-006 | Four-person, three-attribute advanced synthesis | Review-only; source audit and editorial approval open |
| LP-CP-007 | Five-person variable and preference assignment | Review-only; source audit and editorial approval open |
| LP-CP-008 | Eight-person month and date scheduling | Review-only; source audit and editorial approval open |
| LP-CP-009 | Month-based and year-based scheduling | Review-only; source audit and editorial approval open |

LP-002's source and ownership record is in `LP-002-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-005 through LP-QL-008 provisional until source evidence and human review are complete.
LP-003's source and ownership record is in `LP-003-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-009 through LP-QL-012 provisional until source evidence and human review are complete.
LP-004's source and ownership record is in `LP-004-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-013 through LP-QL-016 provisional until source evidence and human review are complete.
LP-005's source and ownership record is in `LP-005-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-017 through LP-QL-020 provisional until source evidence and human review are complete.
LP-006's source and ownership record is in `LP-006-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-021 through LP-QL-024 provisional until source evidence and human review are complete.
LP-007's source and ownership record is in `LP-007-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-025 through LP-QL-028 provisional until source evidence and human review are complete.
LP-008's source and ownership record is in `LP-008-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-029 through LP-QL-032 provisional until source evidence and human review are complete.
LP-009's source and ownership record is in `LP-009-SOURCE-SATURATION-AUDIT.md`. It keeps LP-QL-033 through LP-QL-036 provisional until source evidence and human review are complete.
