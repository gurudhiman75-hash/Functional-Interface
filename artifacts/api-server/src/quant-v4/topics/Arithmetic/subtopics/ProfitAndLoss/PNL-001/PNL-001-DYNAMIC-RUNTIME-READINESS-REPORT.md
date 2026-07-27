# PNL-001 Dynamic Runtime Readiness Report

Status: **AUDITED — DYNAMIC RUNTIME NOT YET IMPLEMENTED**

## Executive verdict

PNL-001 is fully solver-proven and available in Question Studio through its canonical review runtime. It is not yet a true dynamic question generator.

```text
Total QLs:                         186
Solver-proven QLs:                 186
Canonical-review-ready QLs:        186
Fully dynamic QLs:                   0
QLs requiring dynamic runtime:     186
Current shared runtime mode:       CANONICAL_REVIEW
```

A solver proof demonstrates that supplied parameters produce the correct mathematical answer. A dynamic Question Studio runtime additionally requires a seeded QL-specific parameter constructor, rendered stem binding, answer-semantic formatting, misconception-based options, independent verification and package emission. Those layers do not yet exist as one QL-addressable pipeline.

## Blocking runtime layers

Every QL still needs:

1. a QL-specific seeded parameter dispatcher;
2. dynamic paragraph, equation, table, caselet, statement and data-sufficiency binding;
3. answer-semantic formatting;
4. misconception-labelled distractor dispatch;
5. independent verification of each generated instance;
6. dynamic `QuestionPackage` emission.

The existing `generateFundamentalParameters()` helper is a useful CP-001 foundation, but it emits only a generic cost/rate/direction tuple. It does not select a QL, construct the exact given variables, route answer semantics, build all four options, bind Editorial V2 content or emit a validated package.

## CP readiness matrix

| Wave | CP | QLs | Solve modes | Answer semantics | Structured QLs | Avg. required variables | Max. variables | Parameter status |
|---:|---|---:|---:|---:|---:|---:|---:|---|
| 1 | PNL-CP-001 | 36 | 18 | 14 | 0 | 2.00 | 3 | Partial foundation only |
| 2 | PNL-CP-002 | 34 | 28 | 23 | 5 | 2.82 | 5 | QL dispatcher missing |
| 3 | PNL-CP-004 | 26 | 11 | 21 | 6 | 3.42 | 7 | QL dispatcher missing |
| 4 | PNL-CP-005 | 29 | 18 | 20 | 7 | 4.28 | 6 | QL dispatcher missing |
| 5 | PNL-CP-003 | 24 | 17 | 18 | 5 | 3.46 | 7 | QL dispatcher missing |
| 6 | PNL-CP-006 | 37 | 28 | 32 | 5 | 3.22 | 6 | QL dispatcher missing |

For every CP:

```text
solver proof:                         PROVEN
canonical review package:             READY
QL-specific parameter dispatcher:     MISSING
dynamic stem binding:                 MISSING
dynamic distractor dispatcher:        MISSING
dynamic independent-verifier bridge:  MISSING
dynamic QuestionPackage:              MISSING
fully dynamic QLs:                     0
```

## Recommended implementation waves

### Wave 1 — CP-001 fundamentals

Expand the existing seeded fundamental foundation into a QL-addressable dispatcher for all 36 QLs.

Required additions:

- construct direct and reverse given-variable sets;
- preserve profit, loss and no-change domains;
- generate exact money, percentage, ratio, fraction, margin and two-condition instances;
- format all 14 answer semantics;
- route money and rate misconceptions by solve mode;
- bind the approved Editorial V2 stem and explanation;
- independently verify every generated result;
- emit a dynamic `QuestionPackage` while retaining bank/test/public safety.

### Wave 2 — CP-002 discounts and promotions

Build marked-price, successive-discount, promotion, coupon, cashback and eligibility parameter families around the existing solver modules. Conditional thresholds and offer-order comparisons require explicit domain guards.

### Wave 3 — CP-004 transaction chains and fees

Build exact forward/reverse chains, missing-stage recovery, commission, buyer-expense, ledger and structured-table generation.

### Wave 4 — CP-005 dishonest trade

Generate billed-versus-delivered quantities, buying and selling measure combinations, declared versus actual rate and consumer-impact semantics using the existing misconception contracts.

### Wave 5 — CP-003 aggregate inventory

Generate weighted totals, equal-price cases, damaged and remaining stock, free units, target recovery, tables, caselets and data sufficiency with uniqueness constraints.

### Wave 6 — CP-006 effective cost, break-even and recovery

Implement last because it combines the widest cost bases, manufacturing components, product mixes, contribution constraints, recovery equations and representation contracts.

## Binding implementation rule

A QL becomes `DYNAMIC_READY` only when all of the following pass together:

```text
seeded parameters
+ exact solver
+ independent verifier
+ structured stem rendering
+ answer-semantic formatter
+ four misconception-labelled unique options
+ friendly value-specific explanation
+ deterministic regeneration
+ package validation
+ Question Bank/test/public safety
```

Solver coverage alone, or a generic random-number helper, must never be reported as dynamic-generation coverage.

## Safety

The readiness audit changes no runtime behaviour.

```text
current runtime:       CANONICAL_REVIEW
questionBankStatus:    NOT_STORED
testEligibility:       INELIGIBLE
publiclyPublishable:   false
```

Dynamic implementation should proceed CP by CP on separate auditable branches, starting with CP-001.
