# SAP-CP-001 Wave 01 — Implementation and Runtime Proof

**Package:** `SAP-001`  
**Checkpoint:** `SAP-CP-001`  
**Wave:** executable discovery foundation  
**Permanent QLs:** 0  
**Question Studio exposure:** disabled

## 1. Implemented foundation

Wave 01 establishes the shared mathematical substrate required by the exact-simplification package:

- reduced `bigint` rational arithmetic;
- typed expression AST;
- explicit group and bracket-style nodes;
- canonical recursive exact evaluator;
- independent reverse-polish stack verifier;
- exact powers, roots, factorials and percent-of support for later checkpoints;
- deterministic expression rendering with explicit precedence;
- mathematical fingerprints, misconception options and lifecycle locks.

The learner string is always rendered from the AST. It is never parsed back as the source of mathematical truth.

## 2. Temporary prototype authorities

```text
SAP-CP001-PROT-FLAT-MIXED-OPERATIONS
SAP-CP001-PROT-MULTIPLY-DIVIDE-LEFT-TO-RIGHT
SAP-CP001-PROT-ADD-SUBTRACT-LEFT-TO-RIGHT
SAP-CP001-PROT-NESTED-GROUPING
SAP-CP001-PROT-SIGNED-ARITHMETIC
SAP-CP001-PROT-SCOPED-OF-MULTIPLICATION
SAP-CP001-PROT-POWER-BEFORE-ARITHMETIC
SAP-CP001-PROT-FACTORIAL-BEFORE-ARITHMETIC
```

These are discovery identities, not permanent QLs. They prove architecture and initial task boundaries only.

## 3. Proof sweep

The authority test executes 100 deterministic seeds for each of the eight prototypes.

```text
Generated packages: 800
Canonical/verifier mismatches: 0
Duplicate-option packages: 0
Incorrect correct-index packages: 0
Lifecycle leaks: 0
Permanent QLs: 0
Active/public packages: 0
```

Distinct mathematical fingerprints observed locally:

| Temporary prototype | Distinct states |
|---|---:|
| Flat mixed operations | 99 |
| Multiplication/division left-to-right | 93 |
| Addition/subtraction left-to-right | 100 |
| Nested grouping | 98 |
| Signed arithmetic | 91 |
| Scoped `of` multiplication | 100 |
| Power before arithmetic | 99 |
| Factorial before arithmetic | 58 |

Every prototype reaches all four answer positions and all three difficulty bands.

## 4. Edge and representation coverage

The proof includes:

- negative exact answers;
- round, square and curly bracket renderings;
- bracket-shape invariance with nesting-controlled scope;
- exact left-to-right multiplication/division;
- exact left-to-right addition/subtraction;
- unary negative binding;
- explicitly scoped `of` multiplication;
- powers before later arithmetic;
- factorials before division and addition;
- exact rational normalisation;
- independent checks for fractions, powers, roots, factorials and percentage-of states.

Wave 01 intentionally keeps generated CP-001 answers integral. Fraction-heavy task contracts remain the responsibility of `SAP-CP-002`, while the shared evaluator already supports rational intermediate and final values.

## 5. Publication safety

Every generated package remains locked as:

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

## 6. Next discovery wave

Wave 02 should expand CP-001 into the remaining task directions and representations without allocating permanent IDs:

- compare two different groupings;
- select the correctly parenthesised equivalent expression;
- identify the first valid evaluation step;
- identify an incorrect precedence step;
- evaluate after one declared subexpression has already been simplified;
- cover vinculum/fraction-bar grouping where the primary challenge remains scope rather than fraction arithmetic;
- perform source saturation and over-merge/over-split review for all CP-001 candidates.
