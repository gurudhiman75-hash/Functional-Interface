# PNL-001 Multilingual Editorial Naturalness — Wave 02

## Purpose

Wave 01 removed the largest Hindi and Punjabi lexical-naturalness defects, but its audit still reported 108 non-fatal repetition clusters across the complete 372-entry native Editorial V2 corpus.

Wave 02 removes those repeated learner-facing authorities without changing mathematics, representation, difficulty, lifecycle or integration state.

## Starting audit baseline

```text
Native libraries:                 12
Hindi entries:                   186
Punjabi entries:                 186
Total native entries:            372
Fatal findings:                    0
Lexical-review findings:           0
Editorial repetition findings:   108
```

The 108 findings were:

```text
Repeated step-title clusters:     48
Repeated common-trap clusters:    24
Repeated conclusion clusters:     24
Repeated opening clusters:        10
Repeated concept clusters:         2
```

## Architecture

The Wave 02 authority wraps the existing validated multilingual normalizer. It does not duplicate or alter any solver, parameter generator, answer authority or option logic.

For every QL and language it preserves:

- checkpoint and permanent QL identity;
- difficulty and representation structure;
- stem block topology;
- MathJax equations;
- worked-step count and equations;
- final-answer MathJax;
- Question Studio, Question Bank, test and publication locks.

Only native learner prose is refined.

## Learner-language treatment

- Wave 01 formal-wording fixes are carried forward from current `New-main` through deterministic post-normalization replacements.
- Each opening retains its topic-specific base and explicitly reconnects the work to the QL's native prompt.
- Concepts receive a short task-owned application sentence.
- Step titles retain their mathematical meaning while rotating through natural native-language framing.
- Conclusions state why the result answers the exact native prompt.
- Common traps retain the original misconception and add a task-specific final check.

The added wording never exposes internal QL IDs, seeds, solve modes or lifecycle metadata.

## Permanent proof target

```text
Libraries:                     12
Entries:                      372
Fatal findings:                 0
Lexical findings:               0
Repeated openings:              0
Repeated concepts:              0
Repeated step titles:           0
Repeated conclusions:           0
Repeated common traps:          0
Structural changes:             0
```

## Safety boundary

No solver equation, answer semantic, option lifecycle, Question Studio route, Question Bank write, test eligibility or public-publication metadata is changed. The chapter remains review-only at the existing lifecycle state.