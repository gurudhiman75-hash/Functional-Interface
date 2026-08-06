# SAP-CP-001 Wave 02 — Diagnostic and Grouping Runtime Proof

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-001`  
**Wave:** 02  
**Status:** executable discovery proof  
**Permanent QLs:** 0  
**Question Studio exposure:** disabled

## 1. Purpose

Wave 01 proved direct exact evaluation for precedence, associativity, grouping, signed arithmetic, scoped `of`, powers and factorials. Wave 02 extends the same exact-expression authority into non-direct exam tasks where the learner must compare, select or diagnose rather than merely calculate a final value.

This wave remains temporary discovery work. It does not freeze solve-mode counts or allocate permanent identities.

## 2. Temporary authorities implemented

```text
SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS
SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING
SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP
SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP
SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE
```

They cover:

- exact comparison of two differently grouped expressions, including `<`, `=` and `>` outcomes;
- selecting the unique explicit grouping equivalent to a flat left-to-right `+`/`−` chain;
- selecting the first valid simplification step across multiplication, powers, factorials and explicit grouping;
- locating the first invalid transition in a multi-line solution chain;
- substituting a declared intermediate result without changing the surrounding expression tree.

## 3. Mathematical proof routes

The canonical route uses the recursive exact AST evaluator introduced in Wave 01.

Independent verification uses the separate RPN/stack evaluator and task-specific checks:

| Task | Independent proof |
|---|---|
| comparison | independently evaluate both trees and compare reduced rationals |
| equivalent grouping | evaluate source and every candidate; require exactly one equal candidate |
| first valid step | evaluate original and every proposed after-state; require exactly one value-preserving candidate |
| incorrect chain | evaluate every line independently and identify the first value divergence |
| partial substitution | independently evaluate source and substituted AST; require exact equality |

## 4. Proof sweep

The authority test executes 100 deterministic seeds for each temporary prototype.

```text
Temporary prototypes: 5
Seeds per prototype: 100
Generated packages: 500
Canonical/verifier mismatches: 0
Duplicate-option packages: 0
Permanent QLs: 0
Active/public packages: 0
```

Coverage assertions include:

- all four correct-answer positions for every prototype;
- Easy, Medium and Hard for every prototype;
- at least twelve mathematical fingerprints per prototype;
- all three comparison classes (`<`, `=`, `>`);
- all four incorrect-step positions;
- multiplication, power, factorial and explicit-grouping first-step modes;
- multiplication, grouped subtraction, power and factorial partial-substitution modes;
- comparison, selection, diagnosis and partial-evaluation directions;
- comparison-class, expression-selection, step-selection and exact-value answer semantics.

Local proof result:

```text
PASS_SAP_CP001_WAVE02_DIAGNOSTIC_AUTHORITY
```

## 5. Safety state

Every generated package remains locked:

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

## 6. Deferred work

Wave 02 does not freeze these five temporary prototypes as five permanent QLs. The next checkpoint work is:

1. source and legacy saturation for all `SAP-CP-001` families;
2. edge and representation expansion, including statement-style and bounded ambiguity fixtures where justified;
3. merge/split audit across Wave 01 and Wave 02;
4. count-bearing template proposal without permanent IDs;
5. product approval before any QL allocation.
