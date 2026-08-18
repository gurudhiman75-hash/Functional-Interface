# STA-001 — Statement & Assumption End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-STA — Statement and Assumption`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`STA-001` owns competitive-exam questions in which a statement, proposal, announcement, recommendation, claim, instruction, advertisement, decision or other controlled discourse unit is followed by one or more candidate assumptions and the learner must decide which assumption(s) are implicit.

Core learner task:

```text
understand what the speaker/writer is asserting or trying to achieve
  -> identify what is being taken for granted
  -> test whether the statement materially depends on that proposition
  -> reject facts that are merely possible, desirable, consequent, explicit or externally supplied
  -> select the valid assumption set
```

The chapter does **not** own:

- what logically follows from a statement (`REAS-STC — Statement and Conclusion`);
- whether an argument is strong or weak (`REAS-ARG — Statement and Argument`);
- what action should be taken (`REAS-COA — Course of Action`);
- whether two supplied events are cause/effect (`REAS-CAE — Cause and Effect`);
- assertion/reason truth-link classification (`REAS-ASM — Assertion and Reason`);
- formal set logic (`REAS-SYL — Syllogism`);
- generic reading-comprehension inference.

These chapters may share controlled proposition utilities, but their answer semantics remain separate.

## 2. Governing semantic doctrine

For ExamTree, an assumption is an **unstated proposition that the author/speaker takes for granted and on which the intended statement, recommendation, request, policy, prediction or communicative act materially depends**.

A candidate is not an assumption merely because it is:

- true in the real world;
- plausible;
- related to the topic;
- desirable;
- a likely consequence;
- a restatement of the supplied statement;
- inferable after accepting the statement;
- useful background knowledge.

### 2.1 Operational denial test

A candidate assumption is normally valid when its controlled negation materially undermines the rational force, feasibility, relevance, intended interpretation or communicative purpose of the statement.

The denial test is a validation aid, not a student-facing magic rule. Some presuppositional cases are better represented as dependency checks than literal natural-language negation.

### 2.2 Implicitness requirement

A valid assumption must be unstated. A candidate that simply paraphrases an explicit proposition is rejected as `EXPLICIT_RESTATEMENT` even if the statement obviously depends on it.

### 2.3 Necessity over possibility

The default production standard is **necessary implicit assumption**, not "could be true" assumption.

A proposition that makes the statement more persuasive but is not required is rejected as `SUPPORTIVE_NOT_NECESSARY`.

### 2.4 No unrestricted commonsense oracle

Runtime generation must never ask a language model or arbitrary world-knowledge function to decide whether an assumption is valid. Production truth comes from curated scenario contracts plus deterministic semantic validation.

## 3. Chapter architecture principle

The chapter is modeled as **controlled discourse + hidden dependency graph**, not as stem templates with answer labels.

Canonical flow:

```text
curated scenario family
  -> explicit discourse act
  -> hidden dependency graph
  -> candidate assumption propositions
  -> independent dependency/denial audit
  -> misconception-labelled distractors
  -> answer-set construction
  -> natural rendering
  -> localization
  -> final semantic parity audit
```

The generator must never generate a fluent statement first and invent assumptions afterward.

## 4. Planned checkpoint architecture

Checkpoint boundaries are discovery authorities, not permanent QL counts. Permanent QLs are allocated only after source saturation and merge/split review.

### STA-CP-001 — Core Necessary Implicit Assumptions

Foundation forms where a short controlled statement depends on one or more unstated preconditions.

Primary relations:

- existence;
- availability;
- capability;
- feasibility;
- access;
- relevance;
- prerequisite;
- basic stakeholder behaviour.

This checkpoint establishes the semantic engine, denial audit, option contract and explanation language.

### STA-CP-002 — Recommendation, Proposal, Policy & Decision Assumptions

Statements whose force is prescriptive or decision-oriented.

Candidate dependency families:

- a problem/need exists;
- the proposed measure can address it;
- the measure is feasible;
- relevant stakeholders are affected;
- expected benefit matters;
- the proposal is not self-defeating under the supplied context.

Ownership rule: the learner evaluates assumptions behind the proposal, **not** whether the proposal itself is the best course of action.

