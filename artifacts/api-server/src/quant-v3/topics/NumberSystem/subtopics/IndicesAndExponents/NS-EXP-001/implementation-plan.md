# NS-EXP-001 Implementation Plan

## Phase A Output Status

This package defines architecture discovery only. It does not create runtime content or executable logic.

Exactly five files belong to this package:

- `archetype.md`
- `canonical-problems.md`
- `difficulty-framework.md`
- `reasoning-patterns.md`
- `implementation-plan.md`

## Active CP List

| CP ID | Name |
|---|---|
| NS-EXP-001-CP01 | Same-base exponent compression |
| NS-EXP-001-CP02 | Same-base exponent equation |
| NS-EXP-001-CP03 | Common-base transformation and exponent solving |
| NS-EXP-001-CP04 | Negative exponent normalization |
| NS-EXP-001-CP05 | Fractional exponent to root |
| NS-EXP-001-CP06 | Mixed exponent expression simplification |
| NS-EXP-001-CP07 | Exponential comparison by base alignment |
| NS-EXP-001-CP09 | Value substitution using a given power relation |

Topology count: 8

## Merged Candidates

Merged into CP01:

- product law drills
- quotient law drills
- power-of-power drills
- same-base mixed product and quotient expressions

Merged into CP02:

- missing exponent with identical bases
- linear exponent equation with identical bases

Merged into CP03:

- converting \(4,8,16,32\) to base \(2\)
- converting \(9,27,81\) to base \(3\)
- converting \(25,125,625\) to base \(5\)
- simplification after base conversion
- comparison after base conversion
- exponent solving after base conversion
- equations such as \(4^x=2^{10}\), \(9^{x+1}=3^8\), \(8^{2x}=2^{12}\), and \(27^2=3^x\)

Merged into CP04:

- reciprocal powers
- same-base expressions containing negative exponents
- quotient expressions with negative exponents

Merged into CP05:

- square-root exponent forms
- cube-root exponent forms
- \(a^{m/n}\) forms with clean integer results
- direct radical-to-exponent forms

Merged into CP06:

- multi-law simplification expressions
- expressions combining common-base conversion and reciprocal movement
- expressions combining root conversion and same-base compression

Merged into CP07:

- greater-than comparison
- increasing-order questions
- decreasing-order questions
- equality identification

Merged into CP09:

- \(a^{x+k}\) from known \(a^x\)
- \(a^{x-k}\) from known \(a^x\)
- \(a^{mx}\) from known \(a^x\)

## Rejected Candidates

Rejected for being too direct:

- evaluate \(2^3\)
- state the product law of exponents
- identify whether \(a^m a^n=a^{m+n}\)

Rejected as different subtopics:

- unit digit of powers
- last two digits of powers
- modular exponent cycles
- scientific notation
- logarithms
- compound interest growth

Rejected as too advanced for Phase A:

- exponential equations with summed terms
- irrational approximation comparisons
- logarithmic transformations
- graph-based exponential inequalities

## Future Implementation Order

If this package moves beyond Phase A, the recommended order is:

1. Build CP01 and CP02 first because they anchor the base laws.
2. Add CP03 next because it owns simplification, comparison, and exponent solving after common-base conversion.
3. Add CP04 and CP05 as normalization topologies.
4. Add CP06 only after the single-law CPs are stable.
5. Add CP07 and CP09 for exam-style reasoning transfer.

## Guardrails For Future Work

Future implementation must not share stems, explanations, shortcuts, or distractors by default. Each CP should own its own assets inside its own future archetype folder.

Future implementation must reject:

- formula-only drills
- chapter-summary variants
- artificially inflated arithmetic
- questions whose only difference is base number
- questions that require no exponent reasoning

## Verification Checklist

- Exactly five Markdown files exist in this package.
- No JSON libraries exist.
- No runtime TypeScript files exist.
- No generators exist.
- No solvers exist.
- No validators exist.
- No pipelines exist.
- No reasoning graphs exist.
- No tests exist.
- No audits exist.

Recommended next step:
Review the nine active CPs against real exam question banks, then approve or revise the CP list before any runtime implementation begins.
