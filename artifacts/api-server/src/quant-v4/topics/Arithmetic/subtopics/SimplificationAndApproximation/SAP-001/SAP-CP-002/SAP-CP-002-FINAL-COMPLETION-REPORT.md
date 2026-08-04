# SAP-CP-002 — Final Completion, English Freeze and Permanent Allocation

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-002`  
**Status:** complete, English-frozen, permanently allocated but inactive  
**Permanent range:** `SAP-QL-017..SAP-QL-033`  
**Next available SAP identity:** `SAP-QL-034`

## 1. Final discovery result

```text
Design solve modes:          21
Executable prototypes:       19
Approved English templates:  17
Permanent QLs:               17
```

The count was discovered from executable coverage. It was not fixed before implementation.

## 2. Remaining authorities implemented

The completion runtime adds:

1. a fraction expression containing an integer part;
2. product of a fractional sum and difference;
3. reciprocal of a grouped fraction expression;
4. exact fraction complement;
5. bounded continued fraction;
6. missing numerator;
7. missing denominator;
8. missing fraction operand;
9. comparison of two evaluated fraction expressions;
10. equivalent reduced-fraction selection;
11. first incorrect fraction-simplification step.

Together with Wave 01, all 21 design solve modes have executable ownership.

## 3. Merge and split decisions

### Design-mode consolidation

- fraction sum/difference and the different-denominator mode share one executable authority;
- signed fraction evaluation and material bracket scope share one executable authority.

This reduces 21 design modes to 19 executable prototypes.

### English-template consolidation

- the general mixed fraction operation chain and the integer-part expression share one learner-facing template because the integer is a representation parameter within the same operation-order strategy;
- missing numerator and missing denominator share one missing-component template because both first isolate the fraction and then recover the displayed component exactly.

This reduces 19 executable prototypes to 17 permanent template families.

### Kept separate

- ordinary fraction division and reciprocal-of-a-grouped-expression;
- nested complex fraction and bounded continued fraction;
- missing component and missing whole fraction operand;
- comparison, equivalent selection and incorrect-step diagnosis.

These retain distinct learner actions, answer semantics or evaluation routes.

## 4. Permanent allocation

| QL | Authority |
|---|---|
| `SAP-QL-017` | fraction sum/difference |
| `SAP-QL-018` | product with cancellation |
| `SAP-QL-019` | division by reciprocal |
| `SAP-QL-020` | mixed fraction chain with optional integer part |
| `SAP-QL-021` | mixed-number conversion |
| `SAP-QL-022` | fraction of grouped fraction |
| `SAP-QL-023` | nested complex fraction |
| `SAP-QL-024` | signed fraction and bracket scope |
| `SAP-QL-025` | product of sum and difference |
| `SAP-QL-026` | reciprocal expression |
| `SAP-QL-027` | fraction complement |
| `SAP-QL-028` | bounded continued fraction |
| `SAP-QL-029` | missing numerator or denominator |
| `SAP-QL-030` | missing fraction operand |
| `SAP-QL-031` | compare evaluated fractions |
| `SAP-QL-032` | select equivalent reduced fraction |
| `SAP-QL-033` | identify first incorrect fraction step |

## 5. Proof sweeps

```text
Wave 01 discovery:               800 packages
Completion discovery:          1,100 packages
Combined discovery/freeze:     1,900 packages
English review export:            57 items
Permanent runtime proof:       1,900 packages
```

The final authority proves:

- exact canonical/verifier agreement;
- all 21 design modes represented;
- all 19 prototypes mapped;
- all 17 templates allocated exactly once;
- four approved stem frames per prototype;
- Easy, Medium and Hard coverage;
- all four answer positions per permanent QL;
- unique options and one correct answer;
- misconception evidence for every wrong option;
- contiguous global SAP range `SAP-QL-001..SAP-QL-033`;
- no Question Studio, bank, test or public exposure.

## 6. Ownership boundaries retained

- lone-fraction representation and classification remain Number System-owned;
- HCF/LCM of fractions remains Number System-owned;
- algebraic rational expressions with variables remain Algebra-owned;
- SAP-CP-002 owns exact arithmetic where fraction structure is the central computation.

## 7. Lifecycle state

```text
English manual freeze:          APPROVED
Permanent allocation:           ALLOCATED_INACTIVE
Question Studio:                DISABLED
Question Bank:                  NOT_STORED
Test eligibility:               INELIGIBLE
Public publication:             INACTIVE
Hindi/Punjabi localisation:     NOT_STARTED
```

Historical discovery and English-freeze records retain `permanentQlId: null`. Permanent identity exists only in the allocated runtime layer.
