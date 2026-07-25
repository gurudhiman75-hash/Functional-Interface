# ANA-CP-001 Implementation Report

Status: rebuilt to v2 source-complete; checked-out workspace execution still pending.

## Scope

- 36 English QLs (`ANA-QL-001` through `ANA-QL-036`)
- 18 direct semantic relationship families
- missing-fourth-term and equivalent-pair presentation modes
- 216 curated English semantic facts (12 per relation)
- explicit relation definitions and natural-language predicates
- deterministic seeded Fisher-Yates option shuffling
- category-safe word distractors
- false-but-category-valid pair distractors
- four unique options with exactly one correct answer
- natural student-facing explanations with no internal `SEM_*` identifiers
- fact metadata for version, verification date, risk, source type, difficulty and editorial notes

## v2 corrections

The original 72-fact pilot used target-word distractors, predictable option rotation, generic explanations and mechanically reversed pair options. Those behaviors have been removed.

Missing-term options now all belong to the required answer category. Pair-selection options all preserve the expected source/answer categories, but only one pair is a registered fact. The generator independently rejects accidental valid distractor pairs.

## Audit contract

The exhaustive contract test covers all 36 QLs across 100 seeds each (3,600 generated questions) and asserts:

- 216 unique curated facts
- 12 facts per relation
- unique options
- exactly one correct answer
- no target-term-as-distractor shortcut
- no internal rule IDs in explanations
- false pair distractors against the authoritative fact set
- answer-position balance within a 1.2 max/min ratio

## Remaining before freeze

- execute the TypeScript bundle/test in a checked-out repository workspace
- run editorial review on a newly generated v2 review export
- wire Question Studio discovery and smoke-test the API path
- create Hindi and Punjabi language-adapted datasets in later localization checkpoints
