# Statement-Based Logic — Targeted Saturation V2

Status: **TARGETED SATURATION COMPLETE / MERGE-SPLIT REVIEW READY**

This pass follows `STATEMENT-BASED-LOGIC-SOURCE-OWNERSHIP-AUDIT-V1.md` and closes the five explicitly targeted gaps before permanent-QL review.

## 1. STC controlled-reasonable inference bridges

Recent SSC mirrored-paper evidence confirms that `Statement & Conclusion / Inference` cannot use one universal strict-entailment standard.

The following bridge families are now authorized for executable discovery only:

```text
HIGH_PARTICIPATION -> INDICATES_POPULARITY_OR_COMPETITION
MANDATED_REQUIREMENT -> INDICATES_INSTITUTIONAL_IMPORTANCE
EXTREME_EVENT -> MAY_STRESS_RELEVANT_INFRASTRUCTURE
```

These are not free commonsense rules. Each bridge must carry:

- source-profile authority;
- allowed antecedent frames;
- allowed consequent frames;
- allowed modality (`indicates`, `may`, `likely` etc.);
- forbidden strengthening;
- counterexample/ambiguity tests;
- locale-safe rendering notes.

A bridge may support a conclusion only when the candidate preserves the source-authorized modality and scope.

Example distinction:

```text
thousands appeared nationwide
  -> exam indicates broad popularity / likely competition     // source-supported defeasible inference
  -> every applicant will be admitted                         // unsupported
```

Likewise:

```text
worst rainfall in 50 years
  -> drainage may have failed                                 // modal reasonable inference
  -> drainage definitely failed                               // over-strengthened, reject
```

`STRICT_ENTAILMENT` remains the default whenever the source pattern does not authorize a defeasible bridge.

## 2. STC / Syllogism decontamination rule

Surface labels do not determine chapter ownership.

Route to `SYL-001` when the semantic core is categorical set reasoning using relations such as:

```text
ALL A ARE B
SOME A ARE B
NO A ARE B
ONLY A ARE B
ONLY A FEW A ARE B
```

and the learner solves by set inclusion/exclusion/possibility rather than narrative proposition inference.

Route to `STC-001` when the task is narrative/conditional/comparative/temporal entailment or source-authorized reasonable inference.

Required router metadata:

```text
surfaceHeading
semanticSolveFamily
reasoningOwner
routingEvidence
```

This prevents duplicated QLs for the same categorical solve mode.

## 3. ASM reasoning-section ownership

Banking ownership is now positively supported at topic/section level.

IBPS PO Prelims analysis for 11 October 2020 Shift 1 places `Assertion and Reason` inside the 35-question Logical Reasoning section and reports a 2–5 question occurrence range in that shift.

Therefore:

```text
BANKING / REASONING -> REAS-ASM ownership CONFIRMED at section level
```

However, the exact semantic content of those historical items is not available in the evidence reviewed here. Therefore the audit does **not** yet authorize a permanent ASM QL merely from the topic label.

For SSC, factual Assertion/Reason items remain ownership-sensitive because many belong to General Awareness.

Required source envelope fields remain:

```text
sourceSection
truthDomain
reasoningOwnershipConfidence
```

## 4. Punjab Statement & Argument profile

A Punjab/PPSC preparation syllabus source explicitly lists `Statement and Argument` under Reasoning for PPSC preparation.

This is sufficient to retain Punjab State in the chapter's target profile, but it is not item-level official-paper evidence.

Therefore:

```text
Punjab ARG chapter inclusion: SUPPORTED
Punjab ARG source-shape saturation: NOT COMPLETE
```

No Punjab-specific ARG QL variant is justified. The chapter should use the same semantic QLs unless later Punjab paper evidence proves a distinct format.

## 5. Advanced Cause & Effect

Target-exam evidence remains strongest for the classic pair-classification family:

```text
I causes II
II causes I
both are effects of independent causes
both are effects of a common cause
```

Broader competitive-exam official papers also demonstrate `immediate and principal cause` versus `effect but not immediate/principal cause` distinctions. This proves the distinction is a real reasoning pattern, not a generator invention.

However, V2 still does not have sufficiently direct SSC/Banking/Punjab item evidence for a target-specific permanent QL covering:

- mediated cause;
- contributing but non-principal cause;
- multi-cause decomposition.

Decision:

```text
classic pair classification -> allocation candidate
immediate/principal distinction -> discovery reserve
mediated/contributing/multi-cause -> defer permanent allocation
```

Do not overbuild CAE just because the graph engine can represent richer causal structures.

## 6. Saturation state after V2

| Chapter | V2 state | Blocking gap for merge/split review |
|---|---|---|
| STA | STRONG PARTIAL | comparison/measurement families remain source-dependent |
| STC | STRONG PARTIAL / SEMANTICALLY CLARIFIED | bridge registry must be executable-tested, but core allocation can be proposed |
| ARG | STRONG PARTIAL | Punjab item-level shape not required for generic QLs; principle/fairness family remains source-dependent |
| COA | STRONG PARTIAL | explicit sequencing/complementarity remains source-dependent |
| CAE | STRONG CORE | advanced mediated/contributing forms deferred |
| ASM | OWNERSHIP CONFIRMED FOR BANKING / PATTERN PARTIAL | exact reasoning-item semantics still insufficient for permanent QL allocation |

## 7. Gate decision

The family is now ready for **merge/split and permanent-QL proposal review**, with one important rule:

> permanent allocation may cover only source-supported semantic cores. Unsupported speculative families remain discovery reserves and do not receive QL IDs.

No Question Studio, Question Bank, test or public gate is opened by this document.
