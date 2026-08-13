# SAP Exhaustiveness Audit — Source Evidence Register

**Date:** 2026-08-13  
**Purpose:** record the evidence that materially changes prior SAP holds or exposes new learner contracts.  
**Lifecycle effect:** none.

## E1 — nested additive exact radicals

Current SSC official-paper material includes a nested exact radical of the structure:

```text
sqrt(388 + sqrt(127 + sqrt(289)))
```

The solve route is innermost root -> containing addition -> next root -> containing addition -> outer root.

**Impact:** the existing CP004 nested-root prototype is too narrow because it models a root composed directly over another exact root of one perfect power. Add a sibling candidate for **nested additive exact radical chains**.

## E2 — exact decimal roots

Current SSC material includes exact roots of terminating decimals and sums of scaled decimal perfect roots.

**Impact:** expand CP004 exact square-root/root-mixed state domains and shared exact decimal handling. Do not create a new QL merely because the radicand is decimal.

## E3 — symbolic nested surds

Recent SSC material also contains symbolic forms such as a square root of an expression involving another irrational square root, where the intended route is surd decomposition/rationalisation.

**Impact:** REASSIGN to Surds and Indices. These fixtures are not evidence for expanding numeric SAP root QLs.

## E4 — supplied-root scaling

Official AAI ATC material provides a value such as `sqrt(10)=3.16` and asks for a related square root to stated decimal precision. Recent UP Police SI material provides approximate square-root values and asks candidates to evaluate scaled terms such as `sqrt(1500)` and `sqrt(0.015)`.

The route is:

1. recognise an exact power-of-ten or rational scaling relationship;
2. extract that exact scale factor;
3. reuse the supplied root approximation;
4. round/select only at the declared final precision.

**Impact:** ADD a CP010 supplied-root-scaling candidate. This is materially different from nearest-perfect-power bracketing.

## E5 — arithmetic significant-figure rounding

Official competitive-exam material contains arithmetic prompts such as rounding a decimal to a specified number of significant figures.

**Impact:** ADD CP007 **round numeric value to N significant figures**.

Boundary: questions whose learner objective is measurement/physics theory or merely counting significant figures should not automatically become SAP. Ownership remains context-dependent.

## E6 — numeric telescoping

Current SSC/state-exam practice streams contain bounded sums of adjacent reciprocal-product terms that are solved by decomposition such as:

```text
1/[n(n+1)] = 1/n - 1/(n+1)
```

followed by cancellation of intermediate terms.

**Impact:** the old CP005 source hold on bounded numeric partial-fraction telescoping should be lifted once the exact fixture set is registered. The learner contract is structural reduction, not routine fraction arithmetic.

Guardrails:

- finite numeric sums only;
- no infinite series;
- no symbolic summation notation requirement;
- explanations show decomposition, cancellation and surviving endpoints.

## E7 — composite/reverse nested approximation

Banking approximation material includes root-heavy missing-value expressions in which an outer approximate root contains additive terms and an inner root/power component.

**Impact:** place reverse/missing-value multi-authority nested approximation in CP012 rather than CP010 when the decisive inference is inversion across several approximation stages.

## Evidence-to-disposition summary

| Evidence | Action |
|---|---|
| nested additive exact radical | CP004 ADD |
| exact decimal perfect roots | CP004 EXPAND |
| symbolic nested surd | REASSIGN Surds and Indices |
| supplied root benchmark/scaling | CP010 ADD |
| arithmetic significant-figure rounding | CP007 ADD |
| bounded numeric telescoping | CP005 ADD after fixture registration |
| reverse composite root/power approximation | CP012 ADD during implementation |

No evidence in this register allocates a permanent QL.
