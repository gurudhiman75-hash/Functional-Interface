# MEN-CP-011 Material Ratio and Percentage Change — Wave 01

## Authority

```text
MEN-CP011-RATIO-PERCENT-WAVE-01-V1
```

## Scope

This wave implements the final two candidates from the initial 20-family MEN-CP-011 architecture list:

```text
MEN-CP011-PROT-MATERIAL-VOLUME-RATIO
MEN-CP011-PROT-MATERIAL-VOLUME-PERCENT-CHANGE
```

Both families use hollow cylindrical pipes because the existing pipe material authority is already exact, unit-aware and independently verified.

## Material-volume ratio

For two hollow pipes:

```text
V_A:V_B
= πh_A(R_A²-r_A²) : πh_B(R_B²-r_B²)
= h_A(R_A²-r_A²) : h_B(R_B²-r_B²)
```

The common factor `π` cancels. Each pipe's own length remains part of the comparison.

The exam-speed identity is:

```text
R²-r²=(R-r)(R+r)
```

## Material-volume percentage decrease

The pipe's outer radius and length stay fixed while the bore is widened from `r_old` to `r_new`.

```text
old material coefficient = R²-r_old²
new material coefficient = R²-r_new²

percentage decrease
= [(old-new)/old] × 100
```

The common factor `πh` cancels. The lost coefficient can be calculated directly as:

```text
r_new²-r_old²
= (r_new-r_old)(r_new+r_old)
```

## Runtime and review coverage

```text
Runtime prototypes:                  2
Deterministic packages per family: 128
Total deterministic packages:      256
Balanced review records:            32
Records per family:                 16
Unit profiles:                       2
  centimetres
  metres
Correct positions:                A8 B8 C8 D8
Distinct review physical states:    32
```

The ratio pool contains eight two-pipe comparisons. The percentage pool contains eight physically valid bore-widening transformations.

## Option authority

### Ratio distractors

```text
USED_OUTER_SOLID_VOLUME_RATIO
USED_INNER_VOID_VOLUME_RATIO
USED_LINEAR_THICKNESS_RATIO
```

### Percentage distractors

```text
USED_LINEAR_INNER_RADIUS_PERCENT_CHANGE
USED_VOID_PERCENT_CHANGE_DENOMINATOR
USED_OUTER_SOLID_AS_PERCENT_BASE
```

All options are exact reduced rational values. Ratio options render as `a:b`; percentage options render as exact percentages.

## Explanation contract

Every learner solution includes:

1. the physical material-volume relationship;
2. explicit cancellation of `π` or `πh`;
3. exact annular coefficients;
4. reduced ratio or percentage calculation;
5. difference-of-squares speed reasoning;
6. natural analysis of all displayed wrong options.

## Diagram contract

### Ratio

Two side-by-side annular cross-sections show outer radius, inner radius and pipe length for A and B. A cancellation note states that comparison uses `h(R²-r²)`.

### Percentage change

Before-and-after annular cross-sections show the fixed outer radius and enlarged bore. The diagram states that outer radius and length remain fixed and `πh` cancels.

Both diagrams use:

- centre-connected radius guides;
- dashed inner voids;
- prompt and solution roles;
- matching units and state values;
- no fixed SVG width;
- `min-width: 0` responsive policy;
- text-complete attempt mode without a diagram.

## Validation

The runtime rejects:

- physically invalid radii or bore changes;
- non-positive ratio or percentage answers;
- duplicate exact options or multiple correct answers;
- diagram/state mismatch;
- nested or unbalanced learner MathJax;
- learner-visible internal codes;
- lifecycle or publication leakage.

## Lifecycle

```text
Permanent QLs:                0
Question Studio:              disabled
Question Bank:                NOT_STORED
Test eligibility:             INELIGIBLE
Public publication:           false
Direct source normalisation:  pending
Manual English review:        pending
```

After this wave, every candidate in the initial 20-family architecture list is implemented, covered by an equivalent authority, or explicitly reassigned. Chapter freeze remains blocked by additional axes, source normalisation and human review.
