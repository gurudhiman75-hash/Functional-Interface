# Quant V4 External Material Audit P2

Status: **AUDIT LANE — EVIDENCE ONLY — NO PRODUCTION PROMOTION AUTHORITY**

## Purpose

Uploaded books, coaching material, solved-paper PDFs and design references are now a formal Quant V4 audit input.

The purpose is not to copy source questions into production. The purpose is to test whether Examtree's package/QL/runtime architecture can generate the kinds of questions actually found in exam papers and study material.

## Registered uploaded sources

Initial source registry:

1. `30 Yearwise SSC CGL Solved Paper (English) 2022.pdf`
   - source kind: `REAL_PYQ_PDF`
   - question evidence eligible: YES
   - frequency evidence eligible: YES after normalisation/deduplication
   - direct production promotion: NO

2. `30 Yearwise SSC CGL Solved Paper (English) 2023.pdf`
   - source kind: `REAL_PYQ_PDF`
   - question evidence eligible: YES
   - frequency evidence eligible: YES after normalisation/deduplication
   - direct production promotion: NO

3. `30 Yearwise SSC CGL Solved Paper (English) 2024.pdf`
   - source kind: `REAL_PYQ_PDF`
   - question evidence eligible: YES
   - frequency evidence eligible: YES after normalisation/deduplication
   - direct production promotion: NO

4. `MENSURATION_TRIGONOMETRY_AND_SPATIAL_MATH_CHAPTER_FAMILY_DESIGN.md`
   - source kind: `DESIGN_REFERENCE`
   - question-frequency evidence: NO
   - used for package boundaries, stem/explanation standards, diagram expectations and TRG-001/TRG-002 ownership.

Additional uploaded books/PDFs may be registered later without changing the classification model.

## Question-level classification

Every relevant external question should receive one of these classifications:

### `DIRECT`
The current package already has a runtime/QL construction that materially reproduces the question archetype. Surface wording or numbers may differ.

### `VARIANT`
The governing family exists, but the observed question introduces a meaningful construction not yet demonstrated by the runtime. A controlled sibling/overlay may be appropriate.

### `MISSING_EXAM_RELEVANT`
The question is relevant to the target exams and no adequate package/QL/runtime home can be demonstrated. This is a genuine remediation candidate.

### `BOUNDARY_OTHER_PACKAGE`
The question is relevant to Examtree but belongs to another package. Example: a line-of-sight height question using `tan θ = height/distance` belongs to TRG-002 rather than TRG-001.

### `OUT_OF_SCOPE`
The material contains a question that is beyond Examtree's intended exam scope or is a reference/example rather than usable question evidence.

### `UNRESOLVED`
The mapping is not yet defensible. It must remain unresolved rather than being forced into a package.

## Coverage rate

For a target package, external-material coverage is computed only from:

- `DIRECT`
- `VARIANT`
- `MISSING_EXAM_RELEVANT`

`coverage = (DIRECT + VARIANT) / (DIRECT + VARIANT + MISSING_EXAM_RELEVANT)`

`BOUNDARY_OTHER_PACKAGE`, `OUT_OF_SCOPE` and `UNRESOLVED` are reported separately and do not silently inflate the package coverage rate.

A `VARIANT` counts as broad family coverage for the descriptive rate, but it may still create a remediation task if the production runtime cannot generate that meaningful construction.

## Evidence hierarchy

External sources have different authority:

1. Real PYQ PDFs — strongest evidence for exam realism, archetype presence and descriptive frequency.
2. Reputable exam-prep books/coaching material — strong evidence for breadth and candidate archetypes, but not automatically for frequency.
3. Design/reference documents — quality and boundary guidance only; not frequency evidence.

Duplicate appearances of the same PYQ across books or PDFs must not be double-counted.

## Trigonometry use

TRG-001 should now be audited against uploaded material question-by-question.

For each observed trigonometry question record:

- source + locator;
- target package;
- mapped QL/family when known;
- classification;
- exam relevance;
- rationale;
- whether remediation is required.

TRG-001 symbolic/core trigonometry and TRG-002 Heights & Distances must remain distinct. The external-material audit must not force a question into TRG-001 merely because the source labels the chapter broadly as “Trigonometry”.

The existing SSC CGL 2022–2024 whole-section evidence can be treated as the first real-PYQ population under this lane. Existing normalized observations do not need to be duplicated; the new registry gives them an explicit external-source provenance category.

## Remediation rule

External evidence can open a remediation candidate only when:

1. the construction is exam-relevant;
2. current authority/runtime coverage has been checked;
3. the gap is meaningful rather than cosmetic wording variation;
4. package ownership is confirmed;
5. the remediation keeps the permanent QL envelope stable where possible;
6. generated output is reviewed for exam realism, distractors, explanation quality and difficulty.

A book question must never be copied verbatim merely to close a coverage gap. The engine should learn the underlying archetype and generate independent controlled variants.

## Production/frequency boundary

This audit lane deliberately cannot authorize:

- production activation;
- Question Studio rebinding;
- public publication;
- test-builder eligibility;
- frequency-weight promotion;
- freeze/refreeze.

Those remain separate deliberate gates.

`canPromoteFromExternalMaterialAudit()` is therefore hard-coded to `false`.

## Immediate TRG-001 audit target

Before the next TRG-001 freeze decision:

1. map all already-normalized 2022–2024 CGL trigonometry observations through this classification;
2. sample additional trigonometry questions from uploaded non-PYQ/book material where available;
3. calculate the descriptive external coverage rate;
4. list every `MISSING_EXAM_RELEVANT` construction;
5. list every `BOUNDARY_OTHER_PACKAGE` construction separately;
6. remediate only defensible gaps;
7. regenerate the pre-freeze review pack after remediation.

## Execution status

The framework and regression source are committed as audit code. No test/CI execution is claimed by this document unless separately recorded.
