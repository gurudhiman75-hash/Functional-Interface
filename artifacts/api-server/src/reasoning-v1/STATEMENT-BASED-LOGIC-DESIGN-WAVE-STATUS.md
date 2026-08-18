# Statement-Based Logic — Design Wave Status

Status: **DESIGN WAVE COMPLETE / CRITICAL SELF-REVIEW PASSED**

This status file records the coordinated pre-implementation design wave for the natural-language Family C chapters.

Critical review authority:

- `STATEMENT-BASED-LOGIC-DESIGN-SELF-REVIEW.md`

## 1. Designed chapters

| Product code | Package | Design authority | State |
|---|---|---|---|
| `REAS-STA` | `STA-001` | `topics/Statement-and-Assumption/STA-001/STA-001-END-TO-END-DESIGN.md` | DESIGNED |
| `REAS-STC` | `STC-001` | `topics/Statement-and-Conclusion/STC-001/STC-001-END-TO-END-DESIGN.md` | DESIGNED |
| `REAS-ARG` | `ARG-001` | `topics/Statement-and-Argument/ARG-001/ARG-001-END-TO-END-DESIGN.md` | DESIGNED |
| `REAS-COA` | `COA-001` | `topics/Course-of-Action/COA-001/COA-001-END-TO-END-DESIGN.md` | DESIGNED |
| `REAS-CAE` | `CAE-001` | `topics/Cause-and-Effect/CAE-001/CAE-001-END-TO-END-DESIGN.md` | DESIGNED |
| `REAS-ASM` | `ASM-001` | `topics/Assertion-and-Reason/ASM-001/ASM-001-END-TO-END-DESIGN.md` | DESIGNED |

Shared authority:

- `STATEMENT-BASED-LOGIC-FAMILY-DESIGN.md`

## 2. Taxonomy decision

These remain six separate chapters.

A standalone `Inference` chapter is **not** created because the current authoritative Reasoning V1 taxonomy does not define `REAS-INF`.

Source-backed inference questions are provisionally represented inside `STC-001` when the task is entailment from supplied information. A future split requires evidence of a materially different solving contract.

## 3. Semantic separation — REVIEWED

```text
STA: candidate must be an unstated required dependency
STC: candidate must be entailed by explicit supplied evidence
ARG: candidate must be a strong reason bearing on the issue
COA: candidate must be a suitable response to the problem
CAE: displayed events must be classified by causal relation
ASM: evaluate A truth, R truth, then R->A explanation
```

No implementation may replace these with one generic natural-language classifier.

## 4. Shared infrastructure allowed

Safe to share after real reuse is demonstrated:

- proposition/entity IR;
- scope/quantifier/time types;
- polarity/negation utilities;
- structured-text renderer;
- deterministic seed utilities;
- source-evidence metadata;
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

## 5. Checkpoint / QL governance

No permanent QL count has been allocated.

```text
permanentQlCount: 0 for new/unallocated designs
```

The current planned CP labels are discovery authorities only.

In particular, multi-I/II/III, coded and negative presentation tracks such as current `*-CP-006` labels do **not** automatically survive as permanent checkpoints or QLs. Source saturation must merge them when they are merely representation variants.

## 6. Downstream lifecycle

During design/discovery:

```text
Question Studio: CLOSED
Question Bank writes: CLOSED
mock/test eligibility: CLOSED
public publication: CLOSED
Hindi/Punjabi production: NOT STARTED
```

## 7. Next program gate

The design wave itself is complete. Before permanent allocation or production integration:

1. plan source-pattern and ownership audits for all six chapters;
2. run executable discovery one chapter at a time;
3. normalize shared proposition IR only where real runtime overlap is proven;
4. merge or reject speculative checkpoint/format branches during source saturation;
5. allocate permanent QLs only after no-known-gap review;
6. complete English and Hindi/Punjabi freezes before Question Studio exposure.

Design completion does **not** mean source saturation or production readiness.
