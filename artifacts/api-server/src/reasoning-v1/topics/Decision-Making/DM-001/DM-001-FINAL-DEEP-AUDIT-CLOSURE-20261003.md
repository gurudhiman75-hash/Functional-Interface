# DM-001 — Final Content Deep-Audit Closure

Date: 2026-10-03

Status: `CONTENT_DEEP_AUDIT_CLOSED__DM_001_TO_020__60_QLS__650_SCENARIO_AUTHORITIES__EN_HI_PA__REVIEW_ONLY`

## Scope

`DM-001` is the standalone Reasoning V1 implementation of `REAS-DCS — Decision Making / Eligibility`.

It contains 20 checkpoints:
- DM-001..010: rule-based eligibility, boundary, exception, referral, benefit, cut-off, relaxation and ranked-allocation decisions;
- DM-011..016: administrative, immediate-action, grievance, workplace, public-service and resource-priority decisions;
- DM-017..020: explicit precedence, incomplete information, multi-person decision sets and mixed advanced sets.

## Source posture

Official SSC syllabus material explicitly includes `judgment` and `decision making` inside General Intelligence & Reasoning.

Classic eligibility-test sources support:
- multiple mandatory conditions;
- age/cut-off-date checks;
- exception rules;
- referral to a designated authority;
- insufficient/incomplete information;
- no-assumption rule application.

Reviewed source examples include:
- SSC CGL official syllabus;
- Embibe eligibility-test / Senior Manager-Credit example;
- competitive-exam eligibility-test references covering direct eligibility, referral and boundary cases.

Administrative/situational CP011..016 are governed Decision-Making extensions. They are not claimed to occur at a fixed SSC/Banking/Punjab frequency. Their answer authority comes from explicit scenario principles and deterministic action-ordering metadata, not free-form moral judgment.

## Breadth after remediation

Current scenario authority:
- DM-CP-001..010: 25 scenarios each = 250;
- DM-CP-011..016: 50 scenarios each = 300;
- DM-CP-017..020: 25 scenarios each = 100;
- total = 650.

The default Question Studio mixed sampler was previously misleading because it walked contiguous QLs and could make a review batch appear almost entirely recruitment/eligibility based.

Final remediation uses a stratified checkpoint order. Every normal 20-question mixed review now covers all 20 checkpoints once before repeating QL variants. Eligibility, situational action, explicit priority, incomplete-data and set-based decision forms therefore appear in the same review batch.

## Stem-language remediation

Removed or gated from learner-facing generation:
- machine-like meta prompts such as “Which result is supported by the information given?”;
- the previously reviewed awkward age-relaxation wording;
- generic `Directions:` boilerplate;
- unnecessary “check each condition first” instructions in the question prompt.

Rule-based items now use:
1. direct context sentence;
2. stated conditions;
3. special provision only where applicable;
4. case details;
5. concise exam-style decision question.

## Solver and answer authority

Eligibility and advanced decision questions use structural rule objects and deterministic evaluation.

The solver:
- evaluates every base condition independently;
- distinguishes PASS / FAIL / UNKNOWN;
- applies exception/referral rules in explicit priority order;
- does not treat missing information as automatically material when a failed mandatory condition already decides the case;
- calculates age on the specified date where required;
- performs explicit ranking/tie-break ordering for limited-seat decisions;
- independently evaluates every profile in multi-person sets.

Situational questions use explicit principles, approved action choices and deterministic solver selection. Free-form answer generation is not allowed.

## QL-boundary audit

The permanent registry remains `DM-QL-001..060`.

No additional QL is admitted by this final audit.

The registry intentionally separates governed rule families even where they share a solver primitive. Answer outcomes such as SELECT, REJECT, referral and information-required are semantic states, not separate QLs. Wording, object/context, option order, candidate values, language and difficulty are instance variation.

Future source evidence may justify consolidation or additive identities only through an explicit migration/source audit; this closure does not create speculative QLs.

## Localization

English, Hindi and Punjabi generation share the same canonical scenario/rule authority.

Final audit checks:
- all 650 authorities contain non-empty trilingual context;
- every permanent QL generates in all three languages;
- Hindi/Punjabi learner surfaces contain the expected scripts;
- options remain unique in every language;
- the correct index remains valid after localization.

## Difficulty

Easy, Medium and Hard are generated from explicit candidate modes / rule paths.

Difficulty is not relabelled after generation.

Examples:
- direct/boundary pass: Easy;
- single failure, document referral or material missing field: Medium;
- ordered exceptions, combined relaxation, difficult referral, advanced precedence or determined failure with missing data: Hard.

## Lifecycle

Question Studio is review-only.

Still locked:
- Question Bank writes;
- test eligibility;
- mock-test eligibility;
- public publication;
- automatic student publication.

Manual editorial/product release remains separate.

## Result

`DM_001_FINAL_DEEP_AUDIT_CLOSED__SOURCE_BACKED_CORE__STRATIFIED_BREADTH__TRILINGUAL__REVIEW_ONLY`
