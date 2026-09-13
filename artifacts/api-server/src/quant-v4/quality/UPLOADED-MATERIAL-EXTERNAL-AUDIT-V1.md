# Quant V4 Uploaded-Material External Audit V1

Status: **ACTIVE AUDIT AUTHORITY — EVIDENCE ONLY — NO PRODUCTION PROMOTION**

## Purpose

Use uploaded books, PDFs, solved papers and coaching material as a standing external challenge corpus for Quant V4.

The corpus is not a source of automatic production content. Its job is to answer:

1. Can the current package generate the recurring forms found in real exams and standard preparation books?
2. Is the current QL technically capable but too narrow in construction?
3. Is an observed form genuinely missing?
4. Does the question belong to another package?
5. Does a book contain material that is outside Examtree's intended SSC/Banking scope?

## Coverage classes

Every sampled external question must be classified as exactly one of:

- `DIRECTLY_COVERED` — an active/candidate QL can produce the same material archetype with meaningful parameter/stem variation.
- `COVERED_WITH_VARIATION` — the underlying mathematics exists, but a new construction/sibling/stem surface is needed to match the external form naturally.
- `MISSING` — no demonstrated runtime/authority home for a materially recurring and in-scope exam archetype.
- `OUT_OF_SCOPE` — valid mathematics, but not appropriate for the target exam/package or owned by another package.

## Required review record

For every audited external item record:

- source ID;
- source question/page reference;
- normalized archetype;
- owning package;
- coverage class;
- mapped QL IDs, if any;
- exam/source tier;
- defect type if not direct;
- remediation decision;
- whether the evidence is one-off or recurring.

## Source priority

Use evidence in this order when resolving conflicts:

1. real SSC/Banking/Punjab exam papers;
2. SSC-specific books/guides;
3. general competitive aptitude books;
4. CAT/advanced/other reference material.

A difficult book question must not be added merely because it exists. It must be target-exam relevant or represent a useful controlled sibling of an in-scope archetype.

## Ownership rule

External material must respect package boundaries.

For trigonometry:

- `TRG-001` owns ratios, identities, standard values, exact evaluation, cofunction/reduction, algebraic trig relations, compound/double-angle work and controlled non-height applications.
- `TRG-002` owns line-of-sight, angle of elevation/depression, tower/shadow/ladder/kite/cloud/lighthouse and other Heights & Distances constructions whose decisive relation is vertical height versus horizontal distance.

A source chapter may mix both; the audit must split them before assessing coverage.

## Sampling protocol

For each chapter/package audit:

1. inspect all uploaded sources whose title/content matches the topic;
2. sample broadly across the source rather than only the first exercise page;
3. deduplicate mathematically identical forms;
4. preserve rare forms only if they are exam-relevant;
5. challenge the current runtime with at least one representative item per normalized archetype;
6. record missing/variation forms separately from frequency evidence;
7. do not alter production weights or activation from book evidence alone.

Recommended minimum for a mature package:

- 50 external items across at least two independent sources, or
- full archetype exhaustion if the available source chapter is smaller.

## Registered initial sources

### DISHA-SSC-MATH-TRIG

Disha SSC Mathematics Guide in English — **Trigonometry and Its Applications**.

Use as a high-priority SSC-book challenge corpus for both TRG-001 and TRG-002. The inspected exercise includes standard ratios, exact values, reciprocal/identity expressions, sec/tan forms, cofunction and angle equations, products, extrema, algebraic relation questions, right-triangle applications and many explicit SSC-tagged items.

### RS-AGGARWAL-HEIGHTS-DISTANCES

R.S. Aggarwal Quantitative Aptitude — **Heights and Distances**.

Use as a TRG-002 challenge corpus. The inspected exercise contains tower distance, ladder, observer-height correction, two-observer/two-ship geometry, moving observer/boat/car, complementary elevation angles, cloud/reflection and exam-tagged SSC/RRB/Bank items.

### SSC-CGL-YEARWISE-2022 / 2023 / 2024

Uploaded yearwise solved papers remain the highest-priority real-exam evidence source and should continue to drive external exam-realness/frequency validation.

## Governance

This audit layer can justify:

- opening a coverage defect;
- adding a candidate sibling construction;
- correcting package ownership;
- strengthening distractors/stems/explanations;
- changing audit priority.

It cannot by itself authorize:

- Question Studio activation;
- public publication;
- QL deletion;
- permanent frequency weights;
- multilingual freeze;
- production promotion.

Human review and normal package freeze/rebind gates still apply.
