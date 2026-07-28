# ANA-CP-008 CP-006 Length-Boundary Amendment

Status: **GREEN EXECUTABLE BOUNDARY**

This amendment clarifies the CP-006 section of `ana-cp-008-cross-topic-bridge-audit.md`.

## 1. Discovered boundary

The first bridge run incorrectly required at least one positive CP-006 matcher result.

The real repository domains show why that requirement was invalid:

- current CP-008 cluster authorities use two-letter input and output clusters;
- CP-006 core and positional transformation families begin at cluster length 3;
- the CP-006 length-2 support belongs to neighbour expansion, whose output shape does not match the current two-letter-to-two-letter CP-008 transforms.

Therefore the correct present result is:

```text
CP-006 matcher invoked: YES
Comparable current component fixtures checked: YES
Positive CP-006 matches: 0
Result interpretation: EXPECTED DOMAIN SEPARATION
```

Zero matches are evidence of a clean current boundary, not missing test coverage.

## 2. Mechanical verification

The diagnostic runner now verifies representative two-letter component evidence through the real CP-006 matcher:

```text
PL -> UQ, MI -> RN
KH -> NF, NU -> QS
DA -> GD, SP -> VS
TR -> XC, AC -> EN
```

All four evidence groups must return no CP-006 matches.

These groups cover:

- shared uniform delta;
- independent positional vector plus fixed number delta;
- positional vector plus exact multiplier;
- positional vector plus direct cube.

The complete CP-008 bridge audit still separately requires all visible letter and number components to be indispensable across all 81 contexts.

## 3. Corrected interpretation

For current CP-008:

- a CP-005 positive component match is expected for some single-letter mixed contexts;
- a CP-006 positive component match is not required because the current cluster length and output shape are outside comparable CP-006 domains;
- the CP-006 matcher must still be executed against representative projections;
- any unexpected future positive match must be reviewed as either valid delegated component reuse or a complete ownership collision.

## 4. Future trigger

Reopen the positive-overlap question when CP-008 admits any of these:

- three-or-more-letter cluster inputs;
- neighbour expansion;
- deletion/insertion;
- rotation/reversal/permutation;
- another output shape supported by CP-006.

At that point, the bridge must classify positive CP-006 matches per context rather than relying on the current zero-overlap boundary.

## 5. Freeze consequence

This amendment clears the current CP-006 bridge gate for the 81-context pilot.

It does not clear the remaining permanent-freeze blockers:

- unified numeric analogy bridge;
- CP-007 generic meaningful-word bridge decision;
- Coding-Decoding grammar/source audit;
- CP-009 matcher/delegation bridge;
- final source and localization audits.
