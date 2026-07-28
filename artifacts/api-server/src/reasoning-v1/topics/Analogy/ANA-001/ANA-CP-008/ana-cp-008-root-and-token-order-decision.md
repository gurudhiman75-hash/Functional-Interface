# ANA-CP-008 Root and Token-Order Expansion Decision

Status: **NON-QL PILOT — COUNTS OPEN**

## 1. Purpose

This decision records the source-backed expansion needed before ANA-CP-008 can receive a permanent question-language allocation.

The expansion resolves two separate concerns:

1. arithmetic operations not covered by fixed addition/subtraction, multiplication or direct powers;
2. official mixed-token forms in which the whole number appears before the letter cluster.

Neither concern creates permanent QL IDs in this change.

## 2. Token-order decision

### Canonical token kinds

The pilot now distinguishes:

```text
CLUSTER_NUMBER  -> letters followed by number, for example LD120
NUMBER_CLUSTER  -> number followed by letters, for example 120LD
```

The two kinds remain distinct in:

- parsing;
- rendering;
- equality keys;
- option uniqueness;
- source fixtures;
- presentation-mode audits.

### Ownership conclusion

Token order is **not automatically a new solve authority**.

A number-first item and a cluster-first item belong to the same operational family only when the student performs the same mathematical and alphabetic operations. Token order is then presentation metadata carried by the typed token contract.

A separate rule ID is still used in this provisional pilot where the input and output kinds differ, because the runtime matcher must preserve exact typed domains and must not silently reorder tokens.

## 3. Newly admitted operational authorities

### A. Cluster-vector exact root

Rule ID:

```text
MIXED_CLUSTER_NUMBER_VECTOR_ROOT
```

Admitted source-backed context:

```text
letters: fixed two-position vector
number: exact cube root of (n + 1)
```

Representative relation:

```text
SN1330 -> QI11
```

because:

```text
S -> Q  (-2)
N -> I  (-5)
cube_root(1330 + 1) = cube_root(1331) = 11
```

Non-perfect cubes are rejected. Approximation and floating-point tolerance are prohibited.

### B. Number-first cluster exact multiplier

Rule ID:

```text
MIXED_NUMBER_CLUSTER_VECTOR_MULTIPLIER
```

Admitted source-backed context:

```text
number: exact multiplication by 2
letters: fixed two-position vector
```

Representative relation:

```text
78AV -> 156BY
```

The output remains `NUMBER_CLUSTER`; no renderer-level reordering is allowed.

### C. Number-first cluster exact root

Rule ID:

```text
MIXED_NUMBER_CLUSTER_VECTOR_ROOT
```

Admitted source-backed context:

```text
number: exact square root of (n + 1)
letters: fixed two-position vector
```

Representative relation:

```text
120LD -> 11OJ
```

because:

```text
sqrt(120 + 1) = 11
L -> O  (+3)
D -> J  (+6)
```

Non-perfect squares are rejected.

## 4. Existing authorities expanded by evidence

### Independent cluster vector with large fixed delta

The fixed-delta authority now admits source-backed deltas whose magnitude exceeds the former pilot limit of 100.

New profiles include:

```text
+294
-311
+450
```

The shared arithmetic helper therefore allows bounded signed deltas up to magnitude 1,000. This is not an unrestricted formula space: only registered source-backed contexts may generate questions.

### Cluster-vector exact multiplier

The multiplier authority now includes an exact `3/2` profile in addition to the existing integer and `5/2` profiles.

Rational arithmetic remains integer-only:

```text
output = input * numerator / denominator
```

The result is accepted only when the division is exact and the output remains within pilot bounds.

## 5. Arithmetic contract rules

The root helpers use integer equality checks:

```text
square root: r = round(sqrt(n + 1)); accept only when r*r = n + 1
cube root:   r = round(cuberoot(n + 1)); accept only when r*r*r = n + 1
```

The following are prohibited:

- approximate roots;
- tolerance-based equality;
- decimal answers;
- implicit token reordering;
- inferred formulas not present in the registered context list;
- widening a source-backed context into arbitrary parameters.

## 6. Collision boundaries

The expanded matcher must distinguish:

- fixed delta versus multiplier;
- multiplier versus power;
- power versus root;
- square-root-of-`n+1` versus perfect-square-to-cube;
- cube-root-of-`n+1` versus direct cube;
- cluster-first versus number-first typed tokens;
- a shared letter delta versus an independent letter vector.

Complete evidence, not one displayed pair, determines ownership.

## 7. Pilot inventory after this expansion

```text
Provisional rule IDs: 12
Provisional contexts: 81
Exact source fixtures: 23
Presentation modes mechanically tested: 3
Permanent QL count: OPEN
Permanent solve-mode count: OPEN
```

Every context must continue to satisfy:

- strict TypeScript;
- exact source-fixture replay;
- independent-solver agreement;
- at least 40 uniquely matched source-target pairs;
- four unique direct-completion options with one correct answer;
- direct completion, equivalent-pair selection and odd-pair selection yield.

## 8. Allocation consequence

The inherited `ANA-QL-223..238` reservation must not dictate the final taxonomy.

The permanent QL allocation can be proposed only after:

1. this 81-context pilot passes all gates;
2. operational families are grouped by materially identical student reasoning;
3. presentation variants are separated from solve authorities;
4. another source-gap audit finds no meaningful uncovered recurring family;
5. collision and misconception audits confirm the proposed boundaries.

No QL IDs are assigned by this decision.
