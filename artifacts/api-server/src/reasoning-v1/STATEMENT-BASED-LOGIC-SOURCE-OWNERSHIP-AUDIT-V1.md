# Statement-Based Logic — Source Pattern & Ownership Audit V1

Status: **SOURCE AUDIT V1 COMPLETE / DESIGN AMENDMENTS REQUIRED BEFORE IMPLEMENTATION**

Scope:

- `STA-001 — Statement & Assumption`
- `STC-001 — Statement & Conclusion`
- `ARG-001 — Statement & Argument`
- `COA-001 — Course of Action`
- `CAE-001 — Cause & Effect`
- `ASM-001 — Assertion & Reason`

Target exams:

- SSC family;
- Banking/insurance family;
- Punjab state family.

This audit reviews **pattern structure and chapter ownership**, not bulk copyrighted question text. Source examples are summarized rather than copied.

---

## 1. Evidence policy

Evidence is classified as:

- `A — mirrored official-paper item`: a preparation platform identifies a specific official exam, date/shift or official paper;
- `B — exam-analysis/syllabus evidence`: exam analysis or structured preparation source ties a pattern to an exam family;
- `C — coaching/practice evidence`: useful for discovery only; insufficient alone for permanent allocation.

A single source does not freeze a QL. Permanent QLs still require pattern clustering, duplicate review and executable proof.

Important reliability rule:

> a preparation platform's explanation is not automatically semantic truth. It is evidence of an exam-facing answer convention. Where source answers reveal a looser convention than formal logic, ExamTree must model that convention explicitly rather than silently corrupt a strict oracle.

---

# 2. Executive findings

## 2.1 Chapter separation survives

The six chapter boundaries remain materially distinct:

```text
STA -> unstated required dependency
STC -> conclusion/inference supported by supplied evidence under source-profile inference standard
ARG -> strong/weak reason bearing on an issue
COA -> suitable/unsuitable response to a stated problem
CAE -> causal relation between displayed events
ASM -> A truth + R truth + explanation relation
```

No evidence justifies collapsing them into one generic statement-reasoning chapter.

## 2.2 Three design corrections are mandatory

### Correction A — STC cannot use one universal strict-entailment standard

Recent SSC CGL 2025 mirrored-paper items include both:

- strict conclusions such as a direct equivalent of "no student failed" -> "all students passed";
- looser, source-approved interpretations such as a large nationwide applicant count supporting popularity/competition, or exceptional rainfall supporting a modal possibility about infrastructure failure.

Therefore STC requires at least two source-profile inference standards:

```text
STRICT_ENTAILMENT
CONTROLLED_REASONABLE_INFERENCE
```

`CONTROLLED_REASONABLE_INFERENCE` is **not** unrestricted commonsense. It must use curated defeasible bridge rules stored in the scenario authority.

### Correction B — three-assumption STA is current/core SSC presentation

SSC CGL 2025 mirrored-paper items repeatedly present one statement followed by **three assumptions**, with answer options selecting combinations such as I+II or all three.

Therefore I/II/III handling cannot remain merely an "advanced presentation" afterthought. Candidate count is a first-class source-profile dimension from foundation onward.

### Correction C — ASM ownership requires section metadata

Assertion & Reason is clearly present across competitive-exam preparation and banking reasoning analyses, but many recent SSC mirrored-paper examples are factual/knowledge-based and may belong to General Awareness rather than General Intelligence.

Therefore source records for ASM must include:

```text
exam
paper/date/shift where known
sourceSection
truthDomain
reasoningOwnershipConfidence
```

An SSC factual Assertion & Reason item must **not** be used as evidence for `REAS-ASM` unless its section ownership is established.

Banking evidence does support Assertion & Reason as a reasoning topic, including a 2020 IBPS PO exam-analysis pattern.

---

# 3. STA-001 — Statement & Assumption

## 3.1 Strongly observed patterns

Evidence class A from SSC CGL 2025 mirrored-paper items supports:

- policy/regulatory decisions with efficacy assumptions;
- recommendation/prevention statements;
- causal/ethical-risk bridges;
- scope-overreach distractors;
- two-assumption direct forms;
- three-assumption combination forms.

Representative source summaries:

1. SSC CGL 2025: stricter industrial-pollution regulation; valid assumptions include pollution relevance and regulatory efficacy, while an exclusive/primary-cause overreach is rejected.
2. SSC CGL 2025: ethical frameworks evolving with automation; risk relevance and update need are treated as implicit while total labour replacement is rejected.
3. SSC CGL 2025: public-transport investment to reduce congestion; efficacy and stated cost are treated differently from an extra behavioural claim.
4. SSC CGL 2025: classroom mobile-phone prohibition; purpose/problem and real applicability of the rule are treated as implicit.
5. SSC CGL 2025: railway ticket-price reduction; demand-response assumption is implicit while an airline-competition motive is not necessary.

