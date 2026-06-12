# NS-SURD-001 Implementation Plan

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
| NS-SURD-001-CP01 | Perfect-power extraction from a surd |
| NS-SURD-001-CP02 | Like-surd addition and subtraction |
| NS-SURD-001-CP03 | Surd multiplication and division simplification |
| NS-SURD-001-CP04 | Mixed surd expression simplification |
| NS-SURD-001-CP05 | Surd comparison by normalization |
| NS-SURD-001-CP06 | Monomial denominator rationalization |
| NS-SURD-001-CP07 | Binomial denominator rationalization |
| NS-SURD-001-CP08 | Surd identity evaluation |

Topology count: 8

## Merged Candidates

Merged into CP01:

- square-root simplification
- cube-root simplification
- extraction of perfect squares
- extraction of perfect cubes

Merged into CP02:

- addition of like surds
- subtraction of like surds
- like-surd combination after simplification

Merged into CP03:

- multiplication of surds
- division of compatible surds
- product or quotient followed by extraction

Merged into CP04:

- mixed surd expressions
- simplification followed by addition or subtraction
- expressions containing integer and surd parts

Merged into CP05:

- greater-than comparison
- smaller-than comparison
- increasing-order questions
- decreasing-order questions

Merged into CP06:

- rationalization of \(1/\sqrt{a}\)
- rationalization of \(k/\sqrt{a}\)
- rationalization with a rational coefficient outside the denominator radical
- simple cube-root monomial denominator rationalization

Merged into CP07:

- denominator \(a+\sqrt{b}\)
- denominator \(a-\sqrt{b}\)
- denominator \(\sqrt{a}+\sqrt{b}\)
- denominator \(\sqrt{a}-\sqrt{b}\)

Merged into CP08:

- square of a surd binomial
- product of conjugates
- identity-based simplification
- evaluation where identity recognition is the primary method

## Rejected Candidates

Rejected for being too direct:

- \(\sqrt{49}\)
- identifying whether a number is a surd
- naming the conjugate without using it
- expanding \((\sqrt{a}+\sqrt{b})^2\) as a formula-recall prompt without a solvable expression

Rejected as different packages:

- proof of irrationality
- nested radical identities
- radical equations with multiple roots
- coordinate geometry radical distance
- mensuration questions with radical answers

Rejected as too approximation-heavy:

- decimal comparison of surds
- approximate square-root estimation
- ordering based only on calculator-style values

## Future Implementation Order

If this package moves beyond Phase A, the recommended order is:

1. Build CP01 first because extraction is used by several other CPs.
2. Add CP02 and CP03 because they cover basic surd arithmetic.
3. Add CP06 because monomial rationalization is common and self-contained.
4. Add CP04 after arithmetic CPs are stable.
5. Add CP05 after simplification and multiplication are stable.
6. Add CP08 after comparison because identity questions depend on simplification but are simpler than full binomial rationalization.
7. Add CP07 last because denominator rationalization with conjugates needs distinct distractors and explanation flow.

## Guardrails For Future Work

Future implementation must reject:

- definition-only questions
- formula-recall questions
- duplicate surface variants with the same reasoning path
- questions solvable only by decimal approximation
- expressions with messy irrational final forms outside exam style

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
Review the seven active CPs against real exam question samples, then approve or revise the CP list before any language draft or runtime implementation begins.
