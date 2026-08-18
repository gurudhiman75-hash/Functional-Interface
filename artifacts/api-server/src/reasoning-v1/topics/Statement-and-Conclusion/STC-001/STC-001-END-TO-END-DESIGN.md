# STC-001 — Statement & Conclusion End-to-End Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION DISCOVERY**

Product chapter: `REAS-STC — Statement and Conclusion`

Family: `Family C — Logic and deduction`

## 1. Product boundary

`STC-001` owns questions in which one or more supplied statements are treated as the complete evidence base and the learner decides which candidate conclusion(s) are logically supported by that evidence.

Core learner task:

```text
read only the supplied information
  -> normalize its propositions, scope and conditions
  -> derive only licensed consequences
  -> reject claims needing extra assumptions or outside knowledge
  -> select the conclusion set that is entailed
```

The chapter does not own:

- unstated premises required by a statement (`STA-001`);
- strength of reasons for/against an issue (`ARG-001`);
- suitability of proposed remedies (`COA-001`);
- causal classification of two events (`CAE-001`);
- truth-plus-explanation coding (`ASM-001`);
- formal categorical set deduction whose primary solve method is syllogism (`SYL-001`).

## 2. Governing semantic doctrine

A candidate conclusion is valid when it is **entailed by the supplied evidence under the chapter's licensed inference rules**.

Default standard:

```text
if the supplied statements are accepted, the candidate must hold
```

A candidate is rejected when it is merely:

- possible;
- probable but not guaranteed;
- real-world plausible;
- supported by an unstated premise;
- a stronger quantifier than the evidence permits;
- a causal interpretation of non-causal information;
- a converse or reverse relation not licensed by the statement;
- outside the supplied scope or timeframe.

Unlike Assumption, STC has **no hidden dependency layer**. The answer must be derivable from explicit evidence plus explicitly approved inference rules.

## 3. Inference ownership

The current product taxonomy has no standalone `REAS-INF` chapter.

Therefore, source-backed questions worded as "which inference can be drawn?" are owned by STC when the actual semantic task is entailment from supplied information.

`queryKind = INFERENCE` may differ in rendering, but it does not automatically create a separate engine or chapter.

## 4. Planned checkpoint architecture

Checkpoint boundaries are discovery authorities. Permanent QLs are allocated only after source saturation and merge/split review.

### STC-CP-001 — Direct Entailment & Explicit Relation

Foundation forms:

- direct property consequence;
- identity/reference consequence;
- explicit relational consequence;
- simple conditional consequence;
- direct negative/exclusion consequence;
- safe paraphrastic equivalence.

Purpose: establish proposition normalization, contradiction checks and conclusion classification.

### STC-CP-002 — Conditional, Scope & Quantifier Reasoning

Controlled forms involving:

- if/then conditions;
- necessary versus sufficient condition traps;
- all/some/none/most/exact quantifiers where source-backed;
- scope restriction;
- exception handling;
- negation and double-negation semantics.

Ownership guard: if the question becomes a formal categorical set puzzle, route to Syllogism.

### STC-CP-003 — Multi-Statement Integration

Questions requiring two or more explicit statements to be combined.

Candidate structures:

- relational chaining;
- condition + fact;
- common-entity integration;
- constraint intersection;
- temporal fact combination;
- two-premise consequence.

No hidden premise may be inserted to bridge disconnected statements.

### STC-CP-004 — Comparison, Time, Quantity & Reference-Class Conclusions

Controlled source-backed forms involving:

- more/less/equal comparisons;
- before/after and sequence;
- bounded numeric or count relations;
- same/different reference class;
- baseline and timeframe alignment.

This checkpoint excludes full Data Interpretation and quantitative calculation chapters.

### STC-CP-005 — Inference / Interpretation Presentation Modes

Source-backed variants whose instruction uses terms such as:

- inference;
- implication;
- can be concluded;
- definitely follows;
- cannot be concluded.

