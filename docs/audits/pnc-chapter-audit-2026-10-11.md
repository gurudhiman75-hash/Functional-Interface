# Permutation & Combination chapter freeze

Status: **TECHNICAL_REVIEW_FROZEN**. Implementation and source mathematical coverage are closed for the authored review scope. Live verification is deferred to the user. Publication remains locked; no native human approval is invented.

| Coverage | Frozen result |
|---|---:|
| Core QLs, CP001–012 | 269 |
| Core English/Hindi/Punjabi surfaces | 807 |
| Core seed/language regression checks | 9684 |
| Numbered source exercises | 187 / 187 implemented |
| Worked problems | 46 / 46 implemented |
| Theory illustrations and inline student tasks | 12 + 4 checked |
| Exercise/worked language surfaces | 699 |
| Registered supplementary review rows | 948 |
| Unassessed exercises / missing mathematical exercise models | 0 / 0 |

The unified Quant adapter registers PNC-001, PNC-002 and PNC-SOURCE-REVIEW. Every split CP011/012 runtime is dispatched. PNC-001 now has 106 authored templates in each native language, with placeholder parity and solver-owned answers. PNC-002 retains its existing approved native authority. Supplementary exercise and worked candidates support all three languages, including their existing review selectors.

The new reusable models cover bounded and variable-length digit strings, numeric thresholds, exact occurrence, leading zero, residue/parity, distinct-digit counts, ending uniqueness, constrained repeated multisets, fixed positions, forbidden patterns, group quotas, mixed identical/distinct selections, bounded compositions, office assignments, grids, collinear blocks, inverse pair counts, graph impossibility and source caselets. Large factorials retain exact decimal strings as answer authority and display symbolic MCQ options (for example 99! and 100!/2); no floating-point conversion is used for the large source answers.

All 187 exercises have explicit source-case selectors. Ambiguous statements use labelled, ordered, repetition or endpoint conventions stated in the authored stem. Symbolic source statements have reusable formulas and concrete instances. Conceptual underdetermination remains a valid answer where source information is insufficient. These are not claims that ambiguous original wording has a uniquely recoverable answer or that the preparation book proves original CAT/PYQ provenance.

Worked coverage includes visual inspection and coordinate/counting repairs for diagram-dependent problems 17.28, 17.29, 17.38 and 17.43. Worked 17.28 has 30 valid multiset arrangements rather than the printed explanation's 24. Worked 17.23 needs coin values to determine distinct sums. The correction ledger records these and the other explicit source conventions. The chapter PDF is SHA-256 `758bcede219eeb34dbd548ff64a9d807348f396cb0f5c1caac972a29acb736c4`; concepts/examples occupy pages 813–823, exercises 824–835 and keys/solutions 836–845.

Eleven targeted regression suites pass, including independent digit enumeration (432 cases), extended arrangement/distribution/committee/grid checks (155 cases), geometry enumeration (720 cases), score and exact-digit checks, all source/worked candidates and both unified review providers. Prime valuation has 305 additional checks. Scoped production TypeScript passes. The frozen core also passes 269 × 3 languages × 12 seeds, repeated-seed determinism, numeric language parity, unique options, serialization and release-gate checks. Correct-option positions are 2454/2382/2379/2469 across the 9684 core surfaces; this is measured distribution, not a per-QL balance guarantee.

English core editorial authority is retained from the package maturity reviews. New source stems explicitly include shared caselet givens and interpretation conventions, use authored workings and preserve exact answers. Native additions are **authored review candidates**, not recorded human-approved translations. Mathematical notation is reused from the same answer authority, with native stems, reasoning and conclusion. This technical review freeze does not certify external human editorial signoff.

The freeze manifest records hashes for 267 chapter/runtime files and a semantic hash of the eight PNC integration lines. Unrelated changes to the shared Quant adapter do not invalidate the chapter freeze. `verify-pnc-freeze.ts` fails if frozen content changes or review release gates are opened. Changes to this content require a new reviewed checkpoint rather than silently changing a frozen chapter.

Public/Bank/test/mock eligibility and persistence remain false. The separate release steps are the user's deferred live verification and any required native human/publication approvals. They do not leave implementation gaps in this frozen REVIEW_ONLY checkpoint.

Evidence: `pnc-source-review/PNC-CHAPTER-FREEZE-20261011.json`, `PNC-FINAL-REGRESSION-20261011.json`, `PNC-187-SOURCE-INVENTORY-20261011.csv`, `PNC-46-WORKED-INVENTORY-20261011.csv`, `PNC-SOURCE-CORRECTIONS-20261011.md` and `PNC-FROZEN-LEARNER-SAMPLES-20261011.json`. The full learner export is reproducible with `scripts/audits/pnc-chapter-freeze-audit.ts`; the committed sample file states its reduced sample scope.
