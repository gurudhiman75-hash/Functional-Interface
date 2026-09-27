# RNK-001 — Final Audit Wave 04

Date: 2026-09-26  
Status: **STEM REALISM + DISTRACTOR QUALITY AUDIT CANDIDATE**

## Scope

Wave 04 audits the current learner-facing English generation for all permanent Ranking & Order QLs:

```text
RNK-QL-001..042
6 generated instances per QL
252 generated learner questions
```

The mathematical authority remains frozen. This wave audits presentation quality and generated variation.

## Finding

The main concrete stem defect was in CP003 movement/interchange wording. Some frozen English stems used constructions such as:

```text
What are A's rank ... and B's rank ..., respectively?
What were A's original rank ... and B's original rank ..., respectively?
```

The meaning is clear, but the grammar feels generator-produced rather than like a normal SSC/Banking ranking question.

## Remediation

The current Question Studio presentation layer now renders those forms as:

```text
What are the ranks of A ... and B ..., respectively?
What were the original ranks of A ... and B ..., respectively?
```

Only learner-facing wording changes. Movement state, totals, positions, options, correct index and source fingerprints remain untouched.

## Chapter-wide stem guards

Every generated instance is checked for:

- non-empty, reasonably bounded stem length;
- no broken whitespace;
- no `associated` / `best describes` filler;
- no `start end` / `end end` normalization leakage;
- no generic `first person` / `second person` canonical wording;
- no authority/prototype/runtime/review metadata leakage;
- no `undefined`, `NaN` or object serialization leakage;
- the known CP003 singular-rank grammar defect cannot recur.

## Variation guard

Each QL is generated six times with a fixed audit seed family.

Every permanent QL must produce at least two distinct learner stems across those six instances. This prevents a QL from passing the audit merely because it can repeat one frozen-looking surface indefinitely.

## Distractor guards

For every generated question:

- option count must be 4 or 5;
- options must be distinct and non-empty;
- correct index must resolve exactly to the exposed answer;
- options may not contain implementation vocabulary.

Where the frozen source exposes structured option explanations, every wrong-option explanation sampled by this wave must be reason-specific rather than generic `wrong/incorrect` text and must contain enough content to explain the misconception.

This complements the existing family-specific distractor design:

- CP001/CP002: rank arithmetic / position-normalization errors;
- CP003: movement, end-conversion and off-by-one misconceptions;
- CP004: reconstructed order/position errors;
- CP005: relation/rank-bound witness logic;
- CP006: equality-aware semantic alternatives;
- CP007: category-composition arithmetic distractors.

## Lifecycle

Still locked:

```text
Question Bank writable:        false
test eligible:                 false
mock-test eligible:            false
publicly publishable:          false
production release authorized: false
```

## Next

After Wave 04 is green, audit generated-instance difficulty rather than trusting static QL labels.
