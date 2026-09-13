# TRG External Material Challenge Matrix V1

Status: **AUDIT SEED CORPUS — RUNTIME MAPPING IN PROGRESS — NO FREEZE EFFECT**

This matrix converts uploaded book/material evidence into normalized challenge archetypes. It is deliberately separate from production activation and frequency weighting.

## Source A — Disha SSC Mathematics Guide: Trigonometry and Its Applications

Source ID: `DISHA-SSC-MATH-TRIG`

Primary inspected exercise region: PDF pages 409-413 (book pages approximately 405-409), with the chapter continuing beyond this sample.

| External form | Normalized archetype | Owner | Initial audit expectation |
|---|---|---|---|
| `sin θ = 11/15`, find `cos θ` | GIVEN_ONE_RATIO_FIND_ANOTHER | TRG-001 | DIRECT candidate |
| `tan θ = 3`, find `sec θ` | TAN_TO_SEC_PYTHAGOREAN | TRG-001 | DIRECT candidate |
| `9sec²A - 9tan²A` | SCALED_FUNDAMENTAL_IDENTITY | TRG-001 | DIRECT candidate |
| `(sec A + tan A)(1 - sin A)` | MULTI_IDENTITY_SIMPLIFICATION | TRG-001 | DIRECT/VARIATION check |
| `sin A/tan A + cos A` | RATIO_CONVERSION_SIMPLIFICATION | TRG-001 | DIRECT candidate |
| `cos(40°+x)=sin30°`, find x | COFUNCTION_ANGLE_EQUATION | TRG-001 | DIRECT candidate |
| `tan1° tan2° ... tan89°` | COMPLEMENTARY_PRODUCT_COLLAPSE | TRG-001 | VARIATION check |
| `sin θ=1/2`, evaluate cubic cosine expression | TRIPLE_ANGLE_STYLE_EXPRESSION | TRG-001 | VARIATION/MISSING check |
| `tan θ + cot θ = 2`, find squared sum | TAN_COT_ALGEBRAIC_RELATION | TRG-001 | DIRECT candidate |
| long `cos²5° + ... + cos²90°` sum | COMPLEMENTARY_SUM_SERIES | TRG-001 | VARIATION check |
| `tan7° tan23° tan60° tan67° tan83°` | COMPLEMENTARY_PAIR_PRODUCT | TRG-001 | DIRECT/VARIATION check |
| `(sec-cos)(cosec-sin)(tan+cot)` | COMPOSITE_IDENTITY_PRODUCT | TRG-001 | DIRECT/VARIATION check |
| minimum `4tan²θ + 9cot²θ` | TRIG_EXTREMUM_AMGM | TRG-001 | DIRECT/VARIATION check |
| `sinθ-cosθ` given, find `sinθ+cosθ` | SUM_DIFFERENCE_SQUARE_RELATION | TRG-001 | DIRECT candidate |
| `cosecθ-cotθ` given, find cosecθ | RECIPROCAL_CONJUGATE_RELATION | TRG-001 | DIRECT candidate |
| `sec²θ+tan²θ=7`, find θ | IDENTITY_PLUS_STANDARD_ANGLE_SOLVE | TRG-001 | DIRECT/VARIATION check |
| mixed `sin² + tan² - sec² + cos²` | FUNDAMENTAL_IDENTITY_COMPOSITE | TRG-001 | DIRECT candidate |
| `2(cos²θ-sin²θ)=1`, find cotθ | DOUBLE_ANGLE_TO_RATIO | TRG-001 | DIRECT/VARIATION check |
| cubic numerator over linear trig denominator | CUBIC_FACTORIZATION_TRIG | TRG-001 | DIRECT via P2 QL-143 |
| quadratic trig relation to higher powers | HIGHER_POWER_FROM_QUADRATIC_RELATION | TRG-001 | DIRECT via P2 QL-126 sibling |
| compare/order sin and cos over acute interval | ACUTE_INTERVAL_SIN_COS_ORDER | TRG-001 | DIRECT via P2 QL-024 |

### Disha application forms owned by TRG-002

The same chapter mixes pure trigonometry with Heights & Distances. These must not inflate TRG-001 coverage.

Observed application archetypes include:

- tower angle of elevation after moving toward the tower;
- aeroplane observed at changing elevations;
- shadow-height relation;
- complementary angles of elevation from two observation points;
- kite/string height;
- chimney/tower two-position observation;
- opposite-side flagstaff observations;
- lighthouse angle of depression;
- tower/pole relative height;
- changing solar altitude and shadow length.

All of these are `TRG-002` challenges unless the decisive work is a pure non-height trig identity.

## Source B — R.S. Aggarwal Quantitative Aptitude: Heights and Distances

Source ID: `RS-AGGARWAL-HEIGHTS-DISTANCES`

Inspected objective exercise: PDF pages 882-884.

| External form | Normalized archetype | Owner | Initial audit expectation |
|---|---|---|---|
| shadow is 3× height, find sun elevation | SHADOW_RATIO_TO_ANGLE | TRG-002 | audit |
| tower height + one elevation, find distance | ONE_POINT_HEIGHT_DISTANCE | TRG-002 | audit |
| ladder angle + base distance, find ladder | LADDER_LENGTH_FROM_ANGLE | TRG-002 | audit |
| observer eye height correction | OBSERVER_HEIGHT_OFFSET | TRG-002 | audit |
| two ships opposite sides of lighthouse | TWO_SIDED_OBSERVERS | TRG-002 | audit |
| move toward tower, elevation changes | MOVING_OBSERVER_TWO_ANGLES | TRG-002 | audit |
| moving boat, depression changes over time | MOVING_TARGET_DEPRESSION_SPEED | TRG-002 | audit |
| two objects same side, two depression angles | SAME_SIDE_TWO_TARGETS | TRG-002 | audit |
| car approaching tower, timed angle change | MOVING_TARGET_TIME_TO_BASE | TRG-002 | audit |
| top/bottom of pole seen from tower | DIFFERENTIAL_HEIGHT_TWO_LEVELS | TRG-002 | audit |
| cloud and reflection in lake | REFLECTION_HEIGHT | TRG-002 | audit |
| complementary elevations at distances m²,n² | COMPLEMENTARY_ELEVATIONS_SYMBOLIC | TRG-002 | audit |

## Classification procedure

Each row must ultimately become exactly one of:

- `DIRECTLY_COVERED`
- `COVERED_WITH_VARIATION`
- `MISSING`
- `OUT_OF_SCOPE`

A row is not `DIRECTLY_COVERED` merely because Examtree can solve the mathematics. The runtime must demonstrate an exam-natural construction with appropriate distractors and explanation.

## Freeze rule

TRG-001 P2 must not be declared externally exhaustive solely from the internal 144-QL design. Before final chapter closure, this matrix should be mapped against runtime/authority and any recurring in-scope `MISSING` forms remediated or explicitly rejected with rationale.

Book-only exotic forms should not automatically expand the package. Real SSC evidence outranks book breadth.
