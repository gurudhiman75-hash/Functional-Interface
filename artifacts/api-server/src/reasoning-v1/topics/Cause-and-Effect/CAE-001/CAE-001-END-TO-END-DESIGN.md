# CAE-001 — Cause & Effect End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-CAE — Cause and Effect`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`CAE-001` owns questions in which two or more supplied events/statements are compared and the learner determines their causal relationship.

Core learner task:

```text
identify the events being compared
  -> establish temporal and semantic direction
  -> test whether an authorized causal mechanism connects them
  -> distinguish direct/mediated causation from common-cause or independence
  -> reject correlation, chronology-only and reverse-cause traps
  -> select the correct causal relation code
```

The chapter does not own:

- an unstated causal premise required by a recommendation (`STA-001`);
- whether a causal claim is a strong reason for/against a proposal (`ARG-001`);
- what action should be taken after an event (`COA-001`);
- generic entailment (`STC-001`);
- truth and explanatory adequacy of Assertion/Reason (`ASM-001`).

## 2. Governing semantic doctrine

A causal relation is accepted only when the controlled scenario contains an authorized causal pathway.

Chronological order alone is insufficient.

Statistical association or simultaneous occurrence alone is insufficient.

Runtime generation must not ask unrestricted world knowledge whether one event causes another.

The engine classifies relationships from a curated causal event graph.

## 3. Canonical causal relations

The semantic layer supports:

```text
A_CAUSES_B
B_CAUSES_A
COMMON_CAUSE
INDEPENDENT_EVENTS
INDEPENDENT_CAUSES
EFFECTS_OF_INDEPENDENT_CAUSES
MEDIATED_A_CAUSES_B
MEDIATED_B_CAUSES_A
CONTRIBUTING_CAUSE_A_TO_B
CONTRIBUTING_CAUSE_B_TO_A
```

Student-facing answer codes are source-profile-specific. Not every exam format exposes every internal relation separately.

For example, a source profile may collapse `MEDIATED_A_CAUSES_B` into `A_CAUSES_B`.

## 4. Planned checkpoint architecture

### CAE-CP-001 — Direct Cause -> Effect

Foundation forms with one authorized direct causal edge.

Tests:

- temporal precedence;
- mechanism presence;
- correct direction;
- event identity;
- direct reverse-cause trap.

### CAE-CP-002 — Reverse Direction & Bidirectional-Looking Traps

Controlled scenarios where surface wording makes either direction initially plausible, but only one direction is licensed.

Includes:

- effect stated before cause in text;
- symptom/outcome versus initiating event;
- response event versus triggering event;
- temporal phrasing that does not match display order.

### CAE-CP-003 — Common Cause

Two displayed events share an authorized upstream cause.

```text
C -> A
C -> B
```

The engine must reject the tempting but false inference `A -> B` or `B -> A` unless an additional causal edge exists.

### CAE-CP-004 — Independence & Coincidence

Cases where events:

- are unrelated;
- arise from separate causes;
- merely happen in the same period;
- share a broad topic but no causal pathway.

Source-specific answer formats may distinguish "independent causes" from "independent effects".

### CAE-CP-005 — Mediated, Contributing & Multi-Cause Relations

Advanced source-backed forms involving:

```text
A -> M -> B
A + C -> B
A increases risk of B
```

A contributing cause need not be necessary or sufficient by itself. Wording and answer code must preserve that distinction.

### CAE-CP-006 — Multi-Statement / Coded / Negative Presentation

Presentation forms such as:

- Statement I / Statement II;
- standard coded cause-effect combinations;
- source-backed three-event forms;
- "which is not a cause/effect relation?" variants;
- source-backed common-cause/independence codes.

This checkpoint validates representation and code mapping, not new causal semantics.

## 5. Canonical event-graph contract

