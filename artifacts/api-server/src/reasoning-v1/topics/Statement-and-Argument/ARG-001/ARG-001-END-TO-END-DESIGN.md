# ARG-001 — Statement & Argument End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-ARG — Statement and Argument`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`ARG-001` owns questions in which an issue, proposal, policy, decision or claim is supplied and the learner decides which candidate argument(s) are strong enough to bear materially on that issue.

Core learner task:

```text
identify the actual issue being considered
  -> determine each argument's stance and claim
  -> test relevance and logical connection
  -> test whether the reason is material rather than trivial/emotional/speculative
  -> apply argument-kind-specific quality criteria
  -> select the strong argument set
```

The chapter does not own:

- assumptions required by a supplied statement (`STA-001`);
- conclusions entailed by supplied evidence (`STC-001`);
- proposed remedial actions (`COA-001`);
- causal relation classification (`CAE-001`);
- assertion/reason truth coding (`ASM-001`).

## 2. Governing semantic doctrine

A strong argument is not simply a statement the system agrees with.

For production, a candidate is strong when it is:

- directly relevant to the issue;
- logically connected to the proposed stance;
- material enough to affect the decision;
- expressed at an appropriate scope;
- free from a disqualifying reasoning defect for its argument kind;
- grounded in scenario-authorized facts, principles or consequences rather than unrestricted external speculation.

A candidate may be weak because it is:

- irrelevant;
- trivial;
- circular;
- purely emotional;
- based on an unsupported extreme prediction;
- aimed at the wrong stakeholder;
- outside the decision's scope;
- a slogan rather than a reason;
- dependent on an unlicensed factual premise.

The engine must never encode ideological or political agreement as argument strength.

## 3. Structured-rubric principle

Argument quality is partly semantic and cannot be reduced to one universal formula.

Therefore each candidate has an `argumentKind` and is validated against a deterministic rubric for that kind.

The curated editorial verdict remains an authority used to detect model/rubric failures, but the generator may not simply copy it into the answer.

## 4. Planned checkpoint architecture

### ARG-CP-001 — Direct Relevance & Materiality

Foundation forms with a neutral issue and clearly pro/con candidate reasons.

Tests:

- direct relevance;
- issue alignment;
- non-triviality;
- stance consistency;
- obvious irrelevant/emotional traps.

### ARG-CP-002 — Consequence & Public/Stakeholder Impact Arguments

Source-backed arguments about expected effects on:

- users;
- employees;
- institutions;
- costs/time;
- service quality;
- safety;
- access;
- efficiency.

A consequence is strong only when the scenario authorizes the causal/relevance bridge needed to connect it to the issue.

### ARG-CP-003 — Feasibility, Practicality & Resource Arguments

Candidates concerning:

- implementation feasibility;
- resource burden;
- operational capacity;
- timing;
- enforceability;
- scalability;
- administrative practicality.

A practical objection must materially affect the proposed decision, not merely mention cost or difficulty.

### ARG-CP-004 — Evidence, Generalisation & Risk Arguments

Controlled forms involving:

- evidence adequacy;
- representative versus narrow evidence;
- bounded risk;
- uncertainty;
- overgeneralisation;
- unsupported causal prediction.

This checkpoint exists to produce realistic hard distractors without using changing real-world facts.

### ARG-CP-005 — Principle / Fairness / Rule-Consistency Arguments

Source-backed neutral cases where an argument rests on an explicit institutional principle such as:

- equal treatment under a supplied rule;
- consistency of an announced policy;
- transparent process;
- role responsibility;
- stated eligibility criteria.

Do not infer political, religious or ideological values. The relevant principle must be part of the controlled scenario contract.

### ARG-CP-006 — Multi-Argument & Coded Presentation

Formats:

- Arguments I and II;
- I, II and III;
- only I / only II / both / neither;
- source-backed coded combinations;
- source-backed strong/weak inversion queries.

Presentation variants do not create new strength semantics.

## 5. Canonical issue contract

