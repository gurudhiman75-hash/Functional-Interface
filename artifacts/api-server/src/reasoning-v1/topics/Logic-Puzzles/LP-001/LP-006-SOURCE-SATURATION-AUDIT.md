# LP-006 Source and Ownership Audit

Status: **review-only implementation; uploaded-reference intake completed for the current discovery wave; source crosswalk and human English approval remain open.**

LP-006 adds the advanced synthesis authority: four people are matched one-to-one with a day, a study area and a standard exam-level city. Every rendered question repeats the complete setup, including the people, all four days, all four study areas, all four cities, and the one-to-one rule. The six scenario templates now draw four labels from pools of ten people and eight study areas, while the shared city pool contains 24 full, widely recognised city names. The caselet combines direct assignments, a before relation and a subject-to-city link. It is distinct from LP-002's two-attribute day/location schedule and LP-005's two-attribute duty/location grid.

Difficulty is structural: Easy caselets use direct placements only; Medium caselets add one before relation and one negative subject-city link; Hard caselets use one direct city anchor, a before relation, and both positive and negative subject-city links.

## Candidate ownership

| Candidate | Provisional scope | Main misconception |
|---|---|---|
| `LP-QL-021` | identify the day assigned to a named person | confusing a day relation with a direct day assignment |
| `LP-QL-022` | identify the subject assigned to a named person | mixing a subject with the city linked to it |
| `LP-QL-023` | identify the city assigned to a named person | reading the subject-city clue as a person-city clue |
| `LP-QL-024` | verify a complete person/day/subject/city match | combining values from different rows |

## Uploaded reference intake — 2026-09-08

| Uploaded reference | Relevant evidence inspected | LP-006 consequence |
|---|---|---|
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | pp. 240–244: day-, subject-, date- and variable-based puzzle families, before/after relations and completed solution tables | LP-006 uses a three-attribute state with an ordering clue and a final table-based explanation |
| `reasoning_aggarwal.pdf` / `reasoning_aggarwal(1).pdf` | p. 248: multi-clue lecture caselet and follow-up projections | one parent caselet produces four different lookups, including a complete-match question |
| `reasoning book.pdf` | pp. 164–165: inverse arrangement reading and direction-safe relations | the solver separates direct person lookups from subject-city linkage and keeps the before relation directional |

No source wording is copied. The uploaded books are convention-level references, not an official source-year crosswalk. SSC/RRB/Banking source mapping, human English review, localization and permanent QL allocation remain open.

The implementation proves unique solutions, necessary displayed clues, independent re-solving, six scenario profiles, standard city objects without a `Centre` suffix, three difficulty bands and balanced answer positions across 100 caselets and 400 child questions. Each explanation now records direct entries, ordering/linkage deductions and one-to-one completion in progressively filled tables. The package remains `REVIEW_ONLY` and does not write to the Question Bank or publish student content.
