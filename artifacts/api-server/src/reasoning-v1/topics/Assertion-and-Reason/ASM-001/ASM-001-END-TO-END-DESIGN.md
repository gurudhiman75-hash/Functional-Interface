# ASM-001 — Assertion & Reason End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-ASM — Assertion and Reason`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`ASM-001` owns questions containing an Assertion (A) and a Reason (R) where the learner must judge:

1. whether A is true under the supplied/authorized knowledge context;
2. whether R is true under that context; and
3. when both are true, whether R correctly explains A.

Core learner task:

```text
evaluate Assertion truth
  -> evaluate Reason truth independently
  -> if both are true, test explanatory connection
  -> distinguish explanation from mere association/restatement
  -> map the semantic result to the source-backed option code
```

The chapter does not own:

- generic conclusion entailment (`STC-001`);
- hidden assumptions (`STA-001`);
- strength of arguments (`ARG-001`);
- suitable courses of action (`COA-001`);
- ordinary cause/effect classification where proposition truth is not independently tested (`CAE-001`).

## 2. Governing semantic doctrine

Assertion & Reason has **two independent truth tests plus one explanation-link test**.

The engine must never infer:

```text
R explains A -> therefore R is true
```

or:

```text
A and R are both true -> therefore R explains A
```

The explanation relation is a separate semantic edge.

## 3. Truth authority

Production truth must come from one of two approved authorities:

### 3.1 Self-contained scenario authority

The question supplies enough controlled information, definitions or rules to establish A/R truth without outside knowledge.

Preferred for Reasoning production.

### 3.2 Curated stable-knowledge authority

Source-backed patterns may use a reviewed fact/principle registry where the content is stable and suitable for the target exam.

Such facts require:

- stable ID;
- domain owner;
- source/verification metadata;
- locale-safe wording;
- review status;
- version/freshness policy where applicable.

Unrestricted runtime world knowledge is prohibited.

## 4. Planned checkpoint architecture

### ASM-CP-001 — Self-Contained Rule -> Assertion/Reason

Foundation forms where a supplied rule or scenario allows independent truth evaluation.

Tests:

- A true / R true with explanation;
- A true / R true without explanation;
- one false proposition;
- direct rule-to-instance reasoning;
- no outside fact dependency.

### ASM-CP-002 — Definition, Property & Principle Explanation

Controlled source-backed forms where:

- R states the defining/property reason for A;
- R states a relevant property but does not explain A;
- A overstates the supplied definition;
- R uses the wrong scope or condition.

### ASM-CP-003 — Causal / Mechanistic Explanation

Both propositions may be true, but R explains A only when an authorized mechanism connects them in the correct direction.

This checkpoint shares causal graph utilities with CAE but retains separate truth evaluation.

### ASM-CP-004 — Conditional, Comparative & Rule-Application Forms

Controlled patterns involving:

- condition -> outcome;
- required condition;
- comparative property;
- rule application to a stated case;
- exception or boundary condition.

The engine must distinguish a rule that merely accompanies A from one that actually explains why A holds.

### ASM-CP-005 — True-but-Not-Explanation & Near-Link Adversarial Forms

Hard cases where both propositions are individually true but the explanation edge fails because R is:

- merely related;
- a consequence rather than cause/reason;
- too general;
- too narrow;
- in the wrong direction;
- a restatement without explanatory force;
- a common effect of another proposition.

This checkpoint is essential because "both true" must not collapse into "R explains A".

### ASM-CP-006 — Source-Specific Coding & Multi-Option Presentation

Supports source-backed option profiles such as four- or five-code formats.

Potential internal semantic states:

```text
A_TRUE_R_TRUE_EXPLAINS
A_TRUE_R_TRUE_NOT_EXPLAINS
A_TRUE_R_FALSE
A_FALSE_R_TRUE
A_FALSE_R_FALSE
```

A source profile may expose four states and omit/collapse the fifth. Permanent mappings require source evidence.

## 5. Canonical contract

