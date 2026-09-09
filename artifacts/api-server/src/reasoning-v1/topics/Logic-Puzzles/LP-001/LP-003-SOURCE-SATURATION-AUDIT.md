# LP-003 Source and Ownership Audit

Status: **review-only implementation; uploaded-reference intake completed for the current discovery wave; source crosswalk and human English approval remain open.**

LP-003 adds a vertical box/stack arrangement authority. Seven labelled boxes occupy one position each from bottom to top. The state contract is intentionally distinct from LP-001 grouping and LP-002 multi-attribute scheduling: clues constrain relative height, immediate adjacency, intervening-box counts, adjacency exclusions and fixed-position exclusions.

## Candidate ownership

| Candidate | Provisional scope | Main misconception |
|---|---|---|
| `LP-QL-009` | identify the box kept at a named position | counting upward from the wrong end or confusing position with box label |
| `LP-QL-010` | identify the position of a named box | reversing the bottom-to-top convention |
| `LP-QL-011` | count the boxes between two named boxes | counting endpoints or treating “between” as adjacency |
| `LP-QL-012` | identify the box immediately above a named box | reading “above” as “immediately above” or reversing the direction |

## Source-family intake matrix

| Source family | Forms to compare | Current disposition |
|---|---|---|
| SSC CGL/CHSL/CPO/MTS | boxes or objects arranged one above another; position, between and immediate-above lookups | candidate coverage; source evidence still required |
| RRB NTPC/Group D | stacked crates, files or materials with directional and exclusion clues | candidate coverage; source evidence still required |
| IBPS/SBI/RRB | longer mixed-clue stack arrangements and inverse position questions | candidate Hard coverage; source evidence still required |
| Punjab recruitment examinations | office records, supplies and public-service materials in ordered stacks | candidate scenario coverage; source evidence still required |
| Books/coaching references | alternate arrangement wording, solved-table conventions and distractor patterns | variation-only reference lane; no wording copied |
| Exam-memory sets | edge cases such as fixed positions, adjacency exclusions and “boxes between” counts | lower-confidence gap lane; never a sole freeze basis |

## Uploaded reference intake — 2026-09-08

The uploaded Library material was checked before this checkpoint was closed:

| Uploaded reference | Relevant evidence inspected | LP-003 consequence |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–241: a seven-box “one above another” arrangement; relative-above, immediately-above, position and boxes-between follow-ups | LP-003 uses seven bottom-to-top positions, relative and immediate direction, intervening-box counts and position lookup child questions |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–244: definite-clue placement, enumeration of possibilities, elimination with secondary statements and a completed arrangement table | the generator independently enumerates all 7! assignments, requires one survivor and clue essentiality, and exposes a solved position table in explanations |
| `reasoning book.pdf` | pp. 164–165: direction-sensitive arrangement and inverse lookup conventions | LP-003 makes bottom-to-top orientation explicit and separates box-at-position from position-of-box ownership |

The uploaded material influenced the stem families, caselet shape, explanation table and clue mix. No source wording is copied into the runtime. This is convention-level reference material, not an official source-year crosswalk; source/exam-year mapping and human approval remain required before permanent QL allocation.

## Coverage and required gates

The current implementation proves unique hidden stacks, necessary displayed clues, independent re-solving, five clue families, six concrete scenario profiles, two difficulty bands and balanced answer positions across 100 deterministic caselets and 400 child questions. Explanations are question-specific and identify the decisive relation before the final queried lookup.

Before permanent allocation, complete the official source/exam-year crosswalk, broader SSC/RRB/Banking/Punjab mapping, human English review, localization review and Question Studio approval. Until then, LP-QL-009 through LP-QL-012 remain provisional, the package remains `REVIEW_ONLY`, and no Question Bank or student publication write is allowed.
