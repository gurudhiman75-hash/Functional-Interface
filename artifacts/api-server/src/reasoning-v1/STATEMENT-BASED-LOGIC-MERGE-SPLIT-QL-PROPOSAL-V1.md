# Statement-Based Logic — Merge/Split & Permanent-QL Proposal V1

Status: **MERGE/SPLIT REVIEW COMPLETE / PERMANENT-QL PROPOSAL ONLY**

This document follows Source Audit V1 and Targeted Saturation V2.

It proposes the smallest source-supported semantic QL set that can enter executable discovery. It does **not** freeze or activate permanent IDs yet.

## 1. Governing allocation rules

A new QL is justified only when at least one of the following materially changes:

- solve operation / oracle;
- semantic rule family;
- data authority;
- ambiguity contract;
- distractor ownership;
- explanation proof shape;
- renderer semantics.

The following do **not** by themselves justify a new QL:

- two candidates versus three;
- option-code wording;
- answer order;
- negative query wording;
- statement labels such as `Conclusion` versus `Inference` when the semantic standard is unchanged;
- exam family alone;
- sentence length or topic domain.

## 2. STA-001 — proposed allocation

### Merge decisions

Merge candidate-count and combination-code forms into QL metadata.

Merge scope/quantifier overreach into distractor/misconception metadata rather than dedicated QLs.

Keep materially different hidden-dependency families separate where scenario construction and denial evidence differ.

### Proposed QLs

| Candidate ID | Semantic authority | Source state |
|---|---|---|
| `STA-QL-001` | Core prerequisite / existence / availability / capability dependency | STRONG |
| `STA-QL-002` | Recommendation / policy / decision need-and-efficacy dependency | STRONG |
| `STA-QL-003` | Communication / notice / rule / request audience-purpose dependency | PARTIAL-STRONG |
| `STA-QL-004` | Causal / efficacy bridge assumption required by a claim or recommendation | STRONG |

Core metadata across all four:

```text
candidateCount = 2 | 3
answerSet = semantic subset of candidates
misconceptionClass
sourceProfile
```

### Deferred

Do not allocate permanent QLs yet for:

- advertising-specific assumptions as a separate family;
- comparison / measurement / representativeness assumptions;
- negative-query-only forms.

### Proposed checkpoint shape

```text
STA-CP-001  Core Hidden Dependencies          -> QL-001
STA-CP-002  Prescriptive & Communicative      -> QL-002..004
```

The original six discovery CPs therefore collapse to two semantic implementation checkpoints.

## 3. STC-001 — proposed allocation

### Split decision

Source evidence requires a semantic split between strict deduction and controlled reasonable inference.

Within strict deduction, direct one-step and composed/multi-premise reasoning remain separate QLs because proof construction, distractors and difficulty controls differ materially.

### Proposed QLs

| Candidate ID | Semantic authority | Source state |
|---|---|---|
| `STC-QL-001` | Direct strict entailment / explicit relation / safe paraphrastic consequence | STRONG |
| `STC-QL-002` | Composed strict entailment: conditional, relation-chain, comparison/time or multi-premise closure | STRONG-PARTIAL |
| `STC-QL-003` | Controlled reasonable inference using source-authorized defeasible bridges | STRONG-PARTIAL / NEW EXECUTABLE PROOF REQUIRED |

`queryKind = CONCLUSION | INFERENCE | IMPLICATION` remains presentation/source metadata unless it selects a different inference standard.

### Router exclusion

Formal categorical set reasoning (`all/some/no/only a few`) routes to `SYL-001` and must not consume STC QL IDs.

### Proposed checkpoint shape

```text
STC-CP-001  Strict Deductive Conclusions      -> QL-001..002
STC-CP-002  Controlled Reasonable Inference   -> QL-003
```

The original representation-oriented CP005/CP006 do not survive as permanent checkpoints.

## 4. ARG-001 — proposed allocation

### Merge decisions

Candidate count (2/3), pro/con order, coded options and negative wording are metadata.

Principle/fairness and broad evidence-generalisation families remain deferred because source saturation is incomplete.

### Proposed QLs

| Candidate ID | Semantic authority | Source state |
|---|---|---|
| `ARG-QL-001` | Direct relevance + materiality argument | STRONG |
| `ARG-QL-002` | Consequence / stakeholder-impact argument | STRONG |
| `ARG-QL-003` | Feasibility / resource / implementation-constraint argument | STRONG-PARTIAL |

Each QL retains stance symmetry:

```text
FOR
AGAINST
```

and must support strong/weak outcomes on both sides.

### Deferred

- evidence-quality / generalisation as a standalone QL;
- principle / fairness / institutional-consistency QL;
- Punjab-specific QL variants.

### Proposed checkpoint shape

