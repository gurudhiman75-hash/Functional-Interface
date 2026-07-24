# ANA-CP-001 Implementation Report

Status: source implementation complete; repository execution pending.

## Scope

- 36 English QLs (`ANA-QL-001` through `ANA-QL-036`)
- 18 direct semantic relationship families
- missing-fourth-term and equivalent-pair presentation modes
- 72 curated English semantic facts
- deterministic seeded generation
- direction-sensitive explanations
- four unique options with exactly one correct answer
- rule-level fact-count and generation contract test

## Important design behavior

Equivalent-pair QLs produce pair-valued options rather than reusing single-word options. Reversed pairs and mismatched relation members are explicitly labelled distractors.

## Deferred

- Hindi and Punjabi language-adapted semantic datasets
- Question Studio discovery wiring
- production runtime smoke test in a checked-out workspace
- broader editorial and factual audit against all uploaded SSC papers
