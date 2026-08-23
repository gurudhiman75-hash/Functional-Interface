# Statement-Based Logic — Source-Audit Design Amendments V1

Status: **AUTHORITATIVE AMENDMENT TO THE SIX CHAPTER DESIGN DOCUMENTS**

This amendment supersedes conflicting pre-audit wording in the original end-to-end designs. It does not allocate permanent QLs.

---

## 1. STA-001 amendment — candidate count is core metadata

Replace any implication that three-assumption forms are merely advanced presentation.

Canonical source-profile dimension:

```ts
type StaCandidateCount = 2 | 3 | number;
```

Rules:

1. `2` and `3` are both ordinary supported candidate counts when the selected source profile allows them.
2. Candidate count alone does not create a QL or permanent checkpoint.
3. Combination-option mappings belong to source-profile metadata.
4. Three-assumption SSC forms must receive deterministic outcome-balance and option-uniqueness tests.
5. `STA-CP-006` remains a discovery label only until merge/split review; it may collapse into semantic CPs.

Source-supported priority after V1 audit:

```text
HIGH: core dependency
HIGH: recommendation/policy/decision
HIGH: efficacy/causal bridge
HIGH: 2- and 3-assumption combination handling
MEDIUM: notice/rule/communication
PENDING: broad advertisement/appeal
PENDING: comparison/measurement/representativeness
```

---

## 2. STC-001 amendment — two inference standards

The original statement that every valid STC answer must be strict entailment is replaced by source-profiled inference semantics.

```ts
type StcInferenceStandard =
  | "STRICT_ENTAILMENT"
  | "CONTROLLED_REASONABLE_INFERENCE";
```

### 2.1 STRICT_ENTAILMENT

Use when source instructions/answer behavior require definite logical following.

Oracle:

```text
explicit propositions
-> licensed deductive closure
-> ENTAILED / CONTRADICTED / UNDETERMINED
```

No outside premise or defeasible bridge is allowed.

### 2.2 CONTROLLED_REASONABLE_INFERENCE

Use only for source profiles whose observed answer convention accepts a reasonable conclusion/inference not deductively forced by the literal statement.

Canonical representation:

```ts
interface StcDefeasibleBridge {
  bridgeId: string;
  antecedentPattern: string;
  consequentPattern: string;
  allowedModality: "MAY" | "LIKELY" | "INDICATES" | "SUPPORTS";
  sourceProfileIds: readonly string[];
  sourceEvidenceRefs: readonly string[];
  editorialStatus: "DRAFT" | "REVIEWED" | "FROZEN";
}
```

Oracle requirements:

1. bridge must be explicitly present in the scenario/source profile;
2. candidate must match the bridge consequence at the approved modality;
3. stronger wording than the bridge permits is rejected;
4. bridge direction must be audited;
5. unrelated plausible world knowledge remains prohibited;
6. the explanation must say that the statement **supports/indicates/makes possible** the conclusion rather than falsely claiming necessity.

### 2.3 STC versus STA

A defeasible STC bridge is downstream:

```text
shown fact -> supported inference
```

An STA dependency is upstream:

```text
hidden precondition -> statement/action rationale
```

The same proposition may not be classified by both semantics in one question instance.

### 2.4 STC versus SYL

A routing gate is mandatory:

```ts
if (primarySolveMode === "CATEGORICAL_SET_RELATION") routeTo("SYL-001");
```

Surface words `statement` and `conclusion` do not establish STC ownership.

### 2.5 Checkpoint consequence

`STC-CP-005` is no longer presentation-only in discovery. It becomes a candidate semantic family for `CONTROLLED_REASONABLE_INFERENCE` pending source saturation and collision testing.

---

## 3. ARG-001 amendment — material conflict and three-argument support

Banking source evidence confirms that argument sets may contain three candidates and that strong/weak judgement can depend on competing material consequences.

Add:

```ts
interface ArgConflictEvidence {
  candidateIds: readonly string[];
  relation:
    | "INDEPENDENT"
    | "COMPETING_CONSEQUENCES"
    | "ONE_DOMINATES_UNDER_SOURCE_RUBRIC"
    | "BOTH_MATERIAL";
  rationaleRefs: readonly string[];
}
```

Rules:

1. relevance is necessary but not always sufficient for strength;
2. materiality may be comparative when source convention explicitly weighs consequences;
3. two- and three-argument sets are both source-supported in Banking evidence;
4. candidate count alone does not create a permanent QL;
5. political/ideological agreement remains prohibited as strength authority.

Source-supported priority:

```text
HIGH: relevance/materiality
HIGH: consequence/stakeholder impact
HIGH: two-argument format
MEDIUM-HIGH: three-argument Banking format
MEDIUM: feasibility/resource/risk
PENDING: broad principle/fairness family as a permanent semantic group
```

