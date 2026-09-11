# ANA-001 Final Audit Remediation V1

Status: `IN_REMEDIATION_REVIEW_ONLY`

This checkpoint converts the final Reasoning V1 audit findings for Analogy into a controlled remediation pass before the chapter is reconsidered for release. A second source-saturation pass is part of this remediation; the earlier 250-QL freeze is not treated as proof of exhaustiveness.

## Safety boundary

- Existing permanent IDs `ANA-QL-001..250` remain unchanged during remediation.
- The previously reserved `ANA-QL-251..274` CP-009 window is not allocated merely because gaps were discovered.
- No public/test/mock eligibility is enabled here.
- No Question Bank publication is implied.
- Remediation is performed on a dedicated review branch and must be reviewed before merge.

## Confirmed architecture findings

### P1 — ANA-CP-003 numeric distractors are value-near rather than misconception-derived

The frozen generator creates wrong answers mainly by adding/subtracting small deltas from the correct value. This does not model the mistakes a learner actually makes while applying the relation.

Remediation: derive distractors from rule-specific wrong operations such as wrong sign, omitted stage, wrong multiplier/divisor, wrong square/cube choice, wrong digit operation, or wrong predecessor/successor direction. Retain a bounded fallback only when three distinct misconception outputs cannot be constructed.

### P1 — ANA-CP-003 difficulty is declared by rule order instead of generated-instance evidence

The QL registry groups difficulty by rule index. This is not sufficient for Question Studio difficulty selection.

Remediation: generated questions receive an explicit instance difficulty derived from rule complexity, transformation depth, parameter count, inference/presentation burden and distractor proximity. Number magnitude must not be the primary reason for `HARD`.

### P1 — ANA-CP-004 difficulty is seed-selected and then magnitude-filtered

The frozen runtime chooses `EASY/MEDIUM/HARD` from `seed % 3` and attempts to fit the selected band substantially through value-size thresholds.

Remediation: choose a valid state first, then derive difficulty from rule complexity, competing plausible rules, presentation burden, parameter depth and option proximity. Magnitude is not a defining mechanism.

### P1 — multi-reference numeric analogy presentation is source-confirmed but absent

Source material includes forms such as `121 : 145 :: 49 : 65 :: 169 : ?` and `18 : 26 :: 20 : ? :: 16 : 23`. The solve contract is still numeric-rule transfer; this is a presentation/state variant rather than an advanced meta-rule.

Remediation: allow a second complete reference pair in missing-term numeric analogy and support the missing pair appearing before or after that second reference while preserving one fixed rule/context.

### P1 — semantic difficulty metadata is not defensible

The semantic dataset currently assigns `EASY/MEDIUM/HARD` from list position. That is not factual familiarity and can classify a common fact as hard simply because it appears later in an array.

Remediation: remove array-position difficulty. Semantic difficulty may use explicitly curated familiarity metadata, relation subtlety, presentation burden and governed distractor proximity. Obscure trivia must not be used as a substitute for reasoning difficulty.

### P1/P2 — semantic distractor proximity needs stronger governance

Same-answer-category distractors are type-safe but can be too weakly associated with the target concept.

Remediation direction: preserve correctness-first category safety, then prefer distractors from a governed semantic neighbourhood/confusion group. Do not infer closeness from arbitrary spelling similarity.

## Confirmed source-saturation gaps

### P1 — CP-003 does not cover several source-native numeric pair families

The source corpus explicitly contains pair-transfer analogies based on:

- higher fixed powers beyond square/cube;
- exact square root;
- exact cube root, including root followed by a small adjustment;
- cube followed by subtraction;
- division of one digit by another;
- three-digit digit sum;
- three-digit digit product.

The current CP-003 registry does not model these families completely and its digit helper assumes a two-digit input.

Remediation direction: admit only source-backed bounded rule families, generalise digit extraction where the solve contract genuinely extends to more than two digits, and keep rules that require a distinct inference contract separate. Do not add arbitrary equations simply because they can be generated.

### P1 — CP-004 misses source-native set-property relations

Source material includes equivalent-set selection based on properties such as all members being prime and repeated multiplicative progression. These are set-level relations rather than ordinary one-input/one-output CP-003 transforms.

Remediation direction: add only those set-property rules that can be independently validated and yield option-independent uniqueness. Prime-set and fixed-ratio progression are first admission candidates.

### P1 — semantic source coverage is narrower than the master blueprint and modern SSC evidence

The master blueprint requires a curated semantic relationship library broader than the current CP-001/002 inventory. Modern SSC also includes institution/content analogies such as `Library : Books :: Museum : Artefacts`.

Candidate source-backed relations for admission/compression include:

- institution/place → collection/content;
- individual/entity → dwelling;
- activity/game → venue;
- performer/worker → action;
- tool → action;
- paired objects;
- cause → effect;
- problem/state → remedy/action;
- sport → equipment;
- disease → affected organ;
- author → work;
- shape → number of sides.

Not every traditional static-GK relation in old preparation books should become a permanent QL. Country-national-fruit, country-parliament, cremation-ground and similar fact lists must be screened for current target-exam value, factual stability and overlap with Static GK before admission.

### P1 — modern semantic fixtures must be reproducible without memorised one-off questions

The system must be able to generate the relationship class behind modern fixtures, not merely copy the exact PYQ. For example, `Library : Books :: Museum : Artefacts` should come from an institution/content relation reservoir, while `Phone : Talk :: Television : View` should come from a governed object/function relation reservoir.

## CP-009 ownership decision during remediation

The previous CP-009 research boundary correctly established that simply showing three complete pairs does not create a new advanced rule. It also quarantined genuinely changing-vector/meta-rule fixtures that were ambiguous without answer-option dependence.

Therefore:

- ordinary source gaps must stay with the underlying semantic/numeric/set authority;
- the provisional `251..274` window may be re-planned because no permanent CP-009 QL has ever been allocated;
- no advanced/meta fixture is admitted until it is option-independently unique;
- final permanent allocation is deferred until the source-gap runtime prototypes and compression audit are reviewed.

## Open integration gate

Exam-profile presentation control remains a Reasoning-wide release requirement. SSC-style four-option presentation, Banking option profiles, allowed layouts and stem conventions must ultimately be selected by the target exam profile rather than randomized inside a chapter.

## Validation required before approval

1. deterministic replay for every retained and newly admitted solve authority;
2. one and only one correct option;
3. independent-solver parity;
4. no distractor valid under the intended rule;
5. misconception-label truthfulness;
6. all difficulty bands reachable only for structurally justified reasons;
7. source-style multi-reference stems generated without inventing a meta-rule;
8. answer-position balance;
9. EN/HI/PA parity for every changed learner-facing field;
10. large-batch duplicate/fingerprint audit;
11. explicit source-to-runtime matrix for all admitted/rejected source families;
12. no permanent ID allocation until the compression audit proves that a new QL represents a distinct exam contract rather than a parameter or wording variant.
