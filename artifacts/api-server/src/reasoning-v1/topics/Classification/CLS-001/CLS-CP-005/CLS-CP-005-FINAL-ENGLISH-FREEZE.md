# CLS-CP-005 — Final English Freeze

Status: `FROZEN_ENGLISH_RUNTIME_PROOF`

Permanent QLs: `2`

## Permanent learner contracts

### CLS-QL-008 — Find the odd number tuple

Solve contract:

```text
CP005-FIND-ODD-NUMBER-TUPLE
```

Learner action:

```text
evaluate the complete internal relation of every displayed tuple
  -> identify the relation shared by all but one option
  -> select the tuple with the different relation
```

Admitted arities:

- ordered pairs;
- ordered triples;
- complete four-number groups.

The arity, numerical rule, direction, option count and difficulty are instance variables. They do not change the answer object, mismatch semantics or proof topology.

### CLS-QL-009 — Select the number tuple following the reference rule

Solve contract:

```text
CP005-SELECT-EQUIVALENT-NUMBER-TUPLE
```

Learner action:

```text
recover the complete internal signature of the reference tuple
  -> apply the same rule and positional roles to every candidate
  -> select the unique matching tuple
```

Admitted arities:

- ordered pairs;
- ordered triples;
- complete four-number groups.

This contract remains separate from CLS-QL-008 because the reference state, match semantics, answer proof and explanation sequence are different.

## Evidence basis

```text
Wave 1 rules:                         18
Generic source-gap Wave 2 rules:      16
Digit-product rule:                    1
Complete competing-rule universe:     35
Wave 1 audited questions:           1200
Generic Wave 2 audited questions:     324
Digit-product odd questions:          240
Digit-product equivalent questions:   240
Total pre-freeze executable evidence: 2004
```

Every retained question is independently re-solved against the complete 35-rule universe. Supporting rules may overlap only when they point to the same answer.

## Source and prototype compression

```text
Odd-tuple permanent sources:          35
Equivalent-set permanent sources:      6
Represented arities:               2, 3, 4
Permanent learner contracts:           2
```

Source prototypes and rule families measure evidence coverage. They are not QLs.

## Digit-product equivalent-set decision

The reference-set form of the digit-product rule is admitted to CLS-QL-009.

The naturalness audit proves that:

- the reference pair and correct candidate use different displayed values;
- the answer cannot be obtained by copying either reference member;
- four- and five-option forms are deterministic and diverse;
- every state is unique against all 35 rules;
- the explanation asks the learner to match the relation, not the values.

It therefore remains a rule instance inside the existing reference-set contract and does not create another QL.

## Final direct, inverse and answer-semantic gap audit

The complete CP-005 task universe contains two meaningful learner actions:

1. classification by mismatch without a reference tuple;
2. classification by exact relation match from a supplied reference tuple.

No further permanent contract is justified by:

- pair, triple or four-number arity;
- forward or reverse direction;
- exact totals, products, ratios, predicates or digit rules;
- four versus five options;
- numerical magnitude or difficulty;
- source-specific formula wording.

The following remain outside CP-005:

- source-to-incomplete-target completion — Numeric Analogy;
- next-term prediction — Series;
- missing-cell or incomplete-diagram recovery — Missing Number;
- unrestricted equation fitting or polynomial invention — rejected;
- single-number property classification — CP-004.

Result:

```text
Meaningful uncovered learner contracts: 0
Merge/split conflicts:                  0
Permanent QLs allocated:               2
```

## English runtime proof

The permanent runtime gate verifies:

- deterministic generation;
- all 35 rules in each permanent QL;
- all admitted permanent source prototypes;
- arities 2, 3 and 4;
- four- and five-option forms;
- Easy, Medium and Hard difficulty;
- answer-position coverage;
- independent 35-rule uniqueness;
- plain-language explanation before every calculation;
- no math-only option blocks;
- no internal identifiers in learner text;
- permanent lifecycle locks.

## Lifecycle and integration policy

```text
Locale:                       en-IN
Review status:                FROZEN_ENGLISH_RUNTIME_PROOF
Question Studio exposure:     disabled
Question Bank storage:        disabled
Test eligibility:             disabled
Public publication:           disabled
Hindi localisation:           not started
Punjabi localisation:         not started
```

The English QL boundary is frozen. Product wiring and multilingual freeze require separate explicit phases.