```ts
interface ArgIssue {
  issueId: string;
  sourceProfile: string;
  question: LogicProposition;
  decisionTarget: string;
  affectedStakeholders: readonly string[];
  authorizedFacts: readonly LogicProposition[];
  authorizedPrinciples: readonly ArgPrinciple[];
  candidates: readonly ArgCandidate[];
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Candidate contract

```ts
interface ArgCandidate {
  candidateId: string;
  stance: "FOR" | "AGAINST";
  argumentKind:
    | "DIRECT_BENEFIT"
    | "DIRECT_HARM"
    | "FEASIBILITY"
    | "RESOURCE"
    | "RISK"
    | "EVIDENCE"
    | "PRINCIPLE"
    | "FAIRNESS"
    | "PROCESS_CONSISTENCY";
  claim: LogicProposition;
  supportRefs: readonly string[];
  editorialVerdict: "STRONG" | "WEAK";
  defectTags: readonly ArgDefect[];
}
```

## 6. Argument-strength oracle

For each candidate the oracle evaluates:

1. **issue relevance** — does the argument bear directly on the decision target?
2. **stance coherence** — would the stated reason actually support/oppose the stated side?
3. **authorized support** — are required premises present in the controlled scenario?
4. **materiality** — is the effect/principle significant enough to matter?
5. **scope fit** — stakeholder, timeframe and target match?
6. **defect audit** — does an argument-kind-specific fatal defect apply?

Conceptual result:

```text
candidate ARG-A-021
kind: FEASIBILITY
relevance: PASS
stance: PASS
support: PASS
materiality: PASS
scope: PASS
fatalDefects: none
result: STRONG
```

The oracle must emit a reason code and support references.

## 7. Argument-kind-specific rules

### Consequence arguments

Require an authorized effect link and material consequence. Mere possibility is insufficient.

### Feasibility/resource arguments

Require a constraint that materially affects implementation. "It may cost something" is not automatically strong.

### Risk arguments

Require plausible, scenario-authorized risk with meaningful severity or likelihood. Catastrophic speculation without support is weak.

### Evidence arguments

Require the evidence quality claim to directly affect confidence in the issue. Narrow anecdote or unrelated statistic is weak.

### Principle arguments

Require the principle to be explicitly authorized and relevant to the decision. Generic moral slogans are not production authority.

## 8. Defect / misconception taxonomy

```text
IRRELEVANT_TO_ISSUE
TRIVIAL_POINT
EMOTIONAL_APPEAL
PERSONAL_PREFERENCE
CIRCULAR_REASONING
UNSUPPORTED_FACT
UNSUPPORTED_CAUSAL_PREDICTION
EXTREME_SPECULATION
WRONG_STAKEHOLDER
WRONG_SCOPE
WRONG_TIMEFRAME
STANCE_MISMATCH
WEAK_ANALOGY
ANECDOTE_OVERGENERALISATION
SLOGAN_NOT_REASON
RESOURCE_POINT_NOT_MATERIAL
PRINCIPLE_NOT_AUTHORIZED
CONSEQUENCE_TOO_REMOTE
FALSE_DILEMMA
```

Wrong candidates should be realistic reasons someone might offer, not nonsense filler.

## 9. Candidate-set and answer construction

Default two-argument semantic outcomes:

```text
ONLY_I
ONLY_II
BOTH
NEITHER
```

Across review corpora, answer distribution must be balanced and candidates must not reveal strength through length, formality or vocabulary.

The engine must test:

- option-set uniqueness;
- no duplicate semantic answer code;
- no candidate whose stance label contradicts its wording;
- no automatic bias that "for" arguments are stronger than "against" arguments or vice versa.

## 10. Renderer

Renderer: `STRUCTURED_TEXT`.

Canonical layout:

```text
Statement/Issue: ...

Arguments:
I. ...
II. ...
```

Where source conventions use a question such as "Should ...?", preserve the interrogative issue separately from the candidate reason text.

## 11. Explanation architecture

For each argument, explanations should answer two questions:

1. Does this point directly matter to the stated issue?
2. Is the reason strong enough, on the supplied scenario, to affect the decision?

Example style:

```text
Argument I is strong because it directly addresses whether the proposed service can be implemented with the available capacity.

Argument II is weak. It expresses a preference about an unrelated feature and does not affect the decision being asked about.

Therefore, only Argument I is strong.
```

Never write "Argument I is strong because it is true" unless the truth and relevance link are explicitly shown.

## 12. Difficulty model

Primary levers:

- closeness of relevant and irrelevant candidates;
- hidden support burden;
- causal/evidence subtlety;
- stakeholder/scope overlap;
- materiality judgement;
- number of candidates;
- presence of near-valid but defective argument;
- negative query form;
- linguistic density.

### Easy
- one directly material argument;
- one obviously irrelevant/emotional distractor.

### Medium
- both candidates relevant to the topic but only one materially addresses the decision;
- one feasibility/scope trap.

### Hard
- both arguments superficially strong;
- subtle evidence, remoteness or unsupported-causation defect;
- three-argument source-backed combination.

## 13. Localization

Localization must preserve:

- issue target;
- stance;
- support relation;
- consequence strength;
- modality (may/will/must);
- scope;
- candidate numbering;
- answer set.

Hindi/Punjabi wording should avoid accidentally strengthening a weak candidate through words equivalent to "definitely" or weakening a strong one through "perhaps" unless the semantic contract contains that modality.

## 14. Source-saturation protocol

Before permanent QLs:

```text
collect representative source patterns
-> classify issue type + argument kind + answer format
-> executable temporary prototypes
-> pro/con symmetry audit
-> weak-defect coverage audit
-> cross-chapter boundary audit with STA/COA/CAE
-> merge/split review
-> no-known-gap decision
-> permanent QL proposal
```

## 15. QA gates

Required:

- deterministic generation;
- oracle/editorial parity;
- pro/against symmetry;
- relevance mutation tests;
- stakeholder/scope mutation tests;
- unsupported-fact injection tests;
- defect coverage;
- balanced strong/weak outcomes;
- option uniqueness;
- explanation grounding;
- localization parity;
- neutral-domain/persuasion safety audit.

## 16. Question Studio contract

Post-freeze filters may include:

- checkpoint / QL;
- exam profile;
- difficulty;
- issue type;
- argument kind;
- stance mix;
- candidate count;
- weak-defect family;
- seed.

Admin metadata should expose support references, defect tags, rubric evidence and source authority.

## 17. Lifecycle

```text
maturity:                    DESIGN_AUTHORITY_PRE_IMPLEMENTATION
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

Next implementation step after family design freeze: implement issue/candidate types, argument-kind rubrics and executable ARG-CP-001 discovery scenarios.
