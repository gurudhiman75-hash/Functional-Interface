# PNL-001 English Editorial Audit — Wave 01

## Status

Wave 01 establishes a permanent generated-question review corpus and corrects structural defects discovered by broader editorial seeding. It does **not** declare English editorial readiness.

```text
CPs reviewed:                 6
QLs represented:             186
Candidate seeds per QL:       18
Selected samples per QL:      3
Reviewer rows:                558
Structural blockers:          0
Exact cross-QL duplicates:    0
Normalised cross-QL clones:   0
Editorial findings:           62
Audit status:                 REVIEW_REQUIRED
Question Studio wiring:       unchanged
Question Bank status:         NOT_STORED
```

## Runtime defects corrected during audit

### CP-003 directional inventory inverse

`PNL-QL-078` could generate known and unknown inventory groups whose signed results cancelled to exactly no change. The inverse requires a profit/loss direction, so the generator now keeps the two groups in the same direction. A permanent 72-case editorial-seed regression was added.

### CP-005 heavy-buy/light-sell inverse

`PNL-QL-140` could generate price and quantity ratios that cancelled to no change. The heavy-buy/light-sell family now uses one common quoted purchase/selling price, guaranteeing a genuine profit from the quantity deception. A permanent 522-package candidate-seed regression was added for all 29 CP-005 QLs across 18 seeds.

### CP-005 and CP-006 option fallback collision

For a ₹1,000 money answer, the old ±10% and ±₹100 candidates collapsed into only two distinct distractors, exposing `Alternative 3` in `PNL-QL-137` and `PNL-QL-155`. Both option builders now use a wider positive-money candidate pool, and exact seed regressions prevent fallback labels from returning.

## Structural result

The final Wave-01 corpus has:

- zero unresolved placeholders;
- zero invalid runtime tokens;
- zero fallback `Alternative n` options;
- zero duplicate-option packages;
- zero exact cross-QL stem duplicates;
- zero normalised cross-QL stem clones;
- review-only safety metadata on every sample.

## Known blocker still open

- `PNL-QL-070` / GitHub issue `#262`: its data-sufficiency lead supplies enough commercial values before the statements. The lead must become insufficient, and the correction must be coordinated across English, Hindi and Punjabi source content.

## Systemic editorial debt

The dominant issue is a CP-wide generic paragraph appended to every explanation:

- 111 CP-006 samples: `Working with these values: Build effective cost and contribution on their stated bases...`
- 102 CP-002 samples: `Working with these values: The generated offer is evaluated in the exact order...`
- 87 CP-005 samples: `Working with these values: Separate the billed amount from the cost of the quantity actually delivered...`
- 78 CP-004 samples: `Working with these values: Follow each transaction in order...`
- 72 CP-003 samples: `Working with these values: Convert every inventory group into total cost and total recovery...`

These paragraphs are mathematically safe but make the explanations look machine-produced. They should be replaced with solve-mode-specific, value-specific working rather than merely reworded globally.

After diversity-aware selection, the QLs still showing one visible stem across all three samples are:

- `PNL-QL-082`
- `PNL-QL-144`
- `PNL-QL-183`

The following QLs still show the same answer in all three selected samples and require an explicit reviewer decision:

- `PNL-QL-035`
- `PNL-QL-067`
- `PNL-QL-070`
- `PNL-QL-082`
- `PNL-QL-084`
- `PNL-QL-090`
- `PNL-QL-117`
- `PNL-QL-118`
- `PNL-QL-144`
- `PNL-QL-147`
- `PNL-QL-159`
- `PNL-QL-182`
- `PNL-QL-183`
- `PNL-QL-184`

Many of these are fixed statement, no-change or tightly constrained inverse contracts; repetition is not automatically a defect, but it must be consciously accepted or widened.

## Finding counts

| Finding | Count |
|---|---:|
| Repeated explanation paragraph | 30 |
| Same-QL answer repeat | 14 |
| Repeated explanation opening | 8 |
| Repeated explanation closing | 6 |
| Same-QL stem repeat | 3 |
| Known data-sufficiency blocker | 1 |

## Review corpus

The permanent workflow exports:

- `pnl-001-english-editorial-review.csv`
- `pnl-001-english-editorial-review.md`
- `pnl-001-english-editorial-metrics.json`
- `pnl-001-english-editorial-findings.json`
- `pnl-001-english-editorial-findings.md`

The CSV contains blank reviewer columns for decision, severity, issue codes, notes and replacement wording.

## Next remediation order

1. Correct `PNL-QL-070` data-sufficiency leakage.
2. Replace the generic CP-002 through CP-006 working paragraphs with solve-mode/value-specific explanation tails.
3. Review the remaining same-stem and same-answer QLs individually.
4. Record human decisions in the 558-row CSV.
5. Regenerate the same deterministic corpus and compare Wave 02 against this baseline.

## Safety and integration boundary

No Question Studio route, shared generation-engine route, capability metadata, Question Bank write, test eligibility or publication flag is changed by this audit. Every sample remains an unreviewed dynamic candidate.