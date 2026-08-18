# COA-001 — Course of Action End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-COA — Course of Action`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`COA-001` owns questions in which a problem, undesirable situation, risk, need or institutional objective is supplied and the learner judges which proposed course(s) of action are sensible responses.

Core learner task:

```text
identify the actual problem and desired outcome
  -> understand what each proposed action would do
  -> test relevance and causal mechanism
  -> test feasibility, agency and proportionality
  -> reject excessive, unrelated, impossible or unsupported responses
  -> select the suitable action set
```

The chapter does not own:

- assumptions behind an already supplied recommendation (`STA-001`);
- reasons for/against whether a policy should be adopted (`ARG-001`);
- conclusions logically entailed by a statement (`STC-001`);
- causal classification of supplied events (`CAE-001`);
- truth/explanation coding (`ASM-001`).

## 2. Governing semantic doctrine

A valid course of action is a **reasonable and relevant response to the supplied problem**, not necessarily a guaranteed complete solution.

A candidate normally needs:

- direct relevance to the stated problem or objective;
- a controlled mechanism by which it can improve the situation;
- plausible agency — the stated actor/institution can reasonably take it;
- practical feasibility within the scenario;
- proportionality to the problem;
- no dependence on an unsupported factual premise that is essential to the action;
- no obvious self-defeating effect under the supplied context.

A course may be valid even if it addresses only part of the problem, provided that partial response is materially useful and source conventions permit it.

## 3. Action suitability is not argument strength

The candidate itself is an action, not a reason.

Example distinction:

```text
"The proposal will reduce waiting time" -> possible ARG reason
"Open an additional service counter during peak hours" -> possible COA action
```

The COA oracle evaluates action fitness against the problem, not rhetorical strength.

## 4. Planned checkpoint architecture

### COA-CP-001 — Direct Corrective Actions

Foundation scenarios where a present problem has one or more immediate remedial responses.

Tests:

- direct problem targeting;
- actor/agency fit;
- obvious irrelevant actions;
- excessive-response traps;
- partial but useful remedy.

### COA-CP-002 — Preventive & Risk-Reduction Actions

Source-backed scenarios where the action aims to prevent recurrence or reduce future risk.

Relations:

- preventive control;
- maintenance/checking;
- procedural safeguard;
- access/safety improvement;
- capacity planning;
- risk communication.

The action must target an authorized risk pathway rather than a speculative cause.

### COA-CP-003 — Investigation, Verification & Information-Gathering Actions

Cases where acting immediately on uncertain information would be premature and a suitable first response is to:

- inspect;
- verify;
- collect data;
- identify affected cases;
- determine cause;
- audit a process.

Information gathering is valid only when uncertainty is materially relevant; "investigate everything" is not automatically sensible.

### COA-CP-004 — Administrative, Service & Process Actions

Institutional scenarios involving:

- staffing/capacity;
- scheduling;
- workflow;
- communication;
- training;
- escalation;
- service access;
- procedural correction.

Agency and implementation scope are first-class validation dimensions.

### COA-CP-005 — Complementary, Sequential & Alternative Actions

Advanced controlled forms where:

- two actions are both independently useful;
- one action is a prerequisite for another;
- two actions complement each other;
- two actions are alternative valid responses;
- one apparently useful action conflicts with another or with the goal.

Combination semantics must be stored explicitly; do not infer "both" merely because each sentence sounds reasonable in isolation.

### COA-CP-006 — Multi-Action & Source-Specific Presentation

Formats:

- Courses I and II;
- I, II and III;
- only I / only II / both / neither;
- source-backed coded combinations;
- source-backed negative query forms.

This checkpoint validates presentation and answer-set composition, not new action semantics.

## 5. Canonical problem contract