### STA-CP-003 — Communication, Advertisement, Notice, Appeal & Instruction Assumptions

Statements whose logic depends on an intended audience or communication objective.

Candidate dependency families:

- audience awareness/unawareness;
- audience interest;
- audience ability to respond;
- message relevance;
- product/service need;
- response channel availability;
- speaker intention.

This checkpoint must aggressively reject marketing-world facts that are plausible but not necessary.

### STA-CP-004 — Causal/Efficacy Bridge Assumptions

Statements where a recommendation, prediction or claim depends on an unstated causal or efficacy bridge.

Examples of semantic roles:

- intervention can influence target outcome;
- stated condition is relevant to predicted result;
- mechanism is sufficient for the limited claim being made;
- alternative explanation need not be ruled out unless the statement requires exclusivity.

Ownership rule: this chapter tests an **assumption required by a supplied claim/action**. It does not ask whether two standalone events are causally related; that belongs to Cause & Effect.

### STA-CP-005 — Comparison, Scope, Measurement & Generalisation Assumptions

Controlled cases involving:

- comparable groups or periods;
- stable measurement meaning;
- relevant reference class;
- sample-to-population bridge where explicitly source-backed;
- scope alignment;
- baseline assumptions.

These forms are admitted only when source evidence shows they are genuine exam patterns and the stem can be represented without turning into data interpretation or critical-reasoning passage work.

### STA-CP-006 — Multi-Assumption & Advanced Presentation Modes

Presentation and query forms such as:

- Assumptions I and II;
- Assumptions I, II and III;
- only one / both / neither;
- approved combination-code formats;
- negatively worded query where source-backed;
- one statement with multiple assumption groups.

This checkpoint does **not** create new semantic relations merely because more candidate assumptions are displayed. It exists to prove combination semantics, option uniqueness and exam-faithful presentation.

## 5. Canonical scenario contract

Conceptual model:

```ts
interface StaScenario {
  scenarioId: string;
  sourceProfile: string;
  discourseAct:
    | "ASSERTION"
    | "PREDICTION"
    | "RECOMMENDATION"
    | "PROPOSAL"
    | "DECISION"
    | "REQUEST"
    | "INSTRUCTION"
    | "NOTICE"
    | "ADVERTISEMENT"
    | "APPEAL";
  explicitPropositions: readonly StaProposition[];
  hiddenDependencies: readonly StaDependency[];
  contextualFacts: readonly StaProposition[];
  candidatePool: readonly StaCandidateAssumption[];
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  examSuitability: readonly string[];
  difficultyBand: "EASY" | "MEDIUM" | "HARD";
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Proposition contract

```ts
interface StaProposition {
  propositionId: string;
  semanticFrame: string;
  polarity: "POSITIVE" | "NEGATIVE";
  entities: readonly string[];
  scope?: string;
  quantifier?: string;
}
```

### 5.2 Dependency contract

```ts
interface StaDependency {
  dependencyId: string;
  propositionId: string;
  relation:
    | "EXISTENCE"
    | "AVAILABILITY"
    | "CAPABILITY"
    | "FEASIBILITY"
    | "PREREQUISITE"
    | "RELEVANCE"
    | "EFFICACY"
    | "BEHAVIOUR"
    | "AWARENESS"
    | "INTENT"
    | "VALUE"
    | "SCOPE"
    | "COMPARABILITY"
    | "MEASUREMENT"
    | "REPRESENTATIVENESS";
  requiredFor: readonly string[];
  denialEffect:
    | "BREAKS_FEASIBILITY"
    | "BREAKS_RATIONALE"
    | "BREAKS_RELEVANCE"
    | "BREAKS_INTENDED_MEANING"
    | "BREAKS_COMMUNICATIVE_PURPOSE";
}
```

### 5.3 Candidate assumption contract

```ts
interface StaCandidateAssumption {
  candidateId: string;
  propositionId: string;
  expectedClassification: "IMPLICIT" | "NOT_IMPLICIT";
  misconceptionClass?: StaMisconceptionClass;
  sourceAuthority: string;
}
```

The generator may not use `expectedClassification` as the final answer oracle. The independent validator recomputes classification from proposition/dependency metadata.

## 6. Independent semantic oracle

Because natural-language assumptions are not safely reducible to arithmetic, independence is achieved structurally.

The production renderer/generator and semantic oracle must use different responsibilities:

### Generator responsibility

- choose scenario;
- choose approved candidate set;
- render statement and assumptions;
- construct misconception-balanced options;
- shuffle deterministically.

### Oracle responsibility

For each candidate:

1. normalize candidate proposition identity;
2. verify it is not explicitly asserted;
3. locate any hidden dependency relation;
4. apply the dependency-specific denial test;
5. verify the dependency is required for the actual discourse act;
6. reject merely supportive or consequential propositions;
7. return `IMPLICIT` or `NOT_IMPLICIT` with evidence code.

The oracle output must include machine-readable evidence such as:

```text
candidate STA-A-017
  explicit: false
  dependency: EFFICACY
  requiredFor: RECOMMENDATION_RATIONALE
  denialEffect: BREAKS_RATIONALE
  result: IMPLICIT
