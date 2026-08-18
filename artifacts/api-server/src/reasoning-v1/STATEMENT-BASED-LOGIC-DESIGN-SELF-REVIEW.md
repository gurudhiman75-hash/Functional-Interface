# Statement-Based Logic — Critical Design Self-Review

Status: **PASSED WITH GOVERNANCE CLARIFICATIONS**

Scope:

- `STA-001 — Statement & Assumption`
- `STC-001 — Statement & Conclusion`
- `ARG-001 — Statement & Argument`
- `COA-001 — Course of Action`
- `CAE-001 — Cause & Effect`
- `ASM-001 — Assertion & Reason`
- shared `STATEMENT-BASED-LOGIC-FAMILY-DESIGN.md`

## 1. Taxonomy review — PASS

The six chapters test materially different verdict relations and must remain separate.

```text
STA -> required unstated dependency
STC -> entailment from explicit evidence
ARG -> argument strength/relevance
COA -> action suitability
CAE -> causal relation classification
ASM -> A truth + R truth + explanation link
```

No generic natural-language `isCorrect()` oracle is acceptable.

## 2. Inference duplication review — PASS WITH DECISION

A standalone `Inference` chapter is not present in the authoritative Reasoning V1 master taxonomy.

Decision:

- source-backed inference/implication wording belongs provisionally inside `STC-001` when the semantic task is entailment;
- a separate chapter requires future evidence of a different solving contract;
- no `REAS-INF` code is invented in this design wave.

## 3. Premature QL/checkpoint inflation review — PASS WITH CLARIFICATION

No permanent QL count has been allocated.

Several designs include a final discovery section for multi-I/II/III, coded or negative presentation formats. These are **provisional representation-validation tracks**.

They do not automatically survive as permanent checkpoints or QLs.

During source saturation they must be:

- merged into semantic checkpoints if they only change presentation;
- retained as a checkpoint only if they require a materially distinct runtime/data contract;
- rejected if unsupported by source evidence.

This clarification applies especially to:

```text
STA-CP-006
STC-CP-006
ARG-CP-006
COA-CP-006
CAE-CP-006
ASM-CP-006
```

Their current IDs are discovery labels only.

## 4. Shared-abstraction review — PASS WITH DELAYED EXTRACTION

The shared proposition IR is conceptual authority, not a command to build a large common framework first.

Implementation rule:

1. implement the first chapter against the shared semantic concepts;
2. implement a second chapter independently enough to expose actual overlap;
3. extract only proven common structures;
4. keep answer oracles chapter-owned.

This avoids a premature universal "critical reasoning engine".

## 5. Statement & Assumption review — PASS

Strengths:

- hidden dependency graph is the correct core abstraction;
- denial test is represented semantically, not through naive string negation;
- necessary assumption is separated from plausible/supportive propositions;
- free-form LLM judgement is prohibited.

Watch item for source saturation:

- confirm which discourse-act and advanced comparison/measurement forms are genuinely present in target exams before permanent allocation.

## 6. Statement & Conclusion review — PASS

Strengths:

- explicit-evidence closure is separated from hidden assumptions;
- `ENTAILED / CONTRADICTED / UNDETERMINED` are distinct internally;
- converse, quantifier, scope and outside-information traps are modeled;
- inference wording is absorbed only when its semantics are entailment.

Watch item:

- categorical all/some/none chains must not duplicate Syllogism ownership.

## 7. Statement & Argument review — PASS WITH SUBJECTIVITY CONTROL

Argument strength is the most editorially sensitive chapter.

Required controls are adequate only if production uses:

- curated issue scenarios;
- argument-kind-specific rubrics;
- scenario-authorized facts/principles;
- explicit defect tags;
- editorial/oracle parity tests;
- neutral topics.

`materiality`, `risk` and `principle` must be represented by scenario metadata rather than guessed from arbitrary prose at runtime.

Political/ideological agreement must never be used as a strength criterion.

## 8. Course of Action review — PASS WITH SUBJECTIVITY CONTROL

Action suitability is correctly separated from argument strength.

Production must ground:

- problem target;
- actor/agency;
- mechanism;
- constraints;
- proportionality;
- sequencing/complementarity.

The engine must not reward severity, punishment or "doing something" as inherently better than verification, prevention or a narrower remedy.

## 9. Cause & Effect review — PASS

Graph-based causal authority is appropriate.

Critical protections are present:

- display order cannot determine causal direction;
- chronology alone is insufficient;
- correlation alone is insufficient;
- common-cause and independence are first-class;
- mechanisms are curated.

Watch item:

- answer-code formats vary by source, so internal relation taxonomy must remain separate from student-facing codes.

## 10. Assertion & Reason review — PASS

The three-pass structure is mandatory:

```text
truth(A)
truth(R)
explains(R, A) only when both true
```

This prevents the common structural error of equating "both true" with "R explains A".

Self-contained reasoning scenarios should be preferred initially.

External stable-knowledge packs are allowed only after source evidence and must carry factual governance independent of the reasoning engine.

## 11. Localization review — PASS

The designs correctly treat these chapters as meaning-sensitive rather than word-replacement tasks.

Highest-risk features for Hindi/Punjabi parity:

- negation scope;
- may/can/must modality;
- all/some/most quantifiers;
- causal direction;
- condition direction;
- actor/agency;
- explanatory connectives;
- implicitness/presupposition.

Localized parity must be checked against semantic fingerprints, not only answer index.

## 12. Explanation review — PASS

All chapter designs require applied, question-specific explanations.

Shared editorial rule:

- explain why the candidate passes/fails the chapter-specific relation;
- name the decisive supplied fact, dependency, mechanism, defect or truth proof;
- do not expose enum IDs;
- do not output generic "I follows / II does not" text without reasoning.

## 13. Question Studio review — PASS

All downstream gates remain closed.

Question Studio should open only after each chapter has:

- source saturation;
- permanent QL allocation;
- executable oracle parity;
- English editorial freeze;
- Hindi/Punjabi parity freeze;
- review-export approval.

## 14. Design-wave verdict

```text
taxonomy:                         PASS
chapter boundaries:               PASS
shared semantic concept model:    PASS
answer-oracle separation:         PASS
source-first governance:          PASS
permanent QL restraint:           PASS
multilingual architecture:        PASS
Question Studio gating:           PASS
critical blocking design defects: NONE
```

The design wave is complete enough to serve as architecture authority.

It is **not source-saturated and not implementation-frozen at the permanent-Ql level**. The next program-level activity should be source-pattern/ownership audit planning, followed by executable discovery one chapter at a time.