```ts
interface CoaScenario {
  scenarioId: string;
  sourceProfile: string;
  problemState: readonly LogicProposition[];
  desiredOutcomes: readonly CoaGoal[];
  authorizedActors: readonly CoaActor[];
  knownConstraints: readonly LogicProposition[];
  mechanismGraph: readonly CoaMechanism[];
  actions: readonly CoaCandidateAction[];
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Action contract

```ts
interface CoaCandidateAction {
  actionId: string;
  actorRef: string;
  actionType:
    | "CORRECTIVE"
    | "PREVENTIVE"
    | "INVESTIGATIVE"
    | "INFORMATIONAL"
    | "CAPACITY"
    | "PROCESS_CHANGE"
    | "TRAINING"
    | "ESCALATION"
    | "MONITORING";
  targetRefs: readonly string[];
  intendedGoalRefs: readonly string[];
  mechanismRefs: readonly string[];
  editorialVerdict: "FOLLOWS" | "DOES_NOT_FOLLOW";
  defectTags: readonly CoaDefect[];
}
```

`FOLLOWS` here means "follows as a suitable course of action" according to the source convention, not logical entailment in the STC sense.

## 6. Independent action-suitability oracle

For each action:

1. identify the problem component(s) targeted;
2. verify the stated actor has plausible authority/capability;
3. locate an authorized mechanism from action to desired outcome;
4. test feasibility under known constraints;
5. test proportionality;
6. test whether the action depends on an unsupported essential premise;
7. test for self-defeating conflict or obvious collateral contradiction;
8. emit a suitability verdict with evidence.

Conceptual trace:

```text
action: COA-A-018
problemTarget: queue_delay
actorFit: PASS
mechanism: add_peak_capacity -> reduce_queue_delay
feasibility: PASS
proportionality: PASS
fatalDefects: none
result: FOLLOWS
```

## 7. Defect / misconception taxonomy

```text
IRRELEVANT_ACTION
WRONG_PROBLEM_TARGET
AGENCY_MISMATCH
IMPRACTICAL_UNDER_CONTEXT
DISPROPORTIONATE_RESPONSE
EXTREME_OR_PUNITIVE_OVERREACH
UNSUPPORTED_CAUSAL_ASSUMPTION
UNSUPPORTED_FACT_DEPENDENCY
TOO_BROAD_TO_BE_ACTIONABLE
TOO_NARROW_TO_MATERIALLY_HELP
PREMATURE_ACTION_BEFORE_REQUIRED_VERIFICATION
DELAY_WHEN_IMMEDIATE_ACTION_REQUIRED
TREATS_SYMPTOM_WHEN_SOURCE_REQUIRES_CAUSE_CONTROL
SELF_DEFEATING_ACTION
WRONG_STAKEHOLDER
WRONG_TIMEFRAME
DUPLICATE_ACTION_REPHRASE
```

Avoid unsafe or harmful real-world prescriptions. Production scenarios should remain neutral and exam-style.

## 8. Complementarity and sequencing

For multi-action scenarios, store relations such as:

```text
INDEPENDENTLY_VALID
COMPLEMENTARY
ACTION_B_REQUIRES_ACTION_A
MUTUALLY_EXCLUSIVE_ALTERNATIVES
ACTION_B_CONFLICTS_WITH_ACTION_A
```

The answer-set builder must evaluate the combination relation, not just two isolated booleans when the source pattern makes interdependence relevant.

## 9. Candidate-set and option construction

Default two-action outcomes:

```text
ONLY_I
ONLY_II
BOTH
NEITHER
```

Required audits:

- no answer-position bias;
- no systematic preference for "do something" over "investigate";
- no systematic preference for harsher action;
- no option duplication after localization;
- candidate wording should not reveal correctness through excessive detail.

## 10. Renderer

Renderer: `STRUCTURED_TEXT`.

Canonical layout:

```text
Statement/Problem: ...

Courses of Action:
I. ...
II. ...
```

Actors and actions must remain grammatically explicit. Translation must not accidentally change who is authorized to act.

## 11. Explanation architecture

For each action, explanations should state:

- what problem it targets;
- how it could improve the situation;
- whether the actor can reasonably take it;
- the decisive reason for rejection if invalid.

Example style:

```text
Course I follows because the problem is excess demand during a specific peak period, and adding temporary capacity directly addresses that bottleneck.

Course II does not follow because it concerns an unrelated service and would not reduce the stated delay.

Therefore, only Course I follows.
```

Avoid "I is practical, II is impractical" without applying the scenario.

## 12. Difficulty model

Primary levers:

- number of problem components;
- directness of mechanism;
- agency subtlety;
- need for verification before intervention;
- proportionality trap;
- complementary/sequential actions;
- number of constraints;
- candidate closeness;
- negative query;
- number of actions.

### Easy
- obvious direct remedy versus unrelated action.

### Medium
- both actions relevant to topic but one fails agency, feasibility or proportionality.

### Hard
- investigation-versus-intervention timing;
- complementary/sequential action relation;
- two plausible actions where one rests on an unsupported causal premise;
- three-action source-backed combinations.

## 13. Localization

Localization must preserve:

- problem severity;
- actor identity and authority;
- action modality (should/can/must);
- intended outcome;
- causal mechanism;
- temporal sequence;
- answer set.

Hindi/Punjabi wording must avoid converting a recommendation into a legal/mandatory command or vice versa unless the semantic model specifies it.

## 14. Source-saturation protocol

Before permanent QLs:

```text
collect representative exam patterns
-> classify problem type + action type + answer format
-> executable temporary prototypes
-> corrective/preventive/investigative coverage audit
-> complementarity/sequencing audit
-> cross-chapter STA/ARG/CAE ownership audit
-> reject unsupported generator inventions
-> merge/split review
-> no-known-gap decision
-> permanent QL proposal
```

## 15. QA gates

Required suites:

- deterministic generation;
- oracle/editorial parity;
- problem-target mutation tests;
- actor/agency mutation tests;
- feasibility/constraint mutation tests;
- proportionality adversarial tests;
- unsupported-cause injection tests;
- sequence/complementarity tests;
- answer-set balance;
- option uniqueness;
- explanation grounding;
- localization parity;
- safety/content-domain audit.

## 16. Question Studio contract

Post-freeze filters may include:

- checkpoint / QL;
- exam profile;
- difficulty;
- problem type;
- action type;
- candidate count;
- action relation;
- defect family;
- negative-query flag;
- seed.

Admin metadata should expose problem-goal mapping, mechanism evidence, agency evidence and source authority.

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

Next implementation step after family design freeze: implement problem/action semantic types, suitability oracle and executable COA-CP-001 discovery scenarios.
