# ANA-CP-005 Implementation Report

Status: source-complete for English, Hindi and Punjabi; checked-out runtime execution pending.

## Scope

- 20 QLs: `ANA-QL-141` through `ANA-QL-160`
- 10 single-letter alphabet rule families
- 2 presentation modes per rule:
  - missing fourth term
  - equivalent pair selection
- four structured-text layouts
- deterministic seeded generation
- independent solver validation
- equal-or-simpler ambiguity rejection
- registry-level complete-rule collision audit
- rule-derived distractors with machine-readable error labels
- English, Hindi and Punjabi runtime support
- English and localized review exporters

## Rule families

1. fixed forward shift
2. fixed backward shift
3. opposite alphabet letter
4. opposite then forward shift
5. opposite then backward shift
6. double alphabet position
7. double position minus one
8. halve an even position
9. add one to an odd position and halve
10. opposite of the doubled position

## Runtime contracts

Every generated question must have:

- exactly four unique options;
- exactly one correct answer;
- independent solver agreement;
- an unambiguous source-and-target relationship;
- deterministic output for the same QL and seed;
- explicit dynamic shift values in explanations;
- no internal `ALPHA_*` identifiers in student-facing text;
- four layout variants;
- easy, medium and hard runtime bands.

## Audit size

The committed English audit samples:

- 20 QLs;
- 80 seeds per QL;
- 1,600 generated English questions.

The committed localized audit samples:

- 20 QLs;
- 40 seeds per QL;
- 2 locales;
- 1,600 generated localized questions.

Total planned runtime audit volume: 3,200 questions.

## Important boundary

This checkpoint covers only single-letter analogy. Multi-letter clusters remain reserved for `ANA-CP-006` (`ANA-QL-161` through `ANA-QL-200`). Figure analogy remains outside ANA-001.

## Remaining before merge

- execute both tests in a checked-out repository;
- inspect generated English, Hindi and Punjabi review files;
- correct any runtime collision or editorial issue revealed by execution;
- wire CP-005 into chapter-level discovery only after tests pass;
- open a PR against `New-main` and merge after user approval.