```ts
interface AsmScenario {
  scenarioId: string;
  sourceProfile: string;
  truthAuthority: "SELF_CONTAINED" | "CURATED_STABLE_KNOWLEDGE";
  contextPropositions: readonly LogicProposition[];
  assertion: AsmPropositionRef;
  reason: AsmPropositionRef;
  explanationEdges: readonly AsmExplanationEdge[];
  answerProfile: AsmAnswerProfile;
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Proposition reference

```ts
interface AsmPropositionRef {
  propositionId: string;
  proposition: LogicProposition;
  truthProofRefs: readonly string[];
  editorialTruth: "TRUE" | "FALSE";
}
```

### 5.2 Explanation edge

```ts
interface AsmExplanationEdge {
  fromReasonId: string;
  toAssertionId: string;
  relation:
    | "DEFINITIONAL"
    | "CAUSAL"
    | "MECHANISTIC"
    | "RULE_JUSTIFICATION"
    | "NECESSARY_CONDITION"
    | "PROPERTY_JUSTIFICATION";
  supportRefs: readonly string[];
}
```

## 6. Independent truth-and-explanation oracle

The oracle performs three passes.

### Pass A — Assertion truth

- normalize A;
- evaluate against self-contained closure or curated fact authority;
- return TRUE/FALSE with proof.

### Pass B — Reason truth

- evaluate R independently using the same authority rules;
- do not condition R truth on A truth.

### Pass C — Explanation link

Only if A and R are both true:

1. look for an authorized R -> A explanation edge;
2. verify direction;
3. verify scope and condition alignment;
4. reject mere coexistence, correlation or reverse explanation;
5. map result to the source answer profile.

Conceptual trace:

```text
A truth: TRUE [proof P2,P4]
R truth: TRUE [proof P1]
R -> A explanation edge: none
semanticResult: A_TRUE_R_TRUE_NOT_EXPLAINS
```

The generator may not copy curated truth labels directly into the final answer without oracle parity.

## 7. Explanation versus entailment

An R may entail A without being the intended explanatory reason in every domain, and an explanatory reason may rely on an authorized causal/mechanistic relation rather than pure formal implication.

Therefore ASM must not call the STC entailment oracle as its only explanation test.

It may reuse proposition normalization and closure utilities, but `explains(R,A)` is a distinct relation.

## 8. Relationship to Cause & Effect

CAE asks primarily:

```text
what causal relation exists between displayed events?
```

ASM asks:

```text
is A true?
is R true?
if both are true, does R explain A?
```

The same causal graph utility may support both, but CAE relation codes cannot substitute for ASM truth/explanation coding.

## 9. Misconception taxonomy

```text
BOTH_TRUE_ASSUMED_EXPLANATORY
REVERSE_EXPLANATION
CORRELATION_AS_EXPLANATION
CONSEQUENCE_AS_REASON
RESTATEMENT_NOT_EXPLANATION
TRUE_BUT_IRRELEVANT_REASON
FALSE_ASSERTION_SCOPE_SHIFT
FALSE_REASON_SCOPE_SHIFT
QUANTIFIER_STRENGTHENING
CONDITION_DIRECTION_ERROR
EXCEPTION_IGNORED
COMMON_CAUSE_CONFUSED_WITH_EXPLANATION
OUTSIDE_KNOWLEDGE
FACT_REGISTRY_MISMATCH
```

## 10. Answer-profile architecture

The internal semantic result is independent of option wording/order.

A typical four-code profile may distinguish:

- both true and R explains A;
- both true but R does not explain A;
- A true, R false;
- A false, R true.

A five-code profile may additionally include both false.

Exact wording/order must be source-profile metadata, not globally hard-coded.

## 11. Renderer

Renderer: `STRUCTURED_TEXT`.

Canonical layout:

```text
Assertion (A): ...
Reason (R): ...
```

Directions/options are rendered from the selected answer profile.

Labels A and R must remain stable across locales even when full words are localized according to source convention.

## 12. Explanation architecture

The explanation should always evaluate A and R separately before discussing the link.

Preferred structure:

```text
Assertion: True, because ...

Reason: True, because ...

However, the Reason does not explain why the Assertion is true; it states a separate fact about the same situation.

Therefore, both A and R are true, but R is not the correct explanation of A.
```

When one proposition is false, explain the decisive false feature and do not waste text evaluating an explanation link that is semantically inapplicable.

## 13. Difficulty model

Primary levers:

- truth-proof depth;
- similarity between A and R;
- explanation-edge subtlety;
- causal direction;
- condition/exception handling;
- quantifier/scope subtlety;
- true-but-not-explanation proximity;
- answer-profile complexity;
- external fact burden where source-backed;
- linguistic density.

### Easy
- self-contained direct rule;
- one proposition clearly false or direct explanation edge.

### Medium
- both true with a clear but non-explanatory relation;
- one scope/condition trap.

### Hard
- both propositions plausible and true with subtle explanation failure;
- reverse/common-cause trap;
- source-backed stable-knowledge item with tightly controlled wording.

## 14. Stable-knowledge governance

If source saturation proves that external subject knowledge is necessary for meaningful exam coverage:

- keep knowledge datasets modular by domain;
- do not place volatile office holders, laws or current affairs in stable packs;
- require verification metadata;
- separate factual review from reasoning-engine review;
- allow a domain owner to disable stale facts without changing QL identity;
- ensure Hindi/Punjabi translations do not alter factual precision.

Until that audit is complete, self-contained patterns are preferred.

## 15. Localization

Localization must preserve:

- truth conditions;
- quantifier and scope;
- condition direction;
- causal/explanatory relation;
- certainty/modality;
- A/R identity;
- answer-profile code.

Translations must not add connectives equivalent to "because" when the semantic model does not contain an explanation relation.

## 16. Source-saturation protocol

Before permanent QLs:

```text
collect representative source patterns
-> classify truth-authority type + explanation relation + answer profile
-> determine whether external stable knowledge is actually required
-> executable temporary prototypes
-> all semantic outcome coverage audit
-> true-but-not-explanation adversarial audit
-> CAE/STC ownership audit
-> merge/split review
-> no-known-gap decision
-> permanent QL proposal
```

## 17. QA gates

Required:

- deterministic generation;
- independent A truth test;
- independent R truth test;
- explanation-edge independence;
- all semantic outcome coverage;
- reverse explanation tests;
- true-but-not-explanation tests;
- condition/scope mutation tests;
- answer-profile mapping tests;
- option uniqueness;
- explanation grounding;
- localization parity;
- fact freshness tests for any external registry.

## 18. Question Studio contract

Post-freeze filters may include:

- checkpoint / QL;
- exam profile;
- difficulty;
- truth-authority type;
- explanation relation;
- semantic outcome;
- answer profile;
- knowledge domain where applicable;
- seed.

Admin metadata should expose truth proofs, explanation edge, fact authority/version and source evidence.

## 19. Lifecycle

```text
maturity:                    DESIGN_AUTHORITY_PRE_IMPLEMENTATION
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

Next implementation step after family design freeze: implement independent truth evaluation + explanation-link oracle and executable ASM-CP-001 discovery scenarios.
