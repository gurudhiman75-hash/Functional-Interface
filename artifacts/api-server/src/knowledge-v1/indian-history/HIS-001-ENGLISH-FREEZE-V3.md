# HIS-001 Indian History — English Freeze V3

Status: **ENGLISH REVIEW FREEZE — CORRECTIVE V3 AUDIT GREEN**  
Lifecycle: **REVIEW_ONLY**  
Runtime registration: **DISABLED**

## Frozen authority

- Chapter: `HIS-001` Indian History
- Scope: `HIS-CP-001` through `HIS-CP-024`
- Corrected English content authority before freeze-document promotion: commit `4bde654c5978c6ad08b3b17197a25cecb61e7a9e`
- Questions: **1,434**
- Canonical facts: **1,379**
- World History: **outside this freeze**

V3 supersedes `HIS-001-ENGLISH-FREEZE-V2` as the semantic authority for new History localization work.

## V2 → V3 correction

A post-freeze review found that `HIS-CP-017` contextual explanation notes were indexed by an older question order. The defect affected explanatory context only.

The following remained unchanged:

- question stems;
- options and option order;
- canonical answers;
- correct-option indices;
- CP and QL identities;
- difficulty;
- source IDs and canonical fact IDs;
- question count and chapter coverage.

V3 corrects the CP017 English explanations and makes the binding structurally safe.

## Structural remediation

CP017 contextual explanation notes are now keyed by the exact ordered source-fact-ID combination used by the question rather than by numeric question position.

The dedicated CP017 audit now blocks:

- missing explanation-note bindings;
- explanation-key reuse across different CP017 questions;
- orphaned explanation notes left behind by spec changes.

The chapter-wide V2 expansion audit also consumes the dedicated CP017 integrity result, so future chapter freezes cannot pass if this binding drifts.

## Qualification evidence

The corrected authority passed:

- HIS-CP-017 qualification gate: **PASS**
- HIS-001 V2 expansion qualification gate: **PASS**
- V2 supplemental questions: **480 / 480**
- V2 supplemental canonical facts represented: **480 / 480**
- full English chapter: **1,434 questions / 1,379 canonical facts**
- API server build: **PASS**
- Render production build: **PASS**
- branch-topology guard: **PASS**

## Binding localization rule

New Hindi and Punjabi localization for CP017–CP024 must use `HIS-001-ENGLISH-FREEZE-V3` as semantic authority and preserve:

- chapter and CP identity;
- QL identity;
- difficulty;
- source provenance and canonical fact IDs;
- option count and option order;
- correct option index;
- answer semantics;
- review-only lifecycle.

Existing CP001–CP016 learner text does not require rewriting because this corrective freeze changes only CP017 English explanation context.

Runtime registration remains disabled until CP017–CP024 multilingual localization and final parity review are explicitly approved.
