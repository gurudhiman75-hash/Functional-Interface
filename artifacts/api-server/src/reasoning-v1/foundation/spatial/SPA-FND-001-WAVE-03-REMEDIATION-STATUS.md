# SPA-FND-001 Wave 03 — Perceptual and Editorial Remediation

## Status

`IMPLEMENTED_AWAITING_EXACT_HEAD_CI`

This corrective wave is stacked on the validated Wave 03 Mirror/Water mixed proof. It addresses the manual review findings without allocating permanent QLs or activating Question Studio.

## Corrected defects

- replaced the single asymmetric clock marker with twelve symmetric clock ticks;
- removed the near-identical snapped-hour distractor from the review corpus;
- added a borrow-error clock distractor separated by a full hour-hand interval;
- added hard pairwise clock endpoint-separation validation;
- retained continuous hour-hand geometry and mirror shortcut cross-checks;
- diversified seeded geometric scenes across quadrilateral, nested-circle, open-zigzag and irregular-hexagon templates;
- added marker-clearance rejection for source and option scenes;
- polished the vector authorities for digit 4 and Latin P, R and Q;
- replaced the block answer pattern with a balanced non-repeating sequence;
- added explicit mirror/water presentation lines outside semantic scene geometry;
- added question-specific geometric explanations based on actual marker and secondary-shape movement;
- added recommended render sizes, including larger clock options;
- added deterministic JSON and HTML editorial exports.

## Corpus boundary

```text
Mirror Images: 12
Water Images:   8
Total:         20
Correct slots: A5 / B5 / C5 / D5
Adjacent repeated answer positions: 0
```

## Required exact-head status

```text
PASS_SPA_FND_001_WAVE_03_PERCEPTUAL_REMEDIATION
```

The workflow also reruns the spatial foundation and complete Wave 02 regression proof.

## Lifecycle lock

```text
Permanent QLs:                0
Question Studio discovery:    false
Question Bank writes:         false
Mock-test eligibility:        false
Public publication:           false
API/database schema changes:  none
```