## 3.2 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Core necessary dependency | `CONFIRMED` |
| Recommendation / policy / decision | `CONFIRMED` |
| Communication / notice / advertisement | `PARTIAL — notice/rule supported; advertising breadth still source-dependent` |
| Causal / efficacy bridge | `CONFIRMED` |
| Comparison / measurement / representativeness | `SOURCE-DEPENDENT — insufficient direct evidence in V1 sample` |
| Multi-assumption/coded representation | `CONFIRMED`, but candidate count must move into core source profile |

## 3.3 Required amendment

- add `candidateCount: 2 | 3 | source-specific` to the core scenario/query contract;
- treat three assumptions as ordinary SSC-capable production after source-profile validation;
- do not create a permanent CP solely for candidate count;
- retain comparison/measurement families as discovery-only until better evidence exists.

---

# 4. STC-001 — Statement & Conclusion / Inference

## 4.1 Observed source split

Recent SSC CGL 2025 mirrored-paper evidence shows two materially different answer standards.

### Strict logical forms

Observed examples include:

- direct negation/equivalence (`none failed` -> `all passed`);
- categorical/set relations that are actually Syllogism and must be routed away from STC;
- rejection of salary/popularity explanations when the statement only reports fewer applicants.

### Controlled reasonable-inference forms

Other SSC CGL / SSC Stenographer 2025 mirrored-paper examples accept conclusions such as:

- very high nationwide participation supporting a popularity/competition interpretation;
- compulsory computer training supporting the importance of computer knowledge;
- unusually severe rainfall supporting a modal possibility of drainage failure.

These are not strict first-order entailments from the literal statement.

## 4.2 Ownership correction

Formal all/some/no categorical statements remain `SYL-001`, even when the surface instruction says "identify the conclusion".

The chapter router must inspect **solve method**, not heading text.

## 4.3 Required inference standards

```ts
type StcInferenceStandard =
  | "STRICT_ENTAILMENT"
  | "CONTROLLED_REASONABLE_INFERENCE";
```

### STRICT_ENTAILMENT

Candidate must be in the licensed deductive closure.

Internal states:

```text
ENTAILED
CONTRADICTED
UNDETERMINED
```

### CONTROLLED_REASONABLE_INFERENCE

Candidate may be supported by an explicitly curated defeasible bridge such as:

```text
VERY_HIGH_PARTICIPATION -> INDICATES_POPULARITY
MANDATORY_SKILL_TRAINING -> INSTITUTION_TREATS_SKILL_AS_IMPORTANT
EXTREME_EVENT -> MAY_STRESS_RELEVANT_INFRASTRUCTURE
```

Required constraints:

- bridge is source-profile-approved;
- candidate modality is preserved (`may`, `likely`, `indicates` are not `must`);
- no unrestricted runtime world-knowledge inference;
- bridge strength is independently audited;
- distractors can test unsupported explanations versus supported defeasible inference.

## 4.4 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Direct entailment | `CONFIRMED` |
| Condition/scope/quantifier | `CONFIRMED IN PRINCIPLE`; formal categorical cases route to Syllogism |
| Multi-statement integration | `RETAIN — source expansion needed` |
| Comparison/time/quantity | `RETAIN — source expansion needed` |
| Inference/interpretation | `CONFIRMED`, but semantic mode not merely presentation |
| Multi-conclusion representation | `CONFIRMED` for I/II; three-way formats still source-dependent |

## 4.5 Design consequence

STC-CP-005 must no longer be described as presentation-only. Source evidence shows that `INFERENCE` can carry a genuinely different evidential standard. Permanent CP boundaries will be decided after executable collision testing.

---

# 5. ARG-001 — Statement & Argument

## 5.1 Direct evidence

SSC CGL 2017 mirrored official-paper items support the classic form:

```text
Should X be done?
Argument I ...
Argument II ...
-> judge strong/weak
```

Observed semantic distinctions include:

- foreign-exchange consequence as a material reason;
- unrelated expert preference as weak;
- public-safety consequence as strong;
- resource-saving argument becoming weak when it ignores a materially larger safety consequence;
- irrelevant reasons on both sides yielding neither strong.

