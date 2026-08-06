# SAP-CP-002 — Wave 01 Fraction Runtime Report

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-002`  
**Branch:** `feat/sap-cp002-wave01-fraction-runtime`  
**Permanent QLs introduced:** 0  
**Next available chapter identity:** `SAP-QL-017`  
**Runtime status:** executable discovery only

## 1. Purpose

Wave 01 establishes the smallest exact runtime needed to discover fraction, mixed-number and complex-rational authorities without fixing a final QL count. It follows the design boundary that fraction structure must be the central computation; lone-fraction representation theory remains Number System-owned.

## 2. Temporary executable authorities

1. fraction sum or difference with different denominators;
2. fraction product with cross-cancellation;
3. fraction division by reciprocal;
4. mixed fraction operation chain;
5. mixed-number conversion followed by evaluation;
6. fraction of a grouped fraction expression;
7. bounded nested complex fraction;
8. signed fraction expression with material bracket scope.

These authorities are temporary discovery contracts. They do not reserve eight permanent QLs and may later merge, split, move or be rejected after direction expansion and source saturation.

## 3. Exact representation architecture

Wave 01 introduces a checkpoint-local display expression tree that separates visible notation from exact value:

```text
VALUE
NEGATE
GROUP
ADD / SUBTRACT
MULTIPLY / DIVIDE
OF
COMPLEX_FRACTION
```

A value node stores a reduced exact rational plus one display instruction:

```text
INTEGER
FRACTION
MIXED_NUMBER
```

The display tree compiles into the shared SAP exact-expression AST for canonical evaluation. A separate recursive fraction evaluator independently recomputes every result using exact bigint rational formulas. The independent route does not call the canonical evaluator.

## 4. Rendering guards

- mixed numbers retain visible whole and proper-fraction parts;
- complex fractions render the complete numerator and denominator as explicit blocks;
- `of` appears only with explicit grouped scope;
- subtraction and division right operands are parenthesised when required;
- no floating-point arithmetic is used;
- every final answer is reduced exactly.

## 5. Distractor model

Wrong options are recomputed from named misconception routes, including:

- adding numerators and denominators directly;
- using a product denominator without scaling numerators;
- illegal one-sided cancellation;
- taking a reciprocal during multiplication;
- failing to invert the divisor;
- inverting the dividend or reversing division;
- ignoring multiplication precedence;
- incorrect mixed-number conversion;
- discarding whole-number parts;
- treating `of` as addition or division;
- applying `of` only to the nearest term;
- scoping the main complex-fraction bar to adjacent terms only;
- multiplying or reversing complete complex-fraction blocks;
- dropping a negative intermediate or ignoring bracket scope.

Fallback arithmetic slips are used only when two misconception routes collapse to the same numerical option for a particular state.

## 6. Proof sweep

The authority test generates:

```text
8 temporary prototypes
× 100 deterministic seeds
= 800 discovery packages
```

It proves:

- exact canonical and independent agreement;
- four unique options and one correct answer;
- misconception evidence for every wrong option;
- all four answer positions per prototype;
- Easy, Medium and Hard coverage per prototype;
- substantial non-integer answer coverage;
- signed rational answers;
- 100 mixed-number displays;
- 100 explicit complex-fraction displays;
- 100 scoped-`of` states;
- 100 guaranteed two-factor cancellation states;
- mathematical fingerprint and answer diversity;
- complete lifecycle locks.

## 7. Lifecycle state

Every Wave 01 package remains:

```text
permanentQlId: null
maturity: EXECUTABLE_DISCOVERY_PROOF
reviewStatus: UNREVIEWED_DISCOVERY_CANDIDATE
questionBankStatus: NOT_STORED
testEligibility: INELIGIBLE
active: false
questionStudioDiscoverable: false
questionBankWritable: false
testEligible: false
publiclyPublishable: false
```

## 8. What remains open

The design baseline contains additional directions and structures that are intentionally not frozen by Wave 01:

- fraction expression with an integer part;
- product of fraction sum and difference;
- reciprocal expressions;
- complement expressions;
- bounded continued fractions;
- missing numerator, denominator and fraction operand;
- comparison of evaluated fraction expressions;
- equivalent reduced-fraction selection;
- incorrect-step diagnosis;
- source and legacy saturation;
- final merge/split and ownership audit;
- English editorial freeze;
- permanent identity allocation beginning no earlier than `SAP-QL-017`.

Wave 01 is therefore a foundation and evidence set, not a completeness claim.
