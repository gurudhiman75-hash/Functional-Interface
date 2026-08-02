# MAL-CP-003 — Executable Discovery Charter

Status: **open executable discovery**  
Canonical problem hypothesis: **Repeated Fractional Replacement**  
Permanent QLs: **0**  
Frozen solve modes: **0**  
Question Studio exposure: **disabled**

## 1. Working ownership

MAL-CP-003 owns repeated homogeneous removal-and-refill operations when the decisive reasoning is fractional retention over two or more stages.

The state transition is:

```text
current original-component amount
× retained fraction of the current well-mixed sample
= original-component amount after the stage
```

For equal vessel volume `V`, equal removed quantity `r`, and `n` operations:

```text
Q_n = Q_0 × (1 − r/V)^n
```

For unequal removed quantities:

```text
Q_final = Q_0 × Π(1 − r_i/V)
```

The canonical solver may use the retention power/product. The independent verifier must simulate every stage separately.

## 2. Current executable frontier

The present frontier contains executable prototypes for:

1. final original-component quantity after equal repeated replacements;
2. final fraction of the original component;
3. final refill-component quantity when the vessel begins with the original liquid;
4. initial original-component quantity reconstructed from the final quantity;
5. equal removal quantity reconstructed from an exact final state;
6. number of operations reconstructed from an exact final state;
7. final original-component quantity after unequal replacements;
8. final three-component composition after sequential refills with two different liquids.

These are discovery identities only. They are not QLs and do not imply that eight permanent contracts will survive merge/split review.

## 3. Source basis

The initial frontier is recovered from the current Quant V2 family registry and generator evidence:

```text
replacement_repeated_operation
replacement_find_original_quantity
replacement_find_replaced_quantity
replacement_final_purity
replacement_asymmetric_removal_fractions
replacement_double_replacement_third_liquid
dilution_successive_replacement
dilution_find_number_of_operations
```

The V2 factory gives direct executable evidence for the repeated-retention core. Family labels that describe inverses or extra components are treated as source prompts, not sufficient proof by themselves; each surviving contract requires an exact executable state, uniqueness proof and independent verification.

## 4. Protected boundaries

### CP-002 boundary

A single remove-and-refill operation remains in MAL-CP-002 unless repetition or a multi-stage retention ledger is mathematically necessary.

### CP-004 boundary

Successive dilution expressed principally through concentration or solute percentage remains a `MAL-CP-003_CP004_BOUNDARY` candidate. It is source-recovered but deliberately non-executable in this wave until the ownership audit proves whether concentration semantics create a materially distinct learner contract.

### CP-006 boundary

Multiple stages inside one vessel remain CP-003. Transfer between separate vessels belongs to CP-006 because it requires vessel-by-vessel bookkeeping rather than one-vessel retention.

## 5. Exactness and uniqueness

The discovery runtime uses exact rational arithmetic.

Inverse removal-quantity contracts execute only when the total retained fraction has an exact rational `n`th root. Operation-count contracts execute only when one unique positive integer exponent within the declared search boundary reproduces the final quantity.

No approximate logarithm is used to conceal non-exact evidence.

## 6. Required prototype package

Every executable prototype must provide:

- deterministic valid-state-first parameters;
- canonical exact solver result;
- independent stage-by-stage verification;
- four unique options with misconception identities;
- natural English stem;
- retention-specific explanation;
- replacement stage-strip diagram data;
- reasoning graph ending in a verified conclusion;
- mathematical fingerprint;
- all delivery gates false.

## 7. Non-negotiable learner rules

- state that the removed sample is well mixed;
- restore the vessel after each refill when the formula assumes constant volume;
- never subtract the same amount of original component at every stage;
- never use alligation for repeated replacement;
- distinguish original component left from refill component present;
- show the separate stage factors when removals differ;
- use a full component ledger when a third refill liquid appears.

## 8. Current audit target

The first audit executes 200 deterministic seeds for each of the eight executable prototypes:

```text
8 × 200 = 1,600 generated discovery packages
```

It proves deterministic regeneration, exact solver/verifier agreement, option uniqueness, explanation and diagram contracts, hidden delivery gates, and CP-001/CP-002 regressions.

This volume is an engineering proof only. It does not freeze the number of prototypes, solve modes or QLs.

## 9. Next discovery work

After this wave passes:

1. recover additional direct source fixtures for concentration-worded successive dilution;
2. audit original-versus-refill answer-semantic merges;
3. test percentage, ratio and quantity representations of the same hidden state;
4. audit unknown operation count where approximation would otherwise be required;
5. recover stage-dependent-volume and partial-refill evidence only from direct sources;
6. test whether third-liquid sequences remain one contract or split by requested semantic;
7. run complete concept, inverse, unknown-variable, representation, edge, ownership and duplicate audits;
8. allocate permanent QLs only after the residual gap matrix is empty.

## 10. Current release state

```text
permanentQlCount = 0
frozenSolveModeCount = 0
active = false
publiclyPublishable = false
questionStudioDiscoverable = false
questionBankWritable = false
testEligible = false
```
