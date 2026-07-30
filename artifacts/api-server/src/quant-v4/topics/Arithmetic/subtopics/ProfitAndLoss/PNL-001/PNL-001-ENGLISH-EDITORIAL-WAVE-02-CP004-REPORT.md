# PNL-001 English Editorial Wave 02 — CP-004 Report

## Result

The repeated CP-wide explanation tail has been removed from all 26 `PNL-CP-004` dynamic QLs and replaced with solve-mode-specific, generated-value-bound working.

```text
QL range:                    PNL-QL-095..120
QLs:                         26
Underlying solve modes:      11
Proof seeds per QL:          24
Generated proof packages:    624
Legacy generic tails:        0
Missing generated checks:    0
Structural audit failures:   0
Lifecycle changes:           0
```

## Covered explanation families

- two-stage and three-stage forward chains;
- reverse and mixed-direction chains;
- intermediate stage prices;
- overall chain rates and statement evaluation;
- missing profit/loss rate and algebraic inverse;
- equal-rate compounding;
- selected, largest, complete and comparative stage ledgers;
- buyer expense before profit/loss;
- gross commission, net receipt and inverse grossing-up;
- middle-trader direct and caselet results;
- table, caselet, statement, algebraic and data-sufficiency variants.

## Repetition control

Every package now contains a `Generated-value check` tied to its actual transaction stages, prices, rates, expenses, commissions or ledger values.

The permanent CP-004 regression rejects:

- the old `Working with these values` paragraph;
- a missing generated-value paragraph;
- unresolved prose placeholders;
- any normalised generated-working paragraph shared by more than two QLs.

A follow-up audit found one nine-sample repeated closing across the three reverse-chain QLs. Their conclusions were split into two-stage, three-stage and mixed-direction wording, removing that pattern before freeze.

## Hosted implementation proof

```text
Workflow:   Implement PNL CP-004 Explanation Diversity
Run:        30506983875
Conclusion: PASS
Artifact:   8745701525
Digest:     sha256:3b5211e9161160615ddf891c750c85e0f8ce6cec5c5edba996a6c1874654fffd
```

## Hosted refinement proof

```text
Workflow:   Refine PNL CP-004 Reverse Closings
Run:        30507215354
Conclusion: PASS
Artifact:   8745799941
Digest:     sha256:eb74bb8580df7c0f829855726d219b25bc4a1542dd874c8cbc0ce625438f4fb5
```

The refined run passed:

1. all 624 CP-004 generated packages;
2. generated-working presence and repetition gates;
3. the complete 558-row PNL English editorial audit.

## Chapter-audit delta

```text
Review rows:                  558
Fatal findings:               0
Editorial findings:           60
Exact cross-QL duplicates:    0
Normalised cross-QL clones:   0
Audit status:                 REVIEW_REQUIRED
```

The former 78-sample CP-004 generic paragraph is absent. The remaining chapter-wide generic explanation tails are:

```text
CP-005:  87 samples
CP-006: 111 samples
Total:   198 samples
```

## Safety boundary

No solver, stem, option, Question Studio route, shared generation-engine route, Question Bank write, test eligibility or publication metadata was changed. Every package remains an unreviewed dynamic candidate, not stored, test-ineligible and non-public.
