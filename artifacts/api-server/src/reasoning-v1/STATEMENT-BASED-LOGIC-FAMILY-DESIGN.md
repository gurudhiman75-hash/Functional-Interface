# ExamTree Reasoning V1 — Statement-Based Logic Family Design Authority

Status: **DESIGN AUTHORITY / PRE-IMPLEMENTATION**

This document governs the coordinated design of the natural-language logic chapters in Reasoning Family C. It does not create a single student-facing chapter.

## 1. Product taxonomy

The following remain separate student-facing and runtime chapters:

| Code | Package | Chapter |
|---|---|---|
| `REAS-STA` | `STA-001` | Statement & Assumption |
| `REAS-STC` | `STC-001` | Statement & Conclusion |
| `REAS-ARG` | `ARG-001` | Statement & Argument |
| `REAS-COA` | `COA-001` | Course of Action |
| `REAS-CAE` | `CAE-001` | Cause & Effect |
| `REAS-ASM` | `ASM-001` | Assertion & Reason |

They may share proposition, entity, scope, localization, rendering and editorial utilities, but **answer semantics are never interchangeable**.

## 2. One prompt family, different logical questions

The same real-world scenario may support multiple chapter-specific questions, but each chapter asks a different thing:

- **Assumption:** what unstated proposition must be taken for granted?
- **Conclusion:** what is entailed by the supplied information?
- **Argument:** which reason materially and logically bears on the issue?
- **Course of Action:** which proposed response is relevant, feasible and proportionate?
- **Cause & Effect:** what causal relation exists between supplied events?
- **Assertion & Reason:** are the two propositions true, and if so does the reason explain the assertion?

A shared scenario must therefore be transformed into a chapter-specific semantic contract before generation.

## 3. Shared controlled proposition IR

Natural-language logic is represented semantically before it is rendered.

```ts
interface LogicProposition {
  propositionId: string;
  predicate: string;
  polarity: "POSITIVE" | "NEGATIVE";
  entities: readonly LogicEntityRef[];
  quantifier?: "ALL" | "SOME" | "NONE" | "MOST" | "EXISTS" | "EXACT";
  scope?: string;
  time?: LogicTimeRef;
  modality?: "FACT" | "POSSIBLE" | "PROBABLE" | "REQUIRED" | "RECOMMENDED";
}
```

The shared IR may encode facts, conditions, events, goals and relations, but each chapter owns its own evaluator.

## 4. Chapter-specific oracle boundary

The shared layer must expose no generic `isCorrectStatement()` function.

Instead:

```text
STA -> evaluateImplicitDependency(candidate)
STC -> evaluateEntailment(candidate)
ARG -> evaluateArgumentStrength(candidate)
COA -> evaluateActionSuitability(candidate)
CAE -> classifyCausalRelation(eventA, eventB)
ASM -> evaluateTruthAndExplanation(assertion, reason)
```

Cross-calling another chapter's verdict function as answer authority is prohibited.

## 5. Shared semantic dimensions

Reusable dimensions include:

- entity identity;
- stakeholder/agent;
- object and target;
- positive/negative polarity;
- quantifier and scope;
- time and sequence;
- condition/precondition;
- goal;
- consequence;
- causal link;
- evidence/source relation;
- action and intended effect;
- comparison baseline;
- explicit versus unstated proposition;
- contradiction and compatibility.

The meaning of these fields is shared; the decision rule applied to them is chapter-specific.

## 6. Controlled content policy

Production content must come from curated, reviewable scenario families. Free-form runtime generation of claims, arguments, assumptions or causal relationships is not production authority.

Preferred scenario domains:

- education;
- workplace;
- transport;
- public services;
- consumer decisions;
- banking/service operations;
- civic administration;
- environment-neutral situations;
- health/safety situations that do not require medical advice;
- everyday decisions;
- neutral institutional processes.

