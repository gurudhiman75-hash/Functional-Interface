# MEN-001 / MEN-CP-001 Content Audit

Status: runtime-proof baseline, not frozen.

## Scope reviewed

- 24 active English QLs: `MEN-001-QL-001` through `MEN-001-QL-024`.
- 14 solve modes.
- 480 deterministic runtime generations: 20 seeds for every QL.
- SSC, Banking and Punjab-state-exam product framing.
- Supplied SSC and quantitative-aptitude books used only as pattern, language and coverage references.

## Coverage distribution

| Solve family | QL count |
|---|---:|
| Direct base-height area | 3 |
| Reverse height | 2 |
| Reverse base | 2 |
| Heron's formula | 3 |
| Right-triangle area | 2 |
| Exact equilateral area | 2 |
| Equilateral area to perimeter | 1 |
| Equilateral perimeter to side | 1 |
| Isosceles area | 2 |
| Isosceles height | 1 |
| Side ratio and perimeter to area | 2 |
| Largest side from ratio and perimeter | 1 |
| Smallest side from ratio and perimeter | 1 |
| Area-rate-cost application | 1 |
| **Total** | **24** |

## Difficulty distribution

| Difficulty | QL count |
|---|---:|
| Easy | 6 |
| Medium | 12 |
| Hard | 6 |

Difficulty comes from reverse measurement, hidden altitude recovery, ratio reconstruction and multi-stage cost logic rather than large arithmetic.

## Answer and unit distribution

| Output | QL count |
|---|---:|
| Square metres | 7 |
| Square centimetres | 7 |
| Metres | 5 |
| Centimetres | 4 |
| Rupees | 1 |

The runtime distinguishes length, area and cost. It does not treat units as decorative strings.

## Quality findings

### Passed

- Every QL has a distinct normalized English template.
- Every QL has at least three registered misconception families.
- Template placeholders exactly match the task registry.
- All active solve modes have deterministic state generation.
- Heron states satisfy triangle inequality and produce exact integer areas.
- Isosceles states satisfy Pythagoras exactly.
- Ratio-derived sides conserve the stated perimeter.
- Equilateral areas preserve the exact `√3` form.
- Cost answers equal calculated area multiplied by the registered rate.
- Correct answers appear exactly once among four options.
- Stem, solver, reasoning graph, explanation and options share one mathematical state.
- No Hindi or Punjabi placeholder content is exposed as production content.

### Editorial assessment

The QL set has genuine mathematical coverage, not 24 renamings of the same formula. Direct and reverse families deliberately contain contextual variants because short, clean stems are common in SSC-style exams. Harder QLs introduce a different reasoning path rather than merely larger numbers.

The current language is concise and exam-like. Explanations are longer than the stems and begin with the decisive relationship before substitution.

## Deliberately excluded from MEN-CP-001

- triangle congruence, similarity proofs and angle theorems;
- midpoint, median and theorem-led area results owned by Geometry;
- `1/2 ab sin C` and side recovery through trigonometric ratios;
- composite plane figures, inscribed figures and path/border problems;
- percentage scaling and mixed-unit transformations owned by later MEN-001 CPs.

## Remaining MVP gates

1. Review a fixed editorial sample across every QL, including the generated distractors and explanation wording.
2. Decide which optional-diagram QLs actually require diagrams for publication.
3. Add a diagram state contract before activating any `REQUIRED` diagram QL.
4. Add Hindi and Punjabi only after the English QLs pass manual review.
5. Wire the package into Question Studio only after integration against the current `New-main` generation engine.
6. Keep `publiclyPublishable: false` until all previous gates are complete.

## Freeze recommendation

`MEN-CP-001` is ready to remain the MEN-001 runtime-proof foundation. It is not yet ready to be labelled production-frozen or publicly publishable.
