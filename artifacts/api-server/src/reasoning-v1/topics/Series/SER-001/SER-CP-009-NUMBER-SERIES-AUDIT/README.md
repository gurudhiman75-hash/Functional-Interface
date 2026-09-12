# SER-CP-009 — Pure Number Series final-audit remediation

Status: **review-only / provisional / not production-authorized**.

## Why this checkpoint exists

The frozen `SER-QL-001..013` corpus is dominated by letter and letter-cluster series. `SER-CP-008` closes single-letter and alphanumeric/mixed-series gaps, but it still does not cover pure numeric reasoning series.

That is a real source gap rather than an optional expansion:

- SSC CGL 2022 asks `382, 322, 272, 232, 202, ?`.
- SSC CGL 2023 asks `232, 221, 199, ?, 122, 67`.
- SSC CGL 2024 asks `1, 3, 10, 41, ?, 1237`.
- Standard reasoning sources treat **Number Series** and **Letter Series** as separate major series types and include missing-term, next-term and wrong-term tasks.

The 2022 and 2023 fixtures are progressive-difference questions. The 2024 fixture is the source-backed progression `×2 + 1, ×3 + 1, ×4 + 1, ×5 + 1, ×6 + 1`.

## Ownership boundary

This checkpoint owns **SSC-style numeric reasoning series under `SER-001`**.

It does **not** absorb the separate planned **Banking Number Series / Speed Maths** product family. Banking can reuse low-level numeric-series primitives later, but its exam profile, five-option presentation where applicable, family weighting, speed calibration and bank-specific distributions remain separate product responsibilities.

It also does not move arithmetic-progression formula questions, sums of series, or mathematical progression theory into Reasoning.

## Provisional QL authorities

| QL | Authority | Source-backed solve contract |
|---|---|---|
| `SER-QL-029` | `FIXED_DIFFERENCE_NUMBER_SERIES` | continue a constant signed difference |
| `SER-QL-030` | `PROGRESSIVE_DIFFERENCE_NUMBER_SERIES` | continue a first-difference progression / constant second difference |
| `SER-QL-031` | `FIGURATE_DIFFERENCE_NUMBER_SERIES` | differences are consecutive squares, cubes or triangular numbers |
| `SER-QL-032` | `CONSTANT_RATIO_NUMBER_SERIES` | continue integer multiplication or exact division by a fixed factor |
| `SER-QL-033` | `ALTERNATING_OPERATION_NUMBER_SERIES` | continue a repeated `+a, ×b` operation cycle |
| `SER-QL-034` | `INTERLEAVED_DOUBLE_NUMBER_SERIES` | separate odd/even numeric rows and continue the target row |
| `SER-QL-035` | `PROGRESSIVE_MULTIPLIER_ADJUSTMENT_SERIES` | multipliers progress while a small fixed adjustment remains active |
| `SER-QL-036` | `DIRECT_POWER_NUMBER_SERIES` | continue square/cube values with a source-backed fixed offset |
| `SER-QL-037` | `PRIME_DIFFERENCE_NUMBER_SERIES` | differences follow consecutive or alternate primes |
| `SER-QL-038` | `FIBONACCI_LIKE_NUMBER_SERIES` | each new term is the sum of the previous two |
| `SER-QL-039` | `DIGIT_ROTATION_NUMBER_SERIES` | rotate a governed digit block while preserving the fixed digit |
| `SER-QL-040` | `WRONG_TERM_POWER_SERIES` | identify the sole corrupted term in a square/cube-with-offset series |
| `SER-QL-041` | `GROUPED_MULTI_MISSING_NUMBER_SERIES` | reconstruct repeated three-term blocks with two progressing rows and a fixed marker |
| `SER-QL-042` | `INTERNAL_DIGIT_RELATION_OPTION_SERIES` | choose the option preserving the displayed within-number digit relation |

## Guardrails

1. No arbitrary random formula composition. Every authority is a bounded source-backed grammar.
2. Generated questions must be solvable from the learner-visible state. The verifier does not read generator internals.
3. Ambiguous or degenerate instances are rejected and regenerated.
4. Difficulty is structural. Number magnitude is never itself a reason for `HARD`.
5. Four options are used here because this checkpoint targets the SSC Reasoning profile.
6. Distractors represent plausible mistakes: wrong difference, missed alternation, wrong row, wrong multiplier, wrong power/offset, arithmetic slip or neighboring term.
7. Explanations expose the actual differences, ratios, operation cycle, row split or digit transformation used in that instance.
8. Numeric tokens are language-neutral. Only instruction and explanation prose is localized in `en-IN`, `hi-IN` and `pa-IN`.

## Lifecycle safety

All `SER-QL-029..042` payloads remain provisional:

- `reviewOnly: true`
- `questionStudioDiscoverable: false`
- `questionBankWritable: false`
- `mockTestEligible: false`
- `publiclyPublishable: false`
- `permanentQlId: null`

No existing permanent Series QL is changed or renumbered by this checkpoint.