These remain STC only when their answer standard is explicit-evidence entailment.

Negative query forms require dedicated tests so answer inversion cannot create ambiguity.

### STC-CP-006 — Multi-Conclusion & Combination Formats

Presentation forms:

- Conclusions I and II;
- I, II and III;
- only I / only II / both / neither;
- source-backed coded combinations;
- source-backed "which does not follow?" formats.

This checkpoint proves combination semantics rather than inventing new inference rules.

## 5. Canonical scenario contract

```ts
interface StcScenario {
  scenarioId: string;
  sourceProfile: string;
  explicitPropositions: readonly LogicProposition[];
  inferenceRules: readonly StcInferenceRule[];
  candidateConclusions: readonly StcCandidateConclusion[];
  queryKind: "CONCLUSION" | "INFERENCE" | "IMPLICATION";
  localeMode: "TRANSLATABLE" | "LANGUAGE_ADAPTED";
  examSuitability: readonly string[];
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

### 5.1 Inference rule contract

```ts
interface StcInferenceRule {
  ruleId: string;
  kind:
    | "DIRECT_EQUIVALENCE"
    | "MODUS_PONENS"
    | "RELATION_CHAIN"
    | "NEGATIVE_EXCLUSION"
    | "QUANTIFIER_LICENSE"
    | "TEMPORAL_TRANSITIVITY"
    | "COMPARISON_TRANSITIVITY"
    | "CONSTRAINT_INTERSECTION";
  premises: readonly string[];
  conclusion: string;
}
```

Only rules authorized by the scenario/checkpoint may enter the closure.

### 5.2 Candidate conclusion contract

```ts
interface StcCandidateConclusion {
  candidateId: string;
  proposition: LogicProposition;
  editorialVerdict: "FOLLOWS" | "DOES_NOT_FOLLOW";
  misconceptionClass?: StcMisconceptionClass;
}
```

The editorial verdict is review authority, not the runtime answer oracle.

## 6. Independent entailment oracle

The oracle must be structurally independent from rendering and option construction.

For each candidate:

1. normalize the explicit proposition set;
2. construct the licensed consequence closure;
3. test exact semantic equivalence of the candidate against the closure;
4. test whether the candidate is contradicted;
5. reject any candidate requiring an unlicensed premise;
6. verify scope, entity, quantifier, polarity and timeframe;
7. emit a proof/evidence trace.

Example evidence:

```text
candidate: STC-C-014
premises: P1, P3
rule: MODUS_PONENS
scopeMatch: true
outsidePremiseCount: 0
result: FOLLOWS
```

The generator may not classify a conclusion by copying its curated label.

## 7. Contradiction and unknown states

Internally, proposition evaluation should distinguish:

```text
ENTAILED
CONTRADICTED
UNDETERMINED
```

Student-facing formats normally collapse `CONTRADICTED` and `UNDETERMINED` into `DOES_NOT_FOLLOW`, unless a source-backed format explicitly asks for a three-way distinction.

This prevents the engine from treating lack of evidence as evidence of falsity.

## 8. Misconception taxonomy

Required classes include:

```text
OUTSIDE_INFORMATION
POSSIBLE_NOT_NECESSARY
UNSUPPORTED_STRENGTHENING
QUANTIFIER_SHIFT
CONVERSE_ERROR
REVERSE_RELATION
AFFIRMING_THE_CONSEQUENT
DENYING_THE_ANTECEDENT
CAUSE_EFFECT_OVERREACH
WRONG_SCOPE
WRONG_STAKEHOLDER
WRONG_TIMEFRAME
WRONG_REFERENCE_CLASS
PART_TO_WHOLE_OVERREACH
WHOLE_TO_PART_OVERREACH
UNLICENSED_GENERALISATION
CONTRADICTION_IGNORED
```

Wrong candidates should be generated from the same semantic neighborhood where possible.

## 9. Answer-set construction

Default two-conclusion outcomes:

```text
ONLY_I
ONLY_II
BOTH
NEITHER
```

Three-conclusion combination codes are source-backed only.

The generator must audit:

- exactly one option representing the correct conclusion set;
- no duplicate semantic option after localization;
- balanced answer positions across seed suites;
- no label-order shortcut;
- no conclusion text that accidentally changes truth through wording.

## 10. Renderer

Renderer: `STRUCTURED_TEXT`.

Canonical layout:

```text
Statement(s): ...