```

A scenario is rejected if the oracle disagrees with curated editorial authority.

## 7. Negation/denial architecture

Negation is stored semantically, not generated by mechanically inserting "not".

Examples:

```text
CAN_ACCESS(x, service) <-> CANNOT_ACCESS(x, service)
EXISTS(problem) <-> NOT_EXISTS(problem)
CAN_REDUCE(action, risk) <-> CANNOT_REDUCE(action, risk)
AUDIENCE_INTERESTED(product) <-> AUDIENCE_NOT_INTERESTED(product)
```

This prevents broken negations, scope errors and double negatives across English, Hindi and Punjabi.

## 8. Misconception and distractor taxonomy

Every non-assumption candidate should carry an editorial misconception label where practical.

Required classes:

```text
EXPLICIT_RESTATEMENT
CONCLUSION_OR_CONSEQUENCE
PLAUSIBLE_WORLD_FACT
RELATED_BUT_IRRELEVANT
SUPPORTIVE_NOT_NECESSARY
TOO_STRONG_QUANTIFIER
TOO_WEAK_TO_BE_REQUIRED
REVERSE_DEPENDENCY
WRONG_STAKEHOLDER
WRONG_SCOPE
WRONG_TIMEFRAME
WRONG_COMPARISON_BASELINE
VALUE_JUDGEMENT_NOT_REQUIRED
EXTERNAL_KNOWLEDGE
OPPOSITE_OF_REQUIRED_ASSUMPTION
CAUSE_EFFECT_OVERREACH
FEASIBILITY_OVERREACH
```

Distractor construction priority:

1. misconception generated from the same scenario graph;
2. near-dependency with one wrong scope/entity/timeframe;
3. consequence of the statement;
4. plausible but unnecessary background fact;
5. bounded editorial fallback from the same scenario family.

Random unrelated sentences are prohibited.

## 9. Candidate-set construction

The basic exam unit should normally contain two candidate assumptions.

Canonical semantic outcomes:

```text
ONLY_I
ONLY_II
BOTH
NEITHER
```

All four outcomes must be producible across the corpus. The generator must prevent position bias and answer-frequency bias.

Three-assumption and source-specific coded formats are allowed only after source evidence and dedicated option-contract tests.

An `EITHER_I_OR_II` answer is not assumed to exist merely because another reasoning chapter uses it. It requires source-backed semantics for Statement & Assumption.

## 10. Presentation architecture

Renderer: `STRUCTURED_TEXT`.

Canonical presentation object:

```ts
interface StaStructuredPrompt {
  instruction: string;
  statementLabel: string;
  statement: string;
  assumptionHeading: string;
  assumptions: readonly {
    label: string;
    text: string;
  }[];
}
```

Rendering must preserve clear visual hierarchy:

```text
Statement: ...

Assumptions:
I. ...
II. ...
```

Do not collapse the entire question into one dense paragraph.

## 11. Explanation architecture

Explanations must read like a human reasoning solution, not a rule dump.

For each assumption:

1. identify what the main statement is trying to say/do;
2. explain whether the statement depends on the candidate;
3. when useful, apply the denial test in natural language;
4. label the candidate as implicit/not implicit;
5. conclude with the correct combination.

Preferred style:

```text
The statement recommends X because it expects Y.

