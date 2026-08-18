# Statement-Based Logic — Design Wave Status

Status: **DESIGN WAVE COMPLETE / SELF-REVIEW REQUIRED BEFORE IMPLEMENTATION**

This status file records the coordinated pre-implementation design wave for the natural-language Family C chapters.

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

## 3. Semantic separation freeze candidate

Before implementation, the following boundaries must survive self-review:

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

Safe to share after design review:

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

## 5. Permanent QL policy

All six designs remain in discovery authority.

```text
permanentQlCount: 0 for new/unallocated designs
```

No QL count is to be invented before source saturation and merge/split review.

## 6. Downstream lifecycle

During design/discovery:

```text
Question Studio: CLOSED
Question Bank writes: CLOSED
mock/test eligibility: CLOSED
public publication: CLOSED
Hindi/Punjabi production: NOT STARTED
```

## 7. Required next gate

Before coding any chapter:

1. critical cross-design self-review;
2. source-pattern / ownership audit plan for all six;
3. normalize shared proposition IR where genuinely common;
4. verify no checkpoint is merely a presentation variant masquerading as semantics;
5. identify unsupported speculative checkpoints and mark them source-dependent;
6. freeze the family boundary document.

Only then should implementation begin, ideally one chapter at a time while shared primitives are extracted only after real reuse is proven.
