# LP-004 Source and Ownership Audit

Status: **review-only implementation; uploaded-reference intake completed for the current discovery wave; source crosswalk and human English approval remain open.**

LP-004 adds a selection and conditional-committee authority. A fixed-size committee is selected from a named candidate set. The solver works over subsets rather than assignments, and the clue vocabulary covers mandatory inclusion, mandatory exclusion, together/not-together relations, exactly-one relations and directional if–then conditions. This is distinct from LP-001 grouping, LP-002 multi-attribute scheduling and LP-003 vertical box stacks.

## Candidate ownership

| Candidate | Provisional scope | Main misconception |
|---|---|---|
| `LP-QL-013` | identify a pair whose two members are selected | treating one selected member as a fully selected pair |
| `LP-QL-014` | identify a pair containing exactly one selected member | reading “exactly one” as “at least one” or “both cannot be selected” |
| `LP-QL-015` | identify the correct selection pattern across three named candidates | mixing a candidate’s status with a different candidate’s status |
| `LP-QL-016` | count selected members in a named three-person subset | counting the full committee instead of the queried subset |

## Source-family intake matrix

| Source family | Forms to compare | Current disposition |
|---|---|---|
| SSC CGL/CHSL/CPO/MTS | committee formation, selection/exclusion and exactly-one conditions | candidate coverage; source evidence still required |
| RRB NTPC/Group D | staff, inspection and service-team selection with conditional clues | candidate coverage; source evidence still required |
| IBPS/SBI/RRB | longer “if selected” chains and mixed pair constraints | candidate Hard coverage; source evidence still required |
| Punjab recruitment examinations | public-service panels, school committees and district teams | candidate scenario coverage; source evidence still required |
| Books/coaching references | selection-table conventions, conditional wording and distractor patterns | variation-only reference lane; no wording copied |
| Exam-memory sets | edge cases around exactly-one, pairwise exclusion and implication direction | lower-confidence gap lane; never a sole freeze basis |

## Uploaded reference intake — 2026-09-08

The uploaded Library material was checked for the current Logic Puzzles wave:

| Uploaded reference | Relevant evidence inspected | LP-004 consequence |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–244: definite clues, possibility enumeration, elimination through secondary statements and completed solution tables | LP-004 enumerates all 35 four-of-seven committees independently, requires one survivor and clue essentiality, and exposes a solved candidate-status table |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–241 and 248: mixed conditional/relational clue chains and follow-up projections from one parent caselet | the generator combines pairwise and directional conditions and derives four correlated selection queries from each solved committee |
| `reasoning book.pdf` | pp. 164–165: direction-sensitive relation and inverse-reading conventions | LP-004 keeps the direction of “if selected, then selected” explicit and distinguishes pair status from subset count |

The uploaded material influenced the caselet structure, clue mix, stem families, distractor construction and explanation table. No source wording is copied into the runtime. This is convention-level reference material, not an official source-year crosswalk; source/exam-year mapping and human approval remain required before permanent QL allocation.

## Coverage and required gates

The current implementation proves unique hidden committees, necessary displayed clues, independent re-solving, six clue families, six concrete scenario profiles, two difficulty bands and balanced answer positions across 100 deterministic caselets and 400 child questions. Explanations state the queried subset or pair explicitly after showing the complete committee-status table.

Before permanent allocation, complete the official source/exam-year crosswalk, broader SSC/RRB/Banking/Punjab mapping, human English review, localization review and Question Studio approval. Until then, LP-QL-013 through LP-QL-016 remain provisional, the package remains `REVIEW_ONLY`, and no Question Bank or student publication write is allowed.
