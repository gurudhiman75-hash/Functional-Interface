# PNL-001 English Editorial Wave 02 — CP-003 Report

## Result

The repeated CP-wide explanation tail has been removed from all 24 `PNL-CP-003` dynamic QLs and replaced with solve-mode-specific, generated-value-bound working.

```text
QL range:                    PNL-QL-071..094
QLs:                         24
Underlying solve modes:      17
Proof seeds per QL:          24
Generated proof packages:    576
Legacy generic tails:        0
Missing generated checks:    0
Structural audit failures:   0
Lifecycle changes:           0
```

## Covered explanation families

- multiple-lot total cost and recovery;
- equal-selling-price reverse cost comparison;
- equal-cost-price combined selling comparison;
- partial, unsold, damaged and spoiled inventory;
- grouped-rate weighted recovery;
- unknown group rate and quantity inverses;
- required remaining-unit price and rate;
- equal-SP special loss and one-rate inverse;
- total cost/total selling reversals;
- recovery-fraction overall result;
- table, caselet, statement, algebraic and data-sufficiency variants.

## Repetition control

Every package now contains a `Generated-value check` paragraph tied to its actual generated quantities, rates, cost values, recovery values or target result.

The permanent CP-003 regression rejects:

- the old `Working with these values` paragraph;
- a missing generated-value paragraph;
- unresolved prose placeholders;
- any normalised generated-working paragraph shared by more than two QLs.

A maximum two-QL overlap is permitted only where two registered QLs deliberately share the same solve mode but differ in representation or answer semantic.

## Hosted proof

```text
Workflow:   Implement PNL CP-003 Explanation Diversity
Run:        30506128449
Conclusion: PASS
Artifact:   8745371902
Digest:     sha256:dee8abe2a51b241e29b8bc525fe62bc880cb5af9caf5e6b35c02fd107406bec2
```

The hosted run passed:

1. source formatting and bundling;
2. all 576 CP-003 generated packages;
3. generated-working presence and repetition gates;
4. the chapter-wide PNL English editorial audit.

## Safety boundary

No solver, stem, option, Question Studio route, shared generation-engine route, Question Bank write, test eligibility or publication metadata was changed. Every generated package remains an unreviewed dynamic candidate, not stored, test-ineligible and non-public.