Assumption I is implicit: if I were false, X would not be a workable recommendation.

Assumption II is not implicit: it may be true, but the recommendation does not require it.

Therefore, only Assumption I is implicit.
```

Prohibited explanation style:

- "Rule: EFFICACY_DEPENDENCY";
- vague "I follows, II does not follow" wording;
- generic definitions without applying them to the actual statement;
- circular "it is implicit because it is assumed" explanations.

## 12. Difficulty model

Difficulty derives from semantic burden, not sentence length alone.

Primary levers:

- dependency directness;
- number of plausible competing candidates;
- closeness between necessary and merely supportive propositions;
- scope/quantifier subtlety;
- discourse-act complexity;
- multiple stakeholders;
- causal bridge depth;
- negative wording;
- number of candidate assumptions;
- linguistic density.

Indicative bands:

### Easy

- one direct precondition;
- obvious unrelated/consequence distractor;
- short statement;
- concrete entities.

### Medium

- valid and invalid candidates both closely related;
- recommendation or communication intent;
- one scope or stakeholder trap.

### Hard

- two plausible dependencies with only one necessary;
- quantifier/scope subtlety;
- multi-step efficacy bridge;
- three-assumption combination where source-backed;
- negative or exception framing where source-backed.

## 13. Controlled content library

Natural-language logic requires curated scenario families.

Proposed dataset layout:

```text
STA-001/
  datasets/
    public-service/
    workplace/
    education/
    banking-finance/
    consumer-advertising/
    health-safety-neutral/
    transport-infrastructure/
    civic-administration/
    environment-neutral/
    everyday-decisions/
```

Each family must avoid:

- unstable current-affairs facts;
- political persuasion;
- regionally offensive stereotypes;
- sensitive identity assumptions;
- medically unsafe advice;
- legal claims whose truth changes over time;
- niche factual dependence unrelated to reasoning.

Scenarios should remain exam-realistic but fact-light enough that the answer is determined by the discourse contract, not obscure knowledge.

## 14. Source-saturation protocol

No permanent QL allocation before:

```text
collect representative SSC / Banking / Punjab-state source patterns
  -> classify by discourse act and hidden dependency
  -> build temporary executable prototypes
  -> audit direct / inverse / multi-assumption / negative variants
  -> perform cross-chapter ownership audit
  -> merge semantic duplicates
  -> identify unsupported generator-only inventions
  -> declare no-known-gap / source-saturation state
  -> propose permanent QL and CP allocation
