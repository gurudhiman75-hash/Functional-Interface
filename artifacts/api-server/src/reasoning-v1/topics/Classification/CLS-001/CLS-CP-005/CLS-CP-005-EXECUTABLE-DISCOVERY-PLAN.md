# CLS-CP-005 — Number-Pair, Triple and Set Classification

Status: `OPEN_EXECUTABLE_DISCOVERY`

## Purpose

This checkpoint covers Classification questions whose displayed answer objects are ordered number pairs or triples. The learner must either find the tuple with a different internal rule or select the candidate tuple that follows the same rule as a supplied reference tuple.

The checkpoint does not transfer a rule from a source pair to an incomplete target. Such completion tasks belong to Numeric Analogy. It also excludes ordered progressions, missing-number diagrams and arbitrary formula fitting.

## Source-backed task directions

1. `FIND_ODD_NUMBER_PAIR` — find the ordered pair with a different internal relation.
2. `FIND_ODD_NUMBER_TRIPLE` — find the ordered triple with a different internal relation.
3. `SELECT_EQUIVALENT_NUMBER_SET` — compare a supplied pair or triple with candidate sets and select the only matching internal relation.

These task directions are discovery hypotheses. They do not reserve permanent QLs.

## Temporary prototype wave

### Ordered pairs

- signed difference;
- exact reduced ratio;
- common sum;
- common product;
- exact GCD;
- exact LCM;
- consecutive-number direction;
- square relation;
- cube relation;
- digit reversal.

### Ordered triples

- sum of two positions equals the third;
- product of two positions equals the third;
- arithmetic progression;
- geometric progression;
- Pythagorean relation;
- consecutive-number direction;
- common tuple sum;
- common tuple product.

### Equivalent-set selection

- pair rule matching across the complete admitted pair registry;
- triple rule matching across the complete admitted triple registry.

The first executable wave therefore uses twenty temporary prototypes. This is an architecture-establishing inventory, not a quota or frozen total.

## Runtime rules

- all arithmetic is exact integer or reduced-rational arithmetic;
- tuple order is preserved;
- each generated state is constructed from a declared rule signature;
- the independent verifier reparses displayed tuples and enumerates the complete bounded rule registry;
- a state is rejected when another admitted rule produces a different defensible answer;
- arbitrary constants, polynomial fitting and post-hoc equations are prohibited;
- both four- and five-option questions are supported;
- learner text uses natural exam-style stem variety and four explanation tiers.

## Merge/split questions to answer

- whether odd ordered pairs and odd ordered triples share one permanent tuple-outlier contract or require separate QLs;
- whether arity is only an instance property or changes the proof burden materially;
- whether equivalent-set selection is a distinct QL because it introduces a reference tuple and match rather than mismatch semantics;
- whether relation direction is an instance property rather than a QL split;
- whether exact-value relations and fixed predicate relations can share one runtime contract.

## Proof target

The first gate must validate:

- deterministic replay;
- all twenty temporary prototypes;
- all admitted pair and triple rules;
- four- and five-option states;
- every answer position;
- Easy, Medium and Hard instances chapter-wide;
- unique answers under complete competing-rule enumeration;
- natural stem variety with no dominant fixed stem;
- clear action-led shortcuts;
- JSON and Markdown review exports;
- complete lifecycle and publication locks.

## Lifecycle boundary

```text
permanentQlId:              null
reviewStatus:               UNREVIEWED_DISCOVERY
questionBankStatus:         NOT_STORED
testEligibility:            INELIGIBLE
publiclyPublishable:        false
questionStudioDiscoverable: false
```

No Question Studio, Question Bank, test or publication integration is authorised by this checkpoint.