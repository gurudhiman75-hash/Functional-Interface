# MAL-CP-003 Source Normalization Report

Status: **open discovery — source labels normalised**  
Permanent QLs: **0**  
Frozen solve modes: **0**

## 1. Why this audit was necessary

Quant V2 contains several family names that appear to describe different repeated-replacement tasks. The checked-in production exports show that those names were often routed through one generic forward generator.

Therefore, a family name alone cannot establish:

- a different unknown variable;
- a different answer semantic;
- unequal stage quantities;
- a third refill liquid;
- a final percentage representation;
- an operation-count inverse;
- or a distinct permanent QL.

## 2. Direct executable authority

The only directly aligned legacy family in the inspected replacement set is:

```text
replacement_repeated_operation
```

Its exported learner contract is:

```text
Given vessel volume V, equal removed quantity r and operation count n,
find the original liquid remaining after repeated homogeneous refill.
```

Its formula authority is:

```text
L = V(1 - r/V)^n
```

This supports the direct core prototype:

```text
MAL-CP003-PROT-FINAL-ORIGINAL-QUANTITY-EQUAL-REPLACEMENTS
```

## 3. Thin or misleading legacy labels

The following labels were observed with a learner surface that did not implement the label's declared task:

- `replacement_find_original_quantity`;
- `replacement_find_replaced_quantity`;
- `replacement_final_purity`;
- `replacement_asymmetric_removal_fractions`;
- `replacement_double_replacement_third_liquid`;
- `dilution_successive_replacement`.

They exported the same or equivalent forward equal-replacement original-liquid-left problem.

The label `dilution_find_number_of_operations` was more seriously misaligned: its exported question was a pure-acid addition problem using `C1V1 = C2V2`, which belongs to the conserved-solute transformation area rather than a repeated-replacement operation-count inverse.

## 4. Corrected evidence classes

The CP-003 registry now distinguishes:

```text
LEGACY_V2_DIRECT_EXECUTABLE_RECOVERY
LEGACY_FAMILY_LABEL_ONLY
INVERSE_CLOSURE
REPRESENTATION_CLOSURE
BOUNDARY_CONSTRUCTION
```

This prevents inverse, percentage, unequal-stage and third-liquid prototypes from being overstated as directly recovered legacy contracts.

## 5. Current merge/split posture

### Direct core

- final original-component quantity after equal repeated replacements.

### Representation merge candidates

- final original-component fraction;
- final refill-component quantity.

These may survive as distinct learner contracts because their givens and requested semantics differ, but direct exam evidence and a formal merge/split decision are still required.

### Provisionally distinct inverse or state contracts

- initial original quantity from final evidence;
- removal quantity per operation;
- number of operations;
- unequal stage removals;
- sequential third-liquid refill composition.

Executable uniqueness has been proved, but direct source support or boundary evidence remains incomplete.

### Ownership boundary

- successive dilution expressed principally through concentration or solute percentage.

Repeated homogeneous sampling suggests CP-003, while conserved-solute wording and non-sampling dilution suggest CP-004. The checked-in legacy export does not resolve this because its family label and learner surface disagree.

## 6. Freeze blockers

Eight of the nine current discovery candidates still have at least one blocker involving:

- direct source evidence;
- representation merge/split;
- approximation and rounding conventions;
- equal-versus-unequal stage ownership;
- third-liquid answer semantics;
- or CP-003/CP-004 ownership.

Accordingly:

```text
freezeReadiness = false
permanentQlCount = 0
frozenSolveModeCount = 0
```

## 7. Next evidence work

1. recover direct textbook or exam examples for each inverse unknown;
2. recover genuine unequal-removal and third-liquid questions;
3. test quantity, fraction, percentage and ratio surfaces against one hidden state;
4. define exact-versus-approximate rules for unknown removal quantity and operation count;
5. resolve repeated sampling versus conserved-solute ownership with CP-004;
6. run the complete merge/split and residual-gap matrix before assigning permanent identities.
