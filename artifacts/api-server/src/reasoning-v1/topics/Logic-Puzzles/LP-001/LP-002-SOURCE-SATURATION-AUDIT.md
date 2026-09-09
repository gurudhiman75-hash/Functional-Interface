# LP-002 Source and Ownership Audit

Status: **review-only implementation; uploaded-reference intake completed for the current discovery wave; source crosswalk and human English approval remain open.**

LP-002 extends LP-001 with a genuinely different state contract: each named person receives one distinct day and one distinct ordered location. It does not duplicate LP-001's same-group/different-group assignment logic.

City-based profiles draw only from the shared standard exam-city pool in `standard-pools.ts`, using full names rather than localities or abbreviations. The remaining facility labels are generic non-city objects.

## Candidate ownership

| Candidate | Provisional scope | Main misconception |
|---|---|---|
| `LP-QL-005` | identify the day assigned to a named person | reversing an order or missing an exclusion |
| `LP-QL-006` | identify the location assigned to a named person | confusing route order with day order |
| `LP-QL-007` | invert the schedule and identify the person on a named day | reading a person-to-day mapping backwards |
| `LP-QL-008` | verify a complete person/day/location match | mixing attributes from different rows |

## Source-family intake matrix

| Source family | Forms to compare | Current disposition |
|---|---|---|
| SSC CGL/CHSL/CPO/MTS | day/person/location assignment and inverse lookups | candidate coverage; source evidence still required |
| RRB NTPC/Group D | ordered route, exclusions and compact schedules | candidate coverage; source evidence still required |
| IBPS/SBI/RRB | longer mixed-clue and complete-match questions | candidate Hard coverage; source evidence still required |
| Punjab recruitment examinations | officer, applicant, teacher and field-service contexts | candidate scenario coverage; source evidence still required |
| Books/coaching references | alternate wording and distractor conventions | variation-only reference lane; no wording copied |
| Exam-memory sets | edge cases and misconception discovery | lower-confidence gap lane; never a sole freeze basis |

No source wording is copied into the runtime. Before permanent allocation, record source/exam-year, dimensions, ordering convention, clue topology, query demand, difficulty driver, misconception opportunity and coverage disposition for each mapped form.

## Uploaded reference intake — 2026-09-08

The uploaded Library material was checked before this checkpoint was closed:

| Uploaded reference | Relevant evidence inspected | LP-002 consequence |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–244: explicit day-, month-, date- and variable-based puzzle families; “who/on which day” projections; before/after and “persons between” constraints; common solution tables | LP-002 uses a day-based schedule, ordered locations, before/after and day-gap clues, inverse-day lookup and a solved table shared by four child questions |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | p. 248: seven-day lecture caselet with multiple person/subject/day constraints and follow-up questions | supports longer mixed-clue Hard caselets and context-specific question stems without copying the source case |
| `reasoning book.pdf` | pp. 164–165: inverse arrangement/data-sufficiency questions and direction-sensitive relation wording | supports explicit inverse lookup ownership and direction-safe clue semantics |

The uploaded material has therefore influenced the stem families, caselet shape, explanation table and clue mix. It is convention-level reference material, not an official source-year crosswalk; source/exam-year mapping and human approval remain required before permanent QL allocation.

## Required gates

The current implementation proves unique hidden schedules, necessary displayed clues, independent re-solving, five clue families, six concrete scenario profiles, two difficulty bands and balanced answer positions. It remains blocked from permanent QL allocation until the uploaded/reference source material is available for the six-wave source audit and human editorial review.
