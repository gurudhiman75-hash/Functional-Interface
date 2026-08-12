# TMW-001 CP008 Multilingual Editorial Review Status

**Checkpoint:** `TMW-CP-008 — Wages and Contribution`  
**QL range:** `TMW-QL-144..156`  
**Languages:** English, Hindi, Punjabi  
**Status:** `ASSISTANT_EDITORIAL_REVIEW_COMPLETE / FREEZE_CANDIDATE`  
**Public delivery:** LOCKED

## Review finding

The pre-review CP008 generator was mathematically valid, but the learner-facing layer was not exam-ready. The human corpus exposed generic wage explanations across unrelated solve modes, untranslated English fragments in localized working, awkward Hindi/Punjabi contract grammar, misconception feedback that sometimes described the wrong question target, redundant identities, and explanations that exposed hidden generator factors not stated in the stem.

## Remediation completed

- remodeled learner working across all 13 CP008 solve modes;
- made answer lines family-aware for ratios, payment pool, residual amount, unknown days/rate, category distribution, piece-rate, bonus and accepted-net-output questions;
- removed hidden factors from inverse and equal-factor derivations;
- QL146 now works directly from the stated contribution ratio;
- QL148 cancels equal work rate and equal daily hours when they are not numerically stated, while unequal-rate variants require the rates to be visible in the stem;
- QL151/152 explicitly cancel equal unspecified daily hours;
- QL153 explicitly cancels equal unspecified time and uses count × rate only;
- removed QL145 duplicate selected-contribution identity;
- localized learner steps no longer leak English diagnostic labels;
- corrected Hindi/Punjabi contract postpositions;
- made `TOTAL_REPORTED_AS_SHARE` feedback question-aware;
- retained canonical answers, four-option contracts, permanent QL IDs and `publiclyPublishable: false`.

## Permanent gates

1. CP008 broad multilingual editorial proof: 13 QLs × 3 languages × 8 seeds = **312 cases**.
2. Targeted manual-findings regression: 10 QLs × 3 languages × 2 namespaces × 8 seeds = **480 cases**.
3. MathJax/control-character integrity: 13 QLs × 3 languages × 2 namespaces × 8 seeds = **624 cases**.
4. QL148 visible-givens regression: **48 cases**.
5. Hindi/Punjabi human-review export: 13 QLs × 2 languages × 2 seeds = **52 packages**.
6. Broad workflow also runs the full 228-QL × 3-language = **684-package** chapter audit and chapter multilingual parity.

The exact final governance head must pass all gates before the stacked draft PR is considered the checkpoint freeze candidate.
