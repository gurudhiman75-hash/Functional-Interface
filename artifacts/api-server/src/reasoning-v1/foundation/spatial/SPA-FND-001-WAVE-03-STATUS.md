# SPA-FND-001 Wave 03 — Glyph, Digit and Clock Proof

## Status

`EXACT_HEAD_PROOF_PASSED`

This wave is stacked on the validated Wave 02 Mirror/Water proof branch. It remains prototype evidence only and does not allocate permanent QLs.

## Mixed proof allocation

```text
Mirror Images: 12
Water Images:   8
Total:         20
```

Stimulus distribution:

```text
Seeded geometric compositions: 7
Western Arabic digit strings:  5
Latin vector glyph strings:     5
Analog clocks:                  3
```

Correct answer positions are deliberately balanced:

```text
A: 5
B: 5
C: 5
D: 5
```

## Implemented

- canonical proof vector authority for selected Latin glyphs and Western Arabic digits;
- no browser-font or operating-system glyph dependency;
- script-specific locale ownership for Latin glyph questions;
- instruction-localised ownership for Western Arabic digit questions;
- full-string mirror logic that reverses order and reflects each glyph;
- water-string logic that preserves order and reflects each glyph vertically;
- misconception options for order-only and glyph-only partial transformations;
- deterministic analog-clock SVG scenes;
- continuous hour-hand geometry at 0.5 degrees per minute;
- mirror-clock shortcut versus coordinate-geometry cross-check;
- explicit diagram-only water-clock policy;
- four-part learner explanations: observation, rule, application and check;
- deterministic editorial review JSON containing source SVG, option SVGs, metadata and explanations;
- exact-head artifact upload for manual review.

## Exact-head proof

```text
Head:      195e857d0a0ea00056a475df310c99e47498b086
Workflow:  Validate SPA-FND-001 glyph digit clock proof
Run:       31239418295
Result:    PASS
Artifact:  spa-wave-03-editorial-review
Artifact ID: 9016514906
```

Passed statuses:

```text
PASS_SPA_FND_001_FOUNDATION_RUNTIME
PASS_SPA_FND_001_MIRROR_WATER_PROOF
PASS_SPA_FND_001_GLYPH_DIGIT_CLOCK_PROOF
```

## Regression boundary

Wave 03 CI reruns:

1. the original spatial foundation proof;
2. the complete 20-question Wave 02 geometric corpus;
3. the new 20-question mixed corpus.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```

## Still deferred

- production-size glyph authorities;
- Devanagari and Gurmukhi glyph projects;
- permanent Mirror/Water checkpoint and QL allocation;
- final editorial approval;
- Question Studio integration;
- Figure Analogy, Figure Classification and Figure Series proof generators;
- completion of the 48-question family proof.