```ts
interface CaeScenario {
  scenarioId: string;
  sourceProfile: string;
  events: readonly CaeEvent[];
  causalEdges: readonly CaeCausalEdge[];
  commonCauseGroups: readonly CaeCommonCauseGroup[];
  displayedEventRefs: readonly string[];
  answerProfile: CaeAnswerProfile;
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Event contract

```ts
interface CaeEvent {
  eventId: string;
  proposition: LogicProposition;
  timeIndex?: number;
  eventKind:
    | "CONDITION"
    | "TRIGGER"
    | "PROCESS"
    | "OUTCOME"
    | "RESPONSE"
    | "OBSERVATION";
}
```

### 5.2 Causal edge contract

```ts
interface CaeCausalEdge {
  fromEventId: string;
  toEventId: string;
  strength: "DIRECT" | "MEDIATED" | "CONTRIBUTING";
  mechanismId: string;
  sourceAuthority: string;
}
```

## 6. Independent causal-relation oracle

For displayed events A and B:

1. verify event identity and time metadata;
2. search authorized A -> B paths;
3. search authorized B -> A paths;
4. search common ancestors;
5. inspect whether each event has separate causal provenance;
6. distinguish direct, mediated and contributing paths;
7. reject any relation that exists only by chronology/topic similarity;
8. map the internal relation to the selected source answer profile.

Conceptual trace:

```text
A -> B path: none
B -> A path: none
commonAncestor: C
classification: COMMON_CAUSE
studentCode: BOTH_EFFECTS_OF_COMMON_CAUSE
```

The generator must not use display order as a causal shortcut.

## 7. Causal mechanism registry

Mechanisms are curated semantic relations, not free-text explanations.

Examples of neutral mechanism families:

```text
CAPACITY_INCREASE_REDUCES_QUEUE
SERVICE_OUTAGE_CAUSES_DELAY
HEAVY_RAIN_CAUSES_LOCAL_WATERLOGGING
PRICE_REDUCTION_CAN_INCREASE_DEMAND
STAFF_SHORTAGE_REDUCES_PROCESSING_CAPACITY
ROAD_BLOCKAGE_CAUSES_TRAFFIC_DIVERSION
SYSTEM_FAILURE_INTERRUPTS_TRANSACTION
PUBLIC_NOTICE_INCREASES_AWARENESS
```

Production wording must remain bounded so the causal claim is defensible from the scenario itself.

## 8. Correlation and chronology traps

The adversarial validator must include competing candidates where:

- A occurs before B but is unrelated;
- A and B occur together because of C;
- B is a response to A but surface wording suggests the opposite;
- A and B share vocabulary but no causal edge;
- A may influence B in reality but that relation is not authorized in the controlled scenario.

If real-world ambiguity makes multiple interpretations reasonable, reject the scenario.

## 9. Misconception taxonomy

```text
REVERSED_CAUSAL_DIRECTION
CHRONOLOGY_AS_CAUSATION
CORRELATION_AS_CAUSATION
COMMON_CAUSE_MISSED
INDEPENDENCE_MISSED
TOPIC_SIMILARITY_AS_CAUSATION
CONTRIBUTING_CAUSE_TREATED_AS_SOLE_CAUSE
MEDIATED_CAUSE_TREATED_AS_INDEPENDENT
EFFECT_TREATED_AS_CAUSE
RESPONSE_TREATED_AS_TRIGGER
UNAUTHORIZED_WORLD_KNOWLEDGE
WRONG_TIMEFRAME
WRONG_EVENT_SCOPE
```

## 10. Answer-profile architecture

The semantic graph is independent of exam option coding.

A profile might expose a five-code format equivalent to:

```text
I is cause, II is effect
II is cause, I is effect
I and II are independent causes
I and II are effects of independent causes
I and II are effects of a common cause
```

Another source may expose fewer categories.

Permanent production answer profiles require source evidence. The engine must not hard-code one coaching-site convention as universal.

## 11. Renderer

Renderer: `STRUCTURED_TEXT`.

Canonical form:

```text
Statement I: ...
Statement II: ...
```

Where source format calls them "events", "statements" or another label, the semantic objects remain events/propositions underneath.

## 12. Explanation architecture

Explanation should identify:

- the relevant causal pathway or lack of one;
- causal direction;
- whether another event acts as a common cause;
- why chronology/correlation does not suffice for the closest trap.

Example style:

```text
Statement I describes the system outage. Statement II describes the transaction delay produced by that outage. The scenario directly links the outage to interruption of processing, so I is the cause and II is the effect.
```

For common-cause cases, explicitly name the common upstream condition from the controlled scenario when it is shown or inferable by the authorized representation.

## 13. Difficulty model

Primary levers:

- direct versus mediated pathway;
- reverse display order;
- common-cause proximity;
- similarity of independent events;
- number of causal nodes;
- contributing versus sole-cause distinction;
- temporal complexity;
- distractor closeness;
- answer-code complexity;
- negative query.

### Easy
- direct cause/effect with clear mechanism.

### Medium
- reverse display order, common cause or plausible independence trap.

### Hard
- mediated/contributing cause;
- multiple causal candidates;
- code mapping with near-equivalent distractors;
- three-event source-backed forms.

## 14. Localization

Localization must preserve:

- event identity;
- temporal direction;
- causal modality;
- direct/contributing distinction;
- common-cause structure;
- answer-profile code;
- difficulty.

Words equivalent to "because", "therefore", "may cause" and "must cause" carry logic and cannot be changed casually during translation.

## 15. Source-saturation protocol

Before permanent QLs:

```text
collect representative exam patterns
-> classify internal causal relation + answer profile
-> executable temporary prototypes
-> reverse/common-cause/independence coverage audit
-> contributing/mediated source audit
-> answer-code profile audit
-> cross-chapter STA/ARG/ASM boundary audit
-> merge/split review
-> no-known-gap decision
-> permanent QL proposal
```

## 16. QA gates

Required:

- deterministic graph generation;
- oracle/editorial parity;
- direction reversal tests;
- display-order independence;
- common-ancestor detection tests;
- causal-edge removal mutation tests;
- chronology-only rejection tests;
- correlation-only rejection tests;
- answer-profile mapping tests;
- option uniqueness;
- explanation grounding;
- localization parity;
- ambiguity rejection.

## 17. Question Studio contract

Post-freeze filters may include:

- checkpoint / QL;
- exam profile;
- difficulty;
- causal relation;
- direct/mediated/contributing;
- answer profile;
- event count;
- reverse-display flag;
- seed.

Admin metadata should expose causal graph, mechanism IDs, classification trace and source authority.

## 18. Lifecycle

```text
maturity:                    DESIGN_AUTHORITY_PRE_IMPLEMENTATION
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

Next implementation step after family design freeze: implement event graph + causal classifier and executable CAE-CP-001 discovery scenarios.
