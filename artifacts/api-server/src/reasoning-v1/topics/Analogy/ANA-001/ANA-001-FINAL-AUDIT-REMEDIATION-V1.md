# ANA-001 Final Audit Remediation V1

Status: `IN_REMEDIATION_REVIEW_ONLY`

This checkpoint converts the final Reasoning V1 audit findings for Analogy into a controlled remediation pass before the chapter is reconsidered for release.

## Safety boundary

- Existing permanent IDs `ANA-QL-001..250` remain unchanged.
- No public/test/mock eligibility is enabled here.
- No Question Bank publication is implied.
- Remediation is performed on a dedicated review branch and must be reviewed before merge.

## Confirmed findings

### P1 — ANA-CP-003 numeric distractors are value-near rather than misconception-derived

The frozen generator creates wrong answers mainly by adding/subtracting small deltas from the correct value. This does not model the mistakes a learner actually makes while applying the relation.

Remediation: derive distractors from rule-specific wrong operations such as wrong sign, omitted stage, wrong multiplier/divisor, wrong square/cube choice, wrong digit operation, or wrong predecessor/successor direction. Retain a bounded fallback only when three distinct misconception outputs cannot be constructed.

### P1 — ANA-CP-003 difficulty is declared by rule order instead of generated-instance evidence

The QL registry groups difficulty by rule index. This is not sufficient for Question Studio difficulty selection.

Remediation: generated questions receive an explicit instance difficulty derived from rule complexity, transformation depth, parameter count, inference/presentation burden and distractor proximity. Number magnitude must not be the primary reason for `HARD`.

### P1 — ANA-CP-004 difficulty is seed-selected and then magnitude-filtered

The current runtime chooses `EASY/MEDIUM/HARD` from `seed % 3` and tries to make the requested band fit mainly through input/output magnitude thresholds.

Remediation: choose a valid state first, then derive difficulty from rule complexity, competing plausible rules, presentation burden, parameter depth and option proximity. Magnitude may be a minor tie-breaker only, not the defining mechanism.

### P1 — multi-reference numeric analogy presentation is source-confirmed but absent

Source material includes forms such as `121 : 145 :: 49 : 65 :: 169 : ?` and `18 : 26 :: 20 : ? :: 16 : 23`. The solve contract is still numeric-rule transfer; this should be a presentation/state variant rather than a new permanent QL.

Remediation: allow a second complete reference pair in missing-term numeric analogy and support the missing pair appearing before or after that second reference while preserving a single rule/context.

### P1 — early semantic difficulty metadata is not reflected in generated output

Semantic facts already carry `EASY/MEDIUM/HARD` metadata, but the generated semantic question does not expose a derived instance difficulty.

Remediation: derive the instance band from the selected source/target fact familiarity plus task/presentation burden. Do not use QL order as difficulty.

### P1/P2 — semantic distractor proximity needs stronger governance

Same-answer-category distractors are valid but can be too loosely related to the target concept.

Remediation direction: preserve correctness-first category safety, then prefer distractors from the same semantic neighbourhood/confusion group where governed metadata exists. Do not fabricate semantic closeness from arbitrary lexical similarity.

## Open integration gate

Exam-profile presentation control remains a Reasoning-wide release requirement. SSC-style four-option presentation, Banking option profiles, allowed layouts and stem conventions must ultimately be selected by the target exam profile rather than randomized inside a chapter.

## Validation required before approval

1. deterministic replay for all existing QLs;
2. one and only one correct option;
3. independent-solver parity;
4. no valid distractor under the intended rule;
5. misconception-label truthfulness;
6. all three difficulty bands reachable for structurally justified reasons;
7. multi-reference source-style stems generated without a new permanent QL;
8. answer-position balance;
9. EN/HI/PA parity for any changed learner-facing fields;
10. large-batch duplicate/fingerprint audit.
