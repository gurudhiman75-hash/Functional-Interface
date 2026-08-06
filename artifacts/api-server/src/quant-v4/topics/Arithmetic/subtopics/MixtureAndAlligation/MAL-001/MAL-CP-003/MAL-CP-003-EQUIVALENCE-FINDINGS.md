# MAL-CP-003 Mathematical Equivalence Findings

Status: **open discovery — mathematical kernels identified**  
Permanent QLs: **0**  
Frozen solve modes: **0**

## Proven equivalences

For the same hidden repeated-replacement state:

1. final absolute original quantity divided by the initial original quantity equals the final original fraction;
2. when the vessel starts entirely with the original liquid, final refill quantity is the complement of final original quantity;
3. equal-stage exponentiation is exactly the special case of multiplying the same stage-retention factor repeatedly;
4. initial quantity, removal quantity and operation count inverses reproduce the original forward state when the evidence is exact and unique;
5. a two-refill three-component ledger matches its closed form and conserves total vessel volume.

## Mathematical kernel map

The current executable frontier reduces to three mathematical kernels:

```text
SCALAR_EQUAL_STAGE_GEOMETRIC_RETENTION
SCALAR_STAGE_PRODUCT_GENERALISATION
VECTOR_COMPONENT_STAGE_LEDGER
```

This is a mathematical simplification, not a learner-contract freeze.

## Merge/split implications

### Strong mathematical merge candidates

- final original quantity and final original fraction;
- equal-stage exponent form and repeated identical stage-product form.

### Complement-equivalent but answer-semantic-sensitive

- final refill quantity versus final original quantity.

### Inverse directions sharing one forward kernel

- initial original quantity;
- removal quantity per operation;
- number of operations.

These inverses share the same retained-fraction equation but ask for materially different unknowns and have different uniqueness/approximation risks.

### Structurally distinct

- three-component sequential refill requires a vector ledger and cannot be reduced to one scalar complement when all final components are requested.

## Why freeze is still prohibited

Mathematical equivalence does not answer:

- whether exams treat quantity, fraction and percentage prompts as separate learner contracts;
- whether complement-answer wording deserves a separate QL;
- how approximate roots or logarithmic operation counts are rounded;
- whether equal and unequal stages should share one QL or only one solver kernel;
- whether third-liquid questions ask one component, a ratio, or the full state;
- where concentration-worded successive dilution belongs between CP-003 and CP-004;
- whether direct textbook/exam evidence exists for the current inverse constructions.

Therefore:

```text
freezeReadiness = false
permanentQlCount = 0
frozenSolveModeCount = 0
```
