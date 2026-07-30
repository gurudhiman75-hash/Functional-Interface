# PNL-001 English Editorial Wave 02 — CP-006 Report

## Result

The final repeated CP-wide explanation tail has been removed from all 37 `PNL-CP-006` dynamic QLs and replaced with solve-mode-specific, generated-value-bound working.

```text
QL range:                    PNL-QL-150..186
QLs:                         37
Underlying solve modes:      28
Proof seeds per QL:          24
Generated proof packages:    888
Legacy generic tails:        0
Missing generated checks:    0
Structural audit failures:   0
Lifecycle changes:           0
```

## Covered explanation families

- effective cost from flat expenses and percentage overhead;
- target selling price and inverse effective cost;
- wastage-adjusted and scrap-adjusted unit cost;
- fixed-cost, variable-cost and contribution break-even;
- target-profit quantity and unit-price inverses;
- manufacturing prime cost, overhead, packaging and scrap recovery;
- contribution-margin ratio and break-even revenue;
- multi-product fixed-mix break-even bundles;
- margin-of-safety amount and percentage;
- prior recovery and final recovery balancing;
- loss recovery on remaining capital;
- commission-adjusted net result and gross-price inverse;
- table, caselet, statement, algebraic and data-sufficiency variants.

## Repetition control

Every package now contains a `Generated-value check` tied to its generated purchase, expense, overhead, manufacturing, wastage, contribution, recovery or commission values.

The permanent CP-006 regression rejects:

- the old `Working with these values` paragraph;
- a missing generated-value paragraph;
- unresolved prose placeholders;
- any normalised generated-working paragraph shared by more than two QLs.

A first audit found a 12-sample closing shared by manufacturing and margin-of-safety QLs. Their conclusions were split by answer semantic before freeze:

- net production cost;
- finished-unit manufacturing cost;
- table-derived unit cost;
- money margin of safety;
- percentage margin of safety.

## Hosted implementation proof

```text
Workflow:   Implement PNL CP-006 Explanation Diversity
Run:        30508446112
Conclusion: PASS
Artifact:   8746205878
Digest:     sha256:0e3cb0a2613aaa267e9e26bda888e59b8bab985afc97a242cee3f7051c02f53c
```

## Hosted final-audit refinement

```text
Workflow:   Refine PNL CP-006 Final Audit
Run:        30508771002
Conclusion: PASS
Artifact:   8746312971
Digest:     sha256:cd7719c2f99c593da4d0e12ef16371c71de80795b7f3fba015f6436244763e07
```

Both runs passed all 888 CP-006 packages and the complete chapter editorial audit.

## Final chapter-audit result

```text
Review rows:                    558
Fatal findings:                   0
Editorial findings:              56
Exact cross-QL duplicates:        0
Normalised cross-QL clones:       0
Same-QL stem repeats:              3
Same-QL answer repeats:           14
CP-wide generic explanation tails: 0
Audit status:             REVIEW_REQUIRED
```

The 111-sample CP-006 generic paragraph is absent. Together with the completed CP-002, CP-003, CP-004 and CP-005 waves, the chapter now has **zero checkpoint-wide generic working tails**.

The remaining findings concern frozen/shared editorial material, limited stem or answer diversity and smaller repeated opening/closing patterns. They require targeted human editorial decisions; they are not runtime or structural failures.

## Resolved issue metadata

GitHub issue `#262` for `PNL-QL-070` is closed as completed, and the audit's lead-insufficiency regression passes. Audit metadata now records:

```text
status: RESOLVED_AND_MONITORED
code:   DS-LEAD-LEAKAGE
```

The stale `knownOpenIssue` label has been removed.

## Safety boundary

No solver, stem, option, Question Studio route, shared generation-engine route, Question Bank write, test eligibility or publication metadata was changed. Every package remains an unreviewed dynamic candidate, not stored, test-ineligible and non-public.
