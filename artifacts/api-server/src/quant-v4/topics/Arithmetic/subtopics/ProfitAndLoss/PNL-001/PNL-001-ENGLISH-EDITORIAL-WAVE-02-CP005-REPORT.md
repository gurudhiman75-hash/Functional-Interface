# PNL-001 English Editorial Wave 02 — CP-005 Report

## Result

The repeated CP-wide explanation tail has been removed from all 29 `PNL-CP-005` dynamic QLs and replaced with solve-mode-specific, generated-value-bound working.

```text
QL range:                    PNL-QL-121..149
QLs:                         29
Underlying solve modes:      18
Proof seeds per QL:          24
Generated proof packages:    696
Legacy generic tails:        0
Missing generated checks:    0
Structural audit failures:   0
Lifecycle changes:           0
```

## Covered explanation families

- false quantity at quoted price and declared-rate deception;
- target delivered quantity and target quoted price;
- buy-heavy/sell-light direct and inverse calculations;
- markup, discount and false-quantity combinations;
- price change plus short quantity;
- customer overcharge versus seller profit/loss;
- inverse delivered quantity and declared rate;
- cost recovery from actual rate or actual amount;
- effective price per true quantity;
- direct and table-based scheme comparison;
- false-count, false-metre, caselet, statement, algebraic and data-sufficiency variants.

## Repetition control

Every package now contains a `Generated-value check` tied to its actual nominal quantity, delivered quantity, cost, quoted bill, markup, discount, target rate or scheme values.

The permanent CP-005 regression rejects:

- the old `Working with these values` paragraph;
- a missing generated-value paragraph;
- unresolved prose placeholders;
- any normalised generated-working paragraph shared by more than two QLs.

## Hosted implementation proof

```text
Workflow:   Implement PNL CP-005 Explanation Diversity
Run:        30507755488
Conclusion: PASS
Artifact:   8745968880
Digest:     sha256:70e70c7bbda533c6b308156288687b1541f944f6531638d8b05e914665944994
```

The hosted run passed all 696 CP-005 packages and the complete PNL English editorial audit.

## Audit accuracy correction

The chapter audit previously treated decimal points as sentence endings, so a valid closing such as `18.75% profit` was recorded as the repeated fragment `75% profit`.

The sentence detector now protects decimal points before sentence splitting and restores them afterwards.

```text
Workflow:   Refine PNL Editorial Decimal Sentences
Run:        30507901356
Conclusion: PASS
Artifact:   8746030162
Digest:     sha256:cb4d71e3deb188f72d3235f702393f5ca110a7a10e5c5a15053ae47c9b717c38
```

## Chapter-audit delta

```text
Review rows:                  558
Fatal findings:               0
Editorial findings:           58
Exact cross-QL duplicates:    0
Normalised cross-QL clones:   0
Audit status:                 REVIEW_REQUIRED
```

The CP-005 87-sample generic paragraph is absent. Decimal-fragment false positives were also removed. The only remaining chapter-wide generic explanation tail is:

```text
CP-006: 111 samples
```

## Safety boundary

No solver, stem, option, Question Studio route, shared generation-engine route, Question Bank write, test eligibility or publication metadata was changed. Every package remains an unreviewed dynamic candidate, not stored, test-ineligible and non-public.