```

Source evidence records should capture:

- exam family;
- year/session where known;
- pattern summary rather than copyrighted bulk text;
- assumption count;
- answer format;
- discourse act;
- dependency type;
- difficulty signal;
- source confidence.

## 15. Cross-chapter ownership rules

### Statement & Conclusion

If the question asks what follows from supplied information, it belongs to `REAS-STC`.

### Statement & Argument

If candidates are reasons for/against a proposition and the learner judges strength/relevance, it belongs to `REAS-ARG`.

### Course of Action

If candidates are proposed actions and the learner judges suitability, it belongs to `REAS-COA`.

### Cause & Effect

If two events are supplied and the learner determines causal direction/relationship, it belongs to `REAS-CAE`.

An efficacy proposition may still be an assumption when a recommendation depends on it.

### Assertion & Reason

If both assertion and reason are explicit and the learner judges truth/explanation relationship, it belongs to `REAS-ASM`.

### Decision Making / Eligibility

If explicit rules determine whether an entity qualifies, it belongs to `REAS-DCS`.

## 16. Localization architecture

Target locales:

- `en-IN`;
- `hi-IN`;
- `pa-IN`.

Default mode: `LANGUAGE_ADAPTED` for scenario text, with semantic proposition identity preserved.

For the same semantic scenario and seed, locales must preserve:

- discourse act;
- hidden dependency graph;
- candidate classification;
- correct answer set;
- difficulty;
- misconception ownership;
- option index where practical.

Localization must not change assumption status through grammar.

Special audits:

- negation scope;
- modal verbs (`can`, `must`, `may`, equivalents);
- universal/particular quantifiers;
- gender agreement;
- referent clarity;
- Hindi/Punjabi natural exam phrasing;
- accidental strengthening or weakening;
- English leakage;
- script integrity.

Literal translation is rejected when it changes what is presupposed.

## 17. Question Studio metadata

Question Studio integration remains closed until chapter closure.

When opened, filters should include:

```text
chapter
checkpoint
permanent QL
exam profile
difficulty
discourse act
dependency type
candidate count
answer pattern
misconception class
locale
seed
```

Admin-only evidence should expose:

- scenario ID;
- source authority;
- proposition graph;
- dependency graph;
- oracle classification per candidate;
- denial-test evidence code;
- misconception labels;
- localization parity status;
- editorial review status.

## 18. QA gates

### Semantic gate

- exactly one approved answer set;
- every valid assumption maps to a required hidden dependency;
- no invalid candidate accidentally maps to a required dependency;
- no explicit restatement classified as implicit;
- denial evidence available for every valid assumption.

### Option gate

- answer labels unique;
- correct combination represented exactly once;
- deterministic shuffle;
- no label/position leakage;
- corpus-level outcome distribution audited.

### Content gate

- no unresolved placeholders;
- no unnatural synthetic wording;
- no internal enum leakage;
- no obscure world knowledge needed;
- statement and assumptions grammatically compatible;
- entity references unambiguous.

### Diversity gate

Audit distribution across:

- discourse acts;
- dependency types;
- scenario families;
- outcome patterns;
- misconception classes;
- difficulty;
- sentence shapes;
- locales.

Thousands of seeds from a few semantic skeletons do not count as exhaustive coverage.

### Localization gate

- semantic parity;
- answer parity;
- denial parity;
- natural phrasing;
- script purity;
- scope/quantifier parity.

## 19. Freeze criteria

`STA-001` cannot be frozen until all of the following are true:

1. source-saturation review has no known material pattern gap;
2. permanent QLs and checkpoint boundaries are allocated and audited;
3. every permanent QL has executable generation;
4. semantic oracle independently validates all generated candidates;
5. misconception distractors are traceable;
6. large deterministic seed audits are green;
7. outcome and difficulty distributions are acceptable;
8. English editorial review is frozen;
9. Hindi and Punjabi semantic parity is frozen;
10. Question Studio integration is validated end-to-end;
11. review exports show human-quality questions and explanations;
12. no cross-chapter ownership ambiguity remains.

## 20. Current lifecycle state

```text
chapter:                     STA-001
productCode:                 REAS-STA
maturity:                    DESIGN_AUTHORITY
permanentQlCount:            0
sourceSaturation:            NOT_STARTED
executableDiscovery:         NOT_STARTED
englishEditorialFreeze:      false
hindiLocalization:           NOT_STARTED
punjabiLocalization:         NOT_STARTED
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
```

## 21. Implementation sequence

### Phase A — Foundation

- scenario/proposition/dependency types;
- semantic oracle;
- denial representation;
- misconception taxonomy;
- structured renderer;
- two-assumption combination contract;
- deterministic seed plumbing.

### Phase B — Executable discovery

- CP001–CP004 temporary source-backed prototypes;
- curated English scenario packs;
- independent semantic audits;
- review export;
- adversarial ambiguity tests.

### Phase C — Saturation

- CP005–CP006 source audit;
- SSC/Banking/Punjab profile comparison;
- merge/split review;
- permanent QL proposal;
- corpus diversity audit.

### Phase D — Editorial and localization

- English exam-readiness freeze;
- Hindi adaptation and parity audit;
- Punjabi adaptation and parity audit.

### Phase E — Delivery

- whole-chapter Question Studio registration;
- admin metadata filters;
- review export validation;
- Question Bank/test/public lifecycle opening only after freeze evidence.

## 22. Design decision frozen by this authority

Statement-based logic is a **student-facing umbrella family, not one implementation chapter**.

`REAS-STA` remains separate from:

```text
REAS-STC  Statement and Conclusion
REAS-ARG  Statement and Argument
REAS-COA  Course of Action
REAS-CAE  Cause and Effect
REAS-ASM  Assertion and Reason
```

Shared utilities are encouraged. Shared answer semantics are prohibited unless explicitly defined by the Family C foundation.
