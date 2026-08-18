# Statement-Based Logic — Design Wave Status

Status: **DESIGN COMPLETE / CRITICAL SELF-REVIEW PASSED / SOURCE AUDIT V1 COMPLETE**

This status file records the coordinated pre-implementation design and source-audit wave for the natural-language Family C chapters.

Authorities:

- `STATEMENT-BASED-LOGIC-FAMILY-DESIGN.md`
- `STATEMENT-BASED-LOGIC-DESIGN-SELF-REVIEW.md`
- `STATEMENT-BASED-LOGIC-SOURCE-OWNERSHIP-AUDIT-V1.md`
- `STATEMENT-BASED-LOGIC-SOURCE-AUDIT-DESIGN-AMENDMENTS-V1.md`

## 1. Designed chapters

| Product code | Package | Design authority | Source-audit state |
|---|---|---|---|
| `REAS-STA` | `STA-001` | `topics/Statement-and-Assumption/STA-001/STA-001-END-TO-END-DESIGN.md` | STRONG PARTIAL SATURATION |
| `REAS-STC` | `STC-001` | `topics/Statement-and-Conclusion/STC-001/STC-001-END-TO-END-DESIGN.md` | STRONG PARTIAL + SEMANTIC AMENDMENT |
| `REAS-ARG` | `ARG-001` | `topics/Statement-and-Argument/ARG-001/ARG-001-END-TO-END-DESIGN.md` | PARTIAL SATURATION |
| `REAS-COA` | `COA-001` | `topics/Course-of-Action/COA-001/COA-001-END-TO-END-DESIGN.md` | STRONG PARTIAL SATURATION |
| `REAS-CAE` | `CAE-001` | `topics/Cause-and-Effect/CAE-001/CAE-001-END-TO-END-DESIGN.md` | STRONG CORE SATURATION |
| `REAS-ASM` | `ASM-001` | `topics/Assertion-and-Reason/ASM-001/ASM-001-END-TO-END-DESIGN.md` | PARTIAL + OWNERSHIP AMENDMENT |

No chapter is yet declared fully source-saturated for permanent QL allocation.

## 2. Taxonomy decision

These remain six separate chapters.

A standalone `Inference` chapter is **not** created because the current authoritative Reasoning V1 taxonomy does not define `REAS-INF`.

Source audit showed that inference behavior belongs inside `STC-001`, but STC now has source-profiled inference standards rather than one universal entailment standard.

## 3. Semantic separation — REVIEWED + SOURCE-AMENDED

```text
STA: candidate is an unstated required dependency
STC: candidate is supported under the selected source-profile standard:
     STRICT_ENTAILMENT or CONTROLLED_REASONABLE_INFERENCE
ARG: candidate is a strong reason bearing materially on the issue
COA: candidate is a suitable response, including evidence-sufficiency timing
CAE: displayed events are classified by exact causal relation
ASM: evaluate A truth, R truth, then R->A explanation, with source-section ownership
```

No implementation may replace these with one generic natural-language classifier.

## 4. Major V1 source-audit corrections

### STA

Two- and three-assumption sets are both core source-profile dimensions. Candidate count does not define QL identity.

### STC

Recent source behavior requires:

```text
STRICT_ENTAILMENT
CONTROLLED_REASONABLE_INFERENCE
```

The second mode uses curated defeasible bridges and preserved modality; unrestricted commonsense inference remains prohibited.

Formal categorical set-conclusion questions route to `SYL-001` even when their visible heading says Statement/Conclusion.

### ARG

Banking evidence supports two- and three-argument sets. Material consequence conflicts require explicit rubric evidence rather than relevance alone.

### COA

The oracle adds `EVIDENCE_SUFFICIENCY_BEFORE_INTERVENTION`; investigation may be correct when stronger remedial action is premature.

### CAE

`INDEPENDENT_CAUSES`, `EFFECTS_OF_INDEPENDENT_CAUSES`, `EFFECTS_OF_COMMON_CAUSE` and unrelated events remain semantically distinct.

### ASM

Assertion/Reason is a format as well as a reasoning task. Source-section ownership is mandatory so factual General-Awareness A/R items are not automatically counted as Reasoning. Curated stable knowledge is a first-class truth authority.

## 5. Shared infrastructure allowed

Safe to share after real reuse is demonstrated:

- proposition/entity IR;
- scope/quantifier/time types;
- polarity/negation utilities;
- structured-text renderer;
- deterministic seed utilities;
- source-profile/evidence metadata;
- localization framework;
- semantic fingerprints;
- review export infrastructure.

Must remain chapter-owned:

- answer oracle;
- misconception-to-verdict rules;
- source-pattern registry;
- difficulty calibration;
- explanation semantics;
- final QL registry.

Shared abstractions should be extracted after at least two executable chapters prove the overlap rather than by building a universal critical-reasoning engine first.

## 6. Checkpoint / QL governance

No permanent QL count has been allocated.

```text
permanentQlCount: 0 for new/unallocated designs
```

The current planned CP labels are discovery authorities only.

Multi-I/II/III, coded and negative presentation tracks do **not** automatically survive as permanent checkpoints or QLs. Source saturation must merge them when they are merely representation variants.

## 7. Downstream lifecycle

```text
Question Studio: CLOSED
Question Bank writes: CLOSED
mock/test eligibility: CLOSED
public publication: CLOSED
Hindi/Punjabi production: NOT STARTED
```

## 8. Remaining source-saturation gate

Before permanent allocation or production integration:

1. deepen current Banking and Punjab evidence for STA/STC/ARG/COA;
2. source-test STC controlled-reasonable-inference bridge families;
3. isolate all Syllogism contamination from STC source pools;
4. verify ASM section ownership before counting SSC factual A/R items;
5. find or reject advanced CAE mediated/contributing patterns;
6. complete merge/split review and permanent-QL proposal;
7. only then begin executable implementation.

Design completion and Source Audit V1 do **not** mean source saturation or production readiness.