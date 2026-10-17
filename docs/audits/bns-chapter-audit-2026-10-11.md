# Banking Number Series — pending chapter audit

> Historical Phase-0 checkpoint. Superseded for current implementation status
> by `bns-content-review-v3-2026-10-13.md` and the merged PR #3413 numeric-surface
> audit. See `bns-source-frequency-review-2026-10-17.md` for the current source
> and frequency evidence boundaries; do not reopen completed V3 work from this
> historical backlog.

Package: `BNS-001`. Base: `New-main@320807d0`. Technical audit of the existing Phase-0 scope: PASS after correction. Whole-chapter source/content freeze: NOT CLAIMED.

## Verified backlog

| Area | Current authority | Audit status |
|---|---|---|
| Banking Number Series | `BNS-001-PHASE0-V1`, `reviewStatus: UNREVIEWED` | Active unfinished chapter audit |
| Quantity Comparison | `QCP-001/README.md`: `PHASE0_REVIEW_ONLY` | Unfinished representation audit |
| Number System | Prior 2026-10-02 closure, 14 CPs / 253 QLs | Closure preserved; audit measurement corrected |
| Previously closed Quant chapters | Existing source/runtime/freeze authorities | Not reopened by missing fresh routing certificates |

This is a verified unfinished-area list, not a claim that every historical chapter has a newly repeated audit. Integration status, exam-profile frequency calibration, publication decisions and chapter deep-audit status are separate facts.

## Current BNS scope

Five supported grammars: arithmetic difference, progressive difference, geometric multiplication, multiply-and-add, and interleaved arithmetic. Two supported tasks: next term and missing term. All ten combinations are tested at 100 seeds each.

The current runtime supports English and Banking Prelims, five answer options, and missing positions 3/4/5. No permanent QLs are allocated. Question Studio discovery, Question Bank, test eligibility and public publication remain closed. The current section simulator explicitly records that a Banking Mains number-series profile is not frozen.

## Defect and correction

The independent verifier checked the correctness of a continuation without first checking the learner-package shape. Removing a distractor could leave four options while retaining a mathematically valid answer, and an unsupported task string was interpreted through the missing-term branch.

The verifier now rejects malformed option counts, duplicate choices, invalid correct indexes, unsupported task/pattern selectors, invalid visible-series size and inconsistent missing-position markers. The generator explicitly rejects unsupported task/pattern selectors before generating content.

Six negative regression fixtures preserve a mathematically correct answer while violating the package contract. All six are rejected. Unsupported task and grammar requests are also rejected at generation ingress.

## Validation

- 1,000 deterministic generated questions and replay checks passed.
- 1,000 independent grammar verifications passed.
- 4,000 distractor grammar checks passed.
- Internal and independent grammar agreement passed for all 1,000 canonical series.
- Every task/grammar combination reached all five correct-answer positions.
- Every missing-term grammar reached all three supported hidden positions.
- Existing family-specific visible-state diversity floors passed.
- Scoped TypeScript check passed for the BNS test and dependency graph.

## Remaining chapter gates

The Phase-0 technical proof is not source saturation. Before a whole-chapter freeze, complete a target-exam source fixture ledger and adjudicate missing/wrong-term grammar breadth, including any source-supported square/cube increments, prime/Fibonacci patterns, division patterns and position-dependent operations. Do not infer those families merely from the existence of the current five grammars.

The missing-term explanation gap found in this pass is corrected: explanations now use visible adjacent differences or visible same-parity rows to derive the missing term, show its numerical calculation, and check the next visible step when one exists. Interleaved final-position gaps do not invent an unseen next term. Native-language and Mains coverage still require explicit, source-supported scope rather than changing the existing profile label.

The source/semantic/maturity gates remain open. No human approval or public activation is asserted. User-run live verification is deferred and does not block the remaining source/content work.
