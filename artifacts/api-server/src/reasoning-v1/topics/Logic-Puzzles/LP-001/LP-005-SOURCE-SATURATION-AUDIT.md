# LP-005 Source and Ownership Audit

Status: **review-only implementation; uploaded-reference intake completed for the current discovery wave; source crosswalk and human English approval remain open.**

LP-005 adds a multi-attribute logic-grid matching authority. Five named people receive one duty and one location each, with one-to-one use of every value. This is a larger matching grid, distinct from LP-002's day/location schedule, LP-003's vertical stack, and LP-004's committee subset.

The bank-branch profile uses the shared standard exam-city pool in `standard-pools.ts` (full, widely recognised city names only). No local city names or abbreviations are used in generated learner-facing content.

Difficulty is structural: Medium caselets retain more direct person-to-attribute anchors and one linking/exclusion clue; Hard caselets use fewer direct anchors and two exclusion clues, so the matching table requires more deductions.

## Candidate ownership

| Candidate | Provisional scope | Main misconception |
|---|---|---|
| `LP-QL-017` | identify the duty assigned to a named person | confusing a duty with a location |
| `LP-QL-018` | identify the location assigned to a named person | reading a location-to-person relation backwards |
| `LP-QL-019` | identify the person assigned to a named duty | inverse lookup error |
| `LP-QL-020` | identify a complete person-duty-location match | mixing attributes from different rows |

## Uploaded reference intake — 2026-09-08

| Uploaded reference | Relevant evidence inspected | LP-005 consequence |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–244: variable-based puzzle families, clue elimination and completed solution tables | LP-005 uses a five-row grid, two one-to-one attribute columns and an independent exhaustive solver |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–241 and 248: person/attribute projections and mixed relation follow-ups | each parent caselet produces person-to-duty, person-to-location, inverse-duty and complete-match questions |
| `reasoning book.pdf` | pp. 164–165: direction-safe inverse reading | the runtime separates direct and inverse lookup ownership and shows both attributes in the explanation table |

No source wording is copied. The uploaded books are convention-level references, not an official source-year crosswalk. SSC/RRB/Banking/Punjab source mapping, human English review, localization and permanent QL allocation remain open.

The implementation proves unique solutions, necessary clues, six clue families, six concrete contexts, two difficulty bands and balanced answer positions across 100 caselets and 400 child questions. The package remains `REVIEW_ONLY` and does not write to the Question Bank or publish student content.
