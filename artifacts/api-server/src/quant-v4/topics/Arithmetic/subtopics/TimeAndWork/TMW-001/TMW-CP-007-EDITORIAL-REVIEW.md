# TMW-CP-007 Editorial Review

**Sample:** 16 QLs × 3 seeds = 48 generated candidate questions  
**Language:** English  
**Publication:** disabled

## Learner explanation contract

Every generated question contains:

1. a learner-facing key rule;
2. one governing formula in literal inline MathJax `\(...\)`;
3. explicit generated givens;
4. at least two complete standard working steps;
5. a solve-mode-specific exam shortcut;
6. a common-trap explanation tied to an actual shuffled distractor;
7. a contextual conclusion.

## Editorial decisions applied

- worker and machine contexts use the same mathematics but natural learner wording;
- machine questions use “group”, “machine set-up” or “arrangement”, not “crew”, in learner prose;
- “per-unit efficiency” is used instead of the person-specific phrase “per-person efficiency”;
- output units remain contextual: files, copies, bottles, components or work units;
- weighted equations omit zero terms such as `0e_A`;
- ratio and fraction working does not repeat an already reduced value;
- three-equation explanations show readable weighted equations; the exact determinant solver remains an internal verifier;
- equivalent-count and replacement-count wordings live under one QL rather than becoming wording-only duplicates;
- shortcuts follow the full standard solution and never replace it;
- trap option letters and values are derived from the actual shuffled option array.

## Exam-shortcut families

- reverse equivalent group counts for individual efficiency ratios;
- build a common middle term for three-category ratios;
- convert every category to weighted capacity units;
- use required rate minus known rate for a missing category count;
- subtract paired crew equations when one category count is unchanged;
- use capacity exchange for equivalent or replacement counts;
- use old rate × old time before recalculating replacement completion time;
- express mixed contribution in a declared standard category;
- search only exact positive-integer compositions for minimum-count questions;
- use the rate-gap method before taking the reciprocal for unknown solo time;
- use weighted contribution rather than raw headcount.

## Review corrections discovered after the first green proof

The first locally passing implementation was not accepted unchanged.

- two mathematically identical count QLs were merged, reducing the chapter from 17 provisional QLs to 16 justified QLs;
- machine-context learner prose was naturalised;
- generic units were replaced by the generated output unit;
- matrix-first student explanations were replaced by readable simultaneous equations;
- redundant equalities such as `19:16=19:16` and `4/15=4/15` were removed;
- zero-coefficient equation terms were removed;
- additional audit guards were added for these defects.

## Current verdict

The English generator is ready for exact-head CI and manual review at runtime-proof maturity. It remains a candidate generator only and is not yet connected to student delivery.