## 5.2 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Direct relevance/materiality | `CONFIRMED` |
| Stakeholder/public consequence | `CONFIRMED` |
| Feasibility/resource | `PARTIAL-CONFIRMED` |
| Evidence/generalisation/risk | `PARTIAL — statistics/risk observed; broader evidence rubric needs sources` |
| Principle/fairness/rule consistency | `SOURCE-DEPENDENT` |
| Multi-argument representation | `TWO-ARGUMENT CONFIRMED`; three-argument/coded variants not yet saturated |

## 5.3 Design verdict

The structured-rubric approach survives. However, the implementation must support **priority/conflict of material consequences**: an argument can be relevant yet weak because a directly competing consequence dominates the decision under the source convention.

No universal ideological/value oracle is permitted.

---

# 6. COA-001 — Course of Action

## 6.1 Strong exam evidence

Mirrored official-paper evidence includes:

- SSC CGL 2022 Tier-II: technical errors -> corrective checking/accountability actions;
- SSC CGL 2024 Tier-II: refund delays -> inquiry follows while immediate compensation may be premature;
- SSC CHSL 2025: delayed ambulance service -> capacity/tracking action follows while shutting service is extreme/self-defeating;
- Punjab Civil Service 2018 CSAT: forecast low rainfall -> preparedness/water-arrangement actions.

These directly support the design's relevance, agency, feasibility, proportionality and investigation-before-remedy dimensions.

## 6.2 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Direct corrective | `CONFIRMED` |
| Preventive/risk reduction | `CONFIRMED` |
| Investigation/verification | `CONFIRMED` |
| Administrative/service/process | `CONFIRMED` |
| Complementary/sequential/alternative | `PARTIAL — both-valid observed; explicit dependency sequencing needs more sources` |
| Multi-action representation | `TWO-ACTION CONFIRMED`; three-action forms remain source-dependent |

## 6.3 Important source convention

A reasonable inquiry/verification step can be correct precisely because a more drastic remedy is premature. The action oracle must therefore model:

```text
EVIDENCE_SUFFICIENCY_BEFORE_INTERVENTION
```

not merely `relevance + feasibility`.

---

# 7. CAE-001 — Cause & Effect

## 7.1 Punjab-state evidence is especially strong

Punjab Police SI 2016 mirrored official-paper items explicitly use a coded relation family distinguishing:

- Statement I causes Statement II;
- Statement II causes Statement I;
- both statements are effects of independent causes;
- both statements are effects of a common cause.

This is direct support for keeping CAE separate from STA/STC.

## 7.2 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Direct cause -> effect | `CONFIRMED` |
| Reverse direction | `CONFIRMED` |
| Common cause | `CONFIRMED` |
| Independent effects / no direct relation | `CONFIRMED` |
| Mediated/contributing/multi-cause | `SOURCE-DEPENDENT` |
| Coded two-statement presentation | `CONFIRMED` |

## 7.3 Answer-profile correction

Do not assume that `INDEPENDENT_CAUSES` and `EFFECTS_OF_INDEPENDENT_CAUSES` are interchangeable.

The source profile must preserve exact semantic wording. If a source distinguishes independent causes from effects of independent causes, both need separate internal mappings.

---

# 8. ASM-001 — Assertion & Reason

## 8.1 Pattern evidence

Recent SSC mirrored official-paper items repeatedly use the four-state pattern:

```text
A true, R true, R explains A
A true, R true, R does not explain A
A true, R false
A false, R true
```

Banking preparation sources and a Testbook IBPS PO 2020 exam analysis also place Assertion & Reason within reasoning/critical reasoning, including reports of 2–5 questions in one shift.

Five-state practice profiles including `A false, R false` also exist in banking-oriented material.

## 8.2 Critical ownership warning

Many recent SSC examples are factual history/economics/science/current-affairs items. Their surface format is Assertion & Reason, but they may belong to General Awareness rather than General Intelligence.

Therefore:

- `format == ASSERTION_REASON` does not imply `chapter == REAS-ASM`;
- source-section ownership is mandatory metadata;
- SSC GA Assertion & Reason should be routed to the owning knowledge subject if Examtree models that subject;
- `REAS-ASM` should contain only source-verified reasoning-section profiles or explicitly product-approved cross-domain reasoning content.

## 8.3 Truth-authority correction

The initial design preferred self-contained truth authority. Source evidence shows that **curated stable knowledge must be first-class**, at least for authentic competitive-exam coverage.

Production modes become:

```text
CURATED_STABLE_KNOWLEDGE   // source-proven, first-class
SELF_CONTAINED             // supported where source-backed
```

No unrestricted LLM/world-knowledge truth judgement is allowed.

