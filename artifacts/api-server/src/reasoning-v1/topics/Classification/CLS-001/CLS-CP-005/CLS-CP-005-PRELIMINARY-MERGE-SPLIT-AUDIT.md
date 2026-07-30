# CLS-CP-005 — Preliminary Merge/Split Audit

Status: `PROVISIONAL_BOUNDARY_STABLE__SOURCE_GAP_WAVE_2_OPEN`

Permanent QLs: `0`

## Evidence reviewed

The first executable wave covers:

- ten ordered-pair relation families;
- eight ordered-triple relation families;
- odd-pair classification;
- odd-triple classification;
- pair and triple equivalent-set selection;
- four- and five-option rendering;
- direction-sensitive and direction-neutral rules;
- exact-value and fixed-predicate signatures;
- complete bounded competing-rule enumeration.

The prototype count is evidence coverage, not a proposed QL count.

The product owner approved the English `Simple Option Explanations V3` baseline. Human editorial review is therefore closed for Wave 1.

## Candidate boundary 1 — Find the odd number tuple

The ordered-pair and ordered-triple prototypes currently share one learner contract:

```text
evaluate the internal rule of every complete tuple
  -> identify the rule shared by all but one option
  -> select the tuple with the different rule
```

Pair versus triple arity changes the available rule registry and arithmetic demand, but it does not currently change:

- the answer object — one complete displayed tuple;
- the mismatch semantics;
- the ambiguity model;
- the lifecycle contract;
- the four-tier explanation topology.

### Preliminary disposition

```text
Odd ordered pair prototypes:    MERGE_AS_ARITY_INSTANCE_VARIANT
Odd ordered triple prototypes:  MERGE_AS_ARITY_INSTANCE_VARIANT
```

This points provisionally to one learner contract for finding an odd number tuple. It does not reserve or allocate a QL.

## Candidate boundary 2 — Select the tuple with the same rule

Equivalent-set selection introduces a supplied reference tuple. The learner must first recover its internal signature and then find the unique candidate with the same signature.

This changes:

- the displayed state topology;
- match versus mismatch semantics;
- the canonical proof;
- the independent ambiguity audit;
- the explanation sequence.

Pair and triple versions still share that reference-and-match contract; arity remains an instance property.

### Preliminary disposition

```text
Equivalent pair prototypes:    MERGE_AS_ARITY_INSTANCE_VARIANT
Equivalent triple prototypes:  MERGE_AS_ARITY_INSTANCE_VARIANT
Odd-tuple prototypes:          SPLIT_BY_SOLVER_CONTRACT
```

This points provisionally to a separate learner contract for selecting a tuple with the same rule as a reference tuple. It does not reserve or allocate a QL.

## Relation-family treatment

The following remain rule-instance variants inside the relevant task contract unless later evidence proves otherwise:

- difference, ratio, sum and product;
- GCD and LCM;
- consecutive, square, cube and digit-reversal direction;
- two-to-one sum or product within a triple;
- arithmetic and geometric progression;
- Pythagorean position relation;
- tuple sum and tuple product;
- forward versus reverse direction;
- four versus five options;
- numerical magnitude and difficulty.

Exact-value signatures and fixed-predicate signatures use different calculations but the same final classification proof. No QL split is currently justified by calculation type alone.

## Meaningful source gap found after approval

The repeated source audit found a standard Number Classification pair form in which the decimal digits of the first number generate the second number:

```text
34 : 12
67 : 54
57 : 35
48 : 32
```

The common relation is `product of digits of first = second`. The current registry cannot represent this relation.

This is owned by CP-005 because every option is a complete ordered pair and the task is to classify one pair as different. It is not CP-004 single-number classification and it is not Numeric Analogy source-to-target completion.

Wave 2 must therefore add and audit:

```text
PAIR_FIRST_DIGIT_PRODUCT_TO_SECOND
```

This source gap does not alter the provisional two-contract compression. It is a missing rule instance inside the odd-number-tuple contract. Admission to reference-set matching requires a separate naturalness and ambiguity proof.

## Rejections and exclusions

- source-to-target completion remains Numeric Analogy;
- ordered progression continuation remains Series;
- incomplete diagrams or missing-cell tasks remain Missing Number;
- unrestricted equations and polynomial fitting are rejected;
- permutation-only candidate matches and reversal-duplicate options are editorially rejected;
- states with competing admitted rules pointing to different answers are rejected;
- analogy-only evidence does not automatically admit a new Classification rule.

## Open before permanent allocation

- implement the source-backed digit-product pair relation;
- audit odd-pair generation with four and five options;
- separately determine whether the relation is natural for equivalent-set matching;
- include the new relation in complete competing-rule enumeration;
- reject digit-length and result-scale giveaways;
- generate V3 simple explanations for the new relation;
- repeat direct/inverse and answer-semantic gap audits;
- repeat the no-meaningful-gap decision.

## Current provisional compression

```text
Wave 1 temporary prototypes:          20
Wave 1 admitted bounded rules:        18
Meaningful Wave 2 gaps found:          1
Task directions:                       3
Provisional learner-contract shapes:   2
Permanent QLs:                         0
```

The learner-contract boundary remains provisionally stable, but English freeze is blocked until Wave 2 and the repeated source-gap audit are complete.