Avoid unstable current-affairs claims, political persuasion, stereotypes, sensitive identity claims, medical treatment advice, changing legal facts and obscure knowledge dependence.

## 7. Shared misconception vocabulary

Chapters may reuse misconception concepts, but each chapter maps them into its own answer logic.

Common concepts include:

```text
OUTSIDE_INFORMATION
EXPLICIT_RESTATEMENT
UNSUPPORTED_STRENGTHENING
QUANTIFIER_SHIFT
WRONG_SCOPE
WRONG_STAKEHOLDER
WRONG_TIMEFRAME
REVERSE_RELATION
CAUSE_EFFECT_OVERREACH
PLAUSIBLE_NOT_REQUIRED
CONSEQUENCE_CONFUSED_WITH_PREMISE
EMOTIONAL_OR_IRRELEVANT_REASON
OVERBROAD_ACTION
AGENCY_MISMATCH
CORRELATION_AS_CAUSATION
TRUE_BUT_NOT_EXPLANATORY
```

Random unrelated distractors are not acceptable production strategy.

## 8. Renderer contract

Default renderer: `STRUCTURED_TEXT`.

The shared renderer must support:

- labelled statement blocks;
- Assertion / Reason blocks;
- Assumption I/II/III;
- Conclusion I/II/III;
- Argument I/II/III;
- Course of Action I/II/III;
- Statement I/II for Cause & Effect;
- source-backed combination-code options.

Logical structure must remain separate from rendered wording.

## 9. Localization

Primary locales:

- `en-IN`
- `hi-IN`
- `pa-IN`

Localization must preserve proposition identity, polarity, quantifier, scope, time, causal direction, answer set and difficulty.

Literal translation is rejected if it changes what is presupposed, entailed, argued, recommended or caused.

Each localized scenario must be reviewed as natural examination language rather than as word-for-word translation.

## 10. Shared difficulty inputs

Common difficulty features include:

- number of propositions;
- number of candidate statements;
- scope/quantifier subtlety;
- number of stakeholders;
- inference depth;
- temporal structure;
- causal depth;
- closeness of distractors;
- negative wording;
- linguistic density.

Each chapter adds its own cognitive factors. Sentence length alone is not difficulty.

## 11. Source-saturation policy

No chapter receives permanent QLs merely because the generator can create a pattern.

For each chapter:

```text
source-pattern collection
-> semantic classification
-> temporary executable prototypes
-> representation/query audit
-> cross-chapter ownership audit
-> merge/split review
-> unsupported-pattern rejection
-> no-known-gap decision
-> permanent QL allocation
```

Source records should summarize exam pattern and structure without storing unnecessary copyrighted bulk question text.

## 12. Inference ownership

The current authoritative Reasoning V1 taxonomy does not define a standalone `REAS-INF` chapter.

Therefore:

- ordinary "which inference follows?" forms are provisionally owned by `STC-001` when their semantic task is entailment from supplied information;
- `INFERENCE` may be a source-backed query/presentation mode inside STC without becoming a separate chapter;
- a future standalone Inference chapter requires its own source/ownership audit proving a materially distinct solving contract.

This decision prevents duplicate engines and syllabus fragmentation.

## 13. Shared lifecycle

At design stage, all six chapters obey:

```text
permanentQlCount:           0 unless already separately frozen
questionStudioDiscoverable: false
questionBankWritable:       false
testEligible:               false
publiclyPublishable:        false
```

A chapter opens downstream gates only after its own source saturation, executable validation, English review, Hindi/Punjabi parity and freeze evidence.

## 14. Design freeze principle

The family design is considered coherent only if the same candidate proposition cannot change meaning merely because a renderer label changed.

Every generated item must have a semantic trace that states:

- what propositions/events/actions are explicit;
- what chapter-specific relation is being tested;
- why each candidate passes or fails that relation;
- what misconception each wrong candidate represents;
- what localized text corresponds to each semantic object.

This trace is admin/review authority and must not leak internal enums into the student-facing explanation.