## 8.4 Checkpoint verdict

| Planned area | Audit verdict |
|---|---|
| Self-contained rule forms | `RETAIN, but not proven dominant` |
| Definition/property/principle | `CONFIRMED through knowledge-backed forms` |
| Causal/mechanistic explanation | `CONFIRMED` |
| Conditional/comparative/rule application | `PARTIAL` |
| True-but-not-explanation | `CONFIRMED` |
| Four/five-state answer profiles | `FOUR-STATE CONFIRMED; five-state banking/practice supported, permanent mapping source-dependent` |

---

# 9. Cross-chapter collision audit

## 9.1 STA vs STC

Same scenario can produce both, but direction differs:

```text
STA: hidden precondition required by the speaker's act
STC: downstream conclusion/inference supported by displayed evidence
```

A reasonable-inference bridge in STC must be explicitly marked as defeasible; it must not be mistaken for a hidden assumption.

## 9.2 STC vs Syllogism

Surface labels such as `Statement` and `Conclusion` are insufficient.

If the semantic core is categorical set inclusion/exclusion (`all/some/no`), route to `SYL-001`.

## 9.3 ARG vs COA

```text
ARG candidate = reason for/against a decision
COA candidate = action to take
```

A sentence with a modal verb is not enough to determine ownership; semantic role decides.

## 9.4 STA vs COA

A recommendation can be:

- the **statement** whose hidden dependency is tested in STA; or
- the **candidate action** whose suitability is tested in COA.

The question target determines chapter ownership.

## 9.5 CAE vs ASM

CAE classifies relation between displayed events.

ASM first determines A truth and R truth, then tests explanation. A causal edge alone cannot determine ASM answer state.

## 9.6 ASM vs knowledge subjects

Assertion & Reason is a **format** as well as a reasoning task. Source-section metadata must prevent factual GA items from being misclassified into Reasoning merely because they use A/R labels.

---

# 10. Shared source-profile metadata required

Before executable discovery, all six chapters should use a shared evidence envelope conceptually equivalent to:

```ts
interface StatementLogicSourceProfile {
  sourceProfileId: string;
  examFamily: "SSC" | "BANKING" | "PUNJAB_STATE" | string;
  examName: string;
  year?: number;
  paperDateOrSession?: string;
  sourceSection?: string;
  sourceEvidenceClass: "A" | "B" | "C";
  sourceConfidence: "HIGH" | "MEDIUM" | "LOW";
  candidateCount?: number;
  answerProfileId: string;
  inferenceStandard?: "STRICT_ENTAILMENT" | "CONTROLLED_REASONABLE_INFERENCE";
  truthAuthority?: "SELF_CONTAINED" | "CURATED_STABLE_KNOWLEDGE";
  ownershipChapter: string;
  ownershipConfidence: "HIGH" | "MEDIUM" | "LOW";
}
```

This metadata belongs in source/discovery authority. It should not be exposed to students.

---

# 11. Source-saturation state after V1

| Chapter | V1 state | Blocking gaps before permanent QLs |
|---|---|---|
| STA | `STRONG PARTIAL SATURATION` | comparison/measurement breadth; advertising/appeal breadth; source-profile candidate-count inventory |
| STC | `STRONG PARTIAL SATURATION + DESIGN CORRECTION` | define/validate strict vs reasonable-inference profiles; isolate Syllogism contamination |
| ARG | `PARTIAL SATURATION` | current Banking/Punjab evidence; principle/fairness; multi-argument forms |
| COA | `STRONG PARTIAL SATURATION` | explicit sequential/complementary forms; three-action source evidence |
| CAE | `STRONG CORE SATURATION` | mediated/contributing/multi-cause evidence; broader Banking/SSC profile comparison |
| ASM | `PARTIAL SATURATION + OWNERSHIP CORRECTION` | source-section verification; reasoning-vs-GA routing; five-state production evidence |

No chapter is yet `SOURCE_SATURATED` for permanent QL allocation.

---

# 12. Implementation gate

Do **not** start chapter implementation yet.

Required next audit wave:

1. expand source evidence specifically into Banking and Punjab for STA/STC/ARG/COA;
2. isolate current SSC Syllogism items from STC heading contamination;
3. formalize and test `CONTROLLED_REASONABLE_INFERENCE` for STC;
4. verify ASM source-section ownership before counting SSC factual A/R items;
5. search for source-backed three-action/three-argument and advanced CAE forms;
6. then perform merge/split and permanent-QL proposal.

This is a deliberate source-saturation gate, not an implementation delay caused by missing code.