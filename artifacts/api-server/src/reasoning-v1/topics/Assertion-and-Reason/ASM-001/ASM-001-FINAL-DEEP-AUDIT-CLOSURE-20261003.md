# ASM-001 — Final Content Deep-Audit Closure

Date: 2026-10-03

Status: `CONTENT_DEEP_AUDIT_CLOSED__1_QL__20_CURATED_SCENARIOS__EN_HI_PA__REVIEW_ONLY`

## Permanent authority

`ASM-QL-001` owns the complete Assertion-and-Reason learner contract:

1. judge Assertion (A) independently;
2. judge Reason (R) independently;
3. only if both are true, decide whether R correctly explains A;
4. select the matching answer class.

Answer classes are semantic states, not separate QLs:

- both true and R explains A;
- both true but R does not explain A;
- A true / R false;
- A false / R true;
- both false.

Four-option versus five-option coding is also presentation metadata, not QL identity.

Next available permanent identity: `ASM-QL-002`.

## Source and format evidence

The standard Assertion-and-Reason format is externally evidenced by competitive-exam question surfaces including:

- Testbook RPF Constable Assertions and Reasons, which uses the standard truth/explanation classification;
- Testbook Assertion-and-Reason examples using the four-class profile;
- Testbook examples using a five-class profile that includes “both A and R are false”.

Sources reviewed:
- https://testbook.com/questions/rpf-constable-assertions-and-reasons-questions--65fbd99585131d8702d54b86
- https://testbook.com/question-answer/assertion-and-reasonassertion-a-open-book-ex--68ff252fe976ed3d9840e7a9
- https://testbook.com/question-answer/the-question-consists-of-two-statements-an-assert--5b52ff63eff6980c425ac7e4

These sources validate the format and answer lattice. Examtree does **not** copy their question text and does not make an unsupported frequency claim for SSC, Banking or Punjab papers.

## Curated truth authority

Family C governance forbids free-form truth generation. ASM-001 therefore uses a fixed multilingual scenario corpus.

Current corpus:
- 20 curated Assertion/Reason pairs;
- all five semantic answer classes;
- Easy, Medium and Hard;
- English, Hindi and Punjabi;
- stable science/everyday-science propositions only;
- explicit truth flags and explanation-link flags;
- scenario-specific explanations.

Runtime truth is read from the curated authority and cross-checked against the answer-class lattice. No language model or uncontrolled world-knowledge call is used at generation time.

## Ownership boundary

ASM-001 owns truth/explanation classification of an explicit Assertion and explicit Reason.

It does not own:
- implicit-premise testing — STA-001;
- argument strength — ARG-001;
- action selection — COA-001;
- causal graph direction/reconstruction — CAE-001;
- logical entailment from a statement — STC-001;
- eligibility/decision rules — REAS-DCS.

A Reason may be causal, but the tested task here is whether that explicit Reason correctly explains that explicit Assertion.

## Editorial and explanation standard

Stems use the exam-natural form:

`Assertion (A): ...`
`Reason (R): ...`
`Which of the following is correct?`

Explanations:
- judge A first;
- judge R second;
- test the explanatory link only when both are true;
- state the scenario-specific factual rationale;
- identify the final option.

Generic “Directions: carefully analyse...” boilerplate is excluded.

## Lifecycle

Question Studio review generation is enabled.

Still disabled:
- Question Bank writes;
- scored tests;
- mock-test eligibility;
- public publication;
- automatic student publication.

Manual editorial/product approval remains a separate release gate.

## Result

`ASM_001_CONTENT_DEEP_AUDIT_CLOSED__ONE_NON_INFLATED_QL__TRILINGUAL_CURATED_REVIEW_ONLY`