---

## 4. COA-001 amendment — evidence sufficiency before intervention

Add a first-class suitability dimension:

```text
EVIDENCE_SUFFICIENCY_BEFORE_INTERVENTION
```

The oracle must be able to distinguish:

```text
problem confirmed -> direct remedy may follow
complaint/suspicion only -> investigation may be required before punitive/compensatory remedy
urgent known hazard -> delaying solely for investigation may fail
```

Conceptual field:

```ts
verificationState:
  | "FACTS_SUFFICIENT_FOR_ACTION"
  | "VERIFICATION_REQUIRED_FIRST"
  | "IMMEDIATE_ACTION_REQUIRED";
```

This dimension is independent of ordinary relevance and feasibility.

Two-action formats are strongly source-supported. Three-action and explicit sequential/dependency forms remain source-saturation targets rather than frozen permanent structures.

---

## 5. CAE-001 amendment — exact independence semantics

Preserve separate internal relations:

```text
INDEPENDENT_CAUSES
EFFECTS_OF_INDEPENDENT_CAUSES
EFFECTS_OF_COMMON_CAUSE
UNRELATED_EVENTS
```

Do not collapse them merely because a coaching convention uses similar language.

Source profiles map their exact option vocabulary to the internal relation they actually mean.

Core direct/reverse/common-cause/independent-effect semantics are source-confirmed by Punjab-state evidence.

`MEDIATED_*`, `CONTRIBUTING_*` and larger multi-cause structures remain discovery-only until additional source evidence is found.

---

## 6. ASM-001 amendment — source-section ownership + first-class knowledge authority

### 6.1 Required routing metadata

```ts
interface AsmSourceOwnership {
  sourceSection:
    | "REASONING"
    | "GENERAL_AWARENESS"
    | "SUBJECT_KNOWLEDGE"
    | "UNKNOWN";
  reasoningOwnershipConfidence: "HIGH" | "MEDIUM" | "LOW";
  owningProductChapter?: string;
}
```

Rule:

> Assertion/Reason is a format. `REAS-ASM` ownership requires reasoning-section evidence or explicit product authority.

An SSC factual A/R item from GA must not be counted toward Reasoning source saturation.

### 6.2 Truth authority priority

The previous preference for self-contained truth is removed.

Both are first-class source-profile modes:

```text
CURATED_STABLE_KNOWLEDGE
SELF_CONTAINED
```

Current evidence makes `CURATED_STABLE_KNOWLEDGE` mandatory for authentic coverage.

### 6.3 Knowledge registry contract

```ts
interface AsmKnowledgeFact {
  factId: string;
  domain: string;
  proposition: LogicProposition;
  truthValue: boolean;
  sourceRefs: readonly string[];
  verifiedAt: string;
  volatility: "STABLE" | "SLOW_CHANGING" | "CURRENT";
  allowedSourceProfiles: readonly string[];
  status: "DRAFT" | "REVIEWED" | "FROZEN" | "DISABLED";
}
```

`CURRENT` facts are not automatically eligible. A source profile must explicitly permit them and freshness gates must pass.

### 6.4 Answer profiles

Four-state A/R coding is strongly source-supported.

Five-state coding including `A_FALSE_R_FALSE` is supported by banking-oriented material but remains source-profile-dependent for permanent production.

---

## 7. Shared family amendment — source profile envelope

All six designs now require a source profile envelope conceptually equivalent to:

```ts
interface StatementLogicSourceProfile {
  sourceProfileId: string;
  examFamily: string;
  examName: string;
  year?: number;
  session?: string;
  sourceSection?: string;
  evidenceClass: "A" | "B" | "C";
  evidenceConfidence: "HIGH" | "MEDIUM" | "LOW";
  candidateCount?: number;
  answerProfileId: string;
  inferenceStandard?: "STRICT_ENTAILMENT" | "CONTROLLED_REASONABLE_INFERENCE";
  truthAuthority?: "SELF_CONTAINED" | "CURATED_STABLE_KNOWLEDGE";
  ownershipChapter: string;
  ownershipConfidence: "HIGH" | "MEDIUM" | "LOW";
}
```

This envelope is discovery/review metadata, not student-facing content.

---

## 8. Freeze effect

These amendments freeze the following architecture decisions before implementation:

1. no generic natural-language oracle;
2. candidate count does not define QL identity;
3. STC has source-profiled strict and controlled-reasonable inference standards;
4. categorical set-conclusion questions route to Syllogism;
5. COA explicitly models evidence sufficiency before action;
6. CAE preserves exact causal independence semantics;
7. ASM requires source-section ownership and first-class curated knowledge;
8. permanent QLs remain unallocated until source saturation and merge/split review.

Implementation remains closed pending the next source-saturation pass.