Conclusions:
I. ...
II. ...
```

For multiple source statements, preserve numbering and paragraph boundaries.

Do not flatten scope-sensitive premises into prose that changes conjunction/disjunction.

## 11. Explanation architecture

Student explanation should:

1. restate the relevant supplied fact(s) briefly;
2. show the exact logical connection to each conclusion;
3. identify any extra assumption required by a rejected candidate;
4. explain scope/quantifier traps in plain language;
5. conclude with the correct combination.

Preferred tone:

```text
The statement tells us that every approved applicant receives an ID card and that Riya is an approved applicant. Therefore Riya must receive an ID card, so Conclusion I follows.

Nothing says that every ID-card holder is an approved applicant. Conclusion II reverses the relationship, so it does not follow.
```

Avoid generic "I follows, II does not" explanations without proof.

## 12. Difficulty model

Primary levers:

- number of premises needed;
- inference depth;
- quantifier subtlety;
- condition direction;
- negative wording;
- scope shifts;
- reference-class similarity;
- distractor proximity;
- number of candidates;
- temporal/comparison integration.

Indicative bands:

### Easy
- direct one-premise consequence;
- concrete wording;
- obvious outside-information distractor.

### Medium
- two-premise integration;
- one scope/condition trap;
- closely related but unsupported candidate.

### Hard
- multiple licensed inference steps;
- subtle quantifier/reference-class distinction;
- negative query or three-conclusion source-backed format;
- distractors differing by one semantic feature.

## 13. Localization

Logic remains language-neutral.

Localization must preserve:

- proposition identity;
- condition direction;
- quantifier strength;
- negation scope;
- temporal order;
- answer set;
- candidate numbering;
- difficulty.

Hindi/Punjabi translators may adapt sentence order for naturalness but must not add causal, modal or certainty markers absent from the semantic contract.

## 14. Source-saturation protocol

Before permanent QLs:

```text
collect SSC / Banking / Punjab-state patterns
-> classify inference rule + presentation mode
-> executable temporary prototypes
-> direct/inverse/negative gap audit
-> inference-label ownership audit
-> Syllogism/Data-Sufficiency boundary audit
-> merge semantic duplicates
-> no-known-gap decision
-> permanent QL proposal
```

Generator-only patterns unsupported by sources remain non-production hypotheses.

## 15. QA gates

Required suites:

- deterministic generation;
- oracle/editorial parity;
- contradiction-vs-unknown distinction;
- no outside-premise leakage;
- converse/reversal adversarial tests;
- quantifier mutation tests;
- scope/time mutation tests;
- option uniqueness;
- balanced answer-set coverage;
- explanation proof grounding;
- localization semantic parity;
- cross-chapter ownership tests.

## 16. Question Studio contract

After chapter freeze, filters may include:

- checkpoint / QL;
- exam profile;
- difficulty;
- query kind;
- inference-rule family;
- premise count;
- conclusion count;
- negative-query flag;
- seed.

Admin evidence should expose closure proof, misconception labels and source authority.

## 17. Lifecycle

Current design state:

```text
maturity:                    DESIGN_AUTHORITY_PRE_IMPLEMENTATION
permanentQlCount:            0
questionStudioDiscoverable:  false
questionBankWritable:        false
testEligible:                false
publiclyPublishable:         false
Hindi/Punjabi:               NOT_STARTED
```

Next implementation step after family design freeze: build proposition normalization + entailment oracle, then executable STC-CP-001 discovery prototypes.
