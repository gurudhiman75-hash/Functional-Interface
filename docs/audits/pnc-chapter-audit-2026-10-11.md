# Permutation & Combination chapter audit

Status: audit opened; chapter closure is pending. Live verification is reserved for the user.

Baseline: New-main commit `5448d74d`, isolated branch `audit/pnc-source-deep-audit-20261011`. PNC runtime files match the previously tested TSD checkout.

## Verified baseline

| Package | Scope | Result |
|---|---|---|
| PNC-001 | 106 QLs, CP001–006; 12 seeds per QL | 1,272 generated packages passed the existing runtime suite |
| PNC-002 | 163 QLs, CP007–012; 130 solve modes | Existing final family readiness suite passed |
| PNC-002 native | 163 QLs × Hindi/Punjabi × 2 seeds | 652 localized packages passed the approved localization suite |

Tests: `pnc-001.test.ts`, `pnc-002-final-family-readiness.test.ts`, and `pnc-002-localization-complete-approved.test.ts`. These establish existing test coverage, not complete source or editorial coverage.

## Source inventory

Source: Arun Sharma, *How to Prepare for Quantitative Aptitude for the CAT*, McGraw Hill Education (2018), chapter 17. SHA-256: `758bcede219eeb34dbd548ff64a9d807348f396cb0f5c1caac972a29acb736c4`.

| Section | PDF pages (1-based) | Numbered questions |
|---|---|---|
| Chapter concepts and worked examples | 813–823 | Separate enumeration pending |
| Level I | 824–829 | 1–87 |
| Level II | 830–832 | 1–50 |
| Level III | 833–835 | 1–50 |
| Answer key, hints and solutions | 836–845 | Reference material |

The companion CSV inventories all **187 numbered exercise questions**. Individual page candidates are machine extracted and require visual confirmation. Shared passage directions must remain attached during mapping. The 187 exercises are distinct from the 269 existing QLs; no one-to-one mapping or source coverage closure is claimed. This preparation book does not establish original CAT/PYQ provenance.

## Open implementation findings

1. No PNC registration was found in the current unified `question-studio/engines/quant-v4-adapter.ts`, `quant-v4/question-studio-review-engine.ts`, or `question-studio-review-registry.ts`. Standalone runtime readiness does not establish unified review integration.
2. PNC-002 has approved native localization authority. No PNC-001 localization files were found in its package. Chapter-wide trilingual completeness remains unproven.
3. Every source exercise still needs mapping to a supported runtime model, an explicit repair, or a documented exception. Worked examples need their own inventory.
4. Generated learner stems, worked explanations, options, answer position balance, scenario diversity and deterministic serialization need chapter-wide checks beyond the existing baseline tests.

Publication remains governed by the existing review gates. This audit does not approve student release or merge the separate TSD branch.

## Chapter-wide runtime pass and first source-gap implementation

The new `scripts/audits/pnc-chapter-runtime-audit.ts` checks all active split runtime authorities across **269 QLs × 12 seeds = 3,228 packages**. Result: PASS, zero findings. Checks cover repeated-seed determinism, JSON serialization, existing runtime validation, four unique options, correct-option identity, independent answer agreement, unresolved content, worked explanation presence and publication gates. It also emits learner samples, distinct stem counts and answer-position distributions for editorial review. Distribution output is evidence, not an assertion that every QL has balanced positions.

The source inventory now has **23 structural model matches**, **6 exact-parameter geometry mappings**, and **158 pending rows**. Structural matches do not imply the current generator can reproduce the book's exact values or wording. In particular, “new words” may require excluding the original word; that ambiguity is recorded rather than silently treated as an ordinary multiset permutation.

Added `source-review/geometry-counting.ts`: six explicit models for general lines, lines with one collinear block, general triangles, triangles with one collinear block, quadrilateral vertex sets with one collinear block, and convex polygon diagonals. Stems explicitly state the collinearity assumptions. Each model has calculated EN/HI/PA explanations and independent enumeration. These are review candidates, not approved localization authority or unified Question Studio integration.

Verification: **720 mathematical domain cases** passed against independent vertex-set/line-identity enumeration; **216 localized generated packages** passed determinism, correct-option and publication-gate checks. Book parameter checks: Level I Q8 = 28, Q37 = 280, Q38 = 2,265, Q39 = 11,985, Q69 = 84, Q70 = 83. Q39's printed key is (d), “None of these,” which agrees with 11,985; it is not a source-key defect.

Saved evidence: `pnc-source-review/PNC-269-RUNTIME-AUDIT-SUMMARY-20261011.json`, `PNC-GEOMETRY-REVIEW-SAMPLES-20261011.json` (one seed per model/language), and the updated 187-row source inventory. Source mapping, worked-example enumeration, full editorial checks, PNC-001 localization and unified review integration remain open.

## Subset source-gap pass

Added five English review models: non-empty subsets of distinct objects, non-empty selection from each distinct category, bounded quantities of identical items, optional questions with internal alternatives, and distinct subsets up to a maximum size. Explanations show the calculated factors and clarify whether the empty selection is included. Each package has four unique numeric options and remains locked for student publication.

Independent membership/quantity/question-outcome enumeration passed 42 domain cases plus five source-parameter regressions: Level I Q31 = 4,944 (empty selection included), Q51 = 149, Q52 = 16,383, Q53 = 13,671, Q54 = 14,348,906. Excluding the empty selection from Q31 gives 4,943; authored stems state the convention explicitly. Scoped TypeScript validation passed for the new production module.

The inventory now contains 23 structural matches and 11 implemented source mappings, with 153 exercises pending. The new subset candidates still need localization and unified review integration; this is progress evidence, not chapter closure.