```text
ARG-CP-001  Relevance & Consequence Arguments -> QL-001..002
ARG-CP-002  Feasibility & Constraints         -> QL-003
```

## 5. COA-001 — proposed allocation

### Merge decisions

Corrective, preventive, capacity and process actions share one suitability oracle and can be differentiated by `actionType` metadata when their proof shape is direct problem -> mechanism -> outcome.

Investigation/verification remains separate because correctness depends on an epistemic gate: whether evidence is sufficient for intervention.

### Proposed QLs

| Candidate ID | Semantic authority | Source state |
|---|---|---|
| `COA-QL-001` | Direct remedial / preventive / service-process action suitability | STRONG |
| `COA-QL-002` | Investigation / verification / evidence-before-intervention suitability | STRONG |

`actionType` remains metadata inside QL-001:

```text
CORRECTIVE
PREVENTIVE
CAPACITY
PROCESS_CHANGE
TRAINING
INFORMATIONAL
MONITORING
```

### Deferred

- sequencing/prerequisite between two actions as a dedicated QL;
- mutually-exclusive alternatives as a dedicated QL;
- three-action presentation as QL identity.

### Proposed checkpoint shape

```text
COA-CP-001  Direct Action Suitability         -> QL-001
COA-CP-002  Evidence & Investigation Gate     -> QL-002
```

## 6. CAE-001 — proposed allocation

### Merge decision

The classic coded family is one QL because the learner always performs the same pair-classification operation and the semantic outcome varies by generated graph.

### Proposed QL

| Candidate ID | Semantic authority | Source state |
|---|---|---|
| `CAE-QL-001` | Two-event causal relationship classification | STRONG CORE |

Required internal outcomes include at least:

```text
A_CAUSES_B
B_CAUSES_A
EFFECTS_OF_INDEPENDENT_CAUSES
EFFECTS_OF_COMMON_CAUSE
UNRELATED_OR_INDEPENDENT_EVENTS   // only where source profile exposes this distinctly
```

Exact option-code mapping remains source-profile metadata.

### Discovery reserve — no permanent ID yet

```text
IMMEDIATE_AND_PRINCIPAL_CAUSE
EFFECT_BUT_NOT_IMMEDIATE_PRINCIPAL
MEDIATED_CAUSE
CONTRIBUTING_CAUSE
MULTI_CAUSE
```

The engine may prototype these, but they do not receive a permanent QL until target-exam source closure.

### Proposed checkpoint shape

```text
CAE-CP-001  Classic Cause/Effect Pair Classification -> QL-001
```

## 7. ASM-001 — allocation withheld

### Decision

**No permanent ASM QL is proposed in V1.**

Reason:

- Banking section-level evidence confirms Assertion & Reason belongs in Logical Reasoning;
- SSC provides abundant A/R format evidence, but much is General Awareness;
- the exact semantic/truth-authority shape of source-verified Banking reasoning items has not yet been recovered strongly enough to allocate a stable generation contract.

Premature allocation would risk designing a knowledge-subject format rather than a reasoning QL.

### Allowed work

Executable discovery may build temporary prototypes for:

```text
ASM-PROT-001  self-contained truth + explanation
ASM-PROT-002  curated stable-knowledge truth + explanation
```

but both remain temporary until item-level source comparison proves which belongs in `REAS-ASM`.

## 8. Proposed family total

If this proposal survives executable discovery and final no-known-gap review:

```text
STA  4 candidate permanent QLs
STC  3 candidate permanent QLs
ARG  3 candidate permanent QLs
COA  2 candidate permanent QLs
CAE  1 candidate permanent QL
ASM  0 allocated yet
-------------------------------
Total proposed now: 13 QLs
```

This is intentionally much smaller than the discovery inventory. Variety lives in scenario families, rule metadata, candidate count, misconception construction, source profiles and seeded instances—not in artificial QL inflation.

## 9. Required executable gate before IDs become permanent

For every proposed QL:

1. implement a temporary prototype with the proposed semantic boundary;
2. produce a materially independent oracle trace;
3. run cross-QL collision tests;
4. verify candidate-count/presentation variants do not require QL splits;
5. generate review corpora across SSC / Banking / Punjab where supported;
6. confirm difficulty and misconception diversity;
7. re-run cross-chapter router tests;
8. perform no-known-gap review;
9. only then change `PROPOSED` to `PERMANENT` and freeze IDs.

## 10. Lifecycle consequence

```text
permanentQlAllocationAuthorized: false
proposedQlCount:                 13
asmPermanentQlCount:             0
questionStudioDiscoverable:      false
questionBankWritable:            false
testEligible:                    false
publiclyPublishable:             false
```

Next step: executable prototype/collision proof for the 13 proposed QLs plus temporary ASM prototypes.
