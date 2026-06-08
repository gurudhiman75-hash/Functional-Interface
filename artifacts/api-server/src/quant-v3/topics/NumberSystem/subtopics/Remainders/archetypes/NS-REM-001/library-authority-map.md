# NS-REM-001 Library Authority Map

## Scope

This document identifies the authoritative human-owned educational libraries for NS-REM-001.

NS-REM-001 has moved from specification/library preparation into the approved implementation phase. The runtime implementation must use only the approved libraries listed here.

## Authority Table

| Library | Owner | Purpose | Runtime Usage | Validation Rules |
|---|---|---|---|---|
| target-remainder.library.json | Human reviewer | Defines approved divisors and mathematically allowed target remainder ranges. | Future generators may select only approved divisor and target remainder combinations from this library. | Divisor must be approved. Target remainder must be an integer and must satisfy 0 <= remainder < divisor. Human classification fields must not be inferred by code. |
| structural-pattern-library.json | Human reviewer | Defines structural number patterns by length, missing position, digit pool, repetition policy, and fixed position constraints. | Future production generation may create concrete instances only from approved structural patterns. | Pattern ID must be unique. Length must match supported range. Missing position must be within length. Digit pool, repetition policy, and fixed constraints must be valid registered values. |
| difficulty-bands.library.json | Human reviewer | Defines Easy, Medium, and Hard bands for future selection and audit grouping. | Future generation may tag instances by approved band after implementation rules exist. | Difficulty band ID must be approved. Thresholds and drivers must remain library-owned and reviewable. Runtime must reject unknown difficulty bands. |
| distribution-targets.library.json | Human reviewer | Defines batch-level variety targets for patterns, divisors, target remainders, difficulty, question language, and explanation language. | Future audit and generation controls may compare batch output against these limits. | Distribution IDs must be unique. Percentage limits must be numeric and bounded. Runtime must not invent additional distribution categories. |
| question-language.library.json | Human reviewer | Stores approved CP-level question wording and CP-to-language mappings. | Runtime stem rendering must use only these entries. Missing entries fail validation. | Question Language ID must be mapped to the CP. Rendered question text must match the library output exactly. |
| explanation.library.json | Human reviewer | Stores approved explanation wording templates. | Runtime explanation rendering must use only these entries. Missing entries fail validation. | Explanation Style ID must exist in the library. Rendered explanation must consume graph-derived valid set, target remainder where present, and answer. |

## Mandatory Libraries

The educational library architecture now includes:

- target-remainder.library.json
- structural-pattern-library.json
- difficulty-bands.library.json
- distribution-targets.library.json
- question-language.library.json
- explanation.library.json

These are the required runtime library files for NS-REM-001.

## Complete Libraries

The following libraries are complete and used by runtime validation:

- question-language.library.json
- explanation.library.json

These files define identifiers, numeric ranges, structural fields, validation boundaries, question language, and explanation language.

## Implementation Blockers

No library-content blocker remains for CP-001 through CP-007.

Runtime must still fail validation if a CP requests an unmapped Question Language ID or an unregistered Explanation Style ID.

## Non-Authority Documents

The following documents remain useful for design context, but the libraries above are the authority for implementation-time educational data:

- canonical-problems.md
- library-design-package.md

If a conflict exists between a design document and a runtime library file, the runtime library file is authoritative for implementation.

## Readiness Review

NS-REM-001 now has a complete runtime educational library set for CP-001 through CP-007.

Ready and implemented:

- Approved divisor universe is represented.
- Mathematical target remainder ranges are represented.
- Structural pattern schema is represented.
- Difficulty band file exists.
- Distribution target file exists.
- CP-level question language exists.
- Explanation language exists.
- Runtime validator rejects missing language IDs.

Final readiness state:

NS-REM-001 CP-001 through CP-007 are implemented against the approved libraries.
