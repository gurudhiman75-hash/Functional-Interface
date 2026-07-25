# ANA-CP-008 Implementation Plan

Status: **DESIGN-TO-PILOT PLAN — NO PERMANENT QLS YET**

## Stage 0 — Recover authoritative source inventory

Before permanent allocation:

- retry File Library retrieval for the audited ANA-CP-008 manifest;
- inspect uploaded reasoning books for mixed letter-number analogy;
- capture every readable source example with source/page metadata;
- classify image-only examples as unresolved until their rules can be verified;
- compare the recovered inventory against the current source-backed reconstruction.

Deliverable:

```text
ana-cp-008-source-fixtures.ts
ana-cp-008-source-inventory.md
```

## Stage 1 — Typed mixed-token foundation

Implement:

- `LETTER`;
- `LETTER_GROUP`;
- `NUMBER`;
- `LETTER_NUMBER`;
- `CLUSTER_NUMBER`;
- canonical renderers;
- strict review-fixture parsers;
- canonical equality keys;
- safe-integer bounds;
- round-trip tests.

No rule authority should parse mixed tokens through ad hoc regex inside the generator.

Deliverable:

```text
foundation/mixed-token.ts
foundation/mixed-token.test.ts
```

## Stage 2 — Shared alphabet/numeric authorities

Reuse or expose shared helpers for:

- ordinary position;
- reverse position;
- shift with wrap;
- sum/product of positions;
- position-to-letter conversion;
- bounded whole-number add/subtract;
- safe multiply/divide where later admitted.

Do not clone CP-005/006 or Coding-Decoding logic.

Deliverable:

```text
foundation/mixed-arithmetic.ts
```

## Stage 3 — Provisional source-backed rule pilot

Implement without QL IDs:

### `MIXED_LETTER_GROUP_SCALAR_AGGREGATE`

Contexts:

- ordinary-position sum;
- ordinary-position product.

### `MIXED_LETTER_GROUP_DERIVED_LETTER`

Context:

- ordinary-position sum mapped to an A–Z letter without modulo.

### `MIXED_TOKEN_INDEPENDENT_TRANSFORM`

Initial contexts:

- letter fixed shift `−6` and whole-number `+7` as a source fixture;
- bounded pilot combinations of nonzero letter shifts and whole-number add/subtract for yield and collision analysis.

### `MIXED_CLUSTER_NUMBER_COMPOSITE`

Implement token parsing and delegated CP-006 operation plumbing only. Do not admit permanent profiles until source rules are readable.

Deliverables:

```text
provisional-rule-definitions.ts
provisional-independent-solver.ts
provisional-source-fixtures.test.ts
```

## Stage 4 — Independent solver and matcher

The independent solver must separately implement every provisional context.

Expose:

```ts
independentlyApplyMixedRule(...)
matchingMixedRules(evidence)
verifyMixedTransfer(...)
```

Each match records:

- rule ID;
- context key;
- priority;
- input/output shapes;
- delegated component rules where applicable.

## Stage 5 — Cross-check bridges

Build mechanical audits against:

- CP-005 single-letter rules;
- CP-006 cluster rules;
- numeric analogy authorities;
- CP-007 word-value authorities;
- Coding-Decoding task ownership.

The first pilot may implement CP-005/006 and native CP-008 checks directly while documenting unavailable numeric/Coding bridges. Permanent freeze requires all relevant bridges.

## Stage 6 — Yield simulation

For every provisional context, measure:

- valid typed inputs;
- candidate source-target pairs;
- solver disagreements;
- native ambiguity rejects;
- letter-only collision rejects;
- number-only collision rejects;
- coding-overlap rejects;
- accepted pairs;
- visible output diversity.

Minimum pilot threshold:

```text
accepted pairs per context >= 40
solver disagreements = 0
```

Contexts below threshold remain pilot-only or are removed.

## Stage 7 — Option-yield proof

Construct misconception-based options for direct completion and pair selection.

For every accepted context, prove:

- four canonical unique options;
- exactly one correct option;
- three incorrect options rejected by every eligible rule matcher;
- at least two distinct misconception labels;
- answer-position balancing is possible.

## Stage 8 — Source and gap audit

After the pilot:

- recover missing modern composite rules;
- decide whether sum/product are contexts or separate QLs;
- decide whether scalar output and derived-letter output are separate solve modes;
- classify number-to-letter and coupled rules;
- audit inverse and incorrect-pair tasks;
- verify no meaningful mixed analogy family remains uncovered.

Only here may the final QL count be proposed.

## Stage 9 — Manifest freeze

The amendment must define:

- final native authorities;
- exact QL range;
- presentation modes;
- answer shapes;
- context domains;
- downstream range changes, if any;
- locale policy;
- freeze gates.

The 16 reserved QLs may be retained, reduced or expanded only from this evidence.

## Stage 10 — Production runtime

Implement:

- permanent registry;
- deterministic generator;
- independent solver;
- ambiguity checker;
- option validator;
- English explanations;
- Hindi/Punjabi localization;
- review exporters;
- dedicated CI.

Safety remains:

```text
publiclyPublishable: false
maturity: RUNTIME_PROOF
```

No Question Studio or public routing until manual review.

## Current stage

```text
Stage 0: in progress
Stage 1: ready to begin
Stage 2: ready to begin
Stage 3: ready for non-QL pilot
Permanent QLs: not allocated
```